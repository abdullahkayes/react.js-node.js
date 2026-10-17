import React, { useEffect, useMemo, useState } from 'react';
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
  itemType: 'Products / Goods',
  itemSource: '',
  productLink: '',
  storeName: '',
  productName: '',
  productCategory: '',
  productDescription: '',
  quantity: 1,
  unitPrice: '',
  productPrice: 0,
  variant: '',
  screenshot: null,
  screenshotName: '',
});

const initialFormState = () => ({
  status: 'Draft',
  requestedServiceLevel: 'air',
  freightMode: 'air',
  confirmTerms: true,
  addInsurance: false,
  specialInstruction: '',
  customerType: 'Retail Customer',
  items: [initialItem()],
});

const STATUS_CONFIG = {
  Draft: { color: 'bg-slate-50 text-slate-600 border-slate-100' },
  Submitted: { color: 'bg-blue-50 text-blue-600 border-blue-100' },
  'Under Review': { color: 'bg-blue-50 text-blue-600 border-blue-100' },
  'Need More Information': { color: 'bg-amber-50 text-amber-600 border-amber-100' },
  Approved: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  Rejected: { color: 'bg-rose-50 text-rose-600 border-rose-100' },
  Purchased: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  'In Warehouse': { color: 'bg-blue-50 text-blue-600 border-blue-100' },
  Cancelled: { color: 'bg-slate-100 text-slate-400 border-slate-200' },
  'Converted to Shipment': { color: 'bg-purple-50 text-purple-600 border-purple-100' },
};

const EDITABLE_STATUSES = new Set(['Draft', 'Submitted', 'Under Review', 'Need More Information']);

const SERVICE_LEVEL_OPTIONS = [
  { value: 'air', label: 'Air Freight ' },
  { value: 'sea', label: 'Sea / Ocean Freight' },
];

const CUSTOMER_TYPE_OPTIONS = [
  'E-commerce Merchant Importer',
  'Retail Customer',
  'Commercial Import',
];

const AssistedPurchase = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);
  const [draftId, setDraftId] = useState(null);
  const [nidFile, setNidFile] = useState(null);

  const loadDraft = async () => {
    try {
      const res = await api.get('/assisted-purchase', { params: { status: 'Draft' } });
      const savedDraft = res.data.requests?.[0] || res.data?.[0];
      if (savedDraft && savedDraft.status === 'Draft') {
        setDraftId(savedDraft.id);
        setFormData({
          status: savedDraft.status,
          requestedServiceLevel: savedDraft.requestedServiceLevel || savedDraft.freightMode || 'air',
          freightMode: savedDraft.freightMode || 'air',
          customerType: savedDraft.customerType || 'Retail Customer',
          specialInstruction: savedDraft.specialInstruction || '',
          addInsurance: savedDraft.addInsurance || false,
          confirmTerms: savedDraft.confirmTerms ?? true,
          items: savedDraft.items?.length
            ? savedDraft.items.map((item) => ({
                ...initialItem(),
                id: item.id,
                itemType: item.itemType || 'Products / Goods',
                itemSource: item.itemSource || '',
                productLink: item.productLink || '',
                storeName: item.storeName || '',
                productName: item.productName || '',
                productCategory: item.productCategory || '',
                productDescription: item.productDescription || '',
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || '',
                productPrice: item.productPrice || 0,
                variant: item.variant || '',
                screenshotName: item.screenshotPath ? item.screenshotPath.split('/').pop() : '',
              }))
            : [initialItem()],
        });
      }
    } catch {
      setFormData(initialFormState());
    }
  };

  const loadRecent = async () => {
    setLoadingRecent(true);
    try {
      const res = await api.get('/assisted-purchase/recent');
      setRecentRequests((res.data || []).map((request) => ({
        id: request.requestId,
        databaseId: request.id,
        status: request.status,
        items: request.items?.length || 0,
        total: request.items?.reduce((sum, item) => sum + Number(item.productPrice || 0) * Number(item.quantity || 1), 0),
        date: new Date(request.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        store: request.items?.[0]?.storeName || '—',
      })));
    } catch {
      setRecentRequests([]);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    loadDraft();
    loadRecent();
  }, []);

  const availableCategories = useMemo(
    () => (formData.requestedServiceLevel === 'air' ? AIR_FREIGHT_CATEGORIES : SEA_FREIGHT_CATEGORIES),
    [formData.requestedServiceLevel]
  );

  const buildPayload = (form) => ({
    requestedServiceLevel: form.requestedServiceLevel || form.freightMode,
    freightMode: form.freightMode,
    customerType: form.customerType,
    specialInstruction: form.specialInstruction,
    addInsurance: form.addInsurance,
    confirmTerms: form.confirmTerms,
    items: form.items.map((item) => ({
      itemType: item.itemType,
      itemSource: item.itemSource,
      productLink: item.productLink,
      storeName: item.storeName,
      productName: item.productName,
      productCategory: item.productCategory,
      productDescription: item.productDescription,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      productPrice: item.productPrice,
      variant: item.variant,
    })),
  });

  const uploadFiles = async (requestDatabaseId) => {
    const screenshots = formData.items
      .map((item, index) => ({ file: item.screenshot, index }))
      .filter((entry) => entry.file);

    if (!nidFile && screenshots.length === 0) return;

    const data = new FormData();
    if (nidFile) data.append('nid', nidFile);
    screenshots.forEach(({ file }) => data.append('screenshots', file));
    data.append('screenshotIndexes', JSON.stringify(screenshots.map(({ index }) => index)));

    await api.post(`/assisted-purchase/${requestDatabaseId}/files`, data, { skipToast: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = [];

    formData.items.forEach((item, index) => {
      const label = `Item ${index + 1}`;
      if (!item.productLink.trim()) errors.push(`${label}: Product link is required`);
      if (!item.storeName.trim()) errors.push(`${label}: Store name is required`);
      if (!item.productName.trim()) errors.push(`${label}: Product name is required`);
      if (!item.productCategory) errors.push(`${label}: Product category is required`);
      if (!item.productDescription.trim()) errors.push(`${label}: Product description is required`);
       if (!item.unitPrice || Number(item.unitPrice) < 0) errors.push(`${label}: Unit price is required`);
       if (!item.quantity || item.quantity < 1) errors.push(`${label}: Quantity must be at least 1`);
    });

    if (!formData.confirmTerms) errors.push('You must confirm the terms and conditions');

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      const payload = { ...buildPayload(formData), status: 'Submitted' };
      let saved;
      if (draftId) {
        const res = await api.put(`/assisted-purchase/${draftId}`, payload);
        saved = res.data;
      } else {
        const res = await api.post('/assisted-purchase', payload);
        saved = res.data;
      }

      await uploadFiles(saved.id);
      setDraftId(saved.id);
      setFormData((prev) => ({
        ...prev,
        status: 'Submitted',
        submittedAt: saved.submittedAt || new Date().toISOString(),
      }));
      setSubmitted(true);
      await loadRecent();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit assisted purchase request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async (updatedForm) => {
    if (updatedForm.status !== 'Draft') return;
    const payload = buildPayload(updatedForm);
    const config = { skipToast: true };

    try {
      if (draftId) {
        await api.put(`/assisted-purchase/${draftId}`, payload, config);
      } else {
        const res = await api.post('/assisted-purchase', payload, config);
        setDraftId(res.data.id);
      }
    } catch {
      return;
    }
  };

  const updateItem = async (id, field, value) => {
    const updated = {
      ...formData,
      items: formData.items.map((entry) => {
        if (entry.id !== id) return entry;
        const modified = { ...entry, [field]: value };
        if (field === 'unitPrice' || field === 'quantity') {
          const unitPriceVal = parseFloat(modified.unitPrice) || 0;
          const quantityVal = Number(modified.quantity) || 1;
          modified.productPrice = (unitPriceVal * quantityVal).toFixed(2);
        }
        return modified;
      }),
    };
    setFormData(updated);
    if (formData.status === 'Draft') await handleAutoSave(updated);
  };

  const addItem = async () => {
    const updated = { ...formData, items: [...formData.items, initialItem()] };
    setFormData(updated);
    if (formData.status === 'Draft') await handleAutoSave(updated);
  };

  const removeItem = async (id) => {
    if (formData.items.length <= 1) return;
    const updated = { ...formData, items: formData.items.filter((item) => item.id !== id) };
    setFormData(updated);
    if (formData.status === 'Draft') await handleAutoSave(updated);
  };

  const updateQuantity = (id, delta) => {
    const item = formData.items.find((entry) => entry.id === id);
    updateItem(id, 'quantity', Math.max(1, Number(item.quantity || 1) + delta));
  };

  const handleServiceLevelChange = async (value) => {
    const updated = {
      ...formData,
      requestedServiceLevel: value,
      freightMode: value,
      items: formData.items.map((item) => ({ ...item, productCategory: '' })),
    };
    setFormData(updated);
    if (formData.status === 'Draft') await handleAutoSave(updated);
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
    if (!window.confirm('Cancel this assisted purchase request?')) return;
    try {
      if (draftId) await api.put(`/assisted-purchase/${draftId}/cancel`);
      setFormData((prev) => ({ ...prev, status: 'Cancelled' }));
    } catch {
      setFormData((prev) => ({ ...prev, status: 'Cancelled' }));
    }
  };

  const handleCancelRecent = async (databaseId) => {
    const request = recentRequests.find((entry) => entry.databaseId === databaseId);
    if (!request || !window.confirm(`Cancel assisted purchase request ${request.id}?`)) return;
    try {
      await api.put(`/assisted-purchase/${databaseId}/cancel`);
      setRecentRequests((prev) => prev.map((entry) => (
        entry.databaseId === databaseId ? { ...entry, status: 'Cancelled' } : entry
      )));
    } catch {
      return;
    }
  };

  const canEdit = (status) => EDITABLE_STATUSES.has(status);
  const canCancel = (status) => !['Approved', 'Rejected', 'Cancelled'].includes(status);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assisted Purchase</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Send us products from any USA store. We verify availability, confirm the total cost, purchase on your behalf, and ship to Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <span className="text-base">✓</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Verified Purchase</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">We confirm stock, price, and seller details before buying.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <span className="text-base">$</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Transparent Quotation</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Product cost, service charge, and shipping are shown clearly.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <span className="text-base">↗</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">USA To Bangladesh</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Warehouse handling, freight, and door-to-door delivery.</p>
            </div>
          </div>
        </div>

        {formData.status === 'Draft' && (
          <div className="bg-blue-50 border border-blue-200/50 rounded-xl p-3 flex items-center gap-2 text-xs text-blue-800">
            <span className="text-blue-500 font-bold">i</span>
            <span>You are editing a <strong>Draft</strong> assisted purchase request. Your progress is auto-saved.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-900">How Assisted Purchase Works</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
                {[
                  ['1', 'Submit Products', 'Share links and product details'],
                  ['2', 'Get Quotation', 'We verify price and availability'],
                  ['3', 'Confirm Cost', 'Review product and service charges'],
                  ['4', 'Pay In Advance', 'Pay the confirmed amount in BDT'],
                  ['5', 'We Purchase', 'We buy and receive the products'],
                  ['6', 'Deliver To You', 'Ship door-to-door in Bangladesh'],
                ].map(([number, title, text]) => (
                  <div key={title} className="space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 mx-auto flex items-center justify-center text-xs font-bold">{number}</div>
                    <p className="text-[10px] font-bold text-slate-800">{title}</p>
                    <p className="text-[9px] text-slate-400">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900">
                    {formData.status === 'Draft' ? 'Submit Assisted Purchase Request' : 'Request Submitted'}
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
                        <span className="w-5 h-5 rounded-full bg-[#FF5C00] text-white text-[10px] font-bold flex items-center justify-center">{index + 1}</span>
                        <h3 className="text-xs font-bold text-slate-900">Item {index + 1}</h3>
                      </div>
                      {formData.items.length > 1 && formData.status === 'Draft' && (
                        <button type="button" onClick={() => removeItem(item.id)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition" title="Remove item">×</button>
                      )}
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
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Product Link (USA Store) *</label>
                        <input
                          type="url"
                          value={item.productLink}
                          onChange={(event) => updateItem(item.id, 'productLink', event.target.value)}
                          disabled={formData.status !== 'Draft'}
                          placeholder="https://www.store.com/product/..."
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Store / Website Name *</label>
                        <input
                          type="text"
                          value={item.storeName}
                          onChange={(event) => updateItem(item.id, 'storeName', event.target.value)}
                          disabled={formData.status !== 'Draft'}
                          placeholder="e.g. Amazon, eBay, Walmart"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Product Name *</label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(event) => updateItem(item.id, 'productName', event.target.value)}
                          disabled={formData.status !== 'Draft'}
                          placeholder="Enter product name"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Estimated Product Price (USD) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs text-slate-400">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.productPrice}
                            onChange={(event) => updateItem(item.id, 'productPrice', event.target.value)}
                            disabled={formData.status !== 'Draft'}
                            placeholder="0.00"
                            className="w-full text-xs pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Product Category *</label>
                        <select
                          value={item.productCategory}
                          onChange={(event) => updateItem(item.id, 'productCategory', event.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        >
                          <option value="">Select category</option>
                          {availableCategories.map((category) => (
                            <option key={category.code} value={category.code}>{category.code} - {category.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Product Description *</label>
                        <input
                          type="text"
                          value={item.productDescription}
                          onChange={(event) => updateItem(item.id, 'productDescription', event.target.value)}
                          disabled={formData.status !== 'Draft'}
                          placeholder="Model, specifications, package contents"
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Unit Price (USD) *</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-slate-400">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(event) => updateItem(item.id, 'unitPrice', event.target.value)}
                              disabled={formData.status !== 'Draft'}
                              placeholder="0.00"
                              className="w-full text-xs pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Quantity *</label>
                          <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg overflow-hidden">
                            <button type="button" onClick={() => updateQuantity(item.id, -1)} disabled={formData.status !== 'Draft'} className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50">−</button>
                            <input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', Math.max(1, parseInt(event.target.value) || 1))} disabled={formData.status !== 'Draft'} className="w-full text-center text-xs bg-transparent focus:outline-none font-semibold text-slate-700 disabled:opacity-50" />
                            <button type="button" onClick={() => updateQuantity(item.id, 1)} disabled={formData.status !== 'Draft'} className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50">+</button>
                          </div>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[11px] font-bold text-slate-700">Estimated Product Price (USD)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-slate-400">$</span>
                            <input
                              type="text"
                              value={Number(item.unitPrice || 0) * Number(item.quantity || 1)}
                              disabled
                              placeholder="0.00"
                              className="w-full text-xs pl-7 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 disabled:opacity-100"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[11px] font-bold text-slate-700">Color / Size / Variant</label>
                          <input
                            type="text"
                            value={item.variant}
                            onChange={(event) => updateItem(item.id, 'variant', event.target.value)}
                            disabled={formData.status !== 'Draft'}
                            placeholder="e.g. Black, Large, 128GB"
                            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-bold text-slate-700">Upload Cart / Product Screenshot</label>
                        {formData.status === 'Draft' ? (
                          <label className="flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 rounded-lg p-3 cursor-pointer hover:bg-slate-100 transition">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(event) => updateItem(item.id, 'screenshot', event.target.files?.[0] || null)}
                            />
                            <span className="text-slate-400 text-xs">PDF</span>
                            <span className="text-xs text-slate-600 font-medium">{item.screenshot?.name || item.screenshotName || 'Upload PDF / JPG / PNG'}</span>
                          </label>
                        ) : (
                          <div className="border border-slate-200 bg-slate-50 rounded-lg p-3 text-center text-xs text-slate-600">
                            {item.screenshotName || 'No screenshot uploaded'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {formData.status === 'Draft' && (
                  <button type="button" onClick={addItem} className="w-full py-2.5 bg-white border border-dashed border-[#FF5C00] text-[#FF5C00] rounded-lg text-xs font-bold hover:bg-orange-50/50 transition flex items-center justify-center gap-1">
                    <span>+</span> Add Another Item
                  </button>
                )}

                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-bold text-slate-700">Additional Notes</label>
                  <textarea
                    value={formData.specialInstruction}
                    onChange={(event) => setFormData((prev) => ({ ...prev, specialInstruction: event.target.value }))}
                    disabled={formData.status !== 'Draft'}
                    placeholder="Seller notes, SKU code, model, substitutions, or special instructions"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50 resize-none"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Customer Type *</label>
                    <select
                      value={formData.customerType}
                      onChange={(event) => setFormData((prev) => ({ ...prev, customerType: event.target.value }))}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none disabled:opacity-50"
                    >
                      {CUSTOMER_TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Freight Mode *</label>
                    <select
                      value={formData.requestedServiceLevel}
                      onChange={(event) => handleServiceLevelChange(event.target.value)}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none disabled:opacity-50"
                    >
                      {SERVICE_LEVEL_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">NID Upload (Retail Customer &amp; Commercial Import Customers) *</label>
                  {formData.status === 'Draft' ? (
                    <label className="flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 rounded-lg p-3 cursor-pointer hover:bg-slate-100 transition">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(event) => setNidFile(event.target.files?.[0] || null)}
                      />
                      <span className="text-slate-400 text-xs">PDF</span>
                      <span className="text-xs text-slate-600 font-medium">{nidFile ? nidFile.name : 'Upload PDF / JPG / PNG'}</span>
                    </label>
                  ) : (
                    <div className="border border-slate-200 bg-slate-50 rounded-lg p-3 text-center text-xs text-slate-600">{nidFile?.name || 'No NID uploaded'}</div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="assisted-insurance"
                      checked={formData.addInsurance}
                      onChange={(event) => setFormData((prev) => ({ ...prev, addInsurance: event.target.checked }))}
                      disabled={formData.status !== 'Draft'}
                      className="mt-0.5 rounded border-slate-300 text-[#FF5C00] focus:ring-[#FF5C00] disabled:opacity-50"
                    />
                    <label htmlFor="assisted-insurance" className="text-[11px] text-slate-600 leading-snug">
                      <span className="font-bold text-slate-800">Add Parcel Insurance</span> (if charge is applicable). Insurance protects against loss, theft, or damage during international transportation.
                    </label>
                  </div>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="assisted-terms"
                      checked={formData.confirmTerms}
                      onChange={(event) => setFormData((prev) => ({ ...prev, confirmTerms: event.target.checked }))}
                      disabled={formData.status !== 'Draft'}
                      className="mt-0.5 rounded border-slate-300 text-[#FF5C00] focus:ring-[#FF5C00] disabled:opacity-50"
                    />
                    <label htmlFor="assisted-terms" className="text-[11px] font-bold text-slate-800 leading-snug">
                      I confirm the product details and agree that the final quotation is subject to product availability, seller charges, exchange rate, and freight measurement.
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {formData.status === 'Draft' ? (
                    <>
                      <button type="button" onClick={handleResetInternal} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition">Reset Form</button>
                      <button type="submit" disabled={loading} className="flex-1 px-5 py-2.5 bg-[#FF5C00] hover:bg-[#E05100] text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Submit Assisted Purchase Request'}
                      </button>
                    </>
                  ) : (
                    <>
                      {canEdit(formData.status) && <button type="button" onClick={handleCancel} className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition">Cancel Request</button>}
                      <button type="button" onClick={handleCreateNew} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">Create New Request</button>
                    </>
                  )}
                </div>
              </div>
            </form>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Assisted purchase request submitted successfully.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/services/assisted-purchase/${draftId}`}
                    className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition"
                  >
                    View Details
                  </Link>
                  <button type="button" onClick={handleCreateNew} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition">
                    Create New Request
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-sm font-bold">i</span>
                <h4 className="text-xs font-bold text-slate-900">Important: Payment &amp; Policy</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600">
                <span>100% confirmed payment is required in advance in BDT.</span>
                <span>Assisted purchase service charge is 5%–10% of product price, minimum $5.</span>
                <span>Final cost may include product tax, USA domestic shipping, and exchange-rate differences.</span>
                <span>Non-refundable products may not be eligible for seller refunds.</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-900">Before You Submit</h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2"><span className="text-orange-500 font-bold">✓</span><p className="text-[11px] font-bold text-slate-800">Use direct product links from USA stores.</p></div>
                <div className="flex items-start gap-2"><span className="text-orange-500 font-bold">✓</span><p className="text-[11px] font-bold text-slate-800">Enter the exact color, size, model, and quantity.</p></div>
                <div className="flex items-start gap-2"><span className="text-orange-500 font-bold">✓</span><p className="text-[11px] font-bold text-slate-800">Upload a cart screenshot when available.</p></div>
                <div className="flex items-start gap-2"><span className="text-orange-500 font-bold">✓</span><p className="text-[11px] font-bold text-slate-800">We will send a quotation before making any purchase.</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900">Summery Assisted Purchase Requests</h2>
                <a href="/my-shipments?tab=assisted-purchase" className="text-[11px] font-bold text-blue-600 hover:underline">View All</a>
              </div>

              {loadingRecent ? (
                <p className="text-[11px] text-slate-400">Loading requests…</p>
              ) : recentRequests.length === 0 ? (
                <p className="text-[11px] text-slate-400">No assisted purchase requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentRequests.map((request) => (
                    <div key={request.databaseId} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 text-sm mt-0.5">AP</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{request.id}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{request.items} Item(s) • {request.store}</p>
                          <p className="text-[9px] text-slate-400 mt-1">{request.date}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${STATUS_CONFIG[request.status]?.color || STATUS_CONFIG.Draft.color}`}>{request.status}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-end">
                          <Link to={`/services/assisted-purchase/${request.databaseId}`} className="hover:text-blue-600">Details</Link>
                          {canEdit(request.status) && (
                            <>
                              <span>•</span>
                              <Link to={`/services/assisted-purchase/${request.databaseId}/edit`} className="hover:text-blue-600">Edit</Link>
                            </>
                          )}
                          {canCancel(request.status) && (
                            <>
                              <span>•</span>
                              <button type="button" onClick={() => handleCancelRecent(request.databaseId)} className="hover:text-rose-600 hover:underline">Cancel</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" onClick={handleCreateNew} className="w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1">
                <span>+</span> Create New Assisted Purchase Request
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-amber-500 text-sm shrink-0 font-bold">!</span>
            <p className="text-[11px] text-slate-600 leading-snug"><span className="font-bold text-slate-800">Product availability can change.</span> We confirm it before purchase.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-blue-500 text-sm shrink-0 font-bold">$</span>
            <p className="text-[11px] text-slate-600 leading-snug"><span className="font-bold text-slate-800">Quotation is sent first.</span> No product is purchased without confirmation.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400 text-sm shrink-0 font-bold">i</span>
            <p className="text-[11px] text-slate-600 leading-snug"><span className="font-bold text-slate-800">Air and sea selection</span> affects the shipping workflow and final freight quote.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistedPurchase;
