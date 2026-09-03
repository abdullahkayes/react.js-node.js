import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const TrackingEvent = sequelize.define(
  'TrackingEvent',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shipmentId: { type: DataTypes.INTEGER, allowNull: false },
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
      allowNull: false,
    },
    location: { type: DataTypes.STRING(255), allowNull: true },
    note: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: 'tracking_events',
    timestamps: true,
    underscored: true,
  }
);

export default TrackingEvent;
