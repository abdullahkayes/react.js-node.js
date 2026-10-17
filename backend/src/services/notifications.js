/**
 * Customer notification service.
 *
 * Every notification the platform sends goes through here, so the Customer
 * Notifications and Delivery Evidence tables are populated by the same code path
 * whether the notification was raised by the system (an account case, an
 * information request, a document decision) or typed into the Send Notification
 * modal by a staff member.
 *
 * The two levels of status are kept apart deliberately:
 *
 *   - each delivery row records what happened on that one channel;
 *   - the notification's overall status is derived from all of them using the
 *     Viewed > Delivered > Sent > Failed priority.
 *
 * Recording a notification never fails the action that caused it. A customer
 * whose notification could not be stored has still had their shipment booked or
 * their case resolved, and losing the audit of a notice is a smaller problem than
 * rolling back a decision that was legitimate.
 */

import { CustomerNotification, NotificationDelivery } from '../models/index.js';
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STATUSES,
  formatNotificationId,
  overallNotificationStatus,
  channelAvailability,
} from '../config/notifications.js';
import { sendEmail } from './emailService.js';

/**
 * Allocates the next free Notification ID.
 *
 * Re-checks in a loop rather than trusting the count alone, so a deleted or
 * manually inserted row can never hand out a reference that already exists.
 */
const nextNotificationId = async () => {
  const issued = await CustomerNotification.count();
  let sequence = issued + 1;
  let candidate = formatNotificationId(sequence);
  while (await CustomerNotification.findOne({ where: { notificationId: candidate } })) {
    sequence += 1;
    candidate = formatNotificationId(sequence);
  }
  return candidate;
};

/** Masks a contact detail so delivery evidence does not re-expose it. */
const maskDestination = (value) => {
  const text = String(value || '').trim();
  if (!text) return null;
  if (text.includes('@')) {
    const [local, domain] = text.split('@');
    const head = local.slice(0, 1);
    return `${head}${'*'.repeat(Math.max(local.length - 1, 1))}@${domain}`;
  }
  if (text.length <= 4) return text;
  return `${text.slice(0, 2)}${'*'.repeat(text.length - 4)}${text.slice(-2)}`;
};

/**
 * The address a channel delivers to, for the destination column of the evidence
 * table. Masked, because the staff viewing this tab already has the contact
 * details elsewhere and the evidence row only needs to prove where it went.
 */
const destinationFor = (channel, customer) => {
  switch (channel) {
    case 'Email':
      return maskDestination(customer?.email);
    case 'SMS':
      return maskDestination(customer?.phone);
    case 'WhatsApp':
      return maskDestination(customer?.whatsapp);
    case 'Dashboard':
      return 'Customer Dashboard';
    default:
      return null;
  }
};

/**
 * Records a notification whose delivery has already been attempted.
 *
 * Used where the caller has already dispatched the message - the account-action
 * Formal Notice goes out through its own dispatch so it can report per-channel
 * results on the case row, and this only writes the Audit tab's records of that
 * same send. It never transmits anything itself, so a notice cannot go out twice.
 *
 * @param {object} params
 * @param {Record<string, {status: string, detail?: string}>} params.outcomes
 *   Per-channel outcome, e.g. `{ Email: { status: 'Delivered' } }`.
 * @returns {Promise<{notificationId, status}|null>}
 */
const recordCustomerNotification = async ({
  customer,
  notificationType = 'Formal',
  title,
  message,
  channels,
  outcomes = {},
  relatedRecord = null,
  sourceRef = null,
  source = 'system',
  createdBy = null,
  sentAt = new Date(),
}) => {
  const requested = [...new Set((channels || []).map((c) => String(c).trim()).filter(Boolean))];
  const attemptedAt = sentAt instanceof Date ? sentAt : new Date(sentAt);

  try {
    const notificationId = await nextNotificationId();

    const notification = await CustomerNotification.create({
      userId: customer.id,
      notificationId,
      notificationType,
      title,
      message,
      relatedRecord,
      channels: JSON.stringify(requested),
      status: 'Sent',
      sentAt: attemptedAt,
      source,
      createdBy,
      sourceRef,
    });

    const rows = requested.map((channel) => {
      const outcome = outcomes[channel] || {};
      // An outcome the caller does not recognise is recorded as Sent rather than
      // dropped: the attempt happened, and hiding it would understate what was
      // tried.
      const status = NOTIFICATION_STATUSES.includes(outcome.status) ? outcome.status : 'Sent';
      const detail = outcome.detail ? String(outcome.detail).slice(0, 255) : null;
      return {
        userId: customer.id,
        notificationId,
        notificationRowId: notification.id,
        channel: NOTIFICATION_CHANNELS.includes(channel) ? channel : 'Dashboard',
        deliveryStatus: status,
        providerRef: detail && status !== 'Sent' ? detail : null,
        attemptedAt,
        deliveredAt: status === 'Delivered' || status === 'Viewed' ? attemptedAt : null,
        viewedAt: null,
        failureReason: status === 'Failed' ? detail || 'Delivery failed' : null,
        destination: destinationFor(channel, customer),
      };
    });

    if (rows.length) await NotificationDelivery.bulkCreate(rows);

    const overall = overallNotificationStatus(rows.map((r) => r.deliveryStatus));
    notification.status = overall;
    await notification.save();

    return { notificationId, status: overall, deliveries: rows.map((r) => ({ channel: r.channel, status: r.deliveryStatus })) };
  } catch (error) {
    // Recording must never break the action that produced the notification.
    console.warn(`Could not record notification "${title}" for customer ${customer?.id}: ${error.message}`);
    return null;
  }
};

/**
 * Sends one notification and records it with one delivery row per channel.
 *
 * @param {object} params
 * @param {object} params.customer        Recipient.
 * @param {string} params.notificationType From the approved vocabulary.
 * @param {string} params.title           One-line summary.
 * @param {string} params.message         Body sent to the customer.
 * @param {string[]} params.channels      Channels to deliver on.
 * @param {string} [params.relatedRecord] ERP record this is about.
 * @param {string} [params.sourceRef]     Reference of the entity that raised it.
 * @param {'system'|'staff'} [params.source]
 * @param {number} [params.createdBy]     Staff id, for a manual notification.
 * @param {object} [params.html]          Rich body for the email channel.
 * @param {Array<{filename: string, path?: string, content?: Buffer}>} [params.attachments]
 *   Files attached to the email channel only. SMS carries no attachment, so
 *   this is deliberately not applied to the other channels.
 * @returns {Promise<{notificationId, status, deliveries}|null>} null when the
 *   notification could not be recorded; the caller carries on regardless.
 */
const sendCustomerNotification = async ({
  customer,
  notificationType,
  title,
  message,
  channels = [],
  relatedRecord = null,
  sourceRef = null,
  source = 'system',
  createdBy = null,
  html = null,
  attachments = null,
}) => {
  const requested = [...new Set((channels || []).map((c) => String(c).trim()).filter(Boolean))];
  const usable = requested.filter((channel) => NOTIFICATION_CHANNELS.includes(channel) && channelAvailability(channel, customer));

  if (!usable.length) {
    console.warn(
      `Notification "${title}" not sent: no usable channel for customer ${customer?.id} (requested: ${requested.join(', ') || 'none'})`
    );
    return null;
  }

  const sentAt = new Date();
  const notificationId = await nextNotificationId();

  // The notification row is written first, so the delivery evidence can be
  // attached to a reference that already exists even if a send below fails.
  const notification = await CustomerNotification.create({
    userId: customer.id,
    notificationId,
    notificationType,
    title,
    message,
    relatedRecord,
    channels: JSON.stringify(usable),
    status: 'Sent',
    sentAt,
    source,
    createdBy,
    sourceRef,
  });

  const deliveryRows = [];

  for (const channel of usable) {
    const attemptedAt = new Date();
    let deliveryStatus = 'Sent';
    let providerRef = null;
    let deliveredAt = null;
    let viewedAt = null;
    let failureReason = null;

    if (channel === 'Email') {
      try {
        const sent = await sendEmail({
          to: customer.email,
          subject: title,
          html: html || `<pre style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f2937;line-height:1.6;white-space:pre-wrap">${String(message).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`,
          // The generated PDF travels with the email. SMS is not offered an
          // attachment, and the other channels carry their copy differently.
          attachments: Array.isArray(attachments) && attachments.length ? attachments : undefined,
        });
        const messageId = sent?.messageId || null;
        // The email service reports a simulated id when no SMTP host is
        // configured, which means nothing was actually transmitted. Recording
        // that as Delivered would put an untrue statement in the evidence table,
        // so it stays Sent and says why.
        const simulated = messageId === 'simulated' || !messageId;
        providerRef = simulated ? 'Simulated - no SMTP configured' : messageId;
        deliveryStatus = simulated ? 'Sent' : 'Delivered';
        deliveredAt = simulated ? null : attemptedAt;
        if (simulated) failureReason = 'No SMTP host is configured, so the message was not transmitted';
      } catch (error) {
        deliveryStatus = 'Failed';
        failureReason = String(error?.message || 'Email delivery failed').slice(0, 255);
      }
    } else if (channel === 'Dashboard') {
      // No external provider is involved: the copy is stored on the customer's
      // account and stays Sent until the customer opens it, at which point the
      // dashboard records the view locally and this row becomes Viewed.
      deliveryStatus = 'Sent';
    } else {
      // SMS and WhatsApp have no transport wired up yet. They are recorded as
      // Sent with the reason stated, rather than being offered to staff as a
      // channel that would silently do nothing.
      providerRef = 'No transport configured';
      failureReason = 'No delivery provider is configured for this channel yet';
    }

    deliveryRows.push({
      userId: customer.id,
      notificationId,
      notificationRowId: notification.id,
      channel,
      deliveryStatus,
      providerRef,
      attemptedAt,
      deliveredAt,
      viewedAt,
      failureReason,
      destination: destinationFor(channel, customer),
    });
  }

  if (deliveryRows.length) await NotificationDelivery.bulkCreate(deliveryRows);

  // Overall status is derived from the channels, never chosen: a notification the
  // customer opened on the dashboard reads Viewed even if email is only Delivered.
  const overall = overallNotificationStatus(deliveryRows.map((d) => d.deliveryStatus));
  notification.status = overall;
  await notification.save();

  return {
    notificationId,
    status: overall,
    deliveries: deliveryRows.map((d) => ({ channel: d.channel, status: d.deliveryStatus })),
  };
};

/**
 * Marks a notification Viewed, and only from a customer-facing surface.
 *
 * Called by the customer dashboard when the customer opens their own
 * notification. It is deliberately not called from the admin panel: staff
 * reading a notification in the backend is not the customer receiving it, and
 * recording that as a view would make the delivery evidence untrue.
 *
 * @param {string} notificationId
 * @param {number} customerId The signed-in customer, so a notification can only
 *   ever be viewed by the customer it was sent to.
 * @returns {Promise<object|null>} The updated notification, or null when the
 *   notification does not belong to this customer.
 */
const markNotificationViewedByCustomer = async (notificationId, customerId) => {
  const notification = await CustomerNotification.findOne({
    where: { notificationId, userId: customerId },
  });
  if (!notification) return null;
  if (notification.viewedAt) return notification;

  const viewedAt = new Date();
  notification.viewedAt = viewedAt;
  notification.status = 'Viewed';
  await notification.save();

  // The channel the customer actually used is the one that becomes Viewed; the
  // other channels keep their own outcome, because an email that was delivered
  // is still evidenced as delivered even after a dashboard view.
  await NotificationDelivery.update(
    { deliveryStatus: 'Viewed', viewedAt },
    { where: { notificationId, userId: customerId, channel: 'Dashboard' } }
  );

  await recalculateNotificationStatus(notificationId);
  return notification;
};

/**
 * Recomputes a notification's overall status from its delivery rows.
 *
 * Run after any delivery row changes so the two levels of status cannot drift.
 */
const recalculateNotificationStatus = async (notificationId) => {
  const rows = await NotificationDelivery.findAll({ where: { notificationId } });
  const notification = await CustomerNotification.findOne({ where: { notificationId } });
  if (!notification) return null;

  notification.status = overallNotificationStatus(rows.map((r) => r.deliveryStatus));
  // The notification is Viewed only while a channel says so; the viewedAt stamp
  // alone is not enough, otherwise a later failed delivery would silently keep it
  // reading Viewed.
  notification.viewedAt = rows.some((r) => r.viewedAt)
    ? rows.reduce((latest, r) => (r.viewedAt && (!latest || new Date(r.viewedAt) > latest) ? new Date(r.viewedAt) : latest), null)
    : null;
  await notification.save();
  return notification;
};

/**
 * Every notification for a customer, newest first, with its delivery evidence.
 *
 * The three Communications & Audit tables all read from this, so a notification
 * row and its evidence can never be shown with inconsistent references.
 */
const listCustomerCommunications = async (customerId) => {
  const [rows, deliveries] = await Promise.all([
    CustomerNotification.findAll({
      where: { userId: customerId },
      order: [['sentAt', 'DESC'], ['id', 'DESC']],
    }),
    NotificationDelivery.findAll({
      where: { userId: customerId },
      order: [['attemptedAt', 'DESC'], ['id', 'DESC']],
    }),
  ]);

  const byNotification = new Map();
  deliveries.forEach((d) => {
    const list = byNotification.get(d.notificationId) || [];
    list.push(d);
    byNotification.set(d.notificationId, list);
  });

  return { rows, deliveries, byNotification };
};

export {
  sendCustomerNotification,
  recordCustomerNotification,
  markNotificationViewedByCustomer,
  recalculateNotificationStatus,
  listCustomerCommunications,
  nextNotificationId,
  maskDestination,
};
