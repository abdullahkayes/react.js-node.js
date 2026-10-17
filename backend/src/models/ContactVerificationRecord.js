import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One row per contact verification attempt.
 *
 * Contact verification is a history, not a single flag: a customer can be
 * asked to re-verify a contact and pass again, so every attempt is recorded
 * here in order. `customers.email_verification_status` /
 * `phone_verification_status` hold the current (latest) state, and this table
 * holds the full previous and present record.
 */
const ContactVerificationRecord = sequelize.define(
  'ContactVerificationRecord',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // Email or Phone.
    contactType: {
      type: DataTypes.ENUM('Email', 'Phone'),
      allowNull: false,
    },
    // The contact value that was verified (e.g. the email address or phone).
    contactValue: { type: DataTypes.STRING(255), allowNull: true },
    // Same allowed values as the summary cards.
    status: {
      type: DataTypes.ENUM('Not Required', 'Pending', 'Verified', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    requestedAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    // Staff member who completed the verification, when it was manual.
    verifiedBy: { type: DataTypes.INTEGER, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'contact_verification_records',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['user_id'] }],
  }
);

export default ContactVerificationRecord;
