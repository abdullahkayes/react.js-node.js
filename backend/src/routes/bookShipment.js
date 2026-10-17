import express from 'express';
import fs from 'fs';
import path from 'path';
import { body, validationResult, query } from 'express-validator';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { requireVerifiedTradeLicense } from '../middleware/tradeLicenseGate.js';
import { BookShipmentRequest, BookShipmentItem } from '../models/index.js';

const router = express.Router();

router.use(auth);

const generateRequestId = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.floor(100 + Math.random() * 9000);
  return `EXP-${year}${month}${day}${random}`;
};

const STATUSES = [
  'Draft',
  'Submitted',
  'Under Review',
  'Need More Information',
  'Approved',
  'Rejected',
  'In Transit',
  'Delivered',
  'Cancelled',
];

const EDITABLE_STATUSES = ['Draft', 'Submitted', 'Under Review', 'Need More Information'];

const NON_CANCELABLE = ['Approved', 'Rejected', 'Cancelled'];

const validateRequest = [
  body('requestedServiceLevel').isIn(['air', 'sea']).withMessage('Requested service level must be air or sea'),
  body('freightMode').isIn(['air', 'sea']).withMessage('Freight mode must be air or sea'),
  body('customerType').notEmpty().withMessage('Customer type is required'),
  body('confirmTerms').isBoolean().withMessage('Terms confirmation is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.itemSource').notEmpty().withMessage('Item source is required for each item'),
  body('items.*.productCategory').notEmpty().withMessage('Product category is required for each item'),
  body('items.*.productDescription').notEmpty().withMessage('Product description is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.invoiceValue').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Invoice value must be a non-negative number'),
  body('items.*.unitPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('status').optional().isIn(STATUSES).withMessage('Invalid status value'),
];

const validateSubmittedRequest = [
  body('requestedServiceLevel').isIn(['air', 'sea']).withMessage('Requested service level must be air or sea'),
  body('freightMode').isIn(['air', 'sea']).withMessage('Freight mode must be air or sea'),
  body('customerType').notEmpty().withMessage('Customer type is required'),
  body('confirmTerms').isBoolean().withMessage('Terms confirmation is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.itemSource').notEmpty().withMessage('Item source is required for each item'),
  body('items.*.productCategory').notEmpty().withMessage('Product category is required for each item'),
  body('items.*.productDescription').notEmpty().withMessage('Product description is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.invoiceValue').isFloat({ min: 0 }).withMessage('Invoice value must be a non-negative number'),
  body('items.*.unitPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
];

const conditionalValidation = (req, res, next) => {
  const validations = req.body.status === 'Submitted' ? validateSubmittedRequest : validateRequest;
  Promise.all(validations.map((validation) => validation.run(req))).then(() => next()).catch(next);
};

const serializeItem = (item) => ({
  itemType: item.itemType || 'Products / Goods',
  itemSource: item.itemSource || '',
  trackingNumber: item.trackingNumber || null,
  sellerStoreName: item.sellerStoreName || null,
  productDescription: item.productDescription || '',
  productCategory: item.productCategory || '',
  quantity: item.quantity || 1,
  invoiceValue: item.invoiceValue ? parseFloat(item.invoiceValue) : 0,
  unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : null,
  packageCount: item.packageCount || 1,
  estimatedWeight: item.estimatedWeight ? parseFloat(item.estimatedWeight) : null,
  length: item.length ? parseFloat(item.length) : null,
  width: item.width ? parseFloat(item.width) : null,
  height: item.height ? parseFloat(item.height) : null,
  hsCode: item.hsCode || null,
  countryOfOrigin: item.countryOfOrigin || null,
  productUrl: item.productUrl || null,
  invoiceFilePath: item.invoiceFilePath || null,
  packingListPath: item.packingListPath || null,
  supportingDocsPath: item.supportingDocsPath || null,
  screenshotPath: item.screenshotPath || null,
});

const updateRequestItems = async (request, items) => {
  await BookShipmentItem.destroy({ where: { requestId: request.id } });
  await BookShipmentItem.bulkCreate(items.map((item) => ({ requestId: request.id, ...serializeItem(item) })));
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
      const { count, rows } = await BookShipmentRequest.findAndCountAll({
        where,
        include: [{ model: BookShipmentItem, as: 'items' }],
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
    const recent = await BookShipmentRequest.findAll({
      where: { userId: req.user.id },
      include: [{ model: BookShipmentItem, as: 'items' }],
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
    const request = await BookShipmentRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: BookShipmentItem, as: 'items' }],
    });
    if (!request) return next({ statusCode: 404, message: 'Book shipment request not found' });
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
      pickupFrom,
      destinationCountry,
      consigneeName,
      consigneePhone,
      consigneeAddress,
      city,
      region,
      zipCode,
      shipmentInstructions,
      addPackageInsurance,
      termsAccepted,
      customsAccepted,
      status: incomingStatus,
      items,
    } = req.body;
    const statusToUse = incomingStatus || 'Draft';
    const isSubmit = statusToUse === 'Submitted';

    let request = await BookShipmentRequest.findOne({
      where: { userId: req.user.id, status: 'Draft' },
    });

    if (request) {
      request.requestedServiceLevel = requestedServiceLevel;
      request.freightMode = freightMode;
      request.customerType = customerType;
      request.pickupFrom = pickupFrom || null;
      request.destinationCountry = destinationCountry || null;
      request.consigneeName = consigneeName || null;
      request.consigneePhone = consigneePhone || null;
      request.consigneeAddress = consigneeAddress || null;
      request.city = city || null;
      request.region = region || null;
      request.zipCode = zipCode || null;
      request.shipmentInstructions = shipmentInstructions || null;
      request.addPackageInsurance = Boolean(addPackageInsurance);
      request.termsAccepted = Boolean(termsAccepted);
      request.customsAccepted = Boolean(customsAccepted);
      if (isSubmit) {
        request.status = 'Submitted';
        request.submittedAt = new Date();
      }
      await request.save();
    } else {
      request = await BookShipmentRequest.create({
        requestId: generateRequestId(),
        userId: req.user.id,
        status: statusToUse,
        requestedServiceLevel,
        freightMode,
        customerType,
        pickupFrom: pickupFrom || null,
        destinationCountry: destinationCountry || null,
        consigneeName: consigneeName || null,
        consigneePhone: consigneePhone || null,
        consigneeAddress: consigneeAddress || null,
        city: city || null,
        region: region || null,
        zipCode: zipCode || null,
        shipmentInstructions: shipmentInstructions || null,
        addPackageInsurance: Boolean(addPackageInsurance),
        termsAccepted: Boolean(termsAccepted),
        customsAccepted: Boolean(customsAccepted),
        ...(isSubmit ? { submittedAt: new Date() } : {}),
      });
    }

    await updateRequestItems(request, items);
    const updatedRequest = await BookShipmentRequest.findByPk(request.id, {
      include: [{ model: BookShipmentItem, as: 'items' }],
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

      const request = await BookShipmentRequest.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });
      if (!request) return next({ statusCode: 404, message: 'Book shipment request not found' });

      const {
        requestedServiceLevel,
        freightMode,
        customerType,
        pickupFrom,
        destinationCountry,
        consigneeName,
        consigneePhone,
        consigneeAddress,
        city,
        region,
        zipCode,
        shipmentInstructions,
        addPackageInsurance,
        termsAccepted,
        customsAccepted,
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
      request.pickupFrom = pickupFrom || null;
      request.destinationCountry = destinationCountry || null;
      request.consigneeName = consigneeName || null;
      request.consigneePhone = consigneePhone || null;
      request.consigneeAddress = consigneeAddress || null;
      request.city = city || null;
      request.region = region || null;
      request.zipCode = zipCode || null;
      request.shipmentInstructions = shipmentInstructions || null;
      request.addPackageInsurance = Boolean(addPackageInsurance);
      request.termsAccepted = Boolean(termsAccepted);
      request.customsAccepted = Boolean(customsAccepted);
      if (status === 'Submitted' && !request.submittedAt) request.submittedAt = new Date();
      await request.save();

      if (items) await updateRequestItems(request, items);
      const updatedRequest = await BookShipmentRequest.findByPk(request.id, {
        include: [{ model: BookShipmentItem, as: 'items' }],
      });
      res.json(updatedRequest);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/:id/files', upload.fields([
  { name: 'nid', maxCount: 1 },
  { name: 'paymentReceipt', maxCount: 1 },
  { name: 'invoices', maxCount: 10 },
  { name: 'packingLists', maxCount: 10 },
  { name: 'supportingDocs', maxCount: 10 },
  { name: 'screenshots', maxCount: 10 },
]), async (req, res, next) => {
  try {
    const request = await BookShipmentRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: BookShipmentItem, as: 'items' }],
    });
    if (!request) return next({ statusCode: 404, message: 'Book shipment request not found' });
    if (!EDITABLE_STATUSES.includes(request.status)) {
      return next({ statusCode: 400, message: 'Cannot modify request in current status' });
    }

    const nidFile = req.files?.nid?.[0];
    if (nidFile) {
      if (request.nidPath) fs.promises.unlink(path.resolve(request.nidPath)).catch(() => {});
      request.nidPath = `/uploads/${nidFile.filename}`;
    }

    const paymentReceiptFile = req.files?.paymentReceipt?.[0];
    if (paymentReceiptFile) {
      if (request.paymentReceiptPath) fs.promises.unlink(path.resolve(request.paymentReceiptPath)).catch(() => {});
      request.paymentReceiptPath = `/uploads/${paymentReceiptFile.filename}`;
    }

    const invoices = req.files?.invoices || [];
    const packingLists = req.files?.packingLists || [];
    const supportingDocs = req.files?.supportingDocs || [];
    const screenshots = req.files?.screenshots || [];

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

    await request.save();
    const updatedRequest = await BookShipmentRequest.findByPk(request.id, {
      include: [{ model: BookShipmentItem, as: 'items' }],
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
    const request = await BookShipmentRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!request) return next({ statusCode: 404, message: 'Book shipment request not found' });
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
    const request = await BookShipmentRequest.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!request) return next({ statusCode: 404, message: 'Book shipment request not found' });
    if (NON_CANCELABLE.includes(request.status)) {
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
