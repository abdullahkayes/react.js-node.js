import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      title: 'Air Freight',
      desc: 'Fast, reliable air cargo from USA to Bangladesh with priority space and secure handling.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      link: '/services/air-freight'
    },
    {
      title: 'Ocean Freight',
      desc: 'Heavy, bulky or non-urgent shipments by sea with economical rates and reliable delivery.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      link: '/services/ocean-freight'
    },
    {
      title: 'Assisted Purchase',
      desc: 'We buy from any USA store on your behalf and deliver to our warehouse.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      link: '/services/assisted-purchase'
    },
    {
      title: 'Self Purchase',
      desc: 'Shop from any USA store yourself and ship to our warehouse for forwarding.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      link: '/services/self-purchase'
    },
    {
      title: 'Customs Clearance',
      desc: '100% customs-inclusive service with expert documentation and HS code handling.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      link: '/services/customs-clearance'
    },
    {
      title: 'Export Service',
      desc: 'Bangladesh export forwarding to USA and other countries',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      link: '/services/export-import'
    },
  ];

  return (
    <section id="services" className="py-1 md:py-4 bg-slate-50/60 font-sans">
      <div className="container mx-auto px-4 ">
        {/* Section Header */}
        <div className="text-center mb-1 md:mb-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1A30] uppercase tracking-wide">
            Our Core Services
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Title Row */}
                <div className="flex items-start gap-5 mb-4">
                  <div className="shrink-0 pt-1">{service.icon}</div>
                  <h3 className="text-xl font-bold text-[#0B1A30] leading-snug">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-normal">
                  {service.desc}
                </p>
              </div>

              {/* Action Link */}
              <div>
                <Link
                  to={service.link}
                  className="inline-flex items-center text-orange-500 font-bold text-sm hover:text-orange-600 transition-colors"
                >
                  Learn More <span className="ml-1 text-xs">&gt;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;