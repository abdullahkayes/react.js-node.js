import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One row per notification sent to a customer.
 *
 * This is the row the Communications & Audit tab lists in Customer Notifications,
 * one per notification regardless of how many channels it went out on. The
 * per-channel detail lives in NotificationDelivery, so this table holds the
 * overall status only.
 *
 * `status` is the overall status derived from every channel (Viewed > Delivered >
 * Sent > Failed) and is never set by hand: it is recomputed whenever a delivery
 * row changes, so the two tables can never disagree.
 *
 * The row is also the customer's dashboard inbox entry. `viewedAt` is written
 * only when the customer opens it there - opening a notification from the admin
 * panel reads this row and deliberately leaves `viewedAt` alone, because staff
 * reading a notification is not the customer receiving it.
 */
const CustomerNotification = sequelize.define(
  'CustomerNotification',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // Generated reference shown in place of the numeric id.
    notificationId: { type: DataTypes.STRING(20), allowNull: false },
    // Vocabulary comes from config/notifications.js.
    notificationType: {
      type: DataTypes.ENUM(
        'General',
        'Shipment',
        'Payment',
        'Policy Update',
        'Account',
        'Formal',
        'Notice',
        'Wallet',
        'Claim',
        'Return',
        'RTO',
        'Others'
      ),
      allowNull: false,
      defaultValue: 'General',
    },
    title: { type: DataTypes.STRING(150), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    // Record the notification is about, so staff can trace it back to the ERP
    // entity that triggered it (a shipment, a case, a payment and so on).
    relatedRecord: { type: DataTypes.STRING(100), allowNull: true },
    // Channels this notification went out on, kept for the Channels column.
    channels: { type: DataTypes.TEXT, allowNull: true },

    // Overall status across every channel. Recomputed from the delivery rows.
    status: {
      type: DataTypes.ENUM('Sent', 'Delivered', 'Viewed', 'Failed'),
      allowNull: false,
      defaultValue: 'Sent',
    },
    sentAt: { type: DataTypes.DATE, allowNull: true },
    // Set only when the customer views it on a customer-facing surface.
    viewedAt: { type: DataTypes.DATE, allowNull: true },

    // Whether the notification was raised by the system or sent by a staff
    // member from the Send Notification modal.
    source: { type: DataTypes.ENUM('system', 'staff'), allowNull: false, defaultValue: 'system' },
    // Staff member who sent it, for manual notifications.
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    // Free reference to the entity that raised it, e.g. an account case id.
    sourceRef: { type: DataTypes.STRING(60), allowNull: true },
  },
  {
    tableName: 'customer_notifications',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['notification_id'] },
      { fields: ['user_id', 'status'] },
      { fields: ['user_id', 'notification_type'] },
    ],
  }
);

export default CustomerNotification;
