import React from 'react';
import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
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
              <span className="text-slate-200">Return & RTO Policy</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Return & RTO Policy
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Policy ID: PLCY-RTO-2026-01 | Applicable to USA Imports, Export Shipments
              <span className="block mt-1">Effective Date: 01 January 2026 | Version: 2.1 | Review Date: 2026-12-31</span>
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
            <nav className="space-y-3 text-slate-600 font-medium">
              <div>
                <a href="#introduction" className="block text-[#FF5C00] font-semibold hover:underline">
                  Introduction
                </a>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">Part A - Import Return & RTO</span>
                <div className="space-y-1.5 pl-2 border-l border-slate-100">
                  <a href="#a-purpose" className="block hover:text-[#FF5C00] transition-colors">1. Purpose and Scope</a>
                  <a href="#a-types" className="block hover:text-[#FF5C00] transition-colors">2. Types of Returns</a>
                  <a href="#a-eligibility" className="block hover:text-[#FF5C00] transition-colors">3. Return Eligibility</a>
                  <a href="#a-non-returnable" className="block hover:text-[#FF5C00] transition-colors">4. Non-Returnable Items</a>
                  <a href="#a-inspection" className="block hover:text-[#FF5C00] transition-colors">5. Return Inspection</a>
                  <a href="#a-resolution" className="block hover:text-[#FF5C00] transition-colors">6. Return Resolution</a>
                  <a href="#a-charges" className="block hover:text-[#FF5C00] transition-colors">7. Return-Related Charges</a>
                  <a href="#a-merchant" className="block hover:text-[#FF5C00] transition-colors">8. Assisted Purchase Returns</a>
                  <a href="#a-timings" className="block hover:text-[#FF5C00] transition-colors">9. Return Timings</a>
                  <a href="#a-seller-rejection" className="block hover:text-[#FF5C00] transition-colors">10. Seller Rejection of Returns</a>
                  <a href="#a-damage" className="block hover:text-[#FF5C00] transition-colors">11. Storage Billing</a>
                  <a href="#a-responsibility" className="block hover:text-[#FF5C00] transition-colors">12. Waiver of Emergency Responsibility</a>
                  <a href="#a-right-to-reject" className="block hover:text-[#FF5C00] transition-colors">13. Right to Reject Return Request</a>
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">Part B - Export Failed Delivery and Return</span>
                <div className="space-y-1.5 pl-2 border-l border-slate-100">
                  <a href="#b-purpose" className="block hover:text-[#FF5C00] transition-colors">1. Purpose and Scope</a>
                  <a href="#b-delivery" className="block hover:text-[#FF5C00] transition-colors">2. Failed Delivery Processing</a>
                  <a href="#b-communication" className="block hover:text-[#FF5C00] transition-colors">3. Customer Communication</a>
                  <a href="#b-charges" className="block hover:text-[#FF5C00] transition-colors">4. Applicable Charges</a>
                  <a href="#b-return" className="block hover:text-[#FF5C00] transition-colors">5. Return to Bangladesh</a>
                  <a href="#b-abandonment" className="block hover:text-[#FF5C00] transition-colors">6. Abandonment, Auction, or Disposal</a>
                  <a href="#b-insurance" className="block hover:text-[#FF5C00] transition-colors">7. Return and Insurance</a>
                  <a href="#b-responsibility" className="block hover:text-[#FF5C00] transition-colors">8. Disclaimer of Responsibility</a>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block mb-1">Related Policies</span>
                <div className="space-y-1 pl-2">
                  <Link to="/terms" className="block text-slate-600 hover:text-[#FF5C00]">Terms of Service</Link>
                  <Link to="/privacy" className="block text-slate-600 hover:text-[#FF5C00]">Privacy Policy</Link>
                  <Link to="/cancellation" className="block text-slate-600 hover:text-[#FF5C00]">Shipment Cancellation Policy</Link>
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
              This Return & RTO Policy establishes the conditions and procedures for handling returns, Return to Origin (RTO), customer-initiated requests, and failed delivery attempts for both imports and exports managed by Dazzling Shipping. By using our shipping and forwarding services, you agree to the terms outlined in this policy.
            </p>
          </div>

          {/* PART A - IMPORT RETURN & RTO */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              Part A - Import Return & RTO
            </h2>
            <p className="leading-relaxed">
              This section governs returns and RTOs associated with parcels processed through our pickup, handling, & freight network from the USA to Bangladesh.
            </p>

            <section id="a-purpose" className="space-y-2">
              <h3 className="font-bold text-slate-900">1. Purpose and Scope</h3>
              <p className="leading-relaxed">
                This policy covers all incoming shipments processed through Self-Purchase (Self-Purchase) and Assisted Purchase. Dazzling Shipping acts as a forwarding agent and will manage returns and RTO requests according to the parameters set by the merchant or vendor.
              </p>
            </section>

            <section id="a-types" className="space-y-2">
              <h3 className="font-bold text-slate-900">2. Types of Returns</h3>
              <p className="font-semibold text-slate-800">2.1. Carrier Return to Origin (RTO):</p>
              <p className="leading-relaxed pl-2">Occurs when a courier company returns a package to Dazzling Shipping due to incorrect address, refusal, or unclaimed status.</p>
              <p className="font-semibold text-slate-800 mt-2">2.2. Customer Return Request:</p>
              <p className="leading-relaxed pl-2">Requests initiated by the customer to return items to the U.S. merchant, merchant-provided label, or damaged/wrong item cases.</p>
            </section>

            <section id="a-eligibility" className="space-y-2">
              <h3 className="font-bold text-slate-900">3. Return Eligibility</h3>
              <p className="leading-relaxed">
                Return requests must be submitted through the Dazzling Shipping portal within 3 calendar days of U.S. warehouse delivery or local delivery. Items must be unopened, unused, and in the original packaging with all tags attached.
              </p>
              <p className="leading-relaxed">
                * Note: Damage in transit to Bangladesh is covered under our separate transport warranty terms.
              </p>
            </section>

            <section id="a-non-returnable" className="space-y-2">
              <h3 className="font-bold text-slate-900">4. Non-Returnable Items</h3>
              <p className="leading-relaxed">
                Perishables, open-box electronics, hazardous materials, clearance items, and items without return labels are strictly non-returnable by the origin merchant or shipping regulations.
              </p>
            </section>

            <section id="a-inspection" className="space-y-2">
              <h3 className="font-bold text-slate-900">5. Return Inspection</h3>
              <p className="leading-relaxed">
                Returned items will be inspected at our U.S. facility or Dhaka hub prior to processing. Dazzling Shipping reserves the right to reject items that do not meet merchant or quality specifications before proceeding with replacement or refund.
              </p>
            </section>

            <section id="a-resolution" className="space-y-2">
              <h3 className="font-bold text-slate-900">6. Return Resolution</h3>
              <p className="leading-relaxed">
                Upon inspection and merchant review, resolutions will be issued as a wallet credit, return to merchant card, or reshipment according to customer preference and eligibility.
              </p>
            </section>

            <section id="a-charges" className="space-y-2">
              <h3 className="font-bold text-slate-900">7. Return-Related Charges</h3>
              <p className="leading-relaxed">
                Return shipping fees, U.S. domestic shipping, and restocking fees set by merchant policies will be borne by the customer. Dazzling Shipping will deduct applicable fees from the customer's wallet or invoice prior to processing the return.
              </p>
            </section>

            <section id="a-merchant" className="space-y-2">
              <h3 className="font-bold text-slate-900">8. Assisted Purchase Returns</h3>
              <p className="leading-relaxed">
                For Assisted Purchase accounts, Dazzling Shipping acts on behalf of the customer to process returns with U.S. merchants. We do not guarantee that merchants will accept returns or issue full refunds.
              </p>
            </section>

            <section id="a-timings" className="space-y-2">
              <h3 className="font-bold text-slate-900">9. Return Timings</h3>
              <p className="leading-relaxed">
                Return requests must be submitted to the U.S. operations team within 3 business days of the initial warehouse receiving date (Self-Purchase).
              </p>
            </section>

            <section id="a-seller-rejection" className="space-y-2">
              <h3 className="font-bold text-slate-900">10. Seller Rejection of Returns</h3>
              <p className="leading-relaxed">
                If the original merchant rejects the return, Dazzling Shipping shall not be held liable, and the customer must choose to discard or pay to have the item shipped back.
              </p>
            </section>

            <section id="a-damage" className="space-y-2">
              <h3 className="font-bold text-slate-900">11. Storage Billing</h3>
              <p className="leading-relaxed">
                Items held at our U.S. warehouse pending RTO instructions beyond the free storage window will incur daily warehouse storage charges per Dazzling Shipping's standard rate card.
              </p>
            </section>

            <section id="a-responsibility" className="space-y-2">
              <h3 className="font-bold text-slate-900">12. Waiver of Emergency Responsibility</h3>
              <p className="leading-relaxed">
                Dazzling Shipping shall not be held liable for shipping delays and resulting return/merchant window closures due to acts of God, port strikes, customs delays, or other force majeure events.
              </p>
            </section>

            <section id="a-right-to-reject" className="space-y-2">
              <h3 className="font-bold text-slate-900">13. Right to Reject Return Request</h3>
              <p className="leading-relaxed">
                Dazzling Shipping reserves the right to reject any return request failing to meet eligibility requirements or containing prohibited materials.
              </p>
            </section>
          </div>

          {/* PART B - EXPORT FAILED DELIVERY AND RETURN */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              Part B - Export Failed Delivery and Return
            </h2>
            <p className="leading-relaxed">
              This section governs failed deliveries, shipment returns from the USA back to Bangladesh, and abandoned consignments.
            </p>

            <section id="b-purpose" className="space-y-2">
              <h3 className="font-bold text-slate-900">1. Purpose and Scope</h3>
              <p className="leading-relaxed">
                Applied to all shipments originating from Bangladesh destined for the USA managed by Dazzling Shipping for export.
              </p>
            </section>

            <section id="b-delivery" className="space-y-2">
              <h3 className="font-bold text-slate-900">2. Failed Delivery Processing</h3>
              <p className="leading-relaxed">
                If the USA carrier (e.g., USPS, UPS, FedEx) attempts delivery to the final recipient address and fails due to incorrect address, recipient absence, or refusal, the shipment will be returned to our U.S. hub or held for pickup.
              </p>
            </section>

            <section id="b-communication" className="space-y-2">
              <h3 className="font-bold text-slate-900">3. Customer Communication</h3>
              <p className="leading-relaxed">
                We will send automated alerts via email and dashboard notification regarding failed delivery attempts. The sender in Bangladesh has 48 hours to provide updated delivery instructions.
              </p>
            </section>

            <section id="b-charges" className="space-y-2">
              <h3 className="font-bold text-slate-900">4. Applicable Charges</h3>
              <p className="leading-relaxed">
                All return freight, domestic USA carrier redelivery fees, customs handling, and storage will be billed to the shipper in Bangladesh prior to release or return.
              </p>
            </section>

            <section id="b-return" className="space-y-2">
              <h3 className="font-bold text-slate-900">5. Return to Bangladesh</h3>
              <p className="leading-relaxed">
                If the recipient refuses delivery, the export shipment can be returned to Bangladesh upon the shipper paying international return shipping and import customs duties as levied by the shipper.
              </p>
            </section>

            <section id="b-abandonment" className="space-y-2">
              <h3 className="font-bold text-slate-900">6. Abandonment, Auction, or Disposal</h3>
              <p className="leading-relaxed">
                Any export shipment unclaimed or unpaid for return storage/freight for over 30 days will be considered abandoned and subject to liquidation, auction, or destruction to recover storage and handling costs.
              </p>
            </section>

            <section id="b-insurance" className="space-y-2">
              <h3 className="font-bold text-slate-900">7. Return and Insurance</h3>
              <p className="leading-relaxed">
                Return shipping is not covered by standard insurance. Any return must be separately insured by the customer upon request and payment to Dazzling Shipping.
              </p>
            </section>

            <section id="b-responsibility" className="space-y-2">
              <h3 className="font-bold text-slate-900">8. Disclaimer of Responsibility</h3>
              <p className="leading-relaxed">
                Dazzling Shipping is not liable for goods returned by U.S. customs or any local agencies due to prohibited items, import violations, or lack of compliance by the shipper.
              </p>
            </section>
          </div>

          {/* RELATED POLICIES SECTION */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="font-bold text-slate-900">Related Policies</h3>
            <ul className="space-y-1 text-slate-600">
              <li><Link to="/terms" className="hover:text-[#FF5C00] transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-[#FF5C00] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cancellation" className="hover:text-[#FF5C00] transition-colors">Shipment Cancellation Policy</Link></li>
              <li><Link to="/prohibited" className="hover:text-[#FF5C00] transition-colors">Prohibited and Restricted Items Policy</Link></li>
              <li><Link to="/pricing" className="hover:text-[#FF5C00] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* QUESTIONS BOX / FOOTER CALLOUT */}
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Questions about returns or RTO?</h4>
              <p className="text-slate-500 text-xs">Our support team is available 24/7 to help you with return requests and tracking.</p>
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

    </div>
  );
};

export default ReturnPolicy;