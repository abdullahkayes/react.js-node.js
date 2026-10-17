import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 antialiased selection:bg-[#FF5C00] selection:text-white">
      
      {/* 1. Hero Banner */}
      <section className="relative bg-[#0b1329] text-white pt-16 pb-36 px-2 sm:px-2 lg:px-6 overflow-hidden">
        {/* Dark Hero Background Image */}
        <div 
          className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80')` }}
        />
        
        <div className="relative  mx-auto space-y-3">
          <p className="text-[10px] font-bold tracking-widest text-[#FF5C00] uppercase">
            ABOUT DAZZLING SHIPPING
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Connecting Bangladesh and <br className="hidden sm:inline" />
            the USA Through <span className="text-[#FF5C00]">Smarter Logistics</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-2xl leading-relaxed">
            Securing door-to-door import, export, customs clearance, consolidation, and last-mile delivery through an integrated agent network.
          </p>
          
          <div className="pt-3 flex flex-wrap gap-3">
            <button className="bg-[#FF5C00] hover:bg-[#e05100] text-white text-xs font-bold px-6 py-2.5 rounded-md transition shadow-md">
              Explore Our Services
            </button>
            <button className="bg-transparent hover:bg-white/10 border border-slate-600 text-white text-xs font-semibold px-6 py-2.5 rounded-md transition">
              Request a Quote
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className=" mx-auto px-2 sm:px-2 lg:px-6 space-y-16 py-2">

        {/* 2. Overview / Mission Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-[#FF5C00] uppercase tracking-wider">
                WHO WE ARE
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                A Cross-Border Logistics Partner Built Around Your Shipment
              </h2>
              <div className="space-y-3 text-xs text-slate-500 leading-relaxed">
                <p>
                  Dazzling Shipping is designed for businesses, e-commerce stores, and individual customers shipping between Bangladesh and the USA.
                </p>
                <p>
                  We bring sourcing, documentation, warehouse coordination, freight, customs clearance, tracking, payment, and delivery management together into one integrated network.
                </p>
              </div>
            </div>

            <div className="bg-amber-50/60 border border-amber-100/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-[#FF5C00] flex items-center justify-center shrink-0 text-sm">
                🛡️
              </div>
              <p className="text-[11px] font-semibold text-slate-700">
                Digitally Enabled, Licensed Operators <br />
                <span className="text-[10px] font-normal text-slate-400">Streamlined clearance, full compliance, and real-time visibility.</span>
              </p>
            </div>
          </div>

          {/* Dark Card Widget */}
          <div className="lg:col-span-5 bg-[#080D1A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-[#FF5C00] uppercase tracking-wider">
                OUR MISSION
              </p>
              <h3 className="text-lg font-bold leading-snug">
                Make cross-border shipping easier, safer, and more transparent.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering businesses to reach international markets and connecting loved ones across oceans with reliable, end-to-end logistics solutions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-4 text-center">
              <div>
                <p className="text-sm font-black text-[#FF5C00]">Fast</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Air Freight</p>
              </div>
              <div>
                <p className="text-sm font-black text-[#FF5C00]">Secure</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Handling</p>
              </div>
              <div>
                <p className="text-sm font-black text-[#FF5C00]">Transparent</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Pricing</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. What We Do - 6 Service Cards Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <p className="text-[10px] font-bold text-[#FF5C00] uppercase tracking-wider">
              WHAT WE DO
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Complete Cross-Border Logistics Services
            </h2>
            <p className="text-xs text-slate-400">
              Handled end-to-end from origin warehouse to destination doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center text-xs">
                ✈️
              </div>
              <h3 className="text-xs font-bold text-slate-900">USA to Bangladesh Import</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Full-service air and sea freight for consumer goods, personal parcels, and commercial freight.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center text-xs">
                🚢
              </div>
              <h3 className="text-xs font-bold text-slate-900">Bangladesh to USA Export</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Ship export cargo, commercial samples, and garments with seamless coordination.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center text-xs">
                🌐
              </div>
              <h3 className="text-xs font-bold text-slate-900">Air & Ocean Freight</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Flexible options for urgent air express delivery or cost-effective ocean cargo.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center text-xs">
                📦
              </div>
              <h3 className="text-xs font-bold text-slate-900">Warehouse Consolidation</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Combine multiple purchases into a single package to reduce shipping costs significantly.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center text-xs">
                📋
              </div>
              <h3 className="text-xs font-bold text-slate-900">Customs & Export-Clear</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Hassle-free customs documentation handling for swift clearance at origin and destination.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center text-xs">
                🔄
              </div>
              <h3 className="text-xs font-bold text-slate-900">Return Logistics</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Dedicated support for seller returns, RTO management, and product exchange logistics.
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <a href="#services" className="text-xs font-bold text-[#FF5C00] hover:underline inline-flex items-center gap-1">
              Explore Services & Solutions <span>→</span>
            </a>
          </div>
        </section>

        {/* 4. Who We Serve - 3 Columns */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <p className="text-[10px] font-bold text-[#FF5C00] uppercase tracking-wider">
              WHO WE SERVE
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Logistics for Every Stage of Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-base">
                🏬
              </div>
              <h3 className="text-xs font-bold text-slate-900">Commercial Importers & Exporters</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Bulk cargo shipping, freight forwarding, and customs clearance tailored for enterprise operations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-base">
                🛍️
              </div>
              <h3 className="text-xs font-bold text-slate-900">F-Commerce & E-Commerce Merchants</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Direct purchasing assistance, warehouse storage, and reliable delivery for online stores.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-base">
                👤
              </div>
              <h3 className="text-xs font-bold text-slate-900">Retail & Independent Customers</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Personal package forwarding, individual shopping, and household shipment delivery.
              </p>
            </div>

          </div>
        </section>

        {/* 5. Why Dazzling Shipping - Split Layout with Image & Checkmarks */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Box */}
            <div className="lg:col-span-5 relative overflow-hidden rounded-xl h-64 lg:h-full min-h-[240px]">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" 
                alt="Logistics Warehouse"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Checkmark List */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <p className="text-[10px] font-bold text-[#FF5C00] uppercase tracking-wider">
                  WHY DAZZLING SHIPPING
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  One Platform. Multiple Logistics Needs.
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <span className="text-[#FF5C00] font-bold text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Import & Export</h4>
                    <p className="text-[10px] text-slate-400">Two-way freight handling across both hubs.</p>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <span className="text-[#FF5C00] font-bold text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Air & Ocean Options</h4>
                    <p className="text-[10px] text-slate-400">Speed or budget — choose what fits your shipment.</p>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <span className="text-[#FF5C00] font-bold text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Transparent Pricing</h4>
                    <p className="text-[10px] text-slate-400">Clear rates with no hidden fees or charges.</p>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <span className="text-[#FF5C00] font-bold text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">End-to-End Tracking</h4>
                    <p className="text-[10px] text-slate-400">Live visibility from origin warehouse to delivery.</p>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <span className="text-[#FF5C00] font-bold text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Consolidation Support</h4>
                    <p className="text-[10px] text-slate-400">Repacking and merging for lower cost.</p>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
                  <span className="text-[#FF5C00] font-bold text-xs mt-0.5">✓</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Management & Support</h4>
                    <p className="text-[10px] text-slate-400">Dedicated assistance through every stage.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 6. Operational Network Banner */}
        <section className="space-y-5">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <p className="text-[10px] font-bold text-[#FF5C00] uppercase tracking-wider">
              OUR OPERATIONAL NETWORK
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Managed by Dazzling Shipping, Delivered Through Approved Partners.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center space-y-1 shadow-sm">
              <span className="text-base">🏢</span>
              <h3 className="text-xs font-bold text-slate-800">Dazzling Shipping</h3>
              <p className="text-[10px] text-slate-400">Hub management, customer support, and coordination.</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center space-y-1 shadow-sm">
              <span className="text-base">✈️</span>
              <h3 className="text-xs font-bold text-slate-800">Approved Service Partners</h3>
              <p className="text-[10px] text-slate-400">Licensed international freight forwarders and air carriers.</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center space-y-1 shadow-sm">
              <span className="text-base">🚚</span>
              <h3 className="text-xs font-bold text-slate-800">Destination Logistics</h3>
              <p className="text-[10px] text-slate-400">Trusted last-mile courier networks for final delivery.</p>
            </div>
          </div>

          <p className="text-[9px] text-center text-slate-400 max-w-2xl mx-auto pt-2">
            Dazzling Shipping coordinates cross-border shipments through partner networks. Service availability and transit times depend on destination, customs clearance, and carrier routes.
          </p>
        </section>

      </div>
    </div>
  );
};

export default About;