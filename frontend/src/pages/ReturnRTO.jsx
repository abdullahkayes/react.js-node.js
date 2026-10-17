import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReturnRTO = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Metric Cards Data
  const metrics = [
    {
      title: 'RETURN REQUESTS',
      value: '3',
      subtext: 'Total requests',
      icon: '🔄',
      iconBg: 'bg-emerald-50 text-emerald-500',
    },
    {
      title: 'PENDING REVIEW',
      value: '1',
      subtext: 'Awaiting approval',
      icon: '🕒',
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      title: 'IN PROGRESS',
      value: '1',
      subtext: 'Return being processed',
      icon: '📦',
      iconBg: 'bg-orange-50 text-orange-500',
    },
    {
      title: 'COMPLETED',
      value: '5',
      subtext: 'Successfully resolved',
      icon: '✔️',
      iconBg: 'bg-cyan-50 text-cyan-500',
    },
  ];

  // 2. Active Return Requests Table Data
  const activeRequests = [
    {
      id: 'RT-2026-00034',
      shipmentId: 'SHIP-2026-000120',
      itemId: 'ITM-263120-02',
      reason: 'Size issue',
      date: 'May 14, 2026',
      time: '10:20 AM',
      status: 'Approved',
      statusClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'RT-2026-00033',
      shipmentId: 'SHIP-2026-000112',
      itemId: 'ITM-263112-01',
      reason: 'Not as Described',
      date: 'May 13, 2026',
      time: '04:15 PM',
      status: 'Under review',
      statusClass: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      id: 'RT-2026-00032',
      shipmentId: 'SHIP-2026-000108',
      itemId: 'All Item IDs',
      reason: 'Seller confirmed: Damaged in transit',
      date: 'May 12, 2026',
      time: '11:23 AM',
      status: 'Return In Transit',
      statusClass: 'bg-orange-50 text-orange-600 border-orange-100',
    },
  ];

  // 3. Active RTO Shipments Table Data
  const rtoShipments = [
    {
      id: 'SHIP-2026-000126',
      trackingNo: '1Z999AA10123456784',
      reason: 'Customer Unavailable',
      location: 'Returning to Dhaka Hub',
      status: 'Out for Return',
      statusClass: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    {
      id: 'SHIP-2026-000112',
      trackingNo: '1Z999AA10123456721',
      reason: 'Delivery Attempt Failed',
      location: 'Dhaka Hub',
      status: 'Received at hub',
      statusClass: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      id: 'SHIP-2026-00098',
      trackingNo: '1Z999AA10123456677',
      reason: 'Customer Refused',
      location: 'Returning to Dhaka Hub',
      status: 'Returning to hub',
      statusClass: 'bg-orange-50 text-orange-600 border-orange-100',
    },
  ];

  // 4. Return & RTO History Table Data
  const historyItems = [
    {
      id: 'RT-2026-00028',
      shipmentId: 'SHIP-2026-000072',
      type: 'Return',
      itemId: 'ITM-260072-01',
      reason: 'SELLER ACKNOWLEDGED: DAMAGED',
      date: 'May 05, 2026',
      status: 'Completed',
      statusClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'RTO-2026-00018',
      shipmentId: 'SHIP-2026-000067',
      type: 'RTO',
      itemId: 'Whole Shipment',
      reason: 'Customer Unavailable',
      date: 'May 01, 2026',
      status: 'Completed',
      statusClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'RT-2026-00027',
      shipmentId: 'SHIP-2026-000064',
      type: 'Return',
      itemId: 'ITM-260064-01',
      reason: 'Not as Described',
      date: 'Apr 28, 2026',
      status: 'Rejected',
      statusClass: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      id: 'RTO-2026-00017',
      shipmentId: 'SHIP-2026-000059',
      type: 'RTO',
      itemId: 'Whole Shipment',
      reason: 'Delivery Attempt Failed',
      date: 'Apr 25, 2026',
      status: 'Completed',
      statusClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'RT-2026-00026',
      shipmentId: 'SHIP-2026-000052',
      type: 'Return',
      itemId: 'ITM-260052-03',
      reason: 'Changed My Mind',
      date: 'Apr 20, 2026',
      status: 'Completed',
      statusClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  ];

  // 5. Timeline Events for Sidebar
  const timelineEvents = [
    {
      title: 'Return Requested',
      date: 'May 14, 2026 10:20 AM',
      description: 'Your return request has been submitted.',
      completed: true,
      icon: '🔄',
      iconBg: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Request Received',
      date: 'May 15, 2026 09:45 AM',
      description: 'We are reviewing your request and details.',
      completed: true,
      icon: '🕒',
      iconBg: 'text-purple-500 bg-purple-50 border-purple-200',
    },
    {
      title: 'Return Approved',
      date: 'May 15, 2026 11:15 AM',
      description: 'Your return request has been approved.',
      completed: true,
      icon: '✔️',
      iconBg: 'text-blue-500 bg-blue-50 border-blue-200',
    },
    {
      title: 'Awaiting Shipment Return',
      date: 'May 15, 2026 11:50 AM',
      description: 'Please send the item back to our Dhaka hub using the provided instructions.',
      completed: true,
      icon: '🏷️',
      iconBg: 'text-orange-500 bg-orange-50 border-orange-200',
    },
    {
      title: 'Pending',
      date: '',
      description: 'Once we receive the item, inspection will be completed and the next steps will follow.',
      completed: false,
      icon: '⚪',
      iconBg: 'text-slate-300 bg-slate-50 border-slate-200',
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-700 text-xs p-2 sm:p-2 space-y-5">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Return & RTO</h1>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Manage return requests, track RTO shipments, and view your return history.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{metric.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
              <p className="text-[11px] text-slate-400">{metric.subtext}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base ${metric.iconBg}`}>
              {metric.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Navigation Toolbar */}
      <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-2xs flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-600">
        <span className="font-bold text-slate-400 tracking-wider text-[10px] uppercase mr-1">QUICK ACTIONS</span>
        <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Request Return
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Track Return/RTO
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> RTO Shipments
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Return History
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Contact Support
        </button>
      </div>

      {/* Main Grid: Left Detailed Content (2 Cols) + Right Sidebar (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        
        {/* Left Column Section */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Card 1: Active Return Requests */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">Active Return Requests</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-2.5 flex items-center text-slate-300 text-[11px]">🔍</span>
                  <input
                    type="text"
                    placeholder="Search Item ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white w-full sm:w-48"
                  />
                </div>
                <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2">RETURN ID</th>
                    <th className="py-2.5 px-2">SHIPMENT ID</th>
                    <th className="py-2.5 px-2">ITEM ID</th>
                    <th className="py-2.5 px-2">RETURN PURPOSE / REASON</th>
                    <th className="py-2.5 px-2">REQUEST DATE</th>
                    <th className="py-2.5 px-2">STATUS</th>
                    <th className="py-2.5 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {activeRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-slate-800">{req.id}</td>
                      <td className="py-3.5 px-2 text-slate-400 font-medium">{req.shipmentId}</td>
                      <td className="py-3.5 px-2 font-bold text-slate-800 whitespace-pre-line">{req.itemId}</td>
                      <td className="py-3.5 px-2 text-slate-600 max-w-[150px]">{req.reason}</td>
                      <td className="py-3.5 px-2 text-slate-400">
                        <div>{req.date}</div>
                        <div className="text-[10px] text-slate-300">{req.time}</div>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${req.statusClass}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button className="text-blue-600 font-bold hover:underline">Track</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
              <span>Showing 1 to 3 of 3 requests</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-50">&lt;</button>
                <button className="px-2 py-1 rounded bg-[#FF5C00] text-white font-bold">1</button>
                <button className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">2</button>
                <button className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">&gt;</button>
              </div>
            </div>
          </div>

          {/* Card 2: Active RTO Shipments */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Active RTO Shipments</h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2">SHIPMENT ID</th>
                    <th className="py-2.5 px-2">TRACKING NUMBER</th>
                    <th className="py-2.5 px-2">RTO REASON</th>
                    <th className="py-2.5 px-2">CURRENT LOCATION</th>
                    <th className="py-2.5 px-2">STATUS</th>
                    <th className="py-2.5 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {rtoShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-slate-800">{shipment.id}</td>
                      <td className="py-3.5 px-2 font-mono text-slate-400 text-[10px]">{shipment.trackingNo}</td>
                      <td className="py-3.5 px-2 text-slate-600">{shipment.reason}</td>
                      <td className="py-3.5 px-2 text-slate-600">{shipment.location}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${shipment.statusClass}`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button className="text-slate-800 font-bold hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[10px] text-slate-400">
              Showing 1 to 3 of 3 RTO shipments
            </div>
          </div>

          {/* Card 3: Return & RTO History */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Return & RTO History</h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2">ID</th>
                    <th className="py-2.5 px-2">SHIPMENT ID</th>
                    <th className="py-2.5 px-2">TYPE</th>
                    <th className="py-2.5 px-2">ITEM ID</th>
                    <th className="py-2.5 px-2">RETURN PURPOSE / REASON</th>
                    <th className="py-2.5 px-2">DATE</th>
                    <th className="py-2.5 px-2">FINAL STATUS</th>
                    <th className="py-2.5 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {historyItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-slate-800">{item.id}</td>
                      <td className="py-3.5 px-2 text-slate-400 font-medium">{item.shipmentId}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          item.type === 'Return' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-bold text-slate-800 whitespace-pre-line">{item.itemId}</td>
                      <td className="py-3.5 px-2 text-slate-600 uppercase max-w-[150px]">{item.reason}</td>
                      <td className="py-3.5 px-2 text-slate-400 whitespace-pre-line">{item.date}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.statusClass}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button className="text-slate-800 font-bold hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
              <span>Showing 1 to 5 of 15 records</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-50">&lt;</button>
                <button className="px-2 py-1 rounded bg-[#FF5C00] text-white font-bold">1</button>
                <button className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">2</button>
                <button className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">3</button>
                <button className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">&gt;</button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Section */}
        <div className="space-y-5">
          
          {/* Card 1: Return Status (Latest) Timeline */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Return Status (Latest)</h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>

            <div className="relative pl-3 space-y-6 before:absolute before:left-[19px] before:top-2.5 before:bottom-2.5 before:w-[1px] before:bg-slate-100">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border z-10 shrink-0 ${event.iconBg}`}>
                    {event.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-slate-800">{event.title}</h3>
                    {event.date && <p className="text-[10px] text-slate-300">{event.date}</p>}
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: RTO Logistics Center */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">RTO Logistics Center</h2>
            <div className="space-y-3 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="font-bold text-slate-800 text-xs">SHIP-2026-000120</p>
                  <p className="text-[10px] text-slate-400">Dhaka Distribution Hub</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100">
                  In Inspection
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-slate-800 text-xs">SHIP-2026-000108</p>
                  <p className="text-[10px] text-slate-400">En Route to Hub</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100">
                  Dispatched
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Guidance Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-500">🏠</span>
          <h3 className="text-xs font-bold text-slate-900">Return & RTO Policy Guidance</h3>
        </div>
        <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside leading-relaxed marker:text-slate-300">
          <li>Failed or unaccepted deliveries will be returned to Dazzling Shipping's Dhaka hub.</li>
          <li>Returns are subject to the Seller's Return Window and, where applicable, Seller/RMA approval and required documentation.</li>
          <li>Unless caused by an operational error by Dazzling Shipping, applicable return, inspection, repackaging, freight, customs, and storage charges are payable by the customer.</li>
          <li>Dazzling Shipping does not guarantee a Seller refund. Refunds depend on Seller approval and successful settlement; applicable charges will be deducted before the remaining amount is credited to the customer's Customer Ledger or Wallet.</li>
        </ul>
      </div>

    </div>
  );
};

export default ReturnRTO;