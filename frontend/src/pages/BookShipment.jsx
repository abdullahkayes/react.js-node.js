import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  invoiceFile: null,
  packingListFile: null,
  supportingDocs: null,
});

const initialFormState = () => ({
  status: 'Draft',
  requestedServiceLevel: 'air',
  freightMode: 'air',
  customerType: 'Retail Customer',
  pickupFrom: 'Uttara Hub, Bangladesh',
  destinationCountry: 'United States (USA)',
  consigneeName: '',
  consigneePhone: '+880 1700 000000',
  consigneeAddress: '',
  city: '',
  region: '',
  zipCode: '',
  shipmentInstructions: '',
  addPackageInsurance: true,
  termsAccepted: false,
  customsAccepted: false,
  items: [initialItem()],
});

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

const SERVICE_LEVEL_OPTIONS = [
  { value: 'air', label: 'Air Freight' },
  { value: 'sea', label: 'Sea / Ocean Freight' },
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

const BookShipment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [nidFile, setNidFile] = useState(null);

  const availableCategories = useMemo(
    () => (formData.requestedServiceLevel === 'air' ? AIR_FREIGHT_CATEGORIES : SEA_FREIGHT_CATEGORIES),
    [formData.requestedServiceLevel]
  );

  const loadAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      if (res.data && res.data.length > 0) {
        const defaultAddr = res.data[0];
        setFormData((prev) => ({
          ...prev,
          consigneeName: defaultAddr.fullName || '',
          consigneePhone: defaultAddr.phone || prev.consigneePhone,
          consigneeAddress: defaultAddr.addressLine1 || '',
          city: defaultAddr.city || '',
          region: defaultAddr.state || '',
          zipCode: defaultAddr.postalCode || '',
        }));
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const loadDraft = async () => {
    try {
      const res = await api.get('/book-shipment', { params: { status: 'Draft' } });
      const savedDraft = res.data.requests?.[0] || res.data?.[0];
      if (savedDraft && savedDraft.status === 'Draft') {
        setDraftId(savedDraft.id);
        setFormData({
          status: savedDraft.status,
          requestedServiceLevel: savedDraft.requestedServiceLevel || savedDraft.freightMode || 'air',
          freightMode: savedDraft.freightMode || 'air',
          customerType: savedDraft.customerType || 'Retail Customer',
          pickupFrom: savedDraft.pickupFrom || 'Uttara Hub, Bangladesh',
          destinationCountry: savedDraft.destinationCountry || 'United States (USA)',
          consigneeName: savedDraft.consigneeName || '',
          consigneePhone: savedDraft.consigneePhone || '',
          consigneeAddress: savedDraft.consigneeAddress || '',
          city: savedDraft.city || '',
          region: savedDraft.region || '',
          zipCode: savedDraft.zipCode || '',
          shipmentInstructions: savedDraft.shipmentInstructions || '',
          addPackageInsurance: savedDraft.addPackageInsurance || false,
          termsAccepted: savedDraft.termsAccepted || false,
          customsAccepted: savedDraft.customsAccepted || false,
          items: savedDraft.items?.length
            ? savedDraft.items.map((item) => ({
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
                invoiceFile: null,
                packingListFile: null,
                supportingDocs: null,
              }))
            : [initialItem()],
        });
      }
    } catch (err) {
      console.error('Error loading draft:', err);
    }
  };

  const loadRecent = async () => {
    setLoadingRecent(true);
    try {
      const res = await api.get('/book-shipment/recent');
      setRecentRequests((res.data || []).map((request) => ({
        id: request.requestId,
        databaseId: request.id,
        status: request.status,
        items: request.items?.length || 0,
        total: request.items?.reduce((sum, item) => sum + Number(item.invoiceValue || 0), 0),
        date: new Date(request.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        destination: request.destinationCountry || '—',
      })));
     } catch (err) {
      console.error('Error loading recent bookings:', err);
      setRecentRequests([]);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    loadAddresses();
    loadDraft();
    loadRecent();
  }, []);

  const [recentRequests, setRecentRequests] = useState([]);

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
    confirmTerms: form.termsAccepted && form.customsAccepted,
    items: form.items.map((item) => ({
      itemType: item.itemType || 'Products / Goods',
      itemSource: item.itemSource || '',
      trackingNumber: item.trackingNumber || '',
      sellerStoreName: item.sellerStoreName || '',
      productCategory: item.productCategory || '',
      productDescription: item.productDescription || '',
      quantity: item.quantity || 1,
      invoiceValue: item.invoiceValue || 0,
      unitPrice: item.unitPrice || null,
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

  const calculateQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const totalWeight = formData.items.reduce(
        (sum, item) => sum + (parseFloat(item.estimatedWeight) || 0),
        0
      );
      const res = await api.post('/quotes', {
        originCountry: 'Bangladesh',
        destinationCountry: formData.destinationCountry,
        weightKg: totalWeight || 1,
        serviceType: formData.requestedServiceLevel || formData.freightMode,
      });
      setQuote(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate quote');
    } finally {
      setLoading(false);
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
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

    setLoading(true);
    setError('');
    try {
      const payload = { ...buildPayload(formData), status: 'Submitted' };
      let saved;

      if (draftId) {
        const res = await api.put(`/book-shipment/${draftId}`, payload);
        saved = res.data;
      } else {
        const res = await api.post('/book-shipment', payload);
        saved = res.data;
      }

      setDraftId(saved.id);
      setFormData((prev) => ({
        ...prev,
        status: 'Submitted',
        submittedAt: saved.submittedAt || new Date().toISOString(),
      }));
      setSubmitted(true);
      await loadRecent();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book shipment');
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
        await api.put(`/book-shipment/${draftId}`, payload, config);
      } else {
        const res = await api.post('/book-shipment', payload, config);
        setDraftId(res.data.id);
      }
    } catch (err) {
      return;
    }
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
    if (formData.status === 'Draft') handleAutoSave(updated);
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
    if (formData.status === 'Draft') handleAutoSave(updated);
  };

  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    const updated = { ...formData, items: formData.items.filter((_, i) => i !== index) };
    setFormData(updated);
    if (formData.status === 'Draft') handleAutoSave(updated);
  };

  const updateQuantity = (index, delta) => {
    const item = formData.items[index];
    const newQty = Math.max(1, (Number(item.quantity) || 1) + delta);
    handleItemChange(index, 'quantity', newQty);
  };

  const totalDeclaredValue = formData.items.reduce(
    (sum, item) => sum + (parseFloat(item.invoiceValue) || 0),
    0
  );

  const handleServiceLevelChange = (value) => {
    const updated = {
      ...formData,
      requestedServiceLevel: value,
      freightMode: value,
      items: formData.items.map((item) => ({ ...item, productCategory: '' })),
    };
    setFormData(updated);
    if (formData.status === 'Draft') handleAutoSave(updated);
  };

  const handleResetInternal = () => {
    if (window.confirm('Reset will clear all entered data. Continue?')) {
      setFormData(initialFormState());
      setDraftId(null);
      setNidFile(null);
      setSubmitted(false);
      setQuote(null);
      setError('');
    }
  };

  const handleCreateNew = () => {
    setFormData(initialFormState());
    setDraftId(null);
    setNidFile(null);
    setSubmitted(false);
    setQuote(null);
    setError('');
  };

  const handleCancelRecent = async (databaseId, displayId) => {
    if (!window.confirm(`Cancel export booking ${displayId}?`)) return;
    try {
      await api.put(`/book-shipment/${databaseId}/cancel`);
      setRecentRequests((prev) =>
        prev.map((entry) => (entry.databaseId === databaseId ? { ...entry, status: 'Cancelled' } : entry))
      );
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  const canEdit = (status) => EDITABLE_STATUSES.has(status);
  const canCancel = (status) => !['Approved', 'Rejected', 'Cancelled'].includes(status);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-700 font-sans antialiased py-8 px-2 sm:px-2 lg:px-2">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Export Booking</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Book export shipment from your doorstep or delivery hub to international destinations safely & easily.
          </p>
        </div>

        {/* Top 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <span className="text-base">✓</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Door Pickup to Worldwide</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Pick up from your doorstep and deliver worldwide.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <span className="text-base">✈</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Air & Sea Freight</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Best rates for bulk & heavy shipments worldwide.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <span className="text-base">?</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Special Handling</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Customized logistics solutions for businesses.</p>
            </div>
          </div>
        </div>

        {/* Draft Status Banner */}
        {formData.status === 'Draft' && (
          <div className="bg-blue-50 border border-blue-200/50 rounded-xl p-3 flex items-center gap-2 text-xs text-blue-800">
            <span className="text-blue-500 font-bold">i</span>
            You are editing a <strong>Draft</strong> export booking. Your progress is auto-saved. Submit to send for review.
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Workflow & Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* How Booking Works */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-900">How Export Booking Works</h2>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                {[
                  ['1', 'Arrange Delivery to Uttara Hub'],
                  ['2', 'Submit Export Booking Request'],
                  ['3', 'Make Inspection & Verify'],
                  ['4', 'We Weigh & Calculate Bill'],
                  ['5', 'Invoice & Make Payment'],
                  ['6', 'Online Dispatch'],
                ].map(([number, title]) => (
                  <div key={title} className="space-y-1.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-orange-500 mx-auto flex items-center justify-center text-xs font-bold">{number}</div>
                    <p className="text-[10px] font-bold text-slate-800">{title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={submitBooking}>
              <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900">
                    {formData.status === 'Draft' ? 'Submit Export Booking Request' : 'Booking Submitted'}
                  </h2>
                  {formData.status !== 'Draft' && (
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${STATUS_CONFIG[formData.status]?.color || STATUS_CONFIG.Draft.color}`}>
                      {formData.status}
                    </span>
                  )}
                </div>

                {/* Pickup & Destination Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Pickup Location *</label>
                    <select
                      name="pickupFrom"
                      value={formData.pickupFrom}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    >
                      <option value="Uttara Hub, Bangladesh">Delivery to Uttara Hub</option>
                      <option value="Dhanmondi Hub, Bangladesh">Delivery to Dhanmondi Hub</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Destination Country *</label>
                    <select
                      name="destinationCountry"
                      value={formData.destinationCountry}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    >
                      <option value="United States (USA)">United States (USA)</option>
                      <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
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
                      placeholder="e.g. John Doe"
                      value={formData.consigneeName}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Consignee Phone *</label>
                    <input
                      type="text"
                      name="consigneePhone"
                      placeholder="+880 1700 000000"
                      value={formData.consigneePhone}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Consignee Street Address *</label>
                  <input
                    type="text"
                    name="consigneeAddress"
                    placeholder="Street Address, Apt, Suite, Unit"
                    value={formData.consigneeAddress}
                    onChange={handleFormChange}
                    disabled={formData.status !== 'Draft'}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. New York"
                      value={formData.city}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Region *</label>
                    <input
                      type="text"
                      name="region"
                      placeholder="State / Region"
                      value={formData.region}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="e.g. 10001"
                      value={formData.zipCode}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Shipment Instructions (Optional)</label>
                  <input
                    type="text"
                    name="shipmentInstructions"
                    placeholder="Delivery notes or special packing details..."
                    value={formData.shipmentInstructions}
                    onChange={handleFormChange}
                    disabled={formData.status !== 'Draft'}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                  />
                </div>

                {/* Preferred Freight Mode */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Preferred Freight Mode *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.requestedServiceLevel === 'air'
                        ? 'border-orange-500 bg-orange-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="requestedServiceLevel"
                        value="air"
                        checked={formData.requestedServiceLevel === 'air'}
                        onChange={() => handleServiceLevelChange('air')}
                        disabled={formData.status !== 'Draft'}
                        className="mt-0.5 text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                      />
                      <div className="ml-2">
                        <span className="text-xs font-bold text-slate-900">Air Freight</span>
                        <p className="text-[10px] text-slate-500">Faster transit (5-7 business days).</p>
                      </div>
                    </label>
                    <label className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.requestedServiceLevel === 'sea'
                        ? 'border-blue-500 bg-blue-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="requestedServiceLevel"
                        value="sea"
                        checked={formData.requestedServiceLevel === 'sea'}
                        onChange={() => handleServiceLevelChange('sea')}
                        disabled={formData.status !== 'Draft'}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <div className="ml-2">
                        <span className="text-xs font-bold text-slate-900">Sea / Ocean Freight</span>
                        <p className="text-[10px] text-slate-500">Economical for large bulk shipments.</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Package Insurance */}
                <div className="bg-orange-50/40 border border-orange-200 rounded-xl p-4">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="addPackageInsurance"
                      checked={formData.addPackageInsurance}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900">Add Package Insurance</span>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        Protect your cargo against loss, theft, or damage during transit with full value coverage.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Dynamic Items Form */}
                {formData.items.map((item, index) => (
                  <div key={item.id} className="border border-slate-200 rounded-xl p-5 mb-6 bg-white relative">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">Item {index + 1}</h3>
                    </div>

                    {/* Item Type + Item Source side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Item Type *</label>
                        <select
                          value={item.itemType}
                          onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
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
                          onChange={(e) => handleItemChange(index, 'itemSource', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        >
                          <option value="">Select item source</option>
                          {ITEM_SOURCE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Tracking / Seller Store Name */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Tracking / Order Number / Seller / Store Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Order #12345 or Store Name"
                        value={item.sellerStoreName}
                        onChange={(e) => handleItemChange(index, 'sellerStoreName', e.target.value)}
                        disabled={formData.status !== 'Draft'}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                      />
                    </div>

                    {/* Product Description */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Product Description *</label>
                      <input
                        type="text"
                        placeholder="Detailed item description"
                        value={item.productDescription}
                        onChange={(e) => handleItemChange(index, 'productDescription', e.target.value)}
                        disabled={formData.status !== 'Draft'}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                      />
                    </div>

                    {/* Product Category - using pricingData categories filtered by service level */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Product Category *</label>
                      <select
                        value={item.productCategory}
                        onChange={(e) => handleItemChange(index, 'productCategory', e.target.value)}
                        disabled={formData.status !== 'Draft'}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                      >
                        <option value="">Select category</option>
                        {availableCategories.map((cat) => (
                          <option key={cat.code} value={cat.code}>
                            {cat.code} - {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity, Invoice Value, Package Count, Estimated Weight */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Quantity *</label>
                        <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg overflow-hidden max-w-[120px]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(index, -1)}
                            disabled={formData.status !== 'Draft'}
                            className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                            disabled={formData.status !== 'Draft'}
                            className="w-full text-center text-xs bg-transparent focus:outline-none font-semibold text-slate-700 disabled:bg-slate-100"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(index, 1)}
                            disabled={formData.status !== 'Draft'}
                            className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Unit Price (USD)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g. 250"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                            disabled={formData.status !== 'Draft'}
                            className="w-full text-xs pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Package Count *</label>
                        <input
                          type="number"
                          min="1"
                          value={item.packageCount}
                          onChange={(e) => handleItemChange(index, 'packageCount', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">Estimated Weight (kg) *</label>
                        <input
                          type="number"
                          placeholder="e.g. 10.5"
                          value={item.estimatedWeight}
                          onChange={(e) => handleItemChange(index, 'estimatedWeight', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Auto-calculated Invoice Value */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Invoice Value (USD)</label>
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

                    {/* Dimensions & HS Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Estimate Dimensions (cm)</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            placeholder="L"
                            value={item.length}
                            onChange={(e) => handleItemChange(index, 'length', e.target.value)}
                            disabled={formData.status !== 'Draft'}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-center disabled:opacity-50"
                          />
                          <input
                            type="number"
                            placeholder="W"
                            value={item.width}
                            onChange={(e) => handleItemChange(index, 'width', e.target.value)}
                            disabled={formData.status !== 'Draft'}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-center disabled:opacity-50"
                          />
                          <input
                            type="number"
                            placeholder="H"
                            value={item.height}
                            onChange={(e) => handleItemChange(index, 'height', e.target.value)}
                            disabled={formData.status !== 'Draft'}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-center disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">HS Code (If known)</label>
                        <input
                          type="text"
                          placeholder="e.g. 6109.10"
                          value={item.hsCode}
                          onChange={(e) => handleItemChange(index, 'hsCode', e.target.value)}
                          disabled={formData.status !== 'Draft'}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Country of Origin */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Country of Origin *</label>
                      <select
                        value={item.countryOfOrigin}
                        onChange={(e) => handleItemChange(index, 'countryOfOrigin', e.target.value)}
                        disabled={formData.status !== 'Draft'}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                      >
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="India">India</option>
                        <option value="China">China</option>
                      </select>
                    </div>

                    {/* Product URL */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Product Link / URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://example.com/product"
                        value={item.productUrl}
                        onChange={(e) => handleItemChange(index, 'productUrl', e.target.value)}
                        disabled={formData.status !== 'Draft'}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 disabled:opacity-50"
                      />
                    </div>

                    {/* File Upload Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50">
                        <label className="block text-xs font-medium text-slate-600">
                          Invoice / Value Declaration *
                          <div className="flex items-center justify-center gap-1 mt-1.5 text-xs text-slate-500">
                            <span>Upload PDF / JPG / PNG</span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleItemChange(index, 'invoiceFile', e.target.files[0])}
                            disabled={formData.status !== 'Draft'}
                          />
                        </label>
                      </div>
                      <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50">
                        <label className="block text-xs font-medium text-slate-600">
                          Packing List / Contents List
                          <div className="flex items-center justify-center gap-1 mt-1.5 text-xs text-slate-500">
                            <span>Upload PDF / JPG / PNG</span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleItemChange(index, 'packingListFile', e.target.files[0])}
                            disabled={formData.status !== 'Draft'}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Supporting Docs */}
                    <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50">
                      <label className="block text-xs font-medium text-slate-600">
                        Custom, Brand Authorization or Other Supporting Documents
                        <div className="flex items-center justify-center gap-1 mt-1.5 text-xs text-slate-500">
                          <span>Upload PDF / JPG / PNG</span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleItemChange(index, 'supportingDocs', e.target.files[0])}
                          disabled={formData.status !== 'Draft'}
                        />
                      </label>
                    </div>
                  </div>
                ))}

                {/* Add Another Item Button */}
                {formData.status === 'Draft' && (
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full py-2.5 bg-orange-600 text-white border border-dashed border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-orange-600 flex items-center justify-center gap-1 mb-6"
                  >
                   +Add Another Item
                  </button>
                )}

                {/* Payment Receipt Upload */}
                <div className="mb-6">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    HUB Delivery Slip / Receipt Upload
                  </label>
                  <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center bg-slate-50">
                    <label className="cursor-pointer">
                      <span className="text-xs text-slate-500">Upload PDF / JPG / PNG</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setNidFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                {/* T&C Checkboxes */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                    />
                    <span>I have carefully read & accepted all export rules & regulations.</span>
                  </label>
                  <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="customsAccepted"
                      checked={formData.customsAccepted}
                      onChange={handleFormChange}
                      disabled={formData.status !== 'Draft'}
                      className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                    />
                    <span>
                      I confirm that the items shipped are allowed and non-hazardous as per aviation & shipping regulations.
                    </span>
                  </label>
                </div>

                {/* Submit & Calculate Quote */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={calculateQuote}
                    className="px-4 py-3 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition"
                  >
                    {loading ? 'Calculating...' : 'Calculate Quote'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.termsAccepted || !formData.customsAccepted}
                    className="flex-1 py-3 bg-orange-600 text-white font-bold text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 transition shadow-md shadow-orange-600/20"
                  >
                    {loading ? 'Submitting...' : 'Submit Export Booking'}
                  </button>
                </div>

                {/* Messages */}
                {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}
                {quote && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                    Estimated Quote Price: <strong>{quote.price} {quote.currency}</strong> ({quote.estimatedDays || '5-7'} days delivery)
                  </div>
                )}
              </div>
            </form>

            {/* Success Message */}
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Export booking submitted successfully.</span>
                </div>
                <div className="flex items-center gap-2">
                  {draftId && (
                    <Link
                      to={`/services/book-shipment/${draftId}`}
                      className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition"
                    >
                      View Details
                    </Link>
                  )}
                  <button type="button" onClick={handleCreateNew} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg hover:bg-emerald-50 transition">
                    Create New Booking
                  </button>
                </div>
              </div>
            )}

            {/* Policy Banner */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-blue-900">
              <span className="text-blue-600 font-bold">i</span>
              <div className="space-y-1">
                <h4 className="font-bold">Important Export Payment & Policy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-blue-800 text-[11px]">
                  <p>• Final bill will be issued after physical weight and dimension check at our central hub.</p>
                  <p>• Customs duty and destination local taxes are subject to local country rules.</p>
                  <p>• Upload valid commercial invoices to prevent customs processing delays.</p>
                  <p>• Cancelations are allowed before final dispatch scan at the warehouse.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Guidelines Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                Export and Legal Guidelines
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Kindly approve listed items & compliant shipment rules prior to pickup.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Non-compliant or dangerous items may be delayed or cancelled.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Accurate package dimensions ensure smooth handling across hubs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Provide clear invoices and packing lists for quick customs clearance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Read full terms and conditions for prohibited goods & liabilities.</span>
                </li>
              </ul>
            </div>

            {/* Recent Export Bookings */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Export Bookings
                </h3>
              </div>

              {loadingRecent ? (
                <p className="text-[11px] text-slate-400">Loading bookings…</p>
              ) : recentRequests.length === 0 ? (
                <p className="text-[11px] text-slate-400">No recent export bookings.</p>
              ) : (
                <div className="space-y-4 text-xs">
                  {recentRequests.map((booking) => (
                    <div key={booking.databaseId} className="border border-slate-100 bg-slate-50/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900">{booking.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_CONFIG[booking.status]?.color || STATUS_CONFIG.Draft.color}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">To: {booking.destination}</p>
                      <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
                        <span>{booking.items} x Package</span>
                        <span>${booking.total?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-end mt-2">
                        <Link to={`/services/book-shipment/${booking.databaseId}`} className="hover:text-blue-600">Details</Link>
                        {canEdit(booking.status) && (
                          <>
                            <span>•</span>
                            <Link to={`/services/book-shipment/${booking.databaseId}/edit`} className="hover:text-blue-600">Edit</Link>
                          </>
                        )}
                        {canCancel(booking.status) && (
                          <>
                            <span>•</span>
                            <button type="button" onClick={() => handleCancelRecent(booking.databaseId, booking.id)} className="hover:text-rose-600 hover:underline">Cancel</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleCreateNew}
                className="w-full mt-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1"
              >
                Create New Export Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookShipment;
