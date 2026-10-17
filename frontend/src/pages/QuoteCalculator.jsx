import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AIR_FREIGHT_CATEGORIES, SEA_FREIGHT_CATEGORIES, getAirRatePerKg, getSeaRatePerKg } from '../data/pricingData';

const QuoteCalculator = () => {
  const [formData, setFormData] = useState({
    serviceMode: 'Export',
    originCountry: 'Bangladesh',
    originCode: 'BD',
    destinationCountry: 'United States (USA)',
    destinationCode: 'US',
    productCategory: 'CAT-A',
    customerType: 'Retail Customer',
    freightMode: 'Air Freight',
    totalWeight: '',
    length: '',
    width: '',
    height: '',
    addInsurance: false,
    invoiceValue: '',
  });

  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const routeInfo = useMemo(() => {
    if (formData.serviceMode === 'Import') {
      return {
        originCountry: 'United States (USA)',
        originCode: 'US',
        destinationCountry: 'Bangladesh',
        destinationCode: 'BD',
      };
    }
    return {
      originCountry: 'Bangladesh',
      originCode: 'BD',
      destinationCountry: 'United States (USA)',
      destinationCode: 'US',
    };
  }, [formData.serviceMode]);

  const l = parseFloat(formData.length) || 0;
  const w = parseFloat(formData.width) || 0;
  const h = parseFloat(formData.height) || 0;

  const volumetricWeight = useMemo(() => {
    if (!l || !w || !h) return 0;
    return (l * w * h) / 6000;
  }, [l, w, h]);

  const cbm = useMemo(() => {
    if (!l || !w || !h) return 0;
    return (l * w * h) / 1000000;
  }, [l, w, h]);

  const availableCategories = useMemo(() => {
    return formData.freightMode === 'Air Freight' ? AIR_FREIGHT_CATEGORIES : SEA_FREIGHT_CATEGORIES;
  }, [formData.freightMode]);

  const currentCategory = availableCategories.find(c => c.code === formData.productCategory);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      ...(type === 'checkbox' ? { [name]: checked } : { [name]: value }),
      ...(name === 'serviceMode' ? routeInfo : {}),
    }));
  };

  const handleSelectToggle = (field, value) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [field]: value,
        ...(field === 'serviceMode' ? routeInfo : {}),
      };
      if (field === 'freightMode') {
        const newCategories = value === 'Air Freight' ? AIR_FREIGHT_CATEGORIES : SEA_FREIGHT_CATEGORIES;
        const isValidCategory = newCategories.some(c => c.code === prev.productCategory);
        if (!isValidCategory) {
          newFormData.productCategory = newCategories[0].code;
        }
      }
      return newFormData;
    });
  };

  const getCategoryCode = () => formData.productCategory;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const actualWeight = parseFloat(formData.totalWeight);
    const catKey = getCategoryCode();
    const categoryData = availableCategories.find(c => c.code === catKey);

    if (!actualWeight || actualWeight <= 0) {
      setError('Please enter a valid total weight (kg).');
      setLoading(false);
      return;
    }

    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0) {
      setError('Please enter valid dimensions (Length, Width, Height).');
      setLoading(false);
      return;
    }

    if (!categoryData) {
      setError('Selected product category is not available for rate calculation.');
      setLoading(false);
      return;
    }

    const invoiceValue = formData.addInsurance ? (parseFloat(formData.invoiceValue) || 0) : 0;
    if (formData.addInsurance && invoiceValue <= 0) {
      setError('Please enter a valid invoice value for insurance calculation.');
      setLoading(false);
      return;
    }

    let freightEstimate = 0;
    let chargeableWeight = actualWeight;
    let ratePerKg = 0;
    let usedActualWeight = false;

    if (formData.freightMode === 'Air Freight') {
      ratePerKg = getAirRatePerKg(catKey, formData.customerType);

      chargeableWeight = Math.max(actualWeight, volumetricWeight);
      freightEstimate = ratePerKg * chargeableWeight;
    } else {
      ratePerKg = getSeaRatePerKg(catKey);
      usedActualWeight = true;
      freightEstimate = ratePerKg * actualWeight;
    }

    const insuranceCost = formData.addInsurance ? invoiceValue * 0.03 : 0;
    const totalEstimated = freightEstimate + insuranceCost;

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceMode: formData.serviceMode,
          itemType: 'Product / Goods',
          originCountry: routeInfo.originCountry,
          destinationCountry: routeInfo.destinationCountry,
          weightKg: actualWeight,
          dimensions: { length: l, width: w, height: h },
          freightMode: formData.freightMode,
          productCategory: catKey,
          customerType: formData.customerType,
          addInsurance: formData.addInsurance,
          invoiceValue: invoiceValue || 0,
          currency: 'USD',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuote({
          serviceMode: formData.serviceMode,
          freightMode: formData.freightMode,
          productCategory: catKey,
          customerType: formData.customerType,
          actualWeight: actualWeight.toFixed(2),
          volumetricWeight: volumetricWeight.toFixed(2),
          cbm: cbm.toFixed(4),
          chargeableWeight: chargeableWeight.toFixed(2),
          ratePerKg: ratePerKg.toFixed(2),
          freightEstimate: freightEstimate.toFixed(2),
          insuranceCost: insuranceCost.toFixed(2),
          totalEstimatedCost: totalEstimated.toFixed(2),
          usedActualWeight,
        });
      } else {
        throw new Error(await res.text());
      }
    } catch (err) {
      setQuote({
        serviceMode: formData.serviceMode,
        freightMode: formData.freightMode,
        productCategory: catKey,
        customerType: formData.customerType,
        actualWeight: actualWeight.toFixed(2),
        volumetricWeight: volumetricWeight.toFixed(2),
        cbm: cbm.toFixed(4),
        chargeableWeight: chargeableWeight.toFixed(2),
        ratePerKg: ratePerKg.toFixed(2),
        freightEstimate: freightEstimate.toFixed(2),
        insuranceCost: insuranceCost.toFixed(2),
        totalEstimatedCost: totalEstimated.toFixed(2),
        usedActualWeight,
      });
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      serviceMode: 'Export',
      originCountry: 'Bangladesh',
      originCode: 'BD',
      destinationCountry: 'United States (USA)',
      destinationCode: 'US',
      productCategory: 'CAT-A',
      customerType: 'Retail Customer',
      freightMode: 'Air Freight',
      totalWeight: '',
      length: '',
      width: '',
      height: '',
      addInsurance: false,
      invoiceValue: '',
    });
    setQuote(null);
    setError('');
  };

  const displayVolumetric = formData.freightMode === 'Air Freight'
    ? `${volumetricWeight.toFixed(2)} kg`
    : `${cbm.toFixed(4)} CBM`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto space-y-2">

        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B]">
              Shipment Cost Calculator
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Estimate Import or Export shipping costs.<br className="hidden sm:block" />
              Export results are preliminary; final pricing is shipment-specific after verification.
            </p>
          </div>
          <Link to="/help" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            How it works
          </Link>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Side: Input Form Steps (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Step 1: Shipment Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <h2 className="text-sm font-bold text-[#0B132B]">1. Shipment Details</h2>

              {/* Service Mode Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Service Mode <span className="text-red-500">*</span>
                </label>
                <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => handleSelectToggle('serviceMode', 'Import')}
                    className={`px-4 py-1.5 rounded-md transition-all ${
                      formData.serviceMode === 'Import'
                        ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Import
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectToggle('serviceMode', 'Export')}
                    className={`px-4 py-1.5 rounded-md transition-all ${
                      formData.serviceMode === 'Export'
                        ? 'bg-[#FF5C00] text-white font-semibold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* Route Display Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                    {routeInfo.originCode}
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      ORIGIN COUNTRY
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {routeInfo.originCountry}
                    </span>
                  </div>
                </div>

                <span className="text-[#FF5C00] font-bold text-sm">›</span>

                <div className="flex items-center gap-3 justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      DESTINATION COUNTRY
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {routeInfo.destinationCountry}
                    </span>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                    {routeInfo.destinationCode}
                  </span>
                </div>
              </div>

              {/* Category, Customer Type, Freight Mode Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Product Category (CAT) <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.code} - {cat.label}
                      </option>
                    ))}
                  </select>
                  <Link to="/pricing" className="text-[10px] text-[#FF5C00] font-medium hover:underline mt-1 inline-block">
                    View category details
                  </Link>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Customer Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#FF5C00]"
                  >
                    <option value="E-commerce Merchant Importer">E-commerce Merchant Importer</option>
                    <option value="Retail Customer">Retail Customer</option>
                    <option value="Commercial Import">Commercial Import</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Freight Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium w-full justify-between">
                    <button
                      type="button"
                      onClick={() => handleSelectToggle('freightMode', 'Air Freight')}
                      className={`flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1 ${
                        formData.freightMode === 'Air Freight'
                          ? 'bg-[#FF5C00] text-white font-semibold shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <span>✈</span> Air Freight
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectToggle('freightMode', 'Sea / Ocean')}
                      className={`flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1 ${
                        formData.freightMode === 'Sea / Ocean'
                          ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <span>🚢</span> Sea / Ocean
                    </button>
                  </div>
                </div>
              </div>

              {/* Weight & Dimensions Input Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Total Weight (Actual) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="totalWeight"
                      value={formData.totalWeight}
                      onChange={handleChange}
                      placeholder="5"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg pr-8 focus:outline-none focus:border-[#FF5C00]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Length <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      placeholder="40"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg pr-8 focus:outline-none focus:border-[#FF5C00]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">cm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Width <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleChange}
                      placeholder="30"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg pr-8 focus:outline-none focus:border-[#FF5C00]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">cm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Height <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="20"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg pr-8 focus:outline-none focus:border-[#FF5C00]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">cm</span>
                  </div>
                </div>
              </div>

              {/* Volumetric Weight / CBM Banner */}
              <div className="bg-[#FFFBEB] border border-[#FCD34D]/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    {formData.freightMode === 'Air Freight'
                      ? 'Volumetric Weight (Chargeable Weight)'
                      : 'CBM'}
                  </span>
                  <span className="text-base font-extrabold text-[#0B132B]">
                    {displayVolumetric}
                  </span>
                </div>
                <div className="text-[11px] text-amber-800/80 flex items-start gap-1.5 leading-snug">
                  <span className="text-amber-500 font-bold">ⓘ</span>
                  <span>
                    {formData.freightMode === 'Air Freight'
                      ? 'The higher value between Actual Weight and Volumetric Weight will be used for pricing. Formula: (L × W × H) / 6000'
                      : 'CBM = (L × W × H) / 1,000,000 . For sea freight, preliminary estimate uses actual weight × rate per kg.'}
                  </span>
                </div>
              </div>

            </div>

            {/* Step 2: Additional Service (Optional) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-[#0B132B]">2. Additional Service (Optional)</h2>

              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 text-sm shrink-0 mt-0.5">
                    🛡
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0B132B]">Parcel Insurance</h3>
                    <p className="text-[11px] text-slate-400">
                      Protect your parcel against loss, theft or damage during international transportation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="addInsurance"
                      checked={formData.addInsurance}
                      onChange={handleChange}
                      className="rounded text-[#FF5C00] focus:ring-[#FF5C00]"
                    />
                    Add Insurance (3% of invoice value)
                  </label>

                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">
                      Invoice Value
                    </span>
                    <div className="relative mt-0.5">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">$</span>
                      <input
                        type="number"
                        name="invoiceValue"
                        value={formData.invoiceValue}
                        onChange={handleChange}
                        disabled={!formData.addInsurance}
                        placeholder="100"
                        className="w-24 text-xs pl-6 pr-2 py-1 bg-white border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-[#FF5C00] disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Action Buttons */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
              <h2 className="text-sm font-bold text-[#0B132B] mb-4">3. Calculate Estimate</h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                >
                  🔄 Reset
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#FF5C00] hover:bg-[#e55300] text-white rounded-xl text-xs font-bold transition-colors shadow-2xs disabled:opacity-50"
                >
                  {loading ? 'Calculating...' : '📄 Calculate Estimate'}
                </button>

              </div>

              {error && <p className="text-xs text-red-500 font-medium text-center pt-2">{error}</p>}
              <p className="text-[10px] text-slate-400 text-center pt-2 mt-2">
                All costs are preliminary. Final pricing will be confirmed after shipment review,
                verified weight/dimensions, category review, and any required operational or
                documentation checks.
              </p>
            </div>

          </div>

          {/* Right Side: Estimated Cost Summary Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Summary Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0B132B]">Estimated Cost Summary</h3>
                <span className="text-slate-300 text-base">📄</span>
              </div>

              {quote ? (
                <>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Service Mode</span>
                      <span className="font-semibold text-slate-800">{quote.serviceMode}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Freight Mode</span>
                      <span className="font-semibold text-slate-800">{quote.freightMode}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Product Category</span>
                      <span className="font-semibold text-slate-800">
                        {quote.productCategory} - {availableCategories.find(c => c.code === quote.productCategory)?.label || ''}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Customer Type</span>
                      <span className="font-semibold text-slate-800">{quote.customerType}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Actual Weight</span>
                      <span className="font-semibold text-slate-800">{quote.actualWeight} kg</span>
                    </div>
                    {formData.freightMode === 'Air Freight' && (
                      <>
                        <div className="flex justify-between text-slate-500">
                          <span>Volumetric Weight</span>
                          <span className="font-semibold text-slate-800">{quote.volumetricWeight} kg</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Chargeable Weight</span>
                          <span className="font-semibold text-slate-800">{quote.chargeableWeight} kg</span>
                        </div>
                      </>
                    )}
                    {formData.freightMode === 'Sea / Ocean' && (
                      <>
                        <div className="flex justify-between text-slate-500">
                          <span>CBM</span>
                          <span className="font-semibold text-slate-800">{quote.cbm} CBM</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Volumetric Weight</span>
                          <span className="font-semibold text-slate-800">{(quote.cbm * 1000).toFixed(2)} kg</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>Rate (per kg)</span>
                      <span className="font-semibold text-slate-800">${quote.ratePerKg}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Preliminary Freight Estimate</span>
                      <span className="font-semibold text-slate-800">${quote.freightEstimate}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Insurance (3% of invoice value)</span>
                      <span className="font-semibold text-slate-800">${quote.insuranceCost}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B132B]">Preliminary Estimated Cost</span>
                    <span className="text-2xl font-black text-[#FF5C00]">${quote.totalEstimatedCost}</span>
                  </div>

                  <div className="bg-[#FFFBEB] border border-[#FCD34D]/50 rounded-xl p-3 text-[11px] text-amber-900/80 leading-relaxed">
                    {formData.freightMode === 'Sea / Ocean'
                      ? 'Sea freight estimate uses actual weight × rate per kg. Final charge will apply the higher of actual weight or CBM (W/M rule) after Dhaka Hub verification.'
                      : 'Air freight estimate uses the higher of actual weight or volumetric weight. Final pricing depends on verified measurements and carrier review.'}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2.5 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Service Mode</span>
                      <span className="font-semibold text-slate-300">{formData.serviceMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Freight Mode</span>
                      <span className="font-semibold text-slate-300">{formData.freightMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actual Weight</span>
                      <span className="font-semibold text-slate-300">—</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preliminary Freight Estimate</span>
                      <span className="font-semibold text-slate-300">$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance (3% of invoice value)</span>
                      <span className="font-semibold text-slate-300">$0.00</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B132B]">Preliminary Estimated Cost</span>
                    <span className="text-2xl font-black text-[#FF5C00]">$0.00</span>
                  </div>

                  <div className="bg-[#FFFBEB] border border-[#FCD34D]/50 rounded-xl p-3 text-[11px] text-amber-900/80 leading-relaxed">
                    Enter shipment details and click Calculate Estimate to see the preliminary cost.
                  </div>
                </>
              )}
            </div>

            {/* Estimate Basis Checklist Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-[#0B132B]">Estimate Basis</h3>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  {formData.freightMode === 'Air Freight'
                    ? 'Air freight from Bangladesh to the USA'
                    : 'Ocean freight from Bangladesh to the USA'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  {formData.serviceMode === 'Export'
                    ? 'Export handling in Bangladesh'
                    : 'Import customs clearance in Bangladesh'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  Basic Documentation Review
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  Secure Handling
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                      Customer type: {['E-commerce Merchant Importer', 'Commercial Import'].includes(formData.customerType) ? 'Commercial rate' : 'Standard rate'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  All estimates in USD
                </li>
              </ul>
            </div>

            {/* Important Notes Box */}
            <div className="bg-[#FFFBEB] border border-[#FCD34D]/50 rounded-2xl p-6 space-y-3">
              <h3 className="text-xs font-bold text-amber-900">Important Notes</h3>

              <ul className="space-y-2 text-[11px] text-amber-900/80 list-disc list-inside leading-relaxed">
                <li>Delivery time varies based on shipping method, customs clearance, and local delivery conditions.</li>
                <li>Minimum chargeable weight depends on customer type.</li>
                <li>Prohibited items are not allowed.</li>
                <li>Prohibited or restricted items are not accepted.</li>
                <li>Rates are subject to change without prior notice.</li>
                <li>This calculator is for Product/Goods shipments only. Document shipments require a custom quotation.</li>
                <li>Sea freight estimates use actual weight. Final charges may differ based on W/M (Weight or Measurement) rules applied after verification at Dhaka Hub.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default QuoteCalculator;
