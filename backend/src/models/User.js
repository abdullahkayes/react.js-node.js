import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define(
  'User',
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
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;
