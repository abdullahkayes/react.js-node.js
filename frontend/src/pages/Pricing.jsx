import React, { useState, useMemo } from 'react';
import { AIR_FREIGHT_CATEGORIES, SEA_FREIGHT_CATEGORIES } from '../data/pricingData';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('import'); // 'import' or 'export'

  const toDisplayAir = (cat) => ({
    code: cat.code.replace(/-/g, ' - '),
    product: cat.product,
    charge1: cat.charge1,
    charge2: cat.charge2,
    charge3: cat.charge3,
    customs: cat.customs,
  });

  const toDisplayAirExport = (cat) => ({
    code: cat.code.replace(/-/g, ' - '),
    product: cat.product,
    charge1: cat.code === 'CAT-A' ? '$9 - $10 (Commercial Export)' : cat.charge1,
    charge2: cat.code === 'CAT-A' ? '$10 - $12 (E-Commerce & B2C Merchants)' : cat.charge2,
    charge3: cat.code === 'CAT-A' ? '$12 - $14 (Personal & Independent Buyer)' : cat.charge3,
    customs: cat.customs,
  });

  const toDisplaySea = (cat) => ({
    code: cat.code.replace(/-/g, ' - '),
    product: cat.product,
    charge: cat.chargeDisplay,
    conditions: cat.conditions,
  });

  const importAirData = useMemo(() => AIR_FREIGHT_CATEGORIES.map(toDisplayAir), []);
  const exportAirData = useMemo(() => {
    return AIR_FREIGHT_CATEGORIES.map(cat => {
      const base = toDisplayAir(cat);
      if (cat.code === 'CAT-A') {
        return { ...base, charge1: '$9 - $10 (Commercial Export)' };
      }
      return base;
    });
  }, []);
  const importSeaData = useMemo(() => SEA_FREIGHT_CATEGORIES.map(toDisplaySea), []);
  const exportSeaData = useMemo(() => SEA_FREIGHT_CATEGORIES.map(toDisplaySea), []);

  const currentAirData = activeTab === 'import' ? importAirData : exportAirData;
  const currentSeaData = activeTab === 'import' ? importSeaData : exportSeaData;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* Hero Header Section */}
      <section className="bg-[#0B0F19] text-white py-14 px-2 sm:px-2 lg:px-2 relative overflow-hidden">
        <div className=" mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Flexible,<br />
              Transparent <span className="text-[#FF5C00]">Pricing</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Estimated Import pricing and shipment-specific Export quotations for USA–Bangladesh trade.
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 max-w-xl leading-relaxed">
              Import rates are estimated. Export quotations are confirmed after Dhaka hub eligibility, weight dimensions, documentation, customs, and carrier review.
            </p>
            
            {/* Dynamic Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('import')}
                className={`px-5 py-2 rounded-md text-xs font-bold transition shadow-sm ${
                  activeTab === 'import'
                    ? 'bg-[#FF5C00] text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Import Pricing
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`px-5 py-2 rounded-md text-xs font-bold transition shadow-sm ${
                  activeTab === 'export'
                    ? 'bg-[#FF5C00] text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Export Pricing
              </button>
            </div>
          </div>

          <div className="md:col-span-5 hidden md:block">
            {/* Right Abstract Box Decorative Frame */}
            {/* <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-slate-800/80 to-slate-900 border border-slate-800 p-6 flex items-center justify-center">
              <div className="text-slate-600 text-xs font-mono text-center">
                [ Dynamic Rate &amp; Tariff Dashboard ]
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="py-10 px-2 sm:px-2 lg:px-2 space-y-6 mx-auto">
        
        {/* Top 4 Service Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-sm font-bold">
              ⚖️
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 mb-0.5">Export Air Freight</h3>
            <p className="text-[11px] font-bold text-[#FF5C00] mb-3">Starting from $9/Kg</p>
            <ul className="text-[10px] text-slate-500 space-y-1 text-left w-full pl-2">
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Shipment-specific estimate
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Bangladesh-to-USA service
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Fast international shipping
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-sm font-bold">
              📦
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 mb-0.5">Export Ocean Freight</h3>
            <p className="text-[11px] font-bold text-[#FF5C00] mb-3">Starting from $0.85/Kg</p>
            <ul className="text-[10px] text-slate-500 space-y-1 text-left w-full pl-2">
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Cost effective for bulk cargo
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> W/M or CBM rules apply
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Minimum lot and booking conditions
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-sm font-bold">
              📄
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 mb-0.5">Export Quotation</h3>
            <p className="text-[11px] font-bold text-slate-600 mb-3">Shipment-specific</p>
            <ul className="text-[10px] text-slate-500 space-y-1 text-left w-full pl-2">
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Product eligibility review
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Weight and dimensions verified at Dhaka Hub
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Export final invoicing and payment occurs after USA arrival, customs processing and USA-warehouse measurement, before USA last-mile dispatch
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-2 text-sm font-bold">
              🏢
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 mb-0.5">Dhaka Hub Consolidation</h3>
            <p className="text-[11px] font-bold text-slate-600 mb-3">Export preparation</p>
            <ul className="text-[10px] text-slate-500 space-y-1 text-left w-full pl-2">
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Inspection and photo record
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Export-safe repacking
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#FF5C00]">✓</span> Batch and manifest preparation
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing Logic Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pricing Logic</h2>
            <div className="w-8 h-0.5 bg-[#FF5C00] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="text-[#FF5C00] text-xs mb-1">⚖️</span>
              <h4 className="text-[10px] font-bold text-slate-900 mb-1">Air Freight Chargeable Weight</h4>
              <p className="text-[9px] text-slate-400">Higher of actual vs Volumetric weight</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="text-[#FF5C00] text-xs mb-1">📦</span>
              <h4 className="text-[10px] font-bold text-slate-900 mb-1">Air Volumetric Formula</h4>
              <p className="text-[9px] text-slate-400">L x W x H (cm) / 5000</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="text-[#FF5C00] text-xs mb-1">🌊</span>
              <h4 className="text-[10px] font-bold text-slate-900 mb-1">Ocean Freight W/M Rule</h4>
              <p className="text-[9px] text-slate-400">Higher of actual weight or volume-equivalent weight</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="text-[#FF5C00] text-xs mb-1">📐</span>
              <h4 className="text-[10px] font-bold text-slate-900 mb-1">Ocean Volume Conversion</h4>
              <p className="text-[9px] text-slate-400">1 CBM = 1000 chargeable kg</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="text-[#FF5C00] text-xs mb-1">🏢</span>
              <h4 className="text-[10px] font-bold text-slate-900 mb-1">Dhaka Hub Verification</h4>
              <p className="text-[10px] text-slate-400 leading-tight">Final invoice after actual weight, dimensions and third-party charges</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="text-[#FF5C00] text-xs mb-1">🎯</span>
              <h4 className="text-[10px] font-bold text-slate-900 mb-1">Shipment-Specific Quote</h4>
              <p className="text-[9px] text-slate-400">Preliminary cost eligibility guidance and carrier review</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="text-[#FF5C00] text-xs mb-1">🛡️</span>
              <h4 className="text-[10px] font-bold text-slate-900 mb-1">Insurance Optional</h4>
              <p className="text-[9px] text-slate-400">3% of declared product invoice value</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
              <span className="text-[#FF5C00] text-xs mb-1">🏢</span>
              <h4 className="text-[10px] font-bold text-slate-900 mb-1">Support for Bulk Exporters</h4>
              <p className="text-[9px] text-slate-400">Custom guidance for large export shipments</p>
            </div>
          </div>
        </div>

        {/* TABLE 1: AIR FREIGHT TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-[#0B0F19] text-white py-3 px-6 text-center font-bold text-xs sm:text-sm tracking-wide">
            {activeTab === 'import'
              ? 'Air Freight Import Category-Based Pricing Table (2026)'
              : 'Air Freight Export Category-Based Pricing Table (2026)'}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#0B0F19] text-slate-200 text-[10px] sm:text-[11px] font-bold border-t border-slate-800 uppercase tracking-wider">
                  <th className="py-3 px-4 w-[12%]">Category Code</th>
                  <th className="py-3 px-4 w-[32%]">Product Name / Items</th>
                  <th className="py-3 px-4 text-center w-[12%]">Our Charge (Per KG)</th>
                  <th className="py-3 px-4 text-center w-[12%]">Our Charge (Per KG)</th>
                  <th className="py-3 px-4 text-center w-[12%]">Our Charge (Per KG)</th>
                  <th className="py-3 px-4 w-[22%]">Customs Clearance &amp; Duty Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[10px] sm:text-[11px] text-slate-700">
                {currentAirData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.code}</td>
                    <td className="py-3.5 px-4 leading-normal">{row.product}</td>
                    <td className="py-3.5 px-4 text-center font-medium">{row.charge1}</td>
                    <td className="py-3.5 px-4 text-center font-medium">{row.charge2}</td>
                    <td className="py-3.5 px-4 text-center font-medium">{row.charge3}</td>
                    <td className="py-3.5 px-4 text-slate-500 leading-normal">{row.customs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 2: SEA/OCEAN FREIGHT TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
          <div className="bg-[#0B0F19] text-white py-3 px-6 text-center font-bold text-xs sm:text-sm tracking-wide">
            {activeTab === 'import'
              ? 'Sea/Ocean Freight Import Category-Based Pricing Table (2026)'
              : 'Sea/Ocean Freight Export Category-Based Pricing Table (2026)'}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#0B0F19] text-slate-200 text-[10px] sm:text-[11px] font-bold border-t border-slate-800 uppercase tracking-wider">
                  <th className="py-3 px-4 w-[12%]">Category Code</th>
                  <th className="py-3 px-4 w-[38%]">Product Name / Items</th>
                  <th className="py-3 px-4 text-center w-[18%]">Our Charge (Per KG)</th>
                  <th className="py-3 px-4 w-[32%]">Customs &amp; Special Conditions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[10px] sm:text-[11px] text-slate-700">
                {currentSeaData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.code}</td>
                    <td className="py-3.5 px-4 leading-normal">{row.product}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#FF5C00]">{row.charge}</td>
                    <td className="py-3.5 px-4 text-slate-500 leading-normal">{row.conditions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[9px] text-slate-400 text-center">
            Subject to minimum payable lot and approved quotation, the final charge will be determined based on the applicable higher W/M or CBM calculation.
          </div>
        </div>

        {/* Footer Warning / Info Note */}
        <div className="bg-slate-100 rounded-lg p-3 border border-slate-200/80 flex items-center gap-2.5">
          <span className="w-4 h-4 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
            !
          </span>
          <p className="text-[10px] text-slate-600">
            <strong className="text-slate-800">Important Note:</strong> Export rates are estimates. Final quotation is confirmed after product eligibility, Dhaka Hub weight and measurement, documentation, carrier approval, customs requirements, and applicable third-party charges. Export customs clearance, carrier booking, and dispatch begin after 100% payment.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Pricing;