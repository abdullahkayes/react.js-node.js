import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      id: 'calculator',
      title: 'Live Shipment Cost Calculator',
      desc: 'Calculate your shipping cost in real time.',
      type: 'light',
      link: '/quote',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="2" width="16" height="20" rx="3" strokeWidth="2" />
          <line x1="8" y1="6" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="8" cy="11" r="1" fill="currentColor" />
          <circle cx="12" cy="11" r="1" fill="currentColor" />
          <circle cx="16" cy="11" r="1" fill="currentColor" />
          <circle cx="8" cy="15" r="1" fill="currentColor" />
          <circle cx="12" cy="15" r="1" fill="currentColor" />
          <circle cx="16" cy="15" r="1" fill="currentColor" />
          <circle cx="8" cy="18" r="1" fill="currentColor" />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
          <circle cx="16" cy="18" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'tracking',
      title: 'Track Your Shipment',
      desc: 'Track your shipment every step of the way.',
      type: 'orange',
      link: '/track',
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 20h14"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-1 md:py-2 bg-slate-50/50 font-sans">
      <div className="container mx-auto px-4 ">
        {/* Section Header */}
        <div className="text-center mb-1 md:mb-1">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1A2D] uppercase tracking-wider">
            OUR ADVANCED FEATURES
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Features Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mx-auto">
          {features.map((item) => {
            const isOrange = item.type === 'orange';

            return (
              <Link
                key={item.id}
                to={item.link}
                className={`group relative rounded-2xl p-6 md:p-8 flex items-center justify-between transition-all duration-300 ${
                  isOrange
                    ? 'bg-[#FF6B00] text-white shadow-md hover:bg-orange-600'
                    : 'bg-white text-[#0B1A2D] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg'
                }`}
              >
                {/* Left Content (Icon + Text) */}
                <div className="flex items-center gap-5 md:gap-6 pr-4">
                  <div className="shrink-0">{item.icon}</div>
                  <div>
                    <h3
                      className={`text-lg md:text-xl font-bold leading-snug ${
                        isOrange ? 'text-white' : 'text-[#0B1A2D]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm mt-1 font-normal ${
                        isOrange ? 'text-orange-100' : 'text-gray-400'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Right Arrow */}
                <div className="shrink-0">
                  <span
                    className={`text-xl font-bold transition-transform duration-200 group-hover:translate-x-1 inline-block ${
                      isOrange ? 'text-white' : 'text-orange-500'
                    }`}
                  >
                    &gt;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;