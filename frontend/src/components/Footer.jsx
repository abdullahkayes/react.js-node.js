import React from 'react';
import logo from '../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#0B1220] text-gray-400 font-sans pt-4 pb-4 border-t border-slate-800/60">
      <div className="container mx-auto px-6">
        {/* Main Footer Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Logo Header */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="Dazzling Shipping Logo" className="h-12 object-contain" />
           
            </div>

            {/* Description Text */}
            <p className="text-xs leading-relaxed text-gray-400 pr-2">
              Reliable international shipping from USA to Bangladesh. Fast, secure, and affordable delivery services you can trust.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2 text-gray-400">
              <a href="#" className="hover:text-white transition-colors p-1" aria-label="Twitter / X">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors p-1" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors p-1" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4">Services</h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Air Freight</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ocean Freight</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Self-Purchase</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Assisted Purchase</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Export Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Customs Clearance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Door-to-Door Delivery</a></li>
            </ul>
          </div>

          {/* Column 3: Company and Support */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4">Company and Support</h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Shipment</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipment Cost Calculator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Legal Policies */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4">Legal Policies</h3>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prohibited and Restricted Items</a></li>
              <li><a href="#" className="hover:text-white transition-colors">View All Policies</a></li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div>
            <h3 className="text-white text-sm font-bold mb-4">Contact Info</h3>
            <div className="space-y-3.5 text-xs text-gray-400">
              {/* Phone Numbers */}
              <div className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.27 1.11l-2.18 2.2z"/>
                </svg>
                <div className="space-y-0.5">
                  <p>+1 (212) 555-0123 (USA)</p>
                  <p>+880 2-555-0123 (BD)</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a href="mailto:info@dazzlingshipping.com" className="hover:text-white transition-colors">
                  info@dazzlingshipping.com
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <p className="leading-relaxed">
                  14 Lewis Place, Suite 8,<br />
                  Brooklyn, New York 11218,<br />
                  USA
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-800/80 pt-6 text-center text-xs text-gray-500">
          © 2026 Dazzling Shipping. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;