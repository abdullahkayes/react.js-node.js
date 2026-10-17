/**
 * Requests & Bookings queue definitions.
 *
 * The queue on /admin/bookings merges three separate tables - self-purchase
 * pre-alerts, assisted purchase requests and export bookings - into one review
 * list, because staff action all three the same way and the workflow does not
 * depend on which table a submission arrived in.
 *
 * This module is the single definition of that queue:
 *
 *   - REQUEST_TYPES      which table feeds the queue, and under what name;
 *   - the status helpers  how a stored status maps onto the five summary cards;
 *   - QUEUE_CARDS         each card's own membership rule;
 *   - QUEUE_ACTIONS       which action a row offers at each status.
 *
 * The controller reads the types and the card rules from here and the views read
 * the labels from here, so a card can never count one set of statuses while the
 * filter applied when that card is clicked applies another. This mirrors how
 * config/documentChecklists.js and config/informationRequests.js hold the
 * vocabularies for their own modals.
 */

/**
 * The request types that make up the queue.
 *
 * `key` is deliberately identical to the `sourceRequestType` enum on Shipment
 * (and to `sourceRequestId` holding the request's requestId), so a shipment can be
 * matched back to the request that produced it without a second mapping table.
 *
 * `slug` is what appears in the page URL, so the links stay readable; `prefix` is
 * used to build the display reference for a row that stores no requestId.
 *
 * Each type owns its own details page (`detailView`), because the three tables
 * describe three different workflows: a parcel the customer is shipping themselves,
 * goods we are asked to buy, and an export consignment with a named consignee.
 * A request's action links to that page, so the reader lands on the page built for
 * the request in front of them rather than on one page that hedges across all three.
 *
 * `requestUploads` and `itemUploads` list the upload columns that table and its
 * items actually carry, with the label each is shown under. Declaring them per type
 * keeps the knowledge of which table stores what in the same place as the type, and
 * means the Uploaded Files section can never list a file a table never had.
 */
/**
 * How each request type answers the delivery-instruction questions.
 *
 * All three workflows show the same block, but they store the answers in
 * different columns: the purchase flows captured a delivery method and a note,
 * while an export booking already carried a full consignee address. A type says
 * which of its own columns answer each question, and a `compose` entry joins
 * several columns into the single address line the block shows.
 */
const PURCHASE_DELIVERY_FIELDS = [
  { label: 'Final Delivery Method', column: 'finalDeliveryMethod' },
  { label: 'Delivery Address', column: 'deliveryAddress' },
  { label: 'Customer Instructions', column: 'customerInstructions', wide: true },
];

const EXPORT_DELIVERY_FIELDS = [
  { label: 'Consignee Name', column: 'consigneeName' },
  { label: 'Consignee Phone', column: 'consigneePhone' },
  { label: 'Final Delivery Method', column: 'finalDeliveryMethod' },
  // The booking stores a structured address rather than one line, so the parts
  // are joined into the single address the block shows.
  { label: 'Delivery Address', compose: ['consigneeAddress', 'city', 'region', 'zipCode', 'destinationCountry'], wide: true },
  { label: 'Customer Instructions', column: 'customerInstructions', wide: true },
];

/**
 * Builds the per-type description the shared request-details page renders from.
 *
 * The three details pages have the same structure and the same behaviour, and
 * differ only in which columns answer each question. Describing the difference
 * here rather than in three near-identical templates is what keeps the pages from
 * drifting apart: a field added to one type's item is declared once, next to the
 * model it belongs to.
 */
const detailShape = ({ serviceMode, purchaseType, serviceModeNote, subheader, instructions, insurance, confirmation, dimensions, itemFields, deliveryFields, itemsHeading }) => ({
serviceMode,
  purchaseType,
  serviceModeNote,
  // What the review page states beside the request id, which differs by workflow.
  subheader,
  instructions,
  insurance,
  confirmation,
  dimensions,
  itemFields,
  deliveryFields,
  itemsHeading,
});

const REQUEST_TYPES = [
  {
    key: 'self_purchase',
    slug: 'self-purchase',
    label: 'Self-Purchase Pre-Alert',
    shortLabel: 'Self-Purchase',
    prefix: 'SPR',
    model: 'SelfPurchaseRequest',
    itemModel: 'SelfPurchaseItem',
    detailView: 'admin/request-detail-self-purchase',
    description: 'Pre-alerts a customer submits for a parcel they are shipping themselves.',
    requestUploads: [{ column: 'nidPath', label: 'National ID' }],
    // The customer attaches the store's invoice or receipt to the item it proves,
    // so it is listed against that item rather than against the request.
    itemUploads: [{ column: 'invoiceFilePath', label: 'Invoice / Receipt' }],
...detailShape({
      itemsHeading: 'Shipment Items',
      // An import is bought in one of two ways, so the review page states which.
      subheader: { label: 'Purchase mode', typeValue: 'purchaseType' },
      serviceMode: 'Import',
      purchaseType: 'Self-Purchase',
      serviceModeNote: 'Fixed for this workflow',
      instructions: { label: 'Special instruction (General)', column: 'specialInstruction' },
      insurance: { column: 'addInsurance', on: 'Requested — the customer asked for parcel cover', off: 'Not requested' },
      confirmation: { column: 'confirmTerms', on: 'The customer confirmed the item details and the terms at submission.', off: 'The customer did not confirm the terms for this request.' },
dimensions: { length: 'lengthCm', width: 'widthCm', height: 'heightCm', weight: 'weightKg' },
      deliveryFields: PURCHASE_DELIVERY_FIELDS,
      itemFields: [
        { label: 'Carrier / Local Courier Tracking Number', column: 'trackingNumber', kind: 'mono' },
        { label: 'Item Type', column: 'itemType' },
        { label: 'Item Source', column: 'itemSource' },
        { label: 'Seller / Company / Store Name', column: 'storeName' },
        { label: 'Product Category', column: 'productCategory' },
        { label: 'Quantity', column: 'quantity' },
        { label: 'Product Description', column: 'productDescription', wide: true },
        { label: 'Estimated Dimensions (cm)', kind: 'dimensions' },
        { label: 'Invoice Value (USD)', column: 'invoiceValue', kind: 'money' },
        { label: 'Product Link', column: 'productLink', kind: 'link' },
      ],
    }),
  },
  {
    key: 'assisted_purchase',
    slug: 'assisted-purchase',
    label: 'Assisted Purchase Request',
    shortLabel: 'Assisted Purchase',
    prefix: 'APR',
    model: 'AssistedPurchaseRequest',
    itemModel: 'AssistedPurchaseItem',
    detailView: 'admin/request-detail-assisted-purchase',
    description: 'Requests where Dazzling Shipping buys the goods on the customer\'s behalf.',
    requestUploads: [{ column: 'nidPath', label: 'National ID' }],
    // The store screenshot is what staff check the product and variant against.
    itemUploads: [{ column: 'screenshotPath', label: 'Product Screenshot' }],
...detailShape({
      itemsHeading: 'Purchase Items',
      subheader: { label: 'Purchase mode', typeValue: 'purchaseType' },
      serviceMode: 'Import',
      purchaseType: 'Assisted Purchase',
      serviceModeNote: 'Goods are bought and brought in',
      instructions: { label: 'Additional Notes (Optional)', column: 'specialInstruction' },
      insurance: { column: 'addInsurance', on: 'Requested — the customer asked for parcel cover', off: 'Not requested' },
      confirmation: { column: 'confirmTerms', on: 'The customer confirmed the item details and the terms at submission.', off: 'The customer did not confirm the terms for this request.' },
dimensions: { length: 'lengthCm', width: 'widthCm', height: 'heightCm', weight: 'weightKg' },
      deliveryFields: PURCHASE_DELIVERY_FIELDS,
      itemFields: [
        { label: 'Product Link (USA Store)', column: 'productLink', kind: 'link' },
        { label: 'Store / Website Name', column: 'storeName' },
        { label: 'Product Category', column: 'productCategory' },
        { label: 'Product Name', column: 'productName' },
        { label: 'Estimated Product Price (USD)', column: 'productPrice', kind: 'money' },
        { label: 'Quantity', column: 'quantity' },
        { label: 'Color / Size / Variant', column: 'variant', wide: true },
        { label: 'Estimated Dimensions (cm)', kind: 'dimensions' },
      ],
    }),
  },
  {
    key: 'export_booking',
    slug: 'export-booking',
    label: 'Export Booking',
    shortLabel: 'Export Booking',
    prefix: 'BSR',
    model: 'BookShipmentRequest',
    itemModel: 'BookShipmentItem',
    detailView: 'admin/request-detail-export-booking',
    description: 'Export consignments a corporate or commercial customer books themselves.',
    requestUploads: [
      { column: 'nidPath', label: 'National ID' },
      { column: 'paymentReceiptPath', label: 'Payment Receipt' },
    ],
    // An export booking is cleared against paperwork, so every item can arrive
    // with its own commercial invoice, packing list and supporting documents.
    itemUploads: [
      { column: 'invoiceFilePath', label: 'Commercial Invoice' },
      { column: 'packingListPath', label: 'Packing List' },
      { column: 'supportingDocsPath', label: 'Supporting Document' },
    ],
...detailShape({
      itemsHeading: 'Shipment Items',
      // An export is booked by the customer, so the review page states the service
      // level they booked rather than how the goods were obtained.
      subheader: { label: 'Service mode', column: 'requestedServiceLevel', uppercase: true },
      serviceMode: 'Export',
      purchaseType: 'N/A',
      serviceModeNote: 'Fixed for this workflow',
      instructions: { label: 'Shipment Instructions', column: 'shipmentInstructions' },
      insurance: { column: 'addPackageInsurance', on: 'Requested — the customer asked for parcel cover', off: 'Not requested' },
      confirmation: { column: 'termsAccepted', on: 'The customer accepted the terms at booking.', off: 'The customer did not accept the terms for this booking.' },
      // This table already carries plain length/width/height, so the volume
      // calculation reads those columns instead of the ...Cm ones.
      dimensions: { length: 'length', width: 'width', height: 'height', weight: 'estimatedWeight' },
      deliveryFields: EXPORT_DELIVERY_FIELDS,
      itemFields: [
        { label: 'Carrier / Local Courier Tracking Number', column: 'trackingNumber', kind: 'mono' },
        { label: 'Item Type', column: 'itemType' },
        { label: 'Item Source', column: 'itemSource' },
        { label: 'Seller / Company / Store Name', column: 'sellerStoreName' },
        { label: 'Product Category', column: 'productCategory' },
        { label: 'Quantity', column: 'quantity' },
        { label: 'Package Count', column: 'packageCount' },
        { label: 'HS Code', column: 'hsCode' },
        { label: 'Country of Origin', column: 'countryOfOrigin' },
        { label: 'Product Description', column: 'productDescription', wide: true },
        { label: 'Estimated Dimensions (cm)', kind: 'dimensions' },
        { label: 'Estimated Weight (kg)', column: 'estimatedWeight', kind: 'number' },
        { label: 'Declared Value (USD)', column: 'invoiceValue', kind: 'money' },
        { label: 'Product Link', column: 'productUrl', kind: 'link' },
      ],
    }),
  },
];

const REQUEST_TYPE_BY_KEY = Object.fromEntries(REQUEST_TYPES.map((t) => [t.key, t]));
const REQUEST_TYPE_BY_SLUG = Object.fromEntries(REQUEST_TYPES.map((t) => [t.slug, t]));

/**
 * Resolves a request type from a URL segment or a stored key.
 *
 * Both the slug and the key are accepted so a route parameter and a stored
 * `sourceRequestType` value can both go through here. Anything unrecognised
 * resolves to null, and the caller answers 404 rather than guessing a table.
 */
const resolveRequestType = (value) => {
  const cleaned = String(value ?? '').trim();
  return REQUEST_TYPE_BY_SLUG[cleaned] || REQUEST_TYPE_BY_KEY[cleaned] || null;
};

/** The request types a given page should read: all of them, or just one. */
const requestTypesFor = (typeKey) => {
  const type = typeKey ? resolveRequestType(typeKey) : null;
  return type ? [type] : REQUEST_TYPES;
};

/** Page URL for a request type. The queue itself is the no-type page. */
const queuePathFor = (typeKey) => {
  const type = typeKey ? resolveRequestType(typeKey) : null;
  return type ? `/admin/bookings/${type.slug}` : '/admin/bookings';
};

/**
 * URL of a request's own details page.
 *
 * The slug is part of the path rather than a parameter, so each request type has
 * its own address and the router can only ever pair a request with the page built
 * for it - a type can never be rendered against another type's template.
 */
const detailPathFor = (typeKey, requestId) => {
  const type = typeKey ? resolveRequestType(typeKey) : null;
  return type ? `/admin/bookings/requests/${type.slug}/${requestId}` : null;
};

/* ======================================================================
 * Status handling
 *
 * The three tables each carry their own ENUM and they do not agree on
 * spelling: the stored value is "Need More Information" (singular "Need"),
 * while the summary card on the page is written "Needs More Information", and
 * statuses written by different flows differ in case and spacing. Every
 * comparison therefore runs through canonicalStatus(), which folds a stored
 * value onto the canonical label in STATUS.
 * ====================================================================== */

const STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  NEED_INFORMATION: 'Need More Information',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

/**
 * Stored value -> canonical status.
 *
 * Both spellings of the information-request status map to the same canonical
 * label so the card, the filter and the table always agree whichever form a row
 * happens to hold.
 */
const STATUS_BY_NORMALISED = {
  draft: STATUS.DRAFT,
  submitted: STATUS.SUBMITTED,
  underreview: STATUS.UNDER_REVIEW,
  needmoreinformation: STATUS.NEED_INFORMATION,
  needsmoreinformation: STATUS.NEED_INFORMATION,
  approved: STATUS.APPROVED,
  rejected: STATUS.REJECTED,
  cancelled: STATUS.CANCELLED,
};

/** Folds case, spacing and punctuation out of a status so it can be compared. */
const normaliseStatus = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '');

/**
 * The canonical status for a stored value, falling back to the trimmed value
 * itself for a status this module does not know (the enums also allow
 * "Purchased", "In Warehouse", "In Transit", "Delivered" and
 * "Converted to Shipment", which are real but not part of the card rules).
 */
const canonicalStatus = (value) => {
  const cleaned = String(value ?? '').trim();
  return STATUS_BY_NORMALISED[normaliseStatus(cleaned)] || cleaned || 'Unknown';
};

/**
 * The shared statuses offered by the Request Status dropdown.
 *
 * The three tables share these seven.
 */
const STATUS_FILTER_OPTIONS = [
  STATUS.DRAFT,
  STATUS.SUBMITTED,
  STATUS.UNDER_REVIEW,
  STATUS.NEED_INFORMATION,
  STATUS.APPROVED,
  STATUS.REJECTED,
  STATUS.CANCELLED,
];

/**
 * Every status any of the three ENUMs allow.
 *
 * Beyond the seven shared ones, the assisted purchase table also carries
 * "Purchased", "In Warehouse" and "Converted to Shipment", and the export booking
 * table "In Transit" and "Delivered". A request holding one of those is a real row
 * that staff must be able to filter down to, so the Request Status dropdown and
 * the `status` query parameter both accept this whole set - and nothing else, so
 * a value that could never match a record is not treated as a filter.
 */
const ALL_STATUS_OPTIONS = [
  ...STATUS_FILTER_OPTIONS,
  'Purchased',
  'In Warehouse',
  'Converted to Shipment',
  'In Transit',
  'Delivered',
];

const CANONICAL_STATUS_SET = new Set(ALL_STATUS_OPTIONS.map(canonicalStatus));

/**
 * The canonical form of a requested status filter, or null when the value is not
 * a status any request can hold. A null result means "no status filter", so an
 * unusable value falls back to the unfiltered queue rather than to an empty page.
 */
const resolveStatusFilter = (value) => {
  const status = canonicalStatus(value);
  return CANONICAL_STATUS_SET.has(status) ? status : null;
};

/** Badge colours per canonical status, so every view colours a status the same. */
const STATUS_TONE = {
  [STATUS.DRAFT]: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  [STATUS.SUBMITTED]: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  [STATUS.UNDER_REVIEW]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  [STATUS.NEED_INFORMATION]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  [STATUS.APPROVED]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  [STATUS.REJECTED]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  [STATUS.CANCELLED]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const DEFAULT_STATUS_TONE = 'bg-sky-500/10 text-sky-400 border-sky-500/20';

/** Badge classes for a stored status, resolved through its canonical form. */
const statusBadgeClass = (value) => STATUS_TONE[canonicalStatus(value)] || DEFAULT_STATUS_TONE;

/* ======================================================================
 * Summary cards
 *
 * Each card owns its membership rule and nothing else decides which rows it
 * shows. `matches` receives the canonical status, so a card counts exactly the
 * rows the filter built from the same rule will list.
 * ====================================================================== */

const QUEUE_CARDS = [
  {
    key: 'open',
    label: 'Open Requests',
    caption: 'Every submission that is not yet Approved',
    icon: 'file-text',
    colour: 'sky',
    matches: (status) => status !== STATUS.APPROVED,
  },
  {
    key: 'under-review',
    label: 'Under Review',
    caption: 'Submitted and waiting on a staff decision',
    icon: 'clock',
    colour: 'amber',
    matches: (status) => status === STATUS.UNDER_REVIEW,
  },
  {
    key: 'needs-information',
    label: 'Needs More Information',
    caption: 'Waiting on the customer to respond',
    icon: 'alert-circle',
    colour: 'orange',
    matches: (status) => status === STATUS.NEED_INFORMATION,
  },
  {
    key: 'approved',
    label: 'Approved Requests',
    caption: 'Shipment IDs assigned automatically',
    icon: 'check-circle-2',
    colour: 'emerald',
    matches: (status) => status === STATUS.APPROVED,
  },
  {
    key: 'action-required',
    label: 'Action Required',
    caption: 'Under Review or Needs More Information',
    icon: 'alert-octagon',
    colour: 'rose',
    // The two statuses where the queue is waiting on somebody: staff have to
    // review, or the customer has to respond. Everything else is either done or
    // already closed.
    matches: (status) => status === STATUS.UNDER_REVIEW || status === STATUS.NEED_INFORMATION,
  },
];

const QUEUE_CARD_BY_KEY = Object.fromEntries(QUEUE_CARDS.map((c) => [c.key, c]));

/* ======================================================================
 * Row actions
 * ====================================================================== */

const QUEUE_ACTIONS = {
  review: { kind: 'review', label: 'Review Request', hint: 'Open the request details page to review it' },
  information: { kind: 'information', label: 'Request Information', hint: 'Ask the customer for the missing information' },
  shipment: { kind: 'shipment', label: 'Open Shipment', hint: 'Open Shipments > Shipment Details' },
  view: { kind: 'view', label: 'View Request', hint: 'Open the request details page' },
};

/**
 * The action a row offers at a given status.
 *
 * The four statuses the workflow names map onto the four actions. Every other
 * status the three ENUMs allow - Draft, Submitted, Purchased, In Warehouse,
 * In Transit, Delivered, Converted to Shipment - has no staff action of its own,
 * so it gets the read-only view action rather than a cell with nothing in it.
 */
const actionForStatus = (status) => {
  switch (canonicalStatus(status)) {
    case STATUS.UNDER_REVIEW:
      return QUEUE_ACTIONS.review;
    case STATUS.NEED_INFORMATION:
      return QUEUE_ACTIONS.information;
    case STATUS.APPROVED:
      return QUEUE_ACTIONS.shipment;
    case STATUS.CANCELLED:
    case STATUS.REJECTED:
      return QUEUE_ACTIONS.view;
    default:
      return QUEUE_ACTIONS.view;
  }
};

/* ======================================================================
 * Toolbar filter vocabularies
 * ====================================================================== */

/** Freight Mode: identical on all three tables. */
const FREIGHT_MODE_OPTIONS = ['air', 'sea'];

/** Date Range: relative windows rather than a free-form picker. */
const DATE_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

const QUEUE_PAGE_SIZE = 20;

export {
  REQUEST_TYPES,
  REQUEST_TYPE_BY_KEY,
  REQUEST_TYPE_BY_SLUG,
  resolveRequestType,
  requestTypesFor,
  queuePathFor,
  detailPathFor,
  STATUS,
  normaliseStatus,
  canonicalStatus,
  STATUS_FILTER_OPTIONS,
  ALL_STATUS_OPTIONS,
  resolveStatusFilter,
  statusBadgeClass,
  QUEUE_CARDS,
  QUEUE_CARD_BY_KEY,
  QUEUE_ACTIONS,
  actionForStatus,
  FREIGHT_MODE_OPTIONS,
  DATE_RANGE_OPTIONS,
  QUEUE_PAGE_SIZE,
};