import React from 'react';

const stores = [
  {
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  },
  {
    name: 'Walmart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg',
  },
  {
    name: 'eBay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
  },
  {
    name: 'Sephora',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Sephora_logo.svg',
  },
  {
    name: 'Best Buy',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg',
  },
  {
    name: 'Target',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg',
  },
  {
    name: "Macy's",
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Macy%27s_Logo.svg',
  },
  {
    name: 'Apple Store',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    isApple: true,
  },
];

const Stores = () => {
  return (
    <section id="stores" className="py-1 md:py-2 bg-white font-sans overflow-hidden">
      <div className="container mx-auto px-4 ">
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>
        </div>

        {/* Section Header */}
        <div className="text-center mb-1 md:mb-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B1A2D] uppercase tracking-wide">
            SHOP TAX-FREE AT <span className="relative inline-block border-b-4 border-orange-500 pb-1">POPULAR</span> USA STORES
          </h2>
        </div>

        {/* Logo Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 items-center">
          {stores.map((s, index) => (
            <div
              key={index}
              className="h-20 bg-white rounded-xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-center p-4 transition-all duration-300 hover:shadow-md"
            >
              {s.isApple ? (
                <div className="flex items-center gap-1.5">
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="h-5 w-auto object-contain"
                  />
                  <span className="font-semibold text-xs text-[#0B1A2D] whitespace-nowrap">
                    Apple Store
                  </span>
                </div>
              ) : (
                <img
                  src={s.logo}
                  alt={s.name}
                  className="max-h-8 w-auto max-w-full object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stores;