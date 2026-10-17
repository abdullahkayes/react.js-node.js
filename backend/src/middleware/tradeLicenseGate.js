import { Op } from 'sequelize';
import { Customer, Document } from '../models/index.js';

/**
 * Trade License/Business document gate.
 *
 * E-commerce/F-commerce and Commercial customers must have a verified
 * Trade License/Business document before they can submit any request or
 * booking. Drafts are unaffected so a customer can keep working on a request;
 * only submission is blocked.
 *
 * The submitted status is read from the same place each route reads it, so this
 * middleware must run after the route's own validation/body parsing.
 */
const TRADE_LICENSE_REQUIRED_TYPES = ['ecommerce_merchant', 'commercial_import'];

const requireVerifiedTradeLicense = async (req, res, next) => {
  try {
    // Saving a draft is always allowed; only submission is gated.
    const status = (req.body && req.body.status) || 'Draft';
    if (status !== 'Submitted') return next();

    const userId = req.user && req.user.id;
    if (!userId) return next();

    const customer = await Customer.findByPk(userId, {
      attributes: ['id', 'account_type'],
    });
    if (!customer) return next();

    if (!TRADE_LICENSE_REQUIRED_TYPES.includes(customer.account_type)) return next();

    const verified = await Document.findOne({
      where: {
        userId,
        shipmentId: null,
        documentType: 'trade_license',
        verificationStatus: 'Verified',
      },
    });
    if (verified) return next();

    return res.status(403).json({
      error: 'Trade License/Business document verification required',
      message:
        'Your Trade License/Business document must be verified before you can submit a request or booking. ' +
        'Please upload a valid document from your profile, or contact support.',
      tradeLicenseRequired: true,
      tradeLicenseVerified: false,
    });
  } catch (err) {
    return next(err);
  }
};

export { requireVerifiedTradeLicense, TRADE_LICENSE_REQUIRED_TYPES };
