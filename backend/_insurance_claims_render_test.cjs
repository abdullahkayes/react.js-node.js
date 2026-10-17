import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const base = {
  insuranceRequested: true,
  serviceMode: 'Import',
  status: 'Delivered',
  currency: 'USD',
  trackingEvents: [
    { status: 'Received at USA Warehouse', createdAt: '2026-09-04T10:00:00Z' },
    { status: 'Delivered', createdAt: '2026-09-30T10:00:00Z' },
  ],
  sourceRequestItems: [
    { id: 1, itemType: 'Products / Goods', productDescription: 'Cotton apparel cartons', invoiceValue: 8400 },
    { id: 2, itemType: 'Product / Goods', productDescription: 'Cosmetics assortment', invoiceValue: 4750 },
    { id: 3, itemType: 'Documents', productDescription: 'Commercial Invoice', invoiceValue: 0 },
  ],
  items: [],
  insurances: [{ id: 1, insuranceId: 'INS-2600418', status: 'claimed', coverageAmount: 13150, premium: 394.5 }],
  claims: [
    { id: 1, claimId: 'CLM-2600198', insuranceId: 'INS-2600418', claimBasis: 'Insured', claimType: 'Missing Item', itemId: 'ITM-0000002', claimedAmount: 420, approvedAmount: null, status: 'Under Review' },
    { id: 2, claimId: 'CLM-2600200', insuranceId: null, claimBasis: 'Uninsured', claimType: 'Lost Parcel', itemId: null, claimedAmount: 0, approvedAmount: 250, status: 'Paid' },
  ],
  isLost: false,
  lostConfirmedAt: null,
};

const tpl = path.join(__dirname, 'views/admin/shipment-tabs/insurance-claims.ejs');

function render(shipment) {
  const out = ejs.renderFile(tpl, { shipment }, { async: false });
  return out;
}

const insured = render(base);
console.log('--- INSURED (Delivered) ---');
console.log(insured.slice(insured.indexOf('Insurance Coverage'), insured.indexOf('Insurance Coverage') + 600));

// Not insured
const uninsured = render({ ...base, insuranceRequested: false, insurances: [], claims: base.claims });
console.log('\n--- NOT INSURED ---');
console.log(uninsured.slice(uninsured.indexOf('No insurance coverage'), uninsured.indexOf('No insurance coverage') + 400));

// Lost shipment -> coverage end = lostConfirmedAt
const lost = render({ ...base, status: 'In Transit to Warehouse', isLost: true, lostConfirmedAt: '2026-09-20T08:00:00Z' });
console.log('\n--- LOST (start pending, end = loss confirm) ---');
console.log(lost.slice(lost.indexOf('Coverage Period'), lost.indexOf('Coverage Period') + 200));

// No receipt yet -> coverage start N/A
const preReceipt = render({ ...base, trackingEvents: [] });
console.log('\n--- PRE-RECEIPT (start N/A) ---');
console.log(preReceipt.slice(preReceipt.indexOf('Coverage Period'), preReceipt.indexOf('Coverage Period') + 200));

console.log('\nALL RENDERS OK');
