import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { Op, fn, col, literal } from 'sequelize';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';
import { User, Address, RateCard, Shipment, TrackingEvent, Payment } from '../models/index.js';
import rateCardRouter from './rateCards.js';
import { sendEmail, statusChangeTemplate } from '../services/emailService.js';

const router = express.Router();

router.use(auth);
router.use(requireRole('admin'));

router.use('/rate-cards', rateCardRouter);

router.get(
  '/shipments',
  [
    query('status').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
  ],
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const where = {};
      if (req.query.status) {
        where.status = req.query.status;
      }
      if (req.query.search) {
        where[Op.or] = [
          { trackingNumber: { [Op.like]: `%${req.query.search}%` } },
          { '$user.email$': { [Op.like]: `%${req.query.search}%` } },
        ];
      }

      if (req.query.dateFrom || req.query.dateTo) {
        where.createdAt = {};
        if (req.query.dateFrom) where.createdAt[Op.gte] = req.query.dateFrom;
        if (req.query.dateTo) where.createdAt[Op.lte] = req.query.dateTo;
      }

      const { count, rows } = await Shipment.findAndCountAll({
        where,
        include: [
          { model: Address, as: 'sender' },
          { model: Address, as: 'receiver' },
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
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

router.patch(
  '/shipments/:id/status',
  [
    body('status').isIn(['pending', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
    body('location').optional().isString(),
    body('note').optional().isString(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });

      const { status, location, note } = req.body;

      const shipment = await Shipment.findByPk(req.params.id, {
        include: [{ model: Address, as: 'sender' }, { model: Address, as: 'receiver' }, { model: User, as: 'user' }],
      });

      if (!shipment) return next({ statusCode: 404, message: 'Shipment not found' });

      shipment.status = status;
      await shipment.save();

      const event = await TrackingEvent.create({
        shipmentId: shipment.id,
        status,
        location: location || '',
        note: note || '',
      });

      if (shipment.user && shipment.user.email) {
        const html = statusChangeTemplate(shipment.trackingNumber, status, note);
        await sendEmail({
          to: shipment.user.email,
          subject: `Shipment ${shipment.trackingNumber} - Status Update`,
          html,
        }).catch((e) => console.error('Email send error:', e.message));
      }

      res.json({ shipment, trackingEvent: event });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/stats', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const shipmentsToday = await Shipment.count({
      where: { createdAt: { [Op.gte]: today, [Op.lt]: tomorrow } },
    });

    const inTransit = await Shipment.count({ where: { status: 'in_transit' } });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const deliveredThisMonth = await Shipment.count({
      where: { status: 'delivered', createdAt: { [Op.gte]: startOfMonth } },
    });

    const revenueThisMonth = await Payment.sum('amount', {
      where: { status: 'paid', createdAt: { [Op.gte]: startOfMonth } },
    });

    const totalShipments = await Shipment.count();
    const totalUsers = await User.count();

    res.json({
      shipmentsToday,
      inTransit,
      deliveredThisMonth,
      revenueThisMonth: parseFloat(revenueThisMonth || 0),
      totalShipments,
      totalUsers,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'phone', 'role', 'createdAt'] });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

export default router;
