import React from 'react';

const HeroBanner = () => {
  return (
    <section className="relative min-h-[500px] w-full bg-slate-900 text-white overflow-hidden flex flex-col justify-between py-12 md:py-4">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop')`, // High-res warehouse racking image
        }}
      >
        {/* Dark Blue/Slate Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-slate-1000/80 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-6 ">
        <div className="max-w-2xl">
          {/* Eyebrow / Tagline */}
          <span className="text-orange-500 font-bold uppercase tracking-wider text-xs md:text-sm block mb-3">
            RELIABLE. TRANSPARENT. DELIVERED.
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-4">
            <span className="text-white block">USA-Bangladesh</span>
            <span className="text-orange-500 block mt-1">Import and Export Freight</span>
          </h1>

          {/* Subtitle / Paragraph */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
            We make international shipping simple and stress-free. We handle U.S.A to Bangladesh imports and Bangladesh export forwarding to the U.S.A and with transparent pricing and real-time updates you can trust.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#get-started"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-md shadow-md transition-colors duration-200"
            >
              Get Started
            </a>
            <a
              href="#quote"
              className="px-6 py-3 border border-slate-600 hover:border-slate-400 bg-slate-900/40 hover:bg-slate-800/60 text-white font-semibold text-sm rounded-md transition-colors duration-200 flex items-center gap-1"
            >
              Request Quote <span className="text-xs">&gt;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Features Row */}
      <div className="relative z-10 container mx-auto px-6 mt-1 md:mt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-orange-500/40 flex items-center justify-center shrink-0 text-orange-500 bg-orange-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Customs-Inclusive</h4>
              <p className="text-xs text-gray-400 mt-0.5">All-in-One Solution</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-orange-500/40 flex items-center justify-center shrink-0 text-orange-500 bg-orange-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Secure Handling &amp;</h4>
              <p className="text-xs text-gray-400 mt-0.5">Real-Time Updates</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-orange-500/40 flex items-center justify-center shrink-0 text-orange-500 bg-orange-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 20h8m-4-16v16m-4-4l4 4 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Door-to-Door Delivery</h4>
              <p className="text-xs text-gray-400 mt-0.5">Across Bangladesh</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;