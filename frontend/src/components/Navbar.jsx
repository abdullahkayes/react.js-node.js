import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/images/logo.png';

const servicesItems = [
  { label: 'Assisted Purchase', href: '/services/assisted-purchase' },
  { label: 'Self-Purchase', href: '/services/self-purchase' },
  { label: 'Export Import', href: '/services/export-import' },
  { label: 'Air Freight', href: '/services/air-freight' },
  { label: 'Ocean Freight', href: '/services/ocean-freight' },
  { label: 'Door to Door', href: '/services/door-to-door' },
  { label: 'Return RTO', href: '/services/return-rto' },
  { label: 'Shipment Insurance', href: '/services/shipment-insurance' },
  { label: 'Warehouse Consolidation', href: '/services/warehouse-consolidation' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#0B1A2D] text-white sticky top-0 z-50 font-sans shadow-md">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-20 flex justify-between items-center">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Dazzling Shipping Logo" className="h-12 object-contain" />
          
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-2 text-[15px] font-medium text-gray-200">
          <Link to="/" className="text-white font-semibold relative py-2 border-b-2 border-orange-500">
            Home
          </Link>

          <div className="relative group flex items-center gap-1 py-2 cursor-pointer hover:text-white transition-colors">
            <span>Services</span>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>

            <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
              {servicesItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/how-it-works" className="hover:text-white transition-colors whitespace-nowrap">
            How It Works
          </Link>
          <Link to="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link to="/track" className="hover:text-white transition-colors whitespace-nowrap">
            Track Shipment
          </Link>
          <Link to="/policy" className="hover:text-white transition-colors">
            Policy
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors whitespace-nowrap">
            Contact US
          </Link>
          <Link to="/about" className="hover:text-white transition-colors whitespace-nowrap">
            About US
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-white transition-colors whitespace-nowrap">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white transition-colors whitespace-nowrap">
                Log In
              </Link>
              <Link to="/register" className="hover:text-white transition-colors">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Right CTA Button */}
        <div className="hidden lg:block shrink-0">
          <Link
            to="/quote"
            className="px-6 py-3 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-sm rounded-md transition-all shadow-sm duration-200 inline-block"
          >
            Request Quote
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1626] border-t border-slate-800 px-6 py-5 flex flex-col gap-4 text-sm font-medium">
          <Link to="/" className="text-orange-500 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <div className="text-gray-200 font-semibold">Services</div>
          {servicesItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-gray-300 hover:text-white pl-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/how-it-works" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            How It Works
          </Link>
          <Link to="/pricing" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </Link>
          <Link to="/track" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            Track Shipment
          </Link>
          <Link to="/policy" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            Policy
          </Link>
          <Link to="/contact" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            Contact US
          </Link>
          <Link to="/about" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            About US
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-200 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/register" className="text-gray-200 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
          <div className="pt-2">
            <Link
              to="/quote"
              className="w-full text-center py-3 bg-[#FF6B00] text-white font-bold text-sm rounded-md block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Request Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
