import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Document = sequelize.define(
  'Document',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // Shipment documents always belong to a shipment. Customer account
    // documents (trade licence, nid, etc.) are not tied to one, so this is
    // nullable and relatedRecordId carries the owner instead.
    shipmentId: { type: DataTypes.INTEGER, allowNull: true },
    shipmentItemId: { type: DataTypes.INTEGER, allowNull: true },
    uploadedBy: { type: DataTypes.INTEGER, allowNull: false },
    // Customer the document belongs to. Set for account documents; for
    // shipment documents it is derived from the shipment.
    userId: { type: DataTypes.INTEGER, allowNull: true },
    // Request the document was uploaded against, for files that belong to a
    // request rather than to a shipment or an account. requestType holds the
    // request's workflow key ("self_purchase", ...) and requestId its row id.
    // Both are null for shipment and account documents, which is what lets the
    // three kinds of document share this one table.
    requestType: { type: DataTypes.STRING(50), allowNull: true, defaultValue: null },
    requestId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    // Item within that request the document belongs to, used by the details page
    // to list a document against the item it was uploaded for.
    requestItemId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    documentType: {
      type: DataTypes.ENUM(
        'invoice',
        // A receipt is not an invoice and is not folded into it: the upload
        // modal offers both, and a document customer needs matching back to a
        // payment is a receipt.
        'receipt',
        'packing_list',
        'bill_of_lading',
        'customs_declaration',
        'insurance_certificate',
        'commercial_invoice',
        'certificate_of_origin',
        'shipping_instructions',
        'delivery_proof',
        'return_authorization',
        'rto_document',
        'insurance_claim',
        'trade_license',
        'national_id',
        // The document types the Upload Document modal offers. Each is its own
        // member rather than folded into a near neighbour, because a Return Label
        // is not an RTO document and an AWB is not a Bill of Lading: collapsing
        // them would lose exactly the distinction the upload form asks staff to
        // make. Widening only ever appends, so rows already stored with the
        // earlier members stay readable.
        'source_document',
        'return_label',
        'rma_document',
        'claim_photo',
        'awb',
        'delivery_order',
        'other'
      ),
      allowNull: false,
    },
    fileName: { type: DataTypes.STRING(255), allowNull: false },
    filePath: { type: DataTypes.STRING(500), allowNull: false },
    fileSize: { type: DataTypes.INTEGER, allowNull: true },
    mimeType: { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    isCustomerVisible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    // Account-document details.
    relatedRecord: { type: DataTypes.STRING(100), allowNull: true },
    // Which ERP record kind `relatedRecord` points at ("Shipment", "Request",
    // "Payment", ...). The modal stores the search result as a pair, so the
    // verification history keeps the record type even after the document moves.
    relatedRecordType: { type: DataTypes.STRING(50), allowNull: true },
    expiryDate: { type: DataTypes.DATE, allowNull: true },
    // Verification record written by the verification modal.
    // verificationChecklist stores the JSON result of the document-type
    // checklist (see config/documentChecklists.js) so a decision can always be
    // traced back to the checks that were completed at the time.
    verificationChecklist: { type: DataTypes.TEXT, allowNull: true },
    verificationProblem: { type: DataTypes.TEXT, allowNull: true },
    verificationRequired: { type: DataTypes.TEXT, allowNull: true },
    verificationInstructions: { type: DataTypes.TEXT, allowNull: true },
    // Customer notification generated for a Needs Correction decision. Stored
    // with the verification event so the message that was actually sent can be
    // reproduced later.
    notificationSubject: { type: DataTypes.STRING(255), allowNull: true },
    notificationMessage: { type: DataTypes.TEXT, allowNull: true },
    notificationSentAt: { type: DataTypes.DATE, allowNull: true },
    // Review outcome. Pending and Needs Correction are the states that put a
    // document into "Documents Requiring Review"; Verified and Rejected are
    // terminal and switch the action button to View.
    verificationStatus: {
      type: DataTypes.ENUM('Pending', 'Verified', 'Rejected', 'Needs Correction'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    reviewedBy: { type: DataTypes.INTEGER, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    reviewNote: { type: DataTypes.TEXT, allowNull: true },
    // Removal. A document is not hard-deleted, because the audit trail has to
    // keep a record of who removed it and when: the row stays, hidden from
    // every listing, and these two columns are what the Audit Trail reads.
    removedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    removedBy: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  },
  {
    tableName: 'documents',
    timestamps: true,
    underscored: true,
  }
);

export default Document;