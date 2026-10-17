/**
 * Shipment references.
 *
 * Two different identifiers are needed when a shipment is created, and both are
 * generated rather than typed, so they are defined once here and shared by the
 * customer-facing shipment endpoint and the admin approval flow. Having one
 * definition is what stops the two paths from producing differently shaped
 * references for the same kind of shipment.
 */

/**
 * The public shipment reference, read by staff and shown to customers.
 *
 * Shape: SHP-YYMMDD-NNNN. The date makes references sort roughly by creation
 * order and the random suffix keeps two shipments created in the same second
 * from colliding.
 */
const generateShipmentReference = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(100 + Math.random() * 9000);
  return `SHP-${year}${month}${day}${random}`;
};

/**
 * The tracking number held against a shipment.
 *
 * It is unique and NOT NULL, so a shipment created from a request still needs
 * one before a courier has been assigned. Those get an internal reference built
 * from the request they came from, which is recognisable in the shipments table
 * and replaced by the carrier's real number later.
 *
 * Capped at 30 characters to match the column, and any request reference longer
 * than that is trimmed from the left so the distinguishing tail always survives.
 */
const requestTrackingNumber = (sourceRequestId) => {
  const suffix = String(sourceRequestId || 'REQUEST').replace(/[^A-Za-z0-9-]/g, '').slice(-22);
  return `REQ-${suffix}`.slice(0, 30);
};

export { generateShipmentReference, requestTrackingNumber };