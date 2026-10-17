import React from 'react';
import { Link } from 'react-router-dom';

const WarehouseConsolidation = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-400 space-x-1">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <span>Services</span>
          <span>›</span>
          <span className="text-slate-600 font-medium">Warehouse Consolidation</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="lg:col-span-6 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Warehouse<br />Consolidation
            </h1>
            <p className="text-lg font-bold text-[#FF5C00]">
              Combine More. Ship Smarter.
            </p>
            <div className="w-10 h-1 bg-[#FF5C00] rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
              We receive, match, inspect and combine compatible packages to reduce unnecessary volume and simplify international dispatch.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-end">
            <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
                alt="Warehouse logistics and storage" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
              📦
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Package Matching</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Matched using your Customer ID at booking.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
              📋
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Inspection &amp; Measurement</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Quantity, condition, size and weight checked.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
              📥
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Repacking &amp; Consolidation</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Compatible parcels combined securely.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
              🎯
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Dispatch Readiness</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Final documents and shipment details confirmed.</p>
          </div>
        </div>

        {/* About Warehouse Consolidation Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">About Warehouse Consolidation</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <strong className="text-slate-700">For Import shipments</strong>, parcels received at an approved USA partner facility are matched, checked and combined before dispatch to Bangladesh.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <strong className="text-slate-700">For eligible Export shipments</strong>, compatible goods received at the Dhaka Hub may be consolidated before dispatch to the USA, subject to documentation, carrier and destination requirements.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                alt="Logistics team reviewing warehouse operations" 
                className="rounded-xl object-cover h-52 w-full shadow-sm"
              />
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Reduced Package Volume</h4>
                  <p className="text-[11px] text-slate-500">Minimize space and shipping costs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Organized Handling</h4>
                  <p className="text-[11px] text-slate-500">Systematic receiving and secure packing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Import &amp; Export Support</h4>
                  <p className="text-[11px] text-slate-500">Consolidation available for both directions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Live Status Updates</h4>
                  <p className="text-[11px] text-slate-500">Track progress at every stage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our 5-Step Consolidation Process Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Our 5-Step Consolidation Process</h2>
            <div className="w-12 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                01
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                📄
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Pre-Alert or Booking</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Submit Import parcel details or an Export booking.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                02
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                📦
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Receive &amp; Match</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Goods are received and matched to your account.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                03
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                🔍
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Inspect &amp; Measure</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Quantity, condition, dimensions and weight are checked.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                04
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                📥
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Repack &amp; Consolidate</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Compatible packages are combined properly.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center sm:col-span-3 lg:col-span-1">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                05
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                🎯
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Confirm &amp; Dispatch</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Final weight, charges and documents are confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Consolidation Options Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Consolidation Options</h2>
            <div className="w-12 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0 text-xl">
                📦
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Import Consolidation</h3>
                <p className="text-xs text-slate-500">Combine compatible USA purchases before shipping to Bangladesh.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0 text-xl">
                ⚠️
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Export Consolidation</h3>
                <p className="text-xs text-slate-500">Combine approved Bangladeshi goods before shipping to the USA.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Includes & Why Use Consolidation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Service Includes</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mb-6"></div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">📦</span>
                  <h4 className="text-xs font-bold text-slate-900">Parcel Matching</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">📋</span>
                  <h4 className="text-xs font-bold text-slate-900">Basic Inspection</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">⚖️</span>
                  <h4 className="text-xs font-bold text-slate-900">Weight &amp; Dimensions</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">🛡️</span>
                  <h4 className="text-xs font-bold text-slate-900">Protective Repacking</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">🔒</span>
                  <h4 className="text-xs font-bold text-slate-900">Package Consolidation</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">📋</span>
                  <h4 className="text-xs font-bold text-slate-900">Dispatch Coordination</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Why Use Consolidation?</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mb-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Lower Unnecessary Volume</h4>
                      <p className="text-[11px] text-slate-500">Reduce waste box packaging where safe.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">One Organized Shipment</h4>
                      <p className="text-[11px] text-slate-500">Combine compatible parcels under one shipment.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Clear Final Measurement</h4>
                      <p className="text-[11px] text-slate-500">Final chargeable weight is confirmed after processing.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Flexible Direction</h4>
                      <p className="text-[11px] text-slate-500">Available for eligible Import and Export shipments.</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600" 
                      alt="Warehouse inventory shelf" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info Alert Banner */}
        <div className="bg-slate-100 rounded-lg p-3 border border-slate-200/80 flex items-center gap-3">
          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            i
          </span>
          <p className="text-[11px] text-slate-600">
            <strong className="text-slate-800">Important:</strong> Consolidation and repacking depend on product compatibility, safety, documentation and carrier rules. Restricted, hazardous or incompatible items may require separate handling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WarehouseConsolidation;