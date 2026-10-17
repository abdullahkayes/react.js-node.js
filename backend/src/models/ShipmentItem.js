import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ShipmentItem = sequelize.define(
  'ShipmentItem',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false },
    requestItemId: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING(100), allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    weightKg: { type: DataTypes.DECIMAL(10, 3), allowNull: true },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    hsCode: { type: DataTypes.STRING(20), allowNull: true },
    countryOfOrigin: { type: DataTypes.STRING(100), allowNull: true },
  },
  {
    tableName: 'shipment_items',
    timestamps: true,
    underscored: true,
  }
);

export default ShipmentItem;