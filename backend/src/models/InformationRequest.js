import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One row per customer information request.
 *
 * Raised from Customer Details when staff need missing, incorrect, outdated or
 * additional information/documents from the customer. It is deliberately not
 * tied to a document or any other record: it is a customer-level request, so it
 * is keyed on `userId` alone and stays traceable through the audit trail.
 *
 * The customer-facing notification is stored with the request so the exact
 * message and channels that were used can be reproduced later.
 */
const InformationRequest = sequelize.define(
  'InformationRequest',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // Vocabulary comes from config/informationRequests.js.
    //
    // Nullable because the two places that raise an information request describe
    // the gap differently. The customer-level form classifies the gap with all
    // four, and its endpoint still requires them; a request-level notice names
    // the items it concerns and the message to the customer instead, which is
    // not a classification of the customer's records.
    informationType: { type: DataTypes.STRING(60), allowNull: true },
    specificInformation: { type: DataTypes.STRING(120), allowNull: true },
    actionRequired: { type: DataTypes.STRING(60), allowNull: true },
    requiredDetails: { type: DataTypes.TEXT, allowNull: false },
    reason: { type: DataTypes.STRING(120), allowNull: true },
    // The request this notice was raised from, so it can be traced back to the
    // item it is about. Null for a customer-level information request, which is
    // not tied to any one request.
    relatedRequestType: { type: DataTypes.STRING(50), allowNull: true, defaultValue: null },
    relatedRequestId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    // JSON array of the item ids the notice concerns. Empty when the staff chose
    // the whole request rather than specific items.
    relatedItemIds: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    // Required when reason is "Other"; optional context otherwise.
    reasonDetails: { type: DataTypes.TEXT, allowNull: true },
    additionalInstructions: { type: DataTypes.TEXT, allowNull: true },
    // JSON array of the selected channels ("Email", "SMS", ...).
    notificationChannels: { type: DataTypes.TEXT, allowNull: true },
    notificationSubject: { type: DataTypes.STRING(255), allowNull: true },
    notificationMessage: { type: DataTypes.TEXT, allowNull: true },
    notificationSentAt: { type: DataTypes.DATE, allowNull: true },
    // Per-channel delivery outcome, JSON. In-App is recorded on creation; the
    // external channels are only marked sent when the transport accepted them.
    notificationResults: { type: DataTypes.TEXT, allowNull: true },
    // Staff member who raised the request.
    requestedBy: { type: DataTypes.INTEGER, allowNull: true },
    requestedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'information_requests',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['user_id'] }],
  }
);

export default InformationRequest;