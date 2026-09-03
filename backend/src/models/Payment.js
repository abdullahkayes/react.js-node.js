import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Payment = sequelize.define(
  'Payment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    provider: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'stripe' },
    providerRef: { type: DataTypes.STRING(255), allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
  }
);

export default Payment;
