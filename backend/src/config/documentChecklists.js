/**
 * Document verification checklists.
 *
 * The verification modal is universal: one screen, one set of actions. What
 * changes per document is the checklist the reviewer has to work through, so
 * the checklist definitions live here and are shared by:
 *
 *   - the modal, which renders the list for the selected document type;
 *   - the verification endpoint, which rejects a "Verified" decision that was
 *     saved with required checks still open.
 *
 * Keeping one definition for both sides means a reviewer can never be shown a
 * requirement the server will not enforce, and the server never enforces a
 * check the reviewer was not shown.
 */

/** Human labels for the documents.documentType enum. */
const DOC_TYPE_LABELS = {
  trade_license: 'Trade License/Business document',
  national_id: 'National ID',
  invoice: 'Invoice',
  commercial_invoice: 'Commercial Invoice',
  packing_list: 'Packing List',
  bill_of_lading: 'Bill of Lading',
  customs_declaration: 'Customs Declaration',
  insurance_certificate: 'Insurance Certificate',
  certificate_of_origin: 'Certificate of Origin',
  shipping_instructions: 'Shipping Instructions',
  delivery_proof: 'Proof of Delivery',
  return_authorization: 'Return Authorization',
  rto_document: 'RTO Document',
  insurance_claim: 'Insurance Claim',
  receipt: 'Receipt',
  source_document: 'Source Document',
  return_label: 'Return Label',
  rma_document: 'RMA Document',
  claim_photo: 'Claim Photo',
  awb: 'AWB',
  delivery_order: 'Delivery Order',
  other: 'Other',
};

const docTypeLabel = (type) => DOC_TYPE_LABELS[type] || type || 'Other';

/**
 * Checks applied to every document regardless of type. `required: false` marks
 * a check the reviewer can leave open: the progress counter ignores it, but it
 * is still stored with the verification record.
 */
const COMMON_CHECKS = [
  { id: 'common_file_opens', label: 'File opens successfully', required: true },
  { id: 'common_readable', label: 'Document is readable and clear', required: true },
  { id: 'common_type_matches', label: 'Document type matches the uploaded file', required: true },
  { id: 'common_related_identifiers', label: 'Applicable related identifiers are confirmed', required: true },
  { id: 'common_uploader_id', label: 'Uploader account ID is confirmed', required: true },
  { id: 'common_consistent', label: 'Information is consistent with the associated record', required: true },
  { id: 'common_dates_refs', label: 'Relevant dates and reference numbers are checked', required: true },
  { id: 'common_expiry', label: 'Expiry is checked where applicable', required: false },
  { id: 'common_no_alteration', label: 'No visible alteration or inconsistency identified', required: true },
  { id: 'common_no_missing', label: 'No required information is missing', required: true },
];

/**
 * Document-type-specific checks.
 *
 * `types` are documents.documentType keys. `labelPatterns` catch the display
 * labels used by uploads that are not registered in the documents table yet
 * (payment receipts, item screenshots, supporting documents), which is what the
 * modal receives as its document type when reviewing an unreviewed upload.
 */
const TYPE_CHECKLISTS = [
  {
    group: 'nid',
    label: 'NID',
    types: ['national_id', 'nid'],
    labelPatterns: ['national id', 'nationalid', 'nid'],
    checks: [
      { id: 'nid_number', label: 'NID number is present and clearly readable.' },
      { id: 'nid_name_match', label: 'Customer name matches the NID.' },
      { id: 'nid_dob_match', label: 'Date of birth matches the customer record.' },
      { id: 'nid_photo_match', label: 'NID photograph / identity information is consistent with the customer record.' },
      { id: 'nid_official', label: 'NID appears to be an officially issued identity document.' },
      { id: 'nid_no_discrepancy', label: 'No document-specific discrepancy requiring correction is identified.' },
    ],
  },
  {
    group: 'trade_license',
    label: 'Trade License/Business document',
    types: ['trade_license'],
    labelPatterns: ['trade license', 'trade licence', 'business document', 'business licence'],
    checks: [
      { id: 'tl_license_number', label: 'Trade license / registration number is present and readable.' },
      { id: 'tl_issuing_authority', label: 'Issuing authority is verified.' },
      { id: 'tl_business_name', label: 'Business / organization name matches the customer record.' },
      { id: 'tl_proprietor', label: 'Proprietor / owner or authorized signatory is identifiable where applicable.' },
      { id: 'tl_address', label: 'Registered business address matches the customer record where applicable.' },
      { id: 'tl_reference_valid', label: 'Document reference number is valid.' },
      { id: 'tl_validity', label: 'Validity / expiry date is checked.' },
      { id: 'tl_no_discrepancy', label: 'No document-specific discrepancy requiring correction is identified.' },
    ],
  },
  {
    group: 'invoice',
    label: 'Invoice',
    types: ['invoice', 'commercial_invoice'],
    labelPatterns: ['invoice'],
    checks: [
      { id: 'inv_number', label: 'Invoice number / reference is present.' },
      { id: 'inv_seller', label: 'Seller / supplier information is identifiable.' },
      { id: 'inv_buyer', label: 'Buyer / customer information is consistent with the submitted records.' },
      { id: 'inv_items', label: 'Item descriptions are present and identifiable.' },
      { id: 'inv_quantity', label: 'Quantity and/or unit information is present.' },
      { id: 'inv_value', label: 'Declared value and currency are clearly stated.' },
      { id: 'inv_date', label: 'Invoice date is present.' },
      { id: 'inv_consistent', label: 'Invoice information is consistent with the related shipment/request record.' },
    ],
  },
  {
    group: 'receipt',
    label: 'Receipt',
    types: ['receipt', 'payment_receipt'],
    labelPatterns: ['receipt', 'payment proof', 'payment receipt'],
    checks: [
      { id: 'rec_number', label: 'Receipt number / transaction reference is present.' },
      { id: 'rec_merchant', label: 'Seller / merchant information is identifiable.' },
      { id: 'rec_buyer', label: 'Buyer / customer information is identifiable where applicable.' },
      { id: 'rec_date', label: 'Purchase date is present.' },
      { id: 'rec_items', label: 'Purchased item(s) are identifiable.' },
      { id: 'rec_quantity', label: 'Quantity is identifiable where applicable.' },
      { id: 'rec_amount', label: 'Paid amount and currency are clearly stated.' },
      { id: 'rec_consistent', label: 'Receipt information is consistent with the related purchase/request record.' },
    ],
  },
  {
    group: 'source_document',
    label: 'Source Document',
    types: ['source_document', 'certificate_of_origin', 'insurance_certificate'],
    labelPatterns: ['source document', 'supporting document', 'certificate of origin', 'insurance certificate'],
    checks: [
      { id: 'src_issuer', label: 'Source / issuing party is identifiable.' },
      { id: 'src_purpose', label: 'Document purpose is identifiable.' },
      { id: 'src_customer', label: 'Customer / business information is consistent with the related record.' },
      { id: 'src_item', label: 'Item / transaction information is identifiable.' },
      { id: 'src_value', label: 'Relevant value / ownership / source information is present where applicable.', required: false },
      { id: 'src_reference', label: 'Document reference or transaction identifier is present where applicable.', required: false },
      { id: 'src_consistent', label: 'Information is consistent with the related shipment/request record.' },
    ],
  },
  {
    group: 'packing_list',
    label: 'Packing List',
    types: ['packing_list'],
    labelPatterns: ['packing list', 'packinglist'],
    checks: [
      { id: 'pl_reference', label: 'Packing list reference / document number is present where applicable.' },
      { id: 'pl_shipper', label: 'Shipper / seller information is identifiable.' },
      { id: 'pl_consignee', label: 'Consignee / customer information is consistent with the related record.' },
      { id: 'pl_cartons', label: 'Package / carton count is stated.' },
      { id: 'pl_items', label: 'Item descriptions are identifiable.' },
      { id: 'pl_quantities', label: 'Quantities are stated.' },
      { id: 'pl_weight', label: 'Weight and/or dimensions are stated where applicable.', required: false },
      { id: 'pl_consistent', label: 'Packing list information is consistent with the related shipment/request record.' },
    ],
  },
  {
    group: 'return_label',
    label: 'Return Label',
    types: ['return_label'],
    labelPatterns: ['return label'],
    checks: [
      { id: 'rl_number', label: 'Return label / reference number is present.' },
      { id: 'rl_order_ref', label: 'Shipment / order reference is identifiable.' },
      { id: 'rl_sender', label: 'Sender / return-from information is identifiable.' },
      { id: 'rl_destination', label: 'Return-to / destination information is identifiable.' },
      { id: 'rl_carrier', label: 'Carrier information is identifiable where applicable.', required: false },
      { id: 'rl_consistent', label: 'Label information is consistent with the related return/RTO record.' },
      { id: 'rl_tracking', label: 'Tracking information is present where applicable.', required: false },
    ],
  },
  {
    group: 'rma_document',
    label: 'RMA Document',
    types: ['rma_document', 'return_authorization', 'rto_document'],
    labelPatterns: ['rma', 'return authorization', 'return/rto', 'rto document'],
    checks: [
      { id: 'rma_number', label: 'RMA number / reference is present.' },
      { id: 'rma_order_ref', label: 'Customer / order / shipment reference is identifiable.' },
      { id: 'rma_customer', label: 'Customer information matches the related record.' },
      { id: 'rma_item', label: 'Item / product information is identifiable.' },
      { id: 'rma_reason', label: 'Return reason is stated where applicable.', required: false },
      { id: 'rma_issuer', label: 'Issuing party / merchant information is identifiable.' },
      { id: 'rma_consistent', label: 'RMA information is consistent with the related return/RTO record.' },
    ],
  },
  {
    group: 'claim_photo',
    label: 'Claim Photo',
    types: ['claim_photo', 'insurance_claim'],
    labelPatterns: ['claim photo', 'insurance claim', 'item screenshot', 'damage photo', 'evidence photo'],
    checks: [
      { id: 'cp_issue_visible', label: 'Image clearly shows the claimed issue / damage.' },
      { id: 'cp_item_identifiable', label: 'The relevant item / package is identifiable.' },
      { id: 'cp_clarity', label: 'Image is sufficiently clear for verification.' },
      { id: 'cp_consistent', label: 'Image is consistent with the related shipment / claim.' },
      { id: 'cp_evidence', label: 'The image provides sufficient evidence for the stated claim issue.' },
    ],
  },
  {
    group: 'awb',
    label: 'AWB',
    types: ['awb'],
    labelPatterns: ['awb', 'air waybill', 'air way bill'],
    checks: [
      { id: 'awb_number', label: 'AWB number is present and readable.' },
      { id: 'awb_shipper', label: 'Shipper information is identifiable.' },
      { id: 'awb_consignee', label: 'Consignee information is identifiable.' },
      { id: 'awb_carrier', label: 'Carrier information is identifiable.' },
      { id: 'awb_route', label: 'Origin and destination are identifiable.' },
      { id: 'awb_packages', label: 'Shipment / package information is present where applicable.', required: false },
      { id: 'awb_weight', label: 'Weight information is present where applicable.', required: false },
      { id: 'awb_consistent', label: 'AWB information is consistent with the related shipment record.' },
    ],
  },
  {
    group: 'bill_of_lading',
    label: 'B/L',
    types: ['bill_of_lading', 'bl'],
    labelPatterns: ['bill of lading', 'b/l', 'bl document'],
    checks: [
      { id: 'bl_number', label: 'B/L number is present and readable.' },
      { id: 'bl_shipper', label: 'Shipper information is identifiable.' },
      { id: 'bl_consignee', label: 'Consignee information is identifiable.' },
      { id: 'bl_notify', label: 'Notify-party information is identifiable where applicable.', required: false },
      { id: 'bl_carrier', label: 'Carrier information is identifiable.' },
      { id: 'bl_pol', label: 'Port of loading is identifiable.' },
      { id: 'bl_pod', label: 'Port of discharge / destination is identifiable.' },
      { id: 'bl_cargo', label: 'Cargo / package information is present.' },
      { id: 'bl_consistent', label: 'B/L information is consistent with the related shipment record.' },
    ],
  },
  {
    group: 'delivery_order',
    label: 'Delivery Order',
    types: ['delivery_order', 'delivery_proof'],
    labelPatterns: ['delivery order', 'proof of delivery', 'delivery proof'],
    checks: [
      { id: 'do_number', label: 'Delivery Order number / reference is present.' },
      { id: 'do_issuer', label: 'Carrier / shipping line / issuing party is identifiable.' },
      { id: 'do_consignee', label: 'Consignee information is consistent with the related shipment.' },
      { id: 'do_bl_ref', label: 'Shipment / B/L reference is identifiable.' },
      { id: 'do_destination', label: 'Delivery destination / location is identifiable.' },
      { id: 'do_authorization', label: 'Delivery authorization / instruction is clearly stated.' },
      { id: 'do_consistent', label: 'Delivery Order information is consistent with the related shipment record.' },
    ],
  },
  {
    group: 'customs_document',
    label: 'Customs Document',
    types: ['customs_document', 'customs_declaration'],
    labelPatterns: ['customs', 'customs declaration', 'customs document', 'declaration'],
    checks: [
      { id: 'cd_reference', label: 'Customs document / reference number is present where applicable.', required: false },
      { id: 'cd_parties', label: 'Importer / exporter information is identifiable.' },
      { id: 'cd_authority', label: 'Customs authority / document source is identifiable.' },
      { id: 'cd_shipment_ref', label: 'Shipment / reference information is consistent with the related shipment.' },
      { id: 'cd_goods', label: 'Declared goods / item information is identifiable.' },
      { id: 'cd_value', label: 'Declared value / quantity information is present where applicable.', required: false },
      { id: 'cd_status', label: 'Customs status / release information is identifiable where applicable.', required: false },
      { id: 'cd_consistent', label: 'Document information is consistent with the related customs / shipment record.' },
    ],
  },
  {
    group: 'other',
    label: 'Other',
    types: ['other'],
    labelPatterns: [],
    checks: [
      { id: 'oth_purpose', label: 'Document purpose / type is identifiable.' },
      { id: 'oth_issuer', label: 'Issuing / source party is identifiable where applicable.', required: false },
      { id: 'oth_customer', label: 'Customer / business information is consistent with the related record where applicable.', required: false },
      { id: 'oth_reference', label: 'Relevant reference / identification information is present where applicable.', required: false },
      { id: 'oth_relevance', label: 'Information relevant to the reason the document was submitted is present.' },
      { id: 'oth_sufficient', label: 'Document is sufficient to support the related verification purpose.' },
    ],
  },
];

// Every specific check defaults to required; a definition only spells out
// `required` for the "where applicable" checks that may legitimately stay open.
const withRequired = (check) => ({ required: true, ...check });

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9/]+/g, ' ').trim();

const withDefaults = TYPE_CHECKLISTS.map((entry) => ({
  ...entry,
  checks: entry.checks.map(withRequired),
}));

/**
 * Picks the checklist that applies to a document.
 *
 * @param {object} params
 * @param {string} [params.documentType]   documents.documentType key.
 * @param {string} [params.documentTypeLabel] Display label, used for uploads
 *   that are not registered in the documents table yet.
 */
const resolveChecklist = ({ documentType, documentTypeLabel: label } = {}) => {
  const key = String(documentType || '').trim().toLowerCase();

  let match = withDefaults.find((entry) => entry.types.includes(key));
  if (!match) {
    const normalized = normalize(label);
    match = normalized
      ? withDefaults.find((entry) => entry.labelPatterns.some((pattern) => normalized.includes(pattern)))
      : null;
  }
  if (!match) match = withDefaults.find((entry) => entry.group === 'other');

  return {
    group: match.group,
    label: match.label,
    common: COMMON_CHECKS,
    specific: match.checks,
  };
};

/** Every check that gates a "Verified" decision. */
const requiredChecks = (spec) =>
  [...spec.common, ...spec.specific]
    .filter((check) => check.required)
    .map((check) => check.id);

/**
 * Scores a saved checklist result against the checks that apply to a document.
 * `results` is the flat map the modal posts: check id -> true/false.
 */
const evaluateChecklist = (spec, results = {}) => {
  const all = [...spec.common, ...spec.specific];
  const required = all.filter((check) => check.required);
  const completed = all.filter((check) => results[check.id]);
  const completedRequired = required.filter((check) => results[check.id]);
  const missingRequired = required
    .filter((check) => !results[check.id])
    .map((check) => check.label);

  return {
    total: all.length,
    requiredTotal: required.length,
    completed: completed.length,
    completedRequired: completedRequired.length,
    complete: missingRequired.length === 0,
    missingRequired,
  };
};

/**
 * The catalogue the modal renders from. Serialised into the page as JSON so the
 * checklists on screen always come from these same definitions.
 */
const checklistCatalog = () => ({
  common: COMMON_CHECKS,
  groups: withDefaults.map((entry) => ({
    group: entry.group,
    label: entry.label,
    types: entry.types,
    labelPatterns: entry.labelPatterns,
    checks: entry.checks,
  })),
});

export {
  DOC_TYPE_LABELS,
  COMMON_CHECKS,
  TYPE_CHECKLISTS,
  docTypeLabel,
  resolveChecklist,
  requiredChecks,
  evaluateChecklist,
  checklistCatalog,
};