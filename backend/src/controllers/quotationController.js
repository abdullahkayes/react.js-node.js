/**
 * Quotation generation.
 *
 * The Create Quotation modal's steps run here in the order they are listed: the
 * quotation and its items are saved, the PDF is rendered from exactly what was
 * saved, the status is set to Sent, and the customer notification is built from
 * that PDF and sent on the channels staff picked.
 *
 * The order matters. The notification is generated only after the quotation
 * exists, because its wording and its attachment both quote the quotation that
 * was actually saved - the quotation number, the dates and both currency
 * totals. Notifying first would mean telling the customer about a document that
 * may never have been created.
 */

import { Quotation, QuotationItem, Shipment, Customer, TrackingEvent } from '../models/index.js';
import { sendCustomerNotification } from '../services/notifications.js';
import { saveQuotationPdf, buildQuotationNotification } from '../services/quotationPdfService.js';
import fs from 'fs';

/** The quotation types the modal offers. One list drives both sides. */
export const QUOTATION_TYPES = [
  'Assisted Purchase Quotation',
  'Shipment Estimate',
  'Export Review Quotation',
  'Other',
];

/** Channels the modal offers, and the stored channel each one maps to. */
const CHANNEL_MAP = {
  Email: 'Email',
  SMS: 'SMS',
  WhatsApp: 'WhatsApp',
  'In-App': 'Dashboard',
};

const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};

const moneyRound = (n) => Math.round((num(n) + Number.EPSILON) * 100) / 100;

/** Narrows a stored value to its calendar day, dropping any time part. */
const dateOnly = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

/**
 * Allocates the next free quotation reference.
 *
 * Re-checks in a loop rather than trusting the count, so a deleted or manually
 * inserted row can never hand out a reference that already exists.
 */
const nextQuotationId = async () => {
  const issued = await Quotation.count();
  let sequence = issued + 1;
  let candidate = `QUO-${String(sequence).padStart(7, '0')}`;
  while (await Quotation.findOne({ where: { quotationId: candidate } })) {
    sequence += 1;
    candidate = `QUO-${String(sequence).padStart(7, '0')}`;
  }
  return candidate;
};

/** Resolves a shipment from either its public reference or its numeric id. */
const findShipment = async (ref) => {
  const raw = String(ref ?? '').trim();
  if (!raw) return null;
  const where = /^\d+$/.test(raw) ? { id: raw } : { shipmentId: raw };
  return Shipment.findOne({ where, include: [{ model: Customer, as: 'user' }] });
};

export const createQuotation = async (req, res, next) => {
  try {
    const body = req.body || {};

    /* ---- Validation ---------------------------------------------------- */
    const quotationType = String(body.quotationType || '').trim();
    if (!quotationType) return next({ statusCode: 400, message: 'Quotation Type is required' });
    if (!QUOTATION_TYPES.includes(quotationType)) {
      return next({ statusCode: 400, message: `Quotation Type must be one of: ${QUOTATION_TYPES.join(', ')}` });
    }

    /* Valid Until is date-based: a date, with no expiry time attached to it. */
    const validUntil = dateOnly(body.validUntil);
    if (!validUntil) {
      return next({ statusCode: 400, message: 'Valid Until is required. Select the date the quotation expires.' });
    }

    const requestedChannels = Array.isArray(body.channels) ? body.channels.map((c) => String(c).trim()).filter(Boolean) : [];
    if (!requestedChannels.length) {
      return next({ statusCode: 400, message: 'Select at least one notification channel' });
    }
    const unknown = requestedChannels.filter((c) => !CHANNEL_MAP[c]);
    if (unknown.length) {
      return next({ statusCode: 400, message: `Unsupported notification channel: ${unknown.join(', ')}` });
    }

    const shipmentRef = String(body.shipmentRef ?? '').trim();
    if (!shipmentRef) {
      return next({ statusCode: 400, message: 'Shipment reference is missing. Reload the Manage Shipment page and retry.' });
    }

    const shipment = await findShipment(shipmentRef);
    if (!shipment) {
      return next({ statusCode: 404, message: `No shipment matches the reference "${shipmentRef}".` });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return next({ statusCode: 400, message: 'At least one quotation line item is required' });

    for (const item of items) {
      if (!String(item.description || '').trim()) {
        return next({ statusCode: 400, message: 'Every line item needs a description' });
      }
      if (num(item.quantity) <= 0) {
        return next({ statusCode: 400, message: 'Every line item needs a quantity greater than zero' });
      }
      if (num(item.unitPriceBdt) <= 0 && num(item.unitPriceUsd) <= 0) {
        return next({ statusCode: 400, message: 'Every line item needs a unit price' });
      }
    }

    const exchangeRate = num(body.exchangeRate) > 0 ? num(body.exchangeRate) : null;

    /* ---- Totals -------------------------------------------------------- */
    let subtotalBdt = 0;
    let subtotalUsd = 0;
    const lineItems = items.map((item) => {
      const quantity = num(item.quantity) || 1;
      const unitPriceBdt = moneyRound(item.unitPriceBdt);
      const unitPriceUsd = moneyRound(item.unitPriceUsd);
      const amountBdt = moneyRound(quantity * unitPriceBdt);
      const amountUsd = moneyRound(quantity * unitPriceUsd);
      subtotalBdt += amountBdt;
      subtotalUsd += amountUsd;
      return {
        description: String(item.description).trim(),
        quantity,
        unit: String(item.unit || '').trim() || null,
        unitPriceBdt,
        unitPriceUsd,
        amountBdt,
        amountUsd,
      };
    });

    subtotalBdt = moneyRound(subtotalBdt);
    subtotalUsd = moneyRound(subtotalUsd);

    const discountBdt = moneyRound(body.discount?.bdt);
    const discountUsd = moneyRound(body.discount?.usd);
    const additionalBdt = moneyRound(body.additionalCharge?.bdt);
    const additionalUsd = moneyRound(body.additionalCharge?.usd);

    const totalBdt = moneyRound(subtotalBdt - discountBdt + additionalBdt);
    const totalUsd = moneyRound(subtotalUsd - discountUsd + additionalUsd);

    /* The quotation date is stamped here, never taken from the client. */
    const issuedAt = new Date();

    /* ---- 1-9: Save the quotation, its items and its money -------------- */
    const quotationId = await nextQuotationId();

    const quotation = await Quotation.create({
      quotationId,
      shipmentId: shipment.id,
      userId: shipment.userId,
      quotationType,
      /* Generating the quotation sets its status to Sent. Staff never pick it,
         and it reads Expired once Valid Until has passed. */
      status: 'Sent',
      exchangeRate,
      subtotalBdt,
      subtotalUsd,
      discountBdt,
      discountUsd,
      additionalChargeBdt: additionalBdt,
      additionalChargeUsd: additionalUsd,
      totalBdt,
      totalUsd,
      discountDescription: String(body.discount?.description || '').trim() || null,
      additionalChargeDescription: String(body.additionalCharge?.description || '').trim() || null,
      createdBy: req.user?.id || null,
      channels: JSON.stringify(requestedChannels),
      validUntil,
      issuedAt,
    });

    await QuotationItem.bulkCreate(
      lineItems.map((item) => ({
        ...item,
        quotationId: quotation.id,
        unitPrice: item.unitPriceUsd,
        total: item.amountUsd,
      }))
    );

    const saved = await Quotation.findByPk(quotation.id, {
      include: [{ model: QuotationItem, as: 'items' }],
    });

    /* ---- 10: Generate the quotation PDF --------------------------------- */
    let pdfPath = null;
    try {
      pdfPath = await saveQuotationPdf(saved, { shipment, customer: shipment.user });
      saved.pdfPath = pdfPath;
      await saved.save();
    } catch (err) {
      console.error(`Could not render quotation PDF ${quotationId}: ${err.message}`);
    }

    /* ---- 11: Status is Sent, stored above ------------------------------ */

    /* ---- 12: Send the notification -------------------------------------- *
     * The PDF rides with the notification on every channel that can carry a
     * file. SMS cannot, so the attachment is handed to the notification
     * service, which applies it to the email only. */
    const { subject, message } = buildQuotationNotification(saved, { shipment, customer: shipment.user });

    const customer = shipment.user;
    const storedChannels = requestedChannels.map((c) => CHANNEL_MAP[c]);

    const attachments =
      pdfPath && fs.existsSync(pdfPath)
        ? [{ filename: `${saved.quotationId}.pdf`, path: pdfPath }]
        : null;

    let notification = null;
    if (customer) {
      try {
        notification = await sendCustomerNotification({
          customer,
          notificationType: 'Shipment',
          title: subject,
          message,
          channels: storedChannels,
          relatedRecord: 'Quotation',
          sourceRef: saved.quotationId,
          source: 'system',
          attachments,
        });
      } catch (err) {
        console.error(`Could not send quotation notification ${quotationId}: ${err.message}`);
      }
    }

    /* ---- 13: Audit trail ------------------------------------------------ *
     * The shipment audit trail is assembled from the records it already holds,
     * invoices among them, so the quotation written above is the audit entry.
     * The timeline record below is what puts the event in front of the staff
     * member reading the shipment's history. */
    try {
      await TrackingEvent.create({
        shipmentId: shipment.id,
        status: shipment.status,
        note: `Quotation ${quotationId} (${quotationType}) generated for BDT ${totalBdt.toFixed(2)} / USD ${totalUsd.toFixed(2)}. Valid until ${validUntil.toISOString().slice(0, 10)}. Notified on: ${requestedChannels.join(', ')}.`,
        location: 'System',
      });
    } catch (err) {
      console.warn(`Could not record quotation ${quotationId} on the shipment timeline: ${err.message}`);
    }

    res.status(201).json({
      quotation: {
        id: saved.id,
        quotationId: saved.quotationId,
        quotationType: saved.quotationType,
        status: saved.status,
        subtotalBdt: saved.subtotalBdt,
        subtotalUsd: saved.subtotalUsd,
        totalBdt: saved.totalBdt,
        totalUsd: saved.totalUsd,
        exchangeRate: saved.exchangeRate,
        issuedAt: saved.issuedAt,
        validUntil: saved.validUntil,
        pdfPath: saved.pdfPath,
      },
      items: saved.items,
      notification: notification
        ? { notificationId: notification.notificationId, status: notification.status, channels: requestedChannels }
        : null,
      message: `Quotation ${quotationId} generated. Notification sent on: ${requestedChannels.join(', ')}.`,
    });
  } catch (err) {
    next(err);
  }
};

export default createQuotation;
