import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const SelfPurchaseItem = sequelize.define(
  'SelfPurchaseItem',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requestId: { type: DataTypes.INTEGER, allowNull: false },
    trackingNumber: { type: DataTypes.STRING(100), allowNull: false },
    itemSource: { type: DataTypes.STRING(50), allowNull: false },
    storeName: { type: DataTypes.STRING(100), allowNull: false },
    productCategory: { type: DataTypes.STRING(100), allowNull: false },
    productDescription: { type: DataTypes.TEXT, allowNull: false },
     quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    invoiceValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    productLink: { type: DataTypes.STRING(500), allowNull: true },
    itemType: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Product / Goods' },
    // Estimated dimensions in centimetres, entered by the customer at
    // submission. They are what the chargeable volume is derived from: cubic
    // metres for sea freight, volumetric weight for air. All three are nullable
    // because an item may be declared before its measurements are known.
    lengthCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    widthCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    heightCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    weightKg: { type: DataTypes.DECIMAL(10, 3), allowNull: true, defaultValue: null },
    // Invoice / receipt for this item. A document row is registered for it when
    // the file is verified, so it appears in the Documents table with its own
    // verification status.
    invoiceFilePath: { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
    // Item-level acceptance review. Every item starts Pending, and a request can
    // only be approved once every item is Approved.
    acceptanceStatus: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    acceptanceNote: { type: DataTypes.TEXT, allowNull: true },
    // How the reviewer classified the item. Kept separate from the decision,
    // because the same classification can be reached with different outcomes and
    // is useful on its own when reviewing why an item was rejected.
    //
    // Four classes, matching what the review modal offers and what the acceptance
    // endpoint accepts. A fifth, "Product-Specific Verification", used to be
    // stored here and was withdrawn from the workflow; no row carries it any more.
    acceptanceClassification: {
      type: DataTypes.ENUM('Allowed', 'Prohibited', 'Restricted', 'Conditionally Accepted'),
      allowNull: true,
      defaultValue: 'Allowed',
    },
    acceptanceReviewedAt: { type: DataTypes.DATE, allowNull: true },
    // Staff member who recorded the current decision.
    acceptanceReviewedBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'self_purchase_items',
    timestamps: true,
    underscored: true,
  }
);

export default SelfPurchaseItem;
