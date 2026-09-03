import express from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import { Address } from '../models/index.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id } });
    res.json(addresses);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('addressLine1').notEmpty().withMessage('Address line 1 is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });

      const address = await Address.create({ ...req.body, userId: req.user.id });
      res.status(201).json(address);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:id', async (req, res, next) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!address) return next({ statusCode: 404, message: 'Address not found' });
    res.json(address);
  } catch (err) {
    next(err);
  }
});

export default router;
