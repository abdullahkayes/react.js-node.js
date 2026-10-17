import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One row per policy acceptance.
 *
 * The customer accepts the policies in force at registration, and again whenever
 * a policy is updated and re-acceptance is required. Each acceptance is its own
 * row rather than an update of the previous one, so the Policy Acceptance History
 * table shows the full sequence: which policy, which version, accepted how, when,
 * and the technical evidence captured at the time (IP address, browser/device).
 *
 * Rows are never edited after the fact. A superseded acceptance stays because it
 * is the record of what the customer was agreeing to at that point in time.
 */
const PolicyAcceptance = sequelize.define(
  'PolicyAcceptance',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // Policy key from config/notifications.js, e.g. 'terms_of_service'.
    policyKey: { type: DataTypes.STRING(60), allowNull: false },
    policy: { type: DataTypes.STRING(120), allowNull: false },
    // The version the customer agreed to. Kept per row so an update is visible
    // as a new version rather than an overwritten one.
    version: { type: DataTypes.STRING(20), allowNull: false },
    // How the customer accepted it. Vocabulary comes from ACCEPTANCE_METHODS.
    method: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'Registration Form' },
    acceptedAt: { type: DataTypes.DATE, allowNull: false },
    // Technical evidence captured with the acceptance where available.
    ipAddress: { type: DataTypes.STRING(64), allowNull: true },
    userAgent: { type: DataTypes.STRING(255), allowNull: true },
    // The Policy Update notification that asked for this acceptance, when the
    // acceptance was prompted by a notice rather than at registration.
    notificationId: { type: DataTypes.STRING(20), allowNull: true },
  },
  {
    tableName: 'policy_acceptances',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id', 'policy_key'] },
      { fields: ['user_id', 'accepted_at'] },
    ],
  }
);

export default PolicyAcceptance;
