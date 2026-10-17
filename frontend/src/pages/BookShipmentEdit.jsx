import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { AIR_FREIGHT_CATEGORIES, SEA_FREIGHT_CATEGORIES } from '../data/pricingData';

const initialItem = () => ({
  id: Date.now(),
  itemType: 'Products / Goods',
  itemSource: '',
  trackingNumber: '',
  sellerStoreName: '',
  productCategory: '',
  productDescription: '',
  quantity: 1,
  invoiceValue: '',
  unitPrice: '',
  packageCount: 1,
  estimatedWeight: '',
  length: '',
  width: '',
  height: '',
  hsCode: '',
  countryOfOrigin: 'Bangladesh',
  productUrl: '',
});

const SERVICE_LEVEL_OPTIONS = [
  { value: 'air', label: 'Air Freight (Express)' },
  { value: 'sea', label: 'Sea Freight (Standard)' },
];

const CUSTOMER_TYPE_OPTIONS = [
  'E-commerce Merchant Importer',
  'Retail Customer',
  'Commercial Import',
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

const ITEM_TYPE_OPTIONS = [
  'Products / Goods',
  'Documents',
];

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

const BookShipmentEdit = () => {
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
    () => (formData?.requestedServiceLevel === 'sea' ? SEA_FREIGHT_CATEGORIES : AIR_FREIGHT_CATEGORIES),
    [formData?.requestedServiceLevel]
  );

  const isEditable = formData ? EDITABLE_STATUSES.has(formData.status) : false;

  const loadRequest = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/book-shipment/${id}`);
      const request = res.data;
      setFormData({
        id: request.id,
        requestId: request.requestId,
        status: request.status,
        requestedServiceLevel: request.requestedServiceLevel || request.freightMode || 'air',
        freightMode: request.freightMode || 'air',
        customerType: request.customerType || 'Retail Customer',
        pickupFrom: request.pickupFrom || 'Uttara Hub, Bangladesh',
        destinationCountry: request.destinationCountry || 'United States (USA)',
        consigneeName: request.consigneeName || '',
        consigneePhone: request.consigneePhone || '',
        consigneeAddress: request.consigneeAddress || '',
        city: request.city || '',
        region: request.region || '',
        zipCode: request.zipCode || '',
        shipmentInstructions: request.shipmentInstructions || '',
        addPackageInsurance: request.addPackageInsurance || false,
        termsAccepted: request.termsAccepted || false,
        customsAccepted: request.customsAccepted || false,
        items: request.items?.length
          ? request.items.map((item) => ({
              id: item.id,
              itemType: item.itemType || 'Products / Goods',
              itemSource: item.itemSource || '',
              trackingNumber: item.trackingNumber || '',
              sellerStoreName: item.sellerStoreName || '',
              productCategory: item.productCategory || '',
              productDescription: item.productDescription || '',
              quantity: item.quantity || 1,
              invoiceValue: item.invoiceValue != null ? String(item.invoiceValue) : '',
              unitPrice: item.unitPrice != null ? String(item.unitPrice) : '',
              packageCount: item.packageCount || 1,
              estimatedWeight: item.estimatedWeight != null ? String(item.estimatedWeight) : '',
              length: item.length != null ? String(item.length) : '',
              width: item.width != null ? String(item.width) : '',
              height: item.height != null ? String(item.height) : '',
              hsCode: item.hsCode || '',
              countryOfOrigin: item.countryOfOrigin || 'Bangladesh',
              productUrl: item.productUrl || '',
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
    requestedServiceLevel: form.requestedServiceLevel || form.freightMode,
    freightMode: form.freightMode,
    customerType: form.customerType,
    pickupFrom: form.pickupFrom,
    destinationCountry: form.destinationCountry,
    consigneeName: form.consigneeName,
    consigneePhone: form.consigneePhone,
    consigneeAddress: form.consigneeAddress,
    city: form.city,
    region: form.region,
    zipCode: form.zipCode,
    shipmentInstructions: form.shipmentInstructions,
    addPackageInsurance: form.addPackageInsurance,
    termsAccepted: form.termsAccepted,
    customsAccepted: form.customsAccepted,
    items: form.items.map((item) => ({
      itemType: item.itemType || 'Products / Goods',
      itemSource: item.itemSource || '',
      trackingNumber: item.trackingNumber || '',
      sellerStoreName: item.sellerStoreName || '',
      productCategory: item.productCategory || '',
      productDescription: item.productDescription || '',
      quantity: item.quantity || 1,
      invoiceValue: item.invoiceValue || '',
      unitPrice: item.unitPrice || '',
      packageCount: item.packageCount || 1,
      estimatedWeight: item.estimatedWeight || '',
      length: item.length || '',
      width: item.width || '',
      height: item.height || '',
      hsCode: item.hsCode || '',
      countryOfOrigin: item.countryOfOrigin || '',
      productUrl: item.productUrl || '',
      invoiceFilePath: item.invoiceFilePath || null,
      packingListPath: item.packingListPath || null,
      supportingDocsPath: item.supportingDocsPath || null,
    })),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = [];

    formData.items.forEach((item, index) => {
      const label = `Item ${index + 1}`;
      if (!item.itemSource) errors.push(`${label}: Item source is required`);
      if (!item.productCategory) errors.push(`${label}: Product category is required`);
      if (!item.productDescription.trim()) errors.push(`${label}: Product description is required`);
      if (!item.quantity || item.quantity < 1) errors.push(`${label}: Quantity must be at least 1`);
    });

    if (!formData.termsAccepted) errors.push('You must accept the export rules and regulations');
    if (!formData.customsAccepted) errors.push('You must confirm items are allowed and non-hazardous');

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...buildPayload(formData), status: 'Submitted' };
      const res = await api.put(`/book-shipment/${formData.id}`, payload);
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
    await api.post(`/book-shipment/${requestDatabaseId}/files`, data, { skipToast: true });
  };

  const handleItemChange = (index, field, value) => {
    const updated = {
      ...formData,
      items: formData.items.map((entry, i) => {
        if (i !== index) return entry;
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

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addItem = () => {
    const updated = { ...formData, items: [...formData.items, initialItem()] };
    setFormData(updated);
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    const updated = { ...formData, items: formData.items.filter((_, i) => i !== index) };
    setFormData(updated);
  };

  const updateQuantity = (index, delta) => {
    const item = formData.items[index];
    const newQty = Math.max(1, Number(item.quantity || 1) + delta);
    handleItemChange(index, 'quantity', newQty);
  };

  const handleServiceLevelChange = (value) => {
    const updated = {
      ...formData,
      requestedServiceLevel: value,
      freightMode: value,
      items: formData.items.map((item) => ({ ...item, productCategory: '' })),
    };
    setFormData(updated);
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

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto max-w-4xl space-y-6">
        <nav className="text-xs text-slate-400">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/book" className="hover:underline">Export Booking</Link>
          <span className="mx-1">/</span>
          <Link to={`/services/book-shipment/${formData.id}`} className="hover:underline">{formData.requestId}</Link>
          <span className="mx-1">/</span>
          <span className="text-slate-600 font-medium">Edit</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Edit Export Booking</h1>
                <p className="text-[11px] text-slate-400 mt-0.5">{formData.requestId} • {formData.items.length} Item(s)</p>
              </div>
              <span className={`px-3 py-1 rounded text-[10px] font-bold border ${STATUS_CONFIG[formData.status]?.color || STATUS_CONFIG.Draft.color}`}>
                {formData.status}
              </span>
            </div>

            {/* Customer Type & Service Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Customer Type *</label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleFormChange}
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
                  value={formData.requestedServiceLevel}
                  onChange={(e) => handleServiceLevelChange(e.target.value)}
                  disabled={!isEditable}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                >
                  {SERVICE_LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consignee Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Consignee Name *</label>
                <input
                  type="text"
                  name="consigneeName"
                  value={formData.consigneeName}
                  onChange={handleFormChange}
                  disabled={!isEditable}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Consignee Phone *</label>
                <input
                  type="text"
                  name="consigneePhone"
                  value={formData.consigneePhone}
                  onChange={handleFormChange}
                  disabled={!isEditable}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Consignee Address *</label>
              <input
                type="text"
                name="consigneeAddress"
                value={formData.consigneeAddress}
                onChange={handleFormChange}
                disabled={!isEditable}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  disabled={!isEditable}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleFormChange}
                  disabled={!isEditable}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleFormChange}
                  disabled={!isEditable}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Dynamic Items */}
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

                {/* Item Type + Item Source side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Item Type *</label>
                    <select
                      value={item.itemType}
                      onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
                      disabled={!isEditable}
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
                      onChange={(e) => handleItemChange(index, 'itemSource', e.target.value)}
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    >
                      <option value="">Select item source</option>
                      {ITEM_SOURCE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Tracking / Order Number / Seller / Store Name</label>
                  <input
                    type="text"
                    value={item.sellerStoreName}
                    onChange={(e) => handleItemChange(index, 'sellerStoreName', e.target.value)}
                    placeholder="e.g. Order #12345 or Store Name"
                    disabled={!isEditable}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Product Description *</label>
                  <input
                    type="text"
                    value={item.productDescription}
                    onChange={(e) => handleItemChange(index, 'productDescription', e.target.value)}
                    placeholder="Detailed item description"
                    disabled={!isEditable}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                  />
                </div>

                {/* Product Category - using pricingData categories filtered by service level */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Product Category *</label>
                  <select
                    value={item.productCategory}
                    onChange={(e) => handleItemChange(index, 'productCategory', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                  >
                    <option value="">Select category</option>
                    {availableCategories.map((cat) => (
                      <option key={cat.code} value={cat.code}>{cat.code} - {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Quantity *</label>
                    <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg overflow-hidden max-w-[120px]">
                      <button type="button" onClick={() => updateQuantity(index, -1)} disabled={!isEditable} className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50">−</button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        disabled={!isEditable}
                        className="w-full text-center text-xs bg-transparent focus:outline-none font-semibold text-slate-700 disabled:bg-slate-100"
                      />
                      <button type="button" onClick={() => updateQuantity(index, 1)} disabled={!isEditable} className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50">+</button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Unit Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 250"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        disabled={!isEditable}
                        className="w-full text-xs pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Package Count</label>
                    <input
                      type="number"
                      min="1"
                      value={item.packageCount}
                      onChange={(e) => handleItemChange(index, 'packageCount', e.target.value)}
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Estimated Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10.5"
                      value={item.estimatedWeight}
                      onChange={(e) => handleItemChange(index, 'estimatedWeight', e.target.value)}
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Estimate Dimensions (cm)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="L"
                        value={item.length}
                        onChange={(e) => handleItemChange(index, 'length', e.target.value)}
                        disabled={!isEditable}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-center disabled:opacity-50"
                      />
                      <input
                        type="number"
                        placeholder="W"
                        value={item.width}
                        onChange={(e) => handleItemChange(index, 'width', e.target.value)}
                        disabled={!isEditable}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-center disabled:opacity-50"
                      />
                      <input
                        type="number"
                        placeholder="H"
                        value={item.height}
                        onChange={(e) => handleItemChange(index, 'height', e.target.value)}
                        disabled={!isEditable}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-center disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">HS Code (If known)</label>
                    <input
                      type="text"
                      value={item.hsCode}
                      onChange={(e) => handleItemChange(index, 'hsCode', e.target.value)}
                      disabled={!isEditable}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Country of Origin *</label>
                  <select
                    value={item.countryOfOrigin}
                    onChange={(e) => handleItemChange(index, 'countryOfOrigin', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="India">India</option>
                    <option value="China">China</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Product Link / URL (Optional)</label>
                  <input
                    type="url"
                    value={item.productUrl}
                    onChange={(e) => handleItemChange(index, 'productUrl', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                  />
                </div>
              </div>
            ))}

            {isEditable && (
              <button type="button" onClick={addItem} className="w-full py-2.5 bg-white border border-dashed border-[#FF5C00] text-[#FF5C00] rounded-lg text-xs font-bold hover:bg-orange-50/50 transition flex items-center justify-center gap-1">
                <span>+</span> Add Another Item
              </button>
            )}

            <div className="space-y-1 pt-2">
              <label className="text-[11px] font-bold text-slate-700">Shipment Instructions (Optional)</label>
              <textarea
                name="shipmentInstructions"
                value={formData.shipmentInstructions}
                onChange={handleFormChange}
                disabled={!isEditable}
                placeholder="Delivery notes or special packing details..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50 resize-none"
                rows="3"
              />
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-[11px] font-bold text-slate-700">HUB Delivery Slip / Receipt Upload</label>
              <label className="flex items-center justify-center gap-2 border border-slate-200 bg-slate-50 rounded-lg p-3 cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  disabled={!isEditable}
                  onChange={(e) => setNidFile(e.target.files?.[0] || null)}
                />
                <span className="text-slate-400 text-xs">PDF</span>
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
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleFormChange}
                  disabled={!isEditable}
                  className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                />
                <label className="text-xs text-slate-600 leading-snug">
                  <span className="font-bold text-slate-800">Terms Accepted</span> — I have carefully read & accepted all export rules & regulations.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="customsAccepted"
                  checked={formData.customsAccepted}
                  onChange={handleFormChange}
                  disabled={!isEditable}
                  className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                />
                <label className="text-xs text-slate-600 leading-snug">
                  I confirm that the items shipped are allowed and non-hazardous as per aviation & shipping regulations.
                </label>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="addPackageInsurance"
                  checked={formData.addPackageInsurance}
                  onChange={handleFormChange}
                  disabled={!isEditable}
                  className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">Add Package Insurance</span>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Protect your cargo against loss, theft, or damage during transit.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {isEditable && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-5 py-2.5 bg-[#FF5C00] hover:bg-[#E05100] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Booking'}
                </button>
              )}
              <Link
                to={`/services/book-shipment/${formData.id}`}
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
              <span>Export booking updated and re-submitted successfully.</span>
            </div>
            <Link
              to={`/services/book-shipment/${formData.id}`}
              className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookShipmentEdit;
