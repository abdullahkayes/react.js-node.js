import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One invoice issued against a shipment.
 *
 * Money is stored in both currencies the platform quotes in - BDT and USD -
 * alongside the exchange rate that was imported from the API at generation
 * time. The rate is saved with the invoice so the document can always be
 * reproduced exactly as it was issued, rather than being recalculated later
 * against a rate that has since moved. Staff never type it.
 *
 * `paymentStatus` tracks settlement and is set to Pending the moment the
 * invoice is generated; `status` is the invoice's own lifecycle.
 */
const Invoice = sequelize.define(
  'Invoice',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoiceId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },

    // The kind of invoice, from the fixed list the modal offers.
    invoiceType: { type: DataTypes.STRING(60), allowNull: true },

    status: {
      type: DataTypes.ENUM('draft', 'issued', 'paid', 'cancelled'),
      defaultValue: 'issued',
    },

    /* Settlement of the invoice. Pending the moment it is generated; a
       recorded payment moves this to Completed. The vocabulary is the
       payment gateway's - a Failed attempt never collected anything, so
       the invoice is offered to the Record Payment modal again; a
       Reversed, Refunded or Partially Refunded one has had its money
       returned, and one Under Review is being worked on, so none of
       those accept another payment. The members earlier releases stored
       (Paid, Partially Paid) stay readable in rows written under them. */
    paymentStatus: {
      type: DataTypes.ENUM(
        'Pending',
        'Paid',
        'Partially Paid',
        'Refunded',
        'Failed',
        'Completed',
        'Reversed',
        'Partially Refunded',
        'Under Review'
      ),
      allowNull: false,
      defaultValue: 'Pending',
    },

    // Base currency the totals are reported in, kept alongside both columns.
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },

    /* The rate the USD figures were converted with at generation. Read-only
       for staff: it is imported from the API, never entered by hand. */
    exchangeRate: { type: DataTypes.DECIMAL(12, 4), allowNull: true },

    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    discount: { type: DataTypes.DECIMAL(12, 2), allowNull: true, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },

    subtotalBdt: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    subtotalUsd: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    discountBdt: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    discountUsd: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    additionalChargeBdt: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    additionalChargeUsd: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    totalBdt: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    totalUsd: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },

    discountDescription: { type: DataTypes.TEXT, allowNull: true },
    additionalChargeDescription: { type: DataTypes.TEXT, allowNull: true },

    // Staff member who generated the invoice, for the audit trail.
    createdBy: { type: DataTypes.INTEGER, allowNull: true },

    // Channels the customer notification was sent on, e.g. ["Email","SMS"].
    channels: { type: DataTypes.TEXT, allowNull: true },

    // Path of the generated invoice PDF attached to the notification.
    pdfPath: { type: DataTypes.STRING(500), allowNull: true },

    dueDate: { type: DataTypes.DATE, allowNull: true },
    issuedAt: { type: DataTypes.DATE, allowNull: true },
    paidAt: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'invoices',
    timestamps: true,
    underscored: true,
  }
);

export default Invoice;
