/**
 * Compliance / KYC catalogue.
 *
 * The Compliance tab reads its summary cards and its Current Compliance Profile
 * straight from the KYC tables. The option vocabularies live here so the same
 * definitions drive:
 *
 *   - the Update Compliance Profile modal, which renders the dropdowns;
 *   - the update endpoint, which rejects a payload carrying a value the modal
 *     would never have offered.
 *
 * As with the information-request catalogue, one definition for both sides means
 * staff cannot be shown an option the server refuses to store, and the server
 * never stores a value staff were never offered.
 */

/** KYC Status values the Compliance tab and the modal can show. */
const KYC_STATUSES = [
  'Not Required Yet',
  'Pending',
  'Verified',
  'Rejected',
  'Update Required',
];

/** Risk Tier values, lowest to highest. */
const RISK_TIERS = ['Standard', 'Medium', 'High'];

/** Manual Review Required values. Stored as the literal label, not a boolean. */
const MANUAL_REVIEW_STATES = ['Required', 'Not Required'];

/**
 * Written for a customer the moment their account is created, and used as the
 * fallback for any customer whose row predates the KYC tables.
 */
const KYC_DEFAULTS = {
  kycStatus: 'Not Required Yet',
  riskTier: 'Standard',
  manualReviewRequired: 'Not Required',
};

/** Internal Review Note is free text; the modal enforces the same limit. */
const REVIEW_NOTE_MAX_LENGTH = 1000;

/**
 * Profile fields in display order, with the label used in the review history
 * when the field is one an update changed.
 */
const COMPLIANCE_FIELDS = [
  ['kycStatus', 'KYC Status'],
  ['riskTier', 'Risk Tier'],
  ['manualReviewRequired', 'Manual Review Required'],
  ['internalReviewNote', 'Internal Review Note'],
];

/**
 * Coerces a stored or submitted profile into the allowed vocabulary.
 *
 * Any value that is not one of the allowed ones - including a legacy row written
 * before the KYC tables existed - falls back to the documented default, so a
 * summary card can never render a status the dropdowns do not offer.
 */
const normaliseComplianceProfile = (profile = {}) => ({
  kycStatus: KYC_STATUSES.includes(profile.kycStatus) ? profile.kycStatus : KYC_DEFAULTS.kycStatus,
  riskTier: RISK_TIERS.includes(profile.riskTier) ? profile.riskTier : KYC_DEFAULTS.riskTier,
  manualReviewRequired: MANUAL_REVIEW_STATES.includes(profile.manualReviewRequired)
    ? profile.manualReviewRequired
    : KYC_DEFAULTS.manualReviewRequired,
  internalReviewNote: profile.internalReviewNote ?? null,
  lastReviewedBy: profile.lastReviewedBy ?? null,
  lastReviewedAt: profile.lastReviewedAt ?? null,
});

/**
 * Validates an Update Compliance Profile payload.
 *
 * Rejects every value the modal would not have offered, and trims the review
 * note so a whitespace-only note is stored as no note rather than as blank text.
 */
const validateComplianceProfile = (body = {}) => {
  const errors = [];

  const kycStatus = String(body.kycStatus ?? '').trim();
  const riskTier = String(body.riskTier ?? '').trim();
  const manualReviewRequired = String(body.manualReviewRequired ?? '').trim();
  const rawNote = body.internalReviewNote;
  const internalReviewNote = rawNote === undefined || rawNote === null ? null : String(rawNote).trim();

  if (!kycStatus) {
    errors.push('KYC Status is required');
  } else if (!KYC_STATUSES.includes(kycStatus)) {
    errors.push(`KYC Status must be one of: ${KYC_STATUSES.join(', ')}`);
  }

  if (!riskTier) {
    errors.push('Risk Tier is required');
  } else if (!RISK_TIERS.includes(riskTier)) {
    errors.push(`Risk Tier must be one of: ${RISK_TIERS.join(', ')}`);
  }

  if (!manualReviewRequired) {
    errors.push('Manual Review Required is required');
  } else if (!MANUAL_REVIEW_STATES.includes(manualReviewRequired)) {
    errors.push(`Manual Review Required must be one of: ${MANUAL_REVIEW_STATES.join(', ')}`);
  }

  if (internalReviewNote && internalReviewNote.length > REVIEW_NOTE_MAX_LENGTH) {
    errors.push(`Internal Review Note must be ${REVIEW_NOTE_MAX_LENGTH} characters or fewer`);
  }

  if (errors.length) return { valid: false, errors };

  return {
    valid: true,
    errors: [],
    value: { kycStatus, riskTier, manualReviewRequired, internalReviewNote: internalReviewNote || null },
  };
};

/**
 * Single-line rendering of a profile for the review history's Previous / New
 * State columns, so a row shows the whole profile that was in force rather than
 * only the field the reviewer happened to change.
 */
const complianceStateLabel = (profile = {}) => {
  const p = normaliseComplianceProfile(profile);
  return `KYC: ${p.kycStatus} · Risk: ${p.riskTier} · Manual Review: ${p.manualReviewRequired}`;
};

/** Display labels of the fields an update actually changed. */
const changedComplianceFields = (before = {}, after = {}) => {
  const from = normaliseComplianceProfile(before);
  const to = normaliseComplianceProfile(after);
  return COMPLIANCE_FIELDS.filter(([key]) => (from[key] ?? null) !== (to[key] ?? null)).map(([, label]) => label);
};

/** The catalogue the modal renders from. */
const kycCatalog = () => ({
  kycStatuses: KYC_STATUSES,
  riskTiers: RISK_TIERS,
  manualReviewStates: MANUAL_REVIEW_STATES,
  defaults: KYC_DEFAULTS,
  reviewNoteMaxLength: REVIEW_NOTE_MAX_LENGTH,
});

export {
  KYC_STATUSES,
  RISK_TIERS,
  MANUAL_REVIEW_STATES,
  KYC_DEFAULTS,
  REVIEW_NOTE_MAX_LENGTH,
  COMPLIANCE_FIELDS,
  normaliseComplianceProfile,
  validateComplianceProfile,
  complianceStateLabel,
  changedComplianceFields,
  kycCatalog,
};