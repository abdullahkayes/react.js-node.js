import express from 'express';
import fs from 'fs';
import path from 'path';
import { body, validationResult, query } from 'express-validator';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { requireVerifiedTradeLicense } from '../middleware/tradeLicenseGate.js';
import { SelfPurchaseRequest, SelfPurchaseItem } from '../models/index.js';

const router = express.Router();

router.use(auth);

const generateRequestId = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.floor(100 + Math.random() * 9000);
  return `PA-${year}${month}${day}${random}`;
};

const validateRequest = [
  body('freightMode').isIn(['air', 'sea']).withMessage('Freight mode must be air or sea'),
  body('customerType').notEmpty().withMessage('Customer type is required'),
  body('confirmTerms').isBoolean().withMessage('Terms confirmation is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.itemSource').notEmpty().withMessage('Item source is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('items.*.invoiceValue').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Invoice value must be a non-negative number'),
  body('status').optional().isIn([
    'Draft',
    'Submitted',
    'Under Review',
    'Need More Information',
    'Approved',
    'Rejected',
    'Cancelled',
    'Converted to Shipment',
  ]).withMessage('Invalid status value'),
];

const validateSubmittedRequest = [
  body('freightMode').isIn(['air', 'sea']).withMessage('Freight mode must be air or sea'),
  body('customerType').notEmpty().withMessage('Customer type is required'),
  body('confirmTerms').isBoolean().withMessage('Terms confirmation is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.trackingNumber').notEmpty().withMessage('Tracking number is required for each item'),
  body('items.*.itemSource').notEmpty().withMessage('Item source is required for each item'),
  body('items.*.storeName').notEmpty().withMessage('Store/seller name is required for each item'),
  body('items.*.productCategory').notEmpty().withMessage('Product category is required for each item'),
  body('items.*.productDescription').notEmpty().withMessage('Product description is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.invoiceValue').isFloat({ min: 0 }).withMessage('Invoice value must be a non-negative number'),
];

const conditionalValidation = (req, res, next) => {
  const validations = req.body.status === 'Submitted' ? validateSubmittedRequest : validateRequest;
  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    next();
  }).catch(next);
};

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isString(),
  ],
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const where = { userId: req.user.id };
      if (req.query.status) {
        where.status = req.query.status;
      }

      const { count, rows } = await SelfPurchaseRequest.findAndCountAll({
        where,
        include: [{ model: SelfPurchaseItem, as: 'items' }],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      res.json({ requests: rows, total: count, page, pages: Math.ceil(count / limit) });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/recent', async (req, res, next) => {
  try {
    const recent = await SelfPurchaseRequest.findAll({
      where: { userId: req.user.id },
      include: [{ model: SelfPurchaseItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
      limit: 3,
    });
    res.json(recent);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const request = await SelfPurchaseRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: SelfPurchaseItem, as: 'items' }],
    });

    if (!request) {
      return next({ statusCode: 404, message: 'Pre-alert request not found' });
    }

    res.json(request);
  } catch (err) {
    next(err);
  }
});

router.get('/:requestId/details/:requestIdParam', async (req, res, next) => {
  try {
    const request = await SelfPurchaseRequest.findOne({
      where: { userId: req.user.id },
      include: [{ model: SelfPurchaseItem, as: 'items' }],
    });

    if (!request) {
      return next({ statusCode: 404, message: 'Pre-alert request not found' });
    }

    res.json(request);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  conditionalValidation,
  requireVerifiedTradeLicense,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });
      }

      const {
        freightMode,
        customerType,
        specialInstruction,
        addInsurance,
        confirmTerms,
        status: incomingStatus,
        items,
      } = req.body;

      let request;

      const statusToUse = incomingStatus || 'Draft';
      const isSubmit = statusToUse === 'Submitted';

      const existingDraft = await SelfPurchaseRequest.findOne({
        where: { userId: req.user.id, status: 'Draft' },
      });

      if (existingDraft) {
        request = existingDraft;
        if (freightMode) request.freightMode = freightMode;
        if (customerType) request.customerType = customerType;
        request.specialInstruction = specialInstruction || null;
        request.addInsurance = addInsurance || false;
        request.confirmTerms = confirmTerms;
        if (isSubmit) {
          request.status = 'Submitted';
          request.submittedAt = new Date();
        }
        await request.save();
      } else {
        request = await SelfPurchaseRequest.create({
          requestId: generateRequestId(),
          userId: req.user.id,
          status: statusToUse,
          freightMode,
          customerType,
          specialInstruction,
          addInsurance: addInsurance || false,
          confirmTerms,
          ...(isSubmit ? { submittedAt: new Date() } : {}),
        });
      }

      await SelfPurchaseItem.destroy({ where: { requestId: request.id } });

      const createdItems = await Promise.all(
        items.map((item) =>
          SelfPurchaseItem.create({
            requestId: request.id,
            trackingNumber: item.trackingNumber || '',
            itemSource: item.itemSource || '',
            storeName: item.storeName || '',
            productCategory: item.productCategory || '',
            productDescription: item.productDescription || '',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : null,
            invoiceValue: item.invoiceValue ? parseFloat(item.invoiceValue) : (item.unitPrice && item.quantity ? parseFloat(item.unitPrice) * Number(item.quantity) : 0),
            productLink: item.productLink || null,
          })
        )
      );

      const updatedRequest = await SelfPurchaseRequest.findByPk(request.id, {
        include: [{ model: SelfPurchaseItem, as: 'items' }],
      });

      res.status(201).json(updatedRequest);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:id',
  conditionalValidation,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });
      }

      const request = await SelfPurchaseRequest.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });

      if (!request) {
        return next({ statusCode: 404, message: 'Pre-alert request not found' });
      }

      const {
        freightMode,
        customerType,
        specialInstruction,
        addInsurance,
        confirmTerms,
        status,
        items,
      } = req.body;

      const EDITABLE_STATUSES = ['Draft', 'Submitted', 'Under Review', 'Need More Information'];

      if (status && !EDITABLE_STATUSES.includes(request.status)) {
        return next({ statusCode: 400, message: 'Cannot modify request in current status' });
      }

      if (status && EDITABLE_STATUSES.includes(request.status)) {
        request.status = status;
      }

      if (freightMode) request.freightMode = freightMode;
      if (customerType) request.customerType = customerType;
      request.specialInstruction = specialInstruction || null;
      request.addInsurance = addInsurance || false;
      request.confirmTerms = confirmTerms;

      if (status === 'Submitted' && request.submittedAt === null) {
        request.submittedAt = new Date();
      }

      await request.save();

      if (items && items.length > 0) {
        await SelfPurchaseItem.destroy({ where: { requestId: request.id } });
          await SelfPurchaseItem.bulkCreate(
          items.map((item) => ({
            requestId: request.id,
            itemType: item.itemType || 'Products / Goods',
            trackingNumber: item.trackingNumber || '',
            itemSource: item.itemSource || '',
            storeName: item.storeName || '',
            productCategory: item.productCategory || '',
            productDescription: item.productDescription || '',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : null,
            invoiceValue: item.invoiceValue ? parseFloat(item.invoiceValue) : (item.unitPrice && item.quantity ? parseFloat(item.unitPrice) * Number(item.quantity) : 0),
            productLink: item.productLink || null,
          }))
        );
      }

      const updatedRequest = await SelfPurchaseRequest.findByPk(request.id, {
        include: [{ model: SelfPurchaseItem, as: 'items' }],
      });

      res.json(updatedRequest);
    } catch (err) {
      next(err);
    }
  }
);

router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    const ALLOWED_STATUSES = [
      'Draft',
      'Submitted',
      'Under Review',
      'Need More Information',
      'Approved',
      'Rejected',
      'Cancelled',
      'Converted to Shipment',
    ];

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return next({ statusCode: 400, message: 'Invalid status value' });
    }

    const request = await SelfPurchaseRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!request) {
      return next({ statusCode: 404, message: 'Pre-alert request not found' });
    }

    const EDITABLE_STATUSES = ['Draft', 'Submitted', 'Under Review', 'Need More Information'];

    if (!EDITABLE_STATUSES.includes(request.status)) {
      return next({
        statusCode: 400,
        message: `Cannot update status from ${request.status}. Request is no longer editable.`,
      });
    }

    request.status = status;

    if (status === 'Submitted' && request.submittedAt === null) {
      request.submittedAt = new Date();
    }

    await request.save();

    const updatedRequest = await SelfPurchaseRequest.findByPk(request.id, {
      include: [{ model: SelfPurchaseItem, as: 'items' }],
    });

    res.json(updatedRequest);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/cancel', async (req, res, next) => {
  try {
    const request = await SelfPurchaseRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!request) {
      return next({ statusCode: 404, message: 'Pre-alert request not found' });
    }

    const NON_CANCELABLE = ['Approved', 'Rejected', 'Cancelled'];
    if (NON_CANCELABLE.includes(request.status)) {
      return next({
        statusCode: 400,
        message: `Cannot cancel request in ${request.status} status.`,
      });
    }

    request.status = 'Cancelled';
    await request.save();

    const updatedRequest = await SelfPurchaseRequest.findByPk(request.id, {
      include: [{ model: SelfPurchaseItem, as: 'items' }],
    });

    res.json(updatedRequest);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  res.status(405).json({
    error: 'Direct deletion is not allowed. Use the Cancel endpoint to mark a request as Cancelled.',
  });
});

const SELF_EDITABLE_STATUSES = ['Draft', 'Submitted', 'Under Review', 'Need More Information'];

router.post('/:id/files', upload.fields([
  { name: 'nid', maxCount: 1 },
]), async (req, res, next) => {
  try {
    const request = await SelfPurchaseRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!request) return next({ statusCode: 404, message: 'Pre-alert request not found' });
    if (!SELF_EDITABLE_STATUSES.includes(request.status)) {
      return next({ statusCode: 400, message: 'Cannot modify request in current status' });
    }

    const nidFile = req.files?.nid?.[0];
    if (nidFile) {
      if (request.nidPath) fs.promises.unlink(path.resolve(request.nidPath)).catch(() => {});
      request.nidPath = `/uploads/${nidFile.filename}`;
      await request.save();
    }

    const updatedRequest = await SelfPurchaseRequest.findByPk(request.id, {
      include: [{ model: SelfPurchaseItem, as: 'items' }],
    });

    res.json(updatedRequest);
  } catch (err) {
    next(err);
  }
});

export default router;
