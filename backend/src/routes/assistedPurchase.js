import express from 'express';
import fs from 'fs';
import path from 'path';
import { body, validationResult, query } from 'express-validator';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { requireVerifiedTradeLicense } from '../middleware/tradeLicenseGate.js';
import { AssistedPurchaseRequest, AssistedPurchaseItem } from '../models/index.js';

const router = express.Router();

router.use(auth);

const generateRequestId = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.floor(100 + Math.random() * 9000);
  return `AP-${year}${month}${day}${random}`;
};

const STATUSES = [
  'Draft',
  'Submitted',
  'Under Review',
  'Need More Information',
  'Approved',
  'Rejected',
  'Purchased',
  'In Warehouse',
  'Cancelled',
  'Converted to Shipment',
];

const EDITABLE_STATUSES = ['Draft', 'Submitted', 'Under Review', 'Need More Information'];

const validateRequest = [
  body('requestedServiceLevel').isIn(['air', 'sea']).withMessage('Requested service level must be air or sea'),
  body('freightMode').isIn(['air', 'sea']).withMessage('Freight mode must be air or sea'),
  body('customerType').notEmpty().withMessage('Customer type is required'),
  body('confirmTerms').isBoolean().withMessage('Terms confirmation is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.itemSource').notEmpty().withMessage('Item source is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('items.*.productPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Product price must be a non-negative number'),
  body('status').optional().isIn(STATUSES).withMessage('Invalid status value'),
];

const validateSubmittedRequest = [
  body('requestedServiceLevel').isIn(['air', 'sea']).withMessage('Requested service level must be air or sea'),
  body('freightMode').isIn(['air', 'sea']).withMessage('Freight mode must be air or sea'),
  body('customerType').notEmpty().withMessage('Customer type is required'),
  body('confirmTerms').isBoolean().withMessage('Terms confirmation is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productLink').notEmpty().withMessage('Product link is required for each item'),
  body('items.*.storeName').notEmpty().withMessage('Store name is required for each item'),
  body('items.*.productName').notEmpty().withMessage('Product name is required for each item'),
  body('items.*.productCategory').notEmpty().withMessage('Product category is required for each item'),
  body('items.*.productDescription').notEmpty().withMessage('Product description is required for each item'),
  body('items.*.itemSource').notEmpty().withMessage('Item source is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('items.*.productPrice').isFloat({ min: 0 }).withMessage('Product price must be a non-negative number'),
];

const conditionalValidation = (req, res, next) => {
  const validations = req.body.status === 'Submitted' ? validateSubmittedRequest : validateRequest;
  Promise.all(validations.map((validation) => validation.run(req))).then(() => next()).catch(next);
};

const serializeItem = (item) => ({
  itemType: item.itemType || 'Products / Goods',
  itemSource: item.itemSource || '',
  productLink: item.productLink || '',
  storeName: item.storeName || '',
  productName: item.productName || '',
  productCategory: item.productCategory || '',
  productDescription: item.productDescription || '',
  quantity: item.quantity || 1,
  unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : null,
  productPrice: item.productPrice ? parseFloat(item.productPrice) : (item.unitPrice && item.quantity ? parseFloat(item.unitPrice) * Number(item.quantity) : 0),
  variant: item.variant || null,
  screenshotPath: item.screenshotPath || null,
});

const updateRequestItems = async (request, items) => {
  await AssistedPurchaseItem.destroy({ where: { requestId: request.id } });
  await AssistedPurchaseItem.bulkCreate(items.map((item) => ({ requestId: request.id, ...serializeItem(item) })));
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
      const where = { userId: req.user.id };
      if (req.query.status) where.status = req.query.status;
      const { count, rows } = await AssistedPurchaseRequest.findAndCountAll({
        where,
        include: [{ model: AssistedPurchaseItem, as: 'items' }],
        order: [['createdAt', 'DESC']],
        limit,
        offset: (page - 1) * limit,
      });
      res.json({ requests: rows, total: count, page, pages: Math.ceil(count / limit) });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/recent', async (req, res, next) => {
  try {
    const recent = await AssistedPurchaseRequest.findAll({
      where: { userId: req.user.id },
      include: [{ model: AssistedPurchaseItem, as: 'items' }],
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
    const request = await AssistedPurchaseRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: AssistedPurchaseItem, as: 'items' }],
    });
    if (!request) return next({ statusCode: 404, message: 'Assisted purchase request not found' });
    res.json(request);
  } catch (err) {
    next(err);
  }
});

router.post('/', conditionalValidation, requireVerifiedTradeLicense, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });

    const {
      requestedServiceLevel,
      freightMode,
      customerType,
      specialInstruction,
      addInsurance,
      confirmTerms,
      status: incomingStatus,
      items,
    } = req.body;
    const statusToUse = incomingStatus || 'Draft';
    const isSubmit = statusToUse === 'Submitted';
    let request = await AssistedPurchaseRequest.findOne({
      where: { userId: req.user.id, status: 'Draft' },
    });

    if (request) {
      request.requestedServiceLevel = requestedServiceLevel;
      request.freightMode = freightMode;
      request.customerType = customerType;
      request.specialInstruction = specialInstruction || null;
      request.addInsurance = Boolean(addInsurance);
      request.confirmTerms = confirmTerms;
      if (isSubmit) {
        request.status = 'Submitted';
        request.submittedAt = new Date();
      }
      await request.save();
    } else {
      request = await AssistedPurchaseRequest.create({
        requestId: generateRequestId(),
        userId: req.user.id,
        status: statusToUse,
        requestedServiceLevel,
        freightMode,
        customerType,
        specialInstruction,
        addInsurance: Boolean(addInsurance),
        confirmTerms,
        ...(isSubmit ? { submittedAt: new Date() } : {}),
      });
    }

    await updateRequestItems(request, items);
    const updatedRequest = await AssistedPurchaseRequest.findByPk(request.id, {
      include: [{ model: AssistedPurchaseItem, as: 'items' }],
    });
    res.status(201).json(updatedRequest);
  } catch (err) {
    next(err);
  }
});

router.put(
  '/:id',
  conditionalValidation,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });

      const request = await AssistedPurchaseRequest.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });
      if (!request) return next({ statusCode: 404, message: 'Assisted purchase request not found' });

      const {
        requestedServiceLevel,
        freightMode,
        customerType,
        specialInstruction,
        addInsurance,
        confirmTerms,
        status,
        items,
      } = req.body;

      if (status && !EDITABLE_STATUSES.includes(request.status)) {
        return next({ statusCode: 400, message: 'Cannot modify request in current status' });
      }
      if (status) request.status = status;
      request.requestedServiceLevel = requestedServiceLevel;
      request.freightMode = freightMode;
      request.customerType = customerType;
      request.specialInstruction = specialInstruction || null;
      request.addInsurance = Boolean(addInsurance);
      request.confirmTerms = confirmTerms;
      if (status === 'Submitted' && !request.submittedAt) request.submittedAt = new Date();
      await request.save();

      if (items) await updateRequestItems(request, items);
      const updatedRequest = await AssistedPurchaseRequest.findByPk(request.id, {
        include: [{ model: AssistedPurchaseItem, as: 'items' }],
      });
      res.json(updatedRequest);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/:id/files', upload.fields([
  { name: 'nid', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 },
]), async (req, res, next) => {
  try {
    const request = await AssistedPurchaseRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: AssistedPurchaseItem, as: 'items' }],
    });
    if (!request) return next({ statusCode: 404, message: 'Assisted purchase request not found' });
    if (!EDITABLE_STATUSES.includes(request.status)) {
      return next({ statusCode: 400, message: 'Cannot modify request in current status' });
    }

    const nidFile = req.files?.nid?.[0];
    if (nidFile) {
      if (request.nidPath) fs.promises.unlink(path.resolve(request.nidPath)).catch(() => {});
      request.nidPath = `/uploads/${nidFile.filename}`;
    }

    const screenshots = req.files?.screenshots || [];
    if (screenshots.length > 0) {
      let screenshotIndexes = [];
      try {
        screenshotIndexes = JSON.parse(req.body.screenshotIndexes || '[]');
      } catch {
        screenshotIndexes = [];
      }
      await Promise.all(screenshots.map(async (file, index) => {
        const item = request.items[screenshotIndexes[index]];
        if (!item) return;
        if (item.screenshotPath) fs.promises.unlink(path.resolve(item.screenshotPath)).catch(() => {});
        await item.update({ screenshotPath: `/uploads/${file.filename}` });
      }));
    }

    await request.save();
    const updatedRequest = await AssistedPurchaseRequest.findByPk(request.id, {
      include: [{ model: AssistedPurchaseItem, as: 'items' }],
    });
    res.json(updatedRequest);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !STATUSES.includes(status)) return next({ statusCode: 400, message: 'Invalid status value' });
    const request = await AssistedPurchaseRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!request) return next({ statusCode: 404, message: 'Assisted purchase request not found' });
    if (!EDITABLE_STATUSES.includes(request.status)) {
      return next({ statusCode: 400, message: `Cannot update status from ${request.status}. Request is no longer editable.` });
    }
    request.status = status;
    if (status === 'Submitted' && !request.submittedAt) request.submittedAt = new Date();
    await request.save();
    res.json(request);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/cancel', async (req, res, next) => {
  try {
    const request = await AssistedPurchaseRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!request) return next({ statusCode: 404, message: 'Assisted purchase request not found' });
    if (['Approved', 'Rejected', 'Cancelled'].includes(request.status)) {
      return next({ statusCode: 400, message: `Cannot cancel request in ${request.status} status.` });
    }
    request.status = 'Cancelled';
    await request.save();
    res.json(request);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res) => {
  res.status(405).json({ error: 'Direct deletion is not allowed. Use the Cancel endpoint.' });
});

export default router;
