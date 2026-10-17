import React, { useState } from 'react';

const Insurance = () => {
  const [searchId, setSearchId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  const [claims] = useState([
    { id: 'INS-260001', shipmentId: 'SHP-260145', serviceMode: 'Import', claimType: 'Damaged Parcel', date: '15 Jul 2026', status: 'Under Review' },
    { id: 'INS-260002', shipmentId: 'SHP-260132', serviceMode: 'Export', claimType: 'Lost Parcel', date: '12 Jul 2026', status: 'Approved' },
    { id: 'INS-260003', shipmentId: 'SHP-260118', serviceMode: 'Import', claimType: 'Missing Item', date: '09 Jul 2026', status: 'Documents Requested' },
    { id: 'INS-260004', shipmentId: 'SHP-260097', serviceMode: 'Export', claimType: 'Damaged Parcel', date: '03 Jul 2026', status: 'Rejected' },
    { id: 'INS-260005', shipmentId: 'SHP-260066', serviceMode: 'Import', claimType: 'Lost Parcel', date: '28 Jun 2026', status: 'Compensation Processed' },
    { id: 'INS-260006', shipmentId: 'SHP-260071', serviceMode: 'Export', claimType: 'Damaged Parcel', date: '24 Jun 2026', status: 'Investigation in Progress' },
  ]);

  const statusStyles = {
    'Under Review': { bg: 'bg-orange-50', text: 'text-orange-500', dot: 'bg-orange-500' },
    'Approved': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    'Documents Requested': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    'Rejected': { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' },
    'Compensation Processed': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    'Investigation in Progress': { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500' },
  };

  const statusGuideItems = [
    { label: 'Documents Requested', description: 'Additional documents are requested from the customer.', dot: 'bg-blue-500' },
    { label: 'Under Review', description: 'Your claim is under review by our insurance team.', dot: 'bg-orange-500' },
    { label: 'Investigation in Progress', description: 'We are investigating your claim.', dot: 'bg-purple-500' },
    { label: 'Approved', description: 'Your claim has been approved.', dot: 'bg-emerald-500' },
    { label: 'Compensation Processed', description: 'Compensation has been processed successfully.', dot: 'bg-emerald-500' },
    { label: 'Rejected', description: 'Your claim has been rejected.', dot: 'bg-rose-500' },
  ];

  const handleResetFilters = () => {
    setSearchId('');
    setStatusFilter('');
    setTypeFilter('');
    setServiceFilter('');
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.id.toLowerCase().includes(searchId.toLowerCase()) || claim.shipmentId.toLowerCase().includes(searchId.toLowerCase());
    const matchesStatus = !statusFilter || claim.status === statusFilter;
    const matchesType = !typeFilter || claim.claimType === typeFilter;
    const matchesService = !serviceFilter || claim.serviceMode === serviceFilter;
    return matchesSearch && matchesStatus && matchesType && matchesService;
  });

  return (
    <div className="bg-[#f4f7fa] min-h-screen p-2 sm:p-2 font-sans text-slate-700">
      <div className=" mx-auto space-y-2">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Insurance and Claims</h1>
            <p className="text-xs text-slate-400 mt-1">Manage your insurance claims and track their status.</p>
          </div>
          <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto">
            <span className="text-sm font-bold">+</span> File a New Claim
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-slate-100">
          <h2 className="text-xs font-bold text-slate-800 mb-3">Search & Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
            {/* Search Claim ID */}
            <div className="relative md:col-span-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search claim ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Claim Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-xs text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Claim Status</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Documents Requested">Documents Requested</option>
              <option value="Rejected">Rejected</option>
              <option value="Compensation Processed">Compensation Processed</option>
              <option value="Investigation in Progress">Investigation in Progress</option>
            </select>

            {/* Claim Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-xs text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Claim Type</option>
              <option value="Damaged Parcel">Damaged Parcel</option>
              <option value="Lost Parcel">Lost Parcel</option>
              <option value="Missing Item">Missing Item</option>
            </select>

            {/* Service Mode */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-xs text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="">Service Mode</option>
              <option value="Import">Import</option>
              <option value="Export">Export</option>
            </select>

            {/* Date Range Input Mock */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">📅</span>
              <input
                type="text"
                readOnly
                placeholder="Date Range"
                className="w-full pl-8 pr-3 py-2 bg-[#f8fafc] border border-slate-200/60 rounded-lg text-xs text-slate-400 cursor-pointer"
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              className="w-full px-3 py-2 bg-[#f8fafc] hover:bg-slate-100 border border-slate-200/60 rounded-lg text-xs text-slate-600 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>🔄</span> Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Insurance Claims Table Card */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-2xs border border-slate-100 space-y-4">
            <h2 className="text-xs font-bold text-slate-900">Insurance Claims</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400">
                    <th className="py-3 px-2">Claim ID</th>
                    <th className="py-3 px-2">Shipment ID</th>
                    <th className="py-3 px-2">Service Mode</th>
                    <th className="py-3 px-2">Claim Type</th>
                    <th className="py-3 px-2">Submitted On</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredClaims.map((claim) => {
                    const style = statusStyles[claim.status] || { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
                    return (
                      <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2 font-bold text-slate-900">{claim.id}</td>
                        <td className="py-4 px-2 font-bold text-slate-800">{claim.shipmentId}</td>
                        <td className="py-4 px-2 text-slate-400">{claim.serviceMode}</td>
                        <td className="py-4 px-2 text-slate-500">{claim.claimType}</td>
                        <td className="py-4 px-2 text-slate-400">{claim.date}</td>
                        <td className="py-4 px-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${style.bg} ${style.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                            {claim.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button className="text-[11px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar Section */}
          <div className="space-y-6">

            {/* Claim Status Guide Card */}
            <div className="bg-white rounded-xl p-5 shadow-2xs border border-slate-100 space-y-4">
              <h2 className="text-xs font-bold text-slate-900">Claim Status Guide</h2>
              <div className="space-y-3">
                {statusGuideItems.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`}></span>
                      <h3 className="text-xs font-bold text-slate-800">{item.label}</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-3.5 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Policy Card */}
            <div className="bg-[#f0f6ff] rounded-xl p-5 border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <span>🛡️</span>
                <h3>Insurance Policy</h3>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-600 leading-relaxed list-disc list-inside marker:text-slate-400">
                <li>Only insured good items in Import and export shipments are eligible. Documents are not insurable.</li>
                <li>Claims require supporting documents and are subject to verification.</li>
                <li>Compensation is processed only after claim approval in accordance with Dazzling Shipping's Insurance Policy.</li>
                <li>Approved compensation will be credited directly to your Dazzling Shipping Wallet.</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Insurance;