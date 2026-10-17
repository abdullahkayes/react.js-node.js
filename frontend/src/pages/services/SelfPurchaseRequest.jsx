import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { AIR_FREIGHT_CATEGORIES, SEA_FREIGHT_CATEGORIES } from '../../data/pricingData';

const STATUS_CONFIG = {
  Draft: { color: 'bg-slate-50 text-slate-600 border-slate-100' },
  Submitted: { color: 'bg-blue-50 text-blue-600 border-blue-100' },
  'Under Review': { color: 'bg-blue-50 text-blue-600 border-blue-100' },
  'Need More Information': { color: 'bg-amber-50 text-amber-600 border-amber-100' },
  Approved: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  Rejected: { color: 'bg-rose-50 text-rose-600 border-rose-100' },
  Cancelled: { color: 'bg-slate-100 text-slate-400 border-slate-200' },
  'Converted to Shipment': { color: 'bg-purple-50 text-purple-600 border-purple-100' },
};

const EDITABLE_STATUSES = new Set(['Draft', 'Submitted', 'Under Review', 'Need More Information']);

const SelfPurchaseRequest = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequest = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/self-purchase/${id}`);
      setRequest(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this pre-alert request?')) return;
    try {
      await api.put(`/self-purchase/${request.id}/cancel`);
      setRequest((prev) => ({ ...prev, status: 'Cancelled' }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] text-slate-400">Loading request…</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
        <div className="mx-auto max-w-4xl">
          <nav className="text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-1">/</span>
            <Link to="/services/self-purchase" className="hover:underline">Self Purchase</Link>
            <span className="mx-1">/</span>
            <span className="text-slate-600 font-medium">Request Not Found</span>
          </nav>
          <div className="bg-white rounded-xl border border-slate-200/80 p-8 shadow-sm text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Request Not Found</h1>
            <p className="text-xs text-slate-400 mb-4">
              {error || 'The self-purchase pre-alert you are looking for does not exist.'}
            </p>
            <Link to="/services/self-purchase" className="text-xs font-bold text-[#FF5C00] hover:underline">← Back to Self Purchase</Link>
          </div>
        </div>
      </div>
    );
  }

  const items = request.items || [];
  const isEditable = EDITABLE_STATUSES.has(request.status);
  const canCancelStatus = !['Approved', 'Rejected', 'Cancelled'].includes(request.status);
  const categoryOptions = request.freightMode === 'sea' ? SEA_FREIGHT_CATEGORIES : AIR_FREIGHT_CATEGORIES;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Under Review': 'Under Review',
      'Need More Information': 'Need More Info',
      'Converted to Shipment': 'Converted to Shipment',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto max-w-4xl space-y-6">
        <nav className="text-xs text-slate-400">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/services/self-purchase" className="hover:underline">Self Purchase</Link>
          <span className="mx-1">/</span>
          <span className="text-slate-600 font-medium">{request.requestId}</span>
        </nav>

        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Self-Purchase Pre-Alert</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {request.requestId} • {items.length} Item(s) • 📅 {formatDate(request.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded text-[10px] font-bold border ${STATUS_CONFIG[request.status]?.color || STATUS_CONFIG.Draft.color}`}>
              {getStatusLabel(request.status)}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-xs font-bold text-slate-900 mb-3">Request Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Customer Type</p>
                <p className="font-semibold text-slate-800">{request.customerType || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Service Level</p>
                <p className="font-semibold text-slate-800">
                  {request.freightMode === 'sea' ? 'Sea Freight (Standard)' : 'Air Freight (Express)'}
                </p>
              </div>
              {request.addInsurance && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400 mb-0.5">Insurance</p>
                  <p className="font-semibold text-slate-800">Added</p>
                </div>
              )}
              {request.submittedAt && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400 mb-0.5">Submitted At</p>
                  <p className="font-semibold text-slate-800">{formatDate(request.submittedAt)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-xs font-bold text-slate-900 mb-3">Items</h2>
            <div className="space-y-4">
              {items.map((item, index) => {
                const category = categoryOptions.find((cat) => cat.code === item.productCategory);
                return (
                  <div key={item.id || index} className="p-3 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FF5C00] text-white text-[10px] font-bold flex items-center justify-center">{index + 1}</span>
                      <h3 className="text-xs font-bold text-slate-900">{item.productDescription || item.storeName}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400">Tracking Number</p>
                        <p className="font-semibold text-slate-800">{item.trackingNumber || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Store / Seller</p>
                        <p className="font-semibold text-slate-800">{item.storeName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Item Source</p>
                        <p className="font-semibold text-slate-800">{item.itemSource || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Category</p>
                        <p className="font-semibold text-slate-800">{category ? `${category.code} - ${category.label}` : item.productCategory || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Quantity</p>
                        <p className="font-semibold text-slate-800">{item.quantity || 1}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Unit Price (USD)</p>
                        <p className="font-semibold text-slate-800">${item.unitPrice ? Number(item.unitPrice).toFixed(2) : '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Invoice Value (USD)</p>
                        <p className="font-semibold text-slate-800">${item.invoiceValue ? Number(item.invoiceValue).toFixed(2) : '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Item Type</p>
                        <p className="font-semibold text-slate-800">{item.itemType || '—'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[10px] text-slate-400">Description</p>
                        <p className="font-semibold text-slate-800">{item.productDescription || '—'}</p>
                      </div>
                      {item.productLink && (
                        <div className="sm:col-span-2">
                          <p className="text-[10px] text-slate-400">Product Link</p>
                          <a href={item.productLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline break-all">
                            {item.productLink}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

           {request.specialInstruction && (
             <div className="border-t border-slate-100 pt-4">
               <h2 className="text-xs font-bold text-slate-900 mb-3">Special Instructions</h2>
               <p className="text-xs text-slate-600">{request.specialInstruction}</p>
             </div>
           )}

           {request.nidPath && (
             <div className="border-t border-slate-100 pt-4">
               <h2 className="text-xs font-bold text-slate-900 mb-3">NID Upload</h2>
               <a href={request.nidPath} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                 View NID Upload
               </a>
             </div>
           )}

           <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row gap-3">
            {isEditable && (
              <Link
                to={`/services/self-purchase/${request.id}/edit`}
                className="px-4 py-2 bg-[#FF5C00] text-white text-[11px] font-bold rounded-lg hover:bg-[#E05100] transition"
              >
                Edit Pre-Alert
              </Link>
            )}
            {isEditable && canCancelStatus && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-bold transition"
              >
                Cancel Request
              </button>
            )}
            <Link
              to="/services/self-purchase"
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50 transition"
            >
              ← Back
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-amber-500 text-sm shrink-0 font-bold">!</span>
            <p className="text-[11px] text-slate-600 leading-snug">
              <span className="font-bold text-slate-800">Customer ID missing on parcel</span> may result in Unmatched Parcel status.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-blue-500 text-sm shrink-0 font-bold">$</span>
            <p className="text-[11px] text-slate-600 leading-snug">
              <span className="font-bold text-slate-800">Quotation is sent first.</span> No product is purchased without confirmation.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 text-sm shrink-0 font-bold">i</span>
            <p className="text-[11px] text-slate-600 leading-snug">
              <span className="font-bold text-slate-800">Air and Sea selection</span> affects the shipping workflow and final freight quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfPurchaseRequest;
