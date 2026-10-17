import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One quotation issued against a shipment.
 *
 * A quotation is an estimate, not a payable document: it carries no payment
 * status, and its life is governed by the Valid Until date rather than by
 * settlement. Money is stored in both currencies the platform quotes in, BDT
 * and USD, together with the exchange rate imported from the API at the moment
 * the quotation was generated, so the document can always be reproduced exactly
 * as it was sent. Staff never type the rate.
 */
const Quotation = sequelize.define(
  'Quotation',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quotationId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },

    /* The four kinds of estimate the Create Quotation modal offers. */
    quotationType: {
      type: DataTypes.ENUM(
        'Assisted Purchase Quotation',
        'Shipment Estimate',
        'Export Review Quotation',
        'Other'
      ),
      allowNull: false,
    },

    /* Status is set by the system, never chosen by staff. A generated quotation
       is Sent; it reads Expired once the Valid Until date has passed, which the
       Quotations & Invoices tab derives from the date rather than storing. */
    status: {
      type: DataTypes.ENUM('Sent', 'Expired', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Sent',
    },

    /* The rate the USD figures were converted with when the quotation was
       generated. Imported from the API, read-only for staff. */
    exchangeRate: { type: DataTypes.DECIMAL(12, 4), allowNull: true },

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

    /* Staff member who generated the quotation, for the audit trail. */
    createdBy: { type: DataTypes.INTEGER, allowNull: true },

    /* Channels the customer notification went out on, e.g. ["Email","SMS"]. */
    channels: { type: DataTypes.TEXT, allowNull: true },

    /* Path of the generated quotation PDF attached to the notification. */
    pdfPath: { type: DataTypes.STRING(500), allowNull: true },

    /* Date-based expiry, exactly as staff picked it: a date, with no time
       attached to it, because a quotation lapses at the end of that day. */
    validUntil: { type: DataTypes.DATEONLY, allowNull: false },

    /* When the quotation was generated, stamped by the system. */
    issuedAt: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'quotations',
    timestamps: true,
    underscored: true,
  }
);

export default Quotation;
