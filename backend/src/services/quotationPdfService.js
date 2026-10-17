/**
 * Quotation PDF generator.
 *
 * Renders the quotation the staff member reviewed in the modal into a printable
 * document: the shipment and customer block, the line items, the discount and
 * additional charge with their descriptions, the totals in both currencies, and
 * the dates including the Valid Until date the quotation lapses on.
 *
 * Internal details are deliberately absent, exactly as they are absent from the
 * customer notification: no staff identifiers, no exchange rate and no audit
 * information ever reaches the customer's copy.
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const money = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * The reference shown to the customer.
 *
 * A shipment can carry a blank public reference - the row exists but nothing was
 * ever assigned - and a document that reads "Shipment ID: —" tells the customer
 * nothing. The tracking number and then the row id are tried in turn, so the
 * quotation always names the shipment it belongs to.
 */
const shipmentRefOf = (shipment = {}) =>
  String(shipment.shipmentId || '').trim() ||
  String(shipment.trackingNumber || '').trim() ||
  `Shipment #${shipment.id || ''}`.trim();

/**
 * Builds the quotation PDF into a buffer.
 *
 * @param {object} quotation  The saved quotation, with `items` attached.
 * @param {object} context    { shipment, customer }
 * @returns {Promise<Buffer>}
 */
export const buildQuotationPdf = (quotation, context = {}) => new Promise((resolve, reject) => {
  try {
    const { shipment = {}, customer = {} } = context;
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    /* ---- Header ---- */
    doc.fontSize(20).font('Helvetica-Bold').text('Dazzling Shipping', { align: 'left' });
    doc.fontSize(9).font('Helvetica').fillColor('#555555').text('International Shipping Platform', { align: 'left' });
    doc.moveDown(0.5);

    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(0.8);

    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text(`QUOTATION${quotation.quotationType ? ' — ' + quotation.quotationType : ''}`);
    doc.moveDown(0.6);

    /* ---- Reference block ---- */
    const issuedAt = quotation.issuedAt || quotation.createdAt || new Date();

    doc.fontSize(9).font('Helvetica');
    const refRows = [
      ['Quotation No.:', quotation.quotationId || '—', 'Quotation Date:', fmtDate(issuedAt)],
      ['Shipment ID:', shipmentRefOf(shipment), 'Valid Until:', fmtDate(quotation.validUntil)],
      ['Customer ID:', customer.customerId || (customer.id ? `C-${customer.id}` : '—'), 'Service Mode:', shipment.serviceMode || '—'],
      ['Customer Name:', customer.customerType === 'Individual' ? (customer.fullName || customer.name) : (customer.businessName || customer.name || '—'), 'Freight Mode:', shipment.freightMode || '—'],
      ['Purchase Type:', shipment.serviceMode === 'Export' ? 'N/A' : (shipment.purchaseType || '—'), 'Status:', quotation.status || 'Sent'],
    ];

    let y = doc.y;
    refRows.forEach((row) => {
      doc.font('Helvetica-Bold').fillColor('#333333').text(row[0], 50, y, { width: 90 });
      doc.font('Helvetica').fillColor('#000000').text(String(row[1]), 145, y, { width: 105 });
      doc.font('Helvetica-Bold').fillColor('#333333').text(row[2], 265, y, { width: 85 });
      doc.font('Helvetica').fillColor('#000000').text(String(row[3]), 355, y, { width: 190 });
      y += 15;
    });

    doc.moveDown(1);

    /* ---- Line items ---- */
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text('Quotation Details');
    doc.moveDown(0.4);

    const tableTop = doc.y;
    const columns = [
      { label: 'SL', x: 50, width: 25, align: 'left' },
      { label: 'Description', x: 75, width: 165, align: 'left' },
      { label: 'Qty', x: 240, width: 45, align: 'right' },
      { label: 'Unit', x: 290, width: 50, align: 'left' },
      { label: 'Unit Price', x: 340, width: 90, align: 'right' },
      { label: 'Amount', x: 430, width: 115, align: 'right' },
    ];

    doc.rect(50, tableTop - 4, 495, 18).fill('#f0f0f0');
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#000000');
    columns.forEach((c) => doc.text(c.label, c.x, tableTop, { width: c.width, align: c.align }));

    y = tableTop + 18;
    doc.moveTo(50, y).lineTo(545, y).strokeColor('#dddddd').stroke();
    y += 5;

    doc.fontSize(8.5).font('Helvetica');
    let hasRows = false;
    (quotation.items || []).forEach((item, i) => {
      hasRows = true;
      const qty = Number(item.quantity) || 1;
      const unitBdt = Number(item.unitPriceBdt) || 0;
      const unitUsd = Number(item.unitPriceUsd) || 0;
      const amountBdt = Number(item.amountBdt) || qty * unitBdt;
      const amountUsd = Number(item.amountUsd) || qty * unitUsd;

      doc.fillColor('#000000');
      doc.text(String(i + 1), columns[0].x, y, { width: columns[0].width, align: 'left' });
      doc.text(String(item.description || '—'), columns[1].x, y, { width: columns[1].width, align: 'left' });
      doc.text(String(qty), columns[2].x, y, { width: columns[2].width, align: 'right' });
      doc.text(String(item.unit || '—'), columns[3].x, y, { width: columns[3].width, align: 'left' });
      doc.text(`BDT ${money(unitBdt)}\nUSD ${money(unitUsd)}`, columns[4].x, y, { width: columns[4].width, align: 'right' });
      doc.text(`BDT ${money(amountBdt)}\nUSD ${money(amountUsd)}`, columns[5].x, y, { width: columns[5].width, align: 'right' });
      y += 24;
    });

    if (!hasRows) {
      doc.fillColor('#777777').text('No line items recorded.', 50, y);
      y += 16;
    }

    doc.moveTo(50, y).lineTo(545, y).strokeColor('#dddddd').stroke();
    y += 10;

    /* ---- Discount and additional charge ---- */
    const dBdt = Number(quotation.discountBdt) || 0;
    const dUsd = Number(quotation.discountUsd) || 0;
    const aBdt = Number(quotation.additionalChargeBdt) || 0;
    const aUsd = Number(quotation.additionalChargeUsd) || 0;

    if (dBdt || dUsd) {
      doc.font('Helvetica-Bold').fillColor('#000000').text('Discount', 50, y, { width: 200 });
      doc.font('Helvetica').text(`- BDT ${money(dBdt)}   /   - USD ${money(dUsd)}`, 250, y, { width: 295, align: 'right' });
      y += 14;
      if (quotation.discountDescription) {
        doc.fontSize(8).fillColor('#555555').text(String(quotation.discountDescription), 50, y, { width: 495 });
        y += 13;
      }
    }

    if (aBdt || aUsd) {
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#000000').text('Additional Charge', 50, y, { width: 200 });
      doc.font('Helvetica').text(`+ BDT ${money(aBdt)}   /   + USD ${money(aUsd)}`, 250, y, { width: 295, align: 'right' });
      y += 14;
      if (quotation.additionalChargeDescription) {
        doc.fontSize(8).fillColor('#555555').text(String(quotation.additionalChargeDescription), 50, y, { width: 495 });
        y += 13;
      }
    }

    y += 6;

    /* ---- Totals ---- */
    const subBdt = Number(quotation.subtotalBdt) || 0;
    const subUsd = Number(quotation.subtotalUsd) || 0;
    const totBdt = Number(quotation.totalBdt) || 0;
    const totUsd = Number(quotation.totalUsd) || 0;

    const summaryRows = [
      ['Subtotal', `BDT ${money(subBdt)}   /   USD ${money(subUsd)}`],
      ['Discount', `- BDT ${money(dBdt)}   /   - USD ${money(dUsd)}`],
      ['Additional Charge', `+ BDT ${money(aBdt)}   /   + USD ${money(aUsd)}`],
    ];

    summaryRows.forEach((row) => {
      doc.fontSize(9).font('Helvetica').fillColor('#333333');
      doc.text(row[0], 50, y, { width: 200 });
      doc.fillColor('#000000').text(row[1], 250, y, { width: 295, align: 'right' });
      y += 14;
    });

    y += 4;
    doc.rect(50, y - 4, 495, 22).fill('#f5f5f5');
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
    doc.text('Total Quotation Amount', 55, y + 2, { width: 200 });
    doc.text(`BDT ${money(totBdt)}   /   USD ${money(totUsd)}`, 250, y + 2, { width: 290, align: 'right' });

    /* ---- Footer ---- */
    const footerY = 760;
    doc.fontSize(7.5).font('Helvetica').fillColor('#777777');
    doc.text(
      `This quotation is valid until ${fmtDate(quotation.validUntil)}. The exchange rate applied when it was generated was 1 USD = ${Number(quotation.exchangeRate || 0).toFixed(2)} BDT.`,
      50,
      footerY,
      { width: 495, align: 'left' }
    );
    doc.text('Dazzling Shipping — Thank you for your business.', 50, footerY + 14, { width: 495, align: 'center' });

    doc.end();
  } catch (err) {
    reject(err);
  }
});

/** Writes the quotation PDF to disk and returns its path. */
export const saveQuotationPdf = async (quotation, context = {}) => {
  const buffer = await buildQuotationPdf(quotation, context);
  const uploadRoot = path.resolve(__dirname, '..', '..', 'uploads', 'quotations');
  fs.mkdirSync(uploadRoot, { recursive: true });
  const fileName = `${quotation.quotationId || 'quotation'}-${Date.now()}.pdf`;
  const filePath = path.join(uploadRoot, fileName);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

/** Builds the customer notification body for a generated quotation. */
export const buildQuotationNotification = (quotation, context = {}) => {
  const { shipment = {}, customer = {} } = context;
  const customerName = customer.customerType === 'Individual'
    ? (customer.fullName || customer.name || 'Customer')
    : (customer.businessName || customer.name || 'Customer');

  const issuedAt = quotation.issuedAt || quotation.createdAt || new Date();

  const subject = `Quotation Available – ${quotation.quotationType || 'Quotation'} – ${shipmentRefOf(shipment)}`;

  const message = [
    `Dear ${customerName},`,
    '',
    'A quotation has been prepared for your shipment and is attached to this notification.',
    '',
    `Shipment ID: ${shipmentRefOf(shipment)}`,
    `Quotation Type: ${quotation.quotationType || '—'}`,
    `Quotation No.: ${quotation.quotationId || '—'}`,
    `Quotation Date: ${fmtDate(issuedAt)}`,
    `Valid Until: ${fmtDate(quotation.validUntil)}`,
    '',
    'Total Quotation Amount:',
    `BDT ${money(quotation.totalBdt)}`,
    `USD ${money(quotation.totalUsd)}`,
    '',
    'Please review the attached quotation and take any required action before the quotation expiry date.',
    '',
    'Regards,',
    'Dazzling Shipping',
  ].join('\n');

  return { subject, message };
};

export default buildQuotationPdf;
