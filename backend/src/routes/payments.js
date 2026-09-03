import express from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import auth from '../middleware/auth.js';
import { Shipment, Payment } from '../models/index.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-18',
});

const router = express.Router();

router.post(
  '/create-intent',
  auth,
  [body('shipmentId').isInt().withMessage('Valid shipmentId is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return next({ statusCode: 400, message: 'Validation failed', errors: errors.array() });

      const { shipmentId } = req.body;

      const shipment = await Shipment.findOne({
        where: { id: shipmentId, userId: req.user.id },
      });

      if (!shipment) return next({ statusCode: 404, message: 'Shipment not found' });
      if (shipment.paymentStatus === 'paid') {
        return next({ statusCode: 400, message: 'Shipment already paid' });
      }

      if (!process.env.STRIPE_SECRET_KEY) {
        return next({ statusCode: 500, message: 'Stripe is not configured on the server' });
      }

      const amount = Math.round(parseFloat(shipment.price) * 100);

      const intent = await stripe.paymentIntents.create({
        amount,
        currency: shipment.currency.toLowerCase(),
        metadata: {
          shipmentId: shipment.id.toString(),
          trackingNumber: shipment.trackingNumber,
        },
      });

      await Payment.upsert({
        shipmentId: shipment.id,
        provider: 'stripe',
        providerRef: intent.id,
        amount: shipment.price,
        currency: shipment.currency,
        status: 'pending',
      });

      res.json({ clientSecret: intent.client_secret });
    } catch (err) {
      next(err);
    }
  }
);

const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(200).json({ message: 'Webhook not configured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const shipmentId = parseInt(intent.metadata.shipmentId);

    try {
      const shipment = await Shipment.findByPk(shipmentId);
      if (shipment) {
        await Payment.update(
          { status: 'paid', providerRef: intent.id },
          { where: { shipmentId: shipment.id } }
        );
        shipment.paymentStatus = 'paid';
        await shipment.save();
      }
    } catch (dbErr) {
      console.error('Webhook DB update error:', dbErr.message);
    }
  }

  res.json({ received: true });
};

export { webhookHandler };
export default router;
