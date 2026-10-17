import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    accountType: '',
    email: '',
    phoneCode: 'BD +880',
    phone: '',
    whatsappCode: 'BD +880',
    whatsapp: '',
    password: '',
    confirmPassword: '',
    homeAddress: '',
    warehouseAddress: '',
    tradeLicense: null,
    agreeTerms: false,
    confirmAccurate: false,
    agreeUpdates: false,
  });
  const [showTradeLicense, setShowTradeLicense] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeTerms || !formData.confirmAccurate) {
      setError('Please agree to the required terms');
      return;
    }
    if (showTradeLicense && !formData.tradeLicense) {
      setError('Please upload your Trade License/Business document');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      
      {/* Main Card Container */}
      <div className="w-full max-w-[680px] bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 mb-8">
        
        {/* Top User Plus Badge Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#FFF3EB] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#FF5A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#0A122A] tracking-tight mb-2">
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed max-w-md mx-auto">
            Join Dazzling Shipping and start your shipping journey with ease.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Grid Row 1: Full Name & Account Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                Full Name <span className="text-[#FF5A00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                Account Type <span className="text-[#FF5A00]">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] appearance-none transition"
                  value={formData.accountType}
                  onChange={(e) => {
                    setFormData({ ...formData, accountType: e.target.value });
                    setShowTradeLicense(e.target.value !== 'retail_customer');
                  }}
                >
                  <option value="">Select account type</option>
                  <option value="commercial_import">Commercial Import</option>
                  <option value="ecommerce_merchant">E-commerce Merchant Importer</option>
                  <option value="retail_customer">Retail Customer</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
              Email Address <span className="text-[#FF5A00]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Grid Row 2: Phone Number & WhatsApp Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                Phone Number <span className="text-[#FF5A00]">*</span>
              </label>
              <div className="flex border border-slate-200 rounded-xl focus-within:border-[#FF5A00] focus-within:ring-1 focus-within:ring-[#FF5A00] transition overflow-hidden">
                <div className="flex items-center gap-1 bg-slate-50 border-r border-slate-200 px-3 text-xs font-medium text-slate-700">
                  <span>BD</span>
                  <span>+880</span>
                  <svg className="w-3 h-3 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    className="w-full pl-3 pr-9 py-2.5 text-xs placeholder-slate-400 text-slate-800 focus:outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                WhatsApp Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex border border-slate-200 rounded-xl focus-within:border-[#FF5A00] focus-within:ring-1 focus-within:ring-[#FF5A00] transition overflow-hidden">
                <div className="flex items-center gap-1 bg-slate-50 border-r border-slate-200 px-3 text-xs font-medium text-slate-700">
                  <span>BD</span>
                  <span>+880</span>
                  <svg className="w-3 h-3 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    placeholder="Enter WhatsApp number"
                    className="w-full pl-3 pr-9 py-2.5 text-xs placeholder-slate-400 text-slate-800 focus:outline-none"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Row 3: Password & Confirm Password */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                  Password <span className="text-[#FF5A00]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                  Confirm Password <span className="text-[#FF5A00]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              Minimum 8 characters with letters, numbers & symbols.
            </p>
          </div>

          {/* Grid Row 4: Home/Business Address & Warehouse Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                Home / Business Address <span className="text-[#FF5A00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your home or business address"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition"
                  value={formData.homeAddress}
                  onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                Warehouse Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter your preferred warehouse address (if any)"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#FF5A00] focus:ring-1 focus:ring-[#FF5A00] transition"
                  value={formData.warehouseAddress}
                  onChange={(e) => setFormData({ ...formData, warehouseAddress: e.target.value })}
                />
              </div>
            </div>
          </div>

          {showTradeLicense && (
            <div>
              <label className="block text-[11px] font-bold text-slate-800 tracking-wider mb-2">
                Trade License/Business document <span className="text-[#FF5A00]">*</span>
              </label>
              <div className="p-5 border border-dashed border-slate-200 rounded-2xl bg-[#F8FAFC] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-0.5">
                    Upload your Trade License/Business document
                  </p>
                  <p className="text-[10px] text-slate-400 mb-2">(.jpeg, .png, .pdf)</p>
                  <label className="inline-block px-4 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer hover:bg-slate-50 shadow-2xs transition">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpeg,.jpg,.png,.pdf"
                      onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.files[0] })}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Terms & Conditions Checkboxes Container */}
          <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100/80 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-slate-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-slate-800">
                By creating an account, you agree to:
              </p>
            </div>

            <div className="pl-7 space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#FF5A00] focus:ring-[#FF5A00]"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#FF5A00] underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and applicable service-specific policies, and I acknowledge the{' '}
                  <Link to="/privacy" className="text-[#FF5A00] underline font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={formData.confirmAccurate}
                  onChange={(e) => setFormData({ ...formData, confirmAccurate: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#FF5A00] focus:ring-[#FF5A00]"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I confirm that all information provided is accurate
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.agreeUpdates}
                  onChange={(e) => setFormData({ ...formData, agreeUpdates: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#FF5A00] focus:ring-[#FF5A00]"
                />
                <div>
                  <span className="text-[11px] text-slate-600 block leading-tight">
                    I agree to receive important updates about my shipments
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Optional: You can unsubscribe at any time.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Create Account Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FF5A00] hover:bg-[#E04F00] active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-300 font-medium">or</span>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-xs text-slate-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF5A00] font-bold hover:underline ml-0.5">
            Login Now
          </Link>
        </p>
      </div>

      {/* Bottom Features Highlight Banner */}
      <div className="w-full max-w-[1000px] bg-white rounded-2xl border border-slate-100 shadow-2xs p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center px-3 pt-4 sm:pt-0">
            <div className="mb-2.5 text-slate-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase mb-1">
              SECURE & RELIABLE
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[170px]">
              Your data is protected with industry-standard security.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center px-3 pt-4 sm:pt-0">
            <div className="mb-2.5 text-slate-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase mb-1">
              REAL-TIME TRACKING
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[170px]">
              Track your shipments at every step in real-time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center px-3 pt-4 sm:pt-0">
            <div className="mb-2.5 text-slate-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase mb-1">
              DEDICATED SUPPORT
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[170px]">
              Our support team is always ready to help you.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center text-center px-3 pt-4 sm:pt-0">
            <div className="mb-2.5 text-slate-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase mb-1">
              TRANSPARENT PRICING
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[170px]">
              No hidden charges. What you see is what you pay.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;