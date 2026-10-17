import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const SelfPurchaseRequest = sequelize.define(
  'SelfPurchaseRequest',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requestId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        'Draft',
        'Submitted',
        'Under Review',
        'Need More Information',
        'Approved',
        'Rejected',
        'Cancelled',
        'Converted to Shipment'
      ),
      allowNull: false,
      defaultValue: 'Draft',
    },
    freightMode: {
      type: DataTypes.ENUM('air', 'sea'),
      allowNull: false,
      defaultValue: 'air',
    },
    customerType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Individual',
    },
    specialInstruction: { type: DataTypes.TEXT, allowNull: true },
    addInsurance: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    confirmTerms: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    nidPath: { type: DataTypes.STRING(500), allowNull: true },
    submittedAt: { type: DataTypes.DATE, allowNull: true },
    // Commercial import delivery instructions, chosen by the customer when the
    // request was submitted.
    finalDeliveryMethod: { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
    deliveryAddress: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    customerInstructions: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    // Addresses the shipment will travel between. Kept on the request so approval
    // can create the shipment without asking the customer again; either may be
    // null until the customer has saved an address.
    senderAddressId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    receiverAddressId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  },
  {
    tableName: 'self_purchase_requests',
    timestamps: true,
    underscored: true,
  }
);

export default SelfPurchaseRequest;
