import ejs from 'ejs';
import fs from 'fs';

const file = 'src/views/admin/shipment-tabs/timeline.ejs';
const html = ejs.render(fs.readFileSync(file, 'utf8'), {
  shipment: {
    id: 1, shipmentId: 'SHP-1', status: 'Shipped', serviceMode: 'Export',
    timeline: [{ id: 'TE-1', statusType: 'Shipment', status: 'Shipped', label: 'L', visibility: 'Customer Visible', recordedAt: '2026-09-02T11:18:00.000Z', createdBy: 'Staff #1' }],
    timelineStatusOptions: [],
  },
  user: { id: 1 }, fmtDate: (v) => v, fmtDateTime: (v) => v, orDash: (v) => v || '—',
  money: (v, c) => c + v, titleCase: (v) => v, fmtBytes: (v) => v, docTypeLabel: (v) => v,
  quotationDisplayStatus: () => '', sourceRequestItems: [],
}, { filename: file });

/* The selected-entry panel. */
const panelIdx = html.indexOf('data-selected-entry');
console.log('selected panel:');
console.log(html.slice(panelIdx, panelIdx + 1400));
process.exit(0);
