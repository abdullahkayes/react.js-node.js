import React from 'react';
import { Link } from 'react-router-dom';

const ReturnRTO = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased py-6 px-2 sm:px-2 lg:px-2 mx-auto space-y-6">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-400 space-x-1">
        <Link to="/" className="hover:underline">Home</Link>
        <span>›</span>
        <span>Services</span>
        <span>›</span>
        <span className="text-slate-600 font-medium">Return &amp; RTO Logistics</span>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="lg:col-span-6 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Return &amp; RTO Logistics
          </h1>
          <p className="text-lg font-bold text-[#FF5C00]">
            Clear Process. Responsible Reverse Handling.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            We coordinate customer returns and failed or unaccepted deliveries with documented review, live status updates and clear next steps for eligible Import and Export shipments.
          </p>
        </div>

        <div className="lg:col-span-6 flex justify-end relative">
          <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" 
              alt="Warehouse logistics" 
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-center border border-white/20">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                REVERSE LOGISTICS
              </span>
              <span className="text-sm font-bold text-[#FF5C00]">TL</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
            🔄
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Return Request Support</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Submit and track eligible customer returns.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
            📦
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">RTO Handling</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Failed or unaccepted deliveries are routed back.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
            ◎
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Live Status Updates</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Follow each reverse-logistics stage.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center mb-3 text-lg">
            📋
          </div>
          <h3 className="text-xs font-bold text-slate-900 mb-1">Documented Resolution</h3>
          <p className="text-[11px] text-slate-500 leading-snug">Inspection and outcome records are maintained.</p>
        </div>

      </div>

      {/* Understanding Return & RTO Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Understanding Return &amp; RTO</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              <strong className="text-slate-800">A Customer Return</strong> is initiated by the customer and remains subject to the seller's Return Window, required approval or RMA, and supporting documents.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              <strong className="text-slate-800">Return to Origin (RTO)</strong> applies when delivery fails or is not accepted. The shipment is routed to the appropriate processing location for review and next instructions.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600" 
              alt="High bay warehouse interior" 
              className="rounded-xl object-cover h-52 w-full shadow-sm"
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Import &amp; Export Support</h4>
                <p className="text-[11px] text-slate-500">We manage returns for eligible import and export shipments.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Seller / RMA Coordination</h4>
                <p className="text-[11px] text-slate-500">We coordinate with sellers for RMA, approval and instructions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Inspection on Receipt</h4>
                <p className="text-[11px] text-slate-500">Shipments are inspected and condition is recorded.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF5C00] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Status Notifications</h4>
                <p className="text-[11px] text-slate-500">You receive live updates at every step of reverse handling.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our 5-Step Return & RTO Process */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Our 5-Step Return &amp; RTO Process</h2>
          <div className="w-12 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Step 01 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              01
            </span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
              📄
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Request or Delivery Failure</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              A return is submitted or failed delivery is recorded.
            </p>
          </div>

          {/* Step 02 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              02
            </span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
              🔍
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Eligibility Review</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Reason, shipment details and documents are checked.
            </p>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              03
            </span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
              ⚙️
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Approval &amp; Instructions</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              RMA status, destination and charges are confirmed.
            </p>
          </div>

          {/* Step 04 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              04
            </span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
              🔄
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Reverse Transit</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              The shipment moves to the approved return location.
            </p>
          </div>

          {/* Step 05 */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm text-center relative flex flex-col items-center sm:col-span-3 lg:col-span-1">
            <span className="absolute top-3 left-3 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              05
            </span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center my-3 text-base">
              📋
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Inspection &amp; Resolution</h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Condition is recorded and the outcome is processed.
            </p>
          </div>

        </div>
      </div>

      {/* Two Reverse-Logistics Paths */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Two Reverse-Logistics Paths</h2>
          <div className="w-12 h-1 bg-[#FF5C00] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Path 1 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0 text-lg">
              📥
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">Customer Return</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Customer-initiated return, subject to seller rules and approval.
              </p>
            </div>
          </div>

          {/* Path 2 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0 text-lg">
              🔄
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">Return to Origin (RTO)</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Failed or unaccepted delivery returned for processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Information You May Need & Charges & Refunds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Information You May Need */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Information You May Need</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="text-[#FF5C00] text-xl mb-1">+</span>
                <h4 className="text-xs font-bold text-slate-900">Shipment ID</h4>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="text-[#FF5C00] text-xl mb-1">❓</span>
                <h4 className="text-xs font-bold text-slate-900">Return Reason</h4>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="text-[#FF5C00] text-xl mb-1">📷</span>
                <h4 className="text-xs font-bold text-slate-900">Photos or Evidence</h4>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="text-[#FF5C00] text-xl mb-1">👤</span>
                <h4 className="text-xs font-bold text-slate-900">Seller / RMA Approval</h4>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="text-[#FF5C00] text-xl mb-1">🧾</span>
                <h4 className="text-xs font-bold text-slate-900">Invoice or Receipt</h4>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                <span className="text-[#FF5C00] text-xl mb-1">📞</span>
                <h4 className="text-xs font-bold text-slate-900">Contact Details</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Charges & Refunds */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Charges &amp; Refunds</h3>
              <div className="w-8 h-1 bg-[#FF5C00] rounded-full mt-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Applicable Charges</h4>
                    <p className="text-[11px] text-slate-500">Return inspection, repacking, freight, customs and storage charges may apply.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Operational Error</h4>
                    <p className="text-[11px] text-slate-500">Verified Dazzling Shipping operational errors are handled under the applicable policy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Seller Refund</h4>
                    <p className="text-[11px] text-slate-500">Seller approval and successful settlement are not guaranteed by Dazzling Shipping.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#FF5C00] text-xs font-bold border border-[#FF5C00] rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Wallet Credit</h4>
                    <p className="text-[11px] text-slate-500">Applicable charges are deducted before any remaining amount is credited.</p>
                  </div>
                </div>
              </div>

              {/* Side Image Banner */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600" 
                    alt="City Skyline" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-white/20">
                    QUALITY INSPECTION
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info Alert Banner */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/60 flex items-center gap-3">
        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          i
        </span>
        <p className="text-[11px] text-slate-500">
          <strong className="text-slate-700">Important:</strong> Return eligibility depends on seller rules, service direction, product condition, documentation, carrier requirements and applicable law. Submit requests through the official dashboard workflow.
        </p>
      </div>

    </div>
  );
};

export default ReturnRTO;