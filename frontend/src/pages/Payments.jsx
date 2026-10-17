import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';

// Sample fallback mock data matching image layout exactly if backend returns empty or loading completes
const mockPendingPayments = [
  {
    invoiceNo: 'INV-250514',
    shipmentId: 'SHP-250514',
    requestId: 'PA-260514',
    freightType: 'Air Freight',
    purchaseType: 'Self-Purchase',
    serviceMode: 'Import',
    dueDate: 'May 18, 2026',
    amount: '4,200.00',
    status: 'Pending',
    statusClass: 'bg-orange-50 text-orange-500',
  },
  {
    invoiceNo: 'INV-250521',
    shipmentId: 'SHP-250521',
    requestId: 'EXP-260018',
    freightType: 'Sea Freight',
    purchaseType: 'N/A',
    serviceMode: 'Export',
    dueDate: 'May 20, 2026',
    amount: '8,650.00',
    status: 'Pending',
    statusClass: 'bg-orange-50 text-orange-500',
  },
  {
    invoiceNo: 'INV-250530',
    shipmentId: 'SHP-250530',
    requestId: 'AP-2026-0001',
    freightType: 'Air Freight',
    purchaseType: 'Assisted Purchase',
    serviceMode: 'Import',
    dueDate: 'May 25, 2026',
    amount: '5,980.00',
    status: 'Overdue',
    statusClass: 'bg-red-50 text-red-500',
  },
];

const mockInvoicesSide = [
  { invoiceNo: 'INV-250514', shipmentId: 'SHP-250514', date: 'May 18, 2026', amount: '4,200.00', status: 'Pending', statusColor: 'bg-orange-100 text-orange-600' },
  { invoiceNo: 'INV-250521', shipmentId: 'SHP-250521', date: 'May 16, 2026', amount: '8,650.00', status: 'Pending', statusColor: 'bg-orange-100 text-orange-600' },
  { invoiceNo: 'INV-250530', shipmentId: 'SHP-250530', date: 'May 23, 2026', amount: '5,980.00', status: 'Overdue', statusColor: 'bg-red-100 text-red-600' },
  { invoiceNo: 'INV-250487', shipmentId: 'SHP-250487', date: 'May 11, 2026', amount: '3,200.00', status: 'Paid', statusColor: 'bg-emerald-100 text-emerald-600' },
  { invoiceNo: 'INV-250500', shipmentId: 'SHP-250500', date: 'May 18, 2026', amount: '5,450.00', status: 'Paid', statusColor: 'bg-emerald-100 text-emerald-600' },
];

const mockPaymentHistory = [
  { id: 'PAY-250512-001', invoiceNo: 'INV-250500', shipmentId: 'SHP-250500', amount: '5,450.00', method: 'bKash', methodBg: 'bg-pink-600', methodIcon: 'b', date: 'May 12, 2026', time: '10:35 AM', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-600' },
  { id: 'PAY-250508-002', invoiceNo: 'INV-250487', shipmentId: 'SHP-250487', amount: '3,200.00', method: 'Nagad', methodBg: 'bg-orange-500', methodIcon: 'N', date: 'May 08, 2026', time: '09:20 AM', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-600' },
  { id: 'PAY-250505-001', invoiceNo: 'INV-250472', shipmentId: 'SHP-250472', amount: '7,850.00', method: 'Bank Transfer', methodBg: 'bg-blue-600', methodIcon: '🏛', date: 'May 05, 2026', time: '02:15 PM', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-600' },
  { id: 'PAY-250501-004', invoiceNo: 'INV-250455', shipmentId: 'SHP-250455', amount: '2,950.00', method: 'Rocket', methodBg: 'bg-purple-600', methodIcon: 'R', date: 'May 01, 2026', time: '11:47 AM', status: 'Under Verification', statusColor: 'bg-blue-50 text-blue-600' },
  { id: 'PAY-250428-005', invoiceNo: 'INV-250402', shipmentId: 'SHP-250402', amount: '4,150.00', method: 'bKash', methodBg: 'bg-pink-600', methodIcon: 'b', date: 'Apr 28, 2026', time: '10:05 AM', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-600' },
];

const mockRefunds = [
  { id: 'REF-250430', shipmentId: 'SHP-250430', itemId: 'ITM-250430-01', claimId: 'N/A', returnId: 'RT-2026-00034', reason: 'Return & RTO', amount: '1,850.00', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600', date: 'Apr 30, 2026' },
  { id: 'REF-250412', shipmentId: 'SHP-250412', itemId: 'ITM-250412-01', claimId: 'CLM-250412', returnId: 'N/A', reason: 'Insurance Claim', amount: '3,200.00', status: 'Processing', statusColor: 'bg-blue-50 text-blue-600', date: 'Apr 12, 2026' },
];

const Payments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating endpoint fetch or fallback grace period
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-12">
        <div className="mx-auto">
          <CardSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 antialiased">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-5 lg:px-12">
        <h1 className="text-xl font-black text-slate-900">Payments</h1>
        <p className="mt-0.5 text-xs text-slate-400 font-medium">
          Manage your invoices, make payments, and download receipts.
        </p>
      </header>

      <div className="mx-auto px-2 py-2 sm:px-2 lg:px-2 space-y-2">
        
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Pending Amount */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Pending Amount</p>
              <p className="text-lg font-black text-slate-900">৳ 8,450.00</p>
              <p className="text-[10px] font-semibold text-rose-500">3 invoices to pay</p>
            </div>
          </div>

          {/* Card 2: Paid This Month */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Paid This Month</p>
              <p className="text-lg font-black text-slate-900">৳ 18,900.00</p>
              <p className="text-[10px] font-semibold text-emerald-600">5 payments</p>
            </div>
          </div>

          {/* Card 3: Total Paid */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Total Paid</p>
              <p className="text-lg font-black text-slate-900">৳ 146,250.00</p>
              <p className="text-[10px] text-slate-400">All time</p>
            </div>
          </div>

          {/* Card 4: Outstanding Invoices */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Outstanding Invoices</p>
              <p className="text-lg font-black text-slate-900">3</p>
              <p className="text-[10px] text-slate-400">Total unpaid invoices</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-slate-100 text-xs font-bold text-slate-700">
          <span className="px-2 font-black text-slate-900">Quick Actions</span>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition">
              <span className="h-2 w-2 rounded-full bg-orange-400"></span> Top-up Wallet
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span> Download Invoices
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Payment History
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#FF5C00] transition">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span> Need Help?
            </button>
          </div>
        </div>

        {/* Main Grid: Pending Payments Table + Invoices Side Panel */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Pending Payments (Left 2 Columns) */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 mb-4">Pending Payments</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400">
                      <th className="pb-3 pr-2">Invoice No.</th>
                      <th className="pb-3 pr-2">Shipment ID</th>
                      <th className="pb-3 pr-2">Request ID</th>
                      <th className="pb-3 pr-2">Freight Type</th>
                      <th className="pb-3 pr-2">Purchase Type</th>
                      <th className="pb-3 pr-2">Service Mode</th>
                      <th className="pb-3 pr-2">Due Date</th>
                      <th className="pb-3 pr-2">Amount</th>
                      <th className="pb-3 pr-2">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[11px]">
                    {mockPendingPayments.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 pr-2 font-bold text-slate-900">{row.invoiceNo}</td>
                        <td className="py-3.5 pr-2 font-bold text-slate-800">{row.shipmentId}</td>
                        <td className="py-3.5 pr-2 text-slate-700">{row.requestId}</td>
                        <td className="py-3.5 pr-2">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                            {row.freightType.includes('Air') ? '✈️' : '🚢'} {row.freightType}
                          </span>
                        </td>
                        <td className="py-3.5 pr-2 text-slate-500">{row.purchaseType}</td>
                        <td className="py-3.5 pr-2 text-slate-700 font-medium">{row.serviceMode}</td>
                        <td className="py-3.5 pr-2 text-slate-500 font-medium">{row.dueDate}</td>
                        <td className="py-3.5 pr-2 font-black text-slate-900">৳ {row.amount}</td>
                        <td className="py-3.5 pr-2">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${row.statusClass}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button className="text-[10px] font-bold text-red-500 hover:underline">
                            Pay Now
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination for Pending Payments */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 text-[11px] text-slate-400">
              <p>Showing 1 to 3 of 3 records</p>
              <div className="flex items-center gap-1">
                <button className="px-1.5 py-0.5 hover:text-slate-600">&lt;</button>
                <button className="h-5 w-5 rounded bg-orange-500 text-[10px] font-bold text-white">1</button>
                <button className="h-5 w-5 rounded hover:bg-slate-100 text-[10px] text-slate-600">2</button>
                <button className="px-1.5 py-0.5 hover:text-slate-600">&gt;</button>
              </div>
            </div>
          </div>

          {/* Invoices List Widget (Right Column) */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900">Invoices</h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[9px] font-semibold text-slate-400">
                    <th className="pb-2">Invoice No.</th>
                    <th className="pb-2">Shipment ID</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[10px]">
                  {mockInvoicesSide.map((inv, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="py-2.5 font-bold text-slate-800">{inv.invoiceNo}</td>
                      <td className="py-2.5 font-semibold text-slate-600">{inv.shipmentId}</td>
                      <td className="py-2.5 text-slate-400">{inv.date}</td>
                      <td className="py-2.5 font-black text-slate-900">৳ {inv.amount}</td>
                      <td className="py-2.5">
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${inv.statusColor}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-400 hover:text-slate-600 cursor-pointer">
                        📥
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Payment History</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400">
                  <th className="pb-3 pr-2">Payment ID</th>
                  <th className="pb-3 pr-2">Invoice No.</th>
                  <th className="pb-3 pr-2">Shipment ID</th>
                  <th className="pb-3 pr-2">Amount</th>
                  <th className="pb-3 pr-2">Method</th>
                  <th className="pb-3 pr-2">Date</th>
                  <th className="pb-3 pr-2">Status</th>
                  <th className="pb-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[11px]">
                {mockPaymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 pr-2 font-bold text-slate-800">{item.id}</td>
                    <td className="py-3.5 pr-2 font-semibold text-slate-700">{item.invoiceNo}</td>
                    <td className="py-3.5 pr-2 font-semibold text-slate-700">{item.shipmentId}</td>
                    <td className="py-3.5 pr-2 font-black text-slate-900">৳ {item.amount}</td>
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span className={`flex h-4 w-4 items-center justify-center rounded ${item.methodBg} text-[9px] text-white`}>
                          {item.methodIcon}
                        </span>
                        {item.method}
                      </div>
                    </td>
                    <td className="py-3.5 pr-2">
                      <p className="font-semibold text-slate-700">{item.date}</p>
                      <p className="text-[10px] text-slate-400">{item.time}</p>
                    </td>
                    <td className="py-3.5 pr-2">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400 hover:text-slate-600 cursor-pointer">
                      📥
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refunds Section */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900">Refunds</h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400">
                    <th className="pb-3 pr-2">Refund ID</th>
                    <th className="pb-3 pr-2">Shipment ID</th>
                    <th className="pb-3 pr-2">Item ID</th>
                    <th className="pb-3 pr-2">Claim ID</th>
                    <th className="pb-3 pr-2">Return ID</th>
                    <th className="pb-3 pr-2">Reason</th>
                    <th className="pb-3 pr-2">Amount</th>
                    <th className="pb-3 pr-2">Status</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[11px]">
                  {mockRefunds.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 pr-2 font-bold text-slate-800">{ref.id}</td>
                      <td className="py-3.5 pr-2 font-semibold text-slate-700">{ref.shipmentId}</td>
                      <td className="py-3.5 pr-2 text-slate-600">{ref.itemId}</td>
                      <td className="py-3.5 pr-2 text-slate-500">{ref.claimId}</td>
                      <td className="py-3.5 pr-2 text-slate-500">{ref.returnId}</td>
                      <td className="py-3.5 pr-2 text-slate-700 font-medium">{ref.reason}</td>
                      <td className="py-3.5 pr-2 font-black text-slate-900">৳ {ref.amount}</td>
                      <td className="py-3.5 pr-2">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${ref.statusColor}`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-medium text-slate-500">{ref.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Refunds Pagination */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3 text-[11px] text-slate-400">
            <p>Showing 1 to 2 of 12 records</p>
            <div className="flex items-center gap-1">
              <button className="px-1.5 py-0.5 hover:text-slate-600">&lt;</button>
              <button className="h-5 w-5 rounded bg-orange-500 text-[10px] font-bold text-white">1</button>
              <button className="h-5 w-5 rounded hover:bg-slate-100 text-[10px] text-slate-600">2</button>
              <button className="h-5 w-5 rounded hover:bg-slate-100 text-[10px] text-slate-600">3</button>
              <button className="h-5 w-5 rounded hover:bg-slate-100 text-[10px] text-slate-600">4</button>
              <button className="h-5 w-5 rounded hover:bg-slate-100 text-[10px] text-slate-600">5</button>
              <button className="px-1.5 py-0.5 hover:text-slate-600">&gt;</button>
            </div>
          </div>
        </div>

        {/* Payment Policy Card */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50/20 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-500">
              🛡️
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Payment Policy</h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                Unpaid shipments will be stored for up to 30 days. Storage charges apply after 7 days. If payment remains unpaid after prior notice, Dazzling Shipping may dispose of, recycle, auction, or otherwise handle the parcel in accordance with applicable law and company policy.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payments;