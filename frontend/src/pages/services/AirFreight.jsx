import React from 'react';
import { Link } from 'react-router-dom';

const AirFreight = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased py-12 px-2 sm:px-2 lg:px-2 mx-auto space-y-16">
      
      {/* Top Banner: About Air Freight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        
        {/* Left Column: Text */}
        <div className="lg:col-span-5 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            About Air Freight
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Air Freight is the fastest and most efficient way to ship eligible goods between the USA and Bangladesh. We coordinate import and Export air shipments from receiving through customs clearance and final delivery.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Whether it's urgent shipments, high-value items, or time-sensitive deliveries, our air freight service ensures speed, safety, and complete peace of mind.
          </p>
        </div>

        {/* Center Column: Image */}
        <div className="lg:col-span-4 flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
            alt="Cargo Airplane" 
            className="rounded-xl object-cover h-56 w-full shadow-sm"
          />
        </div>

        {/* Right Column: Key Highlights */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-[#FF5C00] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              ▲
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">USA ⇔ Bangladesh</h4>
              <p className="text-[11px] text-slate-500">Import and export air service</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-[#FF5C00] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              ★
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Priority Handling</h4>
              <p className="text-[11px] text-slate-500">Faster transit &amp; clearance</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-[#FF5C00] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              🛡️
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Safe &amp; Insured</h4>
              <p className="text-[11px] text-slate-500">Secure packaging &amp; insurance</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-[#FF5C00] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              ◎
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Real-Time Tracking</h4>
              <p className="text-[11px] text-slate-500">track every step of your shipment</p>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Section: Our Air Freight Process */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Our Air Freight Process</h2>
          <div className="w-12 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Step 01 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              01
            </span>
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V5" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Booking &amp; Receiving</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              USA partner facility for imports; Dhaka Hub for exports.
            </p>
          </div>

          {/* Step 02 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              02
            </span>
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Air Shipment</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Priority air transport in either direction.
            </p>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              03
            </span>
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Import &amp; Export Customs</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Documentation and clearance coordination.
            </p>
          </div>

          {/* Step 04 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              04
            </span>
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Final Delivery</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Delivery in Bangladesh or the USA.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Section: What We Ship by Air & Key Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card: What We Ship by Air */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">What We Ship by Air</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Apparel & Footwear */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                  👕
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Apparel &amp; Footwear</h4>
                  <p className="text-[11px] text-slate-500">Clothing, shoes, jackets, bags</p>
                </div>
              </div>

              {/* Cosmetics & Skincare */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                  💄
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cosmetics &amp; Skincare</h4>
                  <p className="text-[11px] text-slate-500">Makeup, skincare, serum, creams</p>
                </div>
              </div>

              {/* Health Supplements */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                  💊
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Health Supplements</h4>
                  <p className="text-[11px] text-slate-500">Vitamins, protein, omega-3, and more</p>
                </div>
              </div>

              {/* Electronics & Gadgets */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                  📱
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Electronics &amp; Gadgets</h4>
                  <p className="text-[11px] text-slate-500">Smartwatch, earbuds, accessories</p>
                </div>
              </div>

              {/* Baby Care Products */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                  🍼
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Baby Care Products</h4>
                  <p className="text-[11px] text-slate-500">Formula, lotion, diapers, etc.</p>
                </div>
              </div>

              {/* Premium Accessories */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                  ⌚
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Premium Accessories</h4>
                  <p className="text-[11px] text-slate-500">Watches, bags, sunglasses, wallets</p>
                </div>
              </div>

              {/* Others */}
              <div className="flex items-start gap-3 col-span-1 sm:col-span-2">
                <div className="w-8 h-8 rounded bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
                  📦
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Others</h4>
                  <p className="text-[11px] text-slate-500">Any eligible product</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Alert Box */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/60 flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              i
            </span>
            <p className="text-[11px] text-slate-500">
              Product eligibility varies by direction. Check the <Link to="/prohibited-items" className="text-orange-600 font-semibold underline">prohibited and restricted items list</Link> before shipping.
            </p>
          </div>
        </div>

        {/* Right Card: Key Benefits */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Key Benefits</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Benefits List */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-sm shrink-0 mt-0.5">◎</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Fastest Delivery</h4>
                    <p className="text-[11px] text-slate-500">Quick air transit between the USA and Bangladesh.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-sm shrink-0 mt-0.5">◎</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Secure &amp; Insured</h4>
                    <p className="text-[11px] text-slate-500">Your cargo is handled with care and Optional insurance available for eligible goods for safety.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-sm shrink-0 mt-0.5">◎</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Real-Time Tracking</h4>
                    <p className="text-[11px] text-slate-500">Track your shipment live at every step of the journey.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-sm shrink-0 mt-0.5">◎</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Clear Service Pricing</h4>
                    <p className="text-[11px] text-slate-500">Imports are customs inclusive where applicable; exports use shipment-specific quotations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-sm shrink-0 mt-0.5">◎</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Door-to-Door Service</h4>
                    <p className="text-[11px] text-slate-500">Available in Bangladesh and the USA, subject to coverage.</p>
                  </div>
                </div>
              </div>

              {/* Side Image */}
              <div className="md:col-span-5 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600" 
                  alt="Air Cargo Freight" 
                  className="rounded-xl object-cover h-64 w-full shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AirFreight;