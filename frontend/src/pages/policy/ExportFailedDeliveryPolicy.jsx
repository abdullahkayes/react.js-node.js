import React from 'react';
import { Link } from 'react-router-dom';

const ExportFailedDeliveryPolicy = () => {
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
              <span className="text-slate-200">Export Failed Delivery & Return Policy</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Bangladesh-to-USA Export Failed Delivery and Return Policy
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Policy ID: PLCY-EXP-2026-01 | Applicable to Bangladesh-to-USA Export Shipments
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
                1. Failed Delivery Processing
              </a>
              <a href="#section-2" className="block hover:text-[#FF5C00] transition-colors">
                2. Customer Instructions
              </a>
              <a href="#section-3" className="block hover:text-[#FF5C00] transition-colors">
                3. Applicable Charges
              </a>
              <a href="#section-4" className="block hover:text-[#FF5C00] transition-colors">
                4. Return to Bangladesh
              </a>
              <a href="#section-5" className="block hover:text-[#FF5C00] transition-colors">
                5. Customs Rejection, Seizure, or Disposal
              </a>
              <a href="#section-6" className="block hover:text-[#FF5C00] transition-colors">
                6. Refund and Insurance
              </a>
              <a href="#section-7" className="block hover:text-[#FF5C00] transition-colors">
                7. Failure to Receive Customer Instructions
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
              This Policy applies when a Bangladesh-to-USA Export shipment fails to be delivered to the USA recipient or an incorrect address, recipient un-availability, delivery refusal, customs hold, or any other reason. It provides the framework for resolution and handling of return/storage charges.
            </p>
          </div>

          {/* SECTION 1 */}
          <section id="section-1" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              1. Failed Delivery Processing
            </h2>
            <p className="leading-relaxed">
              When delivery fails due to a failed first try, address correction, withholding, or return process, it is managed according to this export failed delivery policy.
            </p>
            <p className="leading-relaxed">
              Where possible, the parcel will be secured and stored at Dazzling Shipping's USA Warehouse pending further instructions.
            </p>
          </section>

          {/* SECTION 2 */}
          <section id="section-2" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              2. Customer Instructions
            </h2>
            <p className="leading-relaxed">
              The shipper must select one of the following resolution windows within 7 days:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>Redelivery to the correct address</li>
              <li>Address correction and delivery</li>
              <li>Customer pickup from the USA Warehouse</li>
              <li>Return shipment to Bangladesh</li>
              <li>Disposal or abandonment in accordance with disposition and carrier policy</li>
            </ul>
          </section>

          {/* SECTION 3 */}
          <section id="section-3" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              3. Applicable Charges
            </h2>
            <p className="leading-relaxed">
              The customer is responsible for Address Correction, Redelivery, USA Domestic Courier, Warehouse Handling, Storage, Customs Re-entry, Return Freight, and Any Third-Party charges arising from Failed Delivery.
            </p>
            <p className="leading-relaxed">
              Additional fees will be carried out via a Pre-paid Advance Payment and due required approval.
            </p>
          </section>

          {/* SECTION 4 */}
          <section id="section-4" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              4. Return to Bangladesh
            </h2>
            <p className="leading-relaxed">
              An Export Return to Bangladesh happens only when the product is legally eligible for return and the return has been approved by the Customs and Capacity authorities.
            </p>
            <p className="leading-relaxed">
              Due to the Return to secure/reach the Dhaka hub, all applicable charges will be added to the customer's ledger.
            </p>
          </section>

          {/* SECTION 5 */}
          <section id="section-5" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              5. Customs Rejection, Seizure, or Disposal
            </h2>
            <p className="leading-relaxed">
              If Shipment is held, rejected, seized, returned, or disposed of because of an incorrect Declaration, incomplete Documents, Prohibited or Restricted Products, or lack of action provided by the customer, the customer will be responsible for the above obligations and costs.
            </p>
          </section>

          {/* SECTION 6 */}
          <section id="section-6" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              6. Refund and Insurance
            </h2>
            <p className="leading-relaxed">
              After the Shipment has been sent back to our Centre, and items refused/dispatched, the original Freight, Customs Processing, Documentation, and Handling Charges is generally not non-refundable.
            </p>
            <p className="leading-relaxed">
              Any user charge may be adjusted to Customer Wallet or account other than Settlement.
            </p>
            <p className="leading-relaxed">
              Insurance Coverage under Insurance & Compensation Policy is only to be eligible for lost or damaged Export Shipments.
            </p>
            <p className="leading-relaxed">
              Processing fees and customs duties, equipment issued for the Delivery Return, or any other Fees and service fees will not be treated as a material Claim.
            </p>
          </section>

          {/* SECTION 7 */}
          <section id="section-7" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              7. Failure to Receive Customer Instructions
            </h2>
            <p className="leading-relaxed">
              If the recipient misses notices and fails to provide instructions to proceed forward, Dazzling Shipping may, in accordance with applicable law, Customs Rules, and Carrier Policy, place the parcel on Hold, Return to BD, Auction, or Abandon parcel and take appropriate action with minimal notice as the customer's response expiry.
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
                <Link to="/insurance" className="font-bold text-slate-900 hover:text-[#FF5C00] block">Insurance & Claims Policy</Link>
                <p className="text-slate-500 text-[11px]">Details coverage on damaged and lost shipment items.</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200/80 bg-slate-50 space-y-1">
                <Link to="/payment-policy" className="font-bold text-slate-900 hover:text-[#FF5C00] block">Payment & Wallet Policy</Link>
                <p className="text-slate-500 text-[11px]">Invoicing, wallet balances, and fee settlements.</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200/80 bg-slate-50 space-y-1">
                <Link to="/cancellation" className="font-bold text-slate-900 hover:text-[#FF5C00] block">Shipment Cancellation Policy</Link>
                <p className="text-slate-500 text-[11px]">Guidelines on order cancellation and fee adjustments.</p>
              </div>
            </div>
          </div>

          {/* QUESTIONS BOX / FOOTER CALLOUT */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Need help with a failed delivery?</h4>
              <p className="text-slate-500 text-xs">Our support team is ready to assist you with address corrections, redelivery schedules, and returns.</p>
            </div>
            <Link
              to="/contact"
              className="bg-[#FF5C00] hover:bg-[#e05200] text-white text-xs font-bold px-4 py-2.5 rounded transition-colors shrink-0"
            >
              Contact Support
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

export default ExportFailedDeliveryPolicy;