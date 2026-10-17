import { Document } from './src/models/index.js';
const db = Document.sequelize;

for (const t of ['tracking_events', 'shipments']) {
  const [cols] = await db.query(`SHOW COLUMNS FROM \`${t}\``);
  console.log(`=== ${t} ===`);
  cols.forEach((c) => console.log(`  ${c.Field.padEnd(26)} ${c.Type.padEnd(130)} ${c.Null === 'YES' ? 'NULL' : 'NOT NULL'}`));
  console.log('');
}

const [tables] = await db.query('SHOW TABLES');
console.log('=== all tables ===');
tables.map((r) => Object.values(r)[0]).forEach((t) => console.log('  ' + t));
process.exit(0);
