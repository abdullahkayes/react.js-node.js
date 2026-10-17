import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Insurance = sequelize.define(
  'Insurance',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    insuranceId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    provider: { type: DataTypes.STRING(100), allowNull: false, defaultValue: 'Dazzling Insurance' },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'claimed', 'cancelled'),
      defaultValue: 'active',
    },
    coverageAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    premium: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
    eligibleItems: { type: DataTypes.JSON, allowNull: true },
    excludedItems: { type: DataTypes.JSON, allowNull: true },
    startDate: { type: DataTypes.DATE, allowNull: true },
    endDate: { type: DataTypes.DATE, allowNull: true },
    termsAndConditions: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'insurances',
    timestamps: true,
    underscored: true,
  }
);

export default Insurance;