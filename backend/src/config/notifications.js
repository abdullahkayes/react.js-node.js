/**
 * Customer notification catalogue.
 *
 * The Communications & Audit tab has three tables that all read from the
 * database: one row per notification, one row per channel delivery attempt, and
 * the customer's policy acceptances. The vocabularies and the status rules live
 * here so the modal that sends a notification, the endpoints that store it and
 * the tab that displays it cannot drift apart.
 *
 * As with the compliance and account-action catalogues, one definition drives
 * both sides: staff are never offered a value the server would refuse.
 */

/** Overall status a notification can hold, in the order it is resolved. */
const NOTIFICATION_STATUSES = ['Sent', 'Delivered', 'Viewed', 'Failed'];

/**
 * Priority used to derive the overall status of a notification from the status of
 * each channel it went out on.
 *
 * The strongest outcome any channel achieved wins, so a notification the customer
 * opened in the dashboard reads Viewed even if the email copy is still only
 * Delivered. Failed is deliberately last: it is reported only when every attempted
 * channel failed, because one working channel means the customer was reached.
 */
const NOTIFICATION_STATUS_PRIORITY = ['Viewed', 'Delivered', 'Sent', 'Failed'];

/**
 * Notification types staff may send manually, and the types the system raises.
 * "Formal" carries notices that need a formal response; "Notice" is a general
 * advisory notice that does not.
 */
const NOTIFICATION_TYPES = [
  'General',
  'Shipment',
  'Payment',
  'Policy Update',
  'Account',
  'Formal',
  'Notice',
  'Wallet',
  'Claim',
  'Return',
  'RTO',
  'Others',
];

/** Channels a notification can be delivered through. */
const NOTIFICATION_CHANNELS = ['Dashboard', 'Email', 'SMS', 'WhatsApp'];

/**
 * What each stored channel is called on screen.
 *
 * The stored value stays "Dashboard" because that is the channel the customer
 * dashboard records a view against, and renaming the stored vocabulary would
 * orphan the delivery evidence already written. Staff see "In-App Notification",
 * which is the term the Send Notification modal and the formal notices use for
 * the same thing.
 */
const NOTIFICATION_CHANNEL_LABELS = {
  Dashboard: 'In-App Notification',
  Email: 'Email',
  SMS: 'SMS',
  WhatsApp: 'WhatsApp',
};

/** Title is a one-line summary; the message is the body sent to the customer. */
const NOTIFICATION_TITLE_MAX_LENGTH = 150;
const NOTIFICATION_MESSAGE_MAX_LENGTH = 2000;

/** Zero-padded so notification references sort in the order they were sent. */
const formatNotificationId = (id) => `NTF-${String(id).padStart(5, '0')}`;

/**
 * The overall status of a notification, derived from its channel statuses.
 *
 * @param {string[]} channelStatuses
 * @returns {string} One of NOTIFICATION_STATUSES. An empty list means nothing
 *   was attempted, which is reported as Sent so a notification recorded without a
 *   channel is not mistaken for a failure.
 */
const overallNotificationStatus = (channelStatuses = []) => {
  const attempted = channelStatuses.map((s) => String(s || '').trim()).filter(Boolean);
  if (!attempted.length) return 'Sent';

  for (const status of NOTIFICATION_STATUS_PRIORITY) {
    if (attempted.includes(status)) return status;
  }
  return 'Sent';
};

/**
 * Whether a channel can actually reach this customer.
 *
 * A channel with no registered destination - or no wired transport - is offered
 * as unavailable rather than accepted and silently dropped, so the recorded
 * delivery evidence always reflects a real attempt.
 */
const channelAvailability = (channel, customer) => {
  switch (channel) {
    case 'Dashboard':
      // The customer portal is always available to a registered customer.
      return true;
    case 'Email':
      return !!customer?.email;
    case 'SMS':
      return !!customer?.phone;
    case 'WhatsApp':
      return !!customer?.whatsapp;
    default:
      return false;
  }
};

/**
 * Validates a Send Notification payload.
 *
 * @param {object} body
 * @param {object} customer Used to refuse channels with no destination on file.
 * @param {object[]} requestedChannels Records the modal selected, so a channel
 *   that became unavailable between opening the modal and submitting is reported
 *   clearly instead of failing on the channel vocabulary alone.
 */
const validateCustomerNotification = (body = {}, { customer, requestedChannels } = {}) => {
  const errors = [];

  const notificationType = String(body.notificationType ?? '').trim();
  const title = String(body.title ?? '').trim();
  const message = String(body.message ?? '').trim();
  // The Related Record is an association, not a note, so the modal submits the
  // opaque key of the record staff picked rather than any text they typed. The
  // endpoint re-resolves that key against this customer before storing it, which
  // is what stops a notification being attached to somebody else's record.
  const relatedRecordKey =
    body.relatedRecordKey === undefined || body.relatedRecordKey === null
      ? null
      : String(body.relatedRecordKey).trim();

  const channels = Array.isArray(body.channels)
    ? body.channels.map((c) => String(c).trim()).filter(Boolean)
    : [];

  if (!notificationType) {
    errors.push('Notification Type is required');
  } else if (!NOTIFICATION_TYPES.includes(notificationType)) {
    errors.push(`Notification Type must be one of: ${NOTIFICATION_TYPES.join(', ')}`);
  }

  if (!title) {
    errors.push('Title is required');
  } else if (title.length > NOTIFICATION_TITLE_MAX_LENGTH) {
    errors.push(`Title must be ${NOTIFICATION_TITLE_MAX_LENGTH} characters or fewer`);
  }

  if (!message) {
    errors.push('Message is required');
  } else if (message.length > NOTIFICATION_MESSAGE_MAX_LENGTH) {
    errors.push(`Message must be ${NOTIFICATION_MESSAGE_MAX_LENGTH} characters or fewer`);
  }

  if (relatedRecordKey && !/^[a-z_]+:\d+$/i.test(relatedRecordKey)) {
    errors.push('Related Record must be a record selected from the search results');
  }

  if (!channels.length) {
    errors.push('Select at least one delivery channel');
  } else {
    const invalid = channels.filter((c) => !NOTIFICATION_CHANNELS.includes(c));
    if (invalid.length) {
      errors.push(`Delivery channel must be one of: ${NOTIFICATION_CHANNELS.join(', ')}`);
    } else if (customer) {
      const unavailable = channels.filter((c) => !channelAvailability(c, customer));
      if (unavailable.length) {
        errors.push(
          `No delivery route on file for: ${unavailable.join(', ')}. Choose a channel the customer can actually receive.`
        );
      }
    }
  }

  // Anything the modal sent that is not an approved channel is reported by name,
  // so a tampered payload fails with a usable message rather than a bare 400.
  if (Array.isArray(requestedChannels)) {
    const unknown = requestedChannels.map((c) => String(c).trim()).filter((c) => c && !NOTIFICATION_CHANNELS.includes(c));
    if (unknown.length) {
      errors.push(`Unsupported channel: ${unknown.join(', ')}`);
    }
  }

  if (errors.length) return { valid: false, errors };

  return {
    valid: true,
    errors: [],
    value: { notificationType, title, message, relatedRecordKey: relatedRecordKey || null, channels },
  };
};

/** The catalogue the Send Notification modal renders from. */
const notificationCatalog = () => ({
  statuses: NOTIFICATION_STATUSES,
  statusPriority: NOTIFICATION_STATUS_PRIORITY,
  types: NOTIFICATION_TYPES,
  channels: NOTIFICATION_CHANNELS,
  channelLabels: NOTIFICATION_CHANNEL_LABELS,
  titleMaxLength: NOTIFICATION_TITLE_MAX_LENGTH,
  messageMaxLength: NOTIFICATION_MESSAGE_MAX_LENGTH,
});

/**
 * Policies a customer has to accept, with the version currently in force.
 *
 * A policy update bumps the version. Customers who already accepted the previous
 * version are then asked to accept the new one, and each acceptance is kept as
 * its own record so the history shows what was accepted, which version, and how.
 */
const REQUIRED_POLICIES = [
  {
    key: 'terms_of_service',
    name: 'Terms of Service',
    version: '2.1',
    summary: 'The terms that govern the use of Dazzling Shipping services and the handling of customer shipments.',
  },
  {
    key: 'privacy_policy',
    name: 'Privacy Policy',
    version: '2.0',
    summary: 'How customer personal data, contact details and shipment information are collected, used and retained.',
  },
  {
    key: 'acceptable_use_policy',
    name: 'Acceptable Use Policy',
    version: '1.4',
    summary: 'The restricted and prohibited items, and the account conduct Dazzling Shipping does not permit.',
  },
];

/** Acceptance routes a customer can use, recorded as evidence on the record. */
const ACCEPTANCE_METHODS = [
  'Registration Form',
  'Customer Dashboard',
  'In-App Acceptance',
  'Email Link Confirmation',
  'Staff Recorded',
];

const policyCatalog = () => ({ policies: REQUIRED_POLICIES, methods: ACCEPTANCE_METHODS });

export {
  NOTIFICATION_STATUSES,
  NOTIFICATION_STATUS_PRIORITY,
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_CHANNEL_LABELS,
  NOTIFICATION_TITLE_MAX_LENGTH,
  NOTIFICATION_MESSAGE_MAX_LENGTH,
  ACCEPTANCE_METHODS,
  REQUIRED_POLICIES,
  formatNotificationId,
  overallNotificationStatus,
  channelAvailability,
  validateCustomerNotification,
  notificationCatalog,
  policyCatalog,
};
