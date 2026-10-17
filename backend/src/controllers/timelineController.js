/**
 * Timeline Update.
 *
 * POST /admin/shipments/:ref/timeline
 *
 * The one way staff change a shipment's operational status. It updates the
 * status and writes the timeline entry as a single operation, because the two are
 * the same act: a timeline entry that did not move the status is a note, and a
 * status that moved without an entry would leave the timeline behind.
 *
 * Staff never set a request status here. That belongs to the Request & Booking
 * workflow, which writes it with its own generated labels.
 */

import { Shipment, TrackingEvent } from '../models/index.js';
import { recordShipmentStatus } from '../services/timelineService.js';
import { SHIPMENT_STATUSES, visibilityFor } from '../config/shipmentStatuses.js';

/**
 * The approved statuses the modal offers, with who can see each one.
 *
 * Rendered from here rather than typed into the view, so the dropdown and the
 * endpoint validate against one list and staff cannot be offered a status the
 * server would refuse.
 */
const timelineStatusOptions = () =>
  SHIPMENT_STATUSES.map((s) => ({
    status: s.status,
    visibility: s.visibility,
    customerFacing: s.visibility === 'Customer Visible',
  }));

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createTimelineUpdate = async (req, res, next) => {
  try {
    const raw = String(req.params.ref || req.body.shipmentRef || '').trim();
    if (!raw) return res.status(400).json({ error: 'Shipment reference is missing.' });

    const shipment = await Shipment.findOne({
      where: /^\d+$/.test(raw) ? { id: raw } : { shipmentId: raw },
    });
    if (!shipment) return res.status(404).json({ error: 'No shipment matches that reference.' });

    const status = String(req.body.status || '').trim();
    const allowed = SHIPMENT_STATUSES.map((s) => s.status);
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Shipment Status must be one of: ${allowed.join(', ')}` });
    }

    /* The label is what a reader sees next to the status, so it is required
       rather than defaulted: an entry reading just the status with no wording
       tells whoever opens it nothing about what happened. */
    const label = String(req.body.label || '').trim();
    if (!label) {
      return res.status(400).json({ error: 'A timeline label is required for the status update.' });
    }
    if (label.length > 255) {
      return res.status(400).json({ error: 'The timeline label must be 255 characters or fewer.' });
    }

    const previousStatus = shipment.status;

    const { event } = await recordShipmentStatus({
      shipmentId: shipment.id,
      status,
      label,
      actor: 'staff',
      createdBy: req.user?.name || `Staff #${req.user?.id ?? '—'}`,
    });

    const reloaded = await Shipment.findByPk(shipment.id);

    return res.json({
      success: true,
      previousStatus,
      currentStatus: reloaded.status,
      entry: {
        status: event.status,
        label: event.label,
        visibility: event.visibility,
        createdBy: event.createdBy,
        recordedAt: event.createdAt,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export { createTimelineUpdate, timelineStatusOptions };
