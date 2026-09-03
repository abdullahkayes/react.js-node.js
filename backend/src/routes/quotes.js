import express from 'express';
import { body, validationResult } from 'express-validator';
import calculateQuote from '../services/rateService.js';

const router = express.Router();

router.post(
  '/',
  [
    body('originCountry').notEmpty().withMessage('Origin country is required'),
    body('destinationCountry').notEmpty().withMessage('Destination country is required'),
    body('weightKg').isFloat({ gt: 0 }).withMessage('Weight must be a positive number'),
    body('dimensions').optional(),
    body('serviceType')
      .isIn(['standard', 'express', 'priority'])
      .withMessage('Service type must be standard, express, or priority'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });

      const { originCountry, destinationCountry, weightKg, dimensions, serviceType } = req.body;

      const quote = await calculateQuote(
        originCountry,
        destinationCountry,
        weightKg,
        dimensions,
        serviceType
      );

      res.json(quote);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
