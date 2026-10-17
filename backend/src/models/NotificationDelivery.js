import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One row per channel delivery attempt.
 *
 * This is the Delivery Evidence table: a notification sent through Email, SMS and
 * the Dashboard produces three rows here against one CustomerNotification row.
 * Each row carries that channel's own outcome, which is deliberately kept
 * separate from the notification's overall status - a notification can be
 * Viewed because the customer opened the dashboard copy while the email copy
 * still reads Delivered.
 *
 * `providerRef`, `deliveredAt` and `failureReason` come from the delivery
 * provider or API where one is wired up. `viewedAt` is the exception: for the
 * Dashboard the system detects the view locally, and for Email, SMS and WhatsApp
 * it is set from the provider's read/open receipt.
 */
const NotificationDelivery = sequelize.define(
  'NotificationDelivery',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // The notification this attempt belongs to, by its generated reference, so
    // staff can join an evidence row back to the Customer Notifications table.
    notificationId: { type: DataTypes.STRING(20), allowNull: false },
    // Numeric link as well, so the two tables cannot drift apart on a rename.
    notificationRowId: { type: DataTypes.INTEGER, allowNull: true },

    channel: {
      type: DataTypes.ENUM('Dashboard', 'Email', 'SMS', 'WhatsApp'),
      allowNull: false,
    },
    // This channel's outcome only. Never the notification's overall status.
    deliveryStatus: {
      type: DataTypes.ENUM('Sent', 'Delivered', 'Viewed', 'Failed'),
      allowNull: false,
      defaultValue: 'Sent',
    },
    // Reference the provider returned, e.g. a message id.
    providerRef: { type: DataTypes.STRING(120), allowNull: true },
    attemptedAt: { type: DataTypes.DATE, allowNull: true },
    deliveredAt: { type: DataTypes.DATE, allowNull: true },
    // For the Dashboard this is the local detection; for the other channels it
    // comes from the provider's read receipt.
    viewedAt: { type: DataTypes.DATE, allowNull: true },
    failureReason: { type: DataTypes.STRING(255), allowNull: true },
    // Where the delivery went, so evidence is reproducible: the email address,
    // the masked mobile number, or 'Customer Dashboard'.
    destination: { type: DataTypes.STRING(160), allowNull: true },
  },
  {
    tableName: 'notification_deliveries',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['notification_id'] },
      { fields: ['user_id', 'channel'] },
    ],
  }
);

export default NotificationDelivery;
