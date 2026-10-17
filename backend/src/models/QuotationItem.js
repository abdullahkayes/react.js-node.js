import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One line item on a quotation.
 *
 * Both currency columns are stored so a line total never has to be re-derived
 * from a rate that may have moved since the quotation was sent. The unit price
 * is held in BDT and USD for the same reason: whichever one staff typed, the
 * other was filled in from the imported exchange rate and both are kept.
 */
const QuotationItem = sequelize.define(
  'QuotationItem',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quotationId: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 1 },
    unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },

    /* The unit staff typed in the editable Unit field - "KG", "Job", "PCS".
       Free text by design, never a dropdown. */
    unit: { type: DataTypes.STRING(30), allowNull: true },

    unitPriceBdt: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    unitPriceUsd: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    amountBdt: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    amountUsd: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'quotation_items',
    timestamps: true,
    underscored: true,
  }
);

export default QuotationItem;
