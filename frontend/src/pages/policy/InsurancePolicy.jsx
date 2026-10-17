import React from 'react';
import { Link } from 'react-router-dom';

const InsurancePolicy = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* ==========================================
          1. TOP NAVIGATION BAR
      ========================================== */}
      

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
              <span className="text-slate-200">Insurance & Compensation Policy</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Insurance & Compensation Policy
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Policy ID: PLCY-INS-2026-01 | Applicable to Import and Export Shipments
              <span className="block mt-1">Effective Date: 01 January 2026 | Review Date: 31 December 2026 | Version: 1.1</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded transition-colors border border-slate-700">
              Print
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded transition-colors border border-slate-700">
              Download PDF
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. MAIN CONTENT LAYOUT
      ========================================== */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR (STICKY TABLE OF CONTENTS) */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-6 bg-white rounded-lg p-4 border border-slate-200/90 shadow-sm space-y-3 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide">
              On This Page
            </div>
            <nav className="space-y-2.5 text-slate-600 font-medium">
              <a href="#introduction" className="block text-[#FF5C00] font-semibold hover:underline">
                Introduction
              </a>
              <a href="#section-1" className="block hover:text-[#FF5C00] transition-colors">
                1. Optional Shipment Insurance
              </a>
              <a href="#section-2" className="block hover:text-[#FF5C00] transition-colors">
                2. Compensation for Insured Shipments
              </a>
              <a href="#section-3" className="block hover:text-[#FF5C00] transition-colors">
                3. Compensation for Uninsured Shipments
              </a>
              <a href="#section-4" className="block hover:text-[#FF5C00] transition-colors">
                4. Claim Eligibility and Required Documents
              </a>
              <a href="#section-5" className="block hover:text-[#FF5C00] transition-colors">
                5. Where Compensation does not Apply
              </a>
              <a href="#section-6" className="block hover:text-[#FF5C00] transition-colors">
                6. Adjustment for Other Recoveries
              </a>
              <a href="#section-7" className="block hover:text-[#FF5C00] transition-colors">
                7. Claim Records and Decisions
              </a>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">Related Policies</span>
                <div className="space-y-1 pl-1">
                  <Link to="/policy" className="block text-slate-600 hover:text-[#FF5C00]">Return & RTO Policy</Link>
                  <Link to="/terms" className="block text-slate-600 hover:text-[#FF5C00]">Terms & Conditions</Link>
                  <Link to="/payment-policy" className="block text-slate-600 hover:text-[#FF5C00]">Payment & Wallet Policy</Link>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* RIGHT MAIN DOCUMENT CONTAINER */}
        <main className="flex-1 bg-white rounded-lg p-6 sm:p-10 border border-slate-200/90 shadow-sm text-xs leading-relaxed text-slate-600 space-y-8">
          
          {/* INTRO PARAGRAPH */}
          <div id="introduction" className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Introduction</h2>
            <p className="leading-relaxed text-slate-700">
              This Policy applies to coverage and claim rules for eligible Import and Export Shipments. It provides guidelines for securing optional insurance, insured and uninsured compensation limits, required documents, claim procedures, and settlement processes.
            </p>
          </div>

          {/* SECTION 1 */}
          <section id="section-1" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              1. Optional Shipment Insurance
            </h2>
            <p className="leading-relaxed">
              Customers can optionally insure shipments by paying a 3% fee based on the declared item value at the time of booking. This provides coverage against loss, theft, and damage during transit.
            </p>
            <p className="leading-relaxed">
              Under insurance, claims can recover up to 100% of the item value (subject to verification and receipt proof). Shipping charges are non-refundable unless specified in the SLA terms. Claims require valid commercial invoice, proof of payment, packaging photos, and carrier delivery exception reports.
            </p>
          </section>

          {/* SECTION 2 */}
          <section id="section-2" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              2. Compensation for Insured Shipments
            </h2>
            <p className="leading-relaxed">
              An approved claim for an insured shipment covers up to 100% of the verified invoice product value — subject to maximum liability limits as specified in the service tier (e.g., up to USD 5,000 per standard shipment).
            </p>
            <p className="leading-relaxed">
              Compensation includes item value, customs duty/tax (if applicable), and domestic courier cost within limits, but excludes freight charges, handling fees, warehousing, and third-party charges unless covered under specific insurance riders or policy upgrades.
            </p>
            <p className="leading-relaxed">
              Any payout is processed via direct credit to the customer's wallet or bank account within 7 to 10 business days after the final settlement approval.
            </p>
          </section>

          {/* SECTION 3 */}
          <section id="section-3" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              3. Compensation for Uninsured Shipments
            </h2>
            <p className="leading-relaxed">
              For an approved claim on an uninsured shipment, compensation is limited to the baseline carrier liability or standard liability limit as per our Terms of Service (e.g., up to USD 100 per shipment).
            </p>
            <p className="leading-relaxed">
              This compensation covers a portion of the product value or shipping cost, but does not cover full commercial value, customs duties, or losses exceeding the statutory carrier limit.
            </p>
          </section>

          {/* SECTION 4 */}
          <section id="section-4" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              4. Claim Eligibility and Required Documents
            </h2>
            <div className="space-y-2">
              <p className="font-bold text-slate-800">Eligible Claim Events</p>
              <p className="leading-relaxed">
                Claims are valid only for total loss, part loss, physical damage, or missing contents during transit, verified through inspection and carrier scan reports.
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <p className="font-bold text-slate-800">Required Filing Method</p>
              <p className="leading-relaxed">
                All claims must be filed online through the Dazzling Shipping Customer Dashboard.
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <p className="font-bold text-slate-800">Required Information and Evidence</p>
              <p className="leading-relaxed">
                A formal claim request requires: tracking number, original commercial invoice, purchase receipt, packing list, detailed description of the goods and value, date-stamped photographs of damaged goods, outer packaging photos, and any carrier delivery exception report or damage certificate.
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <p className="font-bold text-slate-800">Review and Investigation</p>
              <p className="leading-relaxed">
                Dazzling Shipping investigates all claims normally within 7 to 14 business days.
              </p>
            </div>
          </section>

          {/* SECTION 4.1 */}
          <section id="section-4-1" className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              4.1. Claim Submission Deadline
            </h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700 pl-2">
              <li><strong className="text-slate-900">Total Loss or Delay:</strong> For missing shipments, total loss, or extreme transit delays, the customer must file a claim within 7 days from the scheduled delivery date.</li>
              <li><strong className="text-slate-900">Damage Claims (Visible):</strong> For visible physical damage, claims must be filed within 48 hours of delivery along with photos of the package and item.</li>
              <li><strong className="text-slate-900">Concealed Damage:</strong> For concealed damage discovered after unboxing, claims must be reported within 3 days of delivery with photographic evidence.</li>
              <li><strong className="text-slate-900">Missing/Additional Items:</strong> If items are missing from a box, the customer must file a claim with the original packing list and photos within 3 days of receipt.</li>
              <li><strong className="text-slate-900">Not Delivered or Lost Shipments:</strong> Where a shipment is marked delivered but not received, a claim must be filed within 7 days of the delivery scan date.</li>
              <li><strong className="text-slate-900">Delay Without Physical Damage:</strong> Transit delays do not qualify for compensation unless guaranteed delivery SLAs apply.</li>
              <li><strong className="text-slate-900">Personalized Recovery:</strong> Claims for prohibited items, undeclared goods, electronics without serial numbers, or items packed improperly will be rejected.</li>
              <li><strong className="text-slate-900">Loss Claims and Time Standard:</strong> Standard claims require review within 7-14 business days. Any improper or incomplete claims without proof of value will be rejected.</li>
            </ul>
          </section>

          {/* SECTION 5 */}
          <section id="section-5" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              5. Where Compensation does not Apply
            </h2>
            <p className="leading-relaxed">
              Compensation is not payable for ordinary wear and tear, inherent vice, damages arising from natural disaster, war, customs confiscation, improper packaging by customer, failure to pay customs duties, or prohibited items. Dazzling Shipping assumes no liability for losses resulting from customer non-compliance with Dazzling Shipping's restricted items policy.
            </p>
          </section>

          {/* SECTION 6 */}
          <section id="section-6" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              6. Adjustment for Other Recoveries
            </h2>
            <p className="leading-relaxed">
              If payment is recovered from a third-party carrier or insurance underwriter, this amount will be credited to offset the approved compensation. The customer cannot collect duplicate payouts from multiple sources.
            </p>
          </section>

          {/* SECTION 7 */}
          <section id="section-7" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              7. Claim Records and Decisions
            </h2>
            <p className="leading-relaxed">
              Dazzling Shipping keeps detailed records of all claims and insurance payouts. In case of unresolved disputes, customers can appeal through standard arbitration and legal procedures.
            </p>
          </section>

          {/* RELATED POLICIES SECTION */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-900">Related Policies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-slate-200/80 bg-slate-50 space-y-1">
                <Link to="/policy" className="font-bold text-slate-900 hover:text-[#FF5C00] block">Return & RTO Policy</Link>
                <p className="text-slate-500 text-[11px]">Governs return criteria, RTO guidelines, and customer requests.</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200/80 bg-slate-50 space-y-1">
                <Link to="/terms" className="font-bold text-slate-900 hover:text-[#FF5C00] block">Terms & Conditions</Link>
                <p className="text-slate-500 text-[11px]">General service terms, user responsibilities, and liability limits.</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200/80 bg-slate-50 space-y-1">
                <Link to="/payment-policy" className="font-bold text-slate-900 hover:text-[#FF5C00] block">Payment & Wallet Policy</Link>
                <p className="text-slate-500 text-[11px]">Invoicing, wallet balances, and fee settlements.</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200/80 bg-slate-50 space-y-1">
                <Link to="/prohibited" className="font-bold text-slate-900 hover:text-[#FF5C00] block">Prohibited & Restricted Items</Link>
                <p className="text-slate-500 text-[11px]">Detailed list of forbidden items and restricted cargo restrictions.</p>
              </div>
            </div>
          </div>

          {/* QUESTIONS BOX / FOOTER CALLOUT */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Need to file an insurance claim?</h4>
              <p className="text-slate-500 text-xs">Access the dashboard to submit your claim details within the 7-day claim window.</p>
            </div>
            <Link
              to="/dashboard"
              className="bg-[#FF5C00] hover:bg-[#e05200] text-white text-xs font-bold px-4 py-2.5 rounded transition-colors shrink-0"
            >
              File Insurance Claim
            </Link>
          </div>

          {/* BACK TO POLICIES LINK */}
          <div className="pt-4">
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

export default InsurancePolicy;