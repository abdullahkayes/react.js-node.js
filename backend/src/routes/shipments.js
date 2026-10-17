import express from 'express';
import { body, validationResult, query } from 'express-validator';
import auth from '../middleware/auth.js';
import {
  Shipment,
  Address,
  User,
  TrackingEvent,
  Payment,
  ShipmentItem,
  Invoice,
  InvoiceItem,
  Document,
  ReturnRTO,
  Insurance,
} from '../models/index.js';
import generateTrackingNumber from '../utils/generateTrackingNumber.js';
import calculateQuote from '../services/rateService.js';
import { generateShipmentReference } from '../config/shipmentReferences.js';

const generateShipmentId = generateShipmentReference;

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('serviceType').isIn(['standard', 'express', 'priority']).withMessage('Service type is required'),
    body('weightKg').isFloat({ gt: 0 }).withMessage('Weight must be positive'),
    body('declaredValue').optional().isFloat({ min: 0 }),
    body('senderAddress').optional(),
    body('receiverAddress').optional(),
    body('senderAddressId').optional(),
    body('receiverAddressId').optional(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });

      const {
        serviceType,
        weightKg,
        dimensions,
        declaredValue,
        originCountry,
        destinationCountry,
        senderAddressId,
        receiverAddressId,
        senderAddress,
        receiverAddress,
      } = req.body;

      let senderAddr = null;
      let receiverAddr = null;

      if (senderAddressId) {
        senderAddr = await Address.findByPk(senderAddressId);
        if (!senderAddr) return next({ statusCode: 400, message: 'Sender address not found' });
      } else if (senderAddress) {
        senderAddr = await Address.create({ ...senderAddress, userId: req.user.id });
      } else {
        return next({ statusCode: 400, message: 'Sender address is required' });
      }

      if (receiverAddressId) {
        receiverAddr = await Address.findByPk(receiverAddressId);
        if (!receiverAddr) return next({ statusCode: 400, message: 'Receiver address not found' });
      } else if (receiverAddress) {
        receiverAddr = await Address.create({ ...receiverAddress, userId: req.user.id });
      } else {
        return next({ statusCode: 400, message: 'Receiver address is required' });
      }

      const quote = await calculateQuote(
        senderAddr.country,
        receiverAddr.country,
        weightKg,
        dimensions,
        serviceType
      );

      const trackingNumber = generateTrackingNumber();

      const shipment = await Shipment.create({
        shipmentId: generateShipmentId(),
        trackingNumber,
        userId: req.user.id,
        senderAddressId: senderAddr.id,
        receiverAddressId: receiverAddr.id,
        serviceType,
        serviceMode: senderAddr.country === 'USA' ? 'Import' : 'Export',
        purchaseType: req.body.purchaseType || (senderAddr.country === 'USA' ? 'Self-Purchase' : 'N/A'),
        sourceRequestType: req.body.sourceRequestType || 'direct',
        sourceRequestId: req.body.sourceRequestId || null,
        weightKg,
        dimensions: dimensions || {},
        declaredValue: declaredValue || 0,
        price: quote.price,
        currency: quote.currency,
        paymentStatus: 'unpaid',
        status: 'Awaiting Carrier Tracking',
      });

      await TrackingEvent.create({
        shipmentId: shipment.id,
        status: 'Awaiting Carrier Tracking',
        note: 'Shipment created, awaiting carrier tracking',
        location: `${senderAddr.city}, ${senderAddr.country}`,
      });

      const fullShipment = await Shipment.findByPk(shipment.id, {
        include: [
          { model: Address, as: 'sender' },
          { model: Address, as: 'receiver' },
          { model: TrackingEvent, as: 'trackingEvents' },
          { model: Payment, as: 'payments' },
        ],
      });

      res.status(201).json(fullShipment);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const { count, rows } = await Shipment.findAndCountAll({
        where: { userId: req.user.id },
        include: [
          { model: Address, as: 'sender' },
          { model: Address, as: 'receiver' },
          { model: TrackingEvent, as: 'trackingEvents' },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      res.json({ shipments: rows, total: count, page, pages: Math.ceil(count / limit) });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:id', async (req, res, next) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id, {
      include: [
        { model: Address, as: 'sender' },
        { model: Address, as: 'receiver' },
        { model: TrackingEvent, as: 'trackingEvents' },
        { model: Payment, as: 'payments' },
        { model: ShipmentItem, as: 'items' },
        { model: Invoice, as: 'invoices', include: [{ model: InvoiceItem, as: 'items' }] },
        { model: Document, as: 'documents' },
        { model: ReturnRTO, as: 'returnsRTOs' },
        { model: Insurance, as: 'insurances' },
        { model: User, as: 'user' },
      ],
    });

    if (!shipment) return next({ statusCode: 404, message: 'Shipment not found' });

    if (shipment.userId !== req.user.id && req.user.role !== 'admin') {
      return next({ statusCode: 403, message: 'Access denied' });
    }

    res.json(shipment);
  } catch (err) {
    next(err);
  }
});

const WAREHOUSE_ARRIVAL_STATUSES = [
  'Received at USA Warehouse',
  'Received at Dhaka Hub',
];

const NON_CANCELABLE_STATUSES = [
  ...WAREHOUSE_ARRIVAL_STATUSES,
  'Delivered',
  'Cancelled',
  'Disposed',
  'Seized',
];

router.put('/:id/cancel', async (req, res, next) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);

    if (!shipment) {
      return next({ statusCode: 404, message: 'Shipment not found' });
    }

    if (shipment.userId !== req.user.id && req.user.role !== 'admin') {
      return next({ statusCode: 403, message: 'Access denied' });
    }

    if (NON_CANCELABLE_STATUSES.includes(shipment.status)) {
      return next({
        statusCode: 400,
        message: `Cannot cancel shipment in ${shipment.status} status. Cancellation is no longer possible.`,
      });
    }

    shipment.status = 'Cancelled';
    await shipment.save();

    await TrackingEvent.create({
      shipmentId: shipment.id,
      status: 'Cancelled',
      note: 'Shipment cancelled by user',
      location: 'System',
    });

    const updatedShipment = await Shipment.findByPk(shipment.id, {
      include: [
        { model: Address, as: 'sender' },
        { model: Address, as: 'receiver' },
        { model: TrackingEvent, as: 'trackingEvents' },
        { model: Payment, as: 'payments' },
      ],
    });

    res.json(updatedShipment);
  } catch (err) {
    next(err);
  }
});

export default router;