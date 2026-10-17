import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans antialiased">
      {/* Dark Hero Section */}
      <section className="bg-[#0B0F19] text-white py-16 px-2 sm:px-2 lg:px-2 relative overflow-hidden">
        <div className=" mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              How <span className="text-[#FF5C00]">Dazzling Shipping</span><br />Works
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
              Import from the USA and export approved goods or documents from Bangladesh through separate, fully tracked workflows.
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 max-w-xl leading-relaxed">
              From request submission and hub receiving procedures, final clearing and delivery, every stage is transparent and supported.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#import-workflow"
                className="px-5 py-2.5 bg-[#FF5C00] hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-md transition"
              >
                Start Import
              </a>
              <a
                href="#export-workflow"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-lg transition"
              >
                Start Export
              </a>
            </div>
          </div>

          <div className="md:col-span-5 hidden md:block">
            {/* Geometric abstract background element */}
            {/* <div className="w-full h-48 rounded-2xl bg-gradient-to-tr from-slate-800/80 to-slate-900 border border-slate-800 p-6 flex items-center justify-center">
              <div className="text-slate-600 text-xs font-mono text-center">
                [ Dazzling Shipping Workflow Engine ]
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Main Container - Light Background */}
      <div className="bg-[#F8FAFC] text-slate-800 py-6 px-2 sm:px-2 lg:px-2 space-y-6">
        <div className=" mx-auto space-y-6">

          {/* SECTION 1: IMPORT WORKFLOW */}
          <section id="import-workflow" className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold text-[#FF5C00] tracking-widest uppercase">
                USA → BANGLADESH
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Import Workflow
              </h2>
              <div className="w-10 h-0.5 bg-[#FF5C00] mx-auto rounded-full"></div>
            </div>

            {/* Step 1 & Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-xs mb-3 shadow-md">
                  1
                </div>
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-base">
                  👤
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">Register &amp; Get Customer ID</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                  Create account to get unique USA Shipping center hub address.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-xs mb-3 shadow-md">
                  2
                </div>
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-base">
                  🛒
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">Choose Import Method</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                  Select whether to purchase product independently or via assistance.
                </p>
              </div>
            </div>

            {/* Sub-Branch: Choose One Route */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[10px] font-bold text-[#FF5C00] tracking-widest uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  CHOOSE ONE ROUTE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 2A. Self-Purchase */}
                <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <span className="text-[10px] font-bold text-[#FF5C00] block">
                    • 2A. SELF-PURCHASE / PRE-ALERT
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center">
                      <h4 className="text-xs font-bold text-slate-900 mb-1">Arrange Delivery to USA Warehouse</h4>
                      <p className="text-[10px] text-slate-500">Order from seller using standard USA shipping.</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center">
                      <h4 className="text-xs font-bold text-slate-900 mb-1">Receive Tracking Number</h4>
                      <p className="text-[10px] text-slate-500">Get tracking code from courier.</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center">
                      <h4 className="text-xs font-bold text-slate-900 mb-1">Submit Pre-Alert</h4>
                      <p className="text-[10px] text-slate-500">Provide details on dashboard for faster receiving.</p>
                    </div>
                  </div>
                </div>

                {/* 2B. Assisted Purchase */}
                <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  <span className="text-[10px] font-bold text-[#FF5C00] block">
                    • 2B. ASSISTED PURCHASE
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center">
                      <h4 className="text-xs font-bold text-slate-900 mb-1">Submit Quotation Request</h4>
                      <p className="text-[10px] text-slate-500">Submit product URL from supplier dashboard.</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center">
                      <h4 className="text-xs font-bold text-slate-900 mb-1">Check Cost &amp; Complete Payment</h4>
                      <p className="text-[10px] text-slate-500">Approve cost and complete invoice payment.</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center">
                      <h4 className="text-xs font-bold text-slate-900 mb-1">We Purchase &amp; Manage Delivery</h4>
                      <p className="text-[10px] text-slate-500">Our desk buys item and manages delivery.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Both Routes Converge Here */}
            <div className="space-y-4 pt-2">
              <div className="text-center">
                <span className="text-[10px] font-bold text-[#FF5C00] tracking-widest uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  BOTH ROUTES CONVERGE HERE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[11px] mb-2 shadow-sm">
                    3
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-sm">
                    🏢
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">USA Warehouse Receiving</h3>
                  <p className="text-[10px] text-slate-500">Packages received, checked and stored at our warehouse.</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[11px] mb-2 shadow-sm">
                    4
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-sm">
                    🔍
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Inspection &amp; Consolidation</h3>
                  <p className="text-[10px] text-slate-500">Inspection checks done, combine packages to save shipping cost.</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[11px] mb-2 shadow-sm">
                    5
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-sm">
                    ✈️
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Freight &amp; Customs</h3>
                  <p className="text-[10px] text-slate-500">International air forward and air shipment processing through custom clearance.</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[11px] mb-2 shadow-sm">
                    6
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-sm">
                    📦
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Dhaka Hub, Sorting &amp; Delivery</h3>
                  <p className="text-[10px] text-slate-500">Warehouse sorting, hub pickup or doorstep delivery options.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: EXPORT WORKFLOW */}
          <section id="export-workflow" className="space-y-8 pt-6 border-t border-slate-200">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold text-[#FF5C00] tracking-widest uppercase">
                BANGLADESH → USA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Export Workflow
              </h2>
              <div className="w-10 h-0.5 bg-[#FF5C00] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[10px] mb-2 shadow-sm">
                  1
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-xs">
                  👤
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 mb-1">Register &amp; Get Customer ID</h3>
                <p className="text-[10px] text-slate-500 leading-snug">Create account to access export features.</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[10px] mb-2 shadow-sm">
                  2
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-xs">
                  🚚
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 mb-1">Arrange Delivery to Dhaka Hub</h3>
                <p className="text-[10px] text-slate-500 leading-snug">Send items to our Dhaka hub or request collection.</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[10px] mb-2 shadow-sm">
                  3
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-xs">
                  📋
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 mb-1">Submit Export Booking</h3>
                <p className="text-[10px] text-slate-500 leading-snug">Provide export product info and destination address.</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[10px] mb-2 shadow-sm">
                  4
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-xs">
                  🔍
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 mb-1">Hub Receiving &amp; Inspection</h3>
                <p className="text-[10px] text-slate-500 leading-snug">Package content, size, weight and customs safety check.</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[10px] mb-2 shadow-sm">
                  5
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-xs">
                  ✈️
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 mb-1">Export Transport &amp; Customs</h3>
                <p className="text-[10px] text-slate-500 leading-snug">Air freight transport, outbound clearance, transit to destination.</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#FF5C00] text-white flex items-center justify-center font-bold text-[10px] mb-2 shadow-sm">
                  6
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-xs">
                  🏡
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 mb-1">USA Arrival, Sorting &amp; Delivery</h3>
                <p className="text-[10px] text-slate-500 leading-snug">Final clearance, courier sorting and customer home delivery.</p>
              </div>
            </div>
          </section>

          {/* SECTION 3: CHOOSE YOUR SERVICE */}
          <section className="space-y-8 pt-6 border-t border-slate-200">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Choose Your Service
              </h2>
              <div className="w-10 h-0.5 bg-[#FF5C00] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5C00] flex items-center justify-center text-lg">
                    📦
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Self-Purchase / Pre-Alert</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Buy online directly from your preferred USA vendors / sellers. Forward packages seamlessly using custom customer address or code addition tag.
                  </p>
                </div>
                <div>
                  <Link
                    to="/pre-alert"
                    className="inline-flex items-center text-xs font-bold text-[#FF5C00] hover:underline gap-1"
                  >
                    Submit Pre-Alert →
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5C00] flex items-center justify-center text-lg">
                    🛒
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Assisted Purchase</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No credit card? Simply send product links to us. Our procurement desk purchases item on your behalf safely and invoices directly.
                  </p>
                </div>
                <div>
                  <Link
                    to="/assisted-purchase"
                    className="inline-flex items-center text-xs font-bold text-[#FF5C00] hover:underline gap-1"
                  >
                    Request Assisted Purchase →
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="bg-orange-50/50 -m-6 mb-2 p-6 rounded-t-2xl border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 text-[#FF5C00] flex items-center justify-center text-lg mb-3 shadow-sm">
                    📄
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Export Booking</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Ship commercial delivery batch items, essential documents, garments, artifacts out from Bangladesh borders into localized commercial address market in USA.
                  </p>
                </div>
                <div>
                  <Link
                    to="/export-booking"
                    className="inline-flex items-center text-xs font-bold text-[#FF5C00] hover:underline gap-1"
                  >
                    Create Export Booking →
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Document export note: Document export requests follow the basic step workflow pattern through custom export validation.
            </p>
          </section>

          {/* SECTION 4: RELIABLE SUPPORT AT EVERY STAGE */}
          <section className="space-y-8 pt-6 border-t border-slate-200">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                Reliable Support At Every Stage
              </h2>
              <div className="w-10 h-0.5 bg-[#FF5C00] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3">
                <span className="text-[#FF5C00] text-base shrink-0">🎧</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Customer Support</h4>
                  <p className="text-[10px] text-slate-500 leading-snug">Dedicated support team available to assist with queries.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3">
                <span className="text-[#FF5C00] text-base shrink-0">📍</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Live Tracking</h4>
                  <p className="text-[10px] text-slate-500 leading-snug">Track package step by step, updates clear and visible.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3">
                <span className="text-[#FF5C00] text-base shrink-0">📦</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Hub Consolidation</h4>
                  <p className="text-[10px] text-slate-500 leading-snug">Combine package handling to save on shipment volume charges.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3">
                <span className="text-[#FF5C00] text-base shrink-0">🏠</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Door to Door Delivery</h4>
                  <p className="text-[10px] text-slate-500 leading-snug">Safe delivery to doorstep or local pickup station options.</p>
                </div>
              </div>
            </div>

            {/* Bottom Info Banner */}
            <div className="bg-slate-100 rounded-lg p-4 border border-slate-200/80 flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                👤
              </span>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Who is this for?</h5>
                <p className="text-[11px] text-slate-600">
                  Individual shoppers purchasing global store commodities, corporate e-commerce business accounts managing commercial bulk cargo shipments or independent exporters shipping international non-fragile batches abroad.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default HowItWorks;