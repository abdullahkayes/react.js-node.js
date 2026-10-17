import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Shipment = sequelize.define(
  'Shipment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shipmentId: { type: DataTypes.STRING(50), allowNull: false },
    trackingNumber: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // A shipment created from a pre-alert request exists from the moment the
    // request is approved, which can be before the customer has confirmed an
    // address pair. Both addresses are therefore nullable and are filled in when
    // they are known. The customer-facing create endpoint still requires both,
    // so a directly-booked shipment is never created without them.
    senderAddressId: { type: DataTypes.INTEGER, allowNull: true },
    receiverAddressId: { type: DataTypes.INTEGER, allowNull: true },
    serviceType: {
      type: DataTypes.ENUM('standard', 'express', 'priority'),
      allowNull: false,
    },
    serviceMode: {
      type: DataTypes.ENUM('Import', 'Export'),
      allowNull: false,
      defaultValue: 'Import',
    },
    purchaseType: {
      type: DataTypes.ENUM('Self-Purchase', 'Assisted Purchase', 'N/A'),
      allowNull: true,
      defaultValue: 'Self-Purchase',
    },
    sourceRequestType: {
      type: DataTypes.ENUM('self_purchase', 'assisted_purchase', 'export_booking', 'direct'),
      allowNull: true,
      defaultValue: 'direct',
    },
    sourceRequestId: { type: DataTypes.STRING(50), allowNull: true },
    weightKg: { type: DataTypes.DECIMAL(10, 3), allowNull: false },
    dimensions: { type: DataTypes.JSON, allowNull: true },
    declaredValue: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'pending', 'paid', 'refunded'),
      allowNull: false,
      defaultValue: 'unpaid',
    },
    status: {
      type: DataTypes.ENUM(
        'Awaiting Carrier Tracking',
        'Awaiting Arrival at USA Warehouse',
        'Awaiting Arrival at Dhaka Hub',
        'Received at USA Warehouse',
        'Received at Dhaka Hub',
        'On Hold',
        'On Customs Hold',
        'On Carrier Hold',
        'In Transit to Warehouse',
        'Consolidation in Progress',
        'Shipment Locked',
        'Ready for Dispatch',
        'Shipped',
        'In International Transit',
        'Arrived at Destination Country',
        'Customs Clearance in Progress',
        'Released from Customs',
        'Sorting at Hub',
        'Out for Delivery',
        'Delivered',
        'Failed Delivery',
        'Cancelled',
        'Disposed',
        'Seized'
      ),
      defaultValue: 'Awaiting Carrier Tracking',
    },
    /* Lost Status. A shipment is flagged lost only after the loss has been
       confirmed, and only then does it carry a Loss Confirmation Date. These
       back the Coverage End Date rule on the Insurance & Claims tab. */
    isLost: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    lostConfirmedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'shipments',
    timestamps: true,
    underscored: true,
  }
);

export default Shipment;
