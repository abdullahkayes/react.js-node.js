import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Address = sequelize.define(
  'Address',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING(50), allowNull: true },
    fullName: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    addressLine1: { type: DataTypes.STRING(255), allowNull: false },
    addressLine2: { type: DataTypes.STRING(255), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: false },
    state: { type: DataTypes.STRING(100), allowNull: true },
    postalCode: { type: DataTypes.STRING(20), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: 'addresses',
    timestamps: true,
    underscored: true,
  }
);

export default Address;
