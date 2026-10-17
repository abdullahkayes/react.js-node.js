import Customer from './Customer.js';
import Address from './Address.js';
import RateCard from './RateCard.js';
import Shipment from './Shipment.js';
import ShipmentItem from './ShipmentItem.js';
import TrackingEvent from './TrackingEvent.js';
import Payment from './Payment.js';
import Invoice from './Invoice.js';
import InvoiceItem from './InvoiceItem.js';
import Quotation from './Quotation.js';
import QuotationItem from './QuotationItem.js';
import Document from './Document.js';
import ReturnRTO from './ReturnRTO.js';
import Insurance from './Insurance.js';
import Claim from './Claim.js';
import SelfPurchaseRequest from './SelfPurchaseRequest.js';
import SelfPurchaseItem from './SelfPurchaseItem.js';
import AssistedPurchaseRequest from './AssistedPurchaseRequest.js';
import AssistedPurchaseItem from './AssistedPurchaseItem.js';
import BookShipmentRequest from './BookShipmentRequest.js';
import BookShipmentItem from './BookShipmentItem.js';
import ContactVerificationRecord from './ContactVerificationRecord.js';
import InformationRequest from './InformationRequest.js';
import RequestStatusEvent from './RequestStatusEvent.js';
import StatusReference from './StatusReference.js';
import KYC from './KYC.js';
import KYCReview from './KYCReview.js';
import AccountAction from './AccountAction.js';
import CustomerNotification from './CustomerNotification.js';
import NotificationDelivery from './NotificationDelivery.js';
import PolicyAcceptance from './PolicyAcceptance.js';

Customer.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

Customer.hasMany(Shipment, { foreignKey: 'userId', as: 'shipments', onDelete: 'CASCADE' });
Shipment.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

Shipment.belongsTo(Address, { foreignKey: 'senderAddressId', as: 'sender' });
Shipment.belongsTo(Address, { foreignKey: 'receiverAddressId', as: 'receiver' });

Shipment.hasMany(TrackingEvent, { foreignKey: 'shipmentId', as: 'trackingEvents', onDelete: 'CASCADE' });
TrackingEvent.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

// The timeline's other half: where the request or booking is in its own
// workflow. It is read next to tracking_events rather than mixed into it,
// because a request status is not the next step of a shipment's journey.
Shipment.hasMany(RequestStatusEvent, {
  foreignKey: 'shipmentId',
  as: 'requestStatusEvents',
  onDelete: 'CASCADE',
});

Shipment.hasMany(Payment, { foreignKey: 'shipmentId', as: 'payments', onDelete: 'CASCADE' });
Payment.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

// A payment settles one invoice, and the Payments tab reads that link to show
// the invoice's Due Date and the Linked Invoice section for the payment.
Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments', onDelete: 'SET NULL' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

Shipment.hasMany(ShipmentItem, { foreignKey: 'shipmentId', as: 'items', onDelete: 'CASCADE' });
ShipmentItem.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

Shipment.hasMany(Invoice, { foreignKey: 'shipmentId', as: 'invoices', onDelete: 'CASCADE' });
Invoice.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

// A quotation is an estimate rather than a payable document, so it is kept
// alongside invoices on the shipment but never treated as one.
Shipment.hasMany(Quotation, { foreignKey: 'shipmentId', as: 'quotations', onDelete: 'CASCADE' });
Quotation.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

Customer.hasMany(Quotation, { foreignKey: 'userId', as: 'quotations', onDelete: 'CASCADE' });
Quotation.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

Quotation.hasMany(QuotationItem, { foreignKey: 'quotationId', as: 'items', onDelete: 'CASCADE' });
QuotationItem.belongsTo(Quotation, { foreignKey: 'quotationId', as: 'quotation' });

Shipment.hasMany(Document, { foreignKey: 'shipmentId', as: 'documents', onDelete: 'CASCADE' });
Document.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

// Account documents have no shipment; they hang off the customer directly.
Customer.hasMany(Document, { foreignKey: 'userId', as: 'accountDocuments', onDelete: 'CASCADE' });
Document.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

// Contact verification is a history of attempts, not a single flag.
Customer.hasMany(ContactVerificationRecord, { foreignKey: 'userId', as: 'contactVerificationRecords', onDelete: 'CASCADE' });
ContactVerificationRecord.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

// Information requests are customer-level: no document or record link, so the
// request stays traceable to the customer and the audit trail on its own.
Customer.hasMany(InformationRequest, { foreignKey: 'userId', as: 'informationRequests', onDelete: 'CASCADE' });
InformationRequest.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

Shipment.hasMany(ReturnRTO, { foreignKey: 'shipmentId', as: 'returnsRTOs', onDelete: 'CASCADE' });
ReturnRTO.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

// Returns and RTO cases also belong to the customer directly, so the
// customer detail tab can reach them through the customer relationship
// rather than by walking every one of the customer's shipments.
Customer.hasMany(ReturnRTO, { foreignKey: 'userId', as: 'returnsRtos', onDelete: 'CASCADE' });
ReturnRTO.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

Shipment.hasMany(Insurance, { foreignKey: 'shipmentId', as: 'insurances', onDelete: 'CASCADE' });
Insurance.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

// Claims live alongside a shipment regardless of whether it was insured.
Shipment.hasMany(Claim, { foreignKey: 'shipmentId', as: 'claims', onDelete: 'CASCADE' });
Claim.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

// Claims and compensation are reported per customer on the detail tab, so the
// same direct customer link is declared here for the insurance records.
Customer.hasMany(Insurance, { foreignKey: 'userId', as: 'insurances', onDelete: 'CASCADE' });
Insurance.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

Customer.hasMany(SelfPurchaseRequest, { foreignKey: 'userId', as: 'selfPurchaseRequests', onDelete: 'CASCADE' });
SelfPurchaseRequest.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

SelfPurchaseRequest.hasMany(SelfPurchaseItem, { foreignKey: 'requestId', as: 'items', onDelete: 'CASCADE' });
SelfPurchaseItem.belongsTo(SelfPurchaseRequest, { foreignKey: 'requestId', as: 'request', onDelete: 'CASCADE' });

Customer.hasMany(AssistedPurchaseRequest, { foreignKey: 'userId', as: 'assistedPurchaseRequests', onDelete: 'CASCADE' });
AssistedPurchaseRequest.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

AssistedPurchaseRequest.hasMany(AssistedPurchaseItem, { foreignKey: 'requestId', as: 'items', onDelete: 'CASCADE' });
AssistedPurchaseItem.belongsTo(AssistedPurchaseRequest, { foreignKey: 'requestId', as: 'request', onDelete: 'CASCADE' });

Customer.hasMany(BookShipmentRequest, { foreignKey: 'userId', as: 'bookShipmentRequests', onDelete: 'CASCADE' });
BookShipmentRequest.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

// The compliance profile is a customer-level record with one row per customer,
// plus the review history of every update staff made to it.
Customer.hasMany(KYC, { foreignKey: 'userId', as: 'kycProfiles', onDelete: 'CASCADE' });
KYC.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

Customer.hasMany(KYCReview, { foreignKey: 'userId', as: 'kycReviews', onDelete: 'CASCADE' });
KYCReview.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

// Account status cases are kept for the life of the account: the history must
// preserve every case, so nothing here cascades away a resolved case.
Customer.hasMany(AccountAction, { foreignKey: 'userId', as: 'accountActions', onDelete: 'CASCADE' });
AccountAction.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

// Communications & Audit. A notification is kept for the life of the account
// because it is the evidence of what the customer was told and when, so nothing
// here cascades it away; the delivery rows belong to the notification and do
// cascade with it.
Customer.hasMany(CustomerNotification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
CustomerNotification.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

Customer.hasMany(NotificationDelivery, { foreignKey: 'userId', as: 'notificationDeliveries', onDelete: 'CASCADE' });
NotificationDelivery.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

// A notification's evidence rows hang off the notification itself, so they are
// removed with it rather than orphaned.
CustomerNotification.hasMany(NotificationDelivery, {
  foreignKey: 'notificationRowId',
  as: 'deliveries',
  onDelete: 'CASCADE',
});
NotificationDelivery.belongsTo(CustomerNotification, { foreignKey: 'notificationRowId', as: 'notification' });

// Policy acceptances are evidence of a decision the customer made, so they are
// preserved like audit records rather than replaced when a policy is updated.
Customer.hasMany(PolicyAcceptance, { foreignKey: 'userId', as: 'policyAcceptances', onDelete: 'CASCADE' });
PolicyAcceptance.belongsTo(Customer, { foreignKey: 'userId', as: 'user' });

BookShipmentRequest.hasMany(BookShipmentItem, { foreignKey: 'requestId', as: 'items', onDelete: 'CASCADE' });
BookShipmentItem.belongsTo(BookShipmentRequest, { foreignKey: 'requestId', as: 'request', onDelete: 'CASCADE' });

export {
  Customer,
  Customer as User,
  Address,
  RateCard,
  Shipment,
  ShipmentItem,
  TrackingEvent,
  Payment,
  Invoice,
  InvoiceItem,
   Quotation,
  QuotationItem,
  Document,
  ReturnRTO,
  Insurance,
  Claim,
  SelfPurchaseRequest,
  SelfPurchaseItem,
  AssistedPurchaseRequest,
  AssistedPurchaseItem,
  BookShipmentRequest,
  BookShipmentItem,
  ContactVerificationRecord,
  InformationRequest,
  KYC,
  KYCReview,
  AccountAction,
  CustomerNotification,
  NotificationDelivery,
  PolicyAcceptance,
  RequestStatusEvent,
  StatusReference,
};