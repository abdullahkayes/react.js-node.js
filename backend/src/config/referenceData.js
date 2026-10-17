/**
 * Reference Data Parser
 *
 * Parses Statuses.md and Dropdown.md to extract structured data for dropdowns.
 * This ensures dropdowns always reflect the reference files without hardcoding.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseStatusesMd() {
  const filePath = path.join(__dirname, '..', '..', 'Statuses.md');
  const content = fs.readFileSync(filePath, 'utf8');

  const sections = {};
  let currentSection = null;
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    // Statuses.md uses plain text headers ending with ":"
    if (trimmed.endsWith(':') && !trimmed.startsWith('*')) {
      currentSection = trimmed.slice(0, -1).trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      sections[currentSection] = [];
    } else if (trimmed.startsWith('* ') && currentSection) {
      const value = trimmed.slice(2).trim().replace(/ \(.*\)$/, ''); // Remove "(Customer Facing)" etc.
      if (value) sections[currentSection].push(value);
    }
  }

  return sections;
}

function parseDropdownMd() {
  const filePath = path.join(__dirname, '..', '..', '..', 'Dropdown.md');
  const content = fs.readFileSync(filePath, 'utf8');

  const sections = {};
  let currentSection = null;
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    // Dropdown.md uses ## **section_name** format
    if (trimmed.startsWith('## **') && trimmed.endsWith('**')) {
      currentSection = trimmed.slice(4, -2).trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      sections[currentSection] = [];
    } else if (trimmed.startsWith('* ') && currentSection) {
      const value = trimmed.slice(2).trim().replace(/  $/, '').replace(/\s*\\$/, '');
      if (value) sections[currentSection].push(value);
    }
  }

  return sections;
}

const statuses = parseStatusesMd();
const dropdowns = parseDropdownMd();

/**
 * Statuses extracted from Statuses.md
 */
export const STATUS_OPTIONS = {
  shipmentRequestStatus: statuses['shipment_request_status'] || [],
  shipmentStatus: statuses['shipment_status'] || [],
  shipmentItemAcceptanceReviewStatus: statuses['shipment_item_acceptance_review_status'] || [],
  documentVerificationStatus: statuses['document_verification_status'] || [],
  customerAccountStatus: statuses['customer_account_status'] || [],
  contactVerificationStatus: statuses['contact_verification_status'] || [],
  customerNotificationStatus: statuses['customer_notification_status'] || [],
  paymentStatus: statuses['payment_status'] || [],
  returnStatus: statuses['return_status'] || [],
  kycStatus: statuses['kyc_status'] || [],
  kycRiskTier: statuses['kyc_risk_tier'] || [],
  kycManualReviewStatus: statuses['kyc_manual_review_status'] || [],
  accountActionCaseStatus: statuses['account_action_case_status'] || [],
  staffAccountStatus: statuses['staff_account_status'] || [],
  governanceApprovalStatus: statuses['governance_approval_status'] || [],
  carrierLocalCourierTrackingNumberStatus: statuses['carrier_local_courier_tracking_number_status'] || [],
};

/**
 * Dropdowns extracted from Dropdown.md
 */
export const DROPDOWN_OPTIONS = {
  customerType: dropdowns['customer_type'] || [],
  accountStatusRelatedEntityType: dropdowns['account_status_related_entity_type'] || [],
  serviceMode: dropdowns['service_mode'] || [],
  freightMode: dropdowns['freight_mode'] || [],
  purchaseType: dropdowns['purchase_type'] || [],
  itemType: dropdowns['item_type'] || [],
  itemSource: dropdowns['item_source'] || [],
  quotationType: dropdowns['quotation_type'] || [],
  invoiceType: dropdowns['invoice_type'] || [],
  paymentPurpose: dropdowns['payment_purpose'] || [],
  paymentMethod: dropdowns['payment_method'] || [],
  walletAccountType: dropdowns['wallet_account_type'] || [],
  walletTransactionType: dropdowns['wallet_transaction_type'] || [],
  claimBasis: dropdowns['claim_basis'] || [],
  claimType: dropdowns['claim_type'] || [],
  returnPurpose: dropdowns['return_purpose'] || [],
  rtoCaseType: dropdowns['rto_case_type'] || [],
  rtoReason: dropdowns['rto_reason'] || [],
  staffRole: dropdowns['staff_role'] || [],
  actorType: dropdowns['actor_type'] || [],
  quotationItemChargeType: dropdowns['quotation_item_charge_type'] || [],
  invoiceItemChargeType: dropdowns['invoice_item_charge_type'] || [],
  notificationRelatedEntityType: dropdowns['notification_related_entity_type'] || [],
  documentType: dropdowns['document_type'] || [],
  contactType: dropdowns['contact_type'] || [],
  verificationTokenPurpose: dropdowns['verification_token_purpose'] || [],
  riskTier: dropdowns['risk_tier'] || [],
  addressType: dropdowns['address_type'] || [],
  unitType: dropdowns['unit_type'] || [],
  trackingSource: dropdowns['tracking_source'] || [],
  timelineVisibility: dropdowns['timeline_visibility'] || [],
  transactionDirection: dropdowns['transaction_direction'] || [],
  costResponsibility: dropdowns['cost_responsibility'] || [],
  notificationType: dropdowns['notification_type'] || [],
  deliveryChannel: dropdowns['delivery_channel'] || [],
  policyType: dropdowns['policy_type'] || [],
  policyAcceptanceMethod: dropdowns['policy_acceptance_method'] || [],
  auditActionType: dropdowns['audit_action_type'] || [],
  auditEntityType: dropdowns['audit_entity_type'] || [],
  currency: dropdowns['currency'] || [],
  createdByTypeSubmittedByType: dropdowns['created_by_type_submitted_by_type'] || [],
  finalDeliveryMethod: dropdowns['final_delivery_method'] || [],
};

/**
 * Convenience getters for common dropdown groups
 */
export const getRequestStatuses = () => STATUS_OPTIONS.shipmentRequestStatus;
export const getShipmentStatuses = () => STATUS_OPTIONS.shipmentStatus;
export const getCustomerAccountStatuses = () => STATUS_OPTIONS.customerAccountStatus;
export const getContactVerificationStatuses = () => STATUS_OPTIONS.contactVerificationStatus;
export const getReturnStatuses = () => STATUS_OPTIONS.returnStatus;

export const getCustomerTypes = () => DROPDOWN_OPTIONS.customerType;
export const getFreightModes = () => DROPDOWN_OPTIONS.freightMode;
export const getCustomerTypesList = () => DROPDOWN_OPTIONS.customerType;
export const getItemTypes = () => DROPDOWN_OPTIONS.itemType;
export const getFreightModesList = () => DROPDOWN_OPTIONS.freightMode;
export const getServiceModes = () => DROPDOWN_OPTIONS.serviceMode;
export const getPurchaseTypes = () => DROPDOWN_OPTIONS.purchaseType;
export const getPurchaseTypesList = () => DROPDOWN_OPTIONS.purchaseType;
export const getItemTypesList = () => DROPDOWN_OPTIONS.itemType;
export const getItemSources = () => DROPDOWN_OPTIONS.itemSource;
export const getDocumentTypes = () => DROPDOWN_OPTIONS.documentType;
export const getServiceModesList = () => DROPDOWN_OPTIONS.serviceMode;