import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ReturnRTO = sequelize.define(
  'ReturnRTO',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM('return', 'rto'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'initiated',
        'under_review',
        'approved',
        'rejected',
        'in_progress',
        'completed',
        'cancelled'
      ),
      defaultValue: 'initiated',
    },
    reason: { type: DataTypes.TEXT, allowNull: true },
    affectedItems: { type: DataTypes.JSON, allowNull: true },
    itemIds: { type: DataTypes.JSON, allowNull: true },
    requestedOn: { type: DataTypes.DATE, allowNull: true },
    processedOn: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    purchaseType: { type: DataTypes.STRING(50), allowNull: true },
  },
  {
    tableName: 'returns_rtos',
    timestamps: true,
    underscored: true,
  }
);

export default ReturnRTO;