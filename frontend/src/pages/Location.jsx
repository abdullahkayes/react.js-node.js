import React from 'react';

const Location = () => {
  return (
    <section id="locations" className="py-1 md:py-2 bg-white font-sans">
      <div className="container mx-auto px-4 ">
        {/* Section Header */}
        <div className="text-center mb-1 md:mb-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1A2D] uppercase tracking-wide">
            OUR LOCATIONS IN USA AND BANGLADESH
          </h2>
          <div className="w-10 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mx-auto">
          
          {/* USA Warehouse Card */}
          <div className="w-full lg:w-[350px] bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] shrink-0">
            {/* Header: Flag + Name */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                {/* USA Flag SVG */}
                <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
                  <path fill="#bd3d44" d="M0 0h640v480H0z"/>
                  <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 276.9h640M0 350.8h640M0 424.6h640"/>
                  <path fill="#192f5d" d="M0 0h256v258.5H0z"/>
                  <circle cx="28" cy="24" r="6" fill="#fff"/>
                  <circle cx="70" cy="24" r="6" fill="#fff"/>
                  <circle cx="112" cy="24" r="6" fill="#fff"/>
                  <circle cx="49" cy="48" r="6" fill="#fff"/>
                  <circle cx="91" cy="48" r="6" fill="#fff"/>
                  <circle cx="28" cy="72" r="6" fill="#fff"/>
                  <circle cx="70" cy="72" r="6" fill="#fff"/>
                  <circle cx="112" cy="72" r="6" fill="#fff"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0B1A2D]">USA Warehouse</h3>
            </div>

            {/* Details List */}
            <div className="space-y-3.5 text-sm">
              {/* Location */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <h4 className="font-bold text-orange-500 text-sm">Houston, Texas, USA</h4>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                    1234 Logistics Way<br />
                    Houston, TX 77032, USA
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="font-semibold text-[#0B1A2D] text-xs">+1 (832) 555-0198</span>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-gray-500 text-xs">Mon - Sat: 9:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>

          {/* Central Map Illustration with Flight Route */}
          <div className="flex-1 min-w-0 max-w-lg relative py-4 flex items-center justify-center">
            {/* Dotted World Map Visual Context */}
            <div className="relative w-full h-44 flex items-center justify-center">
              {/* Flight Path Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-24" viewBox="0 0 400 100" fill="none">
                  {/* Dashed Flight Curve */}
                  <path
                    d="M 20 50 Q 200 10 380 50"
                    stroke="#0B1A2D"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="none"
                    opacity="0.8"
                  />
                  {/* Start Point */}
                  <circle cx="20" cy="50" r="3" fill="#0B1A2D" />
                  {/* End Point */}
                  <circle cx="380" cy="50" r="4" fill="#10B981" />
                  <circle cx="380" cy="50" r="8" fill="#10B981" opacity="0.2" />
                </svg>
              </div>

              {/* Airplane Icon */}
              <div className="relative z-10 text-orange-500 transform -rotate-6">
                <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dhaka Hub Card */}
          <div className="w-full lg:w-[350px] bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] shrink-0">
            {/* Header: Flag + Name */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                {/* Bangladesh Flag SVG */}
                <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
                  <path fill="#006a4e" d="M0 0h640v480H0z"/>
                  <circle cx="280" cy="240" r="160" fill="#f42a41"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0B1A2D]">Dhaka Hub</h3>
            </div>

            {/* Details List */}
            <div className="space-y-3.5 text-sm">
              {/* Location */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <h4 className="font-bold text-orange-500 text-sm">Dhaka, Bangladesh</h4>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                    House 45, Road 12<br />
                    Uttara, Dhaka-1230
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="font-semibold text-[#0B1A2D] text-xs">+880 1722-334466</span>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-slate-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-gray-500 text-xs">Sun - Thu: 9:30 AM - 6:30 PM</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Location;