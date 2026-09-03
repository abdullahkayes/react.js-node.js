import express from 'express';
import { Shipment, Address, TrackingEvent } from '../models/index.js';

const router = express.Router();

router.get('/:trackingNumber', async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({
      where: { trackingNumber: req.params.trackingNumber },
      attributes: ['trackingNumber', 'serviceType', 'weightKg', 'price', 'currency', 'status', 'createdAt'],
      include: [
        {
          model: Address,
          as: 'sender',
          attributes: ['city', 'country'],
        },
        {
          model: Address,
          as: 'receiver',
          attributes: ['city', 'country'],
        },
        {
          model: TrackingEvent,
          as: 'trackingEvents',
          attributes: ['id', 'status', 'location', 'note', 'createdAt'],
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    if (!shipment) {
      return next({ statusCode: 404, message: 'Shipment not found' });
    }

    const response = {
      trackingNumber: shipment.trackingNumber,
      serviceType: shipment.serviceType,
      status: shipment.status,
      weightKg: shipment.weightKg,
      price: shipment.price,
      currency: shipment.currency,
      createdAt: shipment.createdAt,
      origin: {
        city: shipment.sender?.city,
        country: shipment.sender?.country,
      },
      destination: {
        city: shipment.receiver?.city,
        country: shipment.receiver?.country,
      },
      trackingEvents:
        shipment.trackingEvents?.map((e) => ({
          id: e.id,
          status: e.status,
          location: e.location,
          note: e.note,
          createdAt: e.createdAt,
        })) || [],
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
