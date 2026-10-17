import ejs from 'ejs';
import fs from 'fs';

const src = fs.readFileSync('src/views/admin/shipment-tabs/add-timeline-modal.ejs', 'utf8');
const shipment = { id: 1, shipmentId: 'SHP-1', status: 'Shipped', serviceMode: 'Export' };
const html = ejs.render(src, { shipment, user: { id: 1, name: 'Tester' }, timelineStatusOptions: [{ status: 'Shipped', visibility: 'Customer Visible' }] }, {});

const i = html.indexOf('data-shipment-ref');
console.log('attribute region:', JSON.stringify(html.slice(i - 30, i + 60)));
console.log('occurrences of data-shipment-ref:', (html.match(/data-shipment-ref/g) || []).length);
console.log('occurrences of SHP-1:', (html.match(/SHP-1/g) || []).length);

/* Where does SHP-1 appear? */
let at = html.indexOf('SHP-1');
while (at !== -1) {
  console.log('  at', at, JSON.stringify(html.slice(at - 45, at + 15)));
  at = html.indexOf('SHP-1', at + 1);
}
process.exit(0);
