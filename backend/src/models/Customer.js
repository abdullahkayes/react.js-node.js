import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Customer = sequelize.define(
  'Customer',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    role: {
      type: DataTypes.ENUM('customer', 'admin', 'staff'),
      defaultValue: 'customer',
    },
    account_type: { type: DataTypes.STRING(50), allowNull: true },
    home_address: { type: DataTypes.STRING(255), allowNull: true },
    warehouse_address: { type: DataTypes.STRING(255), allowNull: true },
    whatsapp: { type: DataTypes.STRING(30), allowNull: true },
    trade_license: { type: DataTypes.STRING(255), allowNull: true },
    accountStatus: {
      type: DataTypes.ENUM('Active', 'Warning', 'Restricted', 'Suspended', 'Terminated', 'Closed', 'Dormant'),
      defaultValue: 'Active',
      allowNull: false,
    },
    // Contact verification. Phone and email are verified during registration,
    // so new accounts land on 'Verified'; the other values are used when a
    // contact method is optional or still awaiting confirmation.
    emailVerificationStatus: {
      type: DataTypes.ENUM('Not Required', 'Pending', 'Verified'),
      defaultValue: 'Not Required',
      allowNull: false,
    },
    phoneVerificationStatus: {
      type: DataTypes.ENUM('Not Required', 'Pending', 'Verified'),
      defaultValue: 'Not Required',
      allowNull: false,
    },
    emailVerifiedAt: { type: DataTypes.DATE, allowNull: true },
    phoneVerifiedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'customers',
    timestamps: true,
    underscored: true,
  }
);

export default Customer;
