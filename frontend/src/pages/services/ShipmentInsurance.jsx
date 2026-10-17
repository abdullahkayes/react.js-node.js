import React from 'react';
import { Link } from 'react-router-dom';

const ShipmentInsurance = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-400 space-x-1">
          <Link to="/" className="hover:underline">Home</Link>
          <span>›</span>
          <span>Services</span>
          <span>›</span>
          <span className="text-slate-600 font-medium">Shipment Insurance</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="lg:col-span-6 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Shipment Insurance
            </h1>
            <p className="text-lg font-bold text-[#FF5C00]">
              Added Protection. Clear Claims.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
              Optional shipment insurance helps protect eligible Import and Export shipments against covered loss, theft or physical damage during international transportation, subject to the Insurance &amp; Claims Policy.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-end">
            <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
                alt="Warehouse logistics" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
              🏷️
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Import &amp; Export Eligibility</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Available for eligible declared shipments across routes.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
              ◎
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Transit Protection</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Covered for loss or physical damage during transportation.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
              📄
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Direct Claim Filing</h3>
            <p className="text-[11px] text-slate-500 leading-snug">File claims directly via dashboard within the deadline.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
              🔍
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Transparent Claim Status</h3>
            <p className="text-[11px] text-slate-500 leading-snug">Track review, investigation and outcome status.</p>
          </div>
        </div>

        {/* About Shipment Insurance Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">About Shipment Insurance</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Insurance is optional and available for eligible shipments. The premium, declared value and coverage amount are confirmed before protection applies.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Insurance does not guarantee automatic compensation. Every claim is reviewed against the policy, shipment records, supporting evidence, custom laws and the approved declared value.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600" 
                alt="Forklift inside warehouse" 
                className="rounded-xl object-cover h-52 w-full shadow-sm"
              />
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Loss, Theft or Damage</h4>
                  <p className="text-[11px] text-slate-500">Coverage for covered loss, theft or physical damage.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Import &amp; Export Shipments</h4>
                  <p className="text-[11px] text-slate-500">Coverage available for eligible import and export shipments.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Evidence-Based Review</h4>
                  <p className="text-[11px] text-slate-500">Claims are thoroughly verified through supporting documents.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Wallet Compensation</h4>
                  <p className="text-[11px] text-slate-500">Approved claim payouts credited to your account wallet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Insurance & Claims Work Process Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">How Insurance &amp; Claims Work</h2>
            <div className="w-12 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                01
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                🛡️
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Add Insurance</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Select coverage during booking and declare accurate value.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                02
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                📄
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Coverage Confirmed</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Insurance premium, policy limit and coverage terms are activated.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                03
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                📋
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">File a New Claim</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                If an incident occurs, submit claim details within deadline via dashboard.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                04
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                🔍
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Review &amp; Investigation</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Proof of value, photos, and delivery logs are reviewed thoroughly.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center sm:col-span-3 lg:col-span-1">
              <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                05
              </span>
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
                💳
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Decision &amp; Compensation</h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Approved compensation is credited directly to your wallet.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-100 via-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-orange-200 text-[#FF5C00] flex items-center justify-center text-lg shrink-0 shadow-sm">
                📅
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block">Claim Deadline</span>
                <h4 className="text-sm font-bold text-[#FF5C00]">File within 7 calendar days</h4>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 sm:text-right max-w-md">
              Customers must file a new insurance claim directly within the applicable seven-day deadline. No preliminary notice is required.
            </p>
          </div>
        </div>

        {/* Documents You May Need & Claim Status Guide Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Documents You May Need</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mb-6"></div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">📄</span>
                  <h4 className="text-xs font-bold text-slate-900">Claim Form</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">📦</span>
                  <h4 className="text-xs font-bold text-slate-900">Shipment ID</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">🧾</span>
                  <h4 className="text-xs font-bold text-slate-900">Invoice / Proof of Value</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">📷</span>
                  <h4 className="text-xs font-bold text-slate-900">Damage Photos</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">📋</span>
                  <h4 className="text-xs font-bold text-slate-900">Shipment Receipt</h4>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[#FF5C00] text-xl mb-1">📂</span>
                  <h4 className="text-xs font-bold text-slate-900">Additional Evidence</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Claim Status Guide</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mb-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Documents Requested</h4>
                      <p className="text-[11px] text-slate-500">Additional documentation is needed.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Under Review</h4>
                      <p className="text-[11px] text-slate-500">The team is reviewing the claim submission.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Investigation In Progress</h4>
                      <p className="text-[11px] text-slate-500">Detailed verification and carrier tracking ongoing.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Approved or Rejected</h4>
                      <p className="text-[11px] text-slate-500">Final determination communicated.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Compensation Processed</h4>
                      <p className="text-[11px] text-slate-500">Approved sum credited to the user wallet.</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-full h-52 rounded-xl overflow-hidden shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                      alt="Team working in modern office" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Coverage Points */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Important Coverage Points</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0">✓</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Insured Shipments Only</h4>
                <p className="text-[10px] text-slate-500">Only applicable when insurance was added during booking.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0">✓</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Policy Limits Apply</h4>
                <p className="text-[10px] text-slate-500">Compensation is capped at maximum declared coverage limits.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0">✓</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Supporting Documents</h4>
                <p className="text-[10px] text-slate-500">Complete documentation is required for claim evaluation.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0">✓</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Shipment-Specific Decision</h4>
                <p className="text-[10px] text-slate-500">Each claim is individually reviewed based on facts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info Alert Banner */}
        <div className="bg-slate-100 rounded-lg p-3 border border-slate-200/80 flex items-center gap-3">
          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            i
          </span>
          <p className="text-[11px] text-slate-600">
            <strong className="text-slate-800">Important:</strong> File a new claim directly through the dashboard within the seven-day policy deadline. Prohibited, restricted, undeclared, or otherwise excluded goods are not eligible for compensation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentInsurance;