import React from 'react';
import { Link } from 'react-router-dom';

const PaymentPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* ==========================================
    

      {/* ==========================================
          2. PAGE HERO / HEADER BANNER
      ========================================== */}
      <section className="bg-[#0B1220] text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/policies" className="hover:text-white transition-colors">Legal & Policies</Link>
              <span>/</span>
              <span className="text-slate-200">Payment & Wallet Policy</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Payment & Wallet Policy
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Payment verification, advance payment requirements, wallet use and adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. MAIN CONTENT LAYOUT
      ========================================== */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR (STICKY TABLE OF CONTENTS) */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-6 bg-white rounded-lg p-4 border border-slate-200/90 shadow-sm space-y-2 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2 uppercase tracking-wide">
              On This Page
            </div>
            <nav className="space-y-2 text-slate-600 font-medium">
              <a href="#intro" className="block text-[#FF5C00] font-semibold hover:underline">
                Introduction
              </a>
              <a href="#section-1" className="block hover:text-[#FF5C00] transition-colors">
                1. Accepted Payment Methods
              </a>
              <a href="#section-2" className="block hover:text-[#FF5C00] transition-colors">
                2. Invoices and Payment Verification
              </a>
              <a href="#section-3" className="block hover:text-[#FF5C00] transition-colors">
                3. Advance Payment for Assisted Purchase
              </a>
              <a href="#section-4" className="block hover:text-[#FF5C00] transition-colors">
                4. Payment Before Export Shipment Delivery
              </a>
              <a href="#section-5" className="block hover:text-[#FF5C00] transition-colors">
                5. Payment Before Import Shipment Delivery
              </a>
              <a href="#section-6" className="block hover:text-[#FF5C00] transition-colors">
                6. Payment for Import Return Logistics and RTO
              </a>
              <a href="#section-7" className="block hover:text-[#FF5C00] transition-colors">
                7. Overdue Payments and Forced Storage
              </a>
              <a href="#section-8" className="block hover:text-[#FF5C00] transition-colors">
                8. Nature of the Dazzling Shipping Wallet
              </a>
              <a href="#section-9" className="block hover:text-[#FF5C00] transition-colors">
                9. Adding Funds to the Wallet
              </a>
              <a href="#section-10" className="block hover:text-[#FF5C00] transition-colors">
                10. Use of Wallet Balance
              </a>
              <a href="#section-11" className="block hover:text-[#FF5C00] transition-colors">
                11. Transfer of Wallet Balance
              </a>
              <a href="#section-12" className="block hover:text-[#FF5C00] transition-colors">
                12. Withdrawal of Wallet Balance
              </a>
              <a href="#section-13" className="block hover:text-[#FF5C00] transition-colors">
                13. Wallet Balance Validity
              </a>
              <a href="#section-14" className="block hover:text-[#FF5C00] transition-colors">
                14. Refunds and Wallet Credit
              </a>
              <a href="#section-15" className="block hover:text-[#FF5C00] transition-colors">
                15. Promotional/Ad-hoc Charges
              </a>
              <a href="#back-to-policies" className="block hover:text-[#FF5C00] transition-colors">
                ← Back to Policies
              </a>
            </nav>
          </div>
        </aside>

        {/* RIGHT MAIN DOCUMENT CONTAINER */}
        <main className="flex-1 bg-white rounded-lg p-6 sm:p-10 border border-slate-200/90 shadow-sm text-xs leading-relaxed text-slate-600 space-y-8">
          
          {/* INTRO PARAGRAPH */}
          <div id="intro" className="space-y-3">
            <p className="leading-relaxed text-slate-700">
              This Policy governs all payment methods, invoicing procedures, advance payment mandates, wallet functions, refund guidelines, and overdue conditions for Dazzling Shipping's services.
            </p>
          </div>

          {/* SECTION 1 */}
          <section id="section-1" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              1. Accepted Payment Methods
            </h2>
            <p className="leading-relaxed">
              Dazzling Shipping accepts the following payment methods based on the country of operation:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>Cash</li>
              <li>Bank</li>
              <li>bKash</li>
              <li>Nagad</li>
              <li>Online Payment Gateway (Credit/Debit Card, Mobile Banking)</li>
            </ul>
            <p className="leading-relaxed mt-2">
              All electronic payments must be completed through official channels listed on Dazzling Shipping's official portal.
            </p>
          </section>

          {/* SECTION 2 */}
          <section id="section-2" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              2. Invoices and Payment Verification
            </h2>
            <p className="leading-relaxed">
              All fees and expenses are billed via digital invoices issued through the Dashboard or sent via registered email. Each invoice includes a unique reference ID and breakdown of charges.
            </p>
            <p className="leading-relaxed">
              Customers must upload valid transaction references or receipts for manual bank/MFS transfers within the designated time frame. Failure to do so may result in payment matching failures and order holds.
            </p>
            <p className="leading-relaxed">
              Discrepancies in invoices must be reported within 48 hours of issuance. Shipments will not be dispatched until payments are verified in full.
            </p>
          </section>

          {/* SECTION 3 */}
          <section id="section-3" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              3. Advance Payment for Assisted Purchase
            </h2>
            <p className="leading-relaxed">
              For Assisted Purchase orders, customers must pay 100% of the estimated product cost and applicable procurement fees in advance before Dazzling Shipping executes the purchase.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>Product Price</li>
              <li>Procurement or Service Fee</li>
              <li>Tax and VAT</li>
              <li>USA Domestic Shipping Fee</li>
              <li>Estimated International Shipping</li>
              <li>Customs Duties (if applicable)</li>
              <li>Other requested addons</li>
            </ul>
          </section>

          {/* SECTION 4 */}
          <section id="section-4" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              4. Payment Before Export Shipment Delivery
            </h2>
            <p className="leading-relaxed">
              For Bangladesh-to-USA export shipments, all international freight charges, local handling, documentation, and courier costs must be cleared in full before the parcel is dispatched from the local hub or accepted by the international carrier.
            </p>
          </section>

          {/* SECTION 5 */}
          <section id="section-5" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              5. Payment Before Import Shipment Delivery
            </h2>
            <p className="leading-relaxed">
              Import shipments from the USA to Bangladesh will only be released for final home delivery or local warehouse pickup after all remaining dues (such as weight adjustments, customs fees, and local delivery charges) are paid.
            </p>
          </section>

          {/* SECTION 6 */}
          <section id="section-6" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              6. Payment for Import Return Logistics and RTO
            </h2>
            <p className="leading-relaxed">
              If an import shipment encounters return or RTO (Return to Origin) circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>USA Domestic Return Fee / Restocking Fee</li>
              <li>International Return Freight & Handling Charges</li>
              <li>Customs Re-entry and Documentation Fees</li>
              <li>Storage fees accrued at USA or local warehouses</li>
            </ul>
            <p className="leading-relaxed mt-2">
              All return logistics charges must be paid by the customer before the item is re-shipped, returned to the merchant, or disposed of according to the RTO policy.
            </p>
          </section>

          {/* SECTION 7 */}
          <section id="section-7" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              7. Overdue Payments and Forced Storage
            </h2>
            <p className="leading-relaxed">
              Invoices remaining unpaid past their due date will incur late penalties and daily warehouse storage fees.
            </p>
            <p className="leading-relaxed">
              Shipments held due to overdue payments exceeding 30 days may be classified as abandoned and subjected to liquidation or auction to recover incurred costs, in compliance with Dazzling Shipping's storage policy.
            </p>
          </section>

          {/* SECTION 8 */}
          <section id="section-8" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              8. Nature of the Dazzling Shipping Wallet
            </h2>
            <p className="leading-relaxed">
              The Dazzling Shipping Wallet is a virtual account balance maintained within the user's dashboard used exclusively for settling shipment invoices, prepayments, and service fees.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>Non-transferable</li>
              <li>Non-interest bearing</li>
              <li>Tied to the user profile</li>
              <li>Used for instant automated settlements</li>
            </ul>
          </section>

          {/* SECTION 9 */}
          <section id="section-9" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              9. Adding Funds to the Wallet
            </h2>
            <p className="leading-relaxed">
              Users can top up their Wallet via supported online payment gateways, bank transfers, or mobile financial services. Funds will be credited after successful verification by Dazzling Shipping finance operations.
            </p>
          </section>

          {/* SECTION 10 */}
          <section id="section-10" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              10. Use of Wallet Balance
            </h2>
            <p className="leading-relaxed">
              Wallet balance can be applied toward:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>International Shipping Charges</li>
              <li>Customs and Duties</li>
              <li>Assisted Purchase Prepayments</li>
              <li>Packaging Upgrades</li>
              <li>Storage Fees</li>
              <li>Clearing any negative balance on the account</li>
            </ul>
          </section>

          {/* SECTION 11 */}
          <section id="section-11" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              11. Transfer of Wallet Balance
            </h2>
            <p className="leading-relaxed">
              Wallet balances cannot be transferred directly between different user accounts. Exceptions are made only under administrative supervision for merged corporate accounts.
            </p>
          </section>

          {/* SECTION 12 */}
          <section id="section-12" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              12. Withdrawal of Wallet Balance
            </h2>
            <p className="leading-relaxed">
              Wallet funds originating from direct top-ups or refunds may be requested for withdrawal to the user's verified bank account, MFS account, or original payment method.
            </p>
            <p className="leading-relaxed">
              Promotional credits or bonus balances added by Dazzling Shipping are strictly non-withdrawable and can only be applied toward shipping services.
            </p>
          </section>

          {/* SECTION 13 */}
          <section id="section-13" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              13. Wallet Balance Validity
            </h2>
            <p className="leading-relaxed">
              Standard wallet top-ups do not expire. Promotional or campaign credits may carry a specific validity period, after which unused promotional balances will lapse.
            </p>
          </section>

          {/* SECTION 14 */}
          <section id="section-14" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              14. Refunds and Wallet Credit
            </h2>
            <p className="leading-relaxed">
              Refunds approved under Dazzling Shipping's policies are typically credited directly back to the customer's Wallet for immediate use on future shipments.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>Cancelled Orders</li>
              <li>Overcharged Freight Fees</li>
              <li>Successful Item Returns</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Customers can request a cash-out of their wallet refund balance by submitting a formal withdrawal ticket through their profile.
            </p>
          </section>

          {/* SECTION 15 */}
          <section id="section-15" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              15. Promotional/Ad-hoc Charges
            </h2>
            <p className="leading-relaxed">
              Ad-hoc fees or special promotional discounts applied to accounts are subject to review and may be adjusted if system errors or promotional criteria violations occur.
            </p>
          </section>

          {/* BACK TO POLICIES LINK */}
          <div id="back-to-policies" className="pt-4 border-t border-slate-100">
            <Link to="/policies" className="inline-flex items-center text-xs font-bold text-[#FF5C00] hover:underline">
              ← Back to Policies
            </Link>
          </div>

        </main>
      </div>

      {/* ==========================================
          4. FOOTER
      ========================================== */}
   
    </div>
  );
};

export default PaymentPolicy;