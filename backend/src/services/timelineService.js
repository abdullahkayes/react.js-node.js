/**
 * Timeline recording.
 *
 * Every status change goes through here, whichever kind of change it is, so the
 * timeline cannot fall behind the records it summarises:
 *
 *   recordShipmentStatus  - the shipment's operational status changed.
 *   recordRequestStatus   - the request or booking moved in its own workflow.
 *
 * The two are separate because they are separate sequences. A tracking event
 * holds a Shipment Status and a Shipment Request Status is written to its own
 * table, and neither one is ever read as the next step of the other.
 *
 * The label, the visibility and the creator are all decided here rather than by
 * the caller. A caller supplies the status, and for a staff-set status the label
 * they typed; it does not get to choose who can see the entry, because that is
 * part of what the status means rather than a preference of whoever set it.
 */

import { Shipment, RequestStatusEvent, TrackingEvent, StatusReference } from '../models/index.js';
import {
  STATUS_TYPES,
  VISIBILITY,
  visibilityFor,
  systemLabelFor,
  isSelectableShipmentStatus,
  isApprovedStatus,
  statusReferenceRows,
} from '../config/shipmentStatuses.js';

/** The label the timeline shows, and where it came from. */
const REGISTRY = {
  SYSTEM: 'System',
};

/**
 * Reads the label table into memory, so a page rendering a long timeline does not
 * issue a query per entry. Seeded first, so the first read is never empty.
 *
 * @returns {Promise<Map<string, object>>} keyed by `${statusType}::${status}`.
 */
const loadStatusReference = async () => {
  await syncStatusReference();
  const rows = await StatusReference.findAll();
  const map = new Map();
  rows.forEach((r) => map.set(`${r.statusType}::${r.status}`, r.get({ plain: true })));
  return map;
};

/**
 * The status label and visibility of every entry in a mixed list.
 *
 * @param {Array<object>} entries Each carrying `statusType` and `status`.
 * @param {Map<string,object>} [reference] Pre-read label table.
 * @returns {Promise<Array<{status: string, label: string, visibility: string}>>}
 */
const resolveTimelineLabels = async (entries, reference = null) => {
  const table = reference || (await loadStatusReference());
  return entries.map((entry) => {
    const key = `${entry.statusType}::${entry.status}`;
    const row = table.get(key);
    return {
      status: entry.status,
      statusType: entry.statusType,
      label: entry.label || (row && row.label) || null,
      visibility: visibilityFor(entry.status) || (row && row.visibility) || VISIBILITY.INTERNAL,
      /* The label only counts as the system's when the row says so, so a staff
         member's own wording is never reported as system-generated. */
      systemLabel: Boolean(row && row.isSystemLabel),
    };
  });
};

/**
 * Writes the approved statuses into the label table.
 *
 * Runs on start-up and before any read. Idempotent, and additive: a status
 * outside the approved vocabularies keeps its row so history written under an
 * earlier vocabulary is still readable, but it is no longer offered anywhere
 * staff pick a status.
 *
 * @returns {Promise<{inserted: number, updated: number}>}
 */
const syncStatusReference = async () => {
  const rows = statusReferenceRows();
  const wanted = new Map(rows.map((r) => [`${r.statusType}::${r.status}`, r]));

  const existing = await StatusReference.findAll();
  const seen = new Set();
  let inserted = 0;
  let updated = 0;

  for (const row of existing) {
    const key = `${row.statusType}::${row.status}`;
    seen.add(key);
    const target = wanted.get(key);
    /* A row the approved vocabularies no longer carry is left as it is. It is
       not deleted, because a timeline entry recorded under it would otherwise
       lose its label, and not offered, because nothing reads from an
       unapproved row. */
    if (!target) continue;

    const changed =
      row.label !== target.label ||
      row.visibility !== target.visibility ||
      Boolean(row.isSystemLabel) !== Boolean(target.isSystemLabel);
    if (changed) {
      row.label = target.label;
      row.visibility = target.visibility;
      row.isSystemLabel = target.isSystemLabel;
      await row.save();
      updated += 1;
    }
  }

  for (const [key, target] of wanted) {
    if (seen.has(key)) continue;
    await StatusReference.create({
      statusType: target.statusType,
      status: target.status,
      label: target.label,
      visibility: target.visibility,
      isSystemLabel: target.isSystemLabel,
    });
    inserted += 1;
  }

  return { inserted, updated };
};

/**
 * Records a change to the shipment's operational status, and applies it.
 *
 * The status and the timeline entry are one operation, not two: a shipment whose
 * status changes without an entry would leave the timeline out of date, and an
 * entry without a status change is a note pretending to be a status.
 *
 * @param {object} params
 * @param {number} params.shipmentId
 * @param {string} params.status Must be one of the approved Shipment Statuses.
 * @param {string} [params.label] Text for the entry. Required for a status staff
 *   set; generated for one a workflow set.
 * @param {'system'|'staff'} [params.actor] Where the change came from, used to
 *   build the creator shown on the entry.
 * @param {string} [params.createdBy] Staff reference when a staff member set it.
 * @param {boolean} [params.apply] Whether to also set the shipment's current
 *   status. Defaults to true: the timeline records status changes, so a caller
 *   recording one has almost always just made it.
 * @param {object} [params.options] Extra columns for the tracking event.
 * @returns {Promise<{event: object|null, shipment: object|null}>}
 */
const recordShipmentStatus = async ({
  shipmentId,
  status,
  label = null,
  actor = 'system',
  createdBy = null,
  apply = true,
  options = {},
} = {}) => {
  if (!shipmentId) throw new Error('shipmentId is required');
  if (!isSelectableShipmentStatus(status)) {
    throw new Error(`"${status}" is not an approved Shipment Status`);
  }

  /* The visibility is read from the Status Source of Truth, never from the
     caller. A staff member choosing a status cannot also choose who sees it. */
  const visibility = visibilityFor(status) || VISIBILITY.INTERNAL;

  /* A staff member who set a status supplies the wording; a workflow generates
     it. Neither can be supplied by the other, so a staff member's note cannot
     masquerade as a system label and vice versa. */
  let entryLabel = label;
  if (!entryLabel) {
    entryLabel = null;
  }

  const creator =
    actor === 'staff'
      ? createdBy || 'Staff'
      : createdBy || REGISTRY.SYSTEM;

  let shipment = null;
  if (apply) {
    shipment = await Shipment.findByPk(shipmentId);
    if (shipment) {
      shipment.status = status;
      await shipment.save();
    }
  }

  const event = await TrackingEvent.create({
    shipmentId,
    status,
    label: entryLabel,
    visibility,
    createdBy: creator,
    location: options.location ?? null,
    note: options.note ?? null,
  });

  return { event: event.get({ plain: true }), shipment };
};

/**
 * Records a change to a request's own status, and applies it to the request.
 *
 * The label is generated from the Status Source of Truth and cannot be supplied
 * by the caller: these labels belong to the workflow that raised the status, so
 * no staff member and no other page can word them differently.
 *
 * @param {object} params
 * @param {'self_purchase'|'assisted_purchase'|'export_booking'} params.requestType
 * @param {string} params.requestId The request's business reference.
 * @param {string} params.status Must be one of the approved request statuses.
 * @param {object} params.record The request model instance, updated in place.
 * @param {number} [params.shipmentId] Set once the request becomes a shipment.
 * @param {string} [params.createdBy] Staff reference, when a staff member made
 *   the decision. Otherwise the entry reads as the system's.
 * @returns {Promise<{event: object|null, status: string, label: string|null}>}
 */
const recordRequestStatus = async ({
  requestType,
  requestId,
  status,
  record = null,
  shipmentId = null,
  createdBy = null,
} = {}) => {
  if (!requestType || !requestId) throw new Error('requestType and requestId are required');

  const label = systemLabelFor(status);

  /* The visibility comes from the approved list. A request status that has left
     the approved vocabularies is still recorded - it is history that happened -
     but it has no approved visibility, so it is kept to staff rather than shown
     to a customer on the strength of a rule that no longer covers it. */
  const visibility = visibilityFor(status) || VISIBILITY.INTERNAL;

  const creator = createdBy || REGISTRY.SYSTEM;

  const event = await RequestStatusEvent.create({
    requestType,
    requestId,
    shipmentId,
    status,
    label,
    visibility,
    createdBy: creator,
  });

  if (record && record.get) {
    /* Only the request's own row is updated. The shipment it may have become
       keeps its own status, which is a different sequence. */
    record.status = status;
    await record.save();
  }

  return { event: event.get({ plain: true }), status, label };
};

/**
 * Seeds the Shipment Request Status history of every existing request.
 *
 * A request row stores the status it is currently on, not the path it took. This
 * rebuilds the history from what is there, so a shipment whose request was
 * already converted shows the request status that got it there rather than an
 * empty request half of the timeline.
 *
 * Idempotent: a request that already has history is left alone, so this can run
 * on every start-up without doubling the rows.
 *
 * @returns {Promise<{requests: number, recorded: number, skipped: number}>}
 */
const seedRequestStatusHistory = async () => {
  const { SelfPurchaseRequest, AssistedPurchaseRequest, BookShipmentRequest, RequestStatusEvent } = await import('../models/index.js');

  const vocabularies = [
    { type: 'self_purchase', rows: await SelfPurchaseRequest.findAll() },
    { type: 'assisted_purchase', rows: await AssistedPurchaseRequest.findAll() },
    { type: 'export_booking', rows: await BookShipmentRequest.findAll() },
  ];

  await syncStatusReference();
  const reference = new Map(
    (await StatusReference.findAll()).map((r) => [`${r.statusType}::${r.status}`, r.get({ plain: true })])
  );

  let requests = 0;
  let recorded = 0;
  let skipped = 0;

  for (const { type, rows } of vocabularies) {
    for (const row of rows) {
      const already = await RequestStatusEvent.count({ where: { requestType: type, requestId: row.requestId } });
      if (already > 0) {
        skipped += 1;
        continue;
      }
      const ref = reference.get(`Shipment Request::${row.status}`);
      /* A status outside the approved six has no reference row, so there is no
         label to give it and the row is left out rather than recorded with one
         that would have been invented. */
      if (!ref) {
        skipped += 1;
        continue;
      }
      requests += 1;
      await RequestStatusEvent.create({
        requestType: type,
        requestId: row.requestId,
        shipmentId: null,
        status: row.status,
        label: ref.label,
        visibility: ref.visibility,
        createdBy: REGISTRY.SYSTEM,
      });
      recorded += 1;
    }
  }

  return { requests, recorded, skipped };
};

export {
  recordShipmentStatus,
  recordRequestStatus,
  syncStatusReference,
  loadStatusReference,
  resolveTimelineLabels,
  seedRequestStatusHistory,
  REGISTRY,
};
