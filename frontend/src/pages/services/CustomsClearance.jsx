import React from 'react';
import { Link } from 'react-router-dom';

const CustomsClearance = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased py-6 px-2 sm:px-2 lg:px-2">
      <div className=" mx-auto space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-400 font-normal space-x-1 flex items-center">
          <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
          <span className="text-slate-300">›</span>
          <span className="text-slate-400">Services</span>
          <span className="text-slate-300">›</span>
          <span className="text-slate-700 font-medium">Customs Clearance</span>
        </nav>

        {/* Hero Section Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="lg:col-span-6 space-y-3.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B132B] tracking-tight leading-tight">
              Customs Clearance
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#FF5C00]">
              Smooth Clearance. Both Directions.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We coordinate customs clearance for eligible USA-to-Bangladesh imports and Bangladesh-to-USA exports, including documentation, HS code handling, duty and tax coordination, and airport or sea-port formalities.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-end">
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800"
                alt="Dazzling Shipping Warehouse"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-white font-extrabold text-xl sm:text-2xl tracking-widest drop-shadow-md">
                  DAZZLING SHIPPING
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-xs font-bold text-[#0B132B] mb-1">Import Customs-Inclusive</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Import duties, taxes and documentation included where applicable.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-xs font-bold text-[#0B132B] mb-1">Import &amp; Export Documentation</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Accurate paperwork and HS code management for both directions.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xs font-bold text-[#0B132B] mb-1">Duty &amp; Tax Coordination</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Transparent calculation and payment coordination.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xs font-bold text-[#0B132B] mb-1">Air &amp; Sea Clearance</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Priority handling at airport and sea port.</p>
          </div>
        </div>

        {/* About Our Customs Clearance Service Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-[#0B132B]">About Our Customs Clearance Service</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Customs clearance is a critical step for both Import and Export shipments. Our team coordinates documentation, classification and clearance under applicable Bangladesh requirements and USA entry requirements.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Whether your shipment travels by air or sea, we work with customs authorities, C&amp;F agents, port officials and approved USA partners for smooth, timely clearance.
              </p>
            </div>

            <div className="lg:col-span-4">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600"
                alt="Cargo port with container ship"
                className="rounded-xl object-cover h-48 w-full shadow-sm"
              />
            </div>

            <div className="lg:col-span-3 space-y-3.5">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B132B]">Experienced C&amp;F Agents</h4>
                  <p className="text-[11px] text-slate-500">Strong network at airport &amp; sea port.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B132B]">HS Code Management</h4>
                  <p className="text-[11px] text-slate-500">Correct HS code classification to avoid delays and penalties.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B132B]">Compliance &amp; Regulations</h4>
                  <p className="text-[11px] text-slate-500">Full compliance with Bangladesh customs laws and policies.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B132B]">End-to-End Support</h4>
                  <p className="text-[11px] text-slate-500">We handle everything until your goods are released.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Customs Clearance Process Section */}
        <div className="space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B132B]">Our Customs Clearance Process</h2>
            <div className="w-8 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">01</span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xs font-bold text-[#0B132B] mb-1">Document Collection</h3>
              <p className="text-[10px] text-slate-500 leading-normal">We collect and verify required shipment documents.</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">02</span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xs font-bold text-[#0B132B] mb-1">HS Code &amp; Duty Review</h3>
              <p className="text-[10px] text-slate-500 leading-normal">We classify goods and review applicable duties and taxes.</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">03</span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </div>
              <h3 className="text-xs font-bold text-[#0B132B] mb-1">Submission to Customs</h3>
              <p className="text-[10px] text-slate-500 leading-normal">Documents are submitted for assessment.</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">04</span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xs font-bold text-[#0B132B] mb-1">Duty, Tax &amp; Fees</h3>
              <p className="text-[10px] text-slate-500 leading-normal">Applicable charges are paid or coordinated.</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center sm:col-span-2 lg:col-span-1">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">05</span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 className="text-xs font-bold text-[#0B132B] mb-1">Clearance &amp; Release</h3>
              <p className="text-[10px] text-slate-500 leading-normal">Cleared goods proceed to the next delivery stage.</p>
            </div>
          </div>
        </div>

        {/* 9-Grid & Why Choose Us Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Our Customs Clearance Includes (9 Grid Items) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B132B]">Our Customs Clearance Includes</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              
              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">Customs Documentation</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Invoice, Packing List, Bill of Lading / AWB, and all required papers.</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">HS Code &amp; Classification</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Accurate HS code selection to ensure smooth processing.</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">Duty &amp; Tax Calculation</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Transparent calculation of duties, VAT, and other charges.</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">C&amp;F Coordination</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Coordination with C&amp;F agents at airport or sea port.</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">Government Compliance</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Bangladesh import/export laws and applicable USA entry requirements.</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">Fast Clearance</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Priority handling to minimize delays and hold-ups.</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">Port Handling</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Handling charges, terminal fees &amp; port formalities.</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">Communication &amp; Updates</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Real-time updates at every step until release.</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#FF5C00]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h4 className="text-xs font-bold text-[#0B132B]">Support &amp; Guidance</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Expert support for any inspection or query.</p>
              </div>

            </div>
          </div>

          {/* Why Choose Us? Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B132B]">Why Choose Us?</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-orange-100 text-[#FF5C00] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B132B]">Clear Pricing by Service</h4>
                  <p className="text-[10px] text-slate-500">Import rates are customs-inclusive where applicable; export pricing is shipment-specific.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-orange-100 text-[#FF5C00] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B132B]">Expert Team</h4>
                  <p className="text-[10px] text-slate-500">Experienced professionals with in-depth customs knowledge.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-orange-100 text-[#FF5C00] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B132B]">Strong Network</h4>
                  <p className="text-[10px] text-slate-500">Trusted C&amp;F agents and customs partners at all major ports.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-orange-100 text-[#FF5C00] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B132B]">Transparent &amp; Reliable</h4>
                  <p className="text-[10px] text-slate-500">Clear process, no surprises. We keep you informed always.</p>
                </div>
              </div>
            </div>

            <div className="relative h-28 rounded-xl overflow-hidden shadow-sm mt-4">
              <img
                src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=600"
                alt="Air cargo terminal"
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-2 right-3 text-white font-black text-xs tracking-widest drop-shadow-md">
                CUSTOMS
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Important Note Alert Banner */}
        <div className="bg-[#EDF2F7] rounded-lg p-3 sm:p-4 border border-slate-200/60 flex items-center gap-3">
          <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            i
          </span>
          <p className="text-xs text-slate-600 leading-normal">
            Product eligibility and customs requirements vary by direction. Check <Link to="/policy" className="text-[#FF5C00] underline font-medium hover:text-[#e55300]">prohibited</Link> and <Link to="/policy" className="text-[#FF5C00] underline font-medium hover:text-[#e55300]">restricted items</Link> before shipping.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CustomsClearance;