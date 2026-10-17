/**
 * Payment recording.
 *
 * Staff record a customer payment from the Record Payment modal on the Payments
 * tab. The workflow is the same shape as the invoice one, and for the same
 * reason: the payment is saved first, because both the notification and the
 * audit entry that follows quote a payment that actually exists. Telling a
 * customer their payment had been received before it was written would be
 * telling them about something that may never have been stored.
 *
 * Every payment settles exactly one invoice, in full: the amount is the
 * invoice total and nothing else, so the invoice moves to Completed the
 * moment its payment is recorded and is never offered again. The link
 * is what the Payments tab reads to show the Due Date and the Linked
 * Invoice section, so it is written with the payment rather than left
 * for a later edit. A proof document, when staff upload one, is stored
 * against the payment it belongs to.
 */

import { Invoice, Shipment, Customer, TrackingEvent, Payment, Document } from '../models/index.js';
import { sendCustomerNotification } from '../services/notifications.js';

/** The payment methods the modal offers, and the slug each stores. */
export const PAYMENT_METHODS = {
  'bKash': 'bkash',
  'Nagad': 'nagad',
  'Bank Transfer': 'bank_transfer',
  'Card': 'card',
  'Wallet': 'wallet',
  'Other': 'other',
};

/** The payment purposes the modal offers. Stored as the invoice type is. */
export const PAYMENT_PURPOSES = [
  'Shipment Invoice',
  'Wallet Top-up',
  'Refund Payout',
  'Other',
];

/* An invoice accepts a payment while its settlement is still open. A
   Completed invoice is settled, a Refunded or Partially Refunded one
   has had its money returned, and one Under Review is being worked on -
   none of those may take another payment. A Failed attempt never
   collected anything, so the invoice is offered again. The modal and
   this endpoint share the rule, so staff are never offered an invoice
   the recording step would refuse. */
const ELIGIBLE_INVOICE_STATUSES = ['pending', 'reversed', 'failed'];

const titleCase = (value) => String(value || '').replace(/\b\w/g, (c) => c.toUpperCase());

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

const digitsOnly = (v) => String(v ?? '').replace(/\D/g, '');

/** Resolves a shipment from either its public reference or its numeric id. */
const findShipment = async (ref) => {
  const raw = String(ref ?? '').trim();
  if (!raw) return null;
  const where = /^\d+$/.test(raw) ? { id: raw } : { shipmentId: raw };
  return Shipment.findOne({ where, include: [{ model: Customer, as: 'user' }] });
};

/** The readable form of a staff id, the way the Payments tab addresses one. */
const staffRef = (id) => (id ? `STF-${String(id).padStart(6, '0')}` : null);

export const recordPayment = async (req, res, next) => {
  try {
    const body = req.body || {};

    /* ---- Validation ---------------------------------------------------- */

    const shipmentRef = String(body.shipmentRef ?? '').trim();
    if (!shipmentRef) {
      return next({ statusCode: 400, message: 'Shipment reference is missing. Reload the Manage Shipment page and retry.' });
    }

    const shipment = await findShipment(shipmentRef);
    if (!shipment) {
      return next({ statusCode: 404, message: `No shipment matches the reference "${shipmentRef}".` });
    }

    /* The invoice. Every payment settles one, and it must belong to the
       shipment being paid: a payment raised against another shipment's invoice
       would move this shipment's Outstanding by money it is not owed. */
    const invoiceRowId = digitsOnly(body.invoiceId);
    if (!invoiceRowId) {
      return next({ statusCode: 400, message: 'Select the invoice this payment settles.' });
    }

    const invoice = await Invoice.findOne({
      where: { id: invoiceRowId, shipmentId: shipment.id },
    });
    if (!invoice) {
      return next({ statusCode: 404, message: 'That invoice is not linked to this shipment.' });
    }

    /* The invoice must still be open to payment. A Completed invoice is
       already settled, a Refunded or Partially Refunded one has had its
       money returned, and one Under Review is being worked on: recording
       against any of them would collect money the invoice is not owed. */
    const invoiceStatus = String(invoice.paymentStatus || '').trim().toLowerCase();
    if (!ELIGIBLE_INVOICE_STATUSES.includes(invoiceStatus)) {
      return next({
        statusCode: 409,
        message: `Invoice ${invoice.invoiceId} is ${titleCase(invoice.paymentStatus)} and cannot take a payment. Only Pending, Reversed or Failed invoices can be paid.`,
      });
    }

    /* A payment recorded here settles the invoice in full, so the amount
       is the invoice total and nothing else. It is filled from the
       invoice on the modal and cannot be edited there; the equality is
       still enforced here, because a payment that does not cover the
       total would leave the invoice reading as settled while money is
       still outstanding. */
    const amount = moneyRound(body.amount);
    const invoiceTotal = moneyRound(invoice.total);
    if (amount <= 0) {
      return next({ statusCode: 400, message: 'Payment Amount must be greater than zero.' });
    }
    if (amount !== invoiceTotal) {
      return next({
        statusCode: 400,
        message: `Payment Amount must equal the Invoice Total of ${invoice.currency || 'USD'} ${invoiceTotal.toFixed(2)}.`,
      });
    }

    const methodLabel = String(body.method || '').trim();
    if (!PAYMENT_METHODS[methodLabel]) {
      return next({ statusCode: 400, message: `Payment Method must be one of: ${Object.keys(PAYMENT_METHODS).join(', ')}` });
    }

    const purpose = String(body.purpose || '').trim();
    if (!PAYMENT_PURPOSES.includes(purpose)) {
      return next({ statusCode: 400, message: `Payment Purpose must be one of: ${PAYMENT_PURPOSES.join(', ')}` });
    }

    /* Payment date and time. Staff type the date the money actually arrived,
       because a payment recorded today may have been received days earlier;
       an absent or unreadable value falls back to now rather than being
       invented as an arbitrary date. */
    let paidAt = new Date();
    const rawDate = String(body.paidAt || '').trim();
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) paidAt = parsed;
    }

    const channels = Array.isArray(body.channels)
      ? body.channels.map((c) => String(c).trim()).filter(Boolean)
      : [];
    const unknownChannels = channels.filter((c) => !CHANNEL_MAP[c]);
    if (unknownChannels.length) {
      return next({ statusCode: 400, message: `Unsupported notification channel: ${unknownChannels.join(', ')}` });
    }

    const staffId = req.user?.id || null;

    /* ---- 1: Save the payment ------------------------------------------- */

    const payment = await Payment.create({
      shipmentId: shipment.id,
      invoiceId: invoice.id,
      provider: PAYMENT_METHODS[methodLabel],
      providerRef: String(body.transactionRef || '').trim() || null,
      amount,
      currency: invoice.currency || 'USD',
      status: 'completed',
      paidAt,
      // The staff account that recorded the payment, for the audit trail.
      createdBy: staffId,
      notes: [
        purpose,
        String(body.note || '').trim() || null,
        staffRef(staffId) ? `Recorded by ${staffRef(staffId)}` : null,
      ].filter(Boolean).join(' — ') || null,
    });

    const paymentRef = `PAY-${String(payment.id).padStart(7, '0')}`;

    /* ---- 2: The supporting document, when one was uploaded ------------ *
     * The proof rides with the payment rather than the shipment alone: it
     * is keyed to the payment reference in relatedRecord, so the payment
     * record and its evidence are found together. Verification is always
     * Pending - whoever uploads a file cannot also have decided it is
     * acceptable. */
    let proofDocument = null;
    if (req.file && req.file.path) {
      proofDocument = await Document.create({
        shipmentId: shipment.id,
        shipmentItemId: null,
        uploadedBy: staffId,
        userId: shipment.userId || (shipment.user && shipment.user.id) || null,
        documentType: 'receipt',
        fileName: req.file.originalname || req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size || null,
        mimeType: req.file.mimetype || null,
        description: `Payment proof for ${paymentRef} against invoice ${invoice.invoiceId}.`,
        relatedRecord: paymentRef,
        relatedRecordType: 'Payment',
        verificationStatus: 'Pending',
      });
    }

    /* ---- 3: The invoice is settled ------------------------------------- *
     * The payment covers the invoice total in full - the amount and the
     * total are validated equal above - so the invoice moves to
     * Completed and is no longer offered to the Record Payment modal. */
    invoice.paymentStatus = 'Completed';
    invoice.paidAt = paidAt;
    await invoice.save();

    const saved = await Payment.findByPk(payment.id, {
      include: [{ model: Invoice, as: 'invoice' }],
    });

    /* ---- 4: Notify the customer ---------------------------------------- */

    const requestedChannels = channels.map((c) => CHANNEL_MAP[c]);
    const customer = shipment.user;

    const subject = `Payment Received – ${invoice.invoiceId} – ${shipment.shipmentId}`;
    const message = [
      `Dear ${customer?.name || 'Customer'},`,
      '',
      'We have received your payment. Thank you.',
      '',
      `Shipment ID: ${shipment.shipmentId}`,
      `Invoice ID: ${invoice.invoiceId}`,
      `Invoice Type: ${invoice.invoiceType || 'Invoice'}`,
      `Payment Amount: ${invoice.currency || 'USD'} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Payment Method: ${methodLabel}`,
      `Payment Date: ${paidAt.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
      '',
      'This invoice is now settled in full.',
      '',
      'Regards,',
      'Dazzling Shipping',
    ].join('\n');

    let notification = null;
    if (customer && requestedChannels.length) {
      try {
        notification = await sendCustomerNotification({
          customer,
          notificationType: 'Payment',
          title: subject,
          message,
          channels: requestedChannels,
          relatedRecord: 'Payment',
          sourceRef: `PAY-${String(payment.id).padStart(7, '0')}`,
          source: 'staff',
          createdBy: staffId,
          html: null,
        });
      } catch (err) {
        console.error(`Could not send payment notification for ${invoice.invoiceId}: ${err.message}`);
      }
    }

    /* ---- 5: Audit trail ------------------------------------------------ *
     * The shipment audit trail is assembled from the records it already holds -
     * payments and documents among them - so the rows written above are the
     * audit entries. The timeline record below is what puts the event in front
     * of the staff member reading the shipment's history. */
    try {
      await TrackingEvent.create({
        shipmentId: shipment.id,
        status: shipment.status,
        note: `Payment of ${invoice.currency || 'USD'} ${Number(amount).toFixed(2)} recorded against invoice ${invoice.invoiceId} (${purpose}) via ${methodLabel}.${proofDocument ? ` Proof stored as DOC-${String(proofDocument.id).padStart(7, '0')}.` : ''} Invoice ${invoice.paymentStatus}.`,
        location: 'System',
      });
    } catch (err) {
      console.warn(`Could not record payment against ${invoice.invoiceId} on the shipment timeline: ${err.message}`);
    }

    res.status(201).json({
      payment: {
        id: saved.id,
        paymentId: `PAY-${String(saved.id).padStart(7, '0')}`,
        invoiceId: saved.invoice?.invoiceId || invoice.invoiceId,
        amount: saved.amount,
        currency: saved.currency,
        provider: saved.provider,
        methodLabel,
        purpose,
        status: saved.status,
        paidAt: saved.paidAt,
        transactionRef: saved.providerRef,
        recordedBy: staffRef(staffId),
        createdAt: saved.createdAt,
        document: proofDocument
          ? {
              id: proofDocument.id,
              documentId: `DOC-${String(proofDocument.id).padStart(7, '0')}`,
              fileName: proofDocument.fileName,
              fileSize: proofDocument.fileSize,
              mimeType: proofDocument.mimeType,
              /* The stored path is app-relative and carries the
                 platform's own separator, so the file name is read
                 off either form rather than assumed to follow a
                 forward slash. */
              url: `/uploads/${String(proofDocument.filePath).split(/[\\/]/).pop()}`,
            }
          : null,
      },
      invoice: {
        id: invoice.id,
        invoiceId: invoice.invoiceId,
        paymentStatus: invoice.paymentStatus,
      },
      summary: {
        totalInvoiced: (await Invoice.sum('total', { where: { shipmentId: shipment.id } })) || 0,
        totalPaid: (await Payment.sum('amount', {
          where: {
            shipmentId: shipment.id,
            status: ['completed', 'refunded', 'partially_refunded'],
          },
        })) || 0,
      },
      notification: notification
        ? { notificationId: notification.notificationId, status: notification.status, channels }
        : null,
      message: `Payment recorded against ${invoice.invoiceId}. Invoice ${invoice.paymentStatus}.`,
    });
  } catch (err) {
    next(err);
  }
};

export default recordPayment;
