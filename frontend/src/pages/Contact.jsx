import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const faqs = [
    {
      q: "How long does shipping from USA to Bangladesh take?",
      a: "Typical air freight transit takes 7–12 business days depending on customs processing."
    },
    {
      q: "Are customs duties and taxes included in your pricing?",
      a: "Yes, our transparent weight-based rates include customs clearance duties and standard handling fees."
    },
    {
      q: "How does the Assisted Purchase service work?",
      a: "Provide us with the product link, and we purchase it on your behalf using local US payment methods."
    },
    {
      q: "Can I track my shipment in real-time?",
      a: "Yes, you will receive a tracking link to monitor status updates from warehouse arrival to final delivery."
    },
    {
      q: "What is the minimum weight for shipping?",
      a: "Our minimum billable shipping weight starts at 1 kg."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 antialiased">
      
      {/* 1. Hero Header with Dark Overlay & Background */}
      <div className="relative bg-[#080D1A] text-white pt-16 pb-32 px-2 sm:px-2 lg:px-2 overflow-hidden">
        {/* Background Image Effect */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1600&q=80')` }}
        />
        
        <div className="relative mx-auto space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Get in <span className="text-[#FF5C00]">Touch</span>
          </h1>
          <p className="text-sm font-medium text-slate-200">
            Have a question, need a quote, or want to discuss your shipping needs? We're here to help.
          </p>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Our dedicated support team is available Monday to Saturday to assist you with any inquiries about our services.
          </p>
        </div>
      </div>

      {/* 2. Floating Top 4 Info Cards (Overlapping Hero) */}
      <div className=" mx-auto px-2 sm:px-2 lg:px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Phone */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm text-center flex flex-col items-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF5C00] flex items-center justify-center text-sm font-bold">
              📞
            </div>
            <h3 className="text-xs font-bold text-slate-900">Phone</h3>
            <div className="text-[10px] text-slate-400 leading-snug space-y-0.5">
              <p>USA: +1 (212) 555-0123</p>
              <p>BD: +880 2-555-0123</p>
              <p className="text-[9px] pt-1 text-slate-300">Mon-Sat, 9AM-6PM (EST)</p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm text-center flex flex-col items-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF5C00] flex items-center justify-center text-sm font-bold">
              ✉️
            </div>
            <h3 className="text-xs font-bold text-slate-900">Email</h3>
            <div className="text-[10px] text-slate-400 leading-snug space-y-0.5">
              <p>info@dazzlingshipping.com</p>
              <p>support@dazzlingshipping.com</p>
              <p className="text-[9px] pt-1 text-slate-300">We reply within 24 hours</p>
            </div>
          </div>

          {/* USA Office */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm text-center flex flex-col items-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF5C00] flex items-center justify-center text-sm font-bold">
              📍
            </div>
            <h3 className="text-xs font-bold text-slate-900">USA Office</h3>
            <div className="text-[10px] text-slate-400 leading-snug space-y-0.5">
              <p>123 Commerce Drive</p>
              <p>New York, NY 10001</p>
              <p className="text-[9px] pt-1 text-slate-300">Main Warehouse & HQ</p>
            </div>
          </div>

          {/* BD Office */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm text-center flex flex-col items-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF5C00] flex items-center justify-center text-sm font-bold">
              🏢
            </div>
            <h3 className="text-xs font-bold text-slate-900">BD Office</h3>
            <div className="text-[10px] text-slate-400 leading-snug space-y-0.5">
              <p>42 Gulshan Avenue</p>
              <p>Dhaka 1212, Bangladesh</p>
              <p className="text-[9px] pt-1 text-slate-300">Dhaka Sorting Hub</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Side: Send Us a Message Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900">
              Send Us a Message
            </h2>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-300 focus:bg-white focus:outline-none focus:border-[#FF5C00] transition"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-300 focus:bg-white focus:outline-none focus:border-[#FF5C00] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-300 focus:bg-white focus:outline-none focus:border-[#FF5C00] transition"
                  />
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-600 focus:bg-white focus:outline-none focus:border-[#FF5C00] transition"
                  >
                    <option value="">Select a subject</option>
                    <option value="shipping">Shipping Inquiry</option>
                    <option value="assisted">Assisted Purchase</option>
                    <option value="customs">Customs & Rates</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows="4"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-300 focus:bg-white focus:outline-none focus:border-[#FF5C00] transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#FF5C00] hover:bg-[#E05100] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Side Widgets */}
          <div className="space-y-5">
            
            {/* Quick Contact Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900">Quick Contact</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs mt-0.5">📞</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Call Us</h4>
                    <p className="text-[10px] text-slate-400">+1 (212) 555-0123</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs mt-0.5">✉️</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Email Us</h4>
                    <p className="text-[10px] text-slate-400">info@dazzlingshipping.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs mt-0.5">⏰</span>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Business Hours</h4>
                    <p className="text-[10px] text-slate-400">Mon-Sat: 9AM - 6PM (EST)</p>
                    <p className="text-[10px] text-slate-400">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Us Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Follow Us</h3>
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-[#FF5C00] text-slate-600 flex items-center justify-center text-xs transition">
                  💬
                </button>
                <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-[#FF5C00] text-slate-600 flex items-center justify-center text-xs transition">
                  📸
                </button>
                <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-[#FF5C00] text-slate-600 flex items-center justify-center text-xs transition">
                  👤
                </button>
                <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-[#FF5C00] text-slate-600 flex items-center justify-center text-xs transition">
                  ▶️
                </button>
              </div>
            </div>

            {/* Dark Widget: Our Locations */}
            <div className="bg-[#080D1A] text-white rounded-2xl p-5 space-y-4 border border-slate-800">
              <h3 className="text-xs font-bold">Our Locations</h3>
              
              <div className="space-y-3 text-[10px]">
                <div className="space-y-0.5">
                  <p className="font-bold text-[#FF5C00]">🇺🇸 United States</p>
                  <p className="text-slate-300">New York • Los Angeles • Chicago</p>
                </div>

                <div className="space-y-0.5">
                  <p className="font-bold text-[#FF5C00]">🇧🇩 Bangladesh</p>
                  <p className="text-slate-300">Dhaka • Chittagong • Sylhet</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Frequently Asked Questions Accordion Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 pb-16 pt-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-6">
          
          {/* FAQ Header */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400">
              Quick answers to common questions
            </p>
            {/* Orange underline bar */}
            <div className="w-10 h-1 bg-[#FF5C00] mx-auto rounded-full mt-2"></div>
          </div>

          {/* Accordion List */}
          <div className="space-y-2.5 max-w-3xl mx-auto pt-2">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-slate-50/70 border border-slate-100 rounded-lg overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:text-[#FF5C00] transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 text-xs">
                    {openFaq === idx ? '▲' : '▼'}
                  </span>
                </button>

                {openFaq === idx && (
                  <div className="px-4 pb-3.5 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100/60 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Contact;