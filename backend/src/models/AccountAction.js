import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * One row per account status case.
 *
 * This is the single source of truth for the Account Actions tab: the summary
 * cards, the Active Account Status Case and the Account Action History all read
 * from here, and the only things that write to it are the Start Account Action
 * modal and the resolve action it performs.
 *
 * A row is never deleted. Resolving a case sets `caseStatus` to Resolved and
 * stamps the resolution, so the history keeps every case ever raised while the
 * account carries at most one Open case at a time.
 *
 * The notice columns are stored inline rather than in a separate notifications
 * table, matching how InformationRequest keeps its Formal Notice: the case and
 * the notice that announced it are one event and are read together.
 */
const AccountAction = sequelize.define(
  'AccountAction',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    // Generated reference shown in place of the numeric id.
    caseId: { type: DataTypes.STRING(20), allowNull: false },
    // Vocabularies come from config/accountActions.js. Dormant is not an action,
    // so it is not a value a case can carry.
    caseType: {
      type: DataTypes.ENUM('Warning', 'Restriction', 'Suspension', 'Termination', 'Closed'),
      allowNull: false,
    },
    caseStatus: {
      type: DataTypes.ENUM('Open', 'Resolved'),
      allowNull: false,
      defaultValue: 'Open',
    },
    reasonCategory: {
      type: DataTypes.ENUM(
        'Payment Issue',
        'Document Issue',
        'Declaration Issue',
        'Policy Violation',
        'Security Concern',
        'Confirmed Fraud',
        'Unauthorized Access',
        'Repeated Violation',
        'Customer Request',
        'Other'
      ),
      allowNull: false,
    },
    // Shown in the pop-up when the cursor hovers the Reason Category cell, so it
    // is mandatory rather than optional.
    reasonDetails: { type: DataTypes.TEXT, allowNull: false },
    // Mirrors the customer's own status vocabulary before and after the case.
    previousStatus: { type: DataTypes.STRING(20), allowNull: true },
    newStatus: { type: DataTypes.STRING(20), allowNull: true },
    // When the status change took effect, and who decided it.
    effectiveAt: { type: DataTypes.DATE, allowNull: true },
    decidedBy: { type: DataTypes.INTEGER, allowNull: true },
    // Record the case is about, chosen from the customer's own records by search
    // in the modal. The key re-resolves the row server-side so a crafted request
    // cannot attach a case to someone else's record; the ref and label are kept
    // alongside it so the history still reads correctly if the record is renamed.
    relatedRecord: { type: DataTypes.STRING(100), allowNull: true },
    relatedRecordKey: { type: DataTypes.STRING(60), allowNull: true },
    relatedRecordType: { type: DataTypes.STRING(60), allowNull: true },

    // Formal Notice raised with the case. Mandatory for the restricted statuses.
    noticeId: { type: DataTypes.STRING(20), allowNull: true },
    noticeType: { type: DataTypes.STRING(60), allowNull: true },
    notificationChannels: { type: DataTypes.TEXT, allowNull: true },
    noticeSubject: { type: DataTypes.STRING(255), allowNull: true },
    noticeMessage: { type: DataTypes.TEXT, allowNull: true },
    noticeSentAt: { type: DataTypes.DATE, allowNull: true },
    noticeResults: { type: DataTypes.TEXT, allowNull: true },
    // Notice sent time plus seven calendar days. Warning cases only.
    correctionDeadline: { type: DataTypes.DATE, allowNull: true },

    // Resolution, written when the case is resolved. The row itself is kept.
    resolvedAt: { type: DataTypes.DATE, allowNull: true },
    approvedBy: { type: DataTypes.INTEGER, allowNull: true },
    resolutionNote: { type: DataTypes.TEXT, allowNull: true },
    // The notice that told the customer the case was closed and the account put
    // back into good standing. Stored the same way as the opening notice so the
    // case keeps both halves of what the customer was sent.
    resolutionNoticeId: { type: DataTypes.STRING(20), allowNull: true },
    resolutionNoticeSubject: { type: DataTypes.STRING(255), allowNull: true },
    resolutionNoticeMessage: { type: DataTypes.TEXT, allowNull: true },
    resolutionNoticeSentAt: { type: DataTypes.DATE, allowNull: true },
    resolutionNoticeResults: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: 'account_actions',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['case_id'] },
      { fields: ['user_id', 'case_status'] },
    ],
  }
);

export default AccountAction;
