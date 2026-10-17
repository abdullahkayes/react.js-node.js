/**
 * Account status case catalogue.
 *
 * The Account Actions tab reads its summary cards, the Active Account Status Case
 * and the Account Action History straight from the `account_actions` table. The
 * option vocabularies live here so one definition drives both sides:
 *
 *   - the Start Account Action modal, which renders the dropdowns;
 *   - the create/resolve endpoints, which reject a payload carrying a value the
 *     modal would never have offered.
 *
 * As with the compliance and information-request catalogues, this means staff
 * cannot be shown an option the server refuses to store.
 */

/**
 * Case types, in the order the modal offers them.
 *
 * Dormant is deliberately absent: it is not an action staff can take, so it is
 * never offered and the endpoint refuses it.
 */
const CASE_TYPES = [
  'Warning',
  'Restriction',
  'Suspension',
  'Termination',
  'Closed',
];

/**
 * The account status each case type imposes while the case is open.
 *
 * The case type is a noun and the account status is a participle, so they are
 * not the same vocabulary: a Restriction case puts the account into Restricted
 * status. This map is the only place that translation happens, which keeps the
 * Status Change column and the customer's real `account_status` in agreement.
 */
const ACCOUNT_STATUS_BY_CASE_TYPE = {
  Warning: 'Warning',
  Restriction: 'Restricted',
  Suspension: 'Suspended',
  Termination: 'Terminated',
  Closed: 'Closed',
};

/** Status a customer sits on when they have never had a case opened against them. */
const DEFAULT_ACCOUNT_STATUS = 'Active';

/**
 * Every status `customers.account_status` can hold.
 *
 * This is wider than the case types: an account can still sit on a status that
 * no longer has an action behind it (Dormant), and the UI has to render that
 * row rather than fall over on an unknown vocabulary.
 */
const ACCOUNT_STATUSES = [
  DEFAULT_ACCOUNT_STATUS,
  ...Object.values(ACCOUNT_STATUS_BY_CASE_TYPE),
  'Dormant',
];

/**
 * An account carries at most one open case, so these are the only two states a
 * case can be in. A resolved case stays on the record as history.
 */
const CASE_STATUSES = ['Open', 'Resolved'];

/** Reason categories staff can pick. "Other" is why Reason Details is mandatory. */
const REASON_CATEGORIES = [
  'Payment Issue',
  'Document Issue',
  'Declaration Issue',
  'Policy Violation',
  'Security Concern',
  'Confirmed Fraud',
  'Unauthorized Access',
  'Repeated Violation',
  'Customer Request',
  'Other',
];

/**
 * Case types where the account is being put into a restricted state. These four
 * are always notified through the approved channels, because the customer loses
 * the ability to book, request or receive.
 */
const MANDATORY_NOTICE_CASE_TYPES = [
  'Restriction',
  'Suspension',
  'Termination',
  'Closed',
];

/**
 * Correction window for a Warning case, in calendar days.
 *
 * The deadline is measured from the moment the notice was sent, not from when the
 * case was opened, so the customer is always given the full window to respond.
 */
const CORRECTION_WINDOW_DAYS = 7;

/** Reason Details is free text; the modal enforces the same limit. */
const REASON_DETAILS_MAX_LENGTH = 1000;
const RESOLUTION_NOTE_MAX_LENGTH = 1000;
/** Reference the staff member typed into the search box before a hit is picked. */
const RELATED_RECORD_MAX_LENGTH = 100;
/** Opaque `kind:id` key the Related Record search returns. */
const RELATED_RECORD_KEY_MAX_LENGTH = 60;

/** Notification channels staff may send a Formal Notice through. */
const NOTICE_CHANNELS = ['Email', 'SMS', 'WhatsApp', 'In-App Notification'];

/** Notification Type recorded against every notice raised by this feature. */
const NOTICE_TYPE = 'Formal Notice';

/**
 * Case ID and Notice ID are generated, not entered. Both are zero-padded so they
 * sort in the order they were issued.
 */
const formatCaseId = (id) => `ACT-${String(id).padStart(5, '0')}`;
const formatNoticeId = (id) => `NTC-${String(id).padStart(5, '0')}`;

/**
 * The correction deadline for an open Warning case: the notice's sent time plus
 * seven calendar days. Returns null for anything that is not an open Warning
 * case, because a deadline on a non-warning case would be meaningless.
 */
const calculateCorrectionDeadline = (caseType, noticeSentAt) => {
  if (caseType !== 'Warning' || !noticeSentAt) return null;
  const sent = new Date(noticeSentAt);
  if (Number.isNaN(sent.getTime())) return null;
  const deadline = new Date(sent.getTime());
  deadline.setDate(deadline.getDate() + CORRECTION_WINDOW_DAYS);
  return deadline;
};

/**
 * The account status a case puts the account into while it is open, and the
 * status the account returns to once the case is resolved.
 */
const statusForCaseType = (caseType) => ACCOUNT_STATUS_BY_CASE_TYPE[caseType] || null;

/**
 * The case types staff may pick for an account that currently sits on
 * `currentStatus`.
 *
 * The action that would leave the account exactly where it already is is removed
 * from the list, because applying it would burn a case reference, send a Formal
 * Notice and write an audit event without changing anything. Worked example: an
 * account that is already Warning cannot be given a second Warning, so it is
 * offered Restriction, Suspension, Termination and Closed instead.
 */
const selectableCaseTypes = (currentStatus) =>
  CASE_TYPES.filter((type) => statusForCaseType(type) !== currentStatus);

/**
 * Case types the modal may show for an existing open case.
 *
 * An open case must keep its own type even when the account has since been moved
 * onto that same status by something else, otherwise the modal would hide the
 * type of the case it is editing and force a change nobody made.
 */
const caseTypesForModal = (currentStatus, editingCaseType) => {
  const selectable = selectableCaseTypes(currentStatus);
  if (editingCaseType && !selectable.includes(editingCaseType)) return [...selectable, editingCaseType];
  return selectable;
};

/**
 * Validates a Start Account Action / Edit Case payload.
 *
 * Enforces the rules the modal shows: the case type, case status and reason
 * category must come from the approved vocabularies, Reason Details is always
 * required (it is the text the Reason Category hover pop-up shows, and it is the
 * only record of *why* the account was restricted), and at least one approved
 * channel must be selected for the Formal Notice.
 *
 * `currentStatus` is optional. When it is supplied, an action that would not
 * actually change the account status is rejected, which enforces the same
 * no-op rule the modal applies by hiding the option.
 *
 * `noticeRequired` is optional and defaults to true. It is only false for a
 * plain edit of an open case: such a save changes no status and sends no notice,
 * so requiring a notification channel for it would demand an action that has no
 * effect. Creating a case and resolving one both notify the customer.
 */
const validateAccountAction = (body = {}, { currentStatus, noticeRequired = true } = {}) => {
  const errors = [];

  const caseType = String(body.caseType ?? '').trim();
  const caseStatus = String(body.caseStatus ?? '').trim();
  const reasonCategory = String(body.reasonCategory ?? '').trim();
  const reasonDetails = String(body.reasonDetails ?? '').trim();
  // The Related Record is chosen from the customer's own records by search, so the
  // modal submits the opaque key the search returned rather than free text. The
  // endpoint re-resolves it against this customer before storing anything.
  const relatedRecordKeyRaw = body.relatedRecordKey;
  const relatedRecordKey =
    relatedRecordKeyRaw === undefined || relatedRecordKeyRaw === null
      ? null
      : String(relatedRecordKeyRaw).trim();
  const resolutionNoteRaw = body.resolutionNote;
  const resolutionNote =
    resolutionNoteRaw === undefined || resolutionNoteRaw === null ? null : String(resolutionNoteRaw).trim();

  const channels = Array.isArray(body.notificationChannels)
    ? body.notificationChannels.map((c) => String(c).trim()).filter(Boolean)
    : [];

  if (!caseType) {
    errors.push('Case Type is required');
  } else if (!CASE_TYPES.includes(caseType)) {
    errors.push(`Case Type must be one of: ${CASE_TYPES.join(', ')}`);
  } else if (currentStatus && statusForCaseType(caseType) === currentStatus) {
    // A no-op case would still consume a Case ID, a Notice ID and an audit event
    // while leaving the account exactly as it was.
    errors.push(`The account is already ${currentStatus}, so this action would not change anything`);
  }

  if (!caseStatus) {
    errors.push('Case Status is required');
  } else if (!CASE_STATUSES.includes(caseStatus)) {
    errors.push(`Case Status must be one of: ${CASE_STATUSES.join(', ')}`);
  }

  if (!reasonCategory) {
    errors.push('Reason Category is required');
  } else if (!REASON_CATEGORIES.includes(reasonCategory)) {
    errors.push(`Reason Category must be one of: ${REASON_CATEGORIES.join(', ')}`);
  }

  // Mandatory for every category, not only "Other": the hover pop-up on the
  // Reason Category column is the only place this text is shown, and an empty
  // pop-up would leave the decision unexplained.
  if (!reasonDetails) {
    errors.push('Reason Details is required');
  } else if (reasonDetails.length > REASON_DETAILS_MAX_LENGTH) {
    errors.push(`Reason Details must be ${REASON_DETAILS_MAX_LENGTH} characters or fewer`);
  }

  if (relatedRecordKey && relatedRecordKey.length > RELATED_RECORD_KEY_MAX_LENGTH) {
    errors.push(`Related Record must be ${RELATED_RECORD_KEY_MAX_LENGTH} characters or fewer`);
  }

  if (resolutionNote && resolutionNote.length > RESOLUTION_NOTE_MAX_LENGTH) {
    errors.push(`Resolution Note must be ${RESOLUTION_NOTE_MAX_LENGTH} characters or fewer`);
  }

  if (!channels.length) {
    if (noticeRequired) {
      errors.push('Select at least one notification channel for the Formal Notice');
    }
  } else {
    const invalid = channels.filter((c) => !NOTICE_CHANNELS.includes(c));
    if (invalid.length) {
      errors.push(`Notification channel must be one of: ${NOTICE_CHANNELS.join(', ')}`);
    }
  }

  // Resolving a case is what puts the customer back in good standing, so it has
  // to say why, otherwise the history records a status change with no reasoning.
  if (caseStatus === 'Resolved' && !resolutionNote) {
    errors.push('Resolution Note is required when resolving a case');
  }

  if (errors.length) return { valid: false, errors };

  return {
    valid: true,
    errors: [],
    value: {
      caseType,
      caseStatus,
      reasonCategory,
      reasonDetails,
      relatedRecordKey: relatedRecordKey || null,
      resolutionNote: resolutionNote || null,
      notificationChannels: channels,
    },
  };
};

/**
 * Single-line rendering of a case for search and for the audit trail, so a row
 * can be identified without opening it.
 */
const accountActionSummary = (action = {}) => {
  const type = CASE_TYPES.includes(action.caseType) ? action.caseType : 'Case';
  const reason = REASON_CATEGORIES.includes(action.reasonCategory) ? action.reasonCategory : null;
  const change = action.previousStatus && action.newStatus
    ? `${action.previousStatus} -> ${action.newStatus}`
    : action.newStatus || null;
  return [type, reason, change].filter(Boolean).join(' - ');
};

/**
 * The catalogue the modal renders from.
 *
 * `currentStatus` decides which case types are offered: the action that would
 * leave the account where it already is is withheld, so staff cannot apply a
 * no-op. `editingCaseType` keeps the type of an existing open case in the list.
 */
const accountActionCatalog = ({ currentStatus, editingCaseType } = {}) => ({
  caseTypes: CASE_TYPES,
  selectableCaseTypes: currentStatus ? caseTypesForModal(currentStatus, editingCaseType) : CASE_TYPES,
  caseStatuses: CASE_STATUSES,
  reasonCategories: REASON_CATEGORIES,
  noticeChannels: NOTICE_CHANNELS,
  mandatoryNoticeCaseTypes: MANDATORY_NOTICE_CASE_TYPES,
  accountStatusByCaseType: ACCOUNT_STATUS_BY_CASE_TYPE,
  defaultAccountStatus: DEFAULT_ACCOUNT_STATUS,
  correctionWindowDays: CORRECTION_WINDOW_DAYS,
  reasonDetailsMaxLength: REASON_DETAILS_MAX_LENGTH,
  resolutionNoteMaxLength: RESOLUTION_NOTE_MAX_LENGTH,
  relatedRecordMaxLength: RELATED_RECORD_MAX_LENGTH,
  relatedRecordKeyMaxLength: RELATED_RECORD_KEY_MAX_LENGTH,
  noticeType: NOTICE_TYPE,
});

/**
 * Builds the Formal Notice sent to the customer when a case is opened.
 *
 * The notice is the customer's only record of why their account was restricted,
 * so it states the case type, the new status, the reason category, the full
 * reason details, the case reference and - for a Warning - the correction
 * deadline the customer has to meet.
 */
const buildAccountActionNotice = ({
  customer,
  caseType,
  newStatus,
  reasonCategory,
  reasonDetails,
  caseRef,
  noticeRef,
  correctionDeadline,
}) => {
  const firstName = String(customer?.name || '').trim().split(/\s+/)[0] || 'Customer';
  const deadlineLabel = correctionDeadline
    ? new Date(correctionDeadline).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const subject = `${NOTICE_TYPE}: Your account status has changed to ${newStatus}`;

  const lines = [
    `Dear ${firstName},`,
    '',
    `We are writing to inform you that a ${caseType.toLowerCase()} case has been opened on your Dazzling Shipping account.`,
    '',
    `Your account status has changed to: ${newStatus}`,
    `Reason category: ${reasonCategory}`,
    `Case reference: ${caseRef}`,
    `Notice reference: ${noticeRef}`,
    '',
    'Reason',
    reasonDetails,
  ];

  if (deadlineLabel) {
    lines.push(
      '',
      'Correction required',
      `Please correct the matter by ${deadlineLabel}. Failing to do so may lead to further action on your account.`
    );
  } else {
    lines.push(
      '',
      'Please sign in to your Dazzling Shipping account for the full terms of this notice and what you can do.'
    );
  }

  lines.push('', 'Regards,', 'Dazzling Shipping', 'International Shipping & Logistics');

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const text = lines.join('\n');

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f2937;line-height:1.6">
  <h2 style="color:#2563eb;margin:0 0 16px">Dazzling Shipping</h2>
  <p>Dear ${escapeHtml(firstName)},</p>
  <p>We are writing to inform you that a ${escapeHtml(caseType.toLowerCase())} case has been opened on your Dazzling Shipping account.</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0">
    <tr><td style="padding:8px;border:1px solid #e5e7eb;width:35%"><strong>Account status</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(newStatus)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Case type</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(caseType)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Reason category</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(reasonCategory)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Case reference</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(caseRef)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Notice reference</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(noticeRef)}</td></tr>
  </table>
  <h3 style="font-size:14px;margin:20px 0 6px">Reason</h3>
  <p style="margin:0;white-space:pre-line">${escapeHtml(reasonDetails)}</p>
  ${
    deadlineLabel
      ? `<h3 style="font-size:14px;margin:20px 0 6px">Correction required</h3>
         <p style="margin:0">Please correct the matter by <strong>${escapeHtml(deadlineLabel)}</strong>. Failing to do so may lead to further action on your account.</p>`
      : `<p style="margin-top:20px">Please sign in to your Dazzling Shipping account for the full terms of this notice and what you can do.</p>`
  }
  <p style="margin-top:30px;color:#6b7280;font-size:12px">Dazzling Shipping - International Shipping &amp; Logistics</p>
</div>`.trim();

  return { subject, text, html };
};

/**
 * Builds the notice sent when a case is resolved.
 *
 * Resolving a case puts the account back into good standing, which is itself an
 * account status change, so the customer is told through the same channels they
 * were warned on.
 */
const buildAccountActionResolutionNotice = ({ customer, caseType, caseRef, noticeRef, resolutionNote }) => {
  const firstName = String(customer?.name || '').trim().split(/\s+/)[0] || 'Customer';
  const subject = `${NOTICE_TYPE}: Your account status has been restored to ${DEFAULT_ACCOUNT_STATUS}`;

  const text = [
    `Dear ${firstName},`,
    '',
    `The ${caseType.toLowerCase()} case raised on your Dazzling Shipping account has been resolved.`,
    '',
    `Your account status has been restored to: ${DEFAULT_ACCOUNT_STATUS}`,
    `Case reference: ${caseRef}`,
    `Notice reference: ${noticeRef}`,
    '',
    'Resolution',
    resolutionNote,
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

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f2937;line-height:1.6">
  <h2 style="color:#2563eb;margin:0 0 16px">Dazzling Shipping</h2>
  <p>Dear ${escapeHtml(firstName)},</p>
  <p>The ${escapeHtml(caseType.toLowerCase())} case raised on your Dazzling Shipping account has been resolved.</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0">
    <tr><td style="padding:8px;border:1px solid #e5e7eb;width:35%"><strong>Account status</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(DEFAULT_ACCOUNT_STATUS)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Case reference</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(caseRef)}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Notice reference</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${escapeHtml(noticeRef)}</td></tr>
  </table>
  <h3 style="font-size:14px;margin:20px 0 6px">Resolution</h3>
  <p style="margin:0;white-space:pre-line">${escapeHtml(resolutionNote)}</p>
  <p style="margin-top:30px;color:#6b7280;font-size:12px">Dazzling Shipping - International Shipping &amp; Logistics</p>
</div>`.trim();

  return { subject, text, html };
};

export {
  CASE_TYPES,
  CASE_STATUSES,
  REASON_CATEGORIES,
  ACCOUNT_STATUSES,
  ACCOUNT_STATUS_BY_CASE_TYPE,
  DEFAULT_ACCOUNT_STATUS,
  MANDATORY_NOTICE_CASE_TYPES,
  CORRECTION_WINDOW_DAYS,
  REASON_DETAILS_MAX_LENGTH,
  RESOLUTION_NOTE_MAX_LENGTH,
RELATED_RECORD_MAX_LENGTH,
  RELATED_RECORD_KEY_MAX_LENGTH,
  NOTICE_CHANNELS,
  NOTICE_TYPE,
  formatCaseId,
  formatNoticeId,
  calculateCorrectionDeadline,
  statusForCaseType,
  selectableCaseTypes,
  caseTypesForModal,
  validateAccountAction,
  accountActionSummary,
  accountActionCatalog,
  buildAccountActionNotice,
  buildAccountActionResolutionNotice,
};
