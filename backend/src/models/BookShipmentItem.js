import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const BookShipmentItem = sequelize.define(
  'BookShipmentItem',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requestId: { type: DataTypes.INTEGER, allowNull: false },
    itemType: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Products / Goods' },
    itemSource: { type: DataTypes.STRING(50), allowNull: false },
    trackingNumber: { type: DataTypes.STRING(100), allowNull: true },
    sellerStoreName: { type: DataTypes.STRING(200), allowNull: true },
    productDescription: { type: DataTypes.TEXT, allowNull: false },
    productCategory: { type: DataTypes.STRING(100), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    invoiceValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    packageCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    estimatedWeight: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    length: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    width: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    height: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    hsCode: { type: DataTypes.STRING(50), allowNull: true },
    countryOfOrigin: { type: DataTypes.STRING(100), allowNull: true },
    productUrl: { type: DataTypes.STRING(500), allowNull: true },
    invoiceFilePath: { type: DataTypes.STRING(500), allowNull: true },
    packingListPath: { type: DataTypes.STRING(500), allowNull: true },
    supportingDocsPath: { type: DataTypes.STRING(500), allowNull: true },
    // Item-level acceptance review. The export booking item table already carries
    // length/width/height, so only the review state is added here.
    acceptanceStatus: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    acceptanceNote: { type: DataTypes.TEXT, allowNull: true },
    acceptanceClassification: {
      type: DataTypes.ENUM('Allowed', 'Prohibited', 'Restricted', 'Conditionally Accepted'),
      allowNull: true,
      defaultValue: 'Allowed',
    },
    acceptanceReviewedAt: { type: DataTypes.DATE, allowNull: true },
    acceptanceReviewedBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'book_shipment_items',
    timestamps: true,
    underscored: true,
  }
);

export default BookShipmentItem;
