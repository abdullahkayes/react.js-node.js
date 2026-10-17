import React from 'react';

const InsideOperation = () => {
  const operations = [
    {
      num: '01',
      title: 'USA Warehouse',
      desc: 'Secure receiving, inspection, and consolidation at our Houston warehouse.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    },
    {
      num: '02',
      title: 'Airport Cargo Handling',
      desc: 'Smooth coordination with airlines and customs for timely cargo release.',
      image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop',
    },
    {
      num: '03',
      title: 'Ocean Vessel Transit',
      desc: 'Cost-effective, high-capacity container shipment over sea routes.',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop',
    },
    {
      num: '04',
      title: 'Dhaka Hub',
      desc: 'Efficient sorting, customs clearance, and preparation at our Dhaka hub.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section id="inside-operation" className="py-1 md:py-2 bg-white font-sans">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1A2D] uppercase tracking-wide">
            INSIDE OUR OPERATIONS
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Operational Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {operations.map((op) => (
            <div key={op.num} className="relative pt-6">
              {/* Outer Card Container */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100/80">
                
                {/* Background Image Container */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={op.image}
                    alt={op.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />

                  {/* Orange Number Badge Floating inside the Image Area */}
                  <div className="absolute top-28 left-6 z-20">
                    <span className="inline-block bg-[#FF6B00] text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
                      {op.num}
                    </span>
                  </div>
                </div>

                {/* White Overlapping Details Box */}
                <div className="relative z-10 -mt-16 mx-4 mb-4 bg-white rounded-xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-slate-100">
                  <h3 className="text-base font-bold text-[#0B1A2D] mb-2 leading-snug">
                    {op.title}
                  </h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed font-normal">
                    {op.desc}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsideOperation;