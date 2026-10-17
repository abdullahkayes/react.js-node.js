import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { AIR_FREIGHT_CATEGORIES, SEA_FREIGHT_CATEGORIES } from '../data/pricingData';

const STATUS_CONFIG = {
  Draft: { color: 'bg-slate-50 text-slate-600 border-slate-100' },
  Submitted: { color: 'bg-blue-50 text-blue-600 border-blue-100' },
  'Under Review': { color: 'bg-blue-50 text-blue-600 border-blue-100' },
  'Need More Information': { color: 'bg-amber-50 text-amber-600 border-amber-100' },
  Approved: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  Rejected: { color: 'bg-rose-50 text-rose-600 border-rose-100' },
  'In Transit': { color: 'bg-blue-50 text-blue-600 border-blue-100' },
  Delivered: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  Cancelled: { color: 'bg-slate-100 text-slate-400 border-slate-200' },
};

const EDITABLE_STATUSES = new Set(['Draft', 'Submitted', 'Under Review', 'Need More Information']);

const BookShipmentRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequest = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/book-shipment/${id}`);
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
    if (!window.confirm('Cancel this export booking request?')) return;
    try {
      await api.put(`/book-shipment/${request.id}/cancel`);
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
            <Link to="/book" className="hover:underline">Export Booking</Link>
            <span className="mx-1">/</span>
            <span className="text-slate-600 font-medium">Request Not Found</span>
          </nav>
          <div className="bg-white rounded-xl border border-slate-200/80 p-8 shadow-sm text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Request Not Found</h1>
            <p className="text-xs text-slate-400 mb-4">
              {error || 'The export booking you are looking for does not exist.'}
            </p>
            <Link to="/book" className="text-xs font-bold text-[#FF5C00] hover:underline">← Back to Export Booking</Link>
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

  const totalValue = items.reduce((sum, item) => sum + Number(item.invoiceValue || 0), 0);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto max-w-4xl space-y-6">
        <nav className="text-xs text-slate-400">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/book" className="hover:underline">Export Booking</Link>
          <span className="mx-1">/</span>
          <span className="text-slate-600 font-medium">{request.requestId}</span>
        </nav>

        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Export Booking Request</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {request.requestId} • {items.length} Item(s) • Total: ${totalValue.toFixed(2)} USD • Created: {formatDate(request.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded text-[10px] font-bold border ${STATUS_CONFIG[request.status]?.color || STATUS_CONFIG.Draft.color}`}>
              {request.status}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-xs font-bold text-slate-900 mb-3">Request Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Request ID</p>
                <p className="font-semibold text-slate-800">{request.requestId || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Customer Type</p>
                <p className="font-semibold text-slate-800">{request.customerType || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Service Level</p>
                <p className="font-semibold text-slate-800">
                  {request.requestedServiceLevel === 'sea' ? 'Sea Freight (Standard)' : 'Air Freight (Express)'}
                </p>
              </div>
              {request.addPackageInsurance && (
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
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Destination Country</p>
                <p className="font-semibold text-slate-800">{request.destinationCountry || '—'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-xs font-bold text-slate-900 mb-3">Consignee Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Consignee Name</p>
                <p className="font-semibold text-slate-800">{request.consigneeName || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Consignee Phone</p>
                <p className="font-semibold text-slate-800">{request.consigneePhone || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg sm:col-span-2">
                <p className="text-[10px] text-slate-400 mb-0.5">Consignee Address</p>
                <p className="font-semibold text-slate-800">{request.consigneeAddress || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">City</p>
                <p className="font-semibold text-slate-800">{request.city || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Region</p>
                <p className="font-semibold text-slate-800">{request.region || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">ZIP Code</p>
                <p className="font-semibold text-slate-800">{request.zipCode || '—'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-0.5">Pickup Location</p>
                <p className="font-semibold text-slate-800">{request.pickupFrom || '—'}</p>
              </div>
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
                      <h3 className="text-xs font-bold text-slate-900">{item.productDescription || 'Item ' + (index + 1)}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400">Item Type</p>
                        <p className="font-semibold text-slate-800">{item.itemType || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Item Source</p>
                        <p className="font-semibold text-slate-800">{item.itemSource || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Tracking Number</p>
                        <p className="font-semibold text-slate-800">{item.trackingNumber || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Store / Seller</p>
                        <p className="font-semibold text-slate-800">{item.sellerStoreName || '—'}</p>
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
                        <p className="font-semibold text-slate-800">${Number(item.invoiceValue || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Package Count</p>
                        <p className="font-semibold text-slate-800">{item.packageCount || 1}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Estimated Weight (kg)</p>
                        <p className="font-semibold text-slate-800">{item.estimatedWeight || '—'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[10px] text-slate-400">Dimensions (L x W x H cm)</p>
                        <p className="font-semibold text-slate-800">
                          {item.length && item.width && item.height
                            ? `${item.length} x ${item.width} x ${item.height} cm`
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">HS Code</p>
                        <p className="font-semibold text-slate-800">{item.hsCode || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Country of Origin</p>
                        <p className="font-semibold text-slate-800">{item.countryOfOrigin || '—'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[10px] text-slate-400">Description</p>
                        <p className="font-semibold text-slate-800">{item.productDescription || '—'}</p>
                      </div>
                      {item.productUrl && (
                        <div className="sm:col-span-2">
                          <p className="text-[10px] text-slate-400">Product Link</p>
                          <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline break-all">
                            {item.productUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {request.shipmentInstructions && (
            <div className="border-t border-slate-100 pt-4">
              <h2 className="text-xs font-bold text-slate-900 mb-3">Shipment Instructions</h2>
              <p className="text-xs text-slate-600">{request.shipmentInstructions}</p>
            </div>
          )}

          {request.nidPath && (
            <div className="border-t border-slate-100 pt-4">
              <h2 className="text-xs font-bold text-slate-900 mb-3">HUB Delivery Slip / Receipt</h2>
              <a href={request.nidPath} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline break-all">
                View Upload
              </a>
            </div>
          )}

          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row gap-3">
            {isEditable && (
              <Link
                to={`/services/book-shipment/${request.id}/edit`}
                className="px-4 py-2 bg-[#FF5C00] text-white text-[11px] font-bold rounded-lg hover:bg-[#E05100] transition"
              >
                Edit Booking
              </Link>
            )}
            {isEditable && canCancelStatus && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-bold transition"
              >
                Cancel Booking
              </button>
            )}
            <Link
              to="/book"
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 hover:bg-slate-50"
            >
              ← Back to Export Booking
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
              <span className="font-bold text-slate-800">Final bill after weight check.</span> Customs duty & taxes per country rules.
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

export default BookShipmentRequest;
