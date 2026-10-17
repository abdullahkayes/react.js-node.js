import ejs from 'ejs';
import fs from 'fs';

const probe = ejs.render(
  'V exists: <%= typeof V %> | shipmentId: [<%= shipmentId %>] | statusOptions: <%= typeof statusOptions %>',
  { V: { shipmentId: 'SHP-1' }, shipmentId: 'SHP-1', statusOptions: [{ status: 'A', visibility: 'Internal Only' }] },
  {}
);
console.log('probe renders:', probe);

/* Now with the variable declared the way the modal declares it. */
const src = fs.readFileSync('src/views/admin/shipment-tabs/add-timeline-modal.ejs', 'utf8');
const head = src.slice(0, src.indexOf('%>') + 2);
console.log('\n--- modal head ---');
console.log(head);
process.exit(0);
