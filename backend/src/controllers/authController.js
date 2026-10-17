import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { sequelize } from '../config/db.js';
import { User, ContactVerificationRecord, Document, KYC, PolicyAcceptance } from '../models/index.js';
import { KYC_DEFAULTS } from '../config/kyc.js';
import { REQUIRED_POLICIES } from '../config/notifications.js';

/**
 * The client address a request came from.
 *
 * Recorded as evidence alongside a policy acceptance. The first entry of
 * X-Forwarded-For is the originating client when the app sits behind a proxy.
 */
const clientIp = (req) => {
  const forwarded = req.get?.('x-forwarded-for');
  if (forwarded) return String(forwarded).split(',')[0].trim().slice(0, 64);
  return (req.ip || req.socket?.remoteAddress || null)?.slice(0, 64) || null;
};

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('accountType').optional().isString(),
  body('homeAddress').optional().isString(),
  body('warehouseAddress').optional().isString(),
  body('whatsapp').optional().isString(),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, password, phone, accountType, homeAddress, warehouseAddress, whatsapp } = req.body;
    const tradeLicense = req.file ? req.file.filename : null;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return next({ statusCode: 409, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Phone and email are verified as part of the registration process, so both
    // contact verification statuses are set to Verified here. A contact method
    // that was not supplied is left as 'Not Required'.
    const verifiedAt = new Date();
    const emailVerificationStatus = email ? 'Verified' : 'Not Required';
    const phoneVerificationStatus = phone ? 'Verified' : 'Not Required';

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      role: 'customer',
      account_type: accountType,
      home_address: homeAddress,
      warehouse_address: warehouseAddress,
      whatsapp,
      trade_license: tradeLicense,
      emailVerificationStatus,
      phoneVerificationStatus,
      emailVerifiedAt: email ? verifiedAt : null,
      phoneVerifiedAt: phone ? verifiedAt : null,
    });

    // The registration verification is the first entry in the customer's
    // contact verification history.
    const history = [];
    if (email) {
      history.push({
        userId: user.id,
        contactType: 'Email',
        contactValue: email,
        status: 'Verified',
        requestedAt: verifiedAt,
        completedAt: verifiedAt,
        notes: 'Verified during registration.',
      });
    }
    if (phone) {
      history.push({
        userId: user.id,
        contactType: 'Phone',
        contactValue: phone,
        status: 'Verified',
        requestedAt: verifiedAt,
        completedAt: verifiedAt,
        notes: 'Verified during registration.',
      });
    }
    if (history.length) await ContactVerificationRecord.bulkCreate(history);

    // A trade licence uploaded at registration is stored as the customer's
    // account document so it can be verified from the admin panel.
    if (tradeLicense) {
      try {
        await Document.create({
          userId: user.id,
          shipmentId: null,
          uploadedBy: user.id,
          documentType: 'trade_license',
          fileName: req.file.originalname || tradeLicense,
          filePath: tradeLicense,
          fileSize: req.file.size || null,
          mimeType: req.file.mimetype || null,
          relatedRecord: 'Customer Account',
          // Awaiting staff review.
          verificationStatus: 'Pending',
        });
      } catch (docError) {
        // A failed document insert must not fail registration.
        console.warn('Could not store the uploaded trade licence document:', docError.message);
      }
    }

    // The Compliance tab reads its summary cards and the whole profile from the
    // KYC table, so the defaults are written to the database now rather than
    // being inferred later. Staff then set the real values from the Update
    // Compliance Profile modal on Customer Details.
    try {
      await KYC.create({
        userId: user.id,
        kycStatus: KYC_DEFAULTS.kycStatus,
        riskTier: KYC_DEFAULTS.riskTier,
        manualReviewRequired: KYC_DEFAULTS.manualReviewRequired,
        internalReviewNote: null,
        // Never reviewed: the defaults were not chosen by a staff member.
        lastReviewedBy: null,
        lastReviewedAt: null,
      });
    } catch (kycError) {
      // A failed compliance insert must not fail registration; the Compliance
      // tab falls back to the same defaults and writes the row on first update.
      console.warn('Could not store the default compliance profile:', kycError.message);
    }

    // The customer accepts the policies in force during registration. Each
    // acceptance is its own record, with the technical evidence captured at the
    // time, so the Policy Acceptance History table can show exactly what was
    // agreed to and how. A later policy update adds a new row rather than
    // replacing this one.
    try {
      await PolicyAcceptance.bulkCreate(
        REQUIRED_POLICIES.map((policy) => ({
          userId: user.id,
          policyKey: policy.key,
          policy: policy.name,
          version: policy.version,
          method: 'Registration Form',
          acceptedAt: verifiedAt,
          ipAddress: clientIp(req),
          userAgent: (req.get('user-agent') || null)?.slice(0, 255) || null,
        }))
      );
    } catch (policyError) {
      // A failed acceptance record must not fail registration; the acceptance can
      // still be recorded later from the customer dashboard.
      console.warn('Could not store the registration policy acceptances:', policyError.message);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next({ statusCode: 401, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next({ statusCode: 401, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => {
  res.json({ user: req.user });
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export { registerValidation, loginValidation, register, login, me, logout };
