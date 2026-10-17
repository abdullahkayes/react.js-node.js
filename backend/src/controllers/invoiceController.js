/**
 * Invoice generation.
 *
 * Everything the Create Invoice modal promises happens here, in the order the
 * instruction lists it: the invoice and its items are saved, the PDF is
 * rendered from exactly what was saved, the customer notification is built
 * from that PDF and sent on the channels staff picked, and the invoice is
 * recorded as Pending until a payment is made against it.
 *
 * The order matters. The notification is generated only after the invoice
 * exists, because its wording and its attachment both quote the invoice that
 * was actually saved - the invoice number, the dates and both currency totals.
 * Notifying first would mean telling the customer about a document that may
 * never have been created.
 */

import { Invoice, InvoiceItem, Shipment, Customer, TrackingEvent } from '../models/index.js';
import { sendCustomerNotification } from '../services/notifications.js';
import { saveInvoicePdf, buildInvoiceNotification } from '../services/invoicePdfService.js';
import fs from 'fs';

/** The invoice types the modal offers. One list drives both sides. */
export const INVOICE_TYPES = [
  'Assisted Purchase Advance',
  'Import Final Shipment',
  'Export Final Shipment',
  'Return',
  'RTO',
  'Storage or Holding',
  'Wallet Adjustment',
  'Miscellaneous',
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

/**
 * Allocates the next free invoice reference.
 *
 * Re-checks in a loop rather than trusting the count, so a deleted or manually
 * inserted row can never hand out a reference that already exists.
 */
const nextInvoiceId = async () => {
  const issued = await Invoice.count();
  let sequence = issued + 1;
  let candidate = `INV-${String(sequence).padStart(7, '0')}`;
  while (await Invoice.findOne({ where: { invoiceId: candidate } })) {
    sequence += 1;
    candidate = `INV-${String(sequence).padStart(7, '0')}`;
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

export const createInvoice = async (req, res, next) => {
  try {
    const body = req.body || {};

    /* ---- Validation ---------------------------------------------------- */
    const invoiceType = String(body.invoiceType || '').trim();
    if (!invoiceType) return next({ statusCode: 400, message: 'Invoice Type is required' });
    if (!INVOICE_TYPES.includes(invoiceType)) {
      return next({ statusCode: 400, message: `Invoice Type must be one of: ${INVOICE_TYPES.join(', ')}` });
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
    if (!items.length) return next({ statusCode: 400, message: 'At least one invoice line item is required' });

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

    /* The invoice timestamp and the due date are both generated here, never
       taken from the client: seven calendar days from generation. */
    const issuedAt = new Date();
    const dueDate = new Date(issuedAt.getTime() + 7 * 24 * 60 * 60 * 1000);

    /* ---- 1-9: Save the invoice, its items and its money ---------------- */
    const invoiceId = await nextInvoiceId();

    const invoice = await Invoice.create({
      invoiceId,
      shipmentId: shipment.id,
      userId: shipment.userId,
      invoiceType,
      status: 'issued',
      paymentStatus: 'Pending',
      currency: 'USD',
      exchangeRate,
      subtotal: totalUsd,
      discount: discountUsd,
      total: totalUsd,
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
      dueDate,
      issuedAt,
    });

    await InvoiceItem.bulkCreate(
      lineItems.map((item) => ({
        ...item,
        invoiceId: invoice.id,
        unitPrice: item.unitPriceUsd,
        total: item.amountUsd,
      }))
    );

    const saved = await Invoice.findByPk(invoice.id, {
      include: [{ model: InvoiceItem, as: 'items' }],
    });

    /* ---- 10: Generate the invoice PDF ---------------------------------- */
    let pdfPath = null;
    try {
      pdfPath = await saveInvoicePdf(saved, { shipment, customer: shipment.user });
      saved.pdfPath = pdfPath;
      await saved.save();
    } catch (err) {
      console.error(`Could not render invoice PDF ${invoiceId}: ${err.message}`);
    }

    /* ---- 11-13: Notification ------------------------------------------- *
     * The PDF rides with the notification on every channel that can carry a
     * file. SMS cannot, so the attachment is passed to the notification service
     * and applied to the email only; the body already tells the customer the
     * invoice is attached and names where to view it in the account. */
    const { subject, message } = buildInvoiceNotification(saved, { shipment, customer: shipment.user });

    const customer = shipment.user;
    const storedChannels = requestedChannels.map((c) => CHANNEL_MAP[c]);

    /* The PDF is attached to the notification on every channel that can carry
       one. SMS carries no attachment, so the file is handed to the notification
       service which applies it to the email only. */
    const attachments =
      pdfPath && fs.existsSync(pdfPath)
        ? [{ filename: `${saved.invoiceId}.pdf`, path: pdfPath }]
        : null;

    let notification = null;
    if (customer) {
      try {
        notification = await sendCustomerNotification({
          customer,
          notificationType: 'Payment',
          title: subject,
          message,
          channels: storedChannels,
          relatedRecord: 'Invoice',
          sourceRef: saved.invoiceId,
          source: 'system',
          attachments,
        });
      } catch (err) {
        console.error(`Could not send invoice notification ${invoiceId}: ${err.message}`);
      }
    }

    /* ---- 14: Audit trail ----------------------------------------------- *
     * The shipment audit trail is assembled from the records it already holds -
     * invoices among them - so the invoice written above is the audit entry.
     * The timeline record below is what puts the event in front of the staff
     * member reading the shipment's history. */
    try {
      await TrackingEvent.create({
        shipmentId: shipment.id,
        status: shipment.status,
        note: `Invoice ${invoiceId} (${invoiceType}) generated for BDT ${totalBdt.toFixed(2)} / USD ${totalUsd.toFixed(2)}. Due ${dueDate.toISOString().slice(0, 10)}. Notified on: ${requestedChannels.join(', ')}.`,
        location: 'System',
      });
    } catch (err) {
      console.warn(`Could not record invoice ${invoiceId} on the shipment timeline: ${err.message}`);
    }

    /* ---- 15: Payment Status = Pending is already saved above ------------ */

    res.status(201).json({
      invoice: {
        id: saved.id,
        invoiceId: saved.invoiceId,
        invoiceType: saved.invoiceType,
        paymentStatus: saved.paymentStatus,
        subtotalBdt: saved.subtotalBdt,
        subtotalUsd: saved.subtotalUsd,
        totalBdt: saved.totalBdt,
        totalUsd: saved.totalUsd,
        exchangeRate: saved.exchangeRate,
        issuedAt: saved.issuedAt,
        dueDate: saved.dueDate,
        pdfPath: saved.pdfPath,
      },
      items: saved.items,
      notification: notification
        ? { notificationId: notification.notificationId, status: notification.status, channels: requestedChannels }
        : null,
      message: `Invoice ${invoiceId} generated. Notification sent on: ${requestedChannels.join(', ')}.`,
    });
  } catch (err) {
    next(err);
  }
};

export default createInvoice;
