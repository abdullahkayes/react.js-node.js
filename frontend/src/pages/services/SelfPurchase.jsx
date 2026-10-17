import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { AIR_FREIGHT_CATEGORIES, SEA_FREIGHT_CATEGORIES } from '../../data/pricingData';

const ITEM_TYPE_OPTIONS = [
  'Products / Goods',
  'Documents',
];

const ITEM_SOURCE_OPTIONS = [
  'Online Store',
  'Local Store',
  'Company',
  'Dealership',
  'Manufacture',
  'Business Documents',
  'Personal Documents',
  'Other',
];

const initialItem = () => ({
  id: Date.now(),
  tracking: '',
  itemType: 'Products / Goods',
  storeName: '',
  itemSource: '',
  productCategory: '',
  productDescription: '',
  quantity: 1,
  unitPrice: '',
  invoiceValue: 0,
  productLink: '',
});

const initialFormState = () => ({
  requestId: null,
  status: 'Draft',
  requestedServiceLevel: 'air',
  freightMode: 'air',
  confirmTerms: true,
  addInsurance: true,
  specialInstruction: '',
  customerType: 'Retail Customer',
  items: [initialItem()],
});

const STATUS_CONFIG = {
  Draft: { color: 'bg-slate-50 text-slate-600 border-slate-100', dot: 'bg-slate-400' },
  Submitted: { color: 'bg-blue-50 text-blue-600 border-blue-100', dot: 'bg-blue-500' },
  'Under Review': { color: 'bg-blue-50 text-blue-600 border-blue-100', dot: 'bg-blue-500' },
  'Need More Information': { color: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-500' },
  Approved: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500' },
  Rejected: { color: 'bg-rose-50 text-rose-600 border-rose-100', dot: 'bg-rose-500' },
  Cancelled: { color: 'bg-slate-100 text-slate-400 border-slate-200', dot: 'bg-slate-400' },
  'Converted to Shipment': { color: 'bg-purple-50 text-purple-600 border-purple-100', dot: 'bg-purple-500' },
};

const EDITABLE_STATUSES = new Set(['Draft', 'Submitted', 'Under Review', 'Need More Information']);

const SelfPurchase = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [draftId, setDraftId] = useState(null);
  const [nidFile, setNidFile] = useState(null);

  const loadDraft = async () => {
    try {
      const res = await api.get('/self-purchase', {
        params: { status: 'Draft' },
      });
      const savedDraft = res.data.requests?.[0] || res.data?.[0];
      if (savedDraft && savedDraft.status === 'Draft') {
        setDraftId(savedDraft.id);
        setFormData({
          requestId: savedDraft.requestId,
          status: savedDraft.status,
          requestedServiceLevel: savedDraft.freightMode || 'air',
          freightMode: savedDraft.freightMode || 'air',
          customerType: savedDraft.customerType || 'Retail Customer',
          specialInstruction: savedDraft.specialInstruction || '',
          addInsurance: savedDraft.addInsurance || false,
          confirmTerms: savedDraft.confirmTerms ?? true,
          items: savedDraft.items && savedDraft.items.length > 0
            ? savedDraft.items.map(item => ({
                id: item.id,
                tracking: item.trackingNumber || '',
                itemType: item.itemType || 'Products / Goods',
                storeName: item.storeName || '',
                itemSource: item.itemSource || '',
                productCategory: item.productCategory || '',
                productDescription: item.productDescription || '',
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || '',
                invoiceValue: item.invoiceValue || 0,
                productLink: item.productLink || '',
              }))
            : [initialItem()],
        });
      }
    } catch (err) {
      // No draft found or API error — start fresh
    }
  };

  const loadRecent = async () => {
    setLoadingRecent(true);
    try {
      const res = await api.get('/self-purchase/recent');
      const recent = (res.data || []).map(r => ({
        id: r.requestId,
        databaseId: r.id,
        status: r.status,
        items: r.items?.length || 0,
        date: new Date(r.createdAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        category: r.items?.[0]?.productCategory || '—',
      }));
      setRecentAlerts(recent);
    } catch (err) {
      // Keep empty list on error
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    loadDraft();
    loadRecent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = [];
    formData.items.forEach((item, idx) => {
      if (!item.tracking) newErrors.push(`Item ${idx + 1}: Tracking number is required`);
      if (!item.storeName) newErrors.push(`Item ${idx + 1}: Store name is required`);
      if (!item.itemSource) newErrors.push(`Item ${idx + 1}: Item source is required`);
      if (!item.productCategory) newErrors.push(`Item ${idx + 1}: Product category is required`);
      if (!item.productDescription) newErrors.push(`Item ${idx + 1}: Product description is required`);
       if (!item.unitPrice) newErrors.push(`Item ${idx + 1}: Unit price is required`);
       if (!item.quantity || item.quantity < 1) newErrors.push(`Item ${idx + 1}: Quantity must be at least 1`);
    });

    if (!formData.confirmTerms) newErrors.push('You must confirm the terms and conditions');

    if (newErrors.length > 0) {
      alert(newErrors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        requestedServiceLevel: formData.requestedServiceLevel || formData.freightMode,
        freightMode: formData.freightMode,
        customerType: formData.customerType,
        specialInstruction: formData.specialInstruction,
        addInsurance: formData.addInsurance,
        confirmTerms: formData.confirmTerms,
        items: formData.items.map(item => ({
          itemType: item.itemType,
          itemSource: item.itemSource,
          trackingNumber: item.tracking,
          storeName: item.storeName,
          productCategory: item.productCategory,
          productDescription: item.productDescription,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          invoiceValue: item.invoiceValue,
          productLink: item.productLink,
        })),
      };

      if (draftId) {
        const res = await api.put(`/self-purchase/${draftId}`, {
          ...payload,
          status: 'Submitted',
        });
        const saved = res.data;
        setDraftId(saved.id);
        setFormData(prev => ({
          ...prev,
          requestId: saved.requestId || prev.requestId,
          status: 'Submitted',
          submittedAt: saved.submittedAt || new Date().toISOString(),
        }));
      } else {
        const res = await api.post('/self-purchase', {
          ...payload,
          status: 'Submitted',
        });
        const saved = res.data;
        setDraftId(saved.id);
        setFormData(prev => ({
          ...prev,
          requestId: saved.requestId,
          status: 'Submitted',
          submittedAt: saved.submittedAt || new Date().toISOString(),
        }));
      }

      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit pre-alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetInternal = () => {
    if (window.confirm('Reset will clear all entered data. Continue?')) {
      setFormData(initialFormState());
      setDraftId(null);
      setNidFile(null);
      setSubmitted(false);
    }
  };

  const handleCreateNew = () => {
    setFormData(initialFormState());
    setDraftId(null);
    setNidFile(null);
    setSubmitted(false);
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this pre-alert? This action cannot be undone and the record will be marked as Cancelled.')) {
      try {
        if (draftId) {
          await api.put(`/self-purchase/${draftId}/cancel`);
        }
        setFormData((prev) => ({
          ...prev,
          status: 'Cancelled',
        }));
      } catch (err) {
        setFormData((prev) => ({ ...prev, status: 'Cancelled' }));
      }
    }
  };

  const handleCancelRecent = async (databaseId, displayId) => {
    if (window.confirm(`Are you sure you want to cancel pre-alert ${displayId}?`)) {
      try {
        await api.put(`/self-purchase/${databaseId}/cancel`);
        setRecentAlerts((prev) =>
          prev.map((a) => (a.databaseId === databaseId ? { ...a, status: 'Cancelled' } : a))
        );
      } catch (err) {
        // Fallback handled by UI update
      }
    }
  };

  const handleServiceLevelChange = (value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        requestedServiceLevel: value,
        freightMode: value,
        items: prev.items.map((item) => ({
          ...item,
          productCategory: '',
        })),
      };
      if (prev.status === 'Draft') {
        handleAutoSave(updated);
      }
      return updated;
    });
  };

  const handleAutoSave = async (updatedForm) => {
    if (updatedForm.status !== 'Draft') return;

    const payload = {
      requestedServiceLevel: updatedForm.requestedServiceLevel || updatedForm.freightMode,
      freightMode: updatedForm.freightMode,
      customerType: updatedForm.customerType,
      specialInstruction: updatedForm.specialInstruction,
      addInsurance: updatedForm.addInsurance,
      confirmTerms: updatedForm.confirmTerms,
      items: updatedForm.items.map(item => ({
        trackingNumber: item.tracking || '',
        itemSource: item.itemSource || '',
        storeName: item.storeName || '',
        productCategory: item.productCategory || '',
        productDescription: item.productDescription || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || '',
        invoiceValue: item.invoiceValue || '',
        productLink: item.productLink || '',
      })),
    };

    try {
      const config = { skipToast: true };
      if (draftId) {
        await api.put(`/self-purchase/${draftId}`, payload, config);
      } else {
        const res = await api.post('/self-purchase', payload, config);
        setDraftId(res.data.id);
        setFormData(prev => ({
          ...prev,
          requestId: res.data.requestId,
        }));
      }
    } catch (err) {
      // Draft auto-save failure is non-fatal - suppress toast by using
      // a custom flag that the interceptor checks
    }
  };

  const updateItem = (id, field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        items: prev.items.map((entry) => {
          if (entry.id !== id) return entry;
          const modified = { ...entry, [field]: value };
          if (field === 'unitPrice' || field === 'quantity') {
            const unitPriceVal = parseFloat(modified.unitPrice) || 0;
            const quantityVal = Number(modified.quantity) || 1;
            modified.invoiceValue = (unitPriceVal * quantityVal).toFixed(2);
          }
          return modified;
        }),
      };
      if (prev.status === 'Draft') {
        handleAutoSave(updated);
      }
      return updated;
    });
  };

  const addItem = () => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        items: [...prev.items, initialItem()],
      };
      if (prev.status === 'Draft') {
        handleAutoSave(updated);
      }
      return updated;
    });
  };

  const removeItem = (id) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => {
      const updated = {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      };
      if (prev.status === 'Draft') {
        handleAutoSave(updated);
      }
      return updated;
    });
  };

  const updateQuantity = (id, delta) => {
    const item = formData.items.find((i) => i.id === id);
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    updateItem(id, 'quantity', newQty);
  };

  const canEdit = (status) => EDITABLE_STATUSES.has(status);

  const canCancel = (status) =>
    !['Approved', 'Rejected', 'Cancelled'].includes(status);

  const isConverted = (status) => status === 'Converted to Shipment';

  const availableCategories = useMemo(() => {
    return formData.requestedServiceLevel === 'air'
      ? AIR_FREIGHT_CATEGORIES
      : SEA_FREIGHT_CATEGORIES;
  }, [formData.requestedServiceLevel]);

  const SERVICE_LEVEL_OPTIONS = [
    { value: 'air', label: 'Air Freight' },
    { value: 'sea', label: 'Sea / Ocean Freight' },
  ];

  const CUSTOMER_TYPE_OPTIONS = [
    'E-commerce Merchant Importer',
    'Retail Customer',
    'Commercial Import',
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className=" mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Self-Purchase / Pre-Alert</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bought from a USA store yourself? Submit your parcel details before it arrives at our USA warehouse for faster matching and processing.
          </p>
        </div>

        {/* Top 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF5C00] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">USA Self-Purchase</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Shop from any USA store and Ship to our USA Warehouse address.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 00-2-2h-1a2 2 0 01-2-2V4.055" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Air &amp; Sea Shipping Options</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Flexible air or sea freight to suit your budget and delivery needs.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Faster Parcel Matching</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Pre-alert helps us match and process your parcel quickly.</p>
            </div>
          </div>
        </div>

        {/* Draft Status Banner */}
        {formData.status === 'Draft' && (
          <div className="bg-blue-50 border border-blue-200/50 rounded-xl p-3 flex items-center gap-2 text-xs text-blue-800">
            <span className="text-blue-500 font-bold">ⓘ</span>
            You are editing a <strong>Draft</strong> pre-alert. Your progress is auto-saved. Submit to send for review.
            {formData.requestId && (
              <span className="font-mono">ID: {formData.requestId}</span>
            )}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Workflow & Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* How Pre-Alert Works */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-900">How Pre-Alert Works</h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-orange-500 mx-auto flex items-center justify-center text-xs font-bold">🛒</div>
                  <p className="text-[10px] font-bold text-slate-800">Shop from any USA store</p>
                </div>
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-orange-500 mx-auto flex items-center justify-center text-xs font-bold">🏠</div>
                  <p className="text-[10px] font-bold text-slate-800">Ship to our USA Warehouse address</p>
                </div>
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-orange-500 mx-auto flex items-center justify-center text-xs font-bold">📄</div>
                  <p className="text-[10px] font-bold text-slate-800">Submit pre-alert</p>
                </div>
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-orange-500 mx-auto flex items-center justify-center text-xs font-bold">📦</div>
                  <p className="text-[10px] font-bold text-slate-800">We receive &amp; match parcel</p>
                </div>
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-orange-500 mx-auto flex items-center justify-center text-xs font-bold">✈️</div>
                  <p className="text-[10px] font-bold text-slate-800">Forward to Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900">
                    {formData.status === 'Draft' ? 'Submit Self-Purchase Pre-Alert' : 'Pre-Alert Submitted'}
                  </h2>
                  {formData.status !== 'Draft' && (
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${STATUS_CONFIG[formData.status]?.color || STATUS_CONFIG.Draft.color}`}>
                      {formData.status}
                    </span>
                  )}
                </div>

                {formData.items.map((item, index) => (
                  <div key={item.id} className="space-y-4 pt-2 first:pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FF5C00] text-white text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900">Item {index + 1}</h3>
                      </div>
                      {formData.items.length > 1 && formData.status === 'Draft' && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Carrier Tracking Number */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        Carrier / Local Courier Tracking Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1Z999AA101234567840"
                        value={item.tracking}
                        onChange={(e) => updateItem(item.id, 'tracking', e.target.value)}
                        disabled={formData.status !== 'Draft'}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                      />
                    </div>

                    {/* Item Type + Item Source side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Item Type *</label>
                        <select
                          value={item.itemType}
                          onChange={(e) => updateItem(item.id, 'itemType', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        >
                          {ITEM_TYPE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Item Source *</label>
                        <select
                          value={item.itemSource}
                          onChange={(e) => updateItem(item.id, 'itemSource', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none disabled:opacity-50"
                        >
                          <option value="">Select item source</option>
                          {ITEM_SOURCE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Seller / Store Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Seller / Company / Store Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Amazon, eBay"
                          value={item.storeName}
                          onChange={(e) => updateItem(item.id, 'storeName', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>

                      {/* Product Category */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Product Category *</label>
                        <select
                          value={item.productCategory}
                          onChange={(e) => updateItem(item.id, 'productCategory', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none disabled:opacity-50"
                        >
                          <option value="">Select category</option>
                          {availableCategories.map((cat) => (
                            <option key={cat.code} value={cat.code}>
                              {cat.code} - {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Description */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Product Description *</label>
                        <input
                          type="text"
                          placeholder="e.g. Apple AirPods Pro 2nd Gen"
                          value={item.productDescription}
                          onChange={(e) => updateItem(item.id, 'productDescription', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>

                      {/* Unit Price & Quantity */}
                      <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Unit Price (USD) *</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="e.g. 129.99"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                              disabled={formData.status !== 'Draft'}
                              className="w-full text-xs pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Quantity *</label>
                          <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg overflow-hidden max-w-[120px]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={formData.status !== 'Draft'}
                              className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                              disabled={formData.status !== 'Draft'}
                              className="w-full text-center text-xs bg-transparent focus:outline-none font-semibold text-slate-700 disabled:bg-slate-100"
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, +1)}
                              disabled={formData.status !== 'Draft'}
                              className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[11px] font-bold text-slate-700">Invoice Value (USD)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">$</span>
                            <input
                              type="text"
                              value={Number(item.unitPrice || 0) * Number(item.quantity || 1)}
                              disabled
                              className="w-full text-xs pl-6 pr-2 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-100"
                            />
                        </div>
                      </div>

                      {/* Product Link */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-bold text-slate-700">Product Link (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://www.example.com/product"
                          value={item.productLink}
                          onChange={(e) => updateItem(item.id, 'productLink', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                ))}

                {/* Add Another Item Button */}
                {formData.status === 'Draft' && (
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full py-2.5 bg-white border border-dashed border-[#FF5C00] text-[#FF5C00] rounded-lg text-xs font-bold hover:bg-orange-50/50 transition flex items-center justify-center gap-1"
                  >
                    <span>+</span> Add Another Item
                  </button>
                )}

                {/* Special Instruction */}
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-bold text-slate-700">Special Instruction (General)</label>
                  <textarea
                    value={formData.specialInstruction}
                     onChange={(e) => setFormData(prev => ({ ...prev, specialInstruction: e.target.value }))}
                    disabled={formData.status !== 'Draft'}
                    placeholder="Any special instruction for this parcel..."
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50 resize-none"
                    rows="3"
                  />
                </div>

                {/* NID Upload */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    NID Upload (Individual &amp; Commercial Import Customers) *
                  </label>
                  <label className="flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 rounded-lg p-3 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => setNidFile(e.target.files?.[0] || null)}
                    />
                    <span className="text-slate-400 text-xs">📄</span>
                    <span className="text-xs text-slate-600 font-medium">
                      {nidFile ? nidFile.name : 'Upload PDF / JPG / PNG'}
                    </span>
                  </label>
                  {nidFile && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Selected: {nidFile.name} ({(nidFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                {/* Dimensions, Service Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[11px] font-bold text-slate-700">Customer Type *</label>
                     <select
                       value={formData.customerType}
                       onChange={(e) => setFormData(prev => ({ ...prev, customerType: e.target.value }))}
                       disabled={formData.status !== 'Draft'}
                       className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none disabled:opacity-50"
                     >
                       {CUSTOMER_TYPE_OPTIONS.map((option) => (
                         <option key={option} value={option}>{option}</option>
                       ))}
                     </select>
                   </div>

                   <div className="space-y-1">
                     <label className="text-[11px] font-bold text-slate-700">Freight Mode *</label>
                     <select
                       value={formData.requestedServiceLevel}
                       onChange={(e) => handleServiceLevelChange(e.target.value)}
                       disabled={formData.status !== 'Draft'}
                       className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none disabled:opacity-50"
                     >
                       {SERVICE_LEVEL_OPTIONS.map((option) => (
                         <option key={option.value} value={option.value}>{option.label}</option>
                       ))}
                     </select>
                   </div>
                </div>

                {/* Confirm Checkboxes */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.confirmTerms}
                       onChange={(e) => setFormData(prev => ({ ...prev, confirmTerms: e.target.checked }))}
                      disabled={formData.status !== 'Draft'}
                      className="rounded border-slate-300 text-[#FF5C00] focus:ring-[#FF5C00] disabled:opacity-50"
                    />
                    <label htmlFor="terms" className="text-[11px] font-bold text-slate-800">
                      I confirm the item details and agree to volumetric and restricted-item rules.
                    </label>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="insurance"
                      checked={formData.addInsurance}
                       onChange={(e) => setFormData(prev => ({ ...prev, addInsurance: e.target.checked }))}
                      disabled={formData.status !== 'Draft'}
                      className="mt-0.5 rounded border-slate-300 text-[#FF5C00] focus:ring-[#FF5C00] disabled:opacity-50"
                    />
                    <label htmlFor="insurance" className="text-[11px] text-slate-600 leading-snug">
                      <span className="font-bold text-slate-800">Add Parcel Insurance (Charge applicable)</span><br />
                      Insurance protects your parcel against loss, theft, or damage during international transportation. A nominal charge (2.5% - 3% of invoice value) will be added.
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {formData.status === 'Draft' && (
                    <>
                      <button
                        type="button"
                        onClick={handleResetInternal}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        🔄 Reset Form
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-5 py-2.5 bg-[#FF5C00] hover:bg-[#E05100] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {loading ? 'Submitting...' : '🚀 Submit Pre-Alert'}
                      </button>
                    </>
                  )}
                  {formData.status !== 'Draft' && canEdit(formData.status) && (
                    <>
                      <Link
                        to={`/services/self-purchase/${draftId || ''}/edit`}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 hover:bg-slate-50"
                      >
                        ✏️ Edit Pre-Alert
                      </Link>
                      {canCancel(formData.status) && (
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          ✕ Cancel Pre-Alert
                        </button>
                      )}
                    </>
                  )}
                  <Link
                    to="/services/self-purchase"
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 hover:bg-slate-50"
                  >
                    📋 Create New Pre-Alert
                  </Link>
                </div>
              </div>
            </form>
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Request submitted successfully.</span>
                </div>
                <div className="flex items-center gap-2">
                  {draftId && (
                    <Link
                      to={`/services/self-purchase/${draftId}`}
                      className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition"
                    >
                      View Details
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition"
                  >
                    Create New Pre-Alert
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">

            {/* Important Pre-Alert Guidelines */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-900">Important Pre-Alert Guidelines</h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-xs mt-0.5">✔</span>
                  <p className="text-[11px] font-bold text-slate-800">Use the correct customer ID on your parcel</p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-xs mt-0.5">✔</span>
                  <p className="text-[11px] font-bold text-slate-800">Upload invoice for faster verification</p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-xs mt-0.5">✔</span>
                  <p className="text-[11px] font-bold text-slate-800">Restricted items are not accepted</p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-xs mt-0.5">✔</span>
                  <p className="text-[11px] font-bold text-slate-800">Unmatched parcels may require manual review</p>
                </div>
              </div>
            </div>

            {/* Recent Pre-Alerts */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900">Recent Pre-Alerts</h2>
                <a
                  href="/my-shipments?tab=self-purchase"
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  View All
                </a>
              </div>

              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start justify-between">
                    <div className="flex items-start gap-2.5">
                      <span className="text-slate-400 text-sm mt-0.5">📋</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{alert.id}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{alert.items} Items • {alert.category}</p>
                        <p className="text-[9px] text-slate-400 mt-1">📅 {alert.date}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${STATUS_CONFIG[alert.status]?.color || STATUS_CONFIG.Draft.color}`}>
                        {alert.status}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-end">
                        <Link
                          to={`/services/self-purchase/${alert.databaseId}`}
                          className="hover:text-blue-600"
                        >
                          Details
                        </Link>
                        {canEdit(alert.status) && (
                          <>
                            <span>•</span>
                            <Link
                              to={`/services/self-purchase/${alert.databaseId}/edit`}
                              className="hover:text-blue-600"
                            >
                              Edit
                            </Link>
                          </>
                        )}
                        {canCancel(alert.status) && (
                          <>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => handleCancelRecent(alert.databaseId, alert.id)}
                              className="hover:text-rose-600 hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1"
                >
                  <span>+</span> Create New Pre-Alert
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Info Banner */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-amber-500 text-sm shrink-0">⚠️</span>
            <p className="text-[11px] text-slate-600 leading-snug">
              <span className="font-bold text-slate-800">Customer ID missing on parcel</span> may result in Unmatched Parcel status.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-blue-500 text-sm shrink-0">👤</span>
            <p className="text-[11px] text-slate-600 leading-snug">
              <span className="font-bold text-slate-800">Admin may approve, reject, or request</span> more information.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 text-sm shrink-0">⚙️</span>
            <p className="text-[11px] text-slate-600 leading-snug">
              <span className="font-bold text-slate-800">Air and Sea mode affect</span> final shipping workflow.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SelfPurchase;

