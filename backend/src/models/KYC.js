import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One row per customer: the customer's current compliance profile.
 *
 * This is the single source of truth for the Compliance tab. Both the summary
 * cards and the Current Compliance Profile section read from here, and the only
 * thing that writes to it is the Update Compliance Profile modal - so a status
 * on screen always matches what staff actually saved.
 *
 * The row is created with the documented defaults as soon as the customer
 * registers, and every change made through the modal also appends a
 * KYCReview row, so this table holds the present state and the review table
 * holds how it got there.
 */
const KYC = sequelize.define(
  'KYC',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // Vocabulary comes from config/kyc.js.
    kycStatus: {
      type: DataTypes.ENUM('Not Required Yet', 'Pending', 'Verified', 'Rejected', 'Update Required'),
      allowNull: false,
      defaultValue: 'Not Required Yet',
    },
    riskTier: {
      type: DataTypes.ENUM('Standard', 'Medium', 'High'),
      allowNull: false,
      defaultValue: 'Standard',
    },
    // Stored as the literal label rather than a boolean, because "Required" and
    // "Not Required" are the values the Compliance tab displays.
    manualReviewRequired: {
      type: DataTypes.ENUM('Required', 'Not Required'),
      allowNull: false,
      defaultValue: 'Not Required',
    },
    internalReviewNote: { type: DataTypes.TEXT, allowNull: true },
    // Staff member who last updated or reviewed the profile, and when.
    lastReviewedBy: { type: DataTypes.INTEGER, allowNull: true },
    lastReviewedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'kyc_profiles',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id'] }],
  }
);

export default KYC;