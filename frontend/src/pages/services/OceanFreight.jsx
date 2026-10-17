import React from 'react';
import { Link } from 'react-router-dom';

const OceanFreight = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased py-6 px-2 sm:px-2 lg:px-2 mx-auto space-y-6">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-400 space-x-1">
        <Link to="/" className="hover:underline">Home</Link>
        <span>›</span>
        <span>Services</span>
        <span>›</span>
        <span className="text-slate-600 font-medium">Ocean Freight</span>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="lg:col-span-6 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ocean Freight
          </h1>
          <p className="text-lg font-bold text-[#FF5C00]">
            Cost-Effective. Reliable. Scalable.
          </p>
          <div className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded">
            USA ↔ Bangladesh • Import &amp; Export
          </div>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            Our Ocean Freight service supports eligible heavy, bulky and non-urgent Import and Export shipments between the USA and Bangladesh. Quotations depend on shipment details, route and applicable LCL, CBM or W/M rules.
          </p>
        </div>

        <div className="lg:col-span-6 flex justify-end">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
            alt="Office space / Logistics Hub" 
            className="rounded-xl object-cover h-64 sm:h-72 w-full shadow-sm"
          />
        </div>
      </div>

      {/* 4 Feature Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3">
            🚢
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Cost-Effective Shipping</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Lower freight cost for heavy and bulky goods.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3">
            📦
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Flexible Options</h3>
          <p className="text-[11px] text-slate-500 leading-snug">LCL and CBM solutions as per your need.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3">
            🛡️
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Safe &amp; Secure</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Your cargo is packed and handled with care. Optional shipment insurance is available.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3">
            ◎
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Real-Time Tracking</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Track your shipment at every step of the journey.</p>
        </div>

      </div>

      {/* About Ocean Freight Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">About Ocean Freight</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Ocean Freight is an economical option for eligible large-volume or heavy import and export shipments between the USA and Bangladesh. It suits businesses and customers seeking lower-cost transport for non-urgent cargo.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We work with trusted shipping lines and forwarders to provide LCL and CBM / W-M solutions with documentation and customs coordination in the applicable direction.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600" 
              alt="Warehouse logistics" 
              className="rounded-xl object-cover h-52 w-full shadow-sm"
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">LCL &amp; CBM Solutions</h4>
                <p className="text-[11px] text-slate-500">Perfect for small to medium shipments.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Cost Optimization</h4>
                <p className="text-[11px] text-slate-500">Save more on heavy and bulky cargo.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Customs &amp; Documentation</h4>
                <p className="text-[11px] text-slate-500">Import and export documentation and clearance coordination.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Port to Door Delivery</h4>
                <p className="text-[11px] text-slate-500">Delivery coordination from origin port to the approved destination.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Ocean Freight Solutions */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Our Ocean Freight Solutions</h2>
          <div className="w-12 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
              📦
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">LCL (Less than Container Load)</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Share container space and pay only for the space you use. Ideal for small and medium shipments.
              </p>
              <p className="text-[11px] font-bold text-[#FF5C00] pt-1">
                Best for: Small &amp; medium shipments
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
              🏬
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">CBM / W-M Shipment</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Cargo is charged based on CBM or Weight whichever is higher. Best solution for bulky &amp; lightweight cargo.
              </p>
              <p className="text-[11px] font-bold text-[#FF5C00] pt-1">
                Best for: Bulky &amp; lightweight cargo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: What We Ship by Sea & Why Choose Ocean Freight? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: What We Ship by Sea */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">What We Ship by Sea</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">👕</span>
                <h4 className="text-[11px] font-bold text-slate-900">Apparel &amp; Footwear</h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">💄</span>
                <h4 className="text-[11px] font-bold text-slate-900">Cosmetics &amp; Skincare</h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">💊</span>
                <h4 className="text-[11px] font-bold text-slate-900">Health Supplements</h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">📱</span>
                <h4 className="text-[11px] font-bold text-slate-900">Electronics &amp; Gadgets</h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">🍼</span>
                <h4 className="text-[11px] font-bold text-slate-900">Baby Care Products</h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">🏠</span>
                <h4 className="text-[11px] font-bold text-slate-900">Home &amp; Living Items</h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">⚙️</span>
                <h4 className="text-[11px] font-bold text-slate-900">Machinery &amp; Parts</h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                <span className="text-xl mb-1">📦</span>
                <h4 className="text-[11px] font-bold text-slate-900">And many more bulk goods</h4>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/60 flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              i
            </span>
            <p className="text-[11px] text-slate-500">
              Product eligibility varies by service direction. Check <Link to="/prohibited-items" className="text-orange-600 font-semibold underline">prohibited and restricted items</Link> before shipping.
            </p>
          </div>
        </div>

        {/* Right Column: Why Choose Ocean Freight? */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Why Choose Ocean Freight?</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Lower Shipping Cost</h4>
                    <p className="text-[11px] text-slate-500">Save more on heavy and bulky shipments.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Ideal for Non-Urgent Shipments</h4>
                    <p className="text-[11px] text-slate-500">Perfect for shipments that are not time sensitive.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Flexible Shipping Options</h4>
                    <p className="text-[11px] text-slate-500">Choose LCL or CBM shipment as per your need.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Complete Support</h4>
                    <p className="text-[11px] text-slate-500">From booking and documentation to delivery, we support both directions.</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600" 
                  alt="Ocean shipment nature/landscape image" 
                  className="rounded-xl object-cover h-56 w-full shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info Alert Banner */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/60 flex items-center gap-3">
        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          i
        </span>
        <p className="text-[11px] text-slate-500">
          Ocean Freight Import and Export delivery times vary by route, shipping line, port and customs conditions.
        </p>
      </div>

    </div>
  );
};

export default OceanFreight;