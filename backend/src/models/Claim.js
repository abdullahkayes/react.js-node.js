import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Insurance claims.
 *
 * Claims are a separate entity from Insurance: a claim may be filed against a
 * shipment that was never insured (insuranceId stays null), and several claims
 * can hang off one insured shipment. That is why this is its own table rather
 * than overloading the insurances row.
 *
 * The status vocabulary is owned here so the page and any future claim entry
 * flow can never disagree on what a claim's status can be.
 */
const Claim = sequelize.define(
  'Claim',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    claimId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false },
    /* Reference to the insurance record linked to this claim. Stored as the
       insurances.insurance_id business key (e.g. "INS-2600418") rather than the
       numeric PK, mirroring how shipments reference their source request - so
       a claim survives even if read back without joining insurances, and a
       claim against an uninsured shipment simply leaves this null. */
    insuranceId: { type: DataTypes.STRING(50), allowNull: true },
    claimType: { type: DataTypes.STRING(100), allowNull: true },
    /* Why the claim is being raised on this shipment's behalf, e.g. "Insured"
       or "Uninsured". */
    claimBasis: { type: DataTypes.STRING(50), allowNull: true },
    /* One or more item references the claim concerns. */
    itemId: { type: DataTypes.STRING(255), allowNull: true },
    claimedAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    approvedAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    status: {
      type: DataTypes.ENUM(
        'Draft',
        'Submitted',
        'Under Review',
        'Needs More Information',
        'Approved',
        'Rejected',
        'Paid',
        'Closed'
      ),
      allowNull: false,
      defaultValue: 'Draft',
    },
    submittedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'claims',
    timestamps: true,
    underscored: true,
  }
);

export default Claim;
