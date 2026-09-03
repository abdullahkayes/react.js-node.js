import express from 'express';
import { body, validationResult } from 'express-validator';
import { RateCard } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const cards = await RateCard.findAll();
    res.json(cards);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  [
    body('originZone').notEmpty(),
    body('destinationZone').notEmpty(),
    body('serviceType').isIn(['standard', 'express', 'priority']),
    body('pricePerKg').isDecimal(),
    body('baseFee').isDecimal(),
    body('currency').isString().isLength({ min: 3, max: 3 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next({ statusCode: 400, errors: errors.array() });
      const card = await RateCard.create(req.body);
      res.status(201).json(card);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:id',
  [
    body('originZone').optional().notEmpty(),
    body('destinationZone').optional().notEmpty(),
    body('serviceType').optional().isIn(['standard', 'express', 'priority']),
    body('pricePerKg').optional().isDecimal(),
    body('baseFee').optional().isDecimal(),
    body('currency').optional().isString().isLength({ min: 3, max: 3 }),
  ],
  async (req, res, next) => {
    try {
      const card = await RateCard.findByPk(req.params.id);
      if (!card) return next({ statusCode: 404, message: 'Rate card not found' });
      await card.update(req.body);
      res.json(card);
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    const card = await RateCard.findByPk(req.params.id);
    if (!card) return next({ statusCode: 404, message: 'Rate card not found' });
    await card.destroy();
    res.json({ message: 'Rate card deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
