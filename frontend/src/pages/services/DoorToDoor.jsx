import React from 'react';
import { Link } from 'react-router-dom';

const DoorToDoor = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased py-6 px-2 sm:px-2 lg:px-2 mx-auto space-y-6">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-400 space-x-1">
        <Link to="/" className="hover:underline">Home</Link>
        <span>›</span>
        <span>Services</span>
        <span>›</span>
        <span className="text-slate-600 font-medium">Door-to-Door Delivery</span>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="lg:col-span-6 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Door-to-Door Delivery
          </h1>
          <p className="text-lg font-bold text-[#FF5C00]">
            Across Bangladesh and the USA, We Deliver Trust.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            We coordinate last-mile delivery for eligible Import and Export shipments—from USA partner facility or Dhaka Hub processing to the recipient's approved address.
          </p>
        </div>

        <div className="lg:col-span-6 flex justify-end relative">
          <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
              alt="Warehouse logistics" 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
              <span className="text-white text-xl sm:text-2xl font-black tracking-wider uppercase drop-shadow-md">
                DAZZLING SHIPPING
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
            🏠
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Import &amp; Export Delivery</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Door-to-door coordination in Bangladesh and the USA.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
            🛡️
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Safe &amp; Secure Delivery</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Your goods are packed, handled and delivered with utmost care.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
            ◎
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Real-Time Tracking</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Track your shipment live at every step of the journey.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
            🎧
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Reliable Support</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Our support team is always ready to assist you.</p>
        </div>

      </div>

      {/* About Our Door-to-Door Delivery Service Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">About Our Door-to-Door Delivery Service</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Dazzling Shipping coordinates door-to-door delivery for eligible Import and Export shipments. Imports move from our approved USA partner facility to Bangladesh; exports move from the Dhaka Hub toward approved USA destinations.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              With trusted international and local courier partners, careful handling and live updates, we make two-way shipping simple and reliable.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600" 
              alt="Cityscape / Skyscrapers" 
              className="rounded-xl object-cover h-52 w-full shadow-sm"
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">End-to-End Handling</h4>
                <p className="text-[11px] text-slate-500">We manage your shipment from start to final delivery.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Trusted Courier Network</h4>
                <p className="text-[11px] text-slate-500">We work with reliable partners for fast and safe delivery.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">No COD Service</h4>
                <p className="text-[11px] text-slate-500">We do not provide Cash on Delivery (COD) service.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Delivery in Bangladesh &amp; USA</h4>
                <p className="text-[11px] text-slate-500">Coverage in Bangladesh and approved USA destinations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Delivery Service Includes */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Our Delivery Service Includes</h2>
          <div className="w-12 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-base">
              📦
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Careful Handling</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Your packages are carefully handled at every stage of the journey.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-base">
              ⇄
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Last-Mile Delivery</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Delivered to your home or business through our trusted courier partners.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-base">
              ◎
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Wide Coverage</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Coverage in Bangladesh and approved USA destinations.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-base">
              🕒
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">On-Time Delivery</h3>
            <p className="text-[11px] text-slate-500 leading-snug">We ensure fast and timely delivery to your doorstep.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center sm:col-span-3 lg:col-span-1">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-base">
              🛡️
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Secure &amp; Reliable</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Your shipment is safe with us until it reaches you.</p>
          </div>

        </div>
      </div>

      {/* Bottom Section: What We Deliver & Why Choose Dazzling Shipping? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: What We Deliver */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">What We Deliver</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[#FF5C00] text-base shrink-0">👕</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Apparel &amp; Footwear</h4>
                  <p className="text-[10px] text-slate-400">Clothing, shoes, jackets, bags</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[#FF5C00] text-base shrink-0">💄</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cosmetics &amp; Skincare</h4>
                  <p className="text-[10px] text-slate-400">Makeup, skincare, serum, creams</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[#FF5C00] text-base shrink-0">♡</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Health Supplements</h4>
                  <p className="text-[10px] text-slate-400">Vitamins, protein, omega-3, and more</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[#FF5C00] text-base shrink-0">📱</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Electronics &amp; Gadgets</h4>
                  <p className="text-[10px] text-slate-400">Smartwatch, earbuds, accessories</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[#FF5C00] text-base shrink-0">🍼</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Baby-Care Products</h4>
                  <p className="text-[10px] text-slate-400">Formula, lotion, diapers, etc.</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[#FF5C00] text-base shrink-0">👛</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Premium Accessories</h4>
                  <p className="text-[10px] text-slate-400">Watches, bags, sunglasses, wallets</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-3">
                <span className="text-[#FF5C00] text-base shrink-0">📦</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Others</h4>
                  <p className="text-[10px] text-slate-400">Any eligible product</p>
                </div>
              </div>
            </div>

            <p className="text-right text-[10px] text-slate-400 italic pt-2">
              ...and many more products across all categories.
            </p>
          </div>
        </div>

        {/* Right Column: Why Choose Dazzling Shipping? */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Why Choose Dazzling Shipping?</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Clear Service Pricing</h4>
                  <p className="text-[11px] text-slate-500">Imports are customs inclusive where applicable; exports use shipment-specific quotations.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Real-Time Updates</h4>
                  <p className="text-[11px] text-slate-500">Track import and export shipments through each delivery stage.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Careful Handling</h4>
                  <p className="text-[11px] text-slate-500">Your goods are packed and handled with maximum care.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">On-Time Delivery</h4>
                  <p className="text-[11px] text-slate-500">We ensure fast and reliable delivery.</p>
                </div>
              </div>
            </div>

            {/* Bottom Image Banner */}
            <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm mt-4">
              <img 
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800" 
                alt="City skyline" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-start p-4">
                <span className="text-white text-base font-black tracking-wider uppercase drop-shadow-md">
                  DAZZLING<br />SHIPPING
                </span>
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
          Product eligibility varies by service direction. Check <Link to="/prohibited-items" className="text-orange-600 font-semibold underline">prohibited and restricted items</Link> before shipping.
        </p>
      </div>

    </div>
  );
};

export default DoorToDoor;