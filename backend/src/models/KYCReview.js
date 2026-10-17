import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One row per compliance profile update.
 *
 * The Compliance tab's Current Compliance Profile section shows the present
 * state; this table is the history behind it. Every save through the Update
 * Compliance Profile modal appends a row, so a profile can be traced back to the
 * staff member who set each value and when they set it.
 *
 * Both the previous and the new values are stored on the row rather than a
 * rendered sentence, so the history stays accurate even if the label wording
 * or the allowed vocabularies change later.
 */
const KYCReview = sequelize.define(
  'KYCReview',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    action: {
      type: DataTypes.ENUM('Create', 'Update'),
      allowNull: false,
      defaultValue: 'Update',
    },
    // State the profile was in before this update.
    previousKycStatus: { type: DataTypes.STRING(40), allowNull: true },
    previousRiskTier: { type: DataTypes.STRING(40), allowNull: true },
    previousManualReviewRequired: { type: DataTypes.STRING(40), allowNull: true },
    previousInternalReviewNote: { type: DataTypes.TEXT, allowNull: true },
    // State this update left the profile in.
    kycStatus: { type: DataTypes.ENUM('Not Required Yet', 'Pending', 'Verified', 'Rejected', 'Update Required'), allowNull: false },
    riskTier: { type: DataTypes.ENUM('Standard', 'Medium', 'High'), allowNull: false },
    manualReviewRequired: { type: DataTypes.ENUM('Required', 'Not Required'), allowNull: false },
    internalReviewNote: { type: DataTypes.TEXT, allowNull: true },
    // Display labels of the fields this update changed, JSON array.
    changedFields: { type: DataTypes.TEXT, allowNull: true },
    // Staff member who performed the update.
    reviewedBy: { type: DataTypes.INTEGER, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'kyc_profile_reviews',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['user_id'] }],
  }
);

export default KYCReview;