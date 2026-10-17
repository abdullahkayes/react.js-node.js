import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Payment = sequelize.define(
  'Payment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false },
    // The invoice this payment settles. Every payment recorded against a
    // shipment is raised from an invoice, so the link is what the Payments tab
    // reads to show the Due Date and the Linked Invoice section. Nullable so a
    // row written before the column existed stays readable.
    invoiceId: { type: DataTypes.INTEGER, allowNull: true },
    provider: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'stripe' },
    providerRef: { type: DataTypes.STRING(255), allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'completed',
        'failed',
        'reversed',
        'refunded',
        'partially_refunded',
        'under_review'
      ),
      defaultValue: 'pending',
    },
    paidAt: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    // Staff member who recorded the payment, for the audit trail and the
    // Recorded By column on the Payments tab. Read from the session, never
    // entered by hand.
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
  }
);

export default Payment;