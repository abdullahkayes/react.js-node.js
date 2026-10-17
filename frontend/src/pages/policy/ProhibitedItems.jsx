import React from 'react';
import { Link } from 'react-router-dom';

const ProhibitedItems = () => {
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
              <Link to="/policy" className="hover:text-white transition-colors">Import/Policy</Link>
              <span>/</span>
              <span className="text-slate-200">Prohibited, Restricted and Conditionally Accepted Items Policy</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Prohibited, Restricted and Conditionally Accepted Items Policy
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Find products we cannot accept, products requiring documentation or prior approval, and legal shipment standards.
            </p>
            <div className="text-[11px] text-slate-400 mt-2">
              Effective Date: 12-Nov-2025 | Last Updated: 01-Jan-2026 | Version: 2.1
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded border border-slate-700 transition-colors">
              Print
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded border border-slate-700 transition-colors">
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
          <div className="sticky top-6 bg-white rounded-lg p-4 border border-slate-200/90 shadow-sm space-y-2 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2 uppercase tracking-wide">
              On This Page
            </div>
            <nav className="space-y-2 text-slate-600 font-medium">
              <a href="#introduction" className="block text-[#FF5C00] font-semibold hover:underline">
                Introduction
              </a>
              <a href="#section-1" className="block hover:text-[#FF5C00] transition-colors">
                1. Scope and Review Standard
              </a>
              <a href="#section-2" className="block hover:text-[#FF5C00] transition-colors">
                2. USA-to-Bangladesh Import Shipments
              </a>
              <a href="#section-3" className="block hover:text-[#FF5C00] transition-colors">
                3. Bangladesh-to-USA Export Shipments
              </a>
              <a href="#section-4" className="block hover:text-[#FF5C00] transition-colors">
                4. Product Classification
              </a>
              <a href="#section-5" className="block hover:text-[#FF5C00] transition-colors">
                5. Carrier and Company Restrictions
              </a>
              <a href="#section-6" className="block hover:text-[#FF5C00] transition-colors">
                6. Inspection, Refusal and Customer Responsibility
              </a>
              <a href="#section-7" className="block hover:text-[#FF5C00] transition-colors">
                7. Final Acceptance
              </a>
              <a href="#section-8" className="block hover:text-[#FF5C00] transition-colors">
                8. Changes to External Rules
              </a>
              <a href="#section-9" className="block hover:text-[#FF5C00] transition-colors">
                9. List of Prohibited, Restricted and Conditionally Accepted Items
              </a>
              <a href="#related-policies" className="block hover:text-[#FF5C00] transition-colors">
                Related Policies
              </a>
            </nav>
          </div>
        </aside>

        {/* RIGHT MAIN DOCUMENT CONTAINER */}
        <main className="flex-1 bg-white rounded-lg p-6 sm:p-10 border border-slate-200/90 shadow-sm text-xs leading-relaxed text-slate-600 space-y-8">
          
          {/* INTRODUCTION */}
          <section id="introduction" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              Introduction
            </h2>
            <p className="leading-relaxed text-slate-700">
              This policy assists customers in buying or shipping items or prohibited, restricted, or conditionally accepted. It establishes guidelines on what cannot be accepted, items requiring documents, books or online groups for details on order verification.
            </p>
          </section>

          {/* SECTION 1 */}
          <section id="section-1" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              1. Scope and Review Standard
            </h2>
            <p className="leading-relaxed">
              This policy applies to all Dazzling Shipping USA-to-Bangladesh and Bangladesh-to-USA import/export services. Before accepting any item, it must meet safety standards, intellectual property laws, export controls, airline safety regulations, import/export regulatory requirements, Air or Sea Customs rules, and Dazzling Shipping internal compliance requirements. A product must strictly satisfy all standards before approval.
            </p>
          </section>

          {/* SECTION 2 */}
          <section id="section-2" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              2. USA-to-Bangladesh Import Shipments
            </h2>
            <p className="leading-relaxed">
              For imports to Bangladesh, the product must be legally accessible from the USA, comply with US export controls, and meet customs and import laws of Bangladesh. Products must not be restricted or banned by Bangladesh customs or law. Dazzling Shipping does not accept items that cannot be legally imported into the USA or banned/restricted from entry into Bangladesh.
            </p>
            <p className="mt-1 text-slate-500 italic">
              *Note: May be delayed if it requires a license that is not legally exportable from the US, or if prohibited under import laws in Bangladesh.
            </p>
          </section>

          {/* SECTION 3 */}
          <section id="section-3" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              3. Bangladesh-to-USA Export Shipments
            </h2>
            <p className="leading-relaxed">
              For export shipments, the product must be legally exportable from Bangladesh, comply with Bangladesh Export Policy, and relevant export requirements, regulations, or inspection certificates. It must also comply with US import laws and entry requirements, including US Customs, FDA, Fish & Wildlife, Commerce, or regulatory approvals.
            </p>
            <p className="mt-1 leading-relaxed">
              The customer must provide an accurate product name, quantity, value, country of origin, Commercial Invoice and Packing List, certificate of origin, Airway Bill, import certificate, or any other required documentation. Exporting certain items from Bangladesh or importing restricted items into the USA is prohibited or restricted from entering the USA.
            </p>
          </section>

          {/* SECTION 4 */}
          <section id="section-4" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              4. Product Classification
            </h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">Prohibited / Not Accepted</h3>
                <p className="leading-relaxed">
                  Prohibited items are barred by applicable laws, licensing plans, carrier policies, or Customs (US or BD). These are denied and cannot be accepted for shipment.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">Restricted / Prior Approval Required</h3>
                <p className="leading-relaxed">
                  Products must be approved only after Customer Service receives the necessary license, permit, certificate, product registration, safety data sheet, test report, or carrier approval.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-1">Conditionally Accepted</h3>
                <p className="leading-relaxed">
                  Acceptance may depend on the product's quantity, ingredients, battery capacity, packaging, declared value, season, and destination. Customer must submit a description or prior approval is required.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5 */}
          <section id="section-5" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              5. Carrier and Company Restrictions
            </h2>
            <p className="leading-relaxed">
              For producing legal compliance or avoiding operational hazards, Dazzling Shipping, Airlines, Shipping Lines, Port authorities, or Insurance providers may or will not accept it.
            </p>
            <p className="mt-1 leading-relaxed">
              Dazzling Shipping may and will refuse a legally permitted product on grounds of operational risk, safety concerns, packaging limitations, contamination risk, or size.
            </p>
          </section>

          {/* SECTION 6 */}
          <section id="section-6" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              6. Inspection, Refusal and Customer Responsibility
            </h2>
            <p className="leading-relaxed">
              Parcels may be opened and inspected at the USA Warehouse, BD Warehouse, or any other transit checkpoint. If a prohibited product is found, the shipment may be cancelled or destroyed, the payment's account may be permanently blocked, and Dazzling Shipping may take legal or regulatory action below.
            </p>
            <p className="mt-1 leading-relaxed">
              If an item turns out to be prohibited, incomplete, or requires a certification or special license, to add, reject, returned, seized, or destroyed, the customer is bear the resulting legal responsibility and administrative costs.
            </p>
          </section>

          {/* SECTION 7 */}
          <section id="section-7" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              7. Final Acceptance
            </h2>
            <p className="leading-relaxed">
              Prohibited and conditionally accepted products do not receive automatic approval, but acceptance is given only after the required documents, physical inspection, and necessary regulatory or Customs approvals have been completed.
            </p>
            <p className="mt-1 text-slate-500 italic">
              *Approval docs required: Pre-Alert, Claim, Repair/Storage entry form, warehouse check-in entry, confirmation form, final acceptance.
            </p>
          </section>

          {/* SECTION 8 */}
          <section id="section-8" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              8. Changes to External Rules
            </h2>
            <p className="leading-relaxed">
              Government regulations, customs tariffs, billing requirements, exporting or importing regulatory authorities may change. Revised effective legal, customs, regulations and Customs requirements will apply to the Shipment.
            </p>
            <p className="mt-1 leading-relaxed">
              Customer should review the separate List of Prohibited, Restricted and Conditionally Accepted Items and obtain confirmation from Dazzling Shipping before purchasing, buying or sending a legal or restricted item or custom item.
            </p>
          </section>

          {/* SECTION 9 */}
          <section id="section-9" className="space-y-4">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              9. List of Prohibited, Restricted and Conditionally Accepted Items
            </h2>
            <p className="leading-relaxed">
              The item list contains detailed subcategories in a separate page to help customers screen items better before purchasing or buying a shipment. This list aims to secure product review, legal standards, regulatory or Customs approval.
            </p>
            <div>
              <Link to="/policies/prohibited-list" className="text-[#FF5C00] font-semibold hover:underline inline-flex items-center gap-1 mt-1">
                View the List of Prohibited, Restricted and Conditionally Accepted Items →
              </Link>
            </div>
          </section>

          {/* RELATED POLICIES */}
          <section id="related-policies" className="bg-slate-50 p-5 rounded-lg border border-slate-200/90 space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Related Policies</h2>
            <p className="text-slate-600">
              This Privacy Policy should be read together with the Terms of Service and related policies, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium pl-2">
              <li><Link to="/terms" className="text-[#FF5C00] hover:underline">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-[#FF5C00] hover:underline">Privacy Policy</Link></li>
              <li><Link to="/policies/insurance" className="text-[#FF5C00] hover:underline">Insurance & Compensation Policy</Link></li>
              <li><Link to="/policies/return" className="text-[#FF5C00] hover:underline">Return & RTO Policy</Link></li>
              <li><Link to="/policies/payment" className="text-[#FF5C00] hover:underline">Payment & Wallet Policy</Link></li>
              <li><Link to="/policy" className="text-[#FF5C00] hover:underline">Privacy Policy</Link></li>
            </ul>
          </section>

          {/* Banner Box: Unsure whether a product can be shipped? */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Unsure whether a product can be shipped?</h3>
              <p className="text-slate-500 text-xs">Feel free to contact our support team to verify compliance before purchasing items.</p>
            </div>
            <div>
              <Link
                to="/contact"
                className="bg-[#FF5C00] hover:bg-[#e05200] text-white font-bold text-xs px-4 py-2.5 rounded transition-colors inline-block whitespace-nowrap"
              >
                Contact Support
              </Link>
            </div>
          </div>

        </main>
      </div>

      {/* ==========================================
          4. FOOTER
      ========================================== */}
     
    </div>
  );
};

export default ProhibitedItems;