import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import { AIR_FREIGHT_CATEGORIES, SEA_FREIGHT_CATEGORIES } from '../../data/pricingData';

const initialItem = () => ({
  id: Date.now(),
  tracking: '',
  itemType: 'Product / Goods',
  storeName: '',
  itemSource: '',
  productCategory: '',
  productDescription: '',
  quantity: 1,
  unitPrice: '',
  invoiceValue: 0,
  productLink: '',
});

const CUSTOMER_TYPE_OPTIONS = [
  'E-commerce Merchant Importer',
  'Retail Customer',
  'Commercial Import',
];

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

const SelfPurchaseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [nidFile, setNidFile] = useState(null);
  const [existingNid, setExistingNid] = useState(null);

  const availableCategories = useMemo(
    () => (formData?.freightMode === 'sea' ? SEA_FREIGHT_CATEGORIES : AIR_FREIGHT_CATEGORIES),
    [formData?.freightMode]
  );

  const isEditable = formData ? EDITABLE_STATUSES.has(formData.status) : false;

  const loadRequest = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/self-purchase/${id}`);
      const request = res.data;
      setFormData({
        id: request.id,
        requestId: request.requestId,
        status: request.status,
        freightMode: request.freightMode || 'air',
        customerType: request.customerType || 'Retail Customer',
        specialInstruction: request.specialInstruction || '',
        addInsurance: request.addInsurance || false,
        confirmTerms: request.confirmTerms ?? true,
        items: request.items?.length
          ? request.items.map((item) => ({
              id: item.id,
              tracking: item.trackingNumber || '',
              itemType: item.itemType || 'Product / Goods',
              storeName: item.storeName || '',
              itemSource: item.itemSource || '',
              productCategory: item.productCategory || '',
              productDescription: item.productDescription || '',
              quantity: item.quantity || 1,
            unitPrice: item.unitPrice != null ? String(item.unitPrice) : '',
            invoiceValue: item.invoiceValue != null ? String(item.invoiceValue) : '',
              productLink: item.productLink || '',
            }))
          : [initialItem()],
      });
      setExistingNid(request.nidPath || null);
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

  const buildPayload = (form) => ({
    freightMode: form.freightMode,
    customerType: form.customerType,
    specialInstruction: form.specialInstruction,
    addInsurance: form.addInsurance,
    confirmTerms: form.confirmTerms,
    items: form.items.map((item) => ({
      trackingNumber: item.tracking,
      itemSource: item.itemSource,
      storeName: item.storeName,
      productCategory: item.productCategory,
      productDescription: item.productDescription,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      invoiceValue: item.invoiceValue,
      productLink: item.productLink,
      itemType: item.itemType,
    })),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = [];

    formData.items.forEach((item, index) => {
      const label = `Item ${index + 1}`;
      if (!item.tracking.trim()) errors.push(`${label}: Tracking number is required`);
      if (!item.storeName.trim()) errors.push(`${label}: Store name is required`);
      if (!item.itemSource) errors.push(`${label}: Item source is required`);
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

     setSubmitting(true);
    try {
      const payload = { ...buildPayload(formData), status: 'Submitted' };
      const res = await api.put(`/self-purchase/${formData.id}`, payload);
      await uploadFiles(res.data.id);
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadFiles = async (requestDatabaseId) => {
    if (!nidFile) return;
    const data = new FormData();
    data.append('nid', nidFile);
    await api.post(`/self-purchase/${requestDatabaseId}/files`, data, { skipToast: true });
  };

  const updateItem = (itemId, field, value) => {
    const updated = {
      ...formData,
      items: formData.items.map((entry) => {
        if (entry.id !== itemId) return entry;
        const modified = { ...entry, [field]: value };
        if (field === 'unitPrice' || field === 'quantity') {
          const unitPriceVal = parseFloat(modified.unitPrice) || 0;
          const quantityVal = Number(modified.quantity) || 1;
          modified.invoiceValue = (unitPriceVal * quantityVal).toFixed(2);
        }
        return modified;
      }),
    };
    setFormData(updated);
  };

  const addItem = () => {
    const updated = { ...formData, items: [...formData.items, initialItem()] };
    setFormData(updated);
  };

  const removeItem = (itemId) => {
    if (formData.items.length <= 1) return;
    const updated = { ...formData, items: formData.items.filter((item) => item.id !== itemId) };
    setFormData(updated);
  };

  const updateQuantity = (itemId, delta) => {
    const item = formData.items.find((entry) => entry.id === itemId);
    updateItem(itemId, 'quantity', Math.max(1, Number(item.quantity || 1) + delta));
  };

  const handleServiceLevelChange = (value) => {
    setFormData({
      ...formData,
      freightMode: value,
      items: formData.items.map((item) => ({ ...item, productCategory: '' })),
    });
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

  if (error || !formData) {
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

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto max-w-4xl space-y-6">
        <nav className="text-xs text-slate-400">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/services/self-purchase" className="hover:underline">Self Purchase</Link>
          <span className="mx-1">/</span>
          <Link to={`/services/self-purchase/${formData.id}`} className="hover:underline">{formData.requestId}</Link>
          <span className="mx-1">/</span>
          <span className="text-slate-600 font-medium">Edit</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Edit Self-Purchase Pre-Alert</h1>
                <p className="text-[11px] text-slate-400 mt-0.5">{formData.requestId} • {formData.items.length} Item(s)</p>
              </div>
              <span className={`px-3 py-1 rounded text-[10px] font-bold border ${STATUS_CONFIG[formData.status]?.color || STATUS_CONFIG.Draft.color}`}>
                {formData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Customer Type *</label>
                <select
                  value={formData.customerType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerType: e.target.value }))}
                  disabled={!isEditable}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                >
                  {CUSTOMER_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Service Level *</label>
                <select
                  value={formData.freightMode}
                  onChange={(e) => handleServiceLevelChange(e.target.value)}
                  disabled={!isEditable}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                >
                  <option value="air">Air Freight (Express)</option>
                  <option value="sea">Sea Freight (Standard)</option>
                </select>
              </div>
            </div>

            {formData.items.map((item, index) => (
              <div key={item.id} className="space-y-4 pt-2 first:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF5C00] text-white text-[10px] font-bold flex items-center justify-center">{index + 1}</span>
                    <h3 className="text-xs font-bold text-slate-900">Item {index + 1}</h3>
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                      title="Remove item"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Carrier / Local Courier Tracking Number *</label>
                  <input
                    type="text"
                    value={item.tracking}
                    onChange={(e) => updateItem(item.id, 'tracking', e.target.value)}
                    placeholder="e.g. 1Z999AA101234567840"
                    disabled={!isEditable}
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
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    >
                      <option value="Products / Goods">Products / Goods</option>
                      <option value="Documents">Documents</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Item Source *</label>
                    <select
                      value={item.itemSource}
                      onChange={(e) => updateItem(item.id, 'itemSource', e.target.value)}
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none disabled:opacity-50"
                    >
                      <option value="">Select item source</option>
                      <option>Online Store</option>
                      <option>Local Store</option>
                      <option>Company</option>
                      <option>Dealership</option>
                      <option>Manufacture</option>
                      <option>Business Documents</option>
                      <option>Personal Documents</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Seller / Company / Store Name *</label>
                    <input
                      type="text"
                      value={item.storeName}
                      onChange={(e) => updateItem(item.id, 'storeName', e.target.value)}
                      placeholder="e.g. Amazon, eBay"
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Product Category *</label>
                    <select
                      value={item.productCategory}
                      onChange={(e) => updateItem(item.id, 'productCategory', e.target.value)}
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none disabled:opacity-50"
                    >
                      <option value="">Select category</option>
                      {availableCategories.map((cat) => (
                        <option key={cat.code} value={cat.code}>{cat.code} - {cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Product Description *</label>
                    <input
                      type="text"
                      value={item.productDescription}
                      onChange={(e) => updateItem(item.id, 'productDescription', e.target.value)}
                      placeholder="e.g. Apple AirPods Pro 2nd Gen"
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>

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
                          disabled={!isEditable}
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
                          disabled={!isEditable}
                          className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          disabled={!isEditable}
                          className="w-full text-center text-xs bg-transparent focus:outline-none font-semibold text-slate-700 disabled:bg-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={!isEditable}
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

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700">Product Link (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://www.example.com/product"
                        value={item.productLink}
                        onChange={(e) => updateItem(item.id, 'productLink', e.target.value)}
                        disabled={!isEditable}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isEditable && (
              <button
                type="button"
                onClick={addItem}
                className="w-full py-2.5 bg-white border border-dashed border-[#FF5C00] text-[#FF5C00] rounded-lg text-xs font-bold hover:bg-orange-50/50 transition flex items-center justify-center gap-1"
              >
                <span>+</span> Add Another Item
              </button>
            )}

            <div className="space-y-1 pt-2">
              <label className="text-[11px] font-bold text-slate-700">Special Instruction (General)</label>
              <textarea
                value={formData.specialInstruction}
                onChange={(e) => setFormData((prev) => ({ ...prev, specialInstruction: e.target.value }))}
                placeholder="Any special instruction for this parcel..."
                disabled={!isEditable}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50 resize-none"
                rows="3"
              />
             </div>

             <div className="space-y-1 pt-2">
               <label className="text-[11px] font-bold text-slate-700">NID Upload (Individual &amp; Commercial Import Customers) *</label>
               <label className="flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 rounded-lg p-3 cursor-pointer hover:bg-slate-100 transition">
                 <input
                   type="file"
                   accept=".pdf,.jpg,.jpeg,.png"
                   className="hidden"
                   onChange={(e) => setNidFile(e.target.files?.[0] || null)}
                 />
                 <span className="text-slate-400 text-xs">📄</span>
                 <span className="text-xs text-slate-600 font-medium">
                   {nidFile ? nidFile.name : (existingNid ? existingNid.split('/').pop() : 'Upload PDF / JPG / PNG')}
                 </span>
               </label>
               {nidFile && (
                 <p className="text-[10px] text-slate-500 mt-1">
                   Selected: {nidFile.name} ({(nidFile.size / 1024).toFixed(1)} KB)
                 </p>
               )}
             </div>

             <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-terms"
                  checked={formData.confirmTerms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmTerms: e.target.checked }))}
                  disabled={!isEditable}
                  className="rounded border-slate-300 text-[#FF5C00] focus:ring-[#FF5C00] disabled:opacity-50"
                />
                <label htmlFor="edit-terms" className="text-[11px] font-bold text-slate-800">
                  I confirm the item details and agree to volumetric and restricted-item rules.
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="edit-insurance"
                  checked={formData.addInsurance}
                  onChange={(e) => setFormData((prev) => ({ ...prev, addInsurance: e.target.checked }))}
                  disabled={!isEditable}
                  className="mt-0.5 rounded border-slate-300 text-[#FF5C00] focus:ring-[#FF5C00] disabled:opacity-50"
                />
                <label htmlFor="edit-insurance" className="text-[11px] text-slate-600 leading-snug">
                  <span className="font-bold text-slate-800">Add Parcel Insurance (Charge applicable)</span><br />
                  Insurance protects your parcel against loss, theft, or damage during international transportation. A nominal charge (2.5% - 3% of invoice value) will be added.
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {isEditable && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#FF5C00] hover:bg-[#E05100] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : '🚀 Update Pre-Alert'}
                </button>
              )}
              <Link
                to={`/services/self-purchase/${formData.id}`}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 hover:bg-slate-50"
              >
                ← Back to Details
              </Link>
            </div>
          </div>
        </form>

        {submitted && (
          <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Pre-alert request updated and re-submitted successfully.</span>
            </div>
            <Link
              to={`/services/self-purchase/${formData.id}`}
              className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition"
            >
              View Details
            </Link>
          </div>
        )}

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
              <span className="font-bold text-slate-800">Air and sea selection</span> affects the shipping workflow and final freight quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfPurchaseEdit;
