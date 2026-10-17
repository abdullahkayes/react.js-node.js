import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const BookShipmentRequest = sequelize.define(
  'BookShipmentRequest',
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
        'In Transit',
        'Delivered',
        'Cancelled',
        // Set when the request is approved and a shipment is created from it.
        // The other two request types carry this value too, and approval writes
        // it, so it has to exist here for an export booking to be approvable.
        'Converted to Shipment'
      ),
      allowNull: false,
      defaultValue: 'Draft',
    },
    requestedServiceLevel: {
      type: DataTypes.ENUM('air', 'sea'),
      allowNull: false,
      defaultValue: 'air',
    },
    freightMode: {
      type: DataTypes.ENUM('air', 'sea'),
      allowNull: false,
      defaultValue: 'air',
    },
    customerType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Retail Customer',
    },
    pickupFrom: { type: DataTypes.STRING(200), allowNull: true },
    destinationCountry: { type: DataTypes.STRING(100), allowNull: true },
    consigneeName: { type: DataTypes.STRING(200), allowNull: true },
    consigneePhone: { type: DataTypes.STRING(50), allowNull: true },
    consigneeAddress: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    region: { type: DataTypes.STRING(100), allowNull: true },
    zipCode: { type: DataTypes.STRING(20), allowNull: true },
    shipmentInstructions: { type: DataTypes.TEXT, allowNull: true },
    addPackageInsurance: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    termsAccepted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    customsAccepted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    nidPath: { type: DataTypes.STRING(500), allowNull: true },
    paymentReceiptPath: { type: DataTypes.STRING(500), allowNull: true },
    // Export delivery instructions. The booking already stored a structured
    // consignee address above, so only the delivery method and any additional
    // customer instruction are added here.
    finalDeliveryMethod: { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
    customerInstructions: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    // Addresses the shipment will travel between, saved so approval can create
    // the shipment without asking the customer again.
    senderAddressId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    receiverAddressId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    submittedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'book_shipment_requests',
    timestamps: true,
    underscored: true,
  }
);

export default BookShipmentRequest;
