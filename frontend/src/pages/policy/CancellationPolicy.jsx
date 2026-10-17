import React from 'react';
import { Link } from 'react-router-dom';

const CancellationPolicy = () => {
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
              <span className="text-slate-200">Shipment Cancellation Policy</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
              Shipment Cancellation Policy
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Cancellation conditions, applicable charges, consent requirements, and restrictions for Self-Purchase, Assisted Purchase, and Bangladesh-to-USA Export Shipments.
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
                1. Cancellation Request
              </a>
              <a href="#section-2" className="block hover:text-[#FF5C00] transition-colors">
                2. Self-Purchase Shipments
              </a>
              <a href="#section-3" className="block hover:text-[#FF5C00] transition-colors">
                3. Assisted Purchase Shipments
              </a>
              <a href="#section-4" className="block hover:text-[#FF5C00] transition-colors">
                4. Export Shipments
              </a>
              <a href="#section-5" className="block hover:text-[#FF5C00] transition-colors">
                5. Approval Where Charges Apply
              </a>
              <a href="#section-6" className="block hover:text-[#FF5C00] transition-colors">
                6. After a Shipment Becomes Shipment Locked
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
              This Policy establishes the cancellation conditions, applicable charges, customer consent requirements, and restrictions from when a Shipment becomes Shipment Locked for Dazzling Shipping's Self-Purchase, Assisted Purchase, and Bangladesh-to-USA Export Shipments. Each cancellation request will be reviewed and resolved based on the current status of the Shipment and the costs already incurred.
            </p>
          </div>

          {/* SECTION 1 */}
          <section id="section-1" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              1. Cancellation Request
            </h2>
            <p className="leading-relaxed">
              Customers may submit a request to cancel an active Shipment through the <strong>Cancel Shipment</strong> button on the <strong>My Shipment</strong> page. However, customers may not cancel one or more specific items within the same Shipment. Submitting a cancellation request alone does not mean that the Shipment has been cancelled.
            </p>
          </section>

          {/* SECTION 2 */}
          <section id="section-2" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              2. Self-Purchase Shipments
            </h2>
            <p className="leading-relaxed">
              A Self-Purchase item may be cancelled without a Cancellation Charge before the item reaches Dazzling Shipping's USA Warehouse.
            </p>
            <p className="leading-relaxed">
              If the Shipment is cancelled after the item has reached the Warehouse, the customer will be responsible for costs already incurred, including:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>Receiving</li>
              <li>Inspection</li>
              <li>Handling</li>
              <li>Repacking</li>
              <li>Storage</li>
              <li>USA Domestic Return</li>
              <li>Other applicable costs</li>
            </ul>
          </section>

          {/* SECTION 3 */}
          <section id="section-3" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              3. Assisted Purchase Shipments
            </h2>
            <p className="leading-relaxed">
              An Assisted Purchase Request may be cancelled without a Cancellation Charge before Dazzling Shipping purchases the Product.
            </p>
            <p className="leading-relaxed">
              If the Product has already been purchased, the customer will be responsible for applicable:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>Procurement or Service Fee</li>
              <li>Payment Processing Charge</li>
              <li>Currency Exchange Difference</li>
              <li>Seller Cancellation or Return Charge</li>
              <li>Restocking Fee</li>
              <li>USA Domestic Shipping</li>
              <li>Other actual costs incurred</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Dazzling Shipping does not guarantee that the Seller will provide a refund.
            </p>
            <p className="leading-relaxed">
              If a refund is actually received from the Seller, the remaining amount (after deduction of applicable charges) will be credited to the customer's Wallet or through another approved method.
            </p>
          </section>

          {/* SECTION 4 */}
          <section id="section-4" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              4. Export Shipments
            </h2>
            <p className="leading-relaxed">
              A Bangladesh-to-USA Export Shipment may be cancelled without penalty before the local Pick-Up Request has been dispatched.
            </p>
            <p className="leading-relaxed">
              If the Parcel has reached the Dhaka Hub but the Shipment has not yet become Shipment Locked, the customer will be responsible for the actual costs already incurred, including:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 font-medium">
              <li>Local Courier</li>
              <li>Receiving</li>
              <li>Inspection</li>
              <li>Handling</li>
              <li>Repacking</li>
              <li>Storage</li>
              <li>Document Fees</li>
              <li>Return-to-Customer / Local Return Delivery Charges</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Once Export Customs Clearance, Carrier Booking, Shipping Documentation, or Carton Purchase has been completed, the Shipment cannot be cancelled.
            </p>
          </section>

          {/* SECTION 5 */}
          <section id="section-5" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              5. Approval Where Charges Apply
            </h2>
            <p className="leading-relaxed">
              If no Cancellation Charge applies, Dazzling Shipping may review and cancel the request without requiring additional communication with the customer.
            </p>
            <p className="leading-relaxed">
              If a Cancellation Charge applies, Dazzling Shipping will contact the customer and provide details of the applicable charges. The Shipment will be cancelled only after the customer agrees to the charges and the requested payment or adjustment has been completed.
            </p>
            <p className="leading-relaxed">
              If the customer does not agree to the applicable charges, the Shipment will not be cancelled and will continue according to the previous process.
            </p>
          </section>

          {/* SECTION 6 */}
          <section id="section-6" className="space-y-3">
            <h2 className="text-sm font-bold text-[#FF5C00] tracking-wide uppercase border-b border-slate-100 pb-1">
              6. After a Shipment Becomes Shipment Locked
            </h2>
            <p className="leading-relaxed">
              An Import or Export Shipment will be considered Shipment Locked when the Parcel has been finally loaded into an Air or Sea Shipment, Bern, Master Carton, Manifest, ULD, or Container, when Carrier Booking or Shipping Documents too have been completed, or when Tariff Statement has been handed over to the Carrier.
            </p>
            <p className="leading-relaxed font-semibold text-slate-900">
              No cancellation will be accepted after a Shipment becomes Shipment Locked.
            </p>
            <p className="leading-relaxed">
              If the Parcel involves costly returns, an import shipment will be handled under the applicable Return/RTO Policy, while an Export Shipment will be handled under the applicable Export Return and Failed Delivery Policy.
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

    
    </div>
  );
};

export default CancellationPolicy;