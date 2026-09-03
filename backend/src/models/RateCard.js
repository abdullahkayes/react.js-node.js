import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const RateCard = sequelize.define(
  'RateCard',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    originZone: { type: DataTypes.STRING(50), allowNull: false },
    destinationZone: { type: DataTypes.STRING(50), allowNull: false },
    serviceType: {
      type: DataTypes.ENUM('standard', 'express', 'priority'),
      allowNull: false,
    },
    pricePerKg: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    baseFee: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'USD' },
  },
  {
    tableName: 'rate_cards',
    timestamps: true,
    underscored: true,
  }
);

export default RateCard;
