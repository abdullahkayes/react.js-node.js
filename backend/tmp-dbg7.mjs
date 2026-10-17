import ejs from 'ejs';
import fs from 'fs';

const src = fs.readFileSync('src/views/admin/shipment-tabs/add-timeline-modal.ejs', 'utf8');
const head = src.slice(0, src.indexOf('%>') + 2);
const probe = head.replace('  const visibilityBadge = (visibility) => {', '  __probe = [shipmentId, serviceMode, currentStatus, staffName, JSON.stringify(statusOptions)];');
const withProbe = src.replace('  const visibilityBadge = (visibility) => {', '  const __probe = [shipmentId, serviceMode, currentStatus, staffName, JSON.stringify(statusOptions)];');

const shipment = { id: 1, shipmentId: 'SHP-1', status: 'Shipped', serviceMode: 'Export' };
const out = ejs.render(withProbe + '\nOUT:<%= __probe.join(" | ") %>', { shipment, user: { id: 1, name: 'Tester' }, timelineStatusOptions: [{ status: 'Shipped', visibility: 'Customer Visible' }] }, {});
console.log('rendered head output:');
console.log(out.slice(out.lastIndexOf('OUT:') + 4));
process.exit(0);
