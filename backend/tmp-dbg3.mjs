/* What the three failures are about. */
import ejs from 'ejs';
import fs from 'fs';

const render = (name, ctx) => ejs.render(fs.readFileSync(`src/views/admin/shipment-tabs/${name}`, 'utf8'), ctx, { filename: `src/views/admin/shipment-tabs/${name}` });

const shipment = {
  id: 1, shipmentId: 'SHP-1', status: 'Shipped', serviceMode: 'Export',
  items: [], sourceRequestItems: [],
  timeline: [{ id: 'TE-1', statusType: 'Shipment', status: 'Shipped', label: 'L', visibility: 'Customer Visible', recordedAt: '2026-09-02T11:18:00.000Z', createdBy: 'Staff #1' }],
  timelineStatusOptions: [],
};

const html = render('timeline.ejs', { shipment, user: { id: 1 }, fmtDate: (v) => v, fmtDateTime: (v) => v, orDash: (v) => v || '—', money: (v, c) => c + v, titleCase: (v) => v, fmtBytes: (v) => v, docTypeLabel: (v) => v, quotationDisplayStatus: () => '', sourceRequestItems: [] });

console.log('data-timeline-entry occurrences:', (html.match(/data-timeline-entry/g) || []).length);
const i = html.indexOf('data-timeline-entry');
console.log('sample:', JSON.stringify(html.slice(i - 40, i + 120)));

/* The empty status. */
const empty = render('timeline.ejs', { shipment: { ...shipment, timeline: [], status: null }, user: { id: 1 }, fmtDate: (v) => v, fmtDateTime: (v) => v, orDash: (v) => v || '—', money: (v, c) => c + v, titleCase: (v) => v, fmtBytes: (v) => v, docTypeLabel: (v) => v, quotationDisplayStatus: () => '', sourceRequestItems: [] });
const j = empty.indexOf('Current:');
console.log('\nempty status line:', JSON.stringify(empty.slice(j, j + 160)));

/* The modal's ref. */
const modal = render('add-timeline-modal.ejs', shipment);
const k = modal.indexOf('Shipment ID');
console.log('\nmodal shipment id line:', JSON.stringify(modal.slice(k, k + 140)));
process.exit(0);
