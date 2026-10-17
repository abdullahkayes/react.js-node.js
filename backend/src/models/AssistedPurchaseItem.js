import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AssistedPurchaseItem = sequelize.define(
  'AssistedPurchaseItem',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requestId: { type: DataTypes.INTEGER, allowNull: false },
    productLink: { type: DataTypes.STRING(1000), allowNull: false },
    storeName: { type: DataTypes.STRING(200), allowNull: false },
    productName: { type: DataTypes.STRING(300), allowNull: false },
    productCategory: { type: DataTypes.STRING(100), allowNull: false },
    productDescription: { type: DataTypes.TEXT, allowNull: false },
     quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    productPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    variant: { type: DataTypes.STRING(300), allowNull: true },
     screenshotPath: { type: DataTypes.STRING(500), allowNull: true },
    itemType: { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'Products / Goods' },
    itemSource: { type: DataTypes.STRING(50), allowNull: true },
    // Estimated dimensions in centimetres. Nullable because the buyer can
    // measure the goods after purchase, long after the request was submitted.
    lengthCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    widthCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    heightCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    weightKg: { type: DataTypes.DECIMAL(10, 3), allowNull: true, defaultValue: null },
    // Item-level acceptance review, identical in meaning to the self-purchase
    // one: every item starts Pending and the request is approvable only when
    // every item is Approved.
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
    tableName: 'assisted_purchase_items',
    timestamps: true,
    underscored: true,
  }
);

export default AssistedPurchaseItem;
