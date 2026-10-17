import React from 'react';
import { Link } from 'react-router-dom';

const policies = [
  {
    id: 'terms-of-service',
    icon: '📜',
    title: 'General Terms of Service',
    description: 'General rules for using our website, dashboard and cross border logistics services.',
    items: [
      'Service scope and company role',
      'Customer responsibilities',
      'Liability limitations',
      'Force majeure'
    ],
    linkText: 'Read Terms of Service →'
  },
  {
    id: 'privacy-policy',
    icon: '🛡️',
    title: 'Privacy Policy',
    description: 'How we collect, use, share, transfer and protect personal and shipment information.',
    items: [
      'Information collection and use',
      'Data sharing and transfer',
      'Security and retention',
      'Customer privacy rights'
    ],
    linkText: 'Read Privacy Policy →'
  },
  {
    id: 'prohibited-items',
    icon: '⚠️',
    title: 'Prohibited & Restricted Items',
    description: 'Products we cannot accept and products requiring documents or prior approval.',
    items: [
      'Prohibited products',
      'Restricted products',
      'Conditionally accepted items',
      'Carrier and customs approval'
    ],
    linkText: 'Check Item Policy →'
  },
  {
    id: 'cancellation-policy',
    icon: '🚫',
    title: 'Shipment Cancellation Policy',
    description: 'Cancellation rules for Self Purchase, Assisted Purchase and Export shipments.',
    items: [
      'How to request cancellation',
      'Applicable cancellation charges',
      'Export cancellation stages',
      'Shipment Locked restrictions'
    ],
    linkText: 'View Cancellation Policy →'
  },
  {
    id: 'payment-policy',
    icon: '💳',
    title: 'Payment & Wallet Policy',
    description: 'Payment verification, advance payment requirements, wallet use and adjustments.',
    items: [
      'Accepted payment methods',
      'Import and Export invoices',
      'Wallet use and restrictions',
      'Refunds and credits'
    ],
    linkText: 'Read Payment Policy →'
  },
  {
    id: 'return-policy',
    icon: '🔄',
    title: 'Parcel Return Policy',
    description: 'Return eligibility, RTO handling, Export failed delivery and refund settlement.',
    items: [
      'Three day return requests',
      'Return eligibility and charges',
      'RTO and Export failed delivery',
      'Seller-dependent refunds'
    ],
    linkText: 'View Return Policy →'
  },
  {
    id: 'export-failed-delivery-policy',
    icon: '⚠️',
    title: 'Bangladesh-to-USA Export Failed Delivery and Return Policy',
    description: 'Rules for failed USA delivery, return handling, customer coordination, charges, and settlement for export shipments.',
    items: [
      'Failed delivery reasons',
      'Address verification process',
      'Storage and return fees',
      'Customer coordination window'
    ],
    linkText: 'Read More →'
  },
  {
    id: 'insurance-policy',
    icon: '🛡️',
    title: 'Insurance & Claims Policy',
    description: 'Coverage and claim rules for eligible Import and Export shipments.',
    items: [
      'Optional 3% insurance',
      'Insured and uninsured limits',
      'Direct online claim filing',
      'Seven-day claim deadline'
    ],
    linkText: 'Read Insurance Policy →'
  }
];

const Policy = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* 1. Dark Hero Header Section */}
      <section className="bg-[#0B0F19] text-white py-12 px-2 sm:px-2 lg:px-2 relative overflow-hidden">
        <div className=" mx-auto space-y-3">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <Link to="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <span className="text-[#FF5C00]">Legal & Policies</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Legal & <span className="text-[#FF5C00]">Policies</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Review the terms, responsibilities and protections that apply when you use Dazzling Shipping's Import, Export, payment, return and insurance services.
          </p>
        </div>
      </section>

      {/* 2. Main Content Body */}
      <main className=" mx-auto py-10 px-2 sm:px-2 lg:px-2 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Our Policies
          </h2>
          <p className="text-xs text-slate-400">
            Select a policy to understand how our services work and what you can expect from us.
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <div 
              key={policy.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition group relative"
            >
              {/* Top Accent Orange Border Bar */}
              <div className="h-1 bg-[#FF5C00] w-full"></div>

              <div className="p-6 space-y-4">
                {/* Header Row: Icon + Title */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5C00] text-sm shrink-0 mt-0.5">
                    {policy.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#FF5C00] transition">
                      {policy.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                </div>

                {/* Bullet List */}
                <ul className="space-y-1.5 pl-2 pt-2">
                  {policy.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center gap-2 text-[11px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Link Footer */}
              <div className="px-6 pb-6 pt-2">
                <Link 
                  to={`/policy/${policy.id}`} 
                  className="text-[11px] font-bold text-[#FF5C00] hover:underline inline-flex items-center gap-1"
                >
                  {policy.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Support Help Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
              📞
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Need help understanding a policy?</h4>
              <p className="text-[11px] text-slate-400">Our support team can help with service terms, documentation, payments, returns and claims.</p>
            </div>
          </div>

          <button className="bg-[#FF5C00] hover:bg-[#E05100] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shrink-0 shadow-sm flex items-center gap-1">
            Contact Support <span>→</span>
          </button>
        </div>

      </main>
    </div>
  );
};

export default Policy;
