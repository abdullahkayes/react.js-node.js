import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Shipment = sequelize.define(
  'Shipment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    trackingNumber: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    senderAddressId: { type: DataTypes.INTEGER, allowNull: false },
    receiverAddressId: { type: DataTypes.INTEGER, allowNull: false },
    serviceType: {
      type: DataTypes.ENUM('standard', 'express', 'priority'),
      allowNull: false,
    },
    weightKg: { type: DataTypes.DECIMAL(10, 3), allowNull: false },
    dimensions: { type: DataTypes.JSON, allowNull: true },
    declaredValue: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
      defaultValue: 'unpaid',
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'picked_up',
        'in_transit',
        'customs',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned'
      ),
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'shipments',
    timestamps: true,
    underscored: true,
  }
);

export default Shipment;
