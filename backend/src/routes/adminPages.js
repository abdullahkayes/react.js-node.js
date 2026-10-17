import express from 'express';
import { body, validationResult } from 'express-validator';
import adminAuth from '../middleware/adminAuth.js';
import { uploadDocument } from '../middleware/upload.js';
import { RateCard, User } from '../models/index.js';
import { createInvoice } from '../controllers/invoiceController.js';
import { createQuotation } from '../controllers/quotationController.js';
import { recordPayment } from '../controllers/paymentController.js';
import { createTimelineUpdate, timelineStatusOptions } from '../controllers/timelineController.js';
import {
  renderDashboard,
  renderCustomers,
  exportCustomersPDF,
  renderCustomerDetail,
  renderBookings,
  renderSelfPurchaseBookings,
  renderAssistedPurchaseBookings,
  renderExportBookingBookings,
  renderSelfPurchaseRequestDetail,
  renderAssistedPurchaseRequestDetail,
  renderExportBookingRequestDetail,
  renderRequestAcceptanceReview,
  renderRequestInformationForm,
  createRequestInformationRequest,
  saveRequestItemAcceptance,
  approveRequestDetail,
  rejectRequestDetail,
  verifyRequestDocument,
renderAssistedPurchase,
  renderAssistedPurchaseManage,
  renderAssistedPurchaseManageItemsPurchasePreparation,
  renderAssistedPurchaseManageInvoiceAdvancePayment,
  renderAssistedPurchaseManageSellerOrdersTracking,
  renderAssistedPurchaseManageDocuments,
  renderAssistedPurchaseManageAuditTrail,
  renderWarehouse,
  renderFreight,
  renderCustoms,
  renderFinance,
  renderInsurance,
  renderReturns,
  renderSupport,
  renderReports,
  renderStaff,
  renderSettings,
  renderRateCards,
  renderUsers,
  renderShipments,
  renderShipmentDetail,
  renderShipmentManage,
  renderLogin,
  handleLogin,
  renderRegister,
  handleRegister,
  logout,
  updateShipmentStatus,
  updateRateCard,
  updateDocumentVerification,
  removeDocument,
  uploadShipmentDocument,
  searchCustomerRecords,
  createInformationRequest,
  updateComplianceProfile,
  createAccountAction,
  updateAccountAction,
  createCustomerNotification,
  getCustomerNotification,
} from '../controllers/adminPageController.js';

const router = express.Router();

router.get('/login', renderLogin);
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  handleLogin
);

router.get('/register', renderRegister);
router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin', 'staff', 'customer']),
  ],
  handleRegister
);

router.get('/logout', logout);
router.get('/customers', adminAuth, renderCustomers);
// Must be registered before '/customers/:id', otherwise Express treats
// "export" as a customer id and the export 404s.
router.get('/customers/export', adminAuth, exportCustomersPDF);
// Related Record search used by the document verification modal. Registered
// before '/customers/:id/:tab' so "records" is not read as a tab name.
router.get('/customers/:customerId/records/search', adminAuth, searchCustomerRecords);
router.get('/customers/:id', adminAuth, renderCustomerDetail);
router.get('/customers/:id/:tab', adminAuth, renderCustomerDetail);
router.put('/customers/:customerId/documents/:documentId/verification', adminAuth, updateDocumentVerification);

// Timeline Update modal. The one way staff change a shipment's operational
// status: the status and the timeline entry are written together, because a
// status that moved without an entry would leave the timeline behind and an
// entry that did not move the status is a note rather than a status.
//
// Declared before /shipments/:id so a shipment id is never captured as a ref.
router.post('/shipments/:ref/timeline', adminAuth, createTimelineUpdate);
// One endpoint for every page that lists documents. There is a single documents
// table behind the shipment Documents tab, the customer account documents and
// the request documents, so removing one means the same thing everywhere.
router.delete('/documents/:documentId', adminAuth, removeDocument);

// Upload Document modal. Multipart, so the file travels with the form and the
// handler validates everything about it the modal states. The wider 10 MB limit
// lives on this upload instance alone rather than in the shared middleware.
//
// Multer refuses an over-size or wrong-extension file before the handler runs,
// and without this wrapper that refusal would surface as a 500. Staff need the
// reason on screen, so it is reported as a 400 carrying multer's own message.
const reportUploadDocumentError = (err, req, res, next) => {
  if (err && (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE')) {
    return res.status(400).json({ error: err.message });
  }
  if (err && err.message === 'Only PDF, JPG, JPEG and PNG files can be uploaded') {
    return res.status(400).json({ error: 'Only PDF, JPG, JPEG and PNG files can be uploaded.' });
  }
  return next(err);
};

router.post(
  '/shipments/:ref/documents',
  adminAuth,
  uploadDocument.single('documentFile'),
  reportUploadDocumentError,
  uploadShipmentDocument
);
// Customer-level information request raised from Customer Details.
router.post('/customers/:customerId/information-requests', adminAuth, createInformationRequest);
// Compliance profile update from the Update Compliance Profile modal.
router.put('/customers/:customerId/compliance', adminAuth, updateComplianceProfile);

router.post('/customers/:customerId/account-actions', adminAuth, createAccountAction);

router.put('/customers/:customerId/account-actions/:caseId', adminAuth, updateAccountAction);

// Communications & Audit: a manual notification and its read-only detail view.
router.post('/customers/:customerId/notifications', adminAuth, createCustomerNotification);
router.get('/customers/:customerId/notifications/:notificationId', adminAuth, getCustomerNotification);
// Requests & Bookings queue. The combined page plus one page per request type;
// the Request Type dropdown on each of them links to these four routes.
//
// Each request type also has its own details page, so a row's action opens the
// page built for that request's own workflow. The type is part of the path rather
// than a parameter, which is what keeps a request from ever being rendered against
// another type's template. The information-request endpoint stays on one
// parameterised path: it returns JSON, not a page, so it has nothing to mismatch.
router.get('/bookings', adminAuth, renderBookings);
router.get('/bookings/self-purchase', adminAuth, renderSelfPurchaseBookings);
router.get('/bookings/assisted-purchase', adminAuth, renderAssistedPurchaseBookings);
router.get('/bookings/export-booking', adminAuth, renderExportBookingBookings);
router.get('/bookings/requests/self-purchase/:requestId', adminAuth, renderSelfPurchaseRequestDetail);
router.get('/bookings/requests/assisted-purchase/:requestId', adminAuth, renderAssistedPurchaseRequestDetail);
router.get('/bookings/requests/export-booking/:requestId', adminAuth, renderExportBookingRequestDetail);
// The Request Processing panel's two actions are pages of their own, reached from
  // any of the three details pages. The type is a parameter here rather than a
  // literal path segment: both pages are type-agnostic, so there is one template per
  // action rather than one per action per type, and the handler resolves the type
  // before it reads anything.
router.get('/bookings/requests/:requestType/:requestId/review-acceptance', adminAuth, renderRequestAcceptanceReview);
router.get('/bookings/requests/:requestType/:requestId/information', adminAuth, renderRequestInformationForm);
router.post('/bookings/requests/:requestType/:requestId/information-request', adminAuth, createRequestInformationRequest);

// The three decisions the details page makes on the request itself. They are
//   type-agnostic for the same reason the two action pages above are: one handler
//   serves all three request types, and it resolves the type before it reads
//   anything.
router.put('/bookings/requests/:requestType/:requestId/acceptance', adminAuth, saveRequestItemAcceptance);
router.post('/bookings/requests/:requestType/:requestId/approve', adminAuth, approveRequestDetail);
router.post('/bookings/requests/:requestType/:requestId/reject', adminAuth, rejectRequestDetail);
router.put(
  '/bookings/requests/:requestType/:requestId/documents/:documentId/verification',
  adminAuth,
  verifyRequestDocument
);
router.get('/assisted-purchase', adminAuth, renderAssistedPurchase);
router.get('/assisted-purchase/manage/:id', adminAuth, renderAssistedPurchaseManage);
router.get('/assisted-purchase/manage/:id/items-purchase-preparation', adminAuth, renderAssistedPurchaseManageItemsPurchasePreparation);
router.get('/assisted-purchase/manage/:id/invoice-advance-payment', adminAuth, renderAssistedPurchaseManageInvoiceAdvancePayment);
router.get('/assisted-purchase/manage/:id/seller-orders-tracking', adminAuth, renderAssistedPurchaseManageSellerOrdersTracking);
router.get('/assisted-purchase/manage/:id/documents', adminAuth, renderAssistedPurchaseManageDocuments);
router.get('/assisted-purchase/manage/:id/audit-trail', adminAuth, renderAssistedPurchaseManageAuditTrail);
router.get('/shipments', adminAuth, renderShipments);

// Manage Shipment, reached from the list. Declared before "/shipments/:id" so it
// keeps working if a later route is ever added with a single segment that could
// take "manage" as an id. The two-segment form serves one tab section of the
// page as an AJAX partial, in the same way the customer detail tabs work.
router.get('/shipments/manage/:ref', adminAuth, renderShipmentManage);
router.get('/shipments/manage/:ref/:tab', adminAuth, renderShipmentManage);

router.get('/shipments/:id', adminAuth, renderShipmentDetail);
router.get('/warehouse', adminAuth, renderWarehouse);
router.get('/freight', adminAuth, renderFreight);
router.get('/customs', adminAuth, renderCustoms);
router.get('/finance', adminAuth, renderFinance);
router.get('/insurance', adminAuth, renderInsurance);
router.get('/returns', adminAuth, renderReturns);
router.get('/support', adminAuth, renderSupport);
router.get('/reports', adminAuth, renderReports);
router.get('/staff', adminAuth, renderStaff);
router.get('/settings', adminAuth, renderSettings);
router.get('/rate-cards', adminAuth, renderRateCards);
router.get('/users', adminAuth, renderUsers);
router.get('/', adminAuth, renderDashboard);

router.post(
  '/shipments/:id/status',
  adminAuth,
  [
    body('status').isIn(['pending', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled', 'returned']),
  ],
  updateShipmentStatus
);

/* Invoice generation from the Create Invoice modal. Registered before the
   "/shipments/:id" style paths so "invoices" is never read as an id. It lives
   here rather than on the API router because the modal is an admin panel
   surface: it authenticates on the admin cookie through adminAuth, the same
   way every other mutation this panel makes does. The shipment is resolved
   from the reference the modal submits, so one partial serves any shipment. */
router.post('/shipments/invoices', adminAuth, createInvoice);

/* Quotation generation from the Create Quotation modal. Declared before the
   "/shipments/:id" style paths so "quotations" is never read as an id, and on
   this router rather than the API one because the modal authenticates on the
   admin cookie through adminAuth, the same way every other panel action does. */
router.post('/shipments/quotations', adminAuth, createQuotation);

/* Payment recording from the Record Payment modal on the Payments tab.
   Declared before the "/shipments/:id" style paths so "payments" is never
   read as an id, and on this router rather than the API one because the
   modal is an admin panel surface: it authenticates on the admin cookie
   through adminAuth. The shipment is resolved from the reference the modal
   submits, so one partial serves any shipment.

   Multipart: the modal may attach a payment proof, which the same upload
   instance the Upload Document modal uses stores before the handler runs.
   Multer refuses an over-size or wrong-extension file before the handler
   runs, and without the wrapper that refusal would surface as a 500, so
   the reason is reported as a 400 carrying multer's own message. A
   submission without a file passes straight through. */
router.post(
  '/shipments/:ref/payments',
  adminAuth,
  uploadDocument.single('proofDocument'),
  reportUploadDocumentError,
  recordPayment
);

router.post('/rate-cards', adminAuth, [
  body('originZone').notEmpty(),
  body('destinationZone').notEmpty(),
  body('serviceType').isIn(['standard', 'express', 'priority']),
  body('pricePerKg').isDecimal(),
  body('baseFee').isDecimal(),
  body('currency').isString(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send('Validation error');
    await RateCard.create(req.body);
    res.redirect('/admin/rate-cards');
  } catch (err) {
    next(err);
  }
});

router.post('/rate-cards/:id/delete', adminAuth, async (req, res, next) => {
  try {
    await RateCard.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/rate-cards');
  } catch (err) {
    next(err);
  }
});

router.post('/rate-cards/:id/edit', adminAuth, [
  body('originZone').notEmpty(),
  body('destinationZone').notEmpty(),
  body('serviceType').isIn(['standard', 'express', 'priority']),
  body('pricePerKg').isDecimal(),
  body('baseFee').isDecimal(),
  body('currency').isString(),
], updateRateCard);

router.post('/users/:id/role', adminAuth, [
  body('role').isIn(['customer', 'admin', 'staff']),
], async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found');
    await user.update({ role: req.body.role });
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

export default router;
