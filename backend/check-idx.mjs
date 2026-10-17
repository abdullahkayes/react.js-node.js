import { sequelize } from './src/config/db.js';
const fks = await sequelize.query(
  "SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND REFERENCED_TABLE_NAME IS NOT NULL",
  { type: sequelize.constructor.QueryTypes.SELECT }
);
console.log('FKs:', JSON.stringify(fks));

// Confirm multiple payments per shipment now insert cleanly
const { Payment } = await import('./src/models/index.js');
const a = await Payment.create({ shipmentId: 58, invoiceId: null, provider: 'stripe', amount: 250.5, currency: 'USD', status: 'refunded', paidAt: new Date('2026-10-01T10:00:00') });
console.log('inserted no-invoice payment id', a.id);
const b = await Payment.create({ shipmentId: 58, invoiceId: 6, provider: 'mobile_banking', providerRef: 'BKASH-9911', amount: 500, currency: 'USD', status: 'partially_refunded', paidAt: new Date('2026-10-02T09:30:00') });
console.log('inserted partially-refunded payment id', b.id);
await sequelize.close();
