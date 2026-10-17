import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const transactions = [
  {
    id: 'WAL-250512-001',
    type: 'Top-up',
    typeDirection: 'up',
    description: 'Wallet Top-up',
    subDetail: null,
    method: 'bKash',
    methodBg: 'bg-pink-600',
    methodIcon: 'b',
    date: 'May 12, 2026',
    time: '10:35 AM',
    amount: '+ ৳ 5,000.00',
    isPositive: true,
    status: 'Completed',
  },
  {
    id: 'WAL-250510-002',
    type: 'Payment',
    typeDirection: 'down',
    description: 'Invoice Payment',
    subDetail: 'INV-250514',
    method: 'Wallet',
    methodBg: 'bg-blue-600',
    methodIcon: 'W',
    date: 'May 10, 2026',
    time: '03:22 PM',
    amount: '- ৳ 2,500.00',
    isPositive: false,
    status: 'Completed',
  },
  {
    id: 'WAL-250508-003',
    type: 'Refund',
    typeDirection: 'up',
    description: 'Shipment Refund',
    subDetail: 'REF-250410',
    method: 'Wallet',
    methodBg: 'bg-blue-600',
    methodIcon: 'W',
    date: 'May 08, 2026',
    time: '09:15 AM',
    amount: '+ ৳ 1,250.00',
    isPositive: true,
    status: 'Completed',
  },
  {
    id: 'WAL-250505-004',
    type: 'Top-up',
    typeDirection: 'up',
    description: 'Wallet Top-up',
    subDetail: null,
    method: 'Nagad',
    methodBg: 'bg-orange-500',
    methodIcon: 'N',
    date: 'May 05, 2026',
    time: '11:47 AM',
    amount: '+ ৳ 3,000.00',
    isPositive: true,
    status: 'Completed',
  },
  {
    id: 'WAL-250501-005',
    type: 'Payment',
    typeDirection: 'down',
    description: 'Payment for',
    subDetail: 'SHIP-250487',
    method: 'Wallet',
    methodBg: 'bg-blue-600',
    methodIcon: 'W',
    date: 'May 01, 2026',
    time: '02:18 PM',
    amount: '- ৳ 3,200.00',
    isPositive: false,
    status: 'Completed',
  },
];

const Wallet = () => {
  const [selectedAmount, setSelectedAmount] = useState('500');
  const [otherAmount, setOtherAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bKash');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 antialiased">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-6 lg:px-12">
        <h1 className="text-2xl font-black text-slate-900">Wallet</h1>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Manage your wallet balance, add funds, and view your transaction activity.
        </p>
      </div>

      <div className="mx-auto px-2 py-2 sm:px-2 lg:px-2 space-y-2">
        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Available Wallet Balance</p>
              <p className="text-xl font-black text-slate-900">৳ 120.50</p>
              <p className="text-[10px] text-slate-400">Available to use</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Total Funds Added</p>
              <p className="text-xl font-black text-slate-900">৳ 18,900.00</p>
              <p className="text-[10px] text-slate-400">All time</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Total Payments from Wallet</p>
              <p className="text-xl font-black text-slate-900">৳ 18,780.00</p>
              <p className="text-[10px] text-slate-400">All time</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Refund Balance</p>
              <p className="text-xl font-black text-slate-900">৳ 35.00</p>
              <p className="text-[10px] text-slate-400">Available to use</p>
            </div>
          </div>
        </div>

        {/* Hero Card: Your Wallet Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="">
              <h2 className="text-base font-extrabold text-slate-900">Your Wallet Balance</h2>
              <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">৳ 120.50</p>
              <p className="mt-4 text-xs font-medium leading-relaxed text-slate-400">
                Use your wallet balance to conveniently pay for eligible shipment charges and invoices.
              </p>
            </div>

            {/* Illustration graphic */}
            <div className="relative flex items-center justify-center py-4 lg:py-0">
              <div className="relative h-28 w-44 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 shadow-xl transform rotate-12 flex items-center justify-end p-4">
                <div className="h-6 w-8 rounded-md bg-amber-400"></div>
              </div>
              <div className="absolute left-0 bottom-1 flex -space-x-3">
                <div className="h-10 w-10 rounded-full bg-amber-400 border-2 border-white shadow-md"></div>
                <div className="h-12 w-12 rounded-full bg-amber-400 border-2 border-white shadow-md"></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 min-w-[220px]">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#FF4D00] px-6 py-3.5 text-xs font-black text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600">
                <span className="text-base font-bold">+</span> Add Funds
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Transaction History
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-slate-100 text-xs font-semibold text-slate-700">
          <span className="px-3 font-bold text-slate-900">Quick Actions</span>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>

          <button className="flex items-center gap-2 px-3 py-1.5 hover:text-[#FF4D00]">
            <span className="text-pink-500">👛</span> Add Funds
          </button>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>

          <button className="flex items-center gap-2 px-3 py-1.5 hover:text-[#FF4D00]">
            <span className="text-slate-400">📑</span> Transaction History
          </button>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>

          <button className="flex items-center gap-2 px-3 py-1.5 hover:text-[#FF4D00]">
            <span className="text-blue-500">💳</span> Payment Methods
          </button>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>

          <button className="flex items-center gap-2 px-3 py-1.5 hover:text-[#FF4D00]">
            <span className="text-emerald-500">📥</span> Download Statement
          </button>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>

          <button className="flex items-center gap-2 px-3 py-1.5 hover:text-[#FF4D00]">
            <span className="text-amber-500">🎧</span> Contact Billing
          </button>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Transactions Table */}
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Recent Wallet Transactions</h2>
                <Link to="/transactions" className="text-xs font-bold text-blue-600 hover:underline">
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-800">
                      <th className="pb-3 pr-2">Transaction ID</th>
                      <th className="pb-3 pr-2">Type</th>
                      <th className="pb-3 pr-2">Description</th>
                      <th className="pb-3 pr-2">Method</th>
                      <th className="pb-3 pr-2">Date</th>
                      <th className="pb-3 pr-2">Amount</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[11px]">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 pr-2 font-bold text-slate-800">{t.id}</td>
                        <td className="py-4 pr-2">
                          <span className={`inline-flex items-center gap-1 font-semibold ${t.typeDirection === 'up' ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {t.typeDirection === 'up' ? '↑' : '↓'} {t.type}
                          </span>
                        </td>
                        <td className="py-4 pr-2">
                          <p className="font-semibold text-slate-700">{t.description}</p>
                          {t.subDetail && <p className="text-[10px] text-slate-400">{t.subDetail}</p>}
                        </td>
                        <td className="py-4 pr-2">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <span className={`flex h-5 w-5 items-center justify-center rounded ${t.methodBg} text-[10px] text-white`}>
                              {t.methodIcon}
                            </span>
                            {t.method}
                          </div>
                        </td>
                        <td className="py-4 pr-2">
                          <p className="font-semibold text-slate-700">{t.date}</p>
                          <p className="text-[10px] text-slate-400">{t.time}</p>
                        </td>
                        <td className={`py-4 pr-2 font-black ${t.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {t.amount}
                        </td>
                        <td className="py-4 text-right">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Pagination */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row text-xs text-slate-400">
              <p>Showing 1 to 5 of 18 transactions</p>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 hover:text-slate-600">&lt;</button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`h-7 w-7 rounded-md text-xs font-bold ${currentPage === 1 ? 'bg-orange-100 text-[#FF4D00]' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`h-7 w-7 rounded-md text-xs font-bold ${currentPage === 2 ? 'bg-orange-100 text-[#FF4D00]' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`h-7 w-7 rounded-md text-xs font-bold ${currentPage === 3 ? 'bg-orange-100 text-[#FF4D00]' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  3
                </button>
                <button
                  onClick={() => setCurrentPage(4)}
                  className={`h-7 w-7 rounded-md text-xs font-bold ${currentPage === 4 ? 'bg-orange-100 text-[#FF4D00]' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  4
                </button>
                <button className="px-2 py-1 hover:text-slate-600">&gt;</button>
              </div>
            </div>
          </section>

          {/* Add Funds Form Widget */}
          <aside className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-900">Add Funds to Your Wallet</h3>

            {/* Select Amount */}
            <div className="mt-6">
              <label className="text-xs font-bold text-slate-700">Select Amount</label>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {['500', '1,000', '2,500'].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setOtherAmount('');
                    }}
                    className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                      selectedAmount === amt
                        ? 'border-[#FF4D00] bg-orange-50/30 text-slate-900'
                        : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ৳ {amt}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedAmount('5,000');
                    setOtherAmount('');
                  }}
                  className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                    selectedAmount === '5,000'
                      ? 'border-[#FF4D00] bg-orange-50/30 text-slate-900'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ৳ 5,000
                </button>
                <input
                  type="text"
                  placeholder="Other Amount"
                  value={otherAmount}
                  onChange={(e) => {
                    setOtherAmount(e.target.value);
                    setSelectedAmount('');
                  }}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 text-center text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:border-[#FF4D00] focus:outline-none"
                />
              </div>
            </div>

            {/* Select Payment Method */}
            <div className="mt-6">
              <label className="text-xs font-bold text-slate-700">Select Payment Method</label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedMethod('bKash')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition ${
                    selectedMethod === 'bKash'
                      ? 'border-[#FF4D00] bg-orange-50/20 text-slate-900'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-pink-600 text-[10px] text-white">b</span>
                  bKash
                </button>

                <button
                  onClick={() => setSelectedMethod('Nagad')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition ${
                    selectedMethod === 'Nagad'
                      ? 'border-[#FF4D00] bg-orange-50/20 text-slate-900'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-orange-500 text-[10px] text-white">N</span>
                  Nagad
                </button>

                <button
                  onClick={() => setSelectedMethod('Rocket')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition ${
                    selectedMethod === 'Rocket'
                      ? 'border-[#FF4D00] bg-orange-50/20 text-slate-900'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-600 text-[10px] text-white">R</span>
                  Rocket
                </button>

                <button
                  onClick={() => setSelectedMethod('Bank Transfer')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition ${
                    selectedMethod === 'Bank Transfer'
                      ? 'border-[#FF4D00] bg-orange-50/20 text-slate-900'
                      : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  Bank Transfer
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button className="mt-6 w-full rounded-xl bg-[#FF4D00] py-3.5 text-xs font-black text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600">
              Continue to Add Funds
            </button>
          </aside>
        </div>

        {/* Wallet Policy Section */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50/30 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#FF4D00]">
              🛡️
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Wallet Policy</h4>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-500 list-disc list-inside">
                <li>Wallet balance can be used to pay shipping charges, assisted purchase fees, insurance, and other service charges.</li>
                <li>Wallet balance is non-transferable and cannot be withdrawn as cash unless otherwise approved by Dazzling Shipping.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Wallet;