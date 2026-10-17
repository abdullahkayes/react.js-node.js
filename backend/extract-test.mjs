import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString('en-GB') : '—');
const fmtDateTime = (v) => (v ? new Date(v).toLocaleString('en-GB') : '—');
const money = (v, c) => `${c || 'USD'} ${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const titleCase = (v) => String(v || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const now = new Date();
const week = new Date(now.getTime() + 7 * 86400000);

const shipment = {
  id: 1,
  shipmentId: 'SHP-2602789',
  userId: 7,
  customer: { id: 7, name: 'Tanvir Hossain' },
  invoices: [
    { id: 3, invoiceId: 'INV-2600010', invoiceType: 'Import Final Shipment', total: 50000, currency: 'BDT', dueDate: week, issuedAt: now, paymentStatus: 'Pending' },
  ],
  payments: [
    { id: 9, invoiceId: 3, invoice: { id: 3, invoiceId: 'INV-2600010', invoiceType: 'Import Final Shipment', total: 50000, currency: 'BDT', dueDate: week, issuedAt: now }, provider: 'bank_transfer', amount: 20000, currency: 'BDT', status: 'completed', paidAt: now, providerRef: 'DBBL-52891462', createdAt: now, createdBy: 12 },
  ],
};

const payableInvoices = shipment.invoices.filter((i) => !shipment.payments.some((p) => p.invoiceId === i.id));

const context = {
  shipment,
  payableInvoices,
  user: { id: 12, name: 'Admin Staff' },
  fmtDate,
  fmtDateTime,
  money,
  titleCase,
  orDash: (v) => v ?? '—',
};

const html = await ejs.renderFile(
  path.join(__dirname, 'src/views/admin/shipment-tabs/payments.ejs'),
  context,
  { async: true }
);

// Extract the LAST inline <script> block (the payments tab one, not the modal's)
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const js = blocks[blocks.length - 1];
fs.writeFileSync(path.join(__dirname, 'extracted.js'), js);
console.log(`Extracted ${blocks.length} script block(s); last is ${js.length} chars`);
console.log('--- first 400 chars ---');
console.log(js.slice(0, 400));
