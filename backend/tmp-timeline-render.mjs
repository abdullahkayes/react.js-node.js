/**
 * Render checks for the Shipment Timeline tab and its modal.
 *
 * Contexts mirror what the controller and shipment-manage.ejs supply: the
 * shipment view nested, plus the timeline, the reference table and the status
 * options the server built.
 */
import ejs from 'ejs';
import fs from 'fs';

let bad = 0;
const ok = (label, cond, extra = '') => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${label}${extra ? ' :: ' + extra : ''}`);
  if (!cond) bad++;
};

const render = (name, ctx) =>
  ejs.render(fs.readFileSync(`src/views/admin/shipment-tabs/${name}`, 'utf8'), ctx, {
    filename: `src/views/admin/shipment-tabs/${name}`,
  });

const csv = (ctx = {}) => ({
  activeTab: 'timeline',
  user: { id: 1, name: 'Staff #1' },
  fmtDate: (v) => v,
  fmtDateTime: (v) => v,
  orDash: (v) => (v === null || v === undefined || v === '' ? '—' : v),
  money: (v, c) => c + v,
  titleCase: (v) => v,
  fmtBytes: (v) => v,
  docTypeLabel: (v) => v,
  quotationDisplayStatus: () => '',
  sourceRequestItems: [],
  auditTrail: [],
  auditStats: {},
  ...ctx,
});

/* The 24 approved statuses, as the controller supplies them. */
const statusOptions = [
  { status: 'Awaiting Carrier Tracking', visibility: 'Internal Only', customerFacing: false },
  { status: 'Awaiting Arrival at USA Warehouse', visibility: 'Internal Only', customerFacing: false },
  { status: 'Awaiting Arrival at Dhaka Hub', visibility: 'Internal Only', customerFacing: false },
  { status: 'Received at USA Warehouse', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Received at Dhaka Hub', visibility: 'Customer Visible', customerFacing: true },
  { status: 'On Hold', visibility: 'Customer Visible', customerFacing: true },
  { status: 'On Customs Hold', visibility: 'Customer Visible', customerFacing: true },
  { status: 'On Carrier Hold', visibility: 'Customer Visible', customerFacing: true },
  { status: 'In Transit to Warehouse', visibility: 'Internal Only', customerFacing: false },
  { status: 'Consolidation in Progress', visibility: 'Internal Only', customerFacing: false },
  { status: 'Shipment Locked', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Ready for Dispatch', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Shipped', visibility: 'Customer Visible', customerFacing: true },
  { status: 'In International Transit', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Arrived at Destination Country', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Customs Clearance in Progress', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Released from Customs', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Sorting at Hub', visibility: 'Internal Only', customerFacing: false },
  { status: 'Out for Delivery', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Delivered', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Failed Delivery', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Cancelled', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Disposed', visibility: 'Customer Visible', customerFacing: true },
  { status: 'Seized', visibility: 'Customer Visible', customerFacing: true },
];

const shipment = {
  id: 1, shipmentId: 'SHP-1', status: 'Shipped', serviceMode: 'Export',
  freightMode: 'Air', items: [], sourceRequestItems: [], timelineStatusOptions: statusOptions,
};

/* Both status types, in the order the controller builds them. */
const timeline = [
  { id: 'TE-1', statusType: 'Shipment', status: 'Awaiting Carrier Tracking', label: 'Shipment created', visibility: 'Internal Only', recordedAt: '2026-09-02T11:18:00.000Z', createdBy: 'System' },
  { id: 'RS-1', statusType: 'Shipment Request', status: 'Draft', label: 'Request Drafted', visibility: 'Internal Only', recordedAt: '2026-09-01T09:00:00.000Z', createdBy: 'System' },
  { id: 'RS-2', statusType: 'Shipment Request', status: 'Under Review', label: 'Request Submitted for Review', visibility: 'Customer Visible', recordedAt: '2026-09-05T08:40:00.000Z', createdBy: 'System' },
  { id: 'TE-2', statusType: 'Shipment', status: 'Shipped', label: 'Handed to the carrier at Dhaka Hub', visibility: 'Customer Visible', recordedAt: '2026-09-09T04:42:00.000Z', createdBy: 'Staff #1' },
];

console.log('--- Shipment Timeline tab ---');
let html;
try {
  html = render('timeline.ejs', csv({ shipment, timeline, statusReference: [] }));
  ok('renders', true);
} catch (e) {
  ok('renders', false, e.message);
  process.exit(1);
}

ok('heading', html.includes('Shipment Timeline'));
ok('section heading', html.includes('All Recorded Shipment Statuses'));
ok('visibility filter offers all three', ['>All</option>', '>Customer Visible</option>', '>Internal Only</option>'].every((o) => html.includes(o)));
ok('Add Timeline Update button', html.includes('data-open-timeline-modal'));
ok('current status shown from the shipment', /Current:<\/span>[\s\S]*?rounded-full">\s*Shipped/.test(html));

/* Both status types appear, each labelled. */
ok('request status appears', html.includes('Under Review'));
ok('request system label appears', html.includes('Request Submitted for Review'));
ok('request status-type badge appears', html.includes('>Shipment Request</span>'));
ok('shipment status-type badge appears', html.includes('>Shipment</span>'));
ok('staff label appears', html.includes('Handed to the carrier at Dhaka Hub'));
ok('system label appears', html.includes('Shipment created'));

/* The Status Note row is gone; the rest of the panel is intact. The panel sits
   between its own opening and the closing of its section, after the heading. */
ok('Status Note row removed', !html.includes('Status Note') && !html.includes('statusNote'));
const panelStart = html.indexOf('data-selected-entry');
const panelEnd = html.indexOf('</div>', html.indexOf('Recorded At', panelStart));
const panel = panelStart === -1 || panelEnd === -1 ? '' : html.slice(panelStart, panelEnd);
ok('panel keeps Status', panel.includes('>Status</span>'));
ok('panel keeps Status Type', panel.includes('>Status Type</span>'));
ok('panel keeps Label', panel.includes('>Label</span>'));
ok('panel keeps Visibility', panel.includes('>Visibility</span>'));
ok('panel keeps Created By', panel.includes('>Created By</span>'));
ok('panel keeps Recorded At', panel.includes('>Recorded At</span>'));
ok('panel has no Status Note row', !panel.includes('Status Note'));
ok('every entry is clickable', (html.match(/data-timeline-entry\r?\n/g) || []).length === 4, String((html.match(/data-timeline-entry\r?\n/g) || []).length));
ok('visibility written onto each row', (html.match(/data-visibility="(?:Customer Visible|Internal Only)"/g) || []).length === 4);
ok('status type written onto each row', (html.match(/data-status-type="(?:Shipment|Shipment Request)"/g) || []).length === 4);
ok('modal included', html.includes('id="timelineModal"'));

/* The filter's counts follow what is shown. */
ok('footer counts the recorded statuses', html.includes('4'));

console.log('\n--- Timeline Update modal ---');
try {
  html = render('add-timeline-modal.ejs', csv({ shipment, timelineStatusOptions: statusOptions }));
  ok('renders', true);
} catch (e) {
  ok('renders', false, e.message);
  process.exit(1);
}

ok('hidden by default', /id="timelineModal"[^>]*class="[^"]*hidden/.test(html));
ok('carries the shipment ref for the POST', html.includes('data-shipment-ref="SHP-1"'));
ok('shipment id in the header from the database', html.includes('font-mono mt-0.5 block">SHP-1<'));
ok('shows the current status from the shipment', html.includes('amber-400'));
ok('all 24 approved statuses offered', (html.match(/<option value="[^"]+"/g) || []).length === 24, String((html.match(/<option value="[^"]+"/g) || []).length));
ok('no request status offered', !html.includes('Request Submitted for Review') && !html.includes('Request Drafted'));
ok('status placeholder unselected', html.includes('<option value="" disabled selected>'));
ok('asks for the timeline label', html.includes('id="timelineLabel"'));
ok('label required', html.includes('Timeline Label <span class="text-[#f87171]">*</span>'));
ok('label capped at 255', html.includes('maxlength="255"'));
ok('visibility preview shown', html.includes('id="timelineVisibilityPreview"'));
ok('uploader read from the session', html.includes('id="timelineRecordedBy"') && html.includes('Staff #1'));
ok('recorded-at is the system\u2019s', html.includes('on submit'));
ok('submit disabled until complete', /id="timelineSubmitBtn"[^>]*disabled/.test(html));
ok('posts to the timeline endpoint', html.includes('/timeline'));

console.log('\n--- empty timeline ---');
{
  const empty = { ...shipment, timeline: [], status: null };
  const out = render('timeline.ejs', csv({ shipment: empty, timeline: [], statusReference: [] }));
  ok('empty state', out.includes('No status has been recorded for this shipment yet.'));
  ok('current status reads Not set', out.includes('rounded-full">\n            Not set'));
  ok('panel says nothing is selected', out.includes('Select a timeline entry to see its details.'));
}

console.log('\n--- no shipment at all ---');
try {
  const out = render('timeline.ejs', csv());
  ok('renders', out.includes('No status has been recorded for this shipment yet.'));
} catch (e) {
  ok('renders', false, e.message);
}

console.log(bad === 0 ? '\nAll checks passed.' : `\n${bad} failed.`);
process.exit(bad ? 1 : 0);
