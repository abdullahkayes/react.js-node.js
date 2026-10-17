import { QueryTypes } from 'sequelize';
import { sequelize } from './db.js';
import { Customer, Address, RateCard, Shipment, ShipmentItem, TrackingEvent, Payment, Invoice, InvoiceItem, Quotation, QuotationItem, Document, ReturnRTO, Insurance, Claim, SelfPurchaseRequest, SelfPurchaseItem, AssistedPurchaseRequest, AssistedPurchaseItem, BookShipmentRequest, BookShipmentItem, ContactVerificationRecord, InformationRequest, KYC, KYCReview, AccountAction, CustomerNotification, NotificationDelivery, PolicyAcceptance } from '../models/index.js';

/**
 * Adds a column to a table when it is not there yet.
 *
 * `model.sync({ alter: true })` normally covers this, but it rebuilds the whole
 * table and skips columns it cannot map safely, so a column that the details page
 * depends on has to be created explicitly. Doing it one column at a time also
 * means a column that is already present costs a single lookup.
 */
const addColumnIfMissing = async (table, column, definition) => {
  if (sequelize.getDialect() !== 'mysql') return false;
  try {
    const rows = await sequelize.query(
      'SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
      { replacements: [table, column], type: QueryTypes.SELECT }
    );
    if (rows.length) return false;
    await sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`Added ${column} to ${table}`);
    return true;
  } catch (error) {
    console.warn(`Could not add ${column} to ${table}:`, error.message);
    return false;
  }
};

/**
 * The columns the admin request-details pages read that predate this code.
 *
 * Without them a request that predates the change has no item dimensions to
 * calculate a chargeable volume from and no acceptance status to gate approval
 * on, so the pages would silently show nothing for those rows.
 */
const REQUEST_DETAIL_COLUMNS = {
  self_purchase_items: [
    ['length_cm', 'DECIMAL(10,2) NULL'],
    ['width_cm', 'DECIMAL(10,2) NULL'],
    ['height_cm', 'DECIMAL(10,2) NULL'],
    ['weight_kg', 'DECIMAL(10,3) NULL'],
    ['invoice_file_path', 'VARCHAR(500) NULL'],
    ['acceptance_status', "ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending'"],
    ['acceptance_classification', "ENUM('Allowed','Prohibited','Restricted','Conditionally Accepted','Product-Specific Verification') NULL DEFAULT 'Allowed'"],
    ['acceptance_note', 'TEXT NULL'],
    ['acceptance_reviewed_at', 'DATETIME NULL'],
    ['acceptance_reviewed_by', 'INTEGER NULL'],
  ],
  self_purchase_requests: [
    ['final_delivery_method', 'VARCHAR(100) NULL'],
    ['delivery_address', 'VARCHAR(255) NULL'],
    ['customer_instructions', 'TEXT NULL'],
    ['sender_address_id', 'INTEGER NULL'],
    ['receiver_address_id', 'INTEGER NULL'],
  ],
  // The assisted-purchase flow stores its delivery answers in the same columns as
  // the self-purchase flow, and its items needed the measurements the self-purchase
  // items already had.
  assisted_purchase_requests: [
    ['final_delivery_method', 'VARCHAR(100) NULL'],
    ['delivery_address', 'VARCHAR(255) NULL'],
    ['customer_instructions', 'TEXT NULL'],
    ['sender_address_id', 'INTEGER NULL'],
    ['receiver_address_id', 'INTEGER NULL'],
  ],
  assisted_purchase_items: [
    ['length_cm', 'DECIMAL(10,2) NULL'],
    ['width_cm', 'DECIMAL(10,2) NULL'],
    ['height_cm', 'DECIMAL(10,2) NULL'],
    ['weight_kg', 'DECIMAL(10,3) NULL'],
    ['acceptance_status', "ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending'"],
    ['acceptance_classification', "ENUM('Allowed','Prohibited','Restricted','Conditionally Accepted','Product-Specific Verification') NULL DEFAULT 'Allowed'"],
    ['acceptance_note', 'TEXT NULL'],
    ['acceptance_reviewed_at', 'DATETIME NULL'],
    ['acceptance_reviewed_by', 'INTEGER NULL'],
  ],
  // An export booking already stores length/width/height per item, so only the
  // review state and the delivery-method/instruction columns are added here.
  book_shipment_items: [
    ['acceptance_status', "ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending'"],
    ['acceptance_classification', "ENUM('Allowed','Prohibited','Restricted','Conditionally Accepted','Product-Specific Verification') NULL DEFAULT 'Allowed'"],
    ['acceptance_note', 'TEXT NULL'],
    ['acceptance_reviewed_at', 'DATETIME NULL'],
    ['acceptance_reviewed_by', 'INTEGER NULL'],
  ],
  book_shipment_requests: [
    ['final_delivery_method', 'VARCHAR(100) NULL'],
    ['customer_instructions', 'TEXT NULL'],
    ['sender_address_id', 'INTEGER NULL'],
    ['receiver_address_id', 'INTEGER NULL'],
  ],
  documents: [
    ['request_type', 'VARCHAR(50) NULL'],
    ['request_id', 'INTEGER NULL'],
    ['request_item_id', 'INTEGER NULL'],
  ],
};

/**
 * The information-request table changes the Request Information modal depends on.
 *
 * The four classification columns become nullable because a request-level notice
 * names the items it concerns and writes the message directly, rather than
 * classifying the gap in the customer's records the way the customer-level form
 * does. The customer-level endpoint still requires all four, so relaxing the
 * columns does not weaken that flow - only the storage is shared.
 *
 * MODIFY COLUMN is needed rather than an add-if-missing check, because these
 * columns already exist and their definition has to change.
 */
const INFORMATION_REQUEST_COLUMNS = [
  ['information_type', 'VARCHAR(60) NULL'],
  ['specific_information', 'VARCHAR(120) NULL'],
  ['action_required', 'VARCHAR(60) NULL'],
  ['reason', 'VARCHAR(120) NULL'],
  ['related_request_type', 'VARCHAR(50) NULL'],
  ['related_request_id', 'INTEGER NULL'],
  ['related_item_ids', 'TEXT NULL'],
];

/**
 * Adds an index when one of the same name is not there yet.
 *
 * Returns whether it was created, so a caller can tell a fresh database from one
 * that already has the guarantee.
 */
const addIndexIfMissing = async (table, indexName, columns, { unique = false } = {}) => {
  if (sequelize.getDialect() !== 'mysql') return false;
  try {
    const rows = await sequelize.query(
      'SELECT INDEX_NAME FROM information_schema.statistics WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?',
      { replacements: [table, indexName], type: QueryTypes.SELECT }
    );
    if (rows.length) return false;
    const kind = unique ? 'UNIQUE INDEX' : 'INDEX';
    await sequelize.query(`ALTER TABLE \`${table}\` ADD ${kind} \`${indexName}\` (${columns})`);
    console.log(`Added ${kind} ${indexName} to ${table} (${columns})`);
    return true;
  } catch (error) {
    console.warn(`Could not add ${indexName} to ${table}:`, error.message);
    return false;
  }
};

/**
 * Drops indexes that duplicate another index on the same columns.
 *
 * `model.sync({ alter: true })` re-adds an index under a new name
 * (`tracking_number_2`, `tracking_number_3`, ...) instead of reusing the one it
 * already created, so a table that has been synced repeatedly accumulates one
 * copy per run. MySQL allows only 64 keys per table, and once that budget is
 * spent the sync fails outright - which stops new columns on that table's model
 * from ever being added.
 *
 * Only true duplicates are dropped: the primary key, and any index covering a
 * column a foreign key relies on, are always kept, and each group keeps at least
 * one index. The result is the same query plans with the key budget freed.
 */
const dropRedundantIndexes = async (table) => {
  if (sequelize.getDialect() !== 'mysql') return 0;

  try {
    const indexes = await sequelize.query(
      `SELECT INDEX_NAME, NON_UNIQUE,
              GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols
       FROM information_schema.statistics
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
       GROUP BY INDEX_NAME, NON_UNIQUE`,
      { replacements: [table], type: QueryTypes.SELECT }
    );

    // A foreign key is satisfied by any index on its column, so the whole group
    // for a constrained column is left alone rather than guessed at.
    const foreignKeys = await sequelize.query(
      `SELECT DISTINCT COLUMN_NAME FROM information_schema.key_column_usage
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
      { replacements: [table], type: QueryTypes.SELECT }
    );
    const constrained = new Set(foreignKeys.map((fk) => fk.COLUMN_NAME));

    const groups = new Map();
    indexes.forEach((row) => {
      if (row.INDEX_NAME === 'PRIMARY') return;
      const columns = String(row.cols).split(',');
      if (columns.some((column) => constrained.has(column))) return;

      const key = `${row.NON_UNIQUE}|${row.cols}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row.INDEX_NAME);
    });

    let dropped = 0;
    for (const names of groups.values()) {
      if (names.length < 2) continue;

      // Keep the original name: the numbered ones are all copies of it.
      const keep = names
        .slice()
        .sort((a, b) => {
          const numbered = /_(\d+)$/;
          const aNumbered = numbered.test(a) ? Number(a.match(numbered)[1]) : 0;
          const bNumbered = numbered.test(b) ? Number(b.match(numbered)[1]) : 0;
          return aNumbered - bNumbered || a.localeCompare(b);
        })[0];

      for (const name of names) {
        if (name === keep) continue;
        try {
          await sequelize.query(`ALTER TABLE \`${table}\` DROP INDEX \`${name}\``);
          dropped += 1;
        } catch (error) {
          console.warn(`Could not drop ${name} from ${table}:`, error.message);
        }
      }
    }

    if (dropped) console.log(`Dropped ${dropped} redundant index(es) from ${table}`);
    return dropped;
  } catch (error) {
    console.warn(`Could not tidy indexes on ${table}:`, error.message);
    return 0;
  }
};

/**
 * Ensures an index exists *and* is unique.
 *
 * A non-unique index with the right name satisfies a name-only existence check
 * while providing none of the guarantee it was added for, so uniqueness is
 * verified and a wrongly-created index is rebuilt rather than trusted.
 */
const ensureUniqueIndex = async (table, indexName, columns) => {
  if (sequelize.getDialect() !== 'mysql') return false;
  try {
    const rows = await sequelize.query(
      'SELECT NON_UNIQUE FROM information_schema.statistics WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?',
      { replacements: [table, indexName], type: QueryTypes.SELECT }
    );

    if (rows.length) {
      if (String(rows[0].NON_UNIQUE) === '0') return true;

      // Right name, wrong kind. Dropping it first is required because MySQL will
      // not convert a non-unique index into a unique one in place.
      const duplicates = await sequelize.query(
        `SELECT ${columns.split(',').map((column) => column.trim().replace(/`/g, '')).join(', ')}, COUNT(*) AS n
         FROM \`${table}\`
         GROUP BY ${columns.split(',').map((column) => column.trim().replace(/`/g, '')).join(', ')}
         HAVING COUNT(*) > 1`,
        { type: QueryTypes.SELECT }
      );
      if (duplicates.length) {
        console.warn(
          `Not making ${indexName} unique on ${table}: ${duplicates.length} existing duplicate group(s) would violate it`
        );
        return false;
      }

      await sequelize.query(`ALTER TABLE \`${table}\` DROP INDEX \`${indexName}\``);
      console.log(`Rebuilt ${indexName} on ${table} as UNIQUE`);
    }

    await sequelize.query(`ALTER TABLE \`${table}\` ADD UNIQUE INDEX \`${indexName}\` (${columns})`);
    return true;
  } catch (error) {
    console.warn(`Could not ensure ${indexName} on ${table}:`, error.message);
    return false;
  }
};

/**
 * Narrows the item acceptance-classification column to the four classes the review
 * modal offers.
 *
 * "Product-Specific Verification" was withdrawn from the workflow. Any row still
 * carrying it is first moved to "Allowed", because that is the only value in the
 * shortened list that asserts nothing about the goods - silently reclassifying an
 * item as anything stronger would invent a decision no one made. The count is
 * logged so the change is visible rather than silent.
 */
const ACCEPTANCE_CLASSIFICATIONS = ['Allowed', 'Prohibited', 'Restricted', 'Conditionally Accepted'];
const WITHDRAWN_CLASSIFICATION = 'Product-Specific Verification';

const narrowAcceptanceClassifications = async () => {
  if (sequelize.getDialect() !== 'mysql') return;

  const definition = `ENUM(${ACCEPTANCE_CLASSIFICATIONS.map((value) => `'${value}'`).join(',')}) NULL DEFAULT 'Allowed'`;

  for (const table of ['self_purchase_items', 'assisted_purchase_items', 'book_shipment_items']) {
    try {
      const [rows] = await sequelize.query(
        'SELECT COLUMN_TYPE FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
        { replacements: [table, 'acceptance_classification'] }
      );
      if (!rows.length || rows[0].COLUMN_TYPE === definition) continue;

      const [stale] = await sequelize.query(
        `SELECT COUNT(*) AS n FROM \`${table}\` WHERE acceptance_classification = ?`,
        { replacements: [WITHDRAWN_CLASSIFICATION], type: QueryTypes.SELECT }
      );
      if (stale && stale.n > 0) {
        await sequelize.query(
          `UPDATE \`${table}\` SET acceptance_classification = 'Allowed' WHERE acceptance_classification = ?`,
          { replacements: [WITHDRAWN_CLASSIFICATION] }
        );
        console.log(`Moved ${stale.n} withdrawn classification(s) on ${table} to Allowed`);
      }

      await sequelize.query(`ALTER TABLE \`${table}\` MODIFY COLUMN \`acceptance_classification\` ${definition}`);
      console.log(`Narrowed acceptance_classification on ${table}`);
    } catch (error) {
      console.warn(`Could not narrow acceptance_classification on ${table}:`, error.message);
    }
  }
};

const syncDatabase = async () => {
  try {
    const qi = sequelize.getQueryInterface();

    // 1) Ensure the customers table exists.
    try {
      await Customer.sync({ force: false, alter: true });
    } catch (error) {
      console.warn(`Customer sync warning: ${error.message}`);
    }

    // 2) Drop stale foreign keys that still point at users.
    if (sequelize.getDialect() === 'mysql') {
      const [fkRows] = await sequelize.query(`
        SELECT TABLE_NAME, CONSTRAINT_NAME
        FROM information_schema.key_column_usage
        WHERE TABLE_SCHEMA = DATABASE()
          AND REFERENCED_TABLE_NAME = 'users'
      `);

      for (const row of fkRows) {
        try {
          await sequelize.query(`ALTER TABLE \`${row.TABLE_NAME}\` DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\``);
        } catch (error) {
          console.warn(`Could not drop FK ${row.CONSTRAINT_NAME}: ${error.message}`);
        }
      }
    }

    // 3) Migrate any legacy data into customers.
    const tables = (await qi.showAllTables()).map((value) => String(value ?? '').replace(/`/g, '').toLowerCase());
    if (tables.includes('users') && tables.includes('customers')) {
      try {
        await sequelize.query(`
          INSERT INTO customers (id, name, email, password_hash, phone, role, account_type, home_address, warehouse_address, whatsapp, trade_license, created_at, updated_at)
          SELECT id, name, email, passwordHash, phone, role, account_type, home_address, warehouse_address, whatsapp, trade_license, created_at, updated_at
          FROM users
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            email = VALUES(email),
            password_hash = VALUES(password_hash),
            phone = VALUES(phone),
            role = VALUES(role),
            account_type = VALUES(account_type),
            home_address = VALUES(home_address),
            warehouse_address = VALUES(warehouse_address),
            whatsapp = VALUES(whatsapp),
            trade_license = VALUES(trade_license),
            updated_at = VALUES(updated_at)
        `);
        console.log('Migrated data from users to customers');
      } catch (error) {
        console.warn('Failed to migrate users -> customers:', error.message);
      }

      try {
        await qi.dropTable('users');
        console.log("Dropped legacy 'users' table");
      } catch (error) {
        console.warn("Failed to drop 'users' table:", error.message);
      }
    }

    // 4) Reattach dependent tables to customers.
    if (sequelize.getDialect() === 'mysql') {
      for (const tableName of ['addresses', 'shipments']) {
        try {
          const [columns] = await sequelize.query(
            'SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = "user_id"',
            { replacements: [tableName] }
          );

          if (columns.length > 0) {
            await sequelize.query(`ALTER TABLE \`${tableName}\` ADD CONSTRAINT \`fk_${tableName}_customers\` FOREIGN KEY (\`user_id\`) REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
          }
        } catch (error) {
          console.warn(`Could not reattach ${tableName} to customers: ${error.message}`);
        }
      }
    }

    // 5) Add nid_path column to self_purchase_requests if missing.
    if (sequelize.getDialect() === 'mysql') {
      try {
        const [cols] = await sequelize.query(
          "SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'self_purchase_requests' AND COLUMN_NAME = 'nid_path'"
        );
        if (cols.length === 0) {
          await sequelize.query("ALTER TABLE `self_purchase_requests` ADD COLUMN `nid_path` VARCHAR(500) NULL");
          console.log("Added nid_path column to self_purchase_requests");
        }
      } catch (error) {
        console.warn("Could not add nid_path column:", error.message);
      }
    }

    // 5b) Add the request-details columns to tables that predate them.
    for (const [table, columns] of Object.entries(REQUEST_DETAIL_COLUMNS)) {
      for (const [column, definition] of columns) {
        await addColumnIfMissing(table, column, definition);
      }
    }

    // Runs after the columns above exist, and narrows the classification list to
    // the four classes the review modal offers.
    await narrowAcceptanceClassifications();

    // 5b-ii) Add the information-request linkage columns, then relax the
    // classification columns to nullable.
    for (const [column, definition] of INFORMATION_REQUEST_COLUMNS) {
      if (await addColumnIfMissing('information_requests', column, definition)) continue;
      // Already present, so only its nullability can still differ.
      if (!/NULL/i.test(definition)) continue;
      try {
        const [rows] = await sequelize.query(
          'SELECT IS_NULLABLE FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
          { replacements: ['information_requests', column] }
        );
        if (rows.length && rows[0].IS_NULLABLE === 'NO') {
          await sequelize.query(`ALTER TABLE \`information_requests\` MODIFY COLUMN \`${column}\` ${definition}`);
          console.log(`Relaxed information_requests.${column} to nullable`);
        }
      } catch (error) {
        console.warn(`Could not relax information_requests.${column}:`, error.message);
      }
    }

    // 5c) One shipment per request, enforced by the database.
    //
    // Approving a request looks its shipment up before creating one, but two
    // staff members can pass that lookup at the same moment. This index is what
    // actually makes a second shipment impossible rather than merely unlikely.
    //
    // MySQL treats each NULL in a unique index as distinct, so shipments created
    // directly rather than from a request - the ones with no source request - are
    // unaffected by it.
    //
    // The tidy-up runs first: repeated syncs leave enough duplicate indexes on
    // this table to use up MySQL's whole key budget, which makes adding this one
    // fail.
    // A shipment created from an approved request can exist before the customer
    // has confirmed an address pair, so both address columns are relaxed to
    // nullable. The customer-facing create endpoint still requires both, so a
    // directly-booked shipment is unaffected.
    for (const column of ['sender_address_id', 'receiver_address_id']) {
      if (await addColumnIfMissing('shipments', column, 'INT NULL')) continue;
      try {
        const [rows] = await sequelize.query(
          'SELECT IS_NULLABLE FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
          { replacements: ['shipments', column] }
        );
        if (rows.length && rows[0].IS_NULLABLE === 'NO') {
          await sequelize.query(`ALTER TABLE \`shipments\` MODIFY \`${column}\` INT NULL`);
          console.log(`Relaxed ${column} on shipments to nullable`);
        }
      } catch (error) {
        console.warn(`Could not relax ${column} on shipments:`, error.message);
      }
    }

    // 5d-i) Track shipment loss for the Insurance & Claims coverage end date.
    //       These back the "Shipment Lost Status" + "Loss Confirmation Date"
    //       rules; added explicitly because they feed a page calculation.
    for (const [column, definition] of [
      ['is_lost', 'TINYINT(1) NOT NULL DEFAULT 0'],
      ['lost_confirmed_at', 'DATETIME NULL'],
    ]) {
      await addColumnIfMissing('shipments', column, definition);
    }

    // 5d) Widen tracking_events.status to the shipment vocabulary.
    //
    // Tracking events are written with the same status names as the shipment they
    // belong to, but the column only accepted the eight legacy names, so writing
    // an event such as "Awaiting Carrier Tracking" or "Cancelled" was refused by
    // the database. The column is widened rather than replaced, so events
    // recorded under the legacy names stay readable.
    if (sequelize.getDialect() === 'mysql') {
      try {
        const TRACKING_STATUSES = [
          'pending', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'returned',
          'Awaiting Carrier Tracking', 'Awaiting Arrival at USA Warehouse', 'Awaiting Arrival at Dhaka Hub',
          'Received at USA Warehouse', 'Received at Dhaka Hub', 'On Hold', 'On Customs Hold', 'On Carrier Hold',
          'In Transit to Warehouse', 'Consolidation in Progress', 'Shipment Locked', 'Ready for Dispatch',
          'Shipped', 'In International Transit', 'Arrived at Destination Country',
          'Customs Clearance in Progress', 'Released from Customs', 'Sorting at Hub', 'Out for Delivery',
          'Cancelled', 'Disposed', 'Seized',
        ];
        const definition = `ENUM(${TRACKING_STATUSES.map((value) => `'${value}'`).join(',')}) NOT NULL`;

        const [rows] = await sequelize.query(
          "SELECT COLUMN_TYPE FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tracking_events' AND COLUMN_NAME = 'status'"
        );

        // Rewritten whenever the stored definition does not already cover every
        // value, which is how a previously-narrower column gets widened.
        if (rows.length && rows[0].COLUMN_TYPE !== definition) {
          await sequelize.query(`ALTER TABLE \`tracking_events\` MODIFY COLUMN \`status\` ${definition}`);
          console.log('Widened tracking_events.status to the shipment vocabulary');
        }
      } catch (error) {
        console.warn('Could not widen tracking_events.status:', error.message);
      }
    }

    await dropRedundantIndexes('shipments');
    await ensureUniqueIndex(
      'shipments',
      'uq_shipments_source_request',
      '`source_request_type`, `source_request_id`'
    );

     // 6) Normalise the legacy `shipments` table.
     //    It predates the current model and is not covered by model.sync(),
     //    so it keeps a stale column set and an old status vocabulary.
     //    This has to run before the Shipment sync below, otherwise
     //    "alter: true" chokes on rows still holding a legacy status.
     if (sequelize.getDialect() === 'mysql') {
        const SHIPMENT_STATUSES = [
          'Awaiting Carrier Tracking', 'Awaiting Arrival at USA Warehouse',
          'Awaiting Arrival at Dhaka Hub', 'Received at USA Warehouse',
          'Received at Dhaka Hub', 'On Hold', 'On Customs Hold', 'On Carrier Hold',
          'In Transit to Warehouse', 'Consolidation in Progress', 'Shipment Locked',
          'Ready for Dispatch', 'Shipped', 'In International Transit',
          'Arrived at Destination Country', 'Customs Clearance in Progress',
          'Released from Customs', 'Sorting at Hub', 'Out for Delivery', 'Delivered',
          'Failed Delivery', 'Cancelled', 'Disposed', 'Seized',
        ];
        // The subset of those statuses a customer is allowed to see, from the
        // Status Source of Truth. Used to give the timeline's earlier rows a
        // visibility now that it records one; the approved list itself lives in
        // src/config/shipmentStatuses.js and is the definition this matches.
        const SHIPMENT_STATUS_CUSTOMER_FACING = [
          'Received at USA Warehouse', 'Received at Dhaka Hub', 'On Hold',
          'On Customs Hold', 'On Carrier Hold', 'Shipment Locked',
          'Ready for Dispatch', 'Shipped', 'In International Transit',
          'Arrived at Destination Country', 'Customs Clearance in Progress',
          'Released from Customs', 'Out for Delivery', 'Delivered',
          'Failed Delivery', 'Cancelled', 'Disposed', 'Seized',
        ];
       const LEGACY_STATUS_MAP = {
         pending: 'Awaiting Carrier Tracking',
         picked_up: 'Shipped',
         in_transit: 'In International Transit',
         customs: 'Customs Clearance in Progress',
         out_for_delivery: 'Out for Delivery',
         delivered: 'Delivered',
         cancelled: 'Cancelled',
         returned: 'Disposed',
       };
       const enumSql = (values) => values.map((v) => `'${v}'`).join(',');

       const columnExists = async (table, column) => {
         const [rows] = await sequelize.query(
           'SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
           { replacements: [table, column] }
         );
         return rows.length > 0;
       };

       // Contact verification status lives on `customers`, which Customer.sync()
       // cannot retrofit: "alter: true" gives up on this table with
       // "Too many keys specified", so the columns are added explicitly.
       // Phone and email are verified during registration, so an existing
       // account that carries a contact value is backfilled as Verified.
       try {
         const verificationCols = [
           ['email_verification_status', "ENUM('Not Required','Pending','Verified') NOT NULL DEFAULT 'Not Required'"],
           ['phone_verification_status', "ENUM('Not Required','Pending','Verified') NOT NULL DEFAULT 'Not Required'"],
           ['email_verified_at', 'DATETIME NULL'],
           ['phone_verified_at', 'DATETIME NULL'],
         ];
         const added = [];
         for (const [column, definition] of verificationCols) {
           if (!(await columnExists('customers', column))) {
             await sequelize.query(`ALTER TABLE \`customers\` ADD COLUMN \`${column}\` ${definition}`);
             added.push(column);
           }
         }
         if (added.length) {
           console.log(`Added contact verification columns to customers: ${added.join(', ')}`);
         }

         // Runs on every boot, not just when the columns were just added, so a
         // failed or partial earlier run is repaired. Only rows still sitting
         // on the default are touched, so real statuses are never overwritten.
         // Sequelize's return shape for UPDATE varies by dialect, so the row
         // counts are read back with a SELECT rather than taken from the result.
         await Promise.all([
           sequelize.query(
             "UPDATE `customers` SET `email_verification_status` = 'Verified', `email_verified_at` = COALESCE(`email_verified_at`, `created_at`) WHERE `email_verification_status` = 'Not Required' AND `email` IS NOT NULL AND `email` <> ''"
           ),
           sequelize.query(
             "UPDATE `customers` SET `phone_verification_status` = 'Verified', `phone_verified_at` = COALESCE(`phone_verified_at`, `created_at`) WHERE `phone_verification_status` = 'Not Required' AND `phone` IS NOT NULL AND `phone` <> ''"
           ),
         ]);
         const verified = await sequelize.query(
           "SELECT COUNT(*) AS `total` FROM `customers` WHERE `email_verification_status` = 'Verified' OR `phone_verification_status` = 'Verified'",
           { type: QueryTypes.SELECT }
         );
         if (verified[0] && verified[0].total > 0) {
           console.log(`Contact verification: ${verified[0].total} customer contact(s) on Verified`);
         }
       } catch (error) {
         console.warn('Could not migrate customers verification columns:', error.message);
       }

       // Customer account documents: verification status, owner, and the
       // nullable shipment link (account documents have no shipment).
       // Document.sync({alter:true}) is not used here because it is not in the
       // synced list and would try to drop the existing shipment FK names.
       try {
         const documentCols = [
           ['user_id', 'INTEGER NULL'],
['related_record', 'VARCHAR(100) NULL'],
            ['related_record_type', 'VARCHAR(50) NULL'],
            ['expiry_date', 'DATE NULL'],
            ['verification_status', "ENUM('Pending','Verified','Rejected','Needs Correction') NOT NULL DEFAULT 'Pending'"],
            ['reviewed_by', 'INTEGER NULL'],
            ['reviewed_at', 'DATETIME NULL'],
            ['review_note', 'TEXT NULL'],
            // Verification record written by the document verification modal.
            ['verification_checklist', 'TEXT NULL'],
            ['verification_problem', 'TEXT NULL'],
            ['verification_required', 'TEXT NULL'],
            ['verification_instructions', 'TEXT NULL'],
             ['notification_subject', 'VARCHAR(255) NULL'],
             ['notification_message', 'TEXT NULL'],
             ['notification_sent_at', 'DATETIME NULL'],
             // Removal. Kept as columns rather than a hard delete so the audit
             // trail can still show who removed a document and when.
             ['removed_at', 'DATETIME NULL'],
             ['removed_by', 'INTEGER NULL'],
          ];
         const added = [];
         for (const [column, definition] of documentCols) {
           if (!(await columnExists('documents', column))) {
             await sequelize.query(`ALTER TABLE \`documents\` ADD COLUMN \`${column}\` ${definition}`);
             added.push(column);
           }
         }

         // Account documents are stored without a shipment.
         const shipmentCol = (await sequelize.query("SHOW COLUMNS FROM `documents` LIKE 'shipment_id'", { type: QueryTypes.SELECT }))[0];
         if (shipmentCol && shipmentCol.Null !== 'YES') {
           await sequelize.query('ALTER TABLE `documents` MODIFY COLUMN `shipment_id` INTEGER NULL');
         }

          // document_type needs the account-document members; the existing
          // shipment-document members must survive the change.
          //
          // It also carries the types the Upload Document modal offers. The
          // widening is additive only: a member already in the column is never
          // dropped, so rows stored under any earlier member stay readable.
          const typeCol = (await sequelize.query("SHOW COLUMNS FROM `documents` LIKE 'document_type'", { type: QueryTypes.SELECT }))[0];
          if (typeCol) {
            const ACCOUNT_TYPES = ['trade_license', 'national_id'];
            // The receipt member was missing from the column even though the
            // rest of the codebase already stores and labels it, so it is added
            // with the upload types rather than assumed to be there.
            const UPLOAD_TYPES = ['receipt', 'source_document', 'return_label', 'rma_document', 'claim_photo', 'awb', 'delivery_order'];
            const required = [...ACCOUNT_TYPES, ...UPLOAD_TYPES];
            const missing = required.filter((t) => !typeCol.Type.includes(`'${t}'`));
            if (missing.length) {
             const current = typeCol.Type
               .replace(/^enum\(/, '')
               .replace(/\)$/, '')
               .split(',')
               .map((v) => v.trim().replace(/^'|'$/g, ''))
               .filter(Boolean);
             const merged = [...current, ...missing];
             await sequelize.query(
               `ALTER TABLE \`documents\` MODIFY COLUMN \`document_type\` ENUM(${merged.map((v) => `'${v}'`).join(',')}) NOT NULL`
             );
           }
         }

         if (added.length) console.log(`Added document columns: ${added.join(', ')}`);

         // Backfill the owner for shipment documents so account-document
         // queries can find them by customer as well.
         await sequelize.query(
           'UPDATE `documents` d JOIN `shipments` s ON d.`shipment_id` = s.id SET d.`user_id` = s.`user_id` WHERE d.`user_id` IS NULL'
         );
        } catch (error) {
          console.warn('Could not migrate documents table:', error.message);
        }

        // ---- Payments: invoice link ------------------------------------------
        //
        // Every payment recorded against a shipment settles an invoice, and the
        // Payments tab reads that link to show the invoice's Due Date and the
        // Linked Invoice section. Nullable so a row written before the column
        // existed - a gateway capture with no invoice - stays readable.
        try {
          const paymentCols = [
            ['invoice_id', 'INTEGER NULL'],
            // The staff account that recorded the payment. The Payments
            // tab reads it for its Recorded By column; rows written
            // before the column existed show a dash.
            ['created_by', 'INT NULL'],
          ];
          const addedPayments = [];
          for (const [column, definition] of paymentCols) {
            if (!(await columnExists('payments', column))) {
              await sequelize.query(`ALTER TABLE \`payments\` ADD COLUMN \`${column}\` ${definition}`);
              addedPayments.push(column);
            }
          }
          if (addedPayments.length) console.log(`Added payment columns: ${addedPayments.join(', ')}`);

          const fkExists = (await sequelize.query(
            "SELECT COUNT(*) AS `total` FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND REFERENCED_TABLE_NAME = 'invoices'",
            { type: QueryTypes.SELECT }
          ))[0];
          if (!fkExists || fkExists.total === 0) {
            const orphans = (await sequelize.query(
              'SELECT COUNT(*) AS `total` FROM `payments` p LEFT JOIN `invoices` i ON p.`invoice_id` = i.id WHERE p.`invoice_id` IS NOT NULL AND i.id IS NULL',
              { type: QueryTypes.SELECT }
            ))[0];
            if (orphans.total === 0) {
              await sequelize.query(
                'ALTER TABLE `payments` ADD CONSTRAINT `fk_payments_invoices` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE'
              );
            } else {
              console.warn(`Payments: ${orphans.total} row(s) reference a missing invoice; link left without its constraint.`);
            }
          }

          /* shipment_id must not be unique. A shipment is paid more than once -
             part payments, a first instalment and a final one, a payment later
             refunded and re-taken - so the unique index this column carried
             made every second payment against the same shipment a constraint
             violation. It is replaced with an ordinary index: the lookups the
             Payments tab does by shipment keep their key, and a shipment is
             free to carry as many payments as it has actually received.

             The column's foreign key has to come off first, because MySQL
             refuses to drop an index a constraint is built on; it is re-added
             afterwards on the ordinary index. */
          const shipmentKey = (await sequelize.query(
            "SHOW INDEX FROM `payments` WHERE Key_name = 'shipment_id' AND Column_name = 'shipment_id'",
            { type: QueryTypes.SELECT }
          ))[0];
          if (shipmentKey && Number(shipmentKey.Non_unique) === 0) {
            const shipmentFks = await sequelize.query(
              "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'shipment_id' AND REFERENCED_TABLE_NAME = 'shipments'",
              { type: QueryTypes.SELECT }
            );
            for (const fk of shipmentFks) {
              await sequelize.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
            }
            await sequelize.query('ALTER TABLE `payments` DROP INDEX `shipment_id`');
            await sequelize.query('ALTER TABLE `payments` ADD INDEX `payments_shipment_id` (`shipment_id`)');
            for (const fk of shipmentFks) {
              await sequelize.query(
                `ALTER TABLE \`payments\` ADD CONSTRAINT \`${fk.CONSTRAINT_NAME}\` FOREIGN KEY (\`shipment_id\`) REFERENCES \`shipments\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
              );
            }
            console.log('Replaced the unique index on payments.shipment_id with an ordinary one');
          }
        } catch (error) {
          console.warn('Could not migrate payments table:', error.message);
        }

        // ---- Invoices: payment status vocabulary ------------------------
        //
        // The Record Payment workflow speaks in the statuses the payment
        // gateway uses - Pending, Reversed, Failed, Completed, Refunded,
        // Partially Refunded, Under Review - and an invoice's Payment
        // Status now carries that vocabulary alongside the values earlier
        // releases stored. Widening is additive only: a member already in
        // the column is never dropped, so rows stored under any earlier
        // member stay readable.
        try {
          const invoiceStatusCol = (await sequelize.query("SHOW COLUMNS FROM `invoices` LIKE 'payment_status'", { type: QueryTypes.SELECT }))[0];
          if (invoiceStatusCol && String(invoiceStatusCol.Type).toLowerCase().startsWith('enum(')) {
            const current = String(invoiceStatusCol.Type)
              .replace(/^enum\(/i, '')
              .replace(/\)$/, '')
              .split(',')
              .map((v) => v.trim().replace(/^'|'$/g, ''))
              .filter(Boolean);
            const required = [
              'Pending',
              'Paid',
              'Partially Paid',
              'Refunded',
              'Failed',
              'Completed',
              'Reversed',
              'Partially Refunded',
              'Under Review',
            ];
            const missing = required.filter((s) => !current.includes(s));
            if (missing.length) {
              const merged = [...current, ...missing];
              await sequelize.query(
                `ALTER TABLE \`invoices\` MODIFY COLUMN \`payment_status\` ENUM(${merged.map((v) => `'${v}'`).join(',')}) NOT NULL DEFAULT 'Pending'`
              );
              console.log(`Widened invoices.payment_status with: ${missing.join(', ')}`);
            }
          }
        } catch (error) {
          console.warn('Could not widen invoices.payment_status:', error.message);
        }

        // ---- Shipment Timeline ------------------------------------------------
        //
        // Two status sequences, kept apart. tracking_events carries the
        // Shipment Status history and needs the columns the timeline records;
        // request_status_events is the Shipment Request Status history, which the
        // request rows never carried because they store only the current status.
        //
        // The status label table is separate from both, because a label generated
        // by one workflow has to read the same on every page that shows it.
        try {
          const trackingCols = ['label', 'visibility', 'created_by'];
          const trackingAdded = [];
          for (const col of trackingCols) {
            if (!(await columnExists('tracking_events', col))) trackingAdded.push(col);
          }
          if (trackingAdded.length) {
            if (trackingAdded.includes('label')) {
              await sequelize.query('ALTER TABLE `tracking_events` ADD COLUMN `label` VARCHAR(255) NULL AFTER `note`');
            }
            if (trackingAdded.includes('visibility')) {
              await sequelize.query(
                "ALTER TABLE `tracking_events` ADD COLUMN `visibility` ENUM('Customer Visible','Internal Only') NOT NULL DEFAULT 'Internal Only' AFTER `label`"
              );
            }
            if (trackingAdded.includes('created_by')) {
              await sequelize.query('ALTER TABLE `tracking_events` ADD COLUMN `created_by` VARCHAR(120) NULL AFTER `visibility`');
            }
            console.log(`Added tracking_events columns: ${trackingAdded.join(', ')}`);
          }

          // Rows written before the timeline carried a visibility are internal
          // until a status says otherwise. The shipment-status ones are labelled
          // from the approved list, so an unlabelled legacy row is staff-facing
          // only where the approved list makes it so.
          const statusVisibilitySql = SHIPMENT_STATUS_CUSTOMER_FACING
            .map((s) => `WHEN '${s.replace(/'/g, "''")}' THEN 'Customer Visible'`).join(' ');
          await sequelize.query(
            `UPDATE \`tracking_events\`
             SET \`visibility\` = CASE \`status\` ${statusVisibilitySql} ELSE 'Internal Only' END
             WHERE \`visibility\` = 'Internal Only' AND \`created_by\` IS NULL`
          );
        } catch (error) {
          console.warn('Could not migrate tracking_events for the timeline:', error.message);
        }

        try {
          if (!(await columnExists('request_status_events', 'request_id'))) {
            await sequelize.query(`
              CREATE TABLE IF NOT EXISTS \`request_status_events\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`request_type\` ENUM('self_purchase','assisted_purchase','export_booking') NOT NULL,
                \`request_id\` VARCHAR(50) NOT NULL,
                \`shipment_id\` INT NULL,
                \`status\` ENUM('Draft','Submitted','Under Review','Need More Information','Approved','Rejected','Cancelled') NOT NULL,
                \`label\` VARCHAR(255) NULL,
                \`visibility\` ENUM('Customer Visible','Internal Only') NOT NULL DEFAULT 'Customer Visible',
                \`created_by\` VARCHAR(120) NULL,
                \`created_at\` DATETIME NOT NULL,
                \`updated_at\` DATETIME NOT NULL,
                PRIMARY KEY (\`id\`),
                KEY \`request_status_events_request_idx\` (\`request_type\`, \`request_id\`),
                KEY \`request_status_events_shipment_idx\` (\`shipment_id\`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `);
            console.log('Created request_status_events table');
          }
        } catch (error) {
          console.warn('Could not create request_status_events:', error.message);
        }

        try {
          if (!(await columnExists('status_reference', 'status_type'))) {
            await sequelize.query(`
              CREATE TABLE IF NOT EXISTS \`status_reference\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`status_type\` ENUM('Shipment Request','Shipment','Item') NOT NULL,
                \`status\` VARCHAR(120) NOT NULL,
                \`label\` VARCHAR(255) NULL,
                \`visibility\` ENUM('Customer Visible','Internal Only') NOT NULL,
                \`is_system_label\` TINYINT(1) NOT NULL DEFAULT 0,
                \`created_at\` DATETIME NOT NULL,
                \`updated_at\` DATETIME NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`status_reference_type_status_unique\` (\`status_type\`, \`status\`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `);
            console.log('Created status_reference table');
          }
        } catch (error) {
          console.warn('Could not create status_reference:', error.message);
        }

        // Seed the timeline of every existing shipment with the request statuses
        // its request has been through. A request stores only the status it is
        // currently on, so the path it took is rebuilt from that status rather
        // than left missing.
        try {
          const { seedRequestStatusHistory } = await import('../services/timelineService.js');
          const seeded = await seedRequestStatusHistory();
          console.log(`Seeded request status history: ${seeded.requests} request(s), ${seeded.recorded} row(s) recorded, ${seeded.skipped} already present`);
        } catch (error) {
          console.warn('Could not seed request status history:', error.message);
        }

        try {
         const statusCol = (await sequelize.query("SHOW COLUMNS FROM `shipments` LIKE 'status'", { type: QueryTypes.SELECT }))[0];
         if (statusCol && !SHIPMENT_STATUSES.every((s) => statusCol.Type.includes(`'${s}'`))) {
           const legacy = Object.keys(LEGACY_STATUS_MAP);
           // MySQL rejects ENUM members that differ only by case, so keep the
           // legacy values that have no case-insensitive twin in the new set.
           const allValues = [
             ...SHIPMENT_STATUSES,
             ...legacy.filter((l) => !SHIPMENT_STATUSES.some((s) => s.toLowerCase() === l.toLowerCase())),
           ];

           // Widen first so legacy rows survive, translate, then narrow.
           await sequelize.query(`ALTER TABLE \`shipments\` MODIFY COLUMN \`status\` ENUM(${enumSql(allValues)}) NOT NULL DEFAULT 'Awaiting Carrier Tracking'`);
           for (const [old, current] of Object.entries(LEGACY_STATUS_MAP)) {
             await sequelize.query('UPDATE `shipments` SET `status` = ? WHERE `status` = ?', { replacements: [current, old] });
           }
           await sequelize.query(`ALTER TABLE \`shipments\` MODIFY COLUMN \`status\` ENUM(${enumSql(SHIPMENT_STATUSES)}) NOT NULL DEFAULT 'Awaiting Carrier Tracking'`);
           console.log('Updated shipments.status ENUM to the current vocabulary');
         }

         if (!(await columnExists('shipments', 'shipment_id'))) {
           await sequelize.query('ALTER TABLE `shipments` ADD COLUMN `shipment_id` VARCHAR(50) NULL AFTER `id`');
           await sequelize.query("UPDATE `shipments` SET `shipment_id` = CONCAT('LEGACY-', `id`) WHERE `shipment_id` IS NULL");
           await sequelize.query('ALTER TABLE `shipments` MODIFY COLUMN `shipment_id` VARCHAR(50) NOT NULL');
           await sequelize.query('ALTER TABLE `shipments` ADD UNIQUE KEY `shipments_shipment_id_unique` (`shipment_id`)');
           console.log('Added shipment_id column to shipments');
         }

         if (!(await columnExists('shipments', 'service_mode'))) {
           await sequelize.query("ALTER TABLE `shipments` ADD COLUMN `service_mode` ENUM('Import','Export') NOT NULL DEFAULT 'Import'");
         }
         if (!(await columnExists('shipments', 'purchase_type'))) {
           await sequelize.query("ALTER TABLE `shipments` ADD COLUMN `purchase_type` ENUM('Self-Purchase','Assisted Purchase','N/A') NOT NULL DEFAULT 'Self-Purchase'");
         }
         if (!(await columnExists('shipments', 'source_request_type'))) {
           await sequelize.query("ALTER TABLE `shipments` ADD COLUMN `source_request_type` ENUM('self_purchase','assisted_purchase','export_booking','direct') NULL DEFAULT 'direct'");
         }
         if (!(await columnExists('shipments', 'source_request_id'))) {
           await sequelize.query('ALTER TABLE `shipments` ADD COLUMN `source_request_id` VARCHAR(50) NULL');
         }

         const payCol = (await sequelize.query("SHOW COLUMNS FROM `shipments` LIKE 'payment_status'", { type: QueryTypes.SELECT }))[0];
         if (payCol && !payCol.Type.includes("'unpaid'")) {
           await sequelize.query("ALTER TABLE `shipments` MODIFY COLUMN `payment_status` ENUM('unpaid','pending','paid','refunded') NOT NULL DEFAULT 'unpaid'");
         }
       } catch (error) {
         console.warn('Could not migrate shipments table:', error.message);
       }
     }

// 7) Explicitly sync models to ensure tables are created.
//    Wrap each in try/catch since MySQL "alter: true" can fail with
//    "Too many keys specified" on tables with many columns/indexes.
    for (const model of [
      SelfPurchaseRequest,
      SelfPurchaseItem,
      AssistedPurchaseRequest,
      AssistedPurchaseItem,
      BookShipmentRequest,
      BookShipmentItem,
      Shipment,
      ShipmentItem,
      TrackingEvent,
      Payment,
      Invoice,
      InvoiceItem,
      Quotation,
      QuotationItem,
      Document,
      ContactVerificationRecord,
      InformationRequest,
       ReturnRTO,
       Insurance,
       Claim,
       KYC,
      KYCReview,
      AccountAction,
      CustomerNotification,
      NotificationDelivery,
      PolicyAcceptance,
    ]) {
      try {
        await model.sync({ force: false, alter: true });
      } catch (error) {
        console.warn(`Could not sync ${model.name}: ${error.message}`);
      }
    }

    // 7) Fallback: Create book_shipment tables via raw SQL if they don't exist.
    if (sequelize.getDialect() === 'mysql') {
      const BOOK_SHIPMENT_REQUEST_SQL = `
        CREATE TABLE IF NOT EXISTS \`book_shipment_requests\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`requestId\` VARCHAR(50) NOT NULL UNIQUE,
          \`userId\` INT NOT NULL,
          \`status\` ENUM('Draft','Submitted','Under Review','Need More Information','Approved','Rejected','In Transit','Delivered','Cancelled') NOT NULL DEFAULT 'Draft',
          \`requestedServiceLevel\` ENUM('air','sea') NOT NULL DEFAULT 'air',
          \`freightMode\` ENUM('air','sea') NOT NULL DEFAULT 'air',
          \`customerType\` VARCHAR(50) NOT NULL DEFAULT 'Retail Customer',
          \`pickupFrom\` VARCHAR(200),
          \`destinationCountry\` VARCHAR(100),
          \`consigneeName\` VARCHAR(200),
          \`consigneePhone\` VARCHAR(50),
          \`consigneeAddress\` TEXT,
          \`city\` VARCHAR(100),
          \`region\` VARCHAR(100),
          \`zipCode\` VARCHAR(20),
          \`shipmentInstructions\` TEXT,
          \`addPackageInsurance\` BOOLEAN NOT NULL DEFAULT 0,
          \`termsAccepted\` BOOLEAN NOT NULL DEFAULT 0,
          \`customsAccepted\` BOOLEAN NOT NULL DEFAULT 0,
          \`nidPath\` VARCHAR(500),
          \`paymentReceiptPath\` VARCHAR(500),
          \`submittedAt\` DATETIME,
          \`createdAt\` DATETIME NOT NULL,
          \`updatedAt\` DATETIME NOT NULL,
          PRIMARY KEY (\`id\`),
          KEY \`book_shipment_requests_userId\` (\`userId\`),
          CONSTRAINT \`book_shipment_requests_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`customers\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci
      `;
      const BOOK_SHIPMENT_ITEM_SQL = `
        CREATE TABLE IF NOT EXISTS \`book_shipment_items\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`requestId\` INT NOT NULL,
          \`itemType\` VARCHAR(50) NOT NULL DEFAULT 'Products / Goods',
          \`itemSource\` VARCHAR(50) NOT NULL,
          \`trackingNumber\` VARCHAR(100),
          \`sellerStoreName\` VARCHAR(200),
          \`productDescription\` TEXT NOT NULL,
          \`productCategory\` VARCHAR(100) NOT NULL,
          \`quantity\` INT NOT NULL DEFAULT 1,
          \`invoiceValue\` DECIMAL(10,2) NOT NULL DEFAULT 0,
          \`unitPrice\` DECIMAL(10,2),
          \`packageCount\` INT NOT NULL DEFAULT 1,
          \`estimatedWeight\` DECIMAL(10,2),
          \`length\` DECIMAL(10,2),
          \`width\` DECIMAL(10,2),
          \`height\` DECIMAL(10,2),
          \`hsCode\` VARCHAR(50),
          \`countryOfOrigin\` VARCHAR(100),
          \`productUrl\` VARCHAR(500),
          \`invoiceFilePath\` VARCHAR(500),
          \`packingListPath\` VARCHAR(500),
          \`supportingDocsPath\` VARCHAR(500),
          \`screenshotPath\` VARCHAR(500),
          \`createdAt\` DATETIME NOT NULL,
          \`updatedAt\` DATETIME NOT NULL,
          PRIMARY KEY (\`id\`),
          KEY \`book_shipment_items_requestId\` (\`requestId\`),
          CONSTRAINT \`book_shipment_items_requestId_fkey\` FOREIGN KEY (\`requestId\`) REFERENCES \`book_shipment_requests\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci
      `;
      try {
        await sequelize.query(BOOK_SHIPMENT_REQUEST_SQL);
        await sequelize.query(BOOK_SHIPMENT_ITEM_SQL);
        console.log('Created book_shipment_requests and book_shipment_items tables via raw SQL fallback');
      } catch (error) {
        console.warn('Could not create book_shipment tables via raw SQL:', error.message);
      }
     }

     // 8) Add item_type and item_source columns to assisted_purchase_items if missing.
     if (sequelize.getDialect() === 'mysql') {
       try {
         const [itemTypeCols] = await sequelize.query(
           "SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assisted_purchase_items' AND COLUMN_NAME IN ('item_type', 'item_source')"
         );
         const existingCols = itemTypeCols.map(c => c.COLUMN_NAME);
         if (!existingCols.includes('item_type')) {
           await sequelize.query("ALTER TABLE `assisted_purchase_items` ADD COLUMN `item_type` VARCHAR(50) NOT NULL DEFAULT 'Products / Goods'");
           console.log("Added item_type column to assisted_purchase_items");
         }
         if (!existingCols.includes('item_source')) {
           await sequelize.query("ALTER TABLE `assisted_purchase_items` ADD COLUMN `item_source` VARCHAR(50) NULL");
           console.log("Added item_source column to assisted_purchase_items");
         }
        } catch (error) {
          console.warn("Could not add item_type/item_source columns to assisted_purchase_items:", error.message);
        }
      }

      // 9) Seed the contact verification history.
      // The history is a real table, but pre-existing customers predate it.
      // One row per contact method is created from the customer's current
      // verification status so the Contact Verification History section shows
      // the present record. Runs once per customer/contact pair.
      if (sequelize.getDialect() === 'mysql') {
        try {
         const before = await sequelize.query(
           'SELECT COUNT(*) AS `total` FROM `contact_verification_records`',
           { type: QueryTypes.SELECT }
         );
         await Promise.all([
           sequelize.query(`
             INSERT INTO \`contact_verification_records\`
               (\`user_id\`, \`contact_type\`, \`contact_value\`, \`status\`,
                \`requested_at\`, \`completed_at\`, \`created_at\`, \`updated_at\`)
             SELECT c.\`id\`, 'Email', c.\`email\`, c.\`email_verification_status\`,
                    c.\`created_at\`, c.\`email_verified_at\`, c.\`created_at\`, NOW()
             FROM \`customers\` c
             WHERE c.\`email\` IS NOT NULL AND c.\`email\` <> ''
               AND NOT EXISTS (
                 SELECT 1 FROM \`contact_verification_records\` r
                 WHERE r.\`user_id\` = c.\`id\` AND r.\`contact_type\` = 'Email'
               )
           `),
           sequelize.query(`
             INSERT INTO \`contact_verification_records\`
               (\`user_id\`, \`contact_type\`, \`contact_value\`, \`status\`,
                \`requested_at\`, \`completed_at\`, \`created_at\`, \`updated_at\`)
             SELECT c.\`id\`, 'Phone', c.\`phone\`, c.\`phone_verification_status\`,
                    c.\`created_at\`, c.\`phone_verified_at\`, c.\`created_at\`, NOW()
             FROM \`customers\` c
             WHERE c.\`phone\` IS NOT NULL AND c.\`phone\` <> ''
               AND NOT EXISTS (
                 SELECT 1 FROM \`contact_verification_records\` r
                 WHERE r.\`user_id\` = c.\`id\` AND r.\`contact_type\` = 'Phone'
               )
           `),
         ]);
         const after = await sequelize.query(
           'SELECT COUNT(*) AS `total` FROM `contact_verification_records`',
           { type: QueryTypes.SELECT }
         );
         const total = after[0].total;
         if (total !== before[0].total) {
           console.log(`Seeded contact verification history: ${total} record(s) total`);
         }
        } catch (error) {
          console.warn('Could not seed contact verification history:', error.message);
        }
      }


      // 10) Seed the compliance profiles.
      // The KYC tables are real tables, but customers that predate them have no
      // row, and the Compliance tab reads every summary card and the whole
      // profile from that row. One default row is created per customer that has
      // none, so an existing customer renders the documented defaults
      // ("Not Required Yet" / "Standard" / "Not Required") instead of nothing.
      // New customers get their row at registration instead.
      if (sequelize.getDialect() === 'mysql') {
        try {
          const before = await sequelize.query(
            'SELECT COUNT(*) AS `total` FROM `kyc_profiles`',
            { type: QueryTypes.SELECT }
          );
          await sequelize.query(`
            INSERT INTO \`kyc_profiles\`
              (\`user_id\`, \`kyc_status\`, \`risk_tier\`, \`manual_review_required\`,
               \`internal_review_note\`, \`last_reviewed_by\`, \`last_reviewed_at\`,
               \`created_at\`, \`updated_at\`)
            SELECT c.\`id\`, 'Not Required Yet', 'Standard', 'Not Required',
                   NULL, NULL, NULL, c.\`created_at\`, NOW()
            FROM \`customers\` c
            WHERE NOT EXISTS (
              SELECT 1 FROM \`kyc_profiles\` k WHERE k.\`user_id\` = c.\`id\`
            )
          `);
          const after = await sequelize.query(
            'SELECT COUNT(*) AS `total` FROM `kyc_profiles`',
            { type: QueryTypes.SELECT }
          );
          const total = after[0].total;
          if (total !== before[0].total) {
            console.log(`Seeded default compliance profiles: ${total} profile(s) total`);
          }
        } catch (error) {
          console.warn('Could not seed default compliance profiles:', error.message);
        }
      }


      // Runs last, because the model syncs above are what create the duplicate
    // indexes this removes. Tidying earlier would just leave the ones they add.
    // It has to happen here at all: a table that has spent its whole key budget
    // cannot have the unique index approval depends on added to it.
    //
    // Every table is covered rather than a chosen few, since the duplicate is
    // created by the sync itself and therefore affects whichever model is synced
    // most often.
    for (const table of (await qi.showAllTables()).map((value) => String(value ?? '').replace(/`/g, '').toLowerCase())) {
      await dropRedundantIndexes(table);
    }

    console.log('Database synced successfully');
    } catch (error) {
      console.error('Error syncing database:', error.message);
     console.error('Continuing without full sync - tables may need manual migration');
   }
};

export { syncDatabase };

const isMainModule = process.argv[1] && process.argv[1].includes('syncDb.js');
if (isMainModule) {
  syncDatabase();
}
