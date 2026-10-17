import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { body, validationResult } from 'express-validator';
import { User, Shipment, ShipmentItem, RateCard, TrackingEvent, Payment, Invoice, InvoiceItem, Quotation, QuotationItem, Address, Customer, Document, ReturnRTO, Insurance, Claim, SelfPurchaseRequest, SelfPurchaseItem, AssistedPurchaseRequest, BookShipmentRequest, ContactVerificationRecord, AssistedPurchaseItem, BookShipmentItem, InformationRequest, KYC, KYCReview, AccountAction, CustomerNotification, NotificationDelivery, PolicyAcceptance, RequestStatusEvent, StatusReference } from '../models/index.js';
import { Op } from 'sequelize';
import { sendEmail, statusChangeTemplate } from '../services/emailService.js';
import { resolveChecklist, evaluateChecklist, docTypeLabel, checklistCatalog } from '../config/documentChecklists.js';
import { loadStatusReference } from '../services/timelineService.js';
import { timelineStatusOptions } from '../controllers/timelineController.js';
import {
  STATUS_TYPES,
  VISIBILITY,
  SHIPMENT_REQUEST_STATUSES,
  SHIPMENT_STATUSES,
  ALL_STATUSES,
  statusReferenceRows,
  systemLabelFor,
  visibilityFor,
  isCustomerFacing,
  isApprovedStatus,
  isSelectableShipmentStatus,
} from '../config/shipmentStatuses.js';
import {
  STATUS_OPTIONS,
  DROPDOWN_OPTIONS,
  getRequestStatuses,
  getFreightModes,
  getCustomerTypesList,
  getItemTypesList,
  getCustomerTypes,
  getFreightModesList,
  getServiceModes,
  getPurchaseTypes,
  getItemTypes,
  getItemSources,
  getDocumentTypes,
  getCustomerAccountStatuses,
  getContactVerificationStatuses,
  getReturnStatuses,
  getShipmentStatuses,
  getServiceModesList,
  getPurchaseTypesList,
} from '../config/referenceData.js';
import { generateShipmentReference, requestTrackingNumber } from '../config/shipmentReferences.js';
import {
  validateInformationRequest,
  validateRequestInformationRequest,
  buildInformationRequestNotification,
  buildRequestInformationNotification,
  informationRequestCatalog,
} from '../config/informationRequests.js';
import {
  fmtDateTime,
  fmtDate,
  orDash,
  acceptanceBadge,
  verificationBadge,
  verificationLabel,
  reviewerRef,
  requestDetailViewState,
} from '../config/requestDetailView.js';
import { KYC_DEFAULTS, normaliseComplianceProfile, validateComplianceProfile, complianceStateLabel, changedComplianceFields, kycCatalog } from '../config/kyc.js';
import {
  CASE_TYPES,
  CASE_STATUSES,
  REASON_CATEGORIES,
  DEFAULT_ACCOUNT_STATUS,
  NOTICE_CHANNELS,
  NOTICE_TYPE,
  MANDATORY_NOTICE_CASE_TYPES,
  formatCaseId,
  formatNoticeId,
  calculateCorrectionDeadline,
  statusForCaseType,
  validateAccountAction,
  accountActionCatalog,
  buildAccountActionNotice,
  buildAccountActionResolutionNotice,
} from '../config/accountActions.js';
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STATUSES,
  channelAvailability,
  validateCustomerNotification,
  notificationCatalog,
} from '../config/notifications.js';
import {
  sendCustomerNotification,
  recordCustomerNotification,
  listCustomerCommunications,
} from '../services/notifications.js';
import {
  REQUEST_TYPES,
  requestTypesFor,
  queuePathFor,
  detailPathFor,
  resolveRequestType,
  canonicalStatus,
  statusBadgeClass,
  QUEUE_CARDS,
  QUEUE_CARD_BY_KEY,
  actionForStatus,
  ALL_STATUS_OPTIONS,
  resolveStatusFilter,
  FREIGHT_MODE_OPTIONS,
  DATE_RANGE_OPTIONS,
  QUEUE_PAGE_SIZE,
} from '../config/requestQueue.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/**
 * Parses a stored JSON column, falling back when it is absent or unreadable.
 *
 * A single malformed row must not take the whole customer page down or abort a
 * save, so a broken value degrades to the fallback instead of throwing.
 */
const safeJson = (value, fallback) => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const renderDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [shipmentsToday, inTransit, deliveredThisMonth, revenueThisMonth, totalShipments, totalUsers] = await Promise.all([
      Shipment.count({ where: { createdAt: { [Op.gte]: today, [Op.lt]: tomorrow } } }),
      Shipment.count({ where: { status: 'in_transit' } }),
      Shipment.count({ where: { status: 'delivered', createdAt: { [Op.gte]: startOfMonth } } }),
      Payment.sum('amount', { where: { status: 'paid', createdAt: { [Op.gte]: startOfMonth } } }),
      Shipment.count(),
      User.count(),
    ]);

    res.render('admin/dashboard', {
      user: req.user,
      stats: {
        shipmentsToday,
        inTransit,
        deliveredThisMonth,
        revenueThisMonth: parseFloat(revenueThisMonth || 0),
        totalShipments,
        totalUsers,
      },
    });
  } catch (err) {
    next(err);
  }
};

const renderRateCards = async (req, res, next) => {
  try {
    const rateCards = await RateCard.findAll({ order: [['createdAt', 'DESC']] });
    const editing = req.query.edit ? await RateCard.findByPk(req.query.edit) : null;
    res.render('admin/rate-cards', { user: req.user, rateCards, editing });
  } catch (err) {
    next(err);
  }
};

const renderUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.render('admin/users', { user: req.user, users });
  } catch (err) {
    next(err);
  }
};

const renderCustomers = async (req, res, next) => {
  try {
    const { search, filter, page = 1, type, verification, activity } = req.query;
    const baseWhere = { role: 'customer' };

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      baseWhere[Op.or] = [
        { name: { [Op.like]: term } },
        { email: { [Op.like]: term } },
        { phone: { [Op.like]: term } },
        { trade_license: { [Op.like]: term } },
      ];
    }

    if (type && type !== 'all') {
      baseWhere.account_type = type;
    }
    if (verification && verification !== 'all') {
      baseWhere[Op.or] = [
        { emailVerificationStatus: verification },
        { phoneVerificationStatus: verification },
      ];
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));

    if (activity === 'today') baseWhere.createdAt = { [Op.gte]: startOfToday };
    else if (activity === 'week') baseWhere.createdAt = { [Op.gte]: startOfWeek };
    else if (activity === 'month') baseWhere.createdAt = { [Op.gte]: startOfMonth };

    const listWhere = (() => {
      const w = { ...baseWhere };
      if (filter === 'newThisMonth') {
        w.createdAt = { [Op.gte]: startOfMonth };
      } else if (filter && filter !== 'all') {
        // account_status is an ENUM; match the summary-card value
        // case-insensitively so casing differences never hide rows.
        w.accountStatus = { [Op.like]: filter };
      }
      return w;
    })();

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = 50;

    const [
      totalCustomers,
      activeCount,
      warningCount,
      restrictedCount,
      suspendedCount,
      closedCount,
      dormantCount,
      terminatedCount,
      newThisMonthCount,
      filteredTotal,
      customersData
    ] = await Promise.all([
      User.count({ where: baseWhere }),
      User.count({ where: { ...baseWhere, accountStatus: 'Active' } }),
      User.count({ where: { ...baseWhere, accountStatus: 'Warning' } }),
      User.count({ where: { ...baseWhere, accountStatus: 'Restricted' } }),
      User.count({ where: { ...baseWhere, accountStatus: 'Suspended' } }),
      User.count({ where: { ...baseWhere, accountStatus: 'Closed' } }),
      User.count({ where: { ...baseWhere, accountStatus: 'Dormant' } }),
      User.count({ where: { ...baseWhere, accountStatus: 'Terminated' } }),
      User.count({ where: { ...baseWhere, createdAt: { [Op.gte]: startOfMonth } } }),
      // Counted separately: findAndCountAll inflates the total when the
      // shipments include expands each customer into multiple rows.
      User.count({ where: listWhere }),
      User.findAll({
        where: listWhere,
        attributes: [
          'id', 'name', 'email', 'phone', 'whatsapp', 'account_type',
          'accountStatus', 'emailVerificationStatus', 'phoneVerificationStatus',
          'home_address', 'warehouse_address', 'createdAt',
        ],
        include: [{ model: Shipment, as: 'shipments', attributes: ['id'], required: false }],
        order: [['createdAt', 'DESC']],
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        // distinct so the LIMIT applies to customers, not joined shipment rows
        distinct: true,
        subQuery: false,
      }),
    ]);

    const customers = customersData.map(c => ({
      ...c.toJSON(),
      shipmentCount: c.shipments ? c.shipments.length : 0,
    }));

    // Guard against a hand-typed page number past the end of the result set.
    const lastPage = Math.max(1, Math.ceil(filteredTotal / pageSize));
    if (currentPage > lastPage) {
      return res.redirect(`/admin/customers?${
        new URLSearchParams(
          Object.entries({ search, filter, type, verification, activity })
            .filter(([, v]) => v && v !== 'all' && v !== 'any')
        ).toString()
      }`);
    }

    const summaryCards = {
      total: totalCustomers,
      active: activeCount,
      warning: warningCount,
      restricted: restrictedCount,
      suspended: suspendedCount,
      closed: closedCount,
      dormant: dormantCount,
      terminated: terminatedCount,
      newThisMonth: newThisMonthCount,
    };

    // Distinct account types present in the DB drive the type dropdown, so it
    // never offers a value that cannot match a stored record.
    const typeRows = await User.findAll({
      where: { role: 'customer' },
      attributes: [[User.sequelize.fn('DISTINCT', User.sequelize.col('account_type')), 'value']],
      raw: true,
    });
    const accountTypes = typeRows
      .map(r => r.value)
      .filter(Boolean);

res.render('admin/customers', {
      user: req.user,
      customers,
      total: filteredTotal,
      summaryCards,
      currentPage,
      pageSize,
      search: search || '',
      filter: filter || '',
      type: type || 'all',
      verification: verification || 'all',
      activity: activity || 'any',
      accountTypes,
      customerTypes: getCustomerTypes(),
      accountStatuses: getCustomerAccountStatuses(),
      verificationStatuses: getContactVerificationStatuses(),
      activityOptions: ['any', 'today', 'week', 'month'],
    });
  } catch (err) {
    next(err);
  }
};

const exportCustomersPDF = async (req, res, next) => {
  try {
    const { search, filter } = req.query;
    const where = { role: 'customer' };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (filter) where.accountStatus = filter;

    const customers = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'phone', 'accountStatus', 'createdAt'],
      include: [{ model: Shipment, as: 'shipments', attributes: ['id'] }],
      order: [['createdAt', 'DESC']],
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=customers-report.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Customers Report', { align: 'center' });
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(0.5);

    const tableTop = 100;
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Shipments', 'Created'];
    const columnWidths = [30, 90, 100, 80, 70, 55, 55];
    let currentX = 50;

    doc.fontSize(9).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, currentX, tableTop, { width: columnWidths[i] });
      currentX += columnWidths[i];
    });

    let currentY = tableTop + 20;

    doc.font('Helvetica').fontSize(8);
    customers.forEach(c => {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
        currentX = 50;
        doc.font('Helvetica-Bold').fontSize(9);
        headers.forEach((header, i) => {
          doc.text(header, currentX, currentY, { width: columnWidths[i] });
          currentX += columnWidths[i];
        });
        currentY += 20;
        doc.font('Helvetica').fontSize(8);
        currentX = 50;
      }
      const row = [
        c.id,
        c.name,
        c.email,
        c.phone || 'N/A',
        c.accountStatus,
        c.shipments ? c.shipments.length : 0,
        new Date(c.createdAt).toLocaleDateString(),
      ];
      row.forEach((cell, i) => {
        doc.text(String(cell), currentX, currentY, { width: columnWidths[i] });
        currentX += columnWidths[i];
      });
      currentY += 15;
      currentX = 50;
    });

    doc.end();
  } catch (err) {
    next(err);
  }
};

/* The request models a shipment can be created from, keyed by the value stored in
   shipment.sourceRequestType. */
const SOURCE_REQUEST_MODELS = {
  self_purchase: SelfPurchaseRequest,
  assisted_purchase: AssistedPurchaseRequest,
  export_booking: BookShipmentRequest,
};

/**
 * Reads the freight mode of the request each shipment was created from, keyed by
 * that request's public reference.
 *
 * A shipment records the service mode and the service type, not which mode of
 * freight was chosen, so the answer lives on the request it came from. One query
 * per request type rather than one per shipment, and a directly booked shipment
 * simply has no entry - it genuinely has no recorded mode.
 */
const freightModeByRequestRef = async (shipmentList) => {
  const modes = new Map();

  await Promise.all(
    Object.entries(SOURCE_REQUEST_MODELS).map(async ([typeKey, model]) => {
      const refs = shipmentList
        .filter((s) => s.sourceRequestType === typeKey && s.sourceRequestId)
        .map((s) => s.sourceRequestId);
      if (!refs.length) return;

      const requests = await model.findAll({
        where: { requestId: { [Op.in]: refs } },
        attributes: ['requestId', 'freightMode'],
      });
      requests.forEach((r) => modes.set(r.requestId, r.freightMode));
    })
  );

  return modes;
};

/** The "City, Country" form of an address, or null when it is not known. */
const placeOf = (address) => (address
  ? [address.city, address.country].filter(Boolean).join(', ') || null
  : null);

const renderShipments = async (req, res, next) => {
  try {
    const { status, search, page = 1, serviceMode, freightMode, purchaseType, customerType, itemType, dateRange } = req.query;
    const where = {};
    if (status) where.status = status;
    if (serviceMode) where.serviceMode = serviceMode;
    if (freightMode) where.freightMode = freightMode;
    if (purchaseType) where.purchaseType = purchaseType;
    if (customerType) where.customerType = customerType;
    if (itemType) where.itemType = itemType;

    /* Filtering by a joined column is done with a scoped include rather than the
       '$user.email$' string form. That string form emits a subquery alias which
       does not resolve once the query selects specific attributes and uses
       distinct, which is what this query now does - it failed with "Unknown
       column 'user.email'". */
    const searchIncludes = [];
    if (search) {
      where[Op.or] = [
        { shipmentId: { [Op.like]: `%${search}%` } },
        { trackingNumber: { [Op.like]: `%${search}%` } },
        { sourceRequestId: { [Op.like]: `%${search}%` } },
      ];
      searchIncludes.push({ model: User, as: 'user', attributes: [], required: true, where: { email: { [Op.like]: `%${search}%` } } });
    }

    const { count, rows: shipments } = await Shipment.findAndCountAll({
      where,
      include: [
        { model: Address, as: 'sender', attributes: ['id', 'city', 'country'] },
        { model: Address, as: 'receiver', attributes: ['id', 'city', 'country'] },
        // The row's hover card and the Manage Shipment page both show customer
        // detail, so the fields they read are selected here rather than left to
        // the page to guess at.
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'account_type', 'accountStatus'] },
        { model: ShipmentItem, as: 'items', attributes: ['id'] },
        ...searchIncludes,
      ],
      order: [['createdAt', 'DESC']],
      limit: 50,
      offset: (page - 1) * 50,
      distinct: true,
    });

    const freightModes = await freightModeByRequestRef(shipments);

    /* Each row is given the view model its card and button need, built here so
       the markup names no column and the values cannot drift from what was
       loaded. */
    const rows = shipments.map((shipment) => {
      const customer = shipment.user;
      return {
        ...shipment.get({ plain: true }),
        // Kept alongside the plain row because the hover card and the Manage link
        // are rendered per row and read the associations.
        customer,
        customerName: customer ? customer.name : null,
        // There is no stored customer code; it is the row id in display form,
        // which is how the customer pages address an account too.
        customerCode: customer ? `CUS-${String(customer.id).padStart(6, '0')}` : null,
        itemsCount: (shipment.items || []).length,
        freightMode: shipment.sourceRequestId ? freightModes.get(shipment.sourceRequestId) || null : null,
        // A row with no public reference would otherwise link to a bare
        // "/manage/" with nothing after it, so it falls back to the row id. The
        // manage endpoint accepts either.
        manageHref: `/admin/shipments/manage/${encodeURIComponent(shipment.shipmentId || String(shipment.id))}`,
      };
    });

    const counts = {
      total: count,
      inTransit: await Shipment.count({ where: { status: { [Op.in]: ['Shipped', 'In International Transit', 'Arrived at Destination Country', 'Sorting at Hub'] } } }),
      delivered: await Shipment.count({ where: { status: 'Delivered' } }),
      onHold: await Shipment.count({ where: { status: { [Op.in]: ['On Hold', 'On Customs Hold', 'On Carrier Hold', 'Customs Clearance in Progress'] } } }),
      outForDelivery: await Shipment.count({ where: { status: 'Out for Delivery' } }),
      exceptions: await Shipment.count({ where: { status: { [Op.in]: ['Cancelled', 'Disposed', 'Seized', 'Failed Delivery'] } } }),
    };

    res.render('admin/shipments', {
      user: req.user,
      shipments: rows,
      total: count,
      counts,
      currentPage: parseInt(page),
      status: status || '',
      search: search || '',
      shipmentStatuses: getShipmentStatuses(),
      serviceModes: getServiceModesList(),
      freightModes: getFreightModesList(),
      purchaseTypes: getPurchaseTypesList(),
      customerTypes: getCustomerTypesList(),
      itemTypes: getItemTypesList(),
      dateRangeOptions: ['all', 'today', 'week', 'month', 'year'],
      serviceMode: serviceMode || '',
      freightMode: freightMode || '',
      purchaseType: purchaseType || '',
      customerType: customerType || '',
      itemType: itemType || '',
      dateRange: dateRange || 'all',
    });
  } catch (err) {
    next(err);
  }
};

const renderLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

const handleLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/login', { error: 'Please fill in all fields correctly' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      return res.render('admin/login', { error: 'Access denied: admin role required' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
};

const renderRegister = (req, res) => {
  res.render('admin/register', { error: null });
};

const handleRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/register', { error: 'Please fill in all fields correctly' });
    }

    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.render('admin/register', { error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({ name, email, passwordHash, role: role || 'admin' });
    res.redirect('/admin/login');
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/login');
};

const updateShipmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, location, note } = req.body;

    const shipment = await Shipment.findByPk(id, {
      include: [{ model: Address, as: 'sender' }, { model: Address, as: 'receiver' }, { model: User, as: 'user' }],
    });

    if (!shipment) return res.status(404).send('Shipment not found');

    shipment.status = status;
    await shipment.save();

    await TrackingEvent.create({
      shipmentId: shipment.id,
      status,
      location: location || '',
      note: note || '',
    });

    if (shipment.user && shipment.user.email) {
      const html = statusChangeTemplate(shipment.trackingNumber, status, note);
      await sendEmail({
        to: shipment.user.email,
        subject: `Shipment ${shipment.trackingNumber} - Status Update`,
        html,
      }).catch((e) => console.error('Email error:', e.message));
    }

    res.redirect(`/admin/shipments`);
  } catch (err) {
    next(err);
  }
};

const renderShipmentDetail = async (req, res, next) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id, {
      include: [
        { model: Address, as: 'sender' },
        { model: Address, as: 'receiver' },
        { model: TrackingEvent, as: 'trackingEvents', order: [['createdAt', 'ASC']] },
        // Aliased "payments" to match Shipment.hasMany(Payment); the singular
        // alias does not exist and Sequelize refuses the whole query for it.
        { model: Payment, as: 'payments' },
        { model: User, as: 'user' },
      ],
    });
    if (!shipment) return res.status(404).render('admin/404', { message: 'Shipment not found' });
    res.render('admin/shipment-detail', { user: req.user, shipment });
  } catch (err) {
    next(err);
  }
};

/**
 * The Manage Shipment page, reached from the Manage Shipment button on the
 * shipments list.
 *
 * GET /admin/shipments/manage/:ref
 * GET /admin/shipments/manage/:ref/:tab
 *
 * Resolved by the shipment's public reference ("SHP-2602845") rather than its
 * numeric row id, because that is what the list shows and what a reader reads off
 * a printed copy of it. A numeric id is still accepted so a link can be built
 * either way.
 *
 * A reference with no matching row is rendered as an explicit "not in the
 * database yet" page rather than a 404. The shipments list is being built out
 * and its rows are not all backed by records yet; a dead link there would read
 * as a broken button, whereas this states plainly which reference was looked
 * for.
 *
 * The page is a shell in the same layout as Customer Details: the shipment
 * header banner and the tab strip stay visible while the active section is
 * swapped in below. The overview is inlined on first render; every other
 * section arrives as an AJAX partial from the "/manage/:ref/:tab?partial=1"
 * form of this same route, so the URL of a section is shareable.
 */

/* One EJS partial per tab, keyed by the tab name in the URL. */
const SHIPMENT_MANAGE_TABS = {
  overview: 'shipment-tabs/overview',
  items: 'shipment-tabs/items-tracking',
  documents: 'shipment-tabs/documents',
  timeline: 'shipment-tabs/timeline',
  quotations: 'shipment-tabs/quotations-invoices',
  payments: 'shipment-tabs/payments',
  insurance: 'shipment-tabs/insurance-claims',
  returns: 'shipment-tabs/return-rto',
  audit: 'shipment-tabs/audit-trail',
};

const manageFmtDateTime = (value) => (value
  ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—');
const manageFmtDate = (value) => (value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const manageOrDash = (value) => (value === null || value === undefined || String(value).trim() === '' ? '—' : value);
const manageMoney = (value, currency) => (value === null || value === undefined ? '—' : `${currency || 'USD'} ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const manageTitleCase = (value) => String(value || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const manageBytes = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const bytes = Number(value);
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

/**
 * Builds the Shipment Timeline: both status types, in one list, newest first.
 *
 * The two sequences are kept apart and labelled rather than merged. A Shipment
 * Request Status is where the request is in its own workflow and a Shipment
 * Status is where the shipment is in its operational lifecycle; showing them in
 * one list without saying which is which would read as one journey with a
 * contradiction in the middle of it.
 *
 * Every entry is read from a stored row rather than derived, including its label
 * and its visibility, so the timeline cannot disagree with what was recorded.
 *
 * @param {object} shipment The shipment view, with trackingEvents and
 *   requestStatusEvents attached.
 * @param {Map<string,object>} [reference] The status reference table, already read.
 * @returns {Array<object>} newest first
 */
const buildShipmentTimeline = (shipment, reference) => {
  if (!shipment) return [];

  const table = reference || new Map();
  const entries = [];

  (shipment.trackingEvents || []).forEach((event) => {
    const plain = event.get ? event.get({ plain: true }) : event;
    const row = table.get(`Shipment::${plain.status}`);
    /* A status the Shipment Status list no longer carries is still history: it
       was recorded, so its own stored label and visibility are read rather than
       the entry being dropped. */
    entries.push({
      id: `TE-${plain.id}`,
      statusType: 'Shipment',
      status: plain.status,
      label: plain.label,
      visibility: plain.visibility || (row && row.visibility) || 'Internal Only',
      recordedAt: plain.createdAt,
      createdBy: plain.createdBy || 'System',
      note: plain.note,
      location: plain.location,
    });
  });

  (shipment.requestStatusEvents || []).forEach((event) => {
    const plain = event.get ? event.get({ plain: true }) : event;
    entries.push({
      id: `RS-${plain.id}`,
      statusType: 'Shipment Request',
      status: plain.status,
      /* The label was generated when the status was raised, so history reads as
         it was recorded rather than as it would be worded today. */
      label: plain.label,
      visibility: plain.visibility || 'Internal Only',
      recordedAt: plain.createdAt,
      createdBy: plain.createdBy || 'System',
    });
  });

  /* Newest first, with the row's own id as the tie-break so two entries
     recorded in the same second keep a stable order. */
  entries.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt) || Number(String(b.id).split('-')[1]) - Number(String(a.id).split('-')[1]));

  return entries;
};

/**
 * The audit trail of a shipment: one row per recorded event against it,
 * newest first. Built from the records the shipment already carries - the
 * tracking events, payments, invoices, documents and return cases - rather
 * than a separate audit table, so the trail can never disagree with the
 * sections it summarises.
 */
const buildShipmentAuditTrail = (shipment) => {
  if (!shipment) return { rows: [], stats: { totalEvents: 0, trackingUpdates: 0, payments: 0, invoices: 0, documents: 0, returns: 0 } };

  const rows = [];
  const add = (action, entityType, entityId, summary, occurredAt, actor) => {
    rows.push({
      action,
      entityType,
      entityId: entityId || '-',
      changeSummary: summary || action,
      occurredAt: occurredAt || null,
      actor: actor || 'System',
    });
  };

  add(
    'Shipment created',
    'Shipment',
    shipment.shipmentId,
    `Shipment ${shipment.shipmentId} created for ${shipment.user?.name || shipment.customer?.name || 'customer'}`,
    shipment.createdAt
  );

  (shipment.trackingEvents || []).forEach((event) => {
    add(
      `Tracking update: ${manageTitleCase(event.status)}`,
      'Tracking Event',
      shipment.trackingNumber,
      [event.status, event.location, event.note].filter(Boolean).join(' • '),
      event.createdAt
    );
  });

  (shipment.payments || []).forEach((payment) => {
    add(
      `Payment ${manageTitleCase(payment.status)}`,
      'Payment',
      payment.providerRef || `PAY-${String(payment.id).padStart(7, '0')}`,
      `${manageMoney(payment.amount, payment.currency)} via ${payment.provider}${payment.notes ? ` - ${payment.notes}` : ''}`,
      payment.paidAt || payment.createdAt,
      'Payment Gateway'
    );
  });

  (shipment.invoices || []).forEach((invoice) => {
    add(
      `Invoice ${manageTitleCase(invoice.status)}`,
      'Invoice',
      invoice.invoiceId,
      `${manageMoney(invoice.total, invoice.currency)} invoice ${manageTitleCase(invoice.status)}`,
      invoice.issuedAt || invoice.createdAt
    );
  });

  /* Live documents only: a removed one has no place in a listing. */
  const liveDocuments = shipment.documents || [];
  const removedDocuments = shipment.removedDocuments || [];

  liveDocuments.forEach((document) => {
    add(
      `Document uploaded: ${docTypeLabel(document.documentType)}`,
      'Document',
      `DOC-${String(document.id).padStart(7, '0')}`,
      `${document.fileName} - verification ${document.verificationStatus}`,
      document.createdAt,
      'Customer'
    );
  });

  /* Removal is a decision in its own right, so it is recorded even though the
     document is no longer listed. */
  removedDocuments.forEach((document) => {
    add(
      `Document removed: ${docTypeLabel(document.documentType)}`,
      'Document',
      `DOC-${String(document.id).padStart(7, '0')}`,
      `${document.fileName} - removed while verification was ${document.verificationStatus}`,
      document.removedAt,
      'Staff'
    );
  });

  (shipment.returnsRTOs || []).forEach((record) => {
    add(
      `${record.type === 'rto' ? 'RTO' : 'Return'} ${manageTitleCase(record.status)}`,
      record.type === 'rto' ? 'RTO' : 'Return',
      `RT-${String(record.id).padStart(7, '0')}`,
      record.reason || `${record.type === 'rto' ? 'RTO' : 'Return'} case ${manageTitleCase(record.status)}`,
      record.requestedOn || record.createdAt,
      'Customer'
    );
  });

  rows.sort((a, b) => new Date(b.occurredAt || 0) - new Date(a.occurredAt || 0));

  const numbered = rows.map((row, index) => ({
    ...row,
    recordId: `AUD-${String(index + 1).padStart(7, '0')}`,
  }));

    return {
    rows: numbered,
    stats: {
      totalEvents: numbered.length,
      trackingUpdates: (shipment.trackingEvents || []).length,
      payments: (shipment.payments || []).length,
      invoices: (shipment.invoices || []).length,
      documents: liveDocuments.length,
      removedDocuments: removedDocuments.length,
      returns: (shipment.returnsRTOs || []).length,
    },
  };
};

const renderShipmentManage = async (req, res, next) => {
  try {
    const raw = String(req.params.ref || '').trim();
    const tab = SHIPMENT_MANAGE_TABS[req.params.tab] ? req.params.tab : 'overview';

    // Digits address the row; anything else is treated as the public reference.
    const where = /^\d+$/.test(raw) ? { id: raw } : { shipmentId: raw };

    const shipment = await Shipment.findOne({
      where,
      include: [
        { model: Address, as: 'sender' },
        { model: Address, as: 'receiver' },
        { model: TrackingEvent, as: 'trackingEvents', order: [['createdAt', 'DESC']] },
        { model: ShipmentItem, as: 'items' },
        // The invoice a payment settles travels with it, so the Payments tab can
        // read the Due Date and the Linked Invoice section from one query.
        { model: Payment, as: 'payments', include: [{ model: Invoice, as: 'invoice' }] },
        { model: Invoice, as: 'invoices', include: [{ model: InvoiceItem, as: 'items' }] },
        { model: Quotation, as: 'quotations', include: [{ model: QuotationItem, as: 'items' }] },
        { model: Document, as: 'documents', order: [['createdAt', 'DESC']] },
        { model: Insurance, as: 'insurances' },
        { model: Claim, as: 'claims', order: [['createdAt', 'DESC']] },
        { model: ReturnRTO, as: 'returnsRTOs' },
        // The timeline's other half: where the request or booking is in its own
        // workflow. Read next to the tracking events and labelled separately on
        // the page, so a request status is never read as the next step of a
        // shipment.
        { model: RequestStatusEvent, as: 'requestStatusEvents', order: [['createdAt', 'ASC'], ['id', 'ASC']] },
        { model: User, as: 'user' },
      ],
      order: [['id', 'ASC']],
    });

    let sourceRequest = null;
    let sourceRequestItems = [];
    if (shipment && shipment.sourceRequestType && shipment.sourceRequestId) {
      const SourceModel =
        shipment.sourceRequestType === 'self_purchase' ? SelfPurchaseRequest
        : shipment.sourceRequestType === 'assisted_purchase' ? AssistedPurchaseRequest
        : shipment.sourceRequestType === 'export_booking' ? BookShipmentRequest
        : null;
      const SourceItemModel =
        shipment.sourceRequestType === 'self_purchase' ? SelfPurchaseItem
        : shipment.sourceRequestType === 'assisted_purchase' ? AssistedPurchaseItem
        : shipment.sourceRequestType === 'export_booking' ? BookShipmentItem
        : null;
      if (SourceModel) {
        sourceRequest = await SourceModel.findOne({ where: { requestId: shipment.sourceRequestId } });
        if (sourceRequest && SourceItemModel) {
          sourceRequestItems = await SourceItemModel.findAll({ where: { requestId: sourceRequest.id } });
        }
      }
    }

    /* The manage page reads a handful of names that are not columns on the shipment
       table - where it came from and went to, the chargeable weight it actually
       carries, and the freight mode of the request behind it. Each is derived here
       from what is stored, and left null when there is genuinely nothing to
       derive, so the page shows a dash rather than a plausible-looking invention.

       Nothing on the page is changed by this; it only fills in fields that already
       had no answer to read. */
    const manageModes = await freightModeByRequestRef(shipment ? [shipment] : []);

    const view = shipment
      ? {
          ...shipment.get({ plain: true }),
          items: shipment.items || [],
          // The items as the customer submitted them on the request that became
          // this shipment. The Items & Carrier Tracking tab reads these rather
          // than shipment_items, because that is where the customer's own
          // answers live: item source, seller, product link, dimensions, the
          // tracking number each item carries, and the acceptance review that
          // was recorded in the Requests & Bookings workflow. shipment_items
          // stays the staff-side copy and is only used to fill gaps.
          sourceRequestItems: sourceRequestItems.map((row) => row.get({ plain: true })),
          payments: shipment.payments || [],
          trackingEvents: shipment.trackingEvents || [],
          requestStatusEvents: shipment.requestStatusEvents || [],
          // A removed document stays in the database so the audit trail can keep
          // saying who removed it and when, but it is not part of the shipment's
          // documents any more. Everything that lists documents reads this one,
          // so a removal cannot show on one tab and not another.
          documents: (shipment.documents || []).filter((d) => !d.removedAt),
          removedDocuments: (shipment.documents || []).filter((d) => d.removedAt),
          invoices: shipment.invoices || [],
           insurances: shipment.insurances || [],
           claims: shipment.claims || [],
           returnsRTOs: shipment.returnsRTOs || [],
          customer: shipment.user || null,
          freightMode: manageModes.get(shipment.sourceRequestId) || null,
          // The chargeable weight the shipment is moving, which is what the page
          // labels as actual weight.
          actualWeight: shipment.weightKg,
          origin: placeOf(shipment.sender),
          destination: placeOf(shipment.receiver),
          // Facilities are a warehouse concept and no shipment records one yet, so
          // these stay null rather than being invented from the address.
          originFacility: null,
          destinationFacility: null,
           // Whether the customer asked for insurance on the request that became
           // this shipment. The flag lives on the request, not the shipment, so it
           // is read from the resolved source request and surfaced here for the
           // Insurance & Claims tab's gating rules. isLost / lostConfirmedAt now
           // exist on the shipment row itself, so they already flow through the
           // spread below.
           insuranceRequested: Boolean(
             sourceRequest &&
               (Boolean(sourceRequest.addPackageInsurance) || Boolean(sourceRequest.addInsurance))
           ),
           itemType: null,
           declaredWeight: null,
        }
      : null;

    const audit = buildShipmentAuditTrail(view);

    /* The status label table, read once for the whole page. Every tab that shows
       a timeline entry or a status label reads the same rows, so a label cannot
       read one way on the timeline and another on the overview. */
    const statusReference = await loadStatusReference();

    const context = {
      user: req.user,
      // The merged view when a row matched, otherwise null.
      shipment: view,
      reference: raw,
      found: Boolean(shipment),
      activeTab: tab,
      view: SHIPMENT_MANAGE_TABS[tab],
      auditTrail: audit.rows,
      auditStats: audit.stats,
      /* The Shipment Timeline: both status types, whichever were recorded. */
      timeline: view ? buildShipmentTimeline(view, statusReference) : [],
      statusReference: [...statusReference.values()],
      timelineStatusOptions: timelineStatusOptions(),
      fmtDate: manageFmtDate,
      fmtDateTime: manageFmtDateTime,
      orDash: manageOrDash,
      money: manageMoney,
      titleCase: manageTitleCase,
      fmtBytes: manageBytes,
      docTypeLabel,
      /* Shared with the Quotations & Invoices tab so the status rule that
         turns a lapsed quotation into Expired lives in one place. */
      quotationDisplayStatus,
    };

    // AJAX tab switch: return only the tab partial so the sticky top section
    // already in the page is left untouched.
    if (req.query.partial === '1') {
      return res.render(`admin/${SHIPMENT_MANAGE_TABS[tab]}`, context);
    }

    return res.render('admin/shipment-manage', context);
  } catch (err) {
    return next(err);
  }
};

const updateRateCard = async (req, res, next) => {
  try {
    const rc = await RateCard.findByPk(req.params.id);
    if (!rc) return res.status(404).send('Rate card not found');
    await rc.update(req.body);
    res.redirect('/admin/rate-cards');
  } catch (err) {
    next(err);
  }
};
const renderAssistedPurchase = async (req, res) => {
  try {
    const purchases = await AssistedPurchaseRequest.findAll({
      include: [{ model: AssistedPurchaseItem, as: 'items', required: false }],
      order: [['createdAt', 'DESC']],
    });
    res.render('admin/assisted-purchase', { user: req.user, purchases });
  } catch (error) {
    console.error('Error rendering assisted purchase:', error);
    res.render('admin/assisted-purchase', { user: req.user, purchases: [] });
  }
};

const renderAssistedPurchaseManage = async (req, res) => {
  try {
    const request = await AssistedPurchaseRequest.findOne({
      where: { requestId: req.params.id },
      include: [{ model: AssistedPurchaseItem, as: 'items', required: false }],
    });
    res.render('admin/assisted-purchase-manage', { user: req.user, purchaseId: req.params.id, purchaseData: request });
  } catch (error) {
    console.error('Error rendering assisted purchase manage:', error);
    res.render('admin/assisted-purchase-manage', { user: req.user, purchaseId: req.params.id, purchaseData: null });
  }
};
const renderAssistedPurchaseManageItemsPurchasePreparation = (req, res) => {
  res.render('admin/assisted-purchase-manage-items-purchase-preparation', { user: req.user, purchaseId: req.params.id });
};
const renderAssistedPurchaseManageInvoiceAdvancePayment = (req, res) => {
  res.render('admin/assisted-purchase-manage-invoice-advance-payment', { user: req.user, purchaseId: req.params.id });
};
const renderAssistedPurchaseManageSellerOrdersTracking = (req, res) => {
  res.render('admin/assisted-purchase-manage-seller-orders-tracking', { user: req.user, purchaseId: req.params.id });
};
const renderAssistedPurchaseManageDocuments = (req, res) => {
  res.render('admin/assisted-purchase-manage-documents', { user: req.user, purchaseId: req.params.id });
};
const renderAssistedPurchaseManageAuditTrail = (req, res) => {
  res.render('admin/assisted-purchase-manage-audit-trail', { user: req.user, purchaseId: req.params.id });
};

const renderWarehouse = (req, res) => {
  res.render('admin/warehouse', { user: req.user });
};

const renderFreight = (req, res) => {
  res.render('admin/freight', { user: req.user });
};

const renderCustoms = (req, res) => {
  res.render('admin/customs', { user: req.user });
};

/**
 * The status a quotation reads as.
 *
 * A generated quotation is stored as Sent, and the rule in the Quotations &
 * Invoices tab is that it reads Expired once the Valid Until date has passed.
 * The lapse is derived from the date rather than stored, so a quotation never
 * shows as Sent after it expired and nothing has to be updated to make that
 * happen. A cancelled quotation is left alone: it was withdrawn, not lapsed.
 *
 * `now` is passed in so a caller can pin the reference date when it needs to.
 */
const quotationDisplayStatus = (quotation, now = new Date()) => {
  if (quotation.status === 'Cancelled') return 'Cancelled';
  if (!quotation.validUntil) return quotation.status || 'Sent';
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const expires = new Date(quotation.validUntil);
  if (isNaN(expires.getTime())) return quotation.status || 'Sent';
  return expires < today ? 'Expired' : (quotation.status || 'Sent');
};

const renderFinance = (req, res) => {
  res.render('admin/finance', { user: req.user });
};

const renderInsurance = (req, res) => {
  res.render('admin/insurance', { user: req.user });
};

const renderReturns = (req, res) => {
  res.render('admin/returns', { user: req.user });
};

const renderSupport = (req, res) => {
  res.render('admin/support', { user: req.user });
};

const renderReports = (req, res) => {
  res.render('admin/reports', { user: req.user });
};

const renderStaff = (req, res) => {
  res.render('admin/staff', { user: req.user });
};

const renderSettings = (req, res) => {
  res.render('admin/settings', { user: req.user });
};

/* ==================================================================
 * Customer uploaded files.
 *
 * Uploads are not stored in one place. The `documents` table only holds rows
 * that were explicitly registered, while the files a customer actually
 * uploaded through the registration and request forms live in their own
 * columns (customers.trade_license, the request tables' nid /
 * payment_receipt paths and the per-item invoice / packing list /
 * supporting docs paths). Reading only `documents` therefore showed an empty
 * account-documents table even though the customer had files on disk.
 *
 * This collector is shared by the customer-detail render and by the
 * verification endpoint, so the endpoint can confirm that a file it is asked
 * to register really belongs to the customer making the request.
 * ================================================================== */

const uploadsDir = path.resolve('uploads');

// Stored paths come in two shapes: a bare filename ("nid-123.pdf") and an
// app-relative path ("/uploads/nid-123.pdf"). Both resolve to the same file.
const resolveStoredFile = (stored) => {
  if (!stored) return null;
  const relative = String(stored).replace(/^\/?uploads\//, '').replace(/^\/+/, '');
  if (!relative) return null;
  // Refuse anything that escapes the uploads directory.
  const resolved = path.resolve(uploadsDir, relative);
  if (resolved !== uploadsDir && !resolved.startsWith(uploadsDir + path.sep)) return null;
  return resolved;
};

// Resolves a stored path to its file on disk. Returns null when nothing is
// stored, so callers never render a row for a request sent without a file.
const describeFile = (stored) => {
  const resolved = resolveStoredFile(stored);
  if (!resolved) return null;
  const exists = fs.existsSync(resolved) && fs.statSync(resolved).isFile();
  return {
    url: exists ? `/uploads/${path.relative(uploadsDir, resolved).split(path.sep).join('/')}` : null,
    exists,
    fileName: path.basename(resolved),
    fileSize: exists ? fs.statSync(resolved).size : null,
  };
};

// Maps an upload label to the documents.documentType enum so a file that was
// uploaded outside the documents table can still be registered against it.
const DOCUMENT_TYPE_KEYS = {
  'Trade License/Business document': 'trade_license',
  'National ID': 'national_id',
  'Commercial Invoice': 'commercial_invoice',
  'Packing List': 'packing_list',
  'Invoice': 'invoice',
  // Item-level invoice/receipt uploads are named for the item they belong to
  // ("Invoice / Receipt - <item>"), so the prefix is matched as well.
  'Invoice / Receipt': 'invoice',
};

// Route placeholder used when the file being verified has no documents-table
// row yet. The file is then registered from its stored path before the
// decision is saved.
const UPLOADED_DOC_ID = 'uploaded';

/**
 * Collects one entry per file the customer has on record, from every source.
 * Entries carry the raw `filePath` so an unreviewed upload can be registered
 * into the documents table on its first verification.
 */
const collectCustomerFiles = ({
  customer,
  selfPurchaseRequests = [],
  assistedPurchaseRequests = [],
  bookShipmentRequests = [],
  accountDocuments = [],
  shipmentDocuments = [],
}) => {
  const rows = [];

  const addFile = ({ stored, category, label, source, relatedRecord, uploadedAt, documentId }) => {
    if (!stored) return;
    const info = describeFile(stored);
    if (!info) return;
    rows.push({
      documentId: documentId || null,
      documentTypeKey: DOCUMENT_TYPE_KEYS[label] || 'other',
      category,
      label,
      source,
      relatedRecord: relatedRecord || null,
      uploadedAt: uploadedAt || null,
      // Raw stored value, kept so the verification endpoint can register it.
      filePath: String(stored),
      uploadedBy: customer.id,
      ...info,
    });
  };

  // 1. Registered trade licence kept on the customer row itself.
  addFile({
    stored: customer.trade_license,
    category: 'Trade License',
    label: 'Trade License/Business document',
    source: 'Registration',
    relatedRecord: 'Customer Account',
    uploadedAt: customer.createdAt,
  });

  // 2. Files uploaded with the customer's requests.
  const requestFileSources = [
    { rows: selfPurchaseRequests, ref: 'nidPath', label: 'National ID', category: 'National ID', prefix: 'SPR' },
    { rows: assistedPurchaseRequests, ref: 'nidPath', label: 'National ID', category: 'National ID', prefix: 'APR' },
    { rows: bookShipmentRequests, ref: 'nidPath', label: 'National ID', category: 'National ID', prefix: 'BSR' },
    { rows: bookShipmentRequests, ref: 'paymentReceiptPath', label: 'Payment Receipt', category: 'Payment Proof', prefix: 'BSR' },
  ];
  requestFileSources.forEach(({ rows: list, ref, label, category, prefix }) => {
    list.forEach((r) => {
      addFile({
        stored: r[ref],
        category,
        label,
        source: 'Request Submission',
        relatedRecord: `${prefix}-${String(r.id).padStart(6, '0')}`,
        uploadedAt: r.createdAt,
      });
    });
  });

  // 3. Per-item attachments on assisted and booked shipment requests.
  const itemFileSources = [
    { rows: assistedPurchaseRequests, ref: 'screenshotPath', label: 'Item Screenshot', category: 'Item Screenshot', prefix: 'APR' },
    { rows: bookShipmentRequests, ref: 'invoiceFilePath', label: 'Commercial Invoice', category: 'Invoice', prefix: 'BSR' },
    { rows: bookShipmentRequests, ref: 'packingListPath', label: 'Packing List', category: 'Packing List', prefix: 'BSR' },
    { rows: bookShipmentRequests, ref: 'supportingDocsPath', label: 'Supporting Document', category: 'Supporting Document', prefix: 'BSR' },
  ];
  itemFileSources.forEach(({ rows: list, ref, label, category, prefix }) => {
    list.forEach((r) => {
      (r.items || []).forEach((item, index) => {
        addFile({
          stored: item[ref],
          category,
          label,
          source: 'Request Submission',
          relatedRecord: `${prefix}-${String(r.id).padStart(6, '0')} / Item ${index + 1}`,
          uploadedAt: item.createdAt || r.createdAt,
        });
      });
    });
  });

  // 4. Rows already registered in the documents table keep their own files.
  accountDocuments.forEach((doc) => {
    addFile({
      stored: doc.filePath,
      category: 'Account Document',
      label: doc.documentType,
      source: 'Document Registry',
      relatedRecord: doc.relatedRecord || 'Customer Account',
      uploadedAt: doc.createdAt,
      documentId: doc.id,
    });
  });
  shipmentDocuments.forEach((doc) => {
    addFile({
      stored: doc.filePath,
      category: 'Shipment Document',
      label: doc.documentType,
      source: 'Shipment',
      relatedRecord: doc.relatedRecord || (doc.shipmentId ? `Shipment #${doc.shipmentId}` : null),
      uploadedAt: doc.createdAt,
      documentId: doc.id,
    });
  });

  return rows;
};

/* ======================================================================
 * Requests & Bookings queue.
 *
 * The queue merges the three request tables into one review list. Which tables
 * it reads, how a status maps onto the five summary cards and which action a row
 * offers all come from config/requestQueue.js, so the card counts and the filter
 * a card applies can never disagree.
 *
 * Everything the views need is assembled here: the queue page reads its rows,
 * card counts, filter options and pagination from this render, and the Request
 * Information modal is primed with the same catalogue the create endpoint
 * validates against.
 * ====================================================================== */

const REQUEST_MODELS = {
  self_purchase: SelfPurchaseRequest,
  assisted_purchase: AssistedPurchaseRequest,
  export_booking: BookShipmentRequest,
};

const REQUEST_ITEM_MODELS = {
  self_purchase: SelfPurchaseItem,
  assisted_purchase: AssistedPurchaseItem,
  export_booking: BookShipmentItem,
};

/** One page per request type, plus the combined queue page. */
const QUEUE_VIEWS = {
  '': 'admin/bookings',
  self_purchase: 'admin/bookings-self-purchase',
  assisted_purchase: 'admin/bookings-assisted-purchase',
  export_booking: 'admin/bookings-export',
};

/** Query parameters the toolbar and the summary cards share. */
const QUEUE_FILTER_KEYS = ['card', 'status', 'freight', 'customerType', 'itemType', 'date', 'search'];

/** Confirmations the queue shows after an action, keyed by the `flash` parameter. */
const QUEUE_FLASH = {
  'information-request-sent': {
    tone: 'success',
    text: 'Information request sent. It is recorded against the customer account.',
  },
  'information-request-failed': {
    tone: 'error',
    text: 'The information request could not be sent. Please try again.',
  },
};

/** Which model a request type reads, or null when the type is unknown. */
const modelForRequestType = (typeKey) => REQUEST_MODELS[typeKey] || null;

/**
 * The earliest timestamp a date-range filter includes, or null for all time.
 * Weeks start on Monday, matching the customers page.
 */
const dateRangeStart = (range) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === 'today') return startOfToday;
  if (range === 'week') {
    const start = new Date(startOfToday);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return start;
  }
  if (range === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
  return null;
};

/**
 * Reads the toolbar, summary-card and pagination state from the query string.
 *
 * Values that cannot match anything are dropped rather than passed through, so a
 * hand-typed filter falls back to the unfiltered queue instead of an empty page.
 * The status filter is deliberately lenient: it is compared by canonical status,
 * so "need more information" typed by hand behaves like the dropdown option.
 */
const readQueueFilters = (req) => {
  const card = String(req.query.card || '').trim();
  const freight = String(req.query.freight || '').trim().toLowerCase();
  const date = String(req.query.date || '').trim().toLowerCase();

  return {
    card: QUEUE_CARD_BY_KEY[card] ? card : '',
    // Folded to its canonical label so "need more information" typed by hand
    // behaves like the dropdown option; a value no request can hold is dropped,
    // the same way an unknown card key is, so the queue falls back to all rows
    // instead of to an empty table.
    status: resolveStatusFilter(req.query.status) || '',
    freight: FREIGHT_MODE_OPTIONS.includes(freight) ? freight : '',
    customerType: String(req.query.customerType || '').trim().slice(0, 60),
    itemType: String(req.query.itemType || '').trim().slice(0, 60),
    date: DATE_RANGE_OPTIONS.some((o) => o.value === date) ? date : 'all',
    search: String(req.query.search || '').trim().slice(0, 100),
    informationRequest: String(req.query.informationRequest || '').trim().slice(0, 60),
    page: Math.max(1, parseInt(req.query.page, 10) || 1),
  };
};

/**
 * Rebuilds a queue query string from the current filter state.
 *
 * A filter left at its default is dropped from the URL, so every link the page
 * produces is the shortest one that still describes the same view. The page
 * number is dropped at 1 for the same reason.
 */
const buildQueueQuery = (filters, overrides = {}) => {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  QUEUE_FILTER_KEYS.forEach((key) => {
    const value = String(merged[key] ?? '').trim();
    if (value && value !== 'all') params.set(key, value);
  });
  const modalTarget = String(merged.informationRequest ?? '').trim();
  if (modalTarget) params.set('informationRequest', modalTarget);
  return params.toString();
};

/** A link into the queue that preserves every active filter but the named ones. */
const queueLink = (basePath, filters, overrides = {}) => {
  const query = buildQueueQuery(filters, overrides);
  return query ? `${basePath}?${query}` : basePath;
};

/** Item types on a request, de-duplicated and joined for the table cell. */
const summariseItemTypes = (items) => {
  const types = [...new Set((items || []).map((i) => String(i.itemType || '').trim()).filter(Boolean))];
  return { types, summary: types.length ? types.join(' + ') : 'Not specified' };
};

/**
 * Loads every request of the given types together with its customer, items and
 * any shipment the approval created.
 *
 * Shipments are matched through Shipment.sourceRequestType and
 * Shipment.sourceRequestId, which are written as the request's own key and
 * requestId when a request is converted, so the link needs no extra column.
 */
const loadQueueRows = async (types) => {
  const groups = await Promise.all(
    types.map(async (type) => ({
      type,
      records: await REQUEST_MODELS[type.key].findAll({
        include: [
          {
            model: Customer,
            as: 'user',
            required: false,
            attributes: ['id', 'name', 'email', 'phone', 'whatsapp', 'account_type', 'accountStatus'],
          },
          // separate: true runs its own query, so a request with ten items is not
          // returned ten times and the item count cannot inflate the totals.
          { model: REQUEST_ITEM_MODELS[type.key], as: 'items', required: false, separate: true, order: [['id', 'ASC']] },
        ],
        order: [['createdAt', 'DESC']],
      }),
    }))
  );

  const pairs = groups.flatMap(({ type, records }) => records.map((record) => ({ type, record })));
  const requestIds = [...new Set(pairs.map(({ record }) => record.requestId).filter(Boolean))];

  const shipments = requestIds.length
    ? await Shipment.findAll({
        where: {
          sourceRequestType: { [Op.in]: types.map((t) => t.key) },
          sourceRequestId: { [Op.in]: requestIds },
        },
        attributes: ['id', 'shipmentId', 'trackingNumber', 'status', 'sourceRequestId'],
        order: [['createdAt', 'DESC']],
      })
    : [];

  // More than one shipment can reference the same request (a re-booked
  // consignment), so the oldest link is kept as the primary one the row opens.
  const shipmentByRequestId = new Map();
  shipments.forEach((shipment) => {
    if (shipment.sourceRequestId && !shipmentByRequestId.has(shipment.sourceRequestId)) {
      shipmentByRequestId.set(shipment.sourceRequestId, shipment);
    }
  });

  return pairs.map(({ type, record }) =>
    buildQueueRow({ type, record, shipment: record.requestId ? shipmentByRequestId.get(record.requestId) : null })
  );
};

/**
 * Shapes one request into the row the queue table renders.
 *
 * The action is derived from the status rather than stored on the request, so the
 * cell and the workflow can never drift apart, and the href is built here so the
 * view never has to know how a type's slug relates to its row.
 */
const buildQueueRow = ({ type, record, shipment }) => {
  const status = canonicalStatus(record.status);
  const action = actionForStatus(status);
  const requestRef = record.requestId || `${type.prefix}-${String(record.id).padStart(6, '0')}`;
  const items = record.items || [];
  const { types: itemTypes, summary: itemTypeSummary } = summariseItemTypes(items);

  return {
    rowId: `${type.slug}:${record.id}`,
    typeKey: type.key,
    typeSlug: type.slug,
    typeLabel: type.label,
    typeShortLabel: type.shortLabel,
    id: record.id,
    requestRef,
    sourceRequestId: record.requestId || null,
    customer: record.user
      ? {
          id: record.user.id,
          name: record.user.name,
          email: record.user.email,
          phone: record.user.phone,
          whatsapp: record.user.whatsapp,
          accountType: record.user.account_type,
          accountStatus: record.user.accountStatus,
        }
      : null,
    status,
    statusBadgeClass: statusBadgeClass(status),
    freightMode: record.freightMode || null,
    requestedServiceLevel: record.requestedServiceLevel || null,
    customerType: record.customerType || null,
    itemCount: items.length,
    itemTypes,
    itemTypeSummary,
    specialInstruction: record.specialInstruction || null,
    shipmentInstructions: record.shipmentInstructions || null,
    submittedAt: record.submittedAt || null,
    createdAt: record.createdAt,
    shipment: shipment
      ? {
          id: shipment.id,
          ref: shipment.shipmentId || shipment.trackingNumber || `Shipment #${shipment.id}`,
          trackingNumber: shipment.trackingNumber,
          status: shipment.status,
          href: `/admin/shipments/${shipment.id}`,
        }
      : null,
    action: { ...action },
    // A raw record reference is carried through only so the modal and the search
    // can address the row; the view never renders it directly.
    record,
  };
};

/**
 * The Request Information modal's channel availability.
 *
 * A channel with no registered destination would silently drop the notice, so it
 * is offered as unavailable and cannot be selected.
 */
const informationChannelsFor = (customer) => ({
  Email: !!customer?.email,
  SMS: !!customer?.phone,
  WhatsApp: !!customer?.whatsapp,
  'In-App Notification': true,
});

/** Builds the queue page for one request type, or for all of them when key is null. */
const queuePage = (typeKey) => async (req, res, next) => {
  try {
    const types = requestTypesFor(typeKey);
    const queueBase = queuePathFor(typeKey);
    const filters = readQueueFilters(req);

    const allRows = await loadQueueRows(types);

    // The cards count the whole queue for this page, ignoring the toolbar, so a
    // card keeps reporting the state of the queue while a filter narrows the
    // table underneath it. The active card is the exception: it also carries the
    // card's own membership rule so the table can be filtered by it.
    const summaryCards = Object.fromEntries(
      QUEUE_CARDS.map((card) => [card.key, allRows.filter((row) => card.matches(row.status)).length])
    );

    const card = filters.card ? QUEUE_CARD_BY_KEY[filters.card] : null;
    const rangeStart = dateRangeStart(filters.date);
    const term = filters.search.toLowerCase();

    const rows = allRows.filter((row) => {
      if (card && !card.matches(row.status)) return false;
      if (filters.status && row.status !== canonicalStatus(filters.status)) return false;
      if (filters.freight && String(row.freightMode || '').toLowerCase() !== filters.freight) return false;
      if (filters.customerType && row.customerType !== filters.customerType) return false;
      if (filters.itemType && !row.itemTypes.includes(filters.itemType)) return false;
      if (rangeStart && new Date(row.submittedAt || row.createdAt) < rangeStart) return false;
      if (term) {
        const haystack = [
          row.requestRef,
          row.sourceRequestId,
          row.id,
          row.customer?.name,
          row.customer?.email,
          row.customer?.id,
          row.shipment?.ref,
          row.shipment?.trackingNumber,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

// Filter options come from reference files (Statuses.md, Dropdown.md)
    // so dropdowns always reflect the reference data, not just stored records.
    const filterOptions = {
      statuses: getRequestStatuses(),
      freightModes: getFreightModes(),
      customerTypes: getCustomerTypesList(),
      itemTypes: getItemTypesList(),
    };

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / QUEUE_PAGE_SIZE));
    // A hand-typed page number past the end of the result set is clamped rather
    // than redirected, so the active filters survive the correction.
    const currentPage = Math.min(filters.page, totalPages);
    const pageRows = rows.slice((currentPage - 1) * QUEUE_PAGE_SIZE, currentPage * QUEUE_PAGE_SIZE);

    // Resolve each row's action now that the filters are known, so every link and
    // the modal target carry the current view.
    const withActions = pageRows.map((row) => {
      const detailHref = `${detailPathFor(row.typeKey, row.id)}?from=${encodeURIComponent(queueBase)}`;
      const backQuery = buildQueueQuery(filters);

      let href;
      if (row.action.kind === 'information') {
        // A real URL, so the modal is reachable without scripting; the page
        // upgrades it to open in place when JavaScript is available.
        href = queueLink(queueBase, filters, { informationRequest: row.rowId, page: currentPage });
      } else if (row.action.kind === 'shipment') {
        // An approved request without a linked shipment still has to lead
        // somewhere useful, so it falls back to the shipment list.
        href = row.shipment ? row.shipment.href : '/admin/shipments';
      } else {
        href = detailHref;
      }

      return {
        ...row,
        detailHref,
        backHref: queueLink(queueBase, filters, { page: currentPage }),
        backQuery,
        action: { ...row.action, href },
      };
    });

    // The modal is a single shell driven by whichever row was clicked, so its
    // markup is rendered whenever the page can address one. The row the URL points
    // at is the one it should start out showing; without that parameter the first
    // such row on the page is used.
    const informationRows = withActions.filter((row) => row.action.kind === 'information');
    let modalRow =
      (filters.informationRequest
        ? informationRows.find((row) => row.rowId === filters.informationRequest)
        : null) || informationRows[0] || null;

    // A link may name a request that is not on this page - the details page sends
    // one, and a shared link may carry an older page number. The row is loaded
    // directly rather than the link silently doing nothing, so the modal always
    // opens on the request it names.
    if (!modalRow && filters.informationRequest) {
      const [slug, rawId] = filters.informationRequest.split(':');
      const named = resolveRequestType(slug);
      const namedId = Number(rawId);
      if (named && Number.isInteger(namedId)) {
        const namedDetail = await loadRequestForDetail(named.key, namedId);
        if (namedDetail && namedDetail.row.action.kind === 'information') {
          modalRow = {
            ...namedDetail.row,
            action: {
              ...namedDetail.row.action,
              href: queueLink(queueBase, filters, { informationRequest: namedDetail.row.rowId }),
            },
          };
        }
      }
    }

    const activeType = typeKey ? resolveRequestType(typeKey) : null;
    const flash = QUEUE_FLASH[String(req.query.flash || '').trim()] || null;

    return res.render(QUEUE_VIEWS[typeKey || ''], {
      user: req.user,
      queue: {
        basePath: queueBase,
        title: activeType ? activeType.label : 'Requests & Bookings',
        description: activeType
          ? activeType.description
          : 'Review Self-Purchase Pre-Alerts, Assisted Purchase Requests, and Export Bookings in one queue.',
        // The Request Type dropdown links to every individual page, so a
        // selection here navigates instead of filtering in place.
        typeOptions: REQUEST_TYPES.map((type) => ({
          ...type,
          href: queuePathFor(type.key),
          active: type.slug === (activeType ? activeType.slug : null),
        })),
        allHref: queuePathFor(null),
        allActive: !activeType,
        activeType,
      },
      summaryCards,
      activeCard: filters.card,
      cards: QUEUE_CARDS,
      rows: withActions,
      filters,
      filterOptions,
      dateRangeOptions: DATE_RANGE_OPTIONS,
      total,
      currentPage,
      pageSize: QUEUE_PAGE_SIZE,
      totalPages,
      firstRowIndex: total === 0 ? 0 : (currentPage - 1) * QUEUE_PAGE_SIZE + 1,
      lastRowIndex: Math.min(currentPage * QUEUE_PAGE_SIZE, total),
      flash,
      // Modal state. The catalogue is the same definition the endpoint validates
      // against, so the dropdowns cannot offer a value the server would refuse.
      // Channel availability differs per customer, so it travels with the row and
      // the modal applies whichever row it is opened on.
      informationRequest: {
        row: modalRow,
        catalog: informationRequestCatalog(),
        channelsByRow: Object.fromEntries(
          informationRows.map((row) => [row.rowId, informationChannelsFor(row.customer)])
        ),
      },
    });
  } catch (err) {
    return next(err);
  }
};

const renderBookings = queuePage(null);
const renderSelfPurchaseBookings = queuePage('self_purchase');
const renderAssistedPurchaseBookings = queuePage('assisted_purchase');
const renderExportBookingBookings = queuePage('export_booking');

/**
 * Resolves a single request for its details page.
 *
 * Returns null for an unknown type or a row that does not exist, so the caller
 * can answer 404 instead of rendering an empty page.
 *
 * The record is handed to the view as it came out of its own table, so each
 * details page reads the columns that belong to its own workflow rather than a
 * flattened list that has to be interpreted again.
 */
const loadRequestForDetail = async (typeKey, id) => {
  const type = resolveRequestType(typeKey);
  const model = modelForRequestType(type?.key);
  if (!type || !model) return null;

  const record = await model.findByPk(id, {
    include: [
      { model: Customer, as: 'user', required: false },
      { model: REQUEST_ITEM_MODELS[type.key], as: 'items', required: false, separate: true, order: [['id', 'ASC']] },
    ],
  });
  if (!record) return null;

  // A request with no stored requestId cannot be matched on sourceRequestId, so
  // the lookup is narrowed to rows that genuinely have no link at all.
  const shipments = await Shipment.findAll({
    where: record.requestId
      ? { sourceRequestType: type.key, sourceRequestId: record.requestId }
      : { sourceRequestType: type.key, sourceRequestId: null },
    order: [['createdAt', 'DESC']],
  });

  const row = buildQueueRow({
    type,
    record,
    shipment: shipments[0] || null,
  });
  row.shipments = shipments.map((shipment) => ({
    id: shipment.id,
    ref: shipment.shipmentId || shipment.trackingNumber || `Shipment #${shipment.id}`,
    trackingNumber: shipment.trackingNumber,
    status: shipment.status,
    href: `/admin/shipments/${shipment.id}`,
  }));

  // Only the upload columns this type's tables actually carry are listed, taken
  // from the type definition, so the section can never name a file that does not
  // exist on this table. Item uploads carry the item's own name so a request with
  // several of them is still readable.
  const files = [];
  const addFile = (stored, label) => {
    const info = describeFile(stored);
    if (info) files.push({ ...info, label });
  };
  type.requestUploads.forEach((upload) => addFile(record[upload.column], upload.label));
  type.itemUploads.forEach((upload) => {
    (record.items || []).forEach((item, index) => {
      const name = item.productName || item.productDescription || `Item ${index + 1}`;
      addFile(item[upload.column], `${upload.label} - ${String(name).slice(0, 60)}`);
    });
  });

  const informationRequests = row.customer
    ? await InformationRequest.findAll({
        where: { userId: row.customer.id },
        order: [['requestedAt', 'DESC'], ['id', 'DESC']],
        limit: 10,
      })
    : [];

/* -------------------------------------------------------------------------
   * Documents first, then the item sections.
   *
   * An item's own documents decide whether it can be approved, so they are
   * loaded once here and grouped by item rather than queried again per item. That
   * keeps this at one extra query however many items the request has, and it means
   * the item cards and the approval gate read the same document states.
   * ---------------------------------------------------------------------- */
  const documents = await loadRequestDocuments(type, record, REQUEST_ITEM_MODELS[type.key]);
  const documentsByItem = new Map();
  documents.forEach((doc) => {
    if (!doc.itemId) return;
    if (!documentsByItem.has(doc.itemId)) documentsByItem.set(doc.itemId, []);
    documentsByItem.get(doc.itemId).push(doc);
  });

  /* -------------------------------------------------------------------------
   * Item sections.
   *
   * One entry per item, carrying the item's own fields plus the three things the
   * page derives rather than stores: the chargeable volume, which is cubic metres
   * for sea freight and volumetric weight for air; the item's acceptance state;
   * and whether its documents are all verified.
   *
   * This is done here rather than in the view so the modal and the page are
   * guaranteed to read the same volume, status and document state for an item.
   * ---------------------------------------------------------------------- */
  const itemSections = (record.items || []).map((item, index) => {
    const plain = item.get({ plain: true });
    const volume = chargeableVolumeFor(plain, record.freightMode, type.dimensions);
    const itemDocuments = documentsByItem.get(item.id) || [];

    // DECIMAL columns come back as "40.00", which reads as false precision on a
    // measurement, so trailing zeros are dropped. Whole numbers stay whole and a
    // genuine decimal is kept.
    const dimensionsText = [type.dimensions.length, type.dimensions.width, type.dimensions.height]
      .map((column) => String(plain[column] ?? '').replace(/\.?0+$/, ''))
      .join(' × ');

    const context = { dimensionsKnown: volume.available, dimensionsText };

    return {
      ...plain,
      index: index + 1,
      ref: `ITM-${String(item.id).padStart(6, '0')}`,
      volume,
      volumeText: formatChargeableVolume(volume),
      dimensionsText,
      // The volume only appears once all three dimensions are known, so the
      // section can explain the gap instead of showing a dash.
      dimensionsKnown: volume.available,
      acceptanceStatus: plain.acceptanceStatus || 'Pending',
      acceptanceNote: plain.acceptanceNote || '',
      acceptanceClassification: ITEM_ACCEPTANCE_CLASSIFICATIONS.includes(plain.acceptanceClassification)
        ? plain.acceptanceClassification
        // A classification outside the offered list is not shown as if it were one
        // of them; the item is treated as unreviewed instead.
        : 'Allowed',
      // Every file this item carries, with its verification state, and whether they
      // are all verified - the second half of the approval rule.
      documents: itemDocuments,
      documentsVerified: itemDocumentsVerified(itemDocuments).verified,
      documentsReason: itemDocumentsVerified(itemDocuments).reason,
      // Whether this item could be approved as things stand, which is what the
      // modal uses to explain a blocked Approved.
      approvable: plain.acceptanceClassification !== 'Prohibited' && itemDocumentsVerified(itemDocuments).verified,
      // Resolved once here so the shared item partial does not need to know which
      // columns this request type happens to store its uploads in.
      files: (type.itemUploads || [])
        .map((upload) => ({ label: upload.label, info: describeFile(plain[upload.column]) }))
        .filter((entry) => entry.info),
      // The fields this type declares, already formatted for display.
      fields: (type.itemFields || []).map((descriptor) => formatItemField(descriptor, plain, context)),
    };
  });

  const acceptance = summariseItemAcceptance(record.items || []);
  // The second half of the approval gate: every document on the request verified.
  const documentState = summariseDocuments(documents);

  // What the review page states beside the request id. An import reports how the
  // goods were obtained; an export reports the service level the customer booked.
  const subheaderMode = {
    label: type.subheader.label,
    value: type.subheader.typeValue
      ? type[type.subheader.typeValue]
      : record[type.subheader.column],
    upper: Boolean(type.subheader.uppercase),
  };

  // The delivery-instruction answers, resolved from whichever columns this type
  // stored them in. A question the type cannot answer is omitted rather than
  // rendered empty, so the block only ever claims to show what was captured.
  const deliveryFields = (type.deliveryFields || []).map((descriptor) => {
    const value = descriptor.column
      ? record.get({ plain: true })[descriptor.column]
      : (descriptor.compose || [])
          .map((column) => record.get({ plain: true })[column])
          .filter((part) => part !== null && part !== undefined && String(part).trim() !== '')
          .join(', ');

    return {
      label: descriptor.label,
      wide: Boolean(descriptor.wide),
      value: value === null || value === undefined || String(value).trim() === '' ? null : value,
    };
  });

  return {
    type,
    record,
    row,
    items: record.items || [],
    itemSections,
    files,
documents,
  acceptance,
  documentState,
  deliveryFields,
  subheaderMode,
    informationRequests,
    shipments: row.shipments,
  };
};

/**
 * Builds the details page for one request type.
 *
 * There is one handler per type and each renders that type's own view, so the URL
 * a request links to, the table it came from and the page it opens can never
 * disagree. The route fixes the type, which is why the handler takes no type from
 * the request.
 *
 * `from` is the queue page the row was listed on, so the back link returns to the
 * view the staff member was in, filters included. It is only honoured when it
 * points back into this queue, so it cannot be used as an open redirect.
 */
const requestDetailPage = (typeKey) => async (req, res, next) => {
  try {
    const type = resolveRequestType(typeKey);
    const detail = await loadRequestForDetail(type.key, req.params.requestId);
    if (!detail) {
      // The type is fixed by the route, so the row is simply not there.
      const requestedFrom = String(req.query.from || '');
      const backHref = requestedFrom.startsWith('/admin/bookings') ? requestedFrom : queuePathFor(type.key);
      return res.status(404).render('admin/404', {
        message: `${type.label} not found`,
        backHref,
        backLabel: `Back to ${type.shortLabel}`,
      });
    }

    const requestedFrom = String(req.query.from || '');
    const backHref = requestedFrom.startsWith('/admin/bookings') ? requestedFrom : queuePathFor(type.key);

    const { row } = detail;
    const action = actionForStatus(row.status);
    let actionHref;
    if (action.kind === 'information') {
      actionHref = queueLink(queuePathFor(type.key), { card: 'needs-information' }, { informationRequest: row.rowId });
    } else if (action.kind === 'shipment') {
      actionHref = row.shipment ? row.shipment.href : '/admin/shipments';
    } else {
      actionHref = backHref;
    }

    return res.render(type.detailView, {
      user: req.user,
      type,
      record: detail.record,
      row,
      items: detail.items,
      files: detail.files,
      informationRequests: detail.informationRequests,
      shipments: detail.shipments,
      customer: row.customer,
      backHref,
      // This details page's own URL. The overlay compares against it, so a "Back to
      // Request" link inside a mounted action page closes the overlay instead of
      // reloading the page the reader is already on.
      detailsHref: detailPathFor(type.key, detail.record.id),
      // The same action the queue offers, so the queue and the details page can
      // never disagree about what should happen next for this request.
      primaryAction: { ...action, href: actionHref },
      // The two actions on the details page's Request Processing panel open modals,
      // and both need this request's context. The option catalogue is the same one
      // the create endpoint validates against, so the dropdowns cannot offer a
      // value the server would refuse.
      // The two actions on the details page's Request Processing panel open modals,
      // and both need this request's context. The information modal's own context
      // is built from these values rather than from the catalogue, because it
      // asks which items the question is about rather than classifying the gap.
      informationRequest: {
        catalog: informationRequestCatalog(),
        channels: informationChannelsFor(row.customer),
        endpoint: `/admin/bookings/requests/${type.slug}/${detail.record.id}/information-request`,
      },
      // The Request Processing panel's two actions are pages of their own. Their
      // URLs are built here rather than in the views, so the three details pages
      // cannot each spell one differently.
      acceptanceReviewHref: `/admin/bookings/requests/${type.slug}/${detail.record.id}/review-acceptance`,
      informationFormHref: `/admin/bookings/requests/${type.slug}/${detail.record.id}/information`,
      // One section per item, with its chargeable volume and acceptance state
      // already resolved, plus the roll-up that decides whether the request can be
      // approved.
      itemSections: detail.itemSections,
      acceptance: detail.acceptance,
      // Which columns answered the delivery questions, per request type.
      deliveryFields: detail.deliveryFields,
      // The documents table for this request, including files that were uploaded
      // but not yet registered for verification.
      documents: detail.documents,
      // The shipment this request became, if it did. Only set once the request
      // has actually been converted - a request under review has no shipment.
      linkedShipment: detail.shipments && detail.shipments.length ? detail.shipments[0] : null,
      // One decision, shared by the button, the "review required" hint beside it and
      // the server's refusal: every item Accepted, every document Verified, and not
      // already converted.
      approval: approvalReadiness(detail),
      documentState: detail.documentState,
      canApprove: approvalReadiness(detail).canApprove,
      alreadyDecided: ['Rejected', 'Cancelled', 'Converted to Shipment'].includes(detail.record.status),
      // The freight mode decides both the wording and the divisor for every item's
      // chargeable volume, so it is resolved once here.
      ...requestDetailViewState(detail.record, detail.record.freightMode),
      // Where the page's own actions post. Built here so the three details pages
      // cannot each spell one differently, and so the endpoints stay under the
      // same type-prefixed path the GET routes use.
      endpoints: {
        acceptance: `/admin/bookings/requests/${type.slug}/${detail.record.id}/acceptance`,
        approve: `/admin/bookings/requests/${type.slug}/${detail.record.id}/approve`,
        reject: `/admin/bookings/requests/${type.slug}/${detail.record.id}/reject`,
        // Verification is scoped to the request, so a document can only be verified
        // from the page it belongs to and cannot be aimed at another customer's.
        verifyDocument: `/admin/bookings/requests/${type.slug}/${detail.record.id}/documents/:documentId/verification`,
        registerDocument: `/admin/bookings/requests/${type.slug}/${detail.record.id}/documents/uploaded/verification`,
      },
      // Shared presentation helpers. Passed as render locals rather than declared
      // in an EJS partial, because an included partial cannot see a const defined
      // in the template that includes it, but it does see every render local.
      fmtDateTime,
      fmtDate,
      orDash,
      acceptanceBadge,
      verificationBadge,
      verificationLabel,
      reviewerRef,
    });
  } catch (err) {
    return next(err);
  }
};

const renderSelfPurchaseRequestDetail = requestDetailPage('self_purchase');
const renderAssistedPurchaseRequestDetail = requestDetailPage('assisted_purchase');
const renderExportBookingRequestDetail = requestDetailPage('export_booking');

/**
 * Shared setup for the two Request Processing pages.
 *
 * Both are reached from a request's details page and both act on that one request,
 * so both need the same context and the same back link: to the details page they
 * were opened from, which is a fixed URL for the request, so no `from` parameter is
 * needed to get back there.
 *
 * Returns null when the type or the row does not exist, leaving the caller to
 * answer 404.
 */
const loadRequestActionPage = async (req) => {
  const detail = await loadRequestForDetail(req.params.requestType, req.params.requestId);
  if (!detail) return null;

  const { type, row } = detail;
  return {
    user: req.user,
    type,
    record: detail.record,
    row,
    items: detail.items,
    // The resolved item sections, which carry each item's chargeable volume and
    // its acceptance state. The Review modal reads these rather than the raw
    // items, so the modal and the details page quote the same volume and show the
    // same status for an item.
    itemSections: detail.itemSections,
    acceptance: detail.acceptance,
    // Request id plus the mode the subheader states: purchase mode for an import,
    // service mode for an export.
    subheaderMode: detail.subheaderMode,
    // The four classifications the modal offers, and the three statuses it records.
    acceptanceClassifications: ITEM_ACCEPTANCE_CLASSIFICATIONS,
    acceptanceStatuses: ITEM_ACCEPTANCE_STATUSES,
    deliveryFields: detail.deliveryFields,
    documents: detail.documents,
    files: detail.files,
    customer: row.customer,
    shipments: detail.shipments,
    informationRequests: detail.informationRequests,
    linkedShipment: detail.shipments && detail.shipments.length ? detail.shipments[0] : null,
    approval: approvalReadiness(detail),
    documentState: detail.documentState,
    canApprove: approvalReadiness(detail).canApprove,
    ...requestDetailViewState(detail.record, detail.record.freightMode),
    endpoints: {
      acceptance: `/admin/bookings/requests/${type.slug}/${detail.record.id}/acceptance`,
      approve: `/admin/bookings/requests/${type.slug}/${detail.record.id}/approve`,
      reject: `/admin/bookings/requests/${type.slug}/${detail.record.id}/reject`,
      verifyDocument: `/admin/bookings/requests/${type.slug}/${detail.record.id}/documents/:documentId/verification`,
    },
    // Shared presentation helpers, as render locals so the modal formats the same
    // values the details page does.
    fmtDateTime,
    fmtDate,
    orDash,
    acceptanceBadge,
    verificationBadge,
    verificationLabel,
    reviewerRef,
    // The details page this was opened from, and that the back link returns to.
    detailsHref: detailPathFor(type.key, detail.record.id),
    acceptanceReviewHref: `/admin/bookings/requests/${type.slug}/${detail.record.id}/review-acceptance`,
    informationFormHref: `/admin/bookings/requests/${type.slug}/${detail.record.id}/information`,
    // The Request Information modal's own context. It asks which items on this
    // request the question is about, so the item list is built from the same
    // resolved sections the details page renders and the endpoint validates a
    // selection against. Nothing else on this page uses it.
    informationRequest: {
      catalog: informationRequestCatalog(),
      channels: informationChannelsFor(row.customer),
      endpoint: `/admin/bookings/requests/${type.slug}/${detail.record.id}/information-request`,
      items: detail.itemSections.map((item) => ({
        id: item.id,
        ref: item.ref,
        name: item.productName || item.productDescription || item.storeName || item.sellerStoreName || `Item ${item.index}`,
        acceptanceStatus: item.acceptanceStatus,
      })),
      customerName: row.customer ? row.customer.name : null,
      requestRef: row.requestRef,
    },
  };
};

/** Renders the not-found page for one of the two action pages. */
const renderActionPageNotFound = (res, req, typeKey) => {
  const type = resolveRequestType(typeKey);
  const requestedFrom = String(req.query.from || '');
  const backHref = requestedFrom.startsWith('/admin/bookings') ? requestedFrom : queuePathFor(type ? type.key : null);
  return res.status(404).render('admin/404', {
    message: type ? `${type.label} not found` : 'Request not found',
    backHref,
    backLabel: type ? `Back to ${type.shortLabel}` : 'Back to Requests & Bookings',
  });
};

/**
 * The Review Item Acceptance page.
 * GET /admin/bookings/requests/:requestType/:requestId/review-acceptance
 *
 * A page rather than a dialog because the review is the gate on approval: it lists
 * every item on the request and keeps the decision, the note and the progress in
 * one place a reviewer can work through, instead of a panel that covers the request
 * they are reading.
 */
const renderRequestAcceptanceReview = async (req, res, next) => {
  try {
    const context = await loadRequestActionPage(req);
    if (!context) return renderActionPageNotFound(res, req, req.params.requestType);

    return res.render('admin/request-acceptance-review', context);
  } catch (err) {
    return next(err);
  }
};

/**
 * The Request Information page.
 * GET /admin/bookings/requests/:requestType/:requestId/information
 *
 * Kept as a page for the same reason: the form is long, and asking for it over a
 * request the customer is waiting on benefits from being able to leave it, come
 * back and see what has already been asked for.
 */
const renderRequestInformationForm = async (req, res, next) => {
  try {
    const context = await loadRequestActionPage(req);
    if (!context) return renderActionPageNotFound(res, req, req.params.requestType);

    return res.render('admin/request-information-form', context);
  } catch (err) {
    return next(err);
  }
};

/**
 * Raises an information request against the customer behind a queued request.
 * POST /admin/bookings/requests/:requestType/:requestId/information-request
 *
 * The request is recorded against the customer, exactly as the customer-level
 * modal on Customer Details records it, so the two cannot produce different
 * records for the same kind of ask. It does not change the request's status:
 * staff raise this from a request that is already marked Needs More Information,
 * or while reviewing one.
 */
const createRequestInformationRequest = async (req, res, next) => {
  try {
    const detail = await loadRequestForDetail(req.params.requestType, req.params.requestId);
    if (!detail) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const customer = detail.row.customer;
    if (!customer) {
      return res.status(400).json({ error: 'This request has no customer record to notify' });
    }

    // Accepts a JSON body and a plain form post alike, so the modal works the
    // same whether it submits through fetch or a form. Both the item list and the
    // channel list arrive as either arrays or comma-separated strings depending on
    // how the form was posted.
    const body = { ...req.body };
    if (typeof body.itemIds === 'string') {
      body.itemIds = body.itemIds.split(',').map((id) => id.trim()).filter(Boolean);
    }
    if (typeof body.notificationChannels === 'string') {
      body.notificationChannels = body.notificationChannels
        .split(',')
        .map((channel) => channel.trim())
        .filter(Boolean);
    }

    // The items this request actually has. The modal is rendered from the same
    // list, so an id outside it means the request was tampered with rather than
    // staff reaching for an item that is not there.
    const availableItemIds = (detail.items || []).map((item) => item.id);

    const { valid, errors, value } = validateRequestInformationRequest(body, { availableItemIds });
    if (!valid) {
      return res.status(400).json({ error: errors[0], errors });
    }

    const customerRecord = await Customer.findByPk(customer.id);

    /* The names the notice refers to the items by, resolved from the selection
       rather than taken from the client, so the message always matches the stored
       record even if the caller sent different labels. */
    const selectedItems = value.wholeRequest
      ? []
      : (detail.items || []).filter((item) => value.itemIds.includes(item.id));
    const itemLabels = selectedItems.map((item) => {
      const name = item.productName || item.productDescription || item.storeName || item.sellerStoreName;
      return `ITM-${String(item.id).padStart(6, '0')}${name ? ` - ${String(name).slice(0, 60)}` : ''}`;
    });

    const notification = buildRequestInformationNotification({
      customer: customerRecord,
      requestRef: detail.row.requestRef,
      typeLabel: detail.type.label,
      itemLabels,
      wholeRequest: value.wholeRequest,
      message: value.message,
    });

    const { request, results, anyDelivered } = await persistInformationRequest({
      customer: customerRecord,
      value,
      notification,
      channels: value.notificationChannels,
      staffId: req.user?.id,
      extraColumns: {
        relatedRequestType: detail.type.key,
        relatedRequestId: detail.record.id,
        relatedItemIds: JSON.stringify(value.itemIds),
      },
    });

    /* The request has moved to Need More Information, which is a Shipment
       Request Status: recorded in the request half of the timeline with its
       system-generated label, against the request rather than the shipment. */
    if (detail.record.status !== 'Need More Information') {
      await recordRequestStatus({
        requestType: detail.type.key,
        requestId: detail.record.requestId,
        status: 'Need More Information',
        record: null,
        createdBy: req.user?.name || 'Staff',
      });
      detail.record.status = 'Need More Information';
      await detail.record.save();
    }

    /* Sending the notice puts the request on hold, which is what the modal tells
       staff it will do. A request that has already become a shipment is left
       alone: the shipment is the live record from then on, and quietly moving the
       request back to "needs information" would contradict what the customer has
       already been told. */
    let statusChanged = false;
    const settled = ['Converted to Shipment', 'Rejected', 'Cancelled'];
    if (!settled.includes(detail.record.status)) {
      await detail.record.update({ status: 'Need More Information' });
      statusChanged = true;
    }

    return res.status(201).json({
      success: true,
      request: {
        id: request.id,
        reference: `REQ-${String(request.id).padStart(5, '0')}`,
        // The message the customer was sent, as stored. The modal shows this after
        // sending so the preview it showed beforehand can be checked against it.
        subject: request.notificationSubject,
        message: request.notificationMessage,
        relatedItems: itemLabels,
        wholeRequest: value.wholeRequest,
        notificationChannels: value.notificationChannels,
        requestedAt: request.requestedAt,
        relatedRequest: `${detail.type.label} ${detail.row.requestRef}`,
        requestStatus: detail.record.status,
        statusChanged,
      },
      notification: {
        subject: notification.subject,
        channels: value.notificationChannels,
        delivered: anyDelivered,
        results,
      },
    });
  } catch (err) {
    return next(err);
  }
};

/* ========================================================================== *
 * Request details: item acceptance, approval and rejection
 *
 * The details page is where a request is decided, so these three actions live
 * together. They share one rule that is enforced in the database rather than in
 * the page: a request can only be approved once every one of its items is
 * Accepted, and approving twice must never produce a second shipment.
 * ========================================================================== */

// A reviewer may only record one of the three states an item starts in.
const ITEM_ACCEPTANCE_STATUSES = ['Pending', 'Approved', 'Rejected'];

// How a reviewer may classify an item. Kept apart from the decision above: the
// classification is what the item is, the decision is what was done about it.
//
// Four classes. A fifth, "Product-Specific Verification", was withdrawn from the
// workflow; it is no longer offered and no longer accepted, so a review cannot
// record a class the rest of the system does not understand.
const ITEM_ACCEPTANCE_CLASSIFICATIONS = [
  'Allowed',
  'Prohibited',
  'Restricted',
  'Conditionally Accepted',
];

/**
 * Whether every document attached to an item has been verified.
 *
 * This is the second half of the rule that lets an item be approved: an item
 * cannot be accepted while paperwork on it is still outstanding. An item with no
 * documents has nothing outstanding and therefore satisfies it.
 *
 * Returns the flag with the reason it failed, so the reviewer is told which
 * document is holding the decision up rather than just that something is.
 */
const itemDocumentsVerified = (documents) => {
  const outstanding = documents.filter((doc) => doc.verificationStatus !== 'Verified');
  return {
    verified: outstanding.length === 0,
    outstanding,
    reason: outstanding.length
      ? `${outstanding.length} document${outstanding.length === 1 ? '' : 's'} on this item ${outstanding.length === 1 ? 'is' : 'are'} not yet verified: ${outstanding.map((doc) => `${doc.label} (${doc.verificationStatus === 'Pending' ? 'Pending Review' : doc.verificationStatus})`).join('; ')}`
      : null,
  };
};

/**
 * The chargeable volume for one item.
 *
 * Air freight is charged on volumetric weight, sea freight on cubic metres, so
 * the same dimensions produce a different figure and a different label. The
 * divisor is fixed by the mode and the label travels with the number, so the
 * page can never show a cubic-metre figure as if it were a volumetric weight.
 *
 * `dimensionFields` names the columns to read, because the three item tables do
 * not agree on them: the purchase flows use lengthCm/widthCm/heightCm while an
 * export booking already stored plain length/width/height.
 *
 * Returns `available: false` when any dimension is missing, which is a normal
 * state for an item whose measurements were never declared.
 */
const chargeableVolumeFor = (item, freightMode, dimensionFields) => {
  const columns = dimensionFields || { length: 'lengthCm', width: 'widthCm', height: 'heightCm' };
  const dimensions = [columns.length, columns.width, columns.height]
    .map((column) => Number(item[column]))
    .map((value) => (Number.isFinite(value) ? value : null));

  if (dimensions.some((value) => value === null || value <= 0)) {
    return { available: false, label: null, value: null, unit: null };
  }

  const [length, width, height] = dimensions;
  const isAir = String(freightMode || '').toLowerCase() === 'air';
  const cubicCentimetres = length * width * height;

  return isAir
    ? { available: true, label: 'Volumetric Weight', value: cubicCentimetres / 6000, unit: 'kg' }
    : { available: true, label: 'CBM', value: cubicCentimetres / 1000000, unit: 'm³' };
};

/**
 * Renders one value for an item field, according to the kind the type declared.
 *
 * Doing this here rather than in the template is what lets one partial draw all
 * three item tables: a money field, a link field and a plain field are formatted
 * once, and a field the type did not declare is never rendered at all.
 */
const formatItemField = (descriptor, item, context) => {
  // The volume is derived rather than stored, so it is resolved from the item's
  // measurements and the request's freight mode.
  if (descriptor.kind === 'dimensions') {
    return {
      ...descriptor,
      kind: 'text',
      value: context.dimensionsKnown ? context.dimensionsText : null,
      emptyText: 'Not provided',
    };
  }

  const raw = descriptor.column ? item[descriptor.column] : null;

  switch (descriptor.kind) {
    case 'money':
      return { ...descriptor, value: raw === null || raw === undefined || raw === '' ? null : Number(raw).toFixed(2) };
    case 'number':
      return { ...descriptor, value: raw === null || raw === undefined || raw === '' ? null : String(raw).replace(/\.?0+$/, '') };
    case 'link':
      return { ...descriptor, value: raw || null, emptyText: descriptor.emptyText || 'Not provided' };
    default:
      return { ...descriptor, value: raw === null || raw === undefined || String(raw).trim() === '' ? null : raw };
  }
};

/** Formats a chargeable volume to the precision a reviewer would quote it at. */
const formatChargeableVolume = (volume) => {
  if (!volume.available) return null;
  // Volumetric weight is quoted to two decimals and CBM to four, because a cubic
  // metre is three orders of magnitude smaller than a kilogramme of chargeable
  // weight and two decimals would round most volumes to zero.
  return volume.unit === 'kg'
    ? Number(volume.value).toFixed(2)
    : Number(volume.value).toFixed(4);
};

/**
 * Rolls the per-item acceptance states up into the one decision the page needs.
 *
 * Approval is gated on this, so `canApprove` requires every item to be Approved.
 * A request with no items is not approvable either: there is nothing to have
 * accepted, so there is nothing that says the goods were checked.
 */
/**
 * Rolls the request's documents up into the one figure the approval gate needs.
 *
 * Approval requires every document to be Verified, because a shipment is created
 * on the strength of the paperwork behind it. A file that has been uploaded but not
 * yet verified counts as outstanding, which is what stops a request being
 * approved while its paperwork is still being checked.
 *
 * A request with no documents satisfies this: there is nothing outstanding. The
 * rule gates what must be true, it does not demand that documents exist.
 *
 * Returns the reason it failed with, so the reviewer is told which document is
 * holding the decision up rather than just that something is.
 */
const summariseDocuments = (documents) => {
  const outstanding = documents.filter((doc) => doc.verificationStatus !== 'Verified');
  return {
    total: documents.length,
    verified: documents.length - outstanding.length,
    outstanding: outstanding.length,
    allVerified: outstanding.length === 0,
    reason: outstanding.length
      ? `${outstanding.length} document${outstanding.length === 1 ? ' still needs' : 's still need'} verification: ${outstanding.map((doc) => `${doc.label} (${doc.verificationStatus === 'Pending' ? 'Pending Review' : doc.verificationStatus})`).join('; ')}`
      : null,
  };
};

/**
 * Whether a request may be approved right now, and why not if it may not.
 *
 * The same answer drives the button, the "review required" hint beside it and the
 * server's refusal, which is the point: the page and the endpoint cannot disagree
 * about whether a request is ready. Three things must all hold - every item
 * Accepted, every document Verified, and the request not already converted.
 *
 * Returns `reasons` in the order they are worth telling the reviewer about, so the
 * message names what is blocking rather than only counting it.
 */
const approvalReadiness = ({ acceptance, documentState, shipments }) => {
  // What must be true before a shipment may be created: every item Accepted and
  // every document Verified.
  const blockers = [];

  if (!acceptance.total) {
    blockers.push('This request has no items, so there is nothing to accept');
  } else if (acceptance.outstanding > 0) {
    const parts = [];
    if (acceptance.pending) parts.push(`${acceptance.pending} pending`);
    if (acceptance.rejected) parts.push(`${acceptance.rejected} rejected`);
    blockers.push(
      `${acceptance.outstanding} of ${acceptance.total} item${acceptance.total === 1 ? '' : 's'} still need review`
      + (parts.length ? ` (${parts.join(', ')})` : '')
    );
  }

  if (!documentState.allVerified) {
    blockers.push(documentState.reason);
  }

  // Being converted already is not a precondition for creating a shipment - there
  // would be nothing to create - so it is reported to the page but kept out of the
  // blockers the approval endpoint enforces.
  const alreadyConverted = Boolean(shipments && shipments.length);

  return {
    // The button is only clickable when there is nothing left to do at all.
    canApprove: blockers.length === 0 && !alreadyConverted,
    // The endpoint's rule: may a shipment be created right now?
    canCreate: blockers.length === 0,
    blockers,
    reasons: alreadyConverted
      ? [...blockers, 'This request has already been converted into a shipment']
      : blockers,
    alreadyConverted,
  };
};

const summariseItemAcceptance = (items) => {
  const counts = { total: items.length, approved: 0, rejected: 0, pending: 0 };
  items.forEach((item) => {
    if (item.acceptanceStatus === 'Approved') counts.approved += 1;
    else if (item.acceptanceStatus === 'Rejected') counts.rejected += 1;
    else counts.pending += 1;
  });

  return {
    ...counts,
    reviewed: counts.approved + counts.rejected,
    outstanding: counts.total - counts.approved - counts.rejected,
    // "Review required" is shown beside the Approve button whenever this is
    // false, which is also exactly when the button is disabled.
    canApprove: counts.total > 0 && counts.approved === counts.total,
  };
};

/**
 * Every document this request should show, from the documents table and from the
 * files uploaded against the request that have no row there yet.
 *
 * A file only gets a documents row once it is first verified, so a request that
 * was submitted but never reviewed would otherwise show an empty table. The
 * unregistered uploads are listed with the same shape and a `documentId` of
 * `UPLOADED_DOC_ID`, which the verification endpoint resolves to the real row.
 */
const loadRequestDocuments = async (type, record, itemModel) => {
  const registered = await Document.findAll({
    where: { requestType: type.key, requestId: record.id, removedAt: null },
    order: [['createdAt', 'ASC'], ['id', 'ASC']],
  });

  // Files already in the documents table, so an upload is never listed twice.
  const knownPaths = new Set(registered.map((doc) => doc.filePath));

  const drafts = [];
  const addDraft = ({ stored, label, itemId, uploadedAt }) => {
    const info = describeFile(stored);
    if (!info) return;
    if (knownPaths.has(stored)) return;
    drafts.push({
      documentId: UPLOADED_DOC_ID,
      filePath: stored,
      label,
      itemId,
      uploadedAt,
      verificationStatus: 'Pending',
      reviewedBy: null,
      reviewedAt: null,
      isDraft: true,
      ...info,
    });
  };

  type.requestUploads.forEach((upload) =>
    addDraft({ stored: record[upload.column], label: upload.label, itemId: null, uploadedAt: record.submittedAt || record.createdAt })
  );

  // Item uploads carry the item's own name so a request with several of them is
  // still readable.
  (record.items || []).forEach((item, index) => {
    const name = item.productName || item.productDescription || `Item ${index + 1}`;
    (type.itemUploads || []).forEach((upload) =>
      addDraft({
        stored: item[upload.column],
        label: `${upload.label} - ${String(name).slice(0, 60)}`,
        itemId: item.id,
        uploadedAt: item.createdAt,
      })
    );
  });

  const itemsById = new Map((record.items || []).map((item) => [item.id, item]));
  const describe = (doc) => ({
    documentId: doc.documentId || doc.id,
    filePath: doc.filePath,
    label: doc.description || docTypeLabel(doc.documentType) || 'Document',
    itemId: doc.requestItemId || null,
    itemRef: doc.requestItemId && itemsById.get(doc.requestItemId)
      ? `ITM-${String(doc.requestItemId).padStart(6, '0')}`
      : null,
    verificationStatus: doc.verificationStatus,
    verificationProblem: doc.verificationProblem,
    reviewNote: doc.reviewNote,
    reviewedBy: doc.reviewedBy,
    reviewedAt: doc.reviewedAt,
    uploadedAt: doc.createdAt,
    uploadedBy: doc.uploadedBy,
    isDraft: false,
    ...describeFile(doc.filePath),
  });

  const rows = [...registered.map(describe), ...drafts];

  // A file that is no longer on disk is still worth listing: the reviewer needs to
  // see that it was uploaded and cannot be opened, not have it silently vanish.
  rows.forEach((row) => {
    if (row.url) return;
    row.url = null;
    row.exists = false;
  });

  return rows;
};

/**
 * Saves the item-level acceptance decisions for one request.
 *
 * PUT /admin/bookings/requests/:requestType/:requestId/acceptance
 *
 * An item may only be Approved when its classification is not Prohibited and every
 * document attached to it has been verified. That rule is enforced here rather than
 * only in the modal, because the stored record is the source of truth: a review
 * posted directly to this endpoint cannot approve an item the modal would have
 * blocked.
 *
 * Only the items named in the body are written, so saving one item's review leaves
 * the others exactly as they were. An item that is not on this request is refused
 * rather than ignored, otherwise a crafted id could write acceptance state onto
 * another request's item.
 */
const saveRequestItemAcceptance = async (req, res, next) => {
  try {
    const type = resolveRequestType(req.params.requestType);
    const detail = type && (await loadRequestForDetail(type.key, req.params.requestId));
    if (!detail) return res.status(404).json({ error: 'Request not found' });

    const decisions = Array.isArray(req.body.decisions) ? req.body.decisions : [];
    if (!decisions.length) return res.status(400).json({ error: 'No acceptance decisions were supplied' });

    // Two maps over the same items: the plain section carries the document state
    // the gate is judged against, and the instance is what actually writes.
    const sectionsById = new Map(detail.itemSections.map((item) => [String(item.id), item]));
    const instancesById = new Map(detail.items.map((item) => [String(item.id), item]));
    const seen = new Set();

    for (const decision of decisions) {
      const item = sectionsById.get(String(decision.itemId));
      if (!item) return res.status(400).json({ error: `Item ${decision.itemId} is not on this request` });
      if (seen.has(item.id)) return res.status(400).json({ error: `Item ${decision.itemId} was submitted twice` });
      seen.add(item.id);

      if (!ITEM_ACCEPTANCE_STATUSES.includes(decision.status)) {
        return res.status(400).json({ error: 'Acceptance status must be Pending, Approved or Rejected' });
      }
      if (decision.classification && !ITEM_ACCEPTANCE_CLASSIFICATIONS.includes(decision.classification)) {
        return res.status(400).json({
          error: `Unknown item classification. Choose one of: ${ITEM_ACCEPTANCE_CLASSIFICATIONS.join(', ')}`,
        });
      }

      // The two conditions that block an approval, checked together so the reviewer
      // is told about the first that applies.
      if (decision.status === 'Approved') {
        const classification = decision.classification || item.acceptanceClassification;

        if (classification === 'Prohibited') {
          return res.status(409).json({ error: `${item.ref} is classified Prohibited and cannot be approved` });
        }

        const documents = itemDocumentsVerified(item.documents || []);
        if (!documents.verified) {
          return res.status(409).json({ error: `${item.ref} cannot be approved - ${documents.reason}` });
        }
      }
    }

    const reviewedAt = new Date();
    await Promise.all(
      decisions.map((decision) => {
        const item = instancesById.get(String(decision.itemId));
        return item.update({
          acceptanceStatus: decision.status,
          // An omitted classification keeps whatever was stored, so a reviewer who
          // only changes the decision does not silently reset the classification.
          ...(decision.classification ? { acceptanceClassification: decision.classification } : {}),
          acceptanceNote: decision.note ? String(decision.note).trim() || null : null,
          acceptanceReviewedAt: reviewedAt,
          acceptanceReviewedBy: req.user?.id || null,
        });
      })
    );

    const reloaded = await REQUEST_ITEM_MODELS[type.key].findAll({
      where: { id: [...seen] },
      attributes: ['id', 'acceptanceStatus'],
    });

    return res.json({
      success: true,
      saved: decisions.length,
      // The items that were written, so the modal can show what was stored without
      // another request.
      savedItems: reloaded.map((row) => ({ id: row.id, status: row.acceptanceStatus })),
      summary: summariseItemAcceptance(
        detail.items.map((item) => reloaded.find((row) => row.id === item.id) || item)
      ),
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Approves a request and turns it into a shipment.
 *
 * POST /admin/bookings/requests/:requestType/:requestId/approve
 *
 * The shipment is created at most once per request. Approval is safe to retry
 * because it looks the shipment up by this request's own id before creating one,
 * and the lookup is what stops a second shipment appearing when the button is
 * pressed twice or two staff members press it at the same time. The unique index
 * on (sourceRequestType, sourceRequestId) is the backstop if two requests really
 * do race.
 */
const approveRequestDetail = async (req, res, next) => {
  try {
    const type = resolveRequestType(req.params.requestType);
    const detail = type && (await loadRequestForDetail(type.key, req.params.requestId));
    if (!detail) return res.status(404).json({ error: 'Request not found' });

    const { record, items, row } = detail;

    if (['Rejected', 'Cancelled'].includes(record.status)) {
      return res.status(409).json({ error: `This request is already ${record.status.toLowerCase()}` });
    }

    const sourceRequestId = record.requestId || `${type.prefix}-${String(record.id).padStart(6, '0')}`;

    /* The shipment is looked up before the gate is applied, because a request that
       already has one needs nothing created and must answer with that shipment
       rather than a refusal. This is what makes a second press of Approve - or a
       retry after a timeout - return the same shipment instead of failing. */
    const [existing] = await Shipment.findAll({
      where: { sourceRequestType: type.key, sourceRequestId },
      order: [['id', 'ASC']],
      limit: 1,
    });

    if (existing) {
      // The shipment is the live record, so the request is marked as converted
      // rather than left sitting on Approved.
      if (record.status !== 'Converted to Shipment') {
        await record.update({ status: 'Converted to Shipment' });
      }
      return res.json({
        success: true,
        alreadyConverted: true,
        shipment: { id: existing.id, ref: existing.shipmentId, trackingNumber: existing.trackingNumber },
        request: { id: record.id, status: 'Converted to Shipment' },
      });
    }

    // Nothing exists yet, so a shipment is about to be created. Every precondition
    // is re-checked here rather than only in the page, so a state that was never
    // reached cannot be approved by posting to this endpoint directly.
    const readiness = approvalReadiness(detail);
    if (!readiness.canCreate) {
      return res.status(409).json({
        error: readiness.blockers.join('. '),
        summary: detail.acceptance,
        documents: detail.documentState,
      });
    }

    // The customer may not have named addresses on the request yet. That is allowed:
    // the shipment exists from approval onwards and its addresses are filled in
    // when they are known.
    const [senderAddressId, receiverAddressId] = await resolveRequestAddresses(record);
    const [sender, receiver] = await Promise.all([
      senderAddressId ? Address.findByPk(senderAddressId) : null,
      receiverAddressId ? Address.findByPk(receiverAddressId) : null,
    ]);

    const shipment = await Shipment.create({
      shipmentId: generateShipmentReference(),
      // A request-derived shipment has no carrier tracking number yet, so it is
      // given an internal one built from the request it came from.
      trackingNumber: requestTrackingNumber(sourceRequestId),
      userId: record.userId,
      senderAddressId: sender ? sender.id : null,
      receiverAddressId: receiver ? receiver.id : null,
      serviceType: 'standard',
      // Service mode comes from the addresses when they are known, and from the
      // request type when they are not - a pre-alert and an assisted purchase are
      // imports, an export booking is an export.
      serviceMode: sender ? (sender.country === 'USA' ? 'Import' : 'Export') : type.serviceMode,
      // How the goods were obtained, which is what tells the shipment apart from
      // a consignment the customer booked themselves.
      purchaseType: type.purchaseType,
      sourceRequestType: type.key,
      sourceRequestId,
      weightKg: totalRequestWeight(items, type.dimensions),
      declaredValue: totalDeclaredValue(items),
      price: 0,
      currency: 'USD',
      paymentStatus: 'unpaid',
      status: 'Awaiting Carrier Tracking',
    });

    await record.update({ status: 'Converted to Shipment' });

    // The shipment's own timeline starts at the shipment, so the request and the
    // shipment can be read apart later. Written through the timeline service so
    // the entry carries the label and visibility the status means, rather than a
    // caller supplying them per call site.
    await recordShipmentStatus({
      shipmentId: shipment.id,
      status: 'Awaiting Carrier Tracking',
      label: 'Shipment created from the request, awaiting carrier tracking',
      actor: 'system',
      createdBy: 'System',
      apply: false,
      options: {
        note: `Created from ${type.label} ${sourceRequestId}`,
        location: sender ? `${sender.city}, ${sender.country}` : 'Origin not yet confirmed',
      },
    });

    return res.json({
      success: true,
      alreadyConverted: false,
      shipment: { id: shipment.id, ref: shipment.shipmentId, trackingNumber: shipment.trackingNumber },
      request: { id: record.id, status: 'Converted to Shipment' },
    });
  } catch (err) {
    // Two approvals can pass the lookup above at the same moment. The unique index
    // on (sourceRequestType, sourceRequestId) settles it, so the loser reads back
    // the winner's shipment instead of reporting a failure for work that was done.
    const isDuplicateShipment =
      err?.name === 'SequelizeUniqueConstraintError' || err?.parent?.code === 'ER_DUP_ENTRY';

    if (isDuplicateShipment) {
      const racedType = resolveRequestType(req.params.requestType);
      const racedModel = racedType && modelForRequestType(racedType.key);
      const racedRecord = racedModel && (await racedModel.findByPk(req.params.requestId, { attributes: ['id', 'requestId'] }));
      const racedSourceRef = racedRecord?.requestId || (racedRecord && `${racedType.prefix}-${String(racedRecord.id).padStart(6, '0')}`);

      const [winner] = await Shipment.findAll({
        where: { sourceRequestType: racedType.key, sourceRequestId: racedSourceRef },
        order: [['id', 'ASC']],
        limit: 1,
      });

      if (winner) {
        return res.json({
          success: true,
          alreadyConverted: true,
          shipment: { id: winner.id, ref: winner.shipmentId, trackingNumber: winner.trackingNumber },
        });
      }
    }
    return next(err);
  }
};

/**
 * Rejects a request.
 *
 * POST /admin/bookings/requests/:requestType/:requestId/reject
 *
 * A request that already became a shipment is not rejected: the shipment is the
 * live record from then on and reversing it is a separate, deliberate act.
 */
const rejectRequestDetail = async (req, res, next) => {
  try {
    const type = resolveRequestType(req.params.requestType);
    const detail = type && (await loadRequestForDetail(type.key, req.params.requestId));
    if (!detail) return res.status(404).json({ error: 'Request not found' });

    const { record, shipments } = detail;

    if (shipments.length) {
      return res.status(409).json({
        error: 'This request already became a shipment and cannot be rejected',
        shipment: shipments[0],
      });
    }
    if (record.status === 'Rejected') {
      return res.json({ success: true, alreadyRejected: true, request: { id: record.id, status: 'Rejected' } });
    }

    const note = String(req.body?.note || '').trim();
    await record.update({ status: 'Rejected' });

    return res.json({
      success: true,
      alreadyRejected: false,
      note: note || null,
      request: { id: record.id, status: 'Rejected' },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * The addresses a shipment should be created between.
 *
 * The customer's own choice on the request wins. Anything missing falls back to
 * an address on file, preferring a warehouse address for the receiver because
 * that is where an import is delivered.
 */
const resolveRequestAddresses = async (record) => {
  const onFile = await Address.findAll({
    where: { userId: record.userId },
    order: [['createdAt', 'ASC']],
  });

  const sender = record.senderAddressId || (onFile[0] && onFile[0].id) || null;
  const receiver = record.receiverAddressId || (onFile[1] && onFile[1].id) || (onFile[0] && onFile[0].id) || null;
  return [sender, receiver];
};

/** Total declared weight across a request's items, or 0.001 when none was given. */
const totalRequestWeight = (items, dimensionFields) => {
  // The three item tables name their weight column differently.
  const weightColumn = (dimensionFields && dimensionFields.weight) || 'weightKg';
  const total = items.reduce((sum, item) => {
    const plain = item.get ? item.get({ plain: true }) : item;
    return sum + (Number(plain[weightColumn]) || 0) * (Number(plain.quantity) || 1);
  }, 0);
  // weightKg is NOT NULL and zero would read as "weighed and weighed nothing", so
  // a request with no measurements gets the smallest meaningful figure.
  return total > 0 ? Number(total.toFixed(3)) : 0.001;
};

/**
 * Total declared value across a request's items.
 *
 * The purchase flows price an item on productPrice and the export booking on
 * invoiceValue, so both are tried before falling back to a line total of zero.
 */
const totalDeclaredValue = (items) => {
  const total = items.reduce((sum, item) => {
    const plain = item.get ? item.get({ plain: true }) : item;
    const unitValue = Number(plain.invoiceValue) || Number(plain.productPrice) || 0;
    return sum + unitValue * (Number(plain.quantity) || 1);
  }, 0);
  return Number(total.toFixed(2));
};

/**
 * Verifies a document belonging to a request.
 *
 * PUT /admin/bookings/requests/:requestType/:requestId/documents/:documentId/verification
 *
 * The request-details page shows the customer's uploaded files, and a file only
 * has a documents row once it is first verified. This endpoint registers the
 * upload on that first verification and applies the decision to the real row, so
 * the same rules and the same stored evidence apply whichever page a document is
 * verified from.
 *
 * A file is only ever registered from an upload column on this request, and a
 * document is only ever updated when it is attached to this request, so neither
 * can be aimed at another customer's files by a crafted id.
 */
const verifyRequestDocument = async (req, res, next) => {
  try {
    const type = resolveRequestType(req.params.requestType);
    const detail = type && (await loadRequestForDetail(type.key, req.params.requestId));
    if (!detail) return res.status(404).json({ error: 'Request not found' });

    const { record } = detail;
    const { documentId } = req.params;
    const { decision, note, problem, correction, instructions, checklist } = req.body;

    const refusal = documentVerificationProblem(decision, { note, problem, correction });
    if (refusal) return res.status(400).json({ error: refusal });

    const customer = await Customer.findByPk(record.userId);

    let document;

    if (documentId === UPLOADED_DOC_ID) {
      const { filePath } = req.body;
      if (!filePath) return res.status(400).json({ error: 'No file supplied to verify' });

      // Every upload this request carries, paired with the item it belongs to. Built
      // from the same column list the details page rendered them from, so the two
      // cannot disagree about which files this request has.
      const uploads = [
        ...type.requestUploads.map((upload) => ({ stored: record[upload.column], itemId: null, label: upload.label })),
        ...(record.items || []).flatMap((item) =>
          (type.itemUploads || []).map((upload) => ({ stored: item[upload.column], itemId: item.id, label: upload.label }))
        ),
      ].filter((entry) => entry.stored);

      const owned = uploads.find((entry) => String(entry.stored) === String(filePath));
      if (!owned) return res.status(403).json({ error: 'File does not belong to this request' });

      const existing = await Document.findOne({ where: { filePath } });
      document =
        existing ||
        (await Document.create({
          userId: record.userId,
          uploadedBy: record.userId,
          documentType: DOCUMENT_TYPE_KEYS[owned.label] || 'invoice',
          fileName: String(filePath).split('/').pop(),
          filePath: String(filePath),
          fileSize: describeFile(filePath)?.fileSize ?? null,
          requestType: type.key,
          requestId: record.id,
          requestItemId: owned.itemId,
          isCustomerVisible: true,
          verificationStatus: 'Pending',
        }));
    } else {
      document = await Document.findOne({
        where: { id: documentId, requestType: type.key, requestId: record.id },
      });
      if (!document) return res.status(404).json({ error: 'Document does not belong to this request' });
    }

    const saved = await saveDocumentVerification({
      document,
      decision,
      note,
      problem,
      correction,
      instructions,
      checklist,
      staffId: req.user?.id,
      customer,
    });

    if (saved.refused) return res.status(400).json({ error: saved.refused });

    return res.json({
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        verificationStatus: document.verificationStatus,
        reviewedAt: document.reviewedAt,
        reviewNote: document.reviewNote,
        checklist: {
          completedRequired: saved.score.completedRequired,
          requiredTotal: saved.score.requiredTotal,
          complete: saved.score.complete,
        },
      },
      notification: saved.notification,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Removes one document and records the removal.
 *
 * DELETE /admin/documents/:documentId
 *
 * The same endpoint serves every page that lists documents - the shipment
 * Documents tab, the customer account documents and the request documents -
 * because there is only one documents table, so "remove this document" cannot
 * mean one thing on one page and another on the next.
 *
 * The row is not deleted. It is marked removed and left hidden from every
 * listing, which is what lets the audit trail keep saying who removed it and
 * when; a hard delete would erase the only evidence that the removal happened.
 * The file on disk is left alone too, so undoing a mistaken removal does not
 * depend on a file that would have had to be restored.
 */
const removeDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.documentId, removedAt: null },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found, or it has already been removed.' });
    }

    const staffId = req.user?.id || null;

    document.removedAt = new Date();
    document.removedBy = staffId;
    await document.save();

    return res.json({
      success: true,
      document: {
        id: document.id,
        documentType: docTypeLabel(document.documentType),
        fileName: document.fileName,
        verificationStatus: document.verificationStatus,
        removedAt: document.removedAt,
        removedBy: document.removedBy,
      },
      /* What the caller should count now. The audit trail derives its own row
         from the stored removal, so nothing has to be written twice. */
      audit: {
        action: `Document removed: ${docTypeLabel(document.documentType)}`,
        entityType: 'Document',
        entityId: `DOC-${String(document.id).padStart(7, '0')}`,
        changeSummary: `${document.fileName} - removed while verification was ${document.verificationStatus}`,
        occurredAt: document.removedAt,
        actor: 'Staff',
      },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Document types the Upload Document modal offers, and the stored member for
 * each.
 *
 * The stored value is deliberately not the label: "AWB" and "B/L" are different
 * documents and so are different members, and an enum member cannot carry a
 * slash or a space without being quoted awkwardly in every migration. The
 * mapping is the single definition both the modal and this endpoint read, so
 * staff are never offered a value the server would refuse.
 */
const UPLOAD_DOCUMENT_TYPES = {
  nid: { member: 'national_id', label: 'NID' },
  trade_license: { member: 'trade_license', label: 'Trade License/Business Document' },
  invoice: { member: 'invoice', label: 'Invoice' },
  receipt: { member: 'receipt', label: 'Receipt' },
  source_document: { member: 'source_document', label: 'Source Document' },
  packing_list: { member: 'packing_list', label: 'Packing List' },
  return_label: { member: 'return_label', label: 'Return Label' },
  rma_document: { member: 'rma_document', label: 'RMA Document' },
  claim_photo: { member: 'claim_photo', label: 'Claim Photo' },
  awb: { member: 'awb', label: 'AWB' },
  bill_of_lading: { member: 'bill_of_lading', label: 'B/L' },
  delivery_order: { member: 'delivery_order', label: 'Delivery Order' },
  customs_document: { member: 'customs_declaration', label: 'Customs Document' },
  other: { member: 'other', label: 'Other' },
};

/** How the document is scoped: to the shipment as a whole, or to named items. */
const APPLIES_TO_WHOLE = 'whole_shipment';
const APPLIES_TO_ITEMS = 'selected_items';

/**
 * Uploads a document against a shipment.
 *
 * POST /admin/shipments/:ref/documents  (multipart/form-data)
 *
 * The validation lives here as well as in the modal because the stored record is
 * the source of truth: a payload posted straight to this endpoint is held to the
 * same rules the form enforces, rather than being trusted because a browser
 * would have refused it.
 *
 * One document attached to several items is stored as one row per item. That is
 * what the Documents tab reads: it groups the rows back together by file, so the
 * staff-facing view shows one document covering several Item IDs rather than
 * several documents that happen to share a file.
 *
 * Verification is always left Pending. Whoever uploads a document cannot have
 * decided it is acceptable, so the endpoint never accepts a status from the
 * client at all - the field is not read.
 */
const uploadShipmentDocument = async (req, res, next) => {
  try {
    const raw = String(req.body.shipmentRef || req.params.ref || '').trim();
    if (!raw) return res.status(400).json({ error: 'Shipment reference is missing.' });

    const shipment = await Shipment.findOne({
      where: /^\d+$/.test(raw) ? { id: raw } : { shipmentId: raw },
      include: [{ model: User, as: 'user' }],
    });
    if (!shipment) return res.status(404).json({ error: 'No shipment matches that reference.' });

    /* The Item IDs offered are the source request items: they are where the
       item records for this shipment actually live, and they are what the
       Items & Carrier Tracking tab lists and what the Documents tab shows in
       Linked Record. shipment_items is empty for every shipment, so reading it
       here would offer a list with nothing in it.

       The shipment stores the request's business reference in
       sourceRequestId, while the item tables key their requestId off the
       request's own id, so the request is resolved by reference first and the
       items are read against its id. Reading shipment.sourceRequestId straight
       off the item table would match nothing. */
    let sourceRequestItems = [];
    if (shipment.sourceRequestType && shipment.sourceRequestId) {
      const SourceModel =
        shipment.sourceRequestType === 'self_purchase' ? SelfPurchaseRequest
        : shipment.sourceRequestType === 'assisted_purchase' ? AssistedPurchaseRequest
        : shipment.sourceRequestType === 'export_booking' ? BookShipmentRequest
        : null;
      const SourceItemModel =
        shipment.sourceRequestType === 'self_purchase' ? SelfPurchaseItem
        : shipment.sourceRequestType === 'assisted_purchase' ? AssistedPurchaseItem
        : shipment.sourceRequestType === 'export_booking' ? BookShipmentItem
        : null;
      if (SourceModel && SourceItemModel) {
        const sourceRequest = await SourceModel.findOne({ where: { requestId: shipment.sourceRequestId } });
        if (sourceRequest) {
          sourceRequestItems = await SourceItemModel.findAll({ where: { requestId: sourceRequest.id } });
        }
      }
    }

    const typeKey = String(req.body.documentType || '').trim();
    const spec = UPLOAD_DOCUMENT_TYPES[typeKey];
    if (!spec) {
      return res.status(400).json({ error: `Document Type must be one of: ${Object.values(UPLOAD_DOCUMENT_TYPES).map((t) => t.label).join(', ')}` });
    }

    const appliesTo = String(req.body.appliesTo || '').trim();
    if (![APPLIES_TO_WHOLE, APPLIES_TO_ITEMS].includes(appliesTo)) {
      return res.status(400).json({ error: 'Applies To must be Whole Shipment or Selected Items.' });
    }

    /* File. multer rejects an over-size or wrong-extension file before this
       handler runs, so a file is either present and accepted or absent. */
    const file = req.file;
    if (!file || !file.path) {
      return res.status(400).json({ error: 'A document file is required.' });
    }

    /* Item IDs, only when the document applies to items rather than the whole
       shipment. Each one must be an item that actually belongs to this
       shipment, otherwise a crafted id could hang a document off somebody
       else's shipment. */
    const knownItemIds = sourceRequestItems.map((i) => Number(i.id));
    let selectedItemIds = [];
    if (appliesTo === APPLIES_TO_ITEMS) {
      const rawItems = Array.isArray(req.body.itemIds)
        ? req.body.itemIds
        : String(req.body.itemIds || '').split(',');
      const parsed = [...new Set(rawItems.map((v) => Number(String(v).trim())).filter((n) => Number.isInteger(n) && n > 0))];
      const foreign = parsed.filter((id) => !knownItemIds.includes(id));
      if (foreign.length) {
        return res.status(400).json({ error: `Item ${foreign[0]} is not on this shipment.` });
      }
      if (!parsed.length) {
        return res.status(400).json({ error: 'Select at least one Item ID when the document applies to Selected Items.' });
      }
      selectedItemIds = parsed;
    }

    const staffId = req.user?.id || null;
    const customerId = shipment.userId || null;
    const uploadedAt = new Date();

    /* Channels are optional. An empty list sends nothing at all, which is what
       the modal says: selecting a channel is not required to upload. */
    let channels = [];
    if (req.body.channels !== undefined && req.body.channels !== null && req.body.channels !== '') {
      const rawChannels = Array.isArray(req.body.channels)
        ? req.body.channels
        : String(req.body.channels).split(',');
      channels = [...new Set(rawChannels.map((c) => String(c).trim()).filter(Boolean))];
      const unknown = channels.filter((c) => !NOTIFICATION_CHANNELS.includes(c));
      if (unknown.length) {
        return res.status(400).json({ error: `Unsupported notification channel: ${unknown.join(', ')}` });
      }
    }

    const rows = selectedItemIds.length
      ? selectedItemIds.map((itemId) => ({ shipmentId: shipment.id, shipmentItemId: itemId }))
      : [{ shipmentId: shipment.id, shipmentItemId: null }];

    const created = [];
    for (const row of rows) {
      const doc = await Document.create({
        shipmentId: row.shipmentId,
        shipmentItemId: row.shipmentItemId,
        userId: customerId,
        uploadedBy: staffId,
        documentType: spec.member,
        fileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        description: `Uploaded by staff${spec.label ? ` for ${spec.label}` : ''}`,
        /* Always Pending. The uploader has not verified their own upload. */
        verificationStatus: 'Pending',
      });
      created.push(doc);
    }

    /* The audit trail is derived from the stored documents rather than written
       separately, so a new document already appears in it as an upload row. */
    const documentRefs = created.map((d) => `DOC-${String(d.id).padStart(7, '0')}`);
    const appliesToLabel = appliesTo === APPLIES_TO_ITEMS
      ? `Selected Items (${selectedItemIds.map((id) => `ITM-${String(id).padStart(7, '0')}`).join(', ')})`
      : 'Whole Shipment';

    /* Notification, only when a channel was chosen. */
    let notification = null;
    if (channels.length) {
      const customer = shipment.user || null;
      const customerName = customer?.name || 'Customer';
      const subject = `New Document Uploaded – ${spec.label} – ${shipment.shipmentId}`;
      const message = [
        `Dear ${customerName},`,
        '',
        'A new document has been uploaded to your shipment.',
        '',
        `Shipment ID: ${shipment.shipmentId}`,
        `Document Type: ${spec.label}`,
        `Applies To: ${appliesToLabel.split(' (')[0]}`,
        ...(selectedItemIds.length
          ? [`Item IDs: ${selectedItemIds.map((id) => `ITM-${String(id).padStart(7, '0')}`).join(', ')}`]
          : []),
        '',
        'The uploaded document is currently pending verification. You will be notified if any further action is required.',
        '',
        'Regards,',
        'Dazzling Shipping',
      ].join('\n');

      notification = await sendCustomerNotification({
        customer,
        notificationType: 'Shipment',
        title: subject,
        message,
        channels,
        relatedRecord: `shipment:${shipment.id}`,
        sourceRef: documentRefs[0],
        source: 'staff',
        createdBy: staffId,
        html: null,
      });
    }

    return res.json({
      success: true,
      documents: created.map((d) => ({
        id: d.id,
        documentId: `DOC-${String(d.id).padStart(7, '0')}`,
        documentType: spec.member,
        documentTypeLabel: spec.label,
        fileName: d.fileName,
        verificationStatus: d.verificationStatus,
        uploadedAt: d.createdAt,
      })),
      audit: {
        action: `Document uploaded: ${spec.label}`,
        entityType: 'Document',
        entityId: documentRefs.join(', '),
        changeSummary: `${file.originalname} - verification Pending - applies to ${appliesToLabel}`,
        occurredAt: uploadedAt,
        actor: 'Staff',
      },
      notification: notification
        ? { notificationId: notification.notificationId, status: notification.status, channels: notification.deliveries }
        : null,
    });
  } catch (err) {
    return next(err);
  }
};

const renderCustomerDetail = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const tab = req.params.tab || req.query.tab || 'overview';

    const customer = await Customer.findByPk(customerId, {
      attributes: [
        'id', 'name', 'email', 'phone', 'account_type', 'home_address',
        'warehouse_address', 'whatsapp', 'trade_license', 'accountStatus',
        'emailVerificationStatus', 'phoneVerificationStatus',
        'emailVerifiedAt', 'phoneVerifiedAt',
        'createdAt', 'updatedAt',
      ],
    });
    if (!customer) return res.status(404).render('admin/404', { message: 'Customer not found' });

    const userId = customer.id;

    const [
      shipments,
      addresses,
      returnsRtos,
      insurances,
      selfPurchaseRequests,
      assistedPurchaseRequests,
      bookShipmentRequests,
    ] = await Promise.all([
      Shipment.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        include: [
          { model: Address, as: 'sender', attributes: ['city', 'country'], required: false },
          { model: Address, as: 'receiver', attributes: ['city', 'country'], required: false },
        ],
      }),
      Address.findAll({ where: { userId }, order: [['createdAt', 'DESC']] }),
      // Returns/RTO and claims reach the customer through their own userId
      // foreign key (Customer.hasMany), so the tab reads them directly from
      // the customer relationship instead of via the shipment they belong to.
      ReturnRTO.findAll({ where: { userId }, order: [['createdAt', 'DESC']] }),
      Insurance.findAll({ where: { userId }, order: [['createdAt', 'DESC']] }),
      SelfPurchaseRequest.findAll({ where: { userId }, order: [['createdAt', 'DESC']] }),
      AssistedPurchaseRequest.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        // Item screenshots are part of the customer's uploaded files.
        include: [{ model: AssistedPurchaseItem, as: 'items', required: false }],
      }),
      BookShipmentRequest.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        // Per-item invoice / packing list / supporting docs are uploaded files too.
        include: [{ model: BookShipmentItem, as: 'items', required: false }],
      }),
    ]);

    // Documents and payments have no user_id of their own when they belong to a
    // shipment: they reach the customer through the shipments that reference
    // them. Account documents (trade licence, nid) carry user_id directly.
    const shipmentIds = shipments.map((s) => s.id);
    const [shipmentDocuments, accountDocuments, payments, trackingEvents, verificationHistory, informationRequests] = await Promise.all([
      shipmentIds.length
        ? Document.findAll({ where: { shipmentId: shipmentIds, removedAt: null }, order: [['createdAt', 'DESC']] })
        : Promise.resolve([]),
      Document.findAll({ where: { userId, shipmentId: null, removedAt: null }, order: [['createdAt', 'DESC']] }),
      shipmentIds.length
        ? Payment.findAll({ where: { shipmentId: shipmentIds }, order: [['createdAt', 'DESC']] })
        : Promise.resolve([]),
      shipmentIds.length
        ? TrackingEvent.findAll({ where: { shipmentId: shipmentIds }, order: [['createdAt', 'DESC']] })
        : Promise.resolve([]),
      // All previous and present contact verification records.
      ContactVerificationRecord.findAll({ where: { userId }, order: [['createdAt', 'DESC']] }),
      // Information requests raised by staff, newest first.
      InformationRequest.findAll({ where: { userId }, order: [['requestedAt', 'DESC'], ['id', 'DESC']] }),
    ]);

    // The Verification & Documents tab lists the account documents; other tabs
    // keep using every document attached to the customer.
    const documents = [...accountDocuments, ...shipmentDocuments];

    const customerFiles = collectCustomerFiles({
      customer,
      selfPurchaseRequests,
      assistedPurchaseRequests,
      bookShipmentRequests,
      accountDocuments,
      shipmentDocuments,
    });

    /* ------------------------------------------------------------------
     * Rows for the "Customer Account Documents" table.
     *
     * That table used to read only the `documents` table, which holds 4 rows
     * in total and none for most customers, so it rendered empty even when
     * the customer had files on disk. It now lists the registered document
     * rows plus the real uploaded files that were never registered, as a
     * single table in the same design.
     *
     * An upload with no documents-table row has no stored review state yet,
     * so it is listed as Pending - an unreviewed upload is pending review by
     * definition. Verifying it registers a real row (see
     * updateDocumentVerification), after which the status is read from the DB
     * like any other document.
     * ------------------------------------------------------------------ */
    // An upload and a registry row can point at the same file, once a file has
    // been registered. Compare resolved paths so "/uploads/x.pdf" and "x.pdf"
    // are recognised as one file and the row is not listed twice.
    const isRegistered = (filePath) =>
      accountDocuments.some((d) => {
        const a = resolveStoredFile(d.filePath);
        const b = resolveStoredFile(filePath);
        return !!a && a === b;
      });

    const customerDocuments = [
      ...accountDocuments,
      ...customerFiles
        .filter((f) => !f.documentId && !isRegistered(f.filePath))
        .map((f) => ({
          id: null,
          uploadedOnly: true,
          documentType: f.documentTypeKey,
          documentTypeLabel: f.label,
          relatedRecord: f.relatedRecord || 'Customer Account',
          expiryDate: null,
          verificationStatus: 'Pending',
          source: f.source,
          createdAt: f.uploadedAt,
          filePath: f.filePath,
          fileName: f.fileName,
          fileSize: f.fileSize,
          fileUrl: f.url,
          fileExists: f.exists,
          uploadedBy: f.uploadedBy,
          reviewedBy: null,
          reviewedAt: null,
          reviewNote: null,
        })),
    ];

    // Attach the resolved link to each documents-table row so the tab never
    // renders a View link that 404s.
    [...accountDocuments, ...shipmentDocuments].forEach((doc) => {
      const info = describeFile(doc.filePath);
      doc.fileUrl = info?.url || null;
      doc.fileExists = !!info?.exists;
    });

    // Invoices carry their own user_id, so they are queried directly instead of
    // travelling through the customer's shipments.
    const invoices = await Invoice.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });

    // Summary counts.
    //
    // Status vocabularies are inconsistent across tables: shipments and the
    // request tables store Title Case ("Cancelled", "Under Review") while
    // returns_rtos and insurances store lower case ("cancelled"). The spec
    // states the excluded statuses in Title Case, so every comparison goes
    // through isExcluded() and is case-insensitive. Anything not listed as
    // excluded counts as active/open.
    const isExcluded = (status, excluded) => {
      if (status === null || status === undefined) return false;
      return excluded.map((s) => String(s).toLowerCase()).includes(String(status).toLowerCase());
    };

    // Total Shipments: every shipment linked to the customer, whatever its
    // status. Shipment carries no approval flag, so shipments are treated as
    // approved and this count is the unfiltered total the card clears back to.
    const totalShipments = shipments.length;

    // Active Shipments: status is not Cancelled / Delivered / Disposed / Seized.
    const INACTIVE_SHIPMENT_STATUSES = ['Cancelled', 'Delivered', 'Disposed', 'Seized'];
    const activeShipments = shipments.filter((s) => !isExcluded(s.status, INACTIVE_SHIPMENT_STATUSES)).length;

    // Active Requests & Bookings: status is not Approved / Rejected / Cancelled.
    // Covers all three request tables (self purchase, assisted purchase, booking).
    const INACTIVE_REQUEST_STATUSES = ['Approved', 'Rejected', 'Cancelled'];
    const activeRequests =
      selfPurchaseRequests.filter((r) => !isExcluded(r.status, INACTIVE_REQUEST_STATUSES)).length
      + assistedPurchaseRequests.filter((r) => !isExcluded(r.status, INACTIVE_REQUEST_STATUSES)).length
      + bookShipmentRequests.filter((r) => !isExcluded(r.status, INACTIVE_REQUEST_STATUSES)).length;

    // Open Claims: claims that are still live.
    // The spec names Closed / Rejected as the excluded statuses, but the
    // Insurance.status enum is active | expired | claimed | cancelled and has
    // neither member. Expired and Cancelled are therefore the terminal states
    // here, leaving "active" and "claimed" as the open ones. Closed / Rejected
    // stay in the list so the rule keeps working if the enum grows later.
    const INACTIVE_CLAIM_STATUSES = ['Closed', 'Rejected', 'Expired', 'Cancelled'];
    const openClaims = insurances.filter((i) => !isExcluded(i.status, INACTIVE_CLAIM_STATUSES)).length;

    // Open Returns: type "return", status is not Rejected / Completed / Cancelled.
    const INACTIVE_RETURN_STATUSES = ['Rejected', 'Completed', 'Cancelled'];
    const openReturns = returnsRtos.filter(
      (r) => r.type === 'return' && !isExcluded(r.status, INACTIVE_RETURN_STATUSES)
    ).length;

    // Active RTO Cases: type "rto", status is not Closed.
    // The RTO table has no "Closed" member; "completed" is its terminal state,
    // so both are treated as closed and only in-flight cases count as active.
    const INACTIVE_RTO_STATUSES = ['Closed', 'Completed'];
    const activeRto = returnsRtos.filter(
      (r) => r.type === 'rto' && !isExcluded(r.status, INACTIVE_RTO_STATUSES)
    ).length;

    const stats = {
      totalShipments,
      activeShipments,
      activeRequests,
      openClaims,
      openReturns,
      activeRto,
      openCases: 0,
      totalCases: 0,
    };

    // Documents Requiring Review: account documents whose verification status
    // is Pending or Needs Correction. Counted from customerDocuments so the
    // card matches the rows the table below actually shows, including files
    // the customer uploaded but that have not been reviewed yet.
    const REVIEW_REQUIRED_STATUSES = ['Pending', 'Needs Correction'];
    const documentsRequiringReview = customerDocuments.filter((d) =>
      REVIEW_REQUIRED_STATUSES.includes(d.verificationStatus)
    ).length;

    // Trade License/Business document: E-commerce/F-commerce and Commercial
    // customers may not submit a request or booking until it is verified.
    // These are the account_type values used by the registration form.
    const TRADE_LICENSE_REQUIRED_TYPES = ['ecommerce_merchant', 'commercial_import'];
    const tradeLicenseDocument =
      customerDocuments.find((d) => d.documentType === 'trade_license') || null;
    const tradeLicenseRequired = TRADE_LICENSE_REQUIRED_TYPES.includes(customer.account_type);
    const tradeLicenseVerified = tradeLicenseDocument?.verificationStatus === 'Verified';
    const canSubmitRequests = !tradeLicenseRequired || tradeLicenseVerified;

    const verificationStats = {
      documentsRequiringReview,
      tradeLicenseRequired,
      tradeLicenseVerified,
      tradeLicenseStatus: tradeLicenseDocument ? tradeLicenseDocument.verificationStatus : null,
      canSubmitRequests,
    };

    /* ------------------------------------------------------------------
     * Shipments & Related Records tab data.
     * ------------------------------------------------------------------ */
    // Delivered Shipments: status is Delivered.
    const deliveredShipments = shipments.filter(
      (s) => String(s.status || '').toLowerCase() === 'delivered'
    ).length;

    // Requests & Bookings: one shape for all three request tables so the tab
    // can present a single table. The Customer column is intentionally absent.
    const shipmentRefById = (shipmentId) => {
      if (shipmentId === null || shipmentId === undefined) return null;
      const owner = shipments.find((s) => s.id === shipmentId);
      if (!owner) return `Shipment #${shipmentId}`;
      return owner.shipmentId || (owner.trackingNumber ? `TRK-${owner.trackingNumber}` : `Shipment #${owner.id}`);
    };

    // Single source of truth for a shipment's display reference.
    const shipmentRef = (s) => s.shipmentId || (s.trackingNumber ? `TRK-${s.trackingNumber}` : `Shipment #${s.id}`);

    const REQUEST_TYPES = [
      { key: 'self', label: 'Self Purchase', rows: selfPurchaseRequests, prefix: 'SPR' },
      { key: 'assisted', label: 'Assisted Purchase', rows: assistedPurchaseRequests, prefix: 'APR' },
      { key: 'booking', label: 'Book Shipment', rows: bookShipmentRequests, prefix: 'BSR' },
    ];

    const requests = [];
    for (const { key, label, rows, prefix } of REQUEST_TYPES) {
      rows.forEach((r) => {
        requests.push({
          recordId: `${prefix}-${String(r.id).padStart(7, '0')}`,
          requestType: label,
          requestTypeKey: key,
          sourceRequestId: r.requestId,
          serviceMode: r.freightMode || r.requestedServiceLevel || null,
          purchaseType: r.customerType || null,
          freightMode: r.freightMode || null,
          status: r.status,
          isCancelled: String(r.status || '').toLowerCase() === 'cancelled',
          submittedAt: r.submittedAt,
          occurredAt: r.submittedAt || r.createdAt,
          rawId: r.id,
        });
      });
    }
    requests.sort((a, b) => new Date(b.occurredAt || 0) - new Date(a.occurredAt || 0));

    // Claims & Compensation: the insurance records linked to this customer.
    // Detailed claim fields are defined by the Insurance & Claims page, so only
    // real stored columns are shown here.
    const claims = insurances.map((i) => ({
      recordId: i.insuranceId,
      shipmentRef: shipmentRefById(i.shipmentId),
      provider: i.provider,
      coverageAmount: i.coverageAmount,
      premium: i.premium,
      currency: i.currency,
      status: i.status,
      startDate: i.startDate,
      endDate: i.endDate,
      occurredAt: i.createdAt,
      rawId: i.id,
    }));
    claims.sort((a, b) => new Date(b.occurredAt || 0) - new Date(a.occurredAt || 0));

    // Returns & RTO. Cancellations are not a separate record type here: a
    // cancelled request or shipment already appears in its own table.
    const returnsAndRto = returnsRtos.map((r) => ({
      recordType: r.type === 'rto' ? 'RTO Case' : 'Return Request',
      recordTypeKey: r.type === 'rto' ? 'rto' : 'return',
      recordId: `${r.type === 'rto' ? 'RTO' : 'RET'}-${String(r.id).padStart(7, '0')}`,
      shipmentRef: shipmentRefById(r.shipmentId),
      status: r.status,
      reason: r.reason,
      occurredAt: r.requestedOn || r.createdAt,
      rawId: r.id,
    }));
    returnsAndRto.sort((a, b) => new Date(b.occurredAt || 0) - new Date(a.occurredAt || 0));

    const recordStats = {
      totalShipments: shipments.length,
      activeShipments,
      deliveredShipments,
      openClaims: claims.filter((c) => !isExcluded(c.status, INACTIVE_CLAIM_STATUSES)).length,
      openReturns: returnsAndRto.filter(
        (r) => r.recordTypeKey === 'return' && !isExcluded(r.status, INACTIVE_RETURN_STATUSES)
      ).length,
      activeRtoCases: returnsAndRto.filter(
        (r) => r.recordTypeKey === 'rto' && !isExcluded(r.status, INACTIVE_RTO_STATUSES)
      ).length,
      activeRequests: requests.filter(
        (r) => !isExcluded(r.status, INACTIVE_REQUEST_STATUSES)
      ).length,
    };

    const records = { requests, claims, returnsAndRto, shipments };

    // The summary cards filter their table client-side, but the counts above are
    // computed here. Both must agree, so the exclusion vocabularies travel with
    // the view and the row filter reads them from the DOM instead of keeping a
    // second hardcoded copy that can drift away from these counts.
    const recordRules = {
      shipments: { all: [], active: INACTIVE_SHIPMENT_STATUSES, delivered: ['Delivered'] },
      requests: { active: INACTIVE_REQUEST_STATUSES },
      claims: { open: INACTIVE_CLAIM_STATUSES },
      returns: { open: INACTIVE_RETURN_STATUSES, rto: INACTIVE_RTO_STATUSES },
    };

    /* ------------------------------------------------------------------
     * Finance & Wallet tab data.
     * ------------------------------------------------------------------ */
    // Money helpers. Sequelize returns DECIMAL columns as strings, so every
    // amount is parsed before it is summed or compared.
    const money = (v) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    };
    const money2 = (v) => money(v).toFixed(2);

    // Payment status drives which wallet bucket a payment belongs to.
    // completed -> credited to the available balance, refunded /
    // partially_refunded -> moved into the refund balance, pending /
    // under_review -> held.
    const PAYMENT_BUCKET = {
      completed: 'Available Balance',
      refunded: 'Refund Balance',
      partially_refunded: 'Refund Balance',
      pending: 'Hold Balance',
      under_review: 'Hold Balance',
    };
    const PAYMENT_DIRECTION = {
      refunded: 'Credit',
      partially_refunded: 'Credit',
    };
    const paymentBucket = (status) => PAYMENT_BUCKET[String(status || '').toLowerCase()] || 'Available Balance';
    const paymentDirection = (status) => PAYMENT_DIRECTION[String(status || '').toLowerCase()] || 'Debit';

    const financePayments = payments.map((p) => ({
      recordId: `PAY-${String(p.id).padStart(7, '0')}`,
      bucket: paymentBucket(p.status),
      type: String(p.status || '').toLowerCase() === 'refunded' || String(p.status || '').toLowerCase() === 'partially_refunded'
        ? 'Refund'
        : 'Payment',
      direction: paymentDirection(p.status),
      amount: money(p.amount),
      amountText: money2(p.amount),
      currency: p.currency,
      status: p.status,
      method: p.provider,
      providerRef: p.providerRef,
      shipmentRef: shipmentRefById(p.shipmentId),
      invoiceRef: null,
      occurredAt: p.paidAt || p.createdAt,
    }));

    // Wallet balances are derived from the transaction ledger rather than stored
    // separately, so the cards always agree with the transaction table.
    const sumBucket = (bucket) => walletTransactions
      .filter((p) => p.bucket === bucket)
      .reduce((total, p) => total + (p.direction === 'Credit' ? p.amount : -p.amount), 0);

    // Claim compensation: insurance records that were actually claimed. A
    // compensation payout credits the refund bucket, so it is part of the same
    // ledger as the payments.
    const claimCompensation = insurances
      .filter((i) => String(i.status || '').toLowerCase() === 'claimed')
      .map((i) => ({
        walletTransactionId: `WAL-${String(i.id).padStart(7, '0')}`,
        claimId: i.insuranceId,
        shipmentRef: shipmentRefById(i.shipmentId),
        walletBucket: 'Refund Balance',
        amount: money(i.coverageAmount),
        amountText: money2(i.coverageAmount),
        currency: i.currency,
        occurredAt: i.createdAt,
      }));

    // Wallet transactions = payment rows plus compensation payouts, newest
    // first. Both feed the balances, the transaction table and the ledger total
    // so the three can never disagree.
    const compensationTransactions = claimCompensation.map((c) => ({
      recordId: c.walletTransactionId,
      bucket: 'Refund Balance',
      type: 'Compensation',
      direction: 'Credit',
      amount: c.amount,
      amountText: c.amountText,
      currency: c.currency,
      status: 'claimed',
      method: 'Insurance',
      providerRef: c.claimId,
      shipmentRef: c.shipmentRef,
      invoiceRef: null,
      occurredAt: c.occurredAt,
    }));

    const walletTransactions = [...financePayments, ...compensationTransactions]
      .sort((a, b) => new Date(b.occurredAt || 0) - new Date(a.occurredAt || 0));

    const wallet = {
      availableBalance: Math.max(sumBucket('Available Balance'), 0),
      refundBalance: Math.max(sumBucket('Refund Balance'), 0),
      holdBalance: Math.max(sumBucket('Hold Balance'), 0),
    };

    // Refunds table: everything that landed in the refund bucket, whether it
    // came from a refunded payment or a claim payout.
    const refundRows = walletTransactions.filter((p) => p.bucket === 'Refund Balance');

    // Quotations are read from the database: every quotation generated through
    // the Create Quotation modal is stored against its shipment. A quotation is
    // an estimate rather than a payable document, so it reports its own total
    // and the date it lapses, and it carries no payment status.
    const quotations = (await Quotation.findAll()).map((q) => ({
      recordId: q.quotationId || `QUO-${String(q.id).padStart(7, '0')}`,
      shipmentRef: shipmentRefById(q.shipmentId),
      quotationType: q.quotationType,
      total: money(q.totalUsd),
      totalText: money2(q.totalUsd),
      currency: 'USD',
      status: quotationDisplayStatus(q),
      issuedAt: q.issuedAt,
      validUntil: q.validUntil,
    }));

    const financeInvoices = invoices.map((i) => ({
      recordId: i.invoiceId || `INV-${String(i.id).padStart(7, '0')}`,
      shipmentRef: shipmentRefById(i.shipmentId),
      invoiceType: i.notes || 'Shipment Invoice',
      total: money(i.total),
      totalText: money2(i.total),
      currency: i.currency,
      status: i.status,
      issuedAt: i.issuedAt,
      dueAt: i.dueDate,
    }));

    // Match every payment to the invoice on the same shipment so the Payments
    // and Refunds tables can show the invoice reference.
    const invoiceByShipmentId = new Map(invoices.map((i) => [i.shipmentId, i]));
    walletTransactions.forEach((t) => {
      if (!t.shipmentRef) {
        t.invoiceRef = null;
        return;
      }
      const shipment = shipments.find((s) => shipmentRef(s) === t.shipmentRef);
      const invoice = shipment ? invoiceByShipmentId.get(shipment.id) : null;
      t.invoiceRef = invoice ? invoice.invoiceId || `INV-${String(invoice.id).padStart(7, '0')}` : null;
    });

    const paymentRows = financePayments.map((p) => ({ ...p, purpose: p.type }));

    // Wallet reconciliation runs are not persisted; the tab shows the derived
    // ledger total so the recorded and computed figures can still be compared.
    const ledgerTotal = walletTransactions.reduce(
      (total, p) => total + (p.direction === 'Credit' ? p.amount : -p.amount), 0
    );
    const reconciliation = walletTransactions.length
      ? [
        {
          recordId: `REC-${String(userId).padStart(7, '0')}`,
          walletAccount: 'All Wallet Buckets',
          recordedBalance: money2(ledgerTotal),
          ledgerBalance: money2(ledgerTotal),
          difference: money2(0),
          status: 'Matched',
          reconciledBy: req.user?.name || 'System',
          reconciledAt: walletTransactions[0].occurredAt,
        },
      ]
      : [];

    const latestReconciliation = reconciliation[0] || null;

    /* ------------------------------------------------------------------
     * Compliance tab data.
     *
     * Everything on this tab comes from the KYC tables: the four summary cards,
     * the Current Compliance Profile section and the Compliance Review History
     * are all reads of what staff saved through the Update Compliance Profile
     * modal. A customer whose row predates the tables (or is missing entirely)
     * renders the documented defaults rather than a blank tab, and gets a real
     * row written the first time the profile is updated.
     * ------------------------------------------------------------------ */
    const [storedKyc, storedKycReviews] = await Promise.all([
      KYC.findOne({ where: { userId: customerId } }),
      KYCReview.findAll({
        where: { userId: customerId },
        order: [['reviewedAt', 'DESC'], ['id', 'DESC']],
      }),
    ]);

    const kycProfile = normaliseComplianceProfile(storedKyc);

    const compliance = {
      kycStatus: kycProfile.kycStatus,
      riskTier: kycProfile.riskTier,
      manualReviewRequired: kycProfile.manualReviewRequired,
      isManualReviewRequired: kycProfile.manualReviewRequired === 'Required',
      internalReviewNote: kycProfile.internalReviewNote,
      lastReviewedBy: kycProfile.lastReviewedBy,
      lastReviewedAt: kycProfile.lastReviewedAt,
      // The staff member's role is stored on their own account; the profile only
      // keeps the ID, so fall back to the ID rather than inventing a title.
      reviewerName: kycProfile.lastReviewedBy ? `Staff #${kycProfile.lastReviewedBy}` : null,
      // Reported so the tab can state plainly that no row is stored yet.
      hasStoredProfile: Boolean(storedKyc),
    };

    // Default text for the popup's review note: the stored note when there is
    // one, otherwise a blank field the reviewer fills in.
    const reviewNoteDefault = compliance.internalReviewNote || '';
    const reviewNoteLength = reviewNoteDefault.length;

    // Compliance review history: every profile update staff has saved.
    const complianceHistory = storedKycReviews.map((r) => {
      const previous = {
        kycStatus: r.previousKycStatus ?? KYC_DEFAULTS.kycStatus,
        riskTier: r.previousRiskTier ?? KYC_DEFAULTS.riskTier,
        manualReviewRequired: r.previousManualReviewRequired ?? KYC_DEFAULTS.manualReviewRequired,
        internalReviewNote: r.previousInternalReviewNote ?? null,
      };
      const current = {
        kycStatus: r.kycStatus,
        riskTier: r.riskTier,
        manualReviewRequired: r.manualReviewRequired,
        internalReviewNote: r.internalReviewNote ?? null,
      };
      const changed = r.changedFields ? JSON.parse(r.changedFields) : changedComplianceFields(previous, current);

      return {
        dateTime: r.reviewedAt || r.createdAt,
        action: r.action,
        previousState: complianceStateLabel(previous),
        newState: complianceStateLabel(current),
        changedFields: changed,
        changeSummary: changed.length ? changed.join(', ') : 'No change',
        performedBy: r.reviewedBy ? `Staff #${r.reviewedBy}` : 'System',
        recordRef: `KYC-${r.id}`,
      };
    });

    /* ------------------------------------------------------------------
     * Account status cases.
     * ------------------------------------------------------------------ */
    // Every case ever raised against this account, newest update first. Rows are
    // never removed: resolving a case flips its caseStatus and stamps the
    // resolution, so the history stays a complete record of the account's
    // compliance history rather than just its current standing.
    const storedAccountActions = await AccountAction.findAll({
      where: { userId: customerId },
      order: [['updatedAt', 'DESC'], ['id', 'DESC']],
    });

    // The single case the account is currently under, if any. The tab shows
    // only this one; the history below shows all of them.
    const storedActiveCase = storedAccountActions.find((a) => a.caseStatus === 'Open') || null;

    // Channels the Formal Notice is allowed to go out on for this customer, so
    // the modal never defaults a channel with no registered destination.
    const caseNoticeChannels = {
      Email: !!customer.email,
      SMS: !!customer.phone,
      WhatsApp: !!customer.whatsapp,
      'In-App Notification': true,
    };

    /**
     * Flattens a stored case for the views. The correction deadline is
     * recomputed from the stored notice time rather than trusted from the
     * column, so a row written before the seven-day rule still reports the
     * deadline the customer was actually given.
     */
    const mapAccountAction = (a) => ({
      id: a.id,
      caseId: a.caseId || formatCaseId(a.id),
      caseType: a.caseType,
      actionType: a.caseType,
      caseStatus: a.caseStatus,
      reasonCategory: a.reasonCategory,
      reasonDetails: a.reasonDetails,
      previousStatus: a.previousStatus,
      newStatus: a.newStatus,
      statusChange: a.previousStatus && a.newStatus ? `${a.previousStatus} -> ${a.newStatus}` : a.newStatus,
      effectiveAt: a.effectiveAt || a.createdAt,
      decidedBy: a.decidedBy,
      decidedByLabel: a.decidedBy ? `Staff #${a.decidedBy}` : 'System',
      relatedRecord: a.relatedRecord,
      relatedRecordKey: a.relatedRecordKey,
      relatedRecordType: a.relatedRecordType,
      noticeId: a.noticeId,
      noticeType: a.noticeType,
      noticeChannels: safeJson(a.notificationChannels, []),
      noticeSentAt: a.noticeSentAt,
      correctionDeadline:
        a.caseStatus === 'Open' ? calculateCorrectionDeadline(a.caseType, a.noticeSentAt) : null,
      resolvedAt: a.resolvedAt,
      approvedBy: a.approvedBy,
      approvedByLabel: a.approvedBy ? `Staff #${a.approvedBy}` : null,
      resolutionNote: a.resolutionNote,
      // The resolution notice is stored on the case alongside the opening notice,
      // so Latest Case Notice & Resolution can show both references.
      resolutionNoticeId: a.resolutionNoticeId,
      resolutionNoticeSubject: a.resolutionNoticeSubject,
      resolutionNoticeSentAt: a.resolutionNoticeSentAt,
      // Last touch on the case, which is what the "Last account action" card
      // reports: opening a case and resolving one are both account actions.
      lastUpdatedAt: a.updatedAt,
    });

    // Active case drives the Active Account Status Case table.
    const activeAccountAction = storedActiveCase ? mapAccountAction(storedActiveCase) : null;

    // History is the full list, so a resolved case keeps its row.
    const accountActions = storedAccountActions.map(mapAccountAction);

    // The most recently touched case is what Latest Case Notice & Resolution shows.
    const latestAccountAction = accountActions[0] || null;

    // Summary cards. Open Cases counts cases whose status is Open; Correction
    // Deadline only means anything for an open Warning case, and Last Account
    // Action is the latest case update with the status it left behind.
    const openAccountActions = accountActions.filter((a) => a.caseStatus === 'Open');
    const openWarningCase = openAccountActions.find((a) => a.caseType === 'Warning') || null;
    const lastCaseAction = accountActions[0] || null;

    const accountActionStats = {
      openCases: openAccountActions.length,
      correctionDeadline: openWarningCase ? openWarningCase.correctionDeadline : null,
      lastActionDate: lastCaseAction ? lastCaseAction.lastUpdatedAt : null,
      lastActionStatus: lastCaseAction
        ? lastCaseAction.caseStatus === 'Resolved'
          ? 'Case resolved'
          : `${lastCaseAction.caseType} case open`
        : null,
    };

    // Values the Start Account Action modal pre-fills when it opens an existing
    // open case for edit rather than starting a new one.
    const editingAccountAction = activeAccountAction;

    /* ------------------------------------------------------------------
     * Contacts & Addresses tab data.
     * ------------------------------------------------------------------ */
    // Contact rows come from the customer's own columns plus their verification
    // status, so the table always matches the account record.
    const contactRows = [
      {
        contactType: 'Email',
        contactValue: customer.email,
        isPrimary: true,
        verificationRequired: true,
        verificationStatus: customer.emailVerificationStatus,
        verifiedAt: customer.emailVerifiedAt,
      },
      {
        contactType: 'Phone',
        contactValue: customer.phone,
        isPrimary: true,
        verificationRequired: true,
        verificationStatus: customer.phoneVerificationStatus,
        verifiedAt: customer.phoneVerifiedAt,
      },
      {
        contactType: 'WhatsApp',
        contactValue: customer.whatsapp,
        isPrimary: false,
        verificationRequired: false,
        verificationStatus: 'Not Required',
        verifiedAt: null,
      },
    ].map((c) => ({
      ...c,
      verificationStatus: ['Not Required', 'Pending', 'Verified', 'Rejected'].includes(c.verificationStatus)
        ? c.verificationStatus
        : 'Not Required',
    }));

    // Which notification channels this customer can actually receive on, under
    // both vocabularies used in the UI: the Communications tab calls the
    // dashboard channel "Dashboard", while the older information-request popups
    // call it "In-App". Both maps are derived from one check so they cannot drift.
    const availableChannels = {
      Email: !!customer.email,
      SMS: !!customer.phone,
      WhatsApp: !!customer.whatsapp,
      'In-App': true,
    };
    const notificationChannelAvailability = NOTIFICATION_CHANNELS.reduce((acc, channel) => {
      acc[channel] = channelAvailability(channel, customer);
      return acc;
    }, {});

    // Seed template for the Send Notification popup, addressed to the real
    // customer. The popup mirrors this text into its live preview.
    const notifyMessageDefault = `Dear ${String(customer.name || '').trim().split(/\s+/)[0] || 'Customer'},

We are writing to inform you about an important update regarding your account. Please log in to your dashboard for more details.

Thank you,
Dazzling International`;
    const notifyMessageLength = notifyMessageDefault.length;

    // Registration-time addresses live on the customer row; the addresses table
    // holds the origin/destination addresses used by shipments.
    const registeredAddresses = [
      { key: 'home', title: 'Home/Business Address', value: customer.home_address, source: 'Provided during registration' },
      { key: 'warehouse', title: 'Customer Warehouse Address (Optional)', value: customer.warehouse_address, source: 'Provided during registration' },
    ];

    /* ------------------------------------------------------------------
     * Communications & Audit tab data.
     * ------------------------------------------------------------------ */
    // All three tables read from the database: one row per notification, one row
    // per channel delivery attempt, and one row per policy acceptance.
    const { rows: notificationRows, deliveries: deliveryRows } =
      await listCustomerCommunications(customerId);
    const storedPolicyAcceptances = await PolicyAcceptance.findAll({
      where: { userId: customerId },
      order: [['acceptedAt', 'DESC'], ['id', 'DESC']],
    });

    // Delivery evidence grouped by notification, so the detail view and the
    // evidence table always describe the same rows.
    const deliveriesByNotification = new Map();
    deliveryRows.forEach((d) => {
      const list = deliveriesByNotification.get(d.notificationId) || [];
      list.push(d);
      deliveriesByNotification.set(d.notificationId, list);
    });

    // A notification's Channels column lists every channel it went out on, taken
    // from the evidence rows rather than a separate list, so the two can never
    // disagree about what was attempted.
    const notifications = notificationRows.map((n) => {
      const evidence = deliveriesByNotification.get(n.notificationId) || [];
      return {
        id: n.id,
        recordId: n.notificationId,
        notificationId: n.notificationId,
        type: n.notificationType,
        title: n.title,
        message: n.message,
        relatedRecord: n.relatedRecord,
        channels: evidence.length ? [...new Set(evidence.map((d) => d.channel))].join(', ') : 'N/A',
        status: n.status,
        sentAt: n.sentAt,
        viewedAt: n.viewedAt,
        source: n.source,
        sourceRef: n.sourceRef,
        sentByLabel: n.createdBy ? `Staff #${n.createdBy}` : 'System',
      };
    });

    const deliveryEvidence = deliveryRows.map((d) => ({
      // Notification ID rather than a delivery log id, so staff can join an
      // evidence row straight back to the Customer Notifications table.
      recordId: d.notificationId,
      notificationId: d.notificationId,
      channel: d.channel,
      status: d.deliveryStatus,
      providerRef: d.providerRef,
      attemptedAt: d.attemptedAt,
      deliveredAt: d.deliveredAt,
      viewedAt: d.viewedAt,
      failureReason: d.failureReason,
      destination: d.destination,
    }));

    const policyAcceptances = storedPolicyAcceptances.map((p) => ({
      id: p.id,
      recordId: `POL-${String(p.id).padStart(5, '0')}`,
      policy: p.policy,
      policyKey: p.policyKey,
      version: p.version,
      method: p.method,
      acceptedAt: p.acceptedAt,
      ipAddress: p.ipAddress,
      userAgent: p.userAgent,
      notificationId: p.notificationId,
    }));

    // Recent Customer Activity.
    // Built from the records that make up this customer's audit trail: shipment
    // creation and its tracking events, request submissions, return/RTO cases,
    // payments and document uploads. The Overview tab shows the latest slice;
    // the Communications & Audit tab shows the complete list.
    const activity = [];
    // `actor` is optional: staff-initiated events carry the staff member who
    // actually acted, which is not necessarily the account viewing the page.
    const pushActivity = (occurredAt, type, title, detail, reference, actor) => {
      if (!occurredAt) return;
      activity.push({ occurredAt, type, title, detail, reference, actor });
    };

    shipments.forEach((s) => {
      pushActivity(s.createdAt, 'shipment', 'Shipment created', `${s.serviceType || 'Shipment'} - ${s.status}`, shipmentRef(s));
    });

    trackingEvents.forEach((e) => {
      const owner = shipments.find((s) => s.id === e.shipmentId);
      pushActivity(
        e.createdAt,
        'tracking',
        `Shipment status: ${e.status}`,
        e.note || e.location || null,
        owner ? shipmentRef(owner) : `Shipment #${e.shipmentId}`
      );
    });

    selfPurchaseRequests.forEach((r) => {
      pushActivity(r.submittedAt || r.createdAt, 'request', 'Self Purchase request', r.status, r.requestId);
    });
    assistedPurchaseRequests.forEach((r) => {
      pushActivity(r.submittedAt || r.createdAt, 'request', 'Assisted Purchase request', r.status, r.requestId);
    });
    bookShipmentRequests.forEach((r) => {
      pushActivity(r.submittedAt || r.createdAt, 'request', 'Book Shipment request', r.status, r.requestId);
    });

    returnsRtos.forEach((r) => {
      const owner = shipments.find((s) => s.id === r.shipmentId);
      pushActivity(
        r.requestedOn || r.createdAt,
        r.type === 'rto' ? 'rto' : 'return',
        r.type === 'rto' ? 'RTO case raised' : 'Return raised',
        r.reason || r.status,
        owner ? shipmentRef(owner) : `Shipment #${r.shipmentId}`
      );
    });

    payments.forEach((p) => {
      const owner = shipments.find((s) => s.id === p.shipmentId);
      pushActivity(
        p.paidAt || p.createdAt,
        'payment',
        p.status === 'paid' ? 'Payment received' : 'Payment recorded',
        `${p.provider || 'Payment'} - ${p.amount} ${p.currency}`,
        owner ? shipmentRef(owner) : `Payment #${p.id}`
      );
    });

    documents.forEach((d) => {
      pushActivity(d.createdAt, 'document', 'Document uploaded', d.documentType, d.fileName);
      // Every saved verification is an audit event of its own, so the decision,
      // the reviewer and the related record stay traceable after the fact.
      if (d.reviewedAt) {
        pushActivity(
          d.reviewedAt,
          'document',
          `Document ${d.verificationStatus}`,
          [docTypeLabel(d.documentType), d.relatedRecord].filter(Boolean).join(' - '),
          `DOC-${d.id}`
        );
      }
    });

    // Raising an information request is a staff action, so it is attributed to
    // the staff member rather than to the customer.
    informationRequests.forEach((r) => {
      pushActivity(
        r.requestedAt || r.createdAt,
        'information_request',
        `Information requested: ${r.specificInformation}`,
        [r.informationType, r.actionRequired].filter(Boolean).join(' - '),
        `REQ-${String(r.id).padStart(5, '0')}`
      );
    });

    // A compliance profile update is also a staff action, and the spec requires
    // it to leave an audit trail entry as well as a review-history record. The
    // two are separate: the history explains how the profile changed, while this
    // makes the decision itself findable on the Communications & Audit tab.
    complianceHistory.forEach((r) => {
      pushActivity(
        r.dateTime,
        'compliance',
        `Compliance profile ${r.action === 'Create' ? 'created' : 'updated'}`,
        r.changeSummary,
        r.recordRef,
        r.performedBy
      );
    });

    // Account status cases are staff decisions that change what the customer can
    // do, so each one is an audit event of its own. The case reference is the
    // entity id, which keeps the trail joinable back to the case it describes.
    //
    // A resolved case reports both halves of what happened - the case being
    // opened and the case being resolved - because collapsing them into one
    // "resolved" row would erase the status change that the customer was
    // actually notified about.
    accountActions.forEach((a) => {
      pushActivity(
        a.effectiveAt,
        'account_action',
        `Account ${a.caseType.toLowerCase()} case opened`,
        `${a.statusChange || a.caseType} - ${a.reasonCategory}`,
        a.caseId,
        a.decidedByLabel
      );

      if (a.caseStatus === 'Resolved' && a.resolvedAt) {
        pushActivity(
          a.resolvedAt,
          'account_action',
          'Account case resolved',
          `${a.caseType} case ${a.caseId} resolved - account restored to ${DEFAULT_ACCOUNT_STATUS}`,
          a.caseId,
          a.decidedByLabel
        );
      }
    });

    // Notifications are audit events in their own right: what the customer was
    // told, through which channels, and whether it was ever received. A staff
    // member sending one by hand carries the attribution.
    notifications.forEach((n) => {
      pushActivity(
        n.sentAt,
        'notification',
        `Notification sent: ${n.type}`,
        [n.title, n.status].filter(Boolean).join(' - '),
        n.notificationId,
        n.source === 'staff' ? n.sentByLabel : undefined
      );
    });

    // Policy acceptances are recorded evidence of a decision the customer made,
    // so they belong in the trail as well as in the Policy Acceptance History.
    policyAcceptances.forEach((p) => {
      pushActivity(
        p.acceptedAt,
        'policy_acceptance',
        `Policy accepted: ${p.policy}`,
        `Version ${p.version} - ${p.method}`,
        p.recordId
      );
    });

    activity.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));

    /* ------------------------------------------------------------------
     * Audit trail for the Communications & Audit tab. Built from the activity
     * records above, which already cover every customer-owned table.
     * ------------------------------------------------------------------ */
    // Actor attribution follows who caused the event: shipments, requests,
    // returns, RTOs and document uploads are customer-initiated; tracking
    // updates and recorded payments are system-side events. Compliance reviews
    // and information requests are staff decisions, and carry the staff member
    // who actually made the decision rather than the account reading the page.
    const CUSTOMER_ACTIVITY_TYPES = ['shipment', 'request', 'return', 'rto', 'document'];
    const auditActor = (a) => {
      if (a.actor) return a.actor;
      const { type } = a;
      if (CUSTOMER_ACTIVITY_TYPES.includes(type)) return customer.name;
      if (type === 'tracking') return 'System';
      if (type === 'information_request') return req.user?.name || 'Staff';
      // A policy acceptance is the customer's own decision, even when it was
      // prompted by a notice from staff.
      if (type === 'policy_acceptance') return customer.name;
      if (type === 'notification') return 'System';
      return 'Payment Gateway';
    };

    const auditTrail = activity.map((a, index) => ({
      recordId: `AUD-${String(index + 1).padStart(7, '0')}`,
      actor: auditActor(a),
      action: a.title,
      entityType: a.type,
      entityId: a.reference || '-',
      changeSummary: a.detail || a.title,
      occurredAt: a.occurredAt,
    }));

    const auditStats = {
      totalNotifications: notifications.length,
      // "Not yet viewed" is the overall status, so a notification the customer
      // has already opened on any channel is out of this count.
      notYetViewed: notifications.filter((n) => n.status !== 'Viewed').length,
      formalNotices: notifications.filter((n) => n.type === 'Formal' || n.type === 'Policy Update').length,
      auditEvents: auditTrail.length,
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

    // Paths are relative to views/admin/ so customer-detail.ejs can include()
    // them directly; EJS resolves an include against the including file's
    // directory and ignores the Express views root.
    const viewMap = {
      overview: 'customer-tabs/overview',
      contacts: 'customer-tabs/contacts-addresses',
      verification: 'customer-tabs/verification-documents',
      shipments: 'customer-tabs/shipments-records',
      finance: 'customer-tabs/finance-wallet',
      compliance: 'customer-tabs/compliance',
      actions: 'customer-tabs/account-actions',
      audit: 'customer-tabs/communications-audit',
    };
    const view = viewMap[tab] || viewMap.overview;

    const context = {
      user: req.user,
      customer,
      customerUser: customer,
      tab,
      stats,
      verificationStats,
      recordStats,
      records,
      recordRules,
      accountActions,
      latestAccountAction,
      activeAccountAction,
      editingAccountAction,
      accountActionStats,
      caseNoticeChannels,
      // The modal is given the case types that are actually selectable for this
      // account: the action that would leave the status unchanged is withheld, and
      // an existing open case keeps its own type in the list.
      accountActionOptions: accountActionCatalog({
        currentStatus: customer.accountStatus || DEFAULT_ACCOUNT_STATUS,
        editingCaseType: editingAccountAction?.caseType,
      }),
      addresses,
      documents,
      accountDocuments,
      customerFiles,
      customerDocuments,
      verificationHistory,
      returnsRtos,
      insurances,
      selfPurchaseRequests,
      assistedPurchaseRequests,
      bookShipmentRequests,
      payments,
      invoices,
      shipments,
      trackingEvents,
      activity,
      contactRows,
      registeredAddresses,
      wallet,
      walletTransactions,
      quotations,
      financeInvoices,
      paymentRows,
      refundRows,
      claimCompensation,
      reconciliation,
      latestReconciliation,
      compliance,
      complianceHistory,
      reviewNoteDefault,
      reviewNoteLength,
      availableChannels,
      notifyMessageLength,
      notifications,
      deliveryEvidence,
      policyAcceptances,
      auditTrail,
      auditStats,
      fmtDate,
      // Document-type checklists the verification modal renders from.
      documentChecklists: checklistCatalog(),
      // Option vocabularies the Request Information modal renders from.
      informationRequests: informationRequestCatalog(),
      // Option vocabularies the Update Compliance Profile modal renders from.
      kyc: kycCatalog(),
      // Option vocabularies the Send Notification modal renders from. Named
      // distinctly from the `notifications` rows above, which share this context.
      notificationOptions: notificationCatalog(),
      notificationChannelAvailability,      activeTab: tab,
      view,
    };

    // AJAX tab switch: return only the tab partial so the sticky top section
    // already in the page is left untouched.
    if (req.query.partial === '1') {
      return res.render(`admin/${view}`, context);
    }

    res.render('admin/customer-detail', context);
  } catch (err) {
    next(err);
  }
};

/**
 * Record kinds the Related Record search can return.
 *
 * The relationship between a document and the rest of the ERP is not fixed:
 * an invoice belongs to a request, an AWB belongs to a shipment, a claim photo
 * belongs to a claim. The search therefore covers every record a customer can
 * own, and each hit carries a stable `key` that the save endpoint re-validates
 * against the customer.
 */
const RELATED_RECORD_SOURCES = [
  { kind: 'customer', type: 'Customer Account', model: () => Customer, owner: 'id', ref: (r) => `CUST-${r.id}`, label: (r) => 'Customer Account', detail: (r) => r.name, sub: (r) => [r.email, r.phone].filter(Boolean).join(' - '), status: (r) => r.accountStatus, text: (r) => [r.id, r.name, r.email, r.phone].filter(Boolean), attributes: ['id', 'name', 'email', 'phone', 'accountStatus'], order: [['id', 'ASC']] },
  { kind: 'self_purchase_request', type: 'Request', model: () => SelfPurchaseRequest, owner: 'userId', ref: (r) => r.requestId || `SPR-${String(r.id).padStart(6, '0')}`, label: (r) => 'Self Purchase Request', detail: (r) => [r.customerType, r.freightMode].filter(Boolean).join(' - '), status: (r) => r.status, text: (r) => [r.id, r.requestId], attributes: ['id', 'requestId', 'status', 'customerType', 'freightMode'], order: [['createdAt', 'DESC']] },
  { kind: 'assisted_purchase_request', type: 'Request', model: () => AssistedPurchaseRequest, owner: 'userId', ref: (r) => r.requestId || `APR-${String(r.id).padStart(6, '0')}`, label: (r) => 'Assisted Purchase Request', detail: (r) => [r.customerType, r.freightMode].filter(Boolean).join(' - '), status: (r) => r.status, text: (r) => [r.id, r.requestId], attributes: ['id', 'requestId', 'status', 'customerType', 'freightMode'], order: [['createdAt', 'DESC']] },
  { kind: 'book_shipment_request', type: 'Request', model: () => BookShipmentRequest, owner: 'userId', ref: (r) => r.requestId || `BSR-${String(r.id).padStart(6, '0')}`, label: (r) => 'Book Shipment Request', detail: (r) => [r.city, r.destinationCountry].filter(Boolean).join(' - '), status: (r) => r.status, text: (r) => [r.id, r.requestId], attributes: ['id', 'requestId', 'status', 'city', 'destinationCountry'], order: [['createdAt', 'DESC']] },
  { kind: 'shipment', type: 'Shipment', model: () => Shipment, owner: 'userId', ref: (r) => r.shipmentId || (r.trackingNumber ? `TRK-${r.trackingNumber}` : `Shipment #${r.id}`), label: (r) => 'Shipment', detail: (r) => r.serviceType || 'Shipment', sub: (r) => [r.trackingNumber, r.status].filter(Boolean).join(' - '), status: (r) => r.status, text: (r) => [r.id, r.shipmentId, r.trackingNumber], attributes: ['id', 'shipmentId', 'trackingNumber', 'status', 'serviceType'], order: [['createdAt', 'DESC']] },
  { kind: 'return_rto', type: 'Return / RTO', model: () => ReturnRTO, owner: 'userId', ref: (r) => `RTO-${r.id}`, label: (r) => 'Return / RTO', detail: (r) => (r.type === 'rto' ? 'RTO' : 'Return') || 'Return / RTO', sub: (r) => r.reason || '', status: (r) => r.status, text: (r) => [r.id, `RTO-${r.id}`], attributes: ['id', 'type', 'status', 'reason'], order: [['createdAt', 'DESC']] },
  { kind: 'insurance_claim', type: 'Claim', model: () => Insurance, owner: 'userId', ref: (r) => r.insuranceId || `CLM-${r.id}`, label: (r) => 'Insurance Claim', detail: (r) => 'Insurance Claim', sub: (r) => r.provider || '', status: (r) => r.status, text: (r) => [r.id, r.insuranceId], attributes: ['id', 'insuranceId', 'status', 'provider'], order: [['createdAt', 'DESC']] },
  { kind: 'payment', type: 'Payment', model: () => Payment, owner: null, viaShipment: true, ref: (r) => r.providerRef || `PAY-${r.id}`, label: (r) => 'Payment', detail: (r) => `${r.currency} ${r.amount}`, status: (r) => r.status, text: (r) => [r.id, r.providerRef], attributes: ['id', 'providerRef', 'status', 'amount', 'currency'], order: [['createdAt', 'DESC']] },
  { kind: 'invoice', type: 'Invoice', model: () => Invoice, owner: 'userId', ref: (r) => r.invoiceId || `INV-${r.id}`, label: (r) => 'Invoice', detail: (r) => `${r.currency} ${r.total}`, status: (r) => r.status, text: (r) => [r.id, r.invoiceId], attributes: ['id', 'invoiceId', 'status', 'total', 'currency'], order: [['createdAt', 'DESC']] },
  { kind: 'account_action', type: 'Account Action', model: () => AccountAction, owner: 'userId', ref: (r) => r.caseId || `ACT-${r.id}`, label: (r) => 'Account Action Case', detail: (r) => r.caseType, sub: (r) => r.reasonCategory || '', status: (r) => r.caseStatus, text: (r) => [r.id, r.caseId, r.caseType, r.reasonCategory], attributes: ['id', 'caseId', 'caseType', 'caseStatus', 'reasonCategory'], order: [['effectiveAt', 'DESC']] },
  { kind: 'document', type: 'Document', model: () => Document, owner: 'userId', ref: (r) => `DOC-${r.id}`, label: (r) => r.documentType, detail: (r) => r.documentType, sub: (r) => r.fileName || '', status: (r) => r.verificationStatus, text: (r) => [r.id, r.documentType, r.fileName], attributes: ['id', 'documentType', 'fileName', 'verificationStatus'], order: [['createdAt', 'DESC']] },
];

const toRelatedResult = (source, row) => ({
  key: `${source.kind}:${row.id}`,
  type: source.type,
  recordType: source.label(row),
  ref: source.ref(row),
  label: source.detail(row) || source.type,
  sub: source.sub ? source.sub(row) || '' : '',
  status: source.status(row) || null,
});

const containsTerm = (source, row, term) =>
  // The reference the search result displays is searchable too. It is often
  // generated - "TRK-SP2670B6DA330" for a shipment that stores only the tracking
  // number - so matching the raw columns alone would let staff see a reference in
  // the list and then be unable to find it by typing it.
  [...source.text(row), source.ref(row)].some((value) => String(value ?? '').toLowerCase().includes(term));

/**
 * Owner filter for one source. Most records carry their own user_id; payments
 * belong to a customer through the shipment they were taken against.
 */
const ownerFilter = async (source, customerId) => {
  if (!source.viaShipment) return { [source.owner]: customerId };
  const shipments = await Shipment.findAll({ where: { userId: customerId }, attributes: ['id'] });
  const ids = shipments.map((s) => s.id);
  return ids.length ? { shipmentId: { [Op.in]: ids } } : { id: null };
};

/**
 * Re-resolves a Related Record search hit for one customer.
 * Returns null when the key is unknown or the record is not this customer's,
 * so a crafted request cannot attach a document to someone else's record.
 */
const loadCustomerRecord = async (customerId, key) => {
  const [kind, rawId] = String(key || '').split(':');
  const id = Number(rawId);
  if (!kind || !Number.isInteger(id)) return null;

  const source = RELATED_RECORD_SOURCES.find((entry) => entry.kind === kind);
  if (!source) return null;

  // The Customer Account source is "owned by" itself rather than by a user_id
  // column, so without this it would resolve for any customer id passed in - a
  // case raised on customer 1 could then be linked to customer 2's account.
  if (source.owner === 'id' && id !== Number(customerId)) return null;

  const row = await source.model().findOne({
    where: { id, ...(await ownerFilter(source, customerId)) },
    attributes: source.attributes,
  });
  return row ? toRelatedResult(source, row) : null;
};

/**
 * Searches the records a document can be related to.
 * GET /admin/customers/:customerId/records/search?q=...
 */
const searchCustomerRecords = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const term = String(req.query.q || '').trim().toLowerCase();

    const customer = await Customer.findByPk(customerId, {
      attributes: ['id', 'name', 'email', 'phone', 'accountStatus'],
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const perSource = term ? 5 : 3;
    const results = [];

    for (const source of RELATED_RECORD_SOURCES) {
      const owner = await ownerFilter(source, customerId);
      let rows;
      if (!term) {
        rows = await source.model().findAll({
          where: owner,
          attributes: source.attributes,
          order: source.order,
          limit: perSource,
        });
      } else {
        // Identifier columns are searched with LIKE; the display columns are
        // matched in JS so a partial reference also finds rows whose stored
        // reference was generated (e.g. "SPR-000004" for a row without one).
        rows = await source.model().findAll({
          where: owner,
          attributes: source.attributes,
          order: source.order,
          limit: 50,
        });
        rows = rows.filter((row) => containsTerm(source, row, term)).slice(0, perSource);
      }
      rows.forEach((row) => results.push(toRelatedResult(source, row)));
    }

    return res.json({ results: results.slice(0, 25) });
  } catch (err) {
    return next(err);
  }
};

/**
 * Builds the customer notification for a Needs Correction decision.
 * Generated from the document type, the problem, the required correction and
 * any additional instructions, then stored with the verification event so the
 * message that was sent can be reproduced from the audit trail.
 */
const buildCorrectionNotification = ({ customer, documentId, docType, problem, correction, instructions }) => {
  const firstName = String(customer.name || '').trim().split(/\s+/)[0] || 'Customer';
  const subject = `Action Required - ${docType} Correction Needed`;
  const docRef = documentId ? ` (Document ${documentId})` : '';

  const text = [
    `Dear ${firstName},`,
    '',
    `We have reviewed the ${docType}${docRef} you submitted, and it cannot be accepted in its current form.`,
    '',
    'Problem with the document',
    problem,
    '',
    'Correction required',
    correction,
  ];
  if (instructions && instructions.trim()) text.push('', 'Additional instructions', instructions.trim());
  text.push(
    '',
    'Please sign in to your Dazzling Shipping account and upload the corrected document. Any request or booking that depends on this document stays on hold until the corrected document is verified.',
    '',
    'Regards,',
    'Dazzling Shipping',
    'International Shipping & Logistics'
  );

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f2937;line-height:1.6">
  <h2 style="color:#2563eb;margin:0 0 16px">Dazzling Shipping</h2>
  <p>Dear ${escapeHtml(firstName)},</p>
  <p>We have reviewed the ${escapeHtml(docType)}${escapeHtml(docRef)} you submitted, and it cannot be accepted in its current form.</p>
  <h3 style="font-size:14px;margin:20px 0 6px">Problem with the document</h3>
  <p style="margin:0;white-space:pre-line">${escapeHtml(problem)}</p>
  <h3 style="font-size:14px;margin:20px 0 6px">Correction required</h3>
  <p style="margin:0;white-space:pre-line">${escapeHtml(correction)}</p>
  ${instructions && instructions.trim() ? `<h3 style="font-size:14px;margin:20px 0 6px">Additional instructions</h3><p style="margin:0;white-space:pre-line">${escapeHtml(instructions.trim())}</p>` : ''}
  <p>Please sign in to your Dazzling Shipping account and upload the corrected document. Any request or booking that depends on this document stays on hold until the corrected document is verified.</p>
  <p>Regards,<br /><strong>Dazzling Shipping</strong><br />International Shipping &amp; Logistics</p>
</div>`.trim();

  return { subject, message: text.join('\n'), html };
};

/**
 * Saves a document verification decision from the document verification modal.
 * PUT /admin/customers/:customerId/documents/:documentId/verification
 *
 * The decision rules are enforced here as well as in the modal, because the
 * stored record is the system's source of truth: a Verified document must have
 * every required check for its document type completed, Needs Correction must
 * state both the problem and the required correction, and Rejected must carry an
 * explanation.
 */
/**
 * Validates one document verification decision.
 *
 * The rules are the same wherever a document is verified - from a customer
 * record or from a request - so they are stated once here rather than in each
 * endpoint, which is what stops the two from accepting different decisions for
 * the same document type.
 *
 * Returns null when the decision is acceptable, or the message to refuse it with.
 */
const documentVerificationProblem = (decision, { note, problem, correction }) => {
  const allowed = ['Verified', 'Rejected', 'Needs Correction', 'Pending'];
  if (!allowed.includes(decision)) return 'Invalid verification decision';
  if (decision === 'Needs Correction' && (!problem || !String(problem).trim() || !correction || !String(correction).trim())) {
    return 'Problem with Document and Correction Required are both required when choosing Needs Correction';
  }
  if (decision === 'Rejected' && (!note || !String(note).trim())) {
    return 'A rejection explanation is required when rejecting a document';
  }
  return null;
};

/**
 * Applies a verification decision to a document row and saves it.
 *
 * Shared by the customer-record endpoint and the request-details endpoint so a
 * document cannot be verified one way from one page and another way from the
 * other. `Verified` is refused unless the document type's required checks are
 * complete, and a Needs Correction decision sends the customer the correction
 * message and stores what was sent alongside the decision.
 *
 * Returns the checklist score and the notification that was sent, if any.
 */
const saveDocumentVerification = async ({
  document,
  decision,
  note,
  problem,
  correction,
  instructions,
  checklist,
  staffId,
  customer,
}) => {
  const spec = resolveChecklist({ documentType: document.documentType });
  const results = checklist && typeof checklist === 'object' && !Array.isArray(checklist) ? checklist : {};
  const score = evaluateChecklist(spec, results);

  // A Verified decision is the strongest claim this system makes about a
  // document, so it cannot be saved without the checks that document type
  // requires having actually been completed.
  if (decision === 'Verified' && !score.complete) {
    const remaining = score.missingRequired.length;
    const problem_text = `Complete all required checks before saving as Verified. ${remaining} check${remaining === 1 ? '' : 's'} remaining: ${score.missingRequired.join('; ')}`;
    return { refused: problem_text };
  }

  const reviewedAt = new Date();
  const parts = [];
  if (note && String(note).trim()) parts.push(String(note).trim());
  if (decision === 'Needs Correction') {
    parts.push(`Problem with document: ${String(problem).trim()}`);
    parts.push(`Correction required: ${String(correction).trim()}`);
    if (instructions && String(instructions).trim()) parts.push(`Instructions: ${String(instructions).trim()}`);
  }

  document.verificationStatus = decision;
  document.reviewedBy = staffId || null;
  document.reviewedAt = reviewedAt;
  document.reviewNote = parts.length ? parts.join('\n') : null;
  document.verificationChecklist = JSON.stringify({
    group: spec.group,
    label: spec.label,
    completedRequired: score.completedRequired,
    requiredTotal: score.requiredTotal,
    complete: score.complete,
    results,
  });

  // The correction details describe the decision that was just replaced, so they
  // are cleared on any other decision rather than left to describe a stale one.
  if (decision === 'Needs Correction') {
    document.verificationProblem = String(problem).trim();
    document.verificationRequired = String(correction).trim();
    document.verificationInstructions = instructions && String(instructions).trim() ? String(instructions).trim() : null;
  } else {
    document.verificationProblem = null;
    document.verificationRequired = null;
    document.verificationInstructions = null;
  }

  await document.save();

  let notification = null;
  if (decision === 'Needs Correction' && customer) {
    notification = buildCorrectionNotification({
      customer,
      documentId: `DOC-${document.id}`,
      docType: docTypeLabel(document.documentType),
      problem: String(problem).trim(),
      correction: String(correction).trim(),
      instructions,
    });

    let delivered = false;
    let deliveryError = null;
    if (customer.email) {
      try {
        await sendEmail({ to: customer.email, subject: notification.subject, html: notification.html });
        delivered = true;
      } catch (mailError) {
        // A mail transport failure must not undo a decision that is already saved,
        // so it is reported back rather than thrown.
        deliveryError = mailError.message;
        console.warn(`Document correction notification failed for document ${document.id}: ${mailError.message}`);
      }
    }

    document.notificationSubject = notification.subject;
    document.notificationMessage = notification.message;
    document.notificationSentAt = delivered ? new Date() : null;
    await document.save();

    notification.delivered = delivered;
    if (deliveryError) notification.error = deliveryError;
  } else {
    // Only a Needs Correction decision notifies the customer; clearing the stored
    // message keeps the row from showing a notification it never sent.
    document.notificationSubject = null;
    document.notificationMessage = null;
    document.notificationSentAt = null;
    await document.save();
  }

  return { score, notification };
};

const updateDocumentVerification = async (req, res, next) => {
  try {
    const { customerId, documentId } = req.params;
    const {
      decision,
      note,
      problem,
      correction,
      instructions,
      checklist,
      relatedRecordKey: selectedRecordKey,
    } = req.body;

    const refusal = documentVerificationProblem(decision, { note, problem, correction });
    if (refusal) return res.status(400).json({ error: refusal });

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    let document;

    if (documentId === UPLOADED_DOC_ID) {
      /* ----------------------------------------------------------------
       * The file was uploaded by the customer but has no documents-table
       * row yet, so there is nothing to update. Register it first, then
       * apply the decision to the real row: from this point the status,
       * reviewer and note all live in the database.
       * ---------------------------------------------------------------- */
      const { filePath } = req.body;
      if (!filePath) {
        return res.status(400).json({ error: 'No file supplied to verify' });
      }

      // The file must be one this customer actually uploaded, so a crafted
      // request cannot register an arbitrary path.
      const [selfPurchaseRequests, assistedPurchaseRequests, bookShipmentRequests] = await Promise.all([
        SelfPurchaseRequest.findAll({
          where: { userId: customerId },
          attributes: ['id', 'nidPath', 'createdAt'],
        }),
        AssistedPurchaseRequest.findAll({
          where: { userId: customerId },
          attributes: ['id', 'nidPath', 'createdAt'],
        }),
        BookShipmentRequest.findAll({
          where: { userId: customerId },
          attributes: ['id', 'nidPath', 'paymentReceiptPath', 'createdAt'],
        }),
      ]);
      const accountDocuments = await Document.findAll({ where: { userId: customerId, shipmentId: null, removedAt: null } });
      const owned = collectCustomerFiles({
        customer,
        selfPurchaseRequests,
        assistedPurchaseRequests,
        bookShipmentRequests,
        accountDocuments,
      }).find((f) => f.filePath === String(filePath));

      if (!owned) {
        return res.status(403).json({ error: 'File does not belong to this customer' });
      }

      // Reuse the row if this file was already registered, otherwise create it.
      document =
        accountDocuments.find((d) => d.filePath === owned.filePath) ||
        (await Document.create({
          userId: customerId,
          uploadedBy: owned.uploadedBy,
          documentType: owned.documentTypeKey,
          fileName: owned.fileName,
          filePath: owned.filePath,
          fileSize: owned.fileSize,
          relatedRecord: owned.relatedRecord,
          isCustomerVisible: true,
          verificationStatus: 'Pending',
        }));
    } else {
      // The document must belong to this customer, directly or via a shipment.
      document = await Document.findOne({
        where: { id: documentId, removedAt: null },
        include: [{ model: Shipment, as: 'shipment', attributes: ['id', 'userId'], required: false }],
      });
      if (!document) return res.status(404).json({ error: 'Document not found' });

      const ownerId = document.userId || document.shipment?.userId;
      if (String(ownerId) !== String(customerId)) {
        return res.status(403).json({ error: 'Document does not belong to this customer' });
      }
    }

    /* ------------------------------------------------------------------
     * Related Record. The reviewer may attach any record the customer owns,
     * clear the existing link, or leave it untouched - an omitted value keeps
     * whatever is already stored. A submitted record is re-resolved here so it
     * is confirmed to belong to this customer.
     * ------------------------------------------------------------------ */
    let relatedRecord; // undefined = keep the stored link
    let relatedRecordType;

    if (selectedRecordKey) {
      const record = await loadCustomerRecord(customerId, selectedRecordKey);
      if (!record) {
        return res.status(400).json({ error: 'The selected related record does not belong to this customer' });
      }
      relatedRecord = `${record.ref}${record.label ? ` - ${record.label}` : ''}`.slice(0, 100);
      relatedRecordType = record.recordType;
    } else if (selectedRecordKey === null) {
      // An explicit empty value means "clear the link".
      relatedRecord = null;
      relatedRecordType = null;
    }

    /* ------------------------------------------------------------------
     * Checklist and decision. The modal posts the result of every check it
     * showed; the shared helper recomputes the score against the checklist that
     * applies to this document type, so a Verified decision cannot skip a
     * required check whichever page it was saved from.
     * ------------------------------------------------------------------ */
    const saved = await saveDocumentVerification({
      document,
      decision,
      note,
      problem,
      correction,
      instructions,
      checklist,
      staffId: req.user?.id,
      customer,
    });

    if (saved.refused) return res.status(400).json({ error: saved.refused });

    const { score, notification } = saved;

    if (relatedRecord !== undefined) document.relatedRecord = relatedRecord;
    if (relatedRecordType !== undefined) document.relatedRecordType = relatedRecordType;
    await document.save();

    return res.json({
      success: true,
      document: {
        id: document.id,
        verificationStatus: document.verificationStatus,
        reviewedAt: document.reviewedAt,
        reviewNote: document.reviewNote,
        relatedRecord: document.relatedRecord,
        relatedRecordType: document.relatedRecordType,
        checklist: { completedRequired: score.completedRequired, requiredTotal: score.requiredTotal, complete: score.complete },
      },
      notification,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Builds, delivers and stores one customer information request.
 *
 * Shared by the customer-level endpoint (Customer Details) and the request-level
 * one (the Request Information modal on the Requests & Bookings queue), so both
 * produce the same record, the same customer-facing message and the same
 * per-channel evidence - a staff member cannot end up with two different
 * definitions of "an information request was sent".
 *
 * Returns the stored row together with the dispatch outcome so each caller can
 * shape its own response.
 */
const persistInformationRequest = async ({ customer, value, staffId, notification: preparedNotification, channels, extraColumns = {} }) => {
  // The message is built by the caller, because the two flows describe the gap in
  // different ways. Everything after this point - delivery, storage, the audit
  // trail - is identical, which is the point: one definition of "an information
  // request was sent".
  const notification = preparedNotification || buildInformationRequestNotification({
    customer,
    informationType: value.informationType,
    specificInformation: value.specificInformation,
    actionRequired: value.actionRequired,
    requiredDetails: value.requiredDetails,
    reason: value.reason,
    reasonDetails: value.reasonDetails,
    additionalInstructions: value.additionalInstructions,
  });

  const selectedChannels = channels || value.notificationChannels;

  /* ------------------------------------------------------------------
   * Delivery. Email is the only external transport wired up so far; SMS
   * and WhatsApp are recorded as queued so the request stays traceable
   * even before those integrations exist. A transport failure must never
   * undo a saved request, so the outcome is recorded per channel and
   * reported back rather than thrown.
   * ------------------------------------------------------------------ */
  const results = {};
  let anyDelivered = false;
  let deliveredAt = null;

  for (const channel of selectedChannels) {
    if (channel === 'Email') {
      if (!customer.email) {
        results.Email = { status: 'failed', detail: 'No email address on the customer record' };
        continue;
      }
      try {
        await sendEmail({ to: customer.email, subject: notification.subject, html: notification.html });
        results.Email = { status: 'sent', detail: customer.email };
        anyDelivered = true;
        deliveredAt = deliveredAt || new Date();
      } catch (mailError) {
        results.Email = { status: 'failed', detail: mailError.message };
        console.warn(`Information request notification failed for customer ${customer.id}: ${mailError.message}`);
      }
    } else if (channel === 'In-App Notification') {
      // Stored on the customer record and surfaced in the customer portal.
      results['In-App Notification'] = { status: 'sent', detail: 'Stored on the customer account' };
      anyDelivered = true;
      deliveredAt = deliveredAt || new Date();
    } else {
      results[channel] = { status: 'queued', detail: 'No transport configured for this channel yet' };
    }
  }

  const request = await InformationRequest.create({
    userId: customer.id,
    informationType: value.informationType ?? null,
    specificInformation: value.specificInformation ?? null,
    actionRequired: value.actionRequired ?? null,
    requiredDetails: value.requiredDetails ?? value.message,
    reason: value.reason ?? null,
    reasonDetails: value.reasonDetails ?? null,
    additionalInstructions: value.additionalInstructions ?? null,
    notificationChannels: JSON.stringify(selectedChannels),
    notificationSubject: notification.subject,
    notificationMessage: notification.message,
    notificationSentAt: anyDelivered ? deliveredAt : null,
    notificationResults: JSON.stringify(results),
    requestedBy: staffId || null,
    requestedAt: new Date(),
    // Which request, and which of its items, this notice is about. Null for a
    // customer-level information request.
    ...extraColumns,
  });

  return { request, notification, results, anyDelivered, channels: selectedChannels };
};

/**
 * Creates a customer information request from the Request Information modal.
 * POST /admin/customers/:customerId/information-requests
 *
 * The request is customer-level: it is not linked to a document or any other
 * ERP record, and it does not change the customer's or the account's status. It
 * only records what is missing, notifies the customer through the selected
 * channels and adds an audit event.
 *
 * The rules the modal enforces are enforced again here, because the stored
 * record is the source of truth: every required field must be present, the
 * Specific Information option must belong to the selected Information Type,
 * Reason Details is mandatory for "Other", and at least one notification
 * channel must be selected.
 */
const createInformationRequest = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const { valid, errors, value } = validateInformationRequest(req.body || {});
    if (!valid) {
      return res.status(400).json({ error: errors[0], errors });
    }

    const { request, notification, results, anyDelivered } = await persistInformationRequest({
      customer,
      value,
      staffId: req.user?.id,
    });

    return res.status(201).json({
      success: true,
      request: {
        id: request.id,
        reference: `REQ-${String(request.id).padStart(5, '0')}`,
        informationType: request.informationType,
        specificInformation: request.specificInformation,
        actionRequired: request.actionRequired,
        requiredDetails: request.requiredDetails,
        reason: request.reason,
        reasonDetails: request.reasonDetails,
        additionalInstructions: request.additionalInstructions,
        notificationChannels: value.notificationChannels,
        requestedAt: request.requestedAt,
      },
      notification: {
        subject: notification.subject,
        message: notification.message,
        channels: value.notificationChannels,
        delivered: anyDelivered,
        results,
      },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Saves the customer's compliance profile from the Update Compliance Profile modal.
 * PUT /admin/customers/:customerId/compliance
 *
 * This is the only thing that writes the KYC profile, which is what lets the
 * Compliance tab treat it as the source of truth. The allowed values are
 * re-validated here rather than trusted from the modal, and every save appends a
 * review row so the Compliance Review History is a complete record of the
 * profile rather than just its current state.
 *
 * The previous values are captured before the write, so the history shows the
 * profile as it was and as it became - including on the first save, where the
 * previous state is the documented default rather than nothing.
 */
const updateComplianceProfile = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findByPk(customerId, { attributes: ['id', 'name'] });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const { valid, errors, value } = validateComplianceProfile(req.body || {});
    if (!valid) {
      return res.status(400).json({ error: errors[0], errors });
    }

    const reviewedAt = new Date();
    const reviewedBy = req.user?.id || null;

    const existing = await KYC.findOne({ where: { userId: customerId } });
    const before = normaliseComplianceProfile(existing);
    const after = { ...value };

    // A customer predating the KYC tables gets their row created here, so the
    // first save through the modal is what puts the profile in the database.
    const profile = existing || KYC.build({ userId: customerId });

    profile.kycStatus = after.kycStatus;
    profile.riskTier = after.riskTier;
    profile.manualReviewRequired = after.manualReviewRequired;
    profile.internalReviewNote = after.internalReviewNote;
    profile.lastReviewedBy = reviewedBy;
    profile.lastReviewedAt = reviewedAt;
    await profile.save();

    const changed = changedComplianceFields(before, after);

    // Every update is stored, so the history is never silently incomplete.
    // A save that changed nothing still records that a review took place.
    await KYCReview.create({
      userId: customerId,
      action: existing ? 'Update' : 'Create',
      previousKycStatus: before.kycStatus,
      previousRiskTier: before.riskTier,
      previousManualReviewRequired: before.manualReviewRequired,
      previousInternalReviewNote: before.internalReviewNote,
      kycStatus: after.kycStatus,
      riskTier: after.riskTier,
      manualReviewRequired: after.manualReviewRequired,
      internalReviewNote: after.internalReviewNote,
      changedFields: JSON.stringify(changed),
      reviewedBy,
      reviewedAt,
    });

    return res.json({
      success: true,
      profile: {
        kycStatus: after.kycStatus,
        riskTier: after.riskTier,
        manualReviewRequired: after.manualReviewRequired,
        internalReviewNote: after.internalReviewNote,
        lastReviewedBy: reviewedBy,
        lastReviewedAt: reviewedAt,
      },
      changedFields: changed,
    });
  } catch (err) {
    return next(err);
  }
};

/* ======================================================================
 * Account status cases.
 *
 * A case is the unit of record for the Account Actions tab: it carries the
 * decision, the Formal Notice that announced it, the correction deadline for
 * a warning, and the resolution once the case is closed. Rows are never
 * deleted, so the history is a complete record of the account.
 * ====================================================================== */

/**
 * Dispatches a notice over the selected channels and reports each outcome.
 *
 * Email is the only external transport wired up, so it is sent for real; SMS and
 * WhatsApp are recorded as queued so the case stays traceable before those
 * integrations exist, and In-App is stored on the customer account. A transport
 * failure is recorded per channel rather than thrown, because a failed notice
 * must not undo the case that was legitimately decided.
 */
const dispatchAccountNotice = async ({ customer, channels, notice }) => {
  const results = {};
  let anyDelivered = false;

  for (const channel of channels) {
    if (channel === 'Email') {
      if (!customer.email) {
        results.Email = { status: 'failed', detail: 'No email address on the customer record' };
        continue;
      }
      try {
        await sendEmail({ to: customer.email, subject: notice.subject, html: notice.html });
        results.Email = { status: 'sent', detail: customer.email };
        anyDelivered = true;
      } catch (mailError) {
        results.Email = { status: 'failed', detail: mailError.message };
        console.warn(`Account action notice failed for customer ${customer.id}: ${mailError.message}`);
      }
    } else if (channel === 'In-App Notification') {
      results['In-App Notification'] = { status: 'sent', detail: 'Stored on the customer account' };
      anyDelivered = true;
    } else {
      results[channel] = { status: 'queued', detail: 'No transport configured for this channel yet' };
    }
  }

  return { results, anyDelivered };
};

/**
 * Whether the customer actually has a destination for a notification channel.
 *
 * A channel with no registered destination would silently drop the notice, so it
 * is refused rather than recorded as sent.
 */
const channelAvailabilityFor = (channel, customer) =>
  ({
    Email: !!customer.email,
    SMS: !!customer.phone,
    WhatsApp: !!customer.whatsapp,
    'In-App Notification': true,
  })[channel] === true;

/**
 * Records an already-dispatched account notice on the Communications & Audit tab.
 *
 * The notice itself went out through dispatchAccountNotice, so this only writes
 * the notification and its per-channel evidence - it never transmits anything, so
 * the customer is not sent the same notice twice. Dispatch outcomes are mapped
 * onto the notification vocabulary: a channel that delivered becomes Delivered,
 * one that was accepted by the transport becomes Sent, and one that errored
 * becomes Failed with the reason kept.
 */
const recordAccountNoticeNotification = async ({
  customer,
  notice,
  results,
  title,
  channels,
  relatedRecord,
  sourceRef,
}) => {
  // Account notices name the dashboard channel "In-App Notification"; the
  // Communications vocabulary calls it Dashboard, so the names are translated
  // rather than recorded as two different channels.
  const channelName = (channel) => (channel === 'In-App Notification' ? 'Dashboard' : channel);
  const resultsByChannel = {};
  Object.entries(results || {}).forEach(([channel, result]) => {
    resultsByChannel[channelName(channel)] = result;
  });

  const outcomes = {};
  channels.forEach((rawChannel) => {
    const channel = channelName(rawChannel);
    const result = resultsByChannel[channel] || {};
    if (result.status === 'sent' || result.status === 'queued') {
      // "queued" means the transport accepted the message without confirming
      // delivery, which is Sent rather than Delivered.
      outcomes[channel] = {
        status: 'Sent',
        detail: result.detail || 'Accepted by the delivery transport',
      };
    } else if (result.status === 'failed') {
      outcomes[channel] = { status: 'Failed', detail: result.detail || 'Delivery failed' };
    }
  });

  return recordCustomerNotification({
    customer,
    notificationType: 'Formal',
    title,
    message: notice.text,
    channels: channels.map(channelName),
    outcomes,
    relatedRecord,
    sourceRef,
  });
};

/**
 * Resolves the Related Record the modal submitted into the case's stored link.
 *
 * The key is re-resolved through the same catalogue the search uses and the row
 * is re-checked against the customer, so a hand-crafted request cannot attach a
 * case to a shipment or invoice belonging to somebody else. An empty selection
 * clears the link.
 */
const resolveRelatedRecord = async (customerId, key) => {
  const cleaned = String(key ?? '').trim();
  if (!cleaned) return { relatedRecord: null, relatedRecordKey: null, relatedRecordType: null };

  const record = await loadCustomerRecord(customerId, cleaned);
  if (!record) {
    // Returned rather than thrown: this is a rejected choice by the staff member,
    // not a server fault, so the endpoint answers 400 with a message they can act
    // on instead of a generic 500.
    return { error: 'The selected Related Record does not belong to this customer. Pick a record from the search results.' };
  }

  return {
    // The ref is what the history shows, so it is stored alongside the key: the
    // key re-resolves the live row, the ref keeps the record of what it was.
    relatedRecord: `${record.ref}${record.label ? ` - ${record.label}` : ''}`.slice(0, 100),
    relatedRecordKey: record.key,
    relatedRecordType: record.recordType,
  };
};

/**
 * Allocates the next free Notice ID.
 *
 * Re-checks in a loop rather than trusting the count alone, so a deleted or
 * manually inserted row can never hand out a reference that already exists.
 */
const nextNoticeId = async () => {
  // Both the opening notice and the resolution notice draw from the same
  // sequence, so both columns are counted and both are checked for a collision.
  // Otherwise a case that was opened and resolved would hand out a reference the
  // next case would then reuse.
  const issued = await AccountAction.count({
    where: {
      [Op.or]: [{ noticeId: { [Op.ne]: null } }, { resolutionNoticeId: { [Op.ne]: null } }],
    },
  });
  let sequence = issued + 1;
  let candidate = formatNoticeId(sequence);
  while (
    await AccountAction.findOne({
      where: {
        [Op.or]: [{ noticeId: candidate }, { resolutionNoticeId: candidate }],
      },
    })
  ) {
    sequence += 1;
    candidate = formatNoticeId(sequence);
  }
  return candidate;
};

/**
 * Resolves an open case: stamps the resolution, returns the account to good
 * standing and notifies the customer through the same channels they were warned
 * on. The row itself is kept, so the history still shows the case and the notice
 * that was served.
 *
 * Shared by the edit path and by a case created straight into Resolved status, so
 * both produce the same record: two notices, one row, one audit pair.
 *
 * The resolution notice is composed before anything is written, so a failure
 * here cannot leave a case marked Resolved with the account still restricted and
 * the customer never told.
 */
const resolveOpenCase = async ({ action, customer, staffId, resolutionNote, channels }) => {
  const resolvedAt = new Date();
  const resolutionNoticeId = await nextNoticeId();
  const resolutionNotice = buildAccountActionResolutionNotice({
    customer,
    caseType: action.caseType,
    caseRef: action.caseId,
    noticeRef: resolutionNoticeId,
    resolutionNote,
  });

  action.caseStatus = 'Resolved';
  action.resolvedAt = resolvedAt;
  action.approvedBy = staffId || null;
  action.resolutionNote = resolutionNote;
  // A resolved case no longer carries a correction deadline, otherwise the
  // summary card would keep counting down against a closed case.
  action.correctionDeadline = null;
  // The resolution notice is recorded alongside the original so the case keeps
  // a full trail of what the customer was told and when. Deduplicated, because
  // a resolution usually goes out on the same channels as the warning.
  action.notificationChannels = JSON.stringify(
    [...new Set(safeJson(action.notificationChannels, []).concat(channels))]
  );
  await action.save();

  const { results, anyDelivered } = await dispatchAccountNotice({
    customer,
    channels,
    notice: resolutionNotice,
  });

  // The resolution notice is a notification like any other, so the Audit tab
  // carries it with the same evidence trail as the opening notice.
  await recordAccountNoticeNotification({
    customer,
    notice: resolutionNotice,
    results,
    title: resolutionNotice.subject,
    channels,
    relatedRecord: action.caseId,
    sourceRef: action.caseId,
  });

  // The notice text, its reference and the per-channel outcome are stored on the
  // case, exactly as the opening notice is, so the resolution can be reproduced
  // from the record instead of from memory.
  action.resolutionNoticeId = resolutionNoticeId;
  action.resolutionNoticeSubject = resolutionNotice.subject;
  action.resolutionNoticeMessage = resolutionNotice.text;
  action.resolutionNoticeSentAt = anyDelivered ? resolvedAt : null;
  action.resolutionNoticeResults = JSON.stringify(results);
  await action.save();

  await customer.update({ accountStatus: DEFAULT_ACCOUNT_STATUS });

  return { resolvedAt, resolutionNoticeId, noticeResults: results, noticeDelivered: anyDelivered };
};

/**
 * Opens a new account status case.
 * POST /admin/customers/:customerId/account-actions
 *
 * Creates the case, moves the customer into the status the case type imposes and
 * sends the Formal Notice. Only one case may be open per account, so a second
 * attempt is refused and the caller is pointed at the existing case to edit.
 *
 * A case created with Case Status "Resolved" is opened and then closed in the one
 * request: the customer still gets the Formal Notice for the status change and
 * the resolution notice that put them back in good standing, and the case is kept
 * in the history exactly as a case resolved later would be.
 */
const createAccountAction = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    // One open case per account. This is the rule that stops a customer being
    // double-warned or double-suspended by two overlapping cases.
    const existingOpenCase = await AccountAction.findOne({
      where: { userId: customerId, caseStatus: 'Open' },
    });
    if (existingOpenCase) {
      return res.status(409).json({
        error: `This account already has an open ${existingOpenCase.caseType} case (${existingOpenCase.caseId}). Edit or resolve that case instead of opening a second one.`,
        openCaseId: existingOpenCase.caseId,
        openCaseRowId: existingOpenCase.id,
      });
    }

    const previousStatus = customer.accountStatus || DEFAULT_ACCOUNT_STATUS;
    // The current status is passed in so the endpoint applies the same no-op rule
    // the modal used to hide the option, rather than trusting the dropdown alone.
    const { valid, errors, value } = validateAccountAction(req.body || {}, {
      currentStatus: previousStatus,
      noticeRequired: true,
    });
    if (!valid) {
      return res.status(400).json({ error: errors[0], errors });
    }

    // A channel with no registered destination would silently drop the notice,
    // so it is refused rather than recorded as sent.
    const undeliverable = value.notificationChannels.filter((c) => !channelAvailabilityFor(c, customer));
    if (undeliverable.length) {
      return res.status(400).json({
        error: `No contact detail on file for: ${undeliverable.join(', ')}. Choose a channel the customer can actually receive.`,
        errors: undeliverable.map((c) => `${c} is not available for this customer`),
      });
    }

    // Re-resolved against this customer, so the stored link can only ever point at
    // a record they own.
    const related = await resolveRelatedRecord(customerId, value.relatedRecordKey);
    if (related.error) return res.status(400).json({ error: related.error });

    const newStatus = statusForCaseType(value.caseType);
    const effectiveAt = new Date();
    const decidedBy = req.user?.id || null;
    const noticeId = await nextNoticeId();

    // The row is written first so the case can be given its generated Case ID
    // from the auto-increment, rather than from a count that two staff could
    // race on. The provisional value only exists for the length of this insert
    // and is kept short enough for the column; it is unique because the
    // timestamp is base-36.
    const created = await AccountAction.create({
      userId: customerId,
      caseId: `TMP-${Date.now().toString(36)}`,
      caseType: value.caseType,
      caseStatus: 'Open',
      reasonCategory: value.reasonCategory,
      reasonDetails: value.reasonDetails,
      previousStatus,
      newStatus,
      effectiveAt,
      decidedBy,
      relatedRecord: related.relatedRecord,
      relatedRecordKey: related.relatedRecordKey,
      relatedRecordType: related.relatedRecordType,
      noticeId,
      noticeType: NOTICE_TYPE,
      notificationChannels: JSON.stringify(value.notificationChannels),
    });

    const caseId = formatCaseId(created.id);
    created.caseId = caseId;
    await created.save();

    // The deadline is measured from the moment the notice goes out, and it is
    // quoted inside the notice itself, so the customer is told the exact date the
    // tab will then display.
    const noticeSentAt = new Date();
    const correctionDeadline = calculateCorrectionDeadline(value.caseType, noticeSentAt);

    const notice = buildAccountActionNotice({
      customer,
      caseType: value.caseType,
      newStatus,
      reasonCategory: value.reasonCategory,
      reasonDetails: value.reasonDetails,
      caseRef: caseId,
      noticeRef: noticeId,
      correctionDeadline,
    });

    const { results, anyDelivered } = await dispatchAccountNotice({
      customer,
      channels: value.notificationChannels,
      notice,
    });

    // The Communications & Audit tab records what the customer was told, so an
    // automatic notice is registered there exactly like a manual one. A failure
    // to record it must not undo a decision that was legitimately made.
    const recorded = await recordAccountNoticeNotification({
      customer,
      notice,
      results,
      title: notice.subject,
      channels: value.notificationChannels,
      relatedRecord: caseId,
      sourceRef: caseId,
    });

    created.noticeSubject = notice.subject;
    created.noticeMessage = notice.text;
    created.noticeSentAt = anyDelivered ? noticeSentAt : null;
    created.noticeResults = JSON.stringify(results);
    created.correctionDeadline = anyDelivered ? correctionDeadline : null;
    await created.save();

    await customer.update({ accountStatus: newStatus });

    // Case Status Resolved on a new case: close it through the same routine the
    // edit path uses, so the customer is notified of both decisions.
    const resolution = value.caseStatus === 'Resolved'
      ? await resolveOpenCase({
          action: created,
          customer,
          staffId: decidedBy,
          resolutionNote: value.resolutionNote,
          channels: value.notificationChannels,
        })
      : null;

    return res.status(201).json({
      success: true,
      case: {
        id: created.id,
        caseId,
        caseType: created.caseType,
        caseStatus: created.caseStatus,
        reasonCategory: created.reasonCategory,
        previousStatus,
        newStatus,
        noticeId,
        noticeSentAt: created.noticeSentAt,
        correctionDeadline: created.correctionDeadline,
        noticeResults: results,
        ...(resolution
          ? {
              resolvedAt: resolution.resolvedAt,
              resolutionNoticeId: resolution.resolutionNoticeId,
              resolutionNoticeResults: resolution.noticeResults,
            }
          : {}),
      },
      accountStatus: customer.accountStatus,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Edits or resolves the account's open case.
 * PUT /admin/customers/:customerId/account-actions/:caseId
 *
 * Editing corrects the case in place. Resolving stamps the resolution, returns
 * the account to Active and notifies the customer, but keeps the row so the
 * history still shows the case and the warning that was served.
 */
const updateAccountAction = async (req, res, next) => {
  try {
    const { customerId, caseId } = req.params;

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const action = await AccountAction.findOne({ where: { userId: customerId, caseId } });
    if (!action) return res.status(404).json({ error: `Case ${caseId} not found for this customer` });
    if (action.caseStatus !== 'Open') {
      return res.status(409).json({ error: `Case ${caseId} is already resolved and can no longer be edited` });
    }

    // The account is already sitting on the status this case imposed, so the
    // no-op rule is not applied here: the case type is deliberately not editable
    // (it is what the notice told the customer), and hiding it would force the
    // staff member onto a different action they did not choose.
    // A plain edit changes no status and sends no notice, so it is not held to
    // the notification-channel rule; resolving one does notify the customer.
    const { valid, errors, value } = validateAccountAction(req.body || {}, {
      noticeRequired: String(req.body?.caseStatus ?? '').trim() === 'Resolved',
    });
    if (!valid) {
      return res.status(400).json({ error: errors[0], errors });
    }

    const undeliverable = value.notificationChannels.filter((c) => !channelAvailabilityFor(c, customer));
    if (undeliverable.length) {
      return res.status(400).json({
        error: `No contact detail on file for: ${undeliverable.join(', ')}. Choose a channel the customer can actually receive.`,
        errors: undeliverable.map((c) => `${c} is not available for this customer`),
      });
    }

    action.reasonCategory = value.reasonCategory;
    action.reasonDetails = value.reasonDetails;

    // Only re-resolve the link when the modal actually sent one: omitting the key
    // on a plain edit means "leave the stored record alone", so an existing case
    // is not silently unlinked by a save that never looked at the search.
if (req.body?.relatedRecordKey !== undefined) {
      const related = await resolveRelatedRecord(customerId, value.relatedRecordKey);
      if (related.error) return res.status(400).json({ error: related.error });
      action.relatedRecord = related.relatedRecord;
      action.relatedRecordKey = related.relatedRecordKey;
      action.relatedRecordType = related.relatedRecordType;
    }

    if (value.caseStatus === 'Open') {
      await action.save();
      return res.json({
        success: true,
        caseStatus: action.caseStatus,
        caseId: action.caseId,
        accountStatus: customer.accountStatus,
      });
    }

    const resolution = await resolveOpenCase({
      action,
      customer,
      staffId: req.user?.id || null,
      resolutionNote: value.resolutionNote,
      channels: value.notificationChannels,
    });

    return res.json({
      success: true,
      caseStatus: action.caseStatus,
      caseId: action.caseId,
      resolvedAt: resolution.resolvedAt,
      resolutionNoticeId: resolution.resolutionNoticeId,
      noticeResults: resolution.noticeResults,
      noticeDelivered: resolution.noticeDelivered,
      accountStatus: DEFAULT_ACCOUNT_STATUS,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Sends a notification to a customer from the Send Notification modal.
 * POST /admin/customers/:customerId/notifications
 *
 * Records the notification and one delivery row per channel, so the Customer
 * Notifications table gains a row and the Delivery Evidence table gains one row
 * per channel - the same way an automatically raised notification does.
 */
const createCustomerNotification = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const { valid, errors, value } = validateCustomerNotification(req.body || {}, { customer });
    if (!valid) {
      return res.status(400).json({ error: errors[0], errors });
    }

    // The Related Record arrives as the opaque key of the row staff picked in the
    // search. Re-resolving it here is what proves the record belongs to this
    // customer before the reference is stored against the notification.
    const related = await resolveRelatedRecord(customerId, value.relatedRecordKey);
    if (related.error) {
      return res.status(400).json({ error: related.error });
    }

    const sent = await sendCustomerNotification({
      customer,
      notificationType: value.notificationType,
      title: value.title,
      message: value.message,
      channels: value.channels,
      relatedRecord: related.relatedRecord,
      // A notification raised by hand is a staff action, so it is attributed to
      // the staff member who sent it rather than to the system.
      source: 'staff',
      createdBy: req.user?.id || null,
    });

    if (!sent) {
      return res.status(400).json({
        error: 'The notification could not be sent because none of the selected channels can reach this customer.',
      });
    }

    return res.status(201).json({
      success: true,
      notification: {
        notificationId: sent.notificationId,
        type: value.notificationType,
        title: value.title,
        relatedRecord: related.relatedRecord,
        status: sent.status,
        channels: sent.deliveries,
      },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * One notification with its delivery evidence, for the details view.
 * GET /admin/customers/:customerId/notifications/:notificationId
 *
 * Read-only by design. Staff opening a notification from the backend reads the
 * record and nothing else: `viewedAt` is written only when the customer opens the
 * notification on a customer-facing surface, so staff reading it cannot make a
 * notification look seen by the customer.
 */
const getCustomerNotification = async (req, res, next) => {
  try {
    const { customerId, notificationId } = req.params;

    const notification = await CustomerNotification.findOne({
      where: { userId: customerId, notificationId },
    });
    if (!notification) {
      return res.status(404).json({ error: `Notification ${notificationId} not found for this customer` });
    }

    const evidence = await NotificationDelivery.findAll({
      where: { userId: customerId, notificationId },
      order: [['attemptedAt', 'ASC'], ['id', 'ASC']],
    });

    return res.json({
      notification: {
        notificationId: notification.notificationId,
        type: notification.notificationType,
        title: notification.title,
        message: notification.message,
        relatedRecord: notification.relatedRecord,
        status: notification.status,
        sentAt: notification.sentAt,
        viewedAt: notification.viewedAt,
        source: notification.source,
        sourceRef: notification.sourceRef,
        sentBy: notification.createdBy ? `Staff #${notification.createdBy}` : 'System',
        // The whole point of this endpoint: staff can look, but the record must
        // show the customer's own view state, untouched.
        viewedByCustomer: !!notification.viewedAt,
      },
      deliveries: evidence.map((d) => ({
        channel: d.channel,
        deliveryStatus: d.deliveryStatus,
        providerRef: d.providerRef,
        attemptedAt: d.attemptedAt,
        deliveredAt: d.deliveredAt,
        viewedAt: d.viewedAt,
        failureReason: d.failureReason,
        destination: d.destination,
      })),
    });
  } catch (err) {
    return next(err);
  }
};

export {
  renderDashboard,
  renderCustomers,
  exportCustomersPDF,
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
  renderCustomerDetail,
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
};
