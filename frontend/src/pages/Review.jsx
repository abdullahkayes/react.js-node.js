import React from 'react';

const reviews = [
  {
    name: 'Shahrin Ahmed',
    role: 'Importer',
    text: '"They handle everything from purchase to delivery. Very professional team and awesome tracking system."',
    rating: 5,
  },
  {
    name: 'Mousumi Akter',
    role: 'Merchant',
    text: '"It reaches my shipments on time, every time. Love their customs-inclusive tracking. It keeps me informed all the way!"',
    rating: 5,
  },
  {
    name: 'Rahim Ahmed',
    role: 'Business Owner',
    text: '"Excellent service! My packages arrived perfectly intact and on-schedule. Very professional team and great communication."',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    role: 'E-commerce Seller',
    text: '"Shipping has never been easier. Reliable, fast, and great support for all our cross-border orders!"',
    rating: 5,
  },
  {
    name: 'James L.',
    role: 'Freight Manager',
    text: '"Transparent pricing and consistent delivery times across regions. Highly recommend their service."',
    rating: 5,
  },
];

const Review = () => {
  // Duplicate reviews array to create seamless infinite loop animation
  const extendedReviews = [...reviews, ...reviews];

  return (
    <section id="reviews" className="py-1 md:py-2 bg-slate-50/50 font-sans overflow-hidden">
      <div className="container mx-auto px-4 ">
        {/* Section Header */}
        <div className="text-center mb-1 md:mb-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1A2D] uppercase tracking-wide">
            CUSTOMER REVIEWS
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* CSS Continuous Infinite Ticker/Carousel */}
        <div className="relative w-full overflow-hidden">
          {/* Subtle Side Fades */}
          <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-slate-50/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-slate-50/80 to-transparent z-10 pointer-events-none"></div>

          <div className="flex gap-6 md:gap-8 animate-infinite-scroll hover:[animation-play-state:paused]">
            {extendedReviews.map((r, index) => (
              <div
                key={`${r.name}-${index}`}
                className="w-[320px] md:w-[380px] shrink-0 bg-white rounded-2xl p-7 border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(r.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-orange-500 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Body */}
                  <p className="text-[#0B1A2D] text-sm leading-relaxed font-normal mb-8">
                    {r.text}
                  </p>
                </div>

                {/* User Info Bar */}
                <div className="flex items-center gap-3.5 pt-2">
                  <div className="w-11 h-11 rounded-full bg-[#0B1A2D] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B1A2D] text-sm leading-tight">
                      {r.name}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind Custom Keyframes Extension Rule */}
      <style>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 25s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Review;