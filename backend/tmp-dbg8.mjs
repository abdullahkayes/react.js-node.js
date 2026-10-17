import ejs from 'ejs';
import fs from 'fs';

const src = fs.readFileSync('src/views/admin/shipment-tabs/add-timeline-modal.ejs', 'utf8');

const shipment = { id: 1, shipmentId: 'SHP-1', status: 'Shipped', serviceMode: 'Export' };
const ctx = { shipment, user: { id: 1, name: 'Tester' }, timelineStatusOptions: [{ status: 'Shipped', visibility: 'Customer Visible' }] };

const out = ejs.render(src + `\nPROBE shipmentId=[<%= shipmentId %>] currentStatus=[<%= currentStatus %>] staffName=[<%= staffName %>] opts=<%= statusOptions.length %>`, ctx, {});

const i = out.lastIndexOf('PROBE');
console.log(out.slice(i));
process.exit(0);
