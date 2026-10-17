import React from 'react';
import { Link } from 'react-router-dom';

const ExportImport = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased pb-6">
      
      {/* Hero Section with Cargo Plane Background */}
      <div 
        className="relative bg-slate-900 text-white py-10 px-2 sm:px-12 lg:px-20 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92) 30%, rgba(15, 23, 42, 0.75) 100%), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000')`
        }}
      >
        <div className=" mx-auto space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            OUR SERVICES
          </span>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
            Import. Export.<br />
            One Connected Logistics Platform.
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            From USA purchases delivered in Bangladesh to approved Bangladeshi products shipped to the USA, Dazzling Shipping coordinates freight, consolidation, customs and delivery through one service-based platform.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#FF5C00] inline-block"></span>
            <span>Select a service card below to learn more or begin.</span>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-2 sm:px-2 lg:px-2 space-y-16 -mt-4">

        {/* Section 1: Services Organized Around Where Your Shipment Is Going */}
        <div className="space-y-6 pt-10">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#FF5C00] uppercase">
              CHOOSE YOUR SHIPPING DIRECTION
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Services Organized Around Where Your Shipment Is Going
            </h2>
            <p className="text-xs text-slate-500">
              Import purchase options are kept separate from the Bangladesh to USA Export service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* USA-to-Bangladesh Services */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                  IMPORT
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">USA-to-Bangladesh Services</h3>
                  <p className="text-xs text-slate-500 mt-1">For customers purchasing or sourcing products from the USA.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Self-Purchase / Pre-Alert</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        You purchase from a USA store and submit a parcel pre-alert.
                      </p>
                    </div>
                    <Link to="/self-purchase" className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 mt-4">
                      Learn More &rarr;
                    </Link>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Assisted Purchase</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Submit product details; purchase follows quotation and payment.
                      </p>
                    </div>
                    <Link to="/assisted-purchase" className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 mt-4">
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-semibold text-slate-600 border-t border-slate-100">
                <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Air or Ocean Freight</span>
                <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> USA partner receiving</span>
                <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Customs &amp; delivery</span>
              </div>
            </div>

            {/* Bangladesh-to-USA Export Service */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#FF5C00] border border-orange-100">
                  EXPORT
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Bangladesh-to-USA Export Service</h3>
                  <p className="text-xs text-slate-500 mt-1">For approved products shipped from Bangladesh to the USA.</p>
                </div>

                <div className="pt-2">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between h-full">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Export Booking</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Send to Dhaka Hub and submit booking details with courier tracking, invoice and documents before arrival.
                      </p>
                    </div>
                    <Link to="/export-booking" className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 mt-4">
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-semibold text-slate-600 border-t border-slate-100">
                <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Shipment-specific quotation</span>
                <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Air or Ocean Freight</span>
                <span className="flex items-center gap-1"><span className="text-emerald-500">✓</span> USA delivery</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Choose the Mode That Fits the Shipment */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#FF5C00] uppercase">
              FREIGHT OPTIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Choose the Mode That Fits the Shipment
            </h2>
            <p className="text-xs text-slate-500">
              Available for eligible import and export shipments, subject to quotation and service requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Air Freight */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Air Freight</h3>
                  <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded tracking-wide uppercase">
                    FAST • URGENT • TIME-SENSITIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Suitable for urgent, lightweight, time-sensitive or higher value shipments requiring faster international transport.
                </p>
                <div className="pt-1">
                  <Link to="/air-freight" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                    Learn More &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Sea / Ocean Freight */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Sea / Ocean Freight</h3>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded tracking-wide uppercase">
                    HEAVY / BULK • NON-URGENT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Suitable for heavy, bulky, commercial or less urgent shipments using the applicable FCL, CBM or CBM (quotation-mode).
                </p>
                <div className="pt-1">
                  <Link to="/sea-freight" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                    Learn More &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Everything Around the International Shipment */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#FF5C00] uppercase">
              SUPPORTING LOGISTICS SERVICES
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Everything Around the International Shipment
            </h2>
            <p className="text-xs text-slate-500">
              Each card leads to the relevant information or customer service area.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Warehouse Consolidation */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center space-y-3">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] mx-auto flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Warehouse Consolidation</h3>
                <p className="text-[10px] text-slate-500 leading-normal">
                  USA partner receiving for imports; Dhaka Hub preparation for exports.
                </p>
              </div>
              <Link to="/warehouse-consolidation" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                Learn More &rarr;
              </Link>
            </div>

            {/* Customs Clearance */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center space-y-3">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] mx-auto flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Customs Clearance</h3>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Documentation and clearance coordination for eligible shipments.
                </p>
              </div>
              <Link to="/customs-clearance" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                Learn More &rarr;
              </Link>
            </div>

            {/* Door-to-Door Delivery */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center space-y-3">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] mx-auto flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Door-to-Door Delivery</h3>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Last mile delivery after applicable customs processing.
                </p>
              </div>
              <Link to="/door-to-door" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                Learn More &rarr;
              </Link>
            </div>

            {/* Return & RTD Logistics */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center space-y-3">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] mx-auto flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Return &amp; RTD Logistics</h3>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Courier RTC and eligible customer or seller authorized returns.
                </p>
              </div>
              <Link to="/returns" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                Learn More &rarr;
              </Link>
            </div>

            {/* Shipment Insurance */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center space-y-3">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] mx-auto flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Shipment Insurance</h3>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Optional cover dynamic based on value or declared insured shipments.
                </p>
              </div>
              <Link to="/insurance" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                Learn More &rarr;
              </Link>
            </div>

          </div>
        </div>

        {/* Section 4: Digital Shipping Tools */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#FF5C00] uppercase">
              DIGITAL SHIPPING TOOLS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Manage and Monitor Your Shipment Online
            </h2>
            <p className="text-xs text-slate-500">
              These are operational tools rather than logistics services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Shipment Cost Calculator */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Shipment Cost Calculator</h3>
                <p className="text-[11px] text-slate-500">Estimate import or export shipping costs.</p>
              </div>
              <div>
                <Link to="/calculator" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                  Open Calculator &rarr;
                </Link>
              </div>
            </div>

            {/* Track Shipment */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Track Shipment</h3>
                <p className="text-[11px] text-slate-500">View direction, milestones and current status.</p>
              </div>
              <div>
                <Link to="/track" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                  Track Now &rarr;
                </Link>
              </div>
            </div>

            {/* Customer Dashboard */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Customer Dashboard</h3>
                <p className="text-[11px] text-slate-500">Manage requests, payments, insurance and returns.</p>
              </div>
              <div>
                <Link to="/dashboard" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                  Login to Dashboard &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Important Service Note Banner */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-start gap-3">
          <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Important Service Note</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Services are subject to product eligibility, document verification, customs laws, carrier approval and availability. Export pricing and certain Ocean Freight services require a shipment-specific quotation.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExportImport;