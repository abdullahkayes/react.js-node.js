/**
 * Presentation helpers for the request-details pages.
 *
 * These are supplied to the view as render locals rather than declared inside an
 * EJS partial. An included partial cannot see a `const` defined in the template
 * that includes it, but it does see every render local - so putting them here is
 * what lets the three detail pages, their shared section partials and the review
 * modal all format values the same way without repeating the definitions.
 *
 * They are presentation only. Nothing here reads or writes the database.
 */

const fmtDateTime = (value) => (value
  ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—');

const fmtDate = (value) => (value
  ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—');

/** Shows an em dash rather than a blank line for a value the customer never gave. */
const orDash = (value) => (value === null || value === undefined || String(value).trim() === '' ? '—' : value);

/**
 * Item acceptance badge colours. An item can only be Pending, Approved or
 * Rejected, so all three are styled here rather than at each use site.
 */
const acceptanceBadge = {
  Approved: 'bg-[#064E3B]/60 text-[#34D399] border-[#059669]/50',
  Rejected: 'bg-[#451a1a] text-[#F87171] border-[#7F1D1D]/60',
  Pending: 'bg-[#3B2808] text-[#F59E0B] border-[#784E0F]',
};

const verificationBadge = {
  Verified: 'bg-[#064E3B]/60 text-[#34D399] border-[#059669]/50',
  Rejected: 'bg-[#451a1a] text-[#F87171] border-[#7F1D1D]/60',
  'Needs Correction': 'bg-[#4C1D95]/50 text-[#C084FC] border-[#7E22CE]/50',
  Pending: 'bg-[#3B2808] text-[#F59E0B] border-[#784E0F]',
};

/**
 * The documents table stores "Pending"; every screen that lists a document calls
 * it "Pending Review", so the wording is translated in one place.
 */
const verificationLabel = (status) => (status === 'Pending' ? 'Pending Review' : status);

/**
 * The staff member who recorded a document decision, shown by id because the
 * reviewer is resolved per page rather than joined into every row.
 */
const reviewerRef = (id) => (id ? `STF-${String(id).padStart(6, '0')}` : '—');

const FREIGHT_LABEL = { air: 'Air Freight', sea: 'Sea Freight' };

/**
 * The values a request-details page needs that are derived from the request row
 * rather than stored on it.
 *
 * `isAir` and `chargeableVolume` are resolved once here because the same freight
 * mode decides both how every item's volume is calculated and what that figure is
 * called. Calculating it in two places is how a page ends up labelling a
 * cubic-metre figure as a volumetric weight.
 */
const requestDetailViewState = (record, freightMode) => {
  const isAir = String(freightMode || record.freightMode || '').toLowerCase() === 'air';
  return {
    isAir,
    freightLabel: FREIGHT_LABEL[String(freightMode || record.freightMode || '').toLowerCase()] || orDash(record.freightMode),
    chargeableVolume: isAir
      ? { label: 'Volumetric Weight', unit: 'kg' }
      : { label: 'CBM', unit: 'm³' },
  };
};

export {
  fmtDateTime,
  fmtDate,
  orDash,
  acceptanceBadge,
  verificationBadge,
  verificationLabel,
  reviewerRef,
  requestDetailViewState,
};