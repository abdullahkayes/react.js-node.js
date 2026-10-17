/**
 * Customer information-request catalogue.
 *
 * The Request Information modal is a customer-level request: staff describe
 * what is missing, wrong or outdated on the customer record and the customer is
 * notified through the channels staff select. The option vocabularies live
 * here so the same definitions drive:
 *
 *   - the modal, which renders the dropdowns and the generated message;
 *   - the create endpoint, which rejects a request carrying a value the modal
 *     would never have offered.
 *
 * As with the document checklists, one definition for both sides means staff
 * cannot be shown an option the server refuses to store, and the server never
 * stores a value the staff were never offered.
 */

/** Information Type: the top-level grouping that drives the options below. */
const INFORMATION_TYPES = [
  'Personal Information',
  'Business Information',
  'Contact Information',
  'Address Information',
  'Verification & Documents',
  'Compliance / KYC',
  'Other',
];

/**
 * Specific Information Required, per Information Type.
 *
 * Every type offers an explicit catch-all option so a request is never blocked
 * by a list that does not cover the exact case staff need to raise.
 */
const SPECIFIC_INFORMATION = {
  'Personal Information': [
    'Full Name',
    'National ID / Passport',
    'Date of Birth',
    'Personal Identification Document',
    'Other Personal Information',
  ],
  'Business Information': [
    'Business/Page Name',
    'Trade License/Business document',
    'Business Address',
    'Business Contact Representative',
    'Other Business Information',
  ],
  'Contact Information': [
    'Phone Number',
    'Email Address',
    'Contact Verification',
    'Other Contact Information',
  ],
  'Address Information': [
    'Home/Business Address',
    'Warehouse Address',
    'Delivery Address',
    'Other Address Information',
  ],
  'Verification & Documents': [
    'Trade License/Business document',
    'Customer Account Document',
    'Document Correction',
    'Other Verification Information',
  ],
  'Compliance / KYC': [
    'KYC Information',
    'Compliance Document',
    'Supporting Information',
    'Other Compliance Information',
  ],
  Other: ['Other Information Required'],
};

/** Action Required: what the customer has to do in response. */
const ACTION_REQUIRED = [
  'Provide Information',
  'Update Information',
  'Correct Information',
  'Upload Document',
  'Replace Document',
  'Confirm Information',
];

/** Reason: why the request is being raised. */
const REASONS = [
  'Information is missing',
  'Information is outdated',
  'Information is incorrect',
  'Information does not match existing records',
  'Document has expired',
  'Document is unclear or unreadable',
  'Document is incomplete',
  'Additional verification is required',
  'Other',
];

/** The reason that makes Reason Details mandatory. */
const OTHER_REASON = 'Other';

/** Notification Channels: where the customer is told about the request. */
const NOTIFICATION_CHANNELS = ['Email', 'SMS', 'WhatsApp', 'In-App Notification'];

const isAllowed = (list, value) => list.includes(String(value ?? '').trim());

const specificOptionsFor = (informationType) =>
  SPECIFIC_INFORMATION[String(informationType ?? '').trim()] || [];

const requiresReasonDetails = (reason) => String(reason ?? '').trim() === OTHER_REASON;

/**
 * Validates a submitted information request.
 *
 * Returns the trimmed, normalised payload on success and a list of human
 * messages on failure, so the modal can show the same wording the server would
 * have returned.
 *
 * @returns {{ valid: boolean, errors: string[], value: object }}
 */
const validateInformationRequest = (input = {}) => {
  const errors = [];
  const trim = (value) => (value === undefined || value === null ? '' : String(value).trim());

  const informationType = trim(input.informationType);
  const specificInformation = trim(input.specificInformation);
  const actionRequired = trim(input.actionRequired);
  const requiredDetails = trim(input.requiredDetails);
  const reason = trim(input.reason);
  const reasonDetails = trim(input.reasonDetails);
  const additionalInstructions = trim(input.additionalInstructions);

  const channels = Array.isArray(input.notificationChannels)
    ? input.notificationChannels.map((c) => trim(c)).filter(Boolean)
    : [];

  if (!informationType) {
    errors.push('Information Type is required');
  } else if (!isAllowed(INFORMATION_TYPES, informationType)) {
    errors.push(`"${informationType}" is not a valid Information Type`);
  }

  // The Specific Information options depend on the type, so this is only
  // meaningful once the type itself is known.
  if (!specificInformation) {
    errors.push('Specific Information Required is required');
  } else if (!isAllowed(specificOptionsFor(informationType), specificInformation)) {
    errors.push(`"${specificInformation}" is not a valid Specific Information Required option for ${informationType}`);
  }

  if (!actionRequired) {
    errors.push('Action Required is required');
  } else if (!isAllowed(ACTION_REQUIRED, actionRequired)) {
    errors.push(`"${actionRequired}" is not a valid Action Required value`);
  }

  if (!requiredDetails) {
    errors.push('Required Details is required and must describe exactly what the customer must provide');
  }

  if (!reason) {
    errors.push('Reason is required');
  } else if (!isAllowed(REASONS, reason)) {
    errors.push(`"${reason}" is not a valid Reason`);
  }

  // Reason Details is conditional: mandatory for Other, stored when supplied
  // for any other reason so staff can still add context.
  if (requiresReasonDetails(reason) && !reasonDetails) {
    errors.push('Reason Details is required when Reason is Other');
  }

  const uniqueChannels = [...new Set(channels)];
  if (uniqueChannels.length === 0) {
    errors.push('Select at least one notification channel');
  } else {
    const invalid = uniqueChannels.filter((c) => !isAllowed(NOTIFICATION_CHANNELS, c));
    if (invalid.length) {
      errors.push(`Invalid notification channel(s): ${invalid.join(', ')}`);
    }
  }

  if (errors.length) return { valid: false, errors, value: null };

  return {
    valid: true,
    errors: [],
    value: {
      informationType,
      specificInformation,
      actionRequired,
      requiredDetails,
      reason,
      reasonDetails: requiresReasonDetails(reason) || reasonDetails ? reasonDetails : null,
      additionalInstructions: additionalInstructions || null,
      notificationChannels: uniqueChannels,
    },
  };
};

/**
 * Customer-facing copy for an information request.
 *
 * Generated from the request fields and stored with the request, so the exact
 * message that was sent can be reproduced from the audit trail later.
 */
const buildInformationRequestNotification = ({ customer, informationType, specificInformation, actionRequired, requiredDetails, reason, reasonDetails, additionalInstructions }) => {
  const firstName = String(customer.name || '').trim().split(/\s+/)[0] || 'Customer';
  const subject = `Action Required: ${specificInformation} - ${informationType}`;

  const text = [
    `Dear ${firstName},`,
    '',
    `We need to update your ${informationType.toLowerCase()} on our records.`,
    '',
    `Information required: ${specificInformation}`,
    `Action required: ${actionRequired}`,
    '',
    'What we need from you',
    requiredDetails,
    '',
    `Reason: ${reason}`,
  ];
  if (reasonDetails && String(reasonDetails).trim()) text.push(`Reason details: ${String(reasonDetails).trim()}`);
  if (additionalInstructions && String(additionalInstructions).trim()) text.push('', 'Additional instructions', String(additionalInstructions).trim());

  text.push(
    '',
    'Please sign in to your Dazzling Shipping account to provide the requested information. Any request or booking that depends on this information stays on hold until it has been received and verified.',
    '',
    'Regards,',
    'Dazzling Shipping',
    'International Shipping & Logistics'
  );

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f2937;line-height:1.6">
  <h2 style="color:#2563eb;margin:0 0 16px">Dazzling Shipping</h2>
  <p>Dear ${escapeHtml(firstName)},</p>
  <p>We need to update your ${escapeHtml(informationType.toLowerCase())} on our records.</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0">
    <tr><td style="padding:8px;border:1px solid #e5e7eb;width:35%"><strong>Information required</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(specificInformation)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Action required</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(actionRequired)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Reason</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(reason)}</td></tr>
  </table>
  <h3 style="font-size:14px;margin:20px 0 6px">What we need from you</h3>
  <p style="margin:0;white-space:pre-line">${escapeHtml(requiredDetails)}</p>
  ${reasonDetails && String(reasonDetails).trim() ? `<h3 style="font-size:14px;margin:20px 0 6px">Reason details</h3><p style="margin:0;white-space:pre-line">${escapeHtml(String(reasonDetails).trim())}</p>` : ''}
  ${additionalInstructions && String(additionalInstructions).trim() ? `<h3 style="font-size:14px;margin:20px 0 6px">Additional instructions</h3><p style="margin:0;white-space:pre-line">${escapeHtml(String(additionalInstructions).trim())}</p>` : ''}
  <p>Please sign in to your Dazzling Shipping account to provide the requested information. Any request or booking that depends on this information stays on hold until it has been received and verified.</p>
  <p>Regards,<br /><strong>Dazzling Shipping</strong><br />International Shipping &amp; Logistics</p>
</div>`.trim();

  return { subject, message: text.join('\n'), html };
};

/**
 * The whole-request option on the Request Information modal.
 *
 * A notice is often about the request as a whole rather than one item, so this
 * appears alongside the items and is mutually exclusive with them: picking it
 * means "no particular item".
 */
const WHOLE_REQUEST = 'whole-request';

/**
 * Validates a request-level information request.
 *
 * This is a different shape from the customer-level form on purpose. Staff pick
 * which items the question is about and write the message themselves, rather than
 * classifying the gap and having the wording generated from a catalogue, so there
 * is nothing here to validate against a vocabulary.
 *
 * What is enforced is the part that would otherwise be silently wrong: a notice
 * has to be about something, and it has to actually say something. The item ids
 * are checked against `availableItemIds` rather than trusted, so a crafted id
 * cannot attach a notice to an item on somebody else's request.
 *
 * @returns {{ valid: boolean, errors: string[], value: object }}
 */
const validateRequestInformationRequest = (input = {}, { availableItemIds = [] } = {}) => {
  const errors = [];
  const trim = (value) => (value === undefined || value === null ? '' : String(value).trim());

  const message = trim(input.message);
  const wholeRequest = input.wholeRequest === true || trim(input.wholeRequest) === 'true';

  const requested = Array.isArray(input.itemIds)
    ? input.itemIds.map((id) => String(id).trim()).filter(Boolean)
    : trim(input.itemIds) ? trim(input.itemIds).split(',').map((id) => id.trim()).filter(Boolean) : [];

  const channels = Array.isArray(input.notificationChannels)
    ? input.notificationChannels.map((channel) => trim(channel)).filter(Boolean)
    : trim(input.notificationChannels)
      ? trim(input.notificationChannels).split(',').map((channel) => channel.trim()).filter(Boolean)
      : [];

  // Picking the whole request and picking items are two answers to one question,
  // so accepting both would store a notice whose scope is ambiguous.
  if (wholeRequest && requested.length) {
    errors.push('Choose either the whole request or specific items, not both');
  } else if (!wholeRequest && !requested.length) {
    errors.push('Select at least one related item, or choose the whole request');
  }

  // An id the modal would never have offered is refused rather than ignored, which
  // is what stops a notice being pointed at another request's item.
  const known = new Set(availableItemIds.map((id) => String(id)));
  const unknown = requested.filter((id) => !known.has(id));
  if (unknown.length) {
    errors.push(`Item ${unknown.join(', ')} is not on this request`);
  }

  if (!message) {
    errors.push('Information Required is required and must describe what the customer should provide');
  }

  const uniqueChannels = [...new Set(channels)];
  if (!uniqueChannels.length) {
    errors.push('Select at least one notification channel');
  } else {
    const invalid = uniqueChannels.filter((channel) => !isAllowed(NOTIFICATION_CHANNELS, channel));
    if (invalid.length) errors.push(`Invalid notification channel(s): ${invalid.join(', ')}`);
  }

  if (errors.length) return { valid: false, errors, value: null };

  return {
    valid: true,
    errors: [],
    value: {
      wholeRequest,
      // Stored as the item ids the notice is about. An empty list means the whole
      // request, which is what distinguishes it from a notice about no items.
      itemIds: wholeRequest ? [] : requested.map(Number),
      message,
      notificationChannels: uniqueChannels,
    },
  };
};

/**
 * Customer-facing copy for a request-level information request.
 *
 * Generated from the request it was raised from and stored with the notice, so the
 * exact subject and message that were sent can be reproduced from the audit trail
 * later. The items the notice is about are named in both the subject and the body,
 * because that is what tells the customer which part of their submission to look at.
 */
const buildRequestInformationNotification = ({ customer, requestRef, typeLabel, itemLabels = [], wholeRequest = false, message }) => {
  const firstName = String(customer?.name || '').trim().split(/\s+/)[0] || 'Customer';

  // Naming the items in the subject is what makes the notice actionable in a
  // crowded inbox; the whole-request case falls back to the request reference.
  const subject = wholeRequest || !itemLabels.length
    ? `Action Required: Additional information for ${requestRef}`
    : `Action Required: ${itemLabels.join(', ')} - ${requestRef}`;

  const scope = wholeRequest || !itemLabels.length
    ? `Your ${typeLabel} ${requestRef} needs more information.`
    : `Your ${typeLabel} ${requestRef} needs more information about the following item${itemLabels.length === 1 ? '' : 's'}:\n${itemLabels.map((label) => `  - ${label}`).join('\n')}`;

  const text = [
    `Dear ${firstName},`,
    '',
    scope,
    '',
    'What we need from you',
    message,
    '',
    'Please sign in to your Dazzling Shipping account to open this request and provide the requested details. The request stays on hold until we have received and reviewed your response.',
    '',
    'Regards,',
    'Dazzling Shipping',
    'International Shipping & Logistics',
  ].join('\n');

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const itemBlock = wholeRequest || !itemLabels.length
    ? ''
    : `<h3 style="font-size:14px;margin:20px 0 6px">Items this applies to</h3><ul style="margin:0;padding-left:20px">${itemLabels.map((label) => `<li>${escapeHtml(label)}</li>`).join('')}</ul>`;

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f2937;line-height:1.6">
  <h2 style="color:#2563eb;margin:0 0 16px">Dazzling Shipping</h2>
  <p>Dear ${escapeHtml(firstName)},</p>
  <p>${escapeHtml(wholeRequest || !itemLabels.length
    ? `Your ${typeLabel} ${requestRef} needs more information.`
    : `Your ${typeLabel} ${requestRef} needs more information about the following item${itemLabels.length === 1 ? '' : 's'}:`)}</p>
  ${itemBlock}
  <h3 style="font-size:14px;margin:20px 0 6px">What we need from you</h3>
  <p style="margin:0;white-space:pre-line">${escapeHtml(message)}</p>
  <p>Please sign in to your Dazzling Shipping account to open this request and provide the requested details. The request stays on hold until we have received and reviewed your response.</p>
  <p>Regards,<br /><strong>Dazzling Shipping</strong><br />International Shipping &amp; Logistics</p>
</div>`.trim();

  return { subject, message: text, html };
};

/**
 * The catalogue the modal renders from. Serialised into the page as JSON so the
 * dropdowns on screen always come from these same definitions.
 */
const informationRequestCatalog = () => ({
  informationTypes: INFORMATION_TYPES,
  specificInformation: SPECIFIC_INFORMATION,
  actionRequired: ACTION_REQUIRED,
  reasons: REASONS,
  otherReason: OTHER_REASON,
  notificationChannels: NOTIFICATION_CHANNELS,
});

export {
  INFORMATION_TYPES,
  SPECIFIC_INFORMATION,
  ACTION_REQUIRED,
  REASONS,
  OTHER_REASON,
  NOTIFICATION_CHANNELS,
  WHOLE_REQUEST,
  specificOptionsFor,
  requiresReasonDetails,
  validateInformationRequest,
  validateRequestInformationRequest,
  buildInformationRequestNotification,
  buildRequestInformationNotification,
  informationRequestCatalog,
};