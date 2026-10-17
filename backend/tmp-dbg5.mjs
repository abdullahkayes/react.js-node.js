import ejs from 'ejs';
import fs from 'fs';

const shipment = { id: 1, shipmentId: 'SHP-1', status: 'Shipped', serviceMode: 'Export', items: [], sourceRequestItems: [] };

const html = ejs.render(fs.readFileSync('src/views/admin/shipment-tabs/add-timeline-modal.ejs', 'utf8'), shipment, { filename: 'src/views/admin/shipment-tabs/add-timeline-modal.ejs' });

console.log('has data-shipment-ref:', html.includes('data-shipment-ref'));
console.log('contains "data-shipment-ref=\"SHP-1\"":', html.includes("data-shipment-ref=\"SHP-1\""));
console.log('contains SHP-1:', html.includes('SHP-1'));
console.log('option count:', (html.match(/<option/g) || []).length);
const i = html.indexOf('timelineModal');
console.log('first 200 of modal:', JSON.stringify(html.slice(i - 20, i + 180)));
process.exit(0);
