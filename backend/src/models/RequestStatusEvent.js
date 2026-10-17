import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Shipment Request Status history.
 *
 * A separate table from tracking_events on purpose. The two record different
 * things and hold different vocabularies: this one is where the request or
 * booking is in its own workflow, tracking_events is where the shipment is in
 * its operational lifecycle. Keeping them apart is what stops a request status
 * being read as though it were the next step in a shipment's journey.
 *
 * A request's own row carries its current status, but not how it got there. This
 * table is the history, written each time the request workflow moves a request
 * on, so the timeline can show every recorded request status rather than only
 * the one that happens to be current.
 */
const RequestStatusEvent = sequelize.define(
  'RequestStatusEvent',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // The request this status belongs to, addressed by the business reference
    // the request tables use, so the row survives the request being read back
    // through its own table rather than a numeric id that could be reused.
    requestType: {
      type: DataTypes.ENUM('self_purchase', 'assisted_purchase', 'export_booking'),
      allowNull: false,
    },
    requestId: { type: DataTypes.STRING(50), allowNull: false },
    // The shipment the request became, when it became one. A request that is
    // still working through its own workflow has no shipment yet, which is why
    // this is nullable rather than required.
    shipmentId: { type: DataTypes.INTEGER, allowNull: true },
    status: {
      type: DataTypes.ENUM(
        'Draft',
        'Submitted',
        'Under Review',
        'Need More Information',
        'Approved',
        'Rejected',
        'Cancelled'
      ),
      allowNull: false,
    },
    // The system-generated label for the status, copied at the time it was
    // recorded rather than looked up on read, so rewording a label later cannot
    // silently rewrite history that a customer was already shown.
    label: { type: DataTypes.STRING(255), allowNull: true },
    visibility: { type: DataTypes.ENUM('Customer Visible', 'Internal Only'), allowNull: false, defaultValue: 'Customer Visible' },
    // Who or what raised it. A request status is set by the workflow, so this is
    // 'System' except where a staff member made the decision.
    createdBy: { type: DataTypes.STRING(120), allowNull: true },
  },
  {
    tableName: 'request_status_events',
    timestamps: true,
    underscored: true,
  }
);

export default RequestStatusEvent;
