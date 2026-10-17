import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

const paymentsFile = path.resolve('src/views/admin/shipment-tabs/payments.ejs');
const modalFile = path.resolve('src/views/admin/shipment-tabs/record-payment-modal.ejs');
console.log('payments exists:', fs.existsSync(paymentsFile));
console.log('modal exists:', fs.existsSync(modalFile));

const src = fs.readFileSync(paymentsFile, 'utf8');
const lines = src.split('\n');
console.log('line 335:', JSON.stringify(lines[334]));

const tpl = `<%- include('./record-payment-modal', { payableInvoices: [1, 2] }) %>`;
try {
  const out = await ejs.render(tpl, {
    shipment: { shipmentId: 'SHP-1', customer: { id: 7, name: 'Tanvir' } },
    user: { id: 12, name: 'Staff' },
    fmtDate: (v) => 'd',
    fmtDateTime: (v) => 'dt',
    money: (v, c) => 'm',
    titleCase: (v) => 't',
  }, { filename: paymentsFile, async: true });
  console.log('include output length:', out.length);
  console.log('VERBATIM:', JSON.stringify(out));
  console.log('contains recordPaymentModal:', out.includes('recordPaymentModal'));
} catch (e) {
  console.log('INCLUDE ERROR:', e.message);
}
