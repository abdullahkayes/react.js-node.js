import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'My Shipments', path: '/my-shipments', icon: '📦' },
    { name: 'Self Purchase', path: '/services/self-purchase', icon: '📥' },
    { name: 'Assisted Purchase', path: '/services/assisted-purchase', icon: '🛒' },
    { name: 'Shipment Tracker', path: '/track', icon: '🔍' },
    { name: 'Cost Calculator', path: '/quote', icon: '🧮' },
    { name: 'Wallet', path: '/wallet', icon: '💳' },
    { name: 'Payments', path: '/payments', icon: '📄' },
    { name: 'Insurance', path: '/insurance', icon: '🛡️' },
    { name: 'Return & RTO', path: '/return-rto', icon: '🔄' },
    { name: 'Export Booking', path: '/book', icon: '✈️' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-800 antialiased">
      <Navbar />
      <div className=" mx-auto flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-60 md:sticky md:top-20 md:h-[calc(100vh-5rem)] overflow-y-auto bg-[#0B132B] text-slate-300 p-4 shrink-0 border-r border-slate-800/60">
          <div className="flex items-center gap-2 px-3 py-2 mb-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="w-6 h-6 bg-[#FF5C00] rounded flex items-center justify-center text-white text-xs font-bold">
              ⚡
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">Dazzling</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider">SHIPPING</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#FF5C00] text-white font-bold shadow-sm'
                      : 'hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span> {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Dashboard Content Body */}
        <main className="flex-1 p-4 sm:p-2 lg:p-2 space-y-6 overflow-x-hidden">
          {/* Top Search & Profile Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 sm:px-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search shipments, orders, tracking ID..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#FF5C00]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
              <button className="relative p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-xl border border-slate-200">
                🔔
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5C00] rounded-full"></span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'J'}
                    {user?.name ? user.name.split(' ')[1]?.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {user?.name || 'John Doe'}
                    </span>
                    <span className="text-[10px] text-slate-400">Customer</span>
                  </div>
                  <span className="text-xs text-slate-400">▼</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50">
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#FF5C00] transition-colors"
                    >
                      <span>👤</span> Profile
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#FF5C00] transition-colors"
                    >
                      <span>⚙️</span> Settings
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <span>🔓</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page Content Outlet */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;