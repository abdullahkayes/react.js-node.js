import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import StatusBadge from '../components/StatusBadge.jsx';
import ShipmentTimeline from '../components/ShipmentTimeline.jsx';
import DocumentsModal from '../components/DocumentsModal.jsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.jsx';

const mockShipmentDetails = {
  '250514': {
    id: 250514,
    shipmentId: 'SHP-250514',
    trackingNumber: 'DS458912',
    status: 'In International Transit',
    serviceType: 'express',
    serviceMode: 'Import',
    purchaseType: 'Self-Purchase',
    mode: 'Import',
    weightKg: '3.5',
    declaredValue: '120',
    currency: 'USD',
    price: '45.99',
    paymentStatus: 'paid',
    createdAt: '2025-07-10T08:30:00+06:00',
    updatedAt: '2025-07-15T16:20:00+06:00',
    origin: 'US USA Warehouse',
    destination: 'BD Dhaka, Bangladesh',
    sender: { fullName: 'Sheikh Sadi', addressLine1: '14 Lewis Place, Suite 8', city: 'Brooklyn', state: 'NY', postalCode: '11218', country: 'USA', phone: '+1 (212) 555-0123' },
    receiver: { fullName: 'Md. Rahim Uddin', addressLine1: 'House 12, Road 45, Banani', city: 'Dhaka', state: '', postalCode: '1213', country: 'Bangladesh', phone: '+880 17XXXXXXXX' },
    items: [
      { id: 1, description: 'Wireless Earbuds', quantity: 2, unitPrice: '15.00', totalPrice: '30.00', category: 'Electronics' },
      { id: 2, description: 'Phone Case', quantity: 1, unitPrice: '3.50', totalPrice: '3.50', category: 'Accessories' },
    ],
    invoices: [
      {
        id: 1,
        invoice_id: 'INV-001',
        createdAt: '2025-07-15T10:00:00+06:00',
        total: '55.00',
        currency: 'USD',
        items: [
          { description: 'Shipping Fee', quantity: 1, unitPrice: '45.99', total: '45.99' },
          { description: 'Customs Duty', quantity: 1, unitPrice: '9.01', total: '9.01' },
        ],
      },
    ],
    payments: [
      { id: 1, amount: '55.00', currency: 'USD', status: 'completed', provider: 'stripe', createdAt: '2025-07-15T11:00:00+06:00' },
    ],
    documents: [
      { id: 1, fileName: 'Commercial Invoice.pdf', documentType: 'commercial_invoice', filePath: '/uploads/commercial-invoice-1.pdf', createdAt: '2025-07-12T10:00:00+06:00', fileSize: 256000 },
      { id: 2, fileName: 'Packing List.pdf', documentType: 'packing_list', filePath: '/uploads/packing-list-1.pdf', createdAt: '2025-07-12T10:00:00+06:00', fileSize: 128000 },
    ],
    returnsRTO: [],
    insurances: [
      {
        id: 1,
        insuranceId: 'INS-2025-001',
        provider: 'Dazzling Insurance',
        status: 'active',
        coverageAmount: '120.00',
        premium: '5.99',
        currency: 'USD',
        startDate: '2025-07-10',
        endDate: '2025-10-10',
        eligibleItems: ['Electronics', 'Accessories'],
        excludedItems: ['Documents', 'Perishable Goods'],
      },
    ],
    trackingEvents: [
      { id: 1, status: 'Under Review', createdAt: '2025-07-08T08:30:00+06:00', location: 'System', note: 'Self-purchase request submitted' },
      { id: 2, status: 'Approved', createdAt: '2025-07-09T10:00:00+06:00', location: 'System', note: 'Request approved by admin' },
      { id: 3, status: 'Awaiting Carrier Tracking', createdAt: '2025-07-10T08:30:00+06:00', location: 'USA', note: 'Shipment request converted to shipment' },
      { id: 4, status: 'Awaiting Arrival at USA Warehouse', createdAt: '2025-07-11T14:15:00+06:00', location: 'USA Warehouse', note: 'Items purchased and picked up' },
      { id: 5, status: 'Shipped', createdAt: '2025-07-12T09:00:00+06:00', location: 'USA Warehouse', note: 'Shipment departed from warehouse' },
      { id: 6, status: 'In International Transit', createdAt: '2025-07-13T11:45:00+06:00', location: 'US Port', note: 'In international transit' },
      { id: 7, status: 'Customs Clearance in Progress', createdAt: '2025-07-15T16:20:00+06:00', location: 'Bangladesh Customs', note: 'Arrived and under customs clearance' },
    ],
    exchangeRate: { usdToBdt: 103.5 },
  },
  '250521': {
    id: 250521,
    shipmentId: 'SHP-250521',
    trackingNumber: 'DS458913',
    status: 'Received at USA Warehouse',
    serviceType: 'standard',
    serviceMode: 'Export',
    purchaseType: 'N/A',
    mode: 'Export',
    weightKg: '1.2',
    declaredValue: '50',
    currency: 'USD',
    price: '28.50',
    paymentStatus: 'unpaid',
    createdAt: '2025-07-10T08:30:00+06:00',
    updatedAt: '2025-07-12T09:00:00+06:00',
    origin: 'BD Chittagong Port, Bangladesh',
    destination: 'US USA Warehouse',
    sender: { fullName: 'Md. Rahim Uddin', addressLine1: 'House 12, Road 45, Banani', city: 'Dhaka', state: '', postalCode: '1213', country: 'Bangladesh', phone: '+880 17XXXXXXXX' },
    receiver: { fullName: 'Sheikh Sadi', addressLine1: '14 Lewis Place, Suite 8', city: 'Brooklyn', state: 'NY', postalCode: '11218', country: 'USA', phone: '+1 (212) 555-0123' },
    items: [
      { id: 1, description: 'Legal Documents', quantity: 1, unitPrice: '0', totalPrice: '0', category: 'Documents' },
    ],
    invoices: [],
    payments: [],
    documents: [],
    returnsRTO: [],
    insurances: [],
    trackingEvents: [
      { id: 1, status: 'Under Review', createdAt: '2025-07-08T08:30:00+06:00', location: 'System', note: 'Export booking request submitted' },
      { id: 2, status: 'Approved', createdAt: '2025-07-09T10:00:00+06:00', location: 'System', note: 'Request approved by admin' },
      { id: 3, status: 'Awaiting Carrier Tracking', createdAt: '2025-07-10T08:30:00+06:00', location: 'Bangladesh', note: 'Shipment request converted to shipment' },
      { id: 4, status: 'Received at USA Warehouse', createdAt: '2025-07-11T14:15:00+06:00', location: 'USA Warehouse', note: 'Shipment arrived at USA Warehouse' },
    ],
    exchangeRate: { usdToBdt: 103.5 },
  },
  '250487': {
    id: 250487,
    shipmentId: 'SHP-250487',
    trackingNumber: 'DS458877',
    status: 'Customs Clearance in Progress',
    serviceType: 'express',
    serviceMode: 'Import',
    purchaseType: 'Self-Purchase',
    mode: 'Import',
    weightKg: '5.8',
    declaredValue: '250',
    currency: 'USD',
    price: '89.99',
    paymentStatus: 'paid',
    createdAt: '2025-07-10T08:30:00+06:00',
    updatedAt: '2025-07-15T16:20:00+06:00',
    origin: 'US USA Warehouse',
    destination: 'BD Chittagong Port, Bangladesh',
    sender: { fullName: 'Sheikh Sadi', addressLine1: '14 Lewis Place, Suite 8', city: 'Brooklyn', state: 'NY', postalCode: '11218', country: 'USA', phone: '+1 (212) 555-0123' },
    receiver: { fullName: 'Md. Rahim Uddin', addressLine1: 'House 12, Road 45, Banani', city: 'Dhaka', state: '', postalCode: '1213', country: 'Bangladesh', phone: '+880 17XXXXXXXX' },
    items: [
      { id: 1, description: 'Gaming Mouse', quantity: 3, unitPrice: '25.00', totalPrice: '75.00', category: 'Electronics' },
    ],
    invoices: [
      {
        id: 1,
        invoice_id: 'INV-002',
        createdAt: '2025-07-15T10:00:00+06:00',
        total: '95.00',
        currency: 'USD',
        items: [
          { description: 'Shipping Fee', quantity: 1, unitPrice: '79.99', total: '79.99' },
          { description: 'Customs Duty', quantity: 1, unitPrice: '15.01', total: '15.01' },
        ],
      },
    ],
    payments: [
      { id: 1, amount: '95.00', currency: 'USD', status: 'completed', provider: 'bKash', createdAt: '2025-07-15T11:00:00+06:00' },
    ],
    documents: [
      { id: 1, fileName: 'Invoice_002.pdf', documentType: 'invoice', filePath: '/uploads/invoice-002.pdf', createdAt: '2025-07-15T10:00:00+06:00', fileSize: 180000 },
    ],
    returnsRTO: [],
    insurances: [],
    trackingEvents: [
      { id: 1, status: 'Under Review', createdAt: '2025-07-08T08:30:00+06:00', location: 'System', note: 'Self-purchase request submitted' },
      { id: 2, status: 'Approved', createdAt: '2025-07-09T10:00:00+06:00', location: 'System', note: 'Request approved by admin' },
      { id: 3, status: 'Shipped', createdAt: '2025-07-10T08:30:00+06:00', location: 'USA', note: 'Shipment dispatched' },
      { id: 4, status: 'In International Transit', createdAt: '2025-07-13T11:45:00+06:00', location: 'US Port', note: 'In international transit' },
      { id: 5, status: 'Customs Clearance in Progress', createdAt: '2025-07-15T16:20:00+06:00', location: 'Bangladesh Customs', note: 'Under customs clearance' },
    ],
    exchangeRate: { usdToBdt: 103.5 },
  },
};

const getMockShipment = (id) => {
  const key = String(id);
  return mockShipmentDetails[key] || mockShipmentDetails['250514'];
};

const WAREHOUSE_ARRIVAL_STATUSES = [
  'Received at USA Warehouse',
  'Received at Dhaka Hub',
];

const canCancelShipment = (status) => {
  return !WAREHOUSE_ARRIVAL_STATUSES.includes(status) &&
         !['Delivered', 'Cancelled', 'Disposed', 'Seized'].includes(status);
};

const ShipmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const transformApiData = (apiData) => {
    if (!apiData) return null;

    const isImportMode = apiData.serviceMode === 'Import';
    const isExportMode = apiData.serviceMode === 'Export';

    const serviceMode = apiData.serviceMode || (apiData.receiver?.country === 'USA' ? 'Export' : 'Import');
    const purchaseType = apiData.purchaseType || (isExportMode ? 'N/A' : (apiData.purchaseType || 'Self-Purchase'));

    const origin = isExportMode || apiData.sender?.country === 'Bangladesh'
      ? (apiData.origin || 'Bangladesh')
      : (apiData.origin || 'USA');
    const destination = isExportMode || apiData.sender?.country === 'Bangladesh'
      ? (apiData.destination || 'USA')
      : (apiData.destination || 'Bangladesh');

    return {
      id: apiData.id,
      shipmentId: apiData.shipmentId || `SHP-${apiData.id}`,
      trackingNumber: apiData.trackingNumber,
      status: apiData.status,
      serviceType: apiData.serviceType,
      serviceMode: serviceMode,
      mode: serviceMode,
      purchaseType: purchaseType,
      weightKg: apiData.weightKg,
      declaredValue: apiData.declaredValue,
      currency: apiData.currency || 'USD',
      price: apiData.price,
      paymentStatus: apiData.paymentStatus || (apiData.payments && apiData.payments.length > 0
        ? apiData.payments[0].status
        : 'unpaid'),
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
      origin: origin,
      destination: destination,
      sender: apiData.sender,
      receiver: apiData.receiver,
      items: apiData.items || [],
      invoices: apiData.invoices || [],
      payments: apiData.payments || [],
      documents: apiData.documents || [],
      returnsRTO: apiData.returnsRTOs || [],
      insurances: apiData.insurances || [],
      trackingEvents: apiData.trackingEvents || [],
      exchangeRate: apiData.exchangeRate || { usdToBdt: 103.5 },
    };
  };

  useEffect(() => {
    const loadShipment = async () => {
      try {
        const res = await api.get(`/shipments/${id}`);
        if (res.data && Object.keys(res.data).length > 0) {
          setShipment(transformApiData(res.data));
        } else {
          setShipment(getMockShipment(id));
        }
      } catch (err) {
        setShipment(getMockShipment(id));
      } finally {
        setLoading(false);
      }
    };
    loadShipment();
  }, [id]);

  const exchangeRate = shipment?.exchangeRate?.usdToBdt || 103.5;

  const calculateTotalUSD = () => {
    if (!shipment?.invoices || shipment.invoices.length === 0) return 0;
    return shipment.invoices.reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0);
  };

  const calculatePaidAmountUSD = () => {
    if (!shipment?.payments || shipment.payments.length === 0) return 0;
    return shipment.payments
      .filter(p => p.status === 'completed' || p.status === 'partially_refunded')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0) * (p.currency === 'USD' ? 1 : 1 / exchangeRate), 0);
  };

  const handleCancelShipment = async () => {
    try {
      setCancelConfirmOpen(false);
      await api.put(`/shipments/${id}/cancel`);
      setShipment(prev => ({ ...prev, status: 'Cancelled' }));
      alert('Shipment has been cancelled successfully.');
    } catch (err) {
      console.error('Failed to cancel shipment:', err);
      alert('Failed to cancel shipment. Please try again.');
    }
  };

  const handleViewDetails = (requestId, type) => {
    const typeMap = {
      self: `/services/self-purchase/${requestId}`,
      assisted: `/services/assisted-purchase/${requestId}`,
      export: `/book-shipment/${requestId}`,
    };
    navigate(typeMap[type] || `/services/self-purchase/${requestId}`);
  };

  const handleDownloadDocument = (doc) => {
    window.open(doc.filePath || doc.fileDownloadUrl, '_blank');
  };

  const handleDownloadSummary = () => {
    alert('Download Summary PDF feature will be implemented soon. A sample PDF will be generated with this page\'s data.');
  };

  const formatCurrency = (amount, currency) => {
    const numAmount = parseFloat(amount || 0);
    return currency === 'USD'
      ? `$${numAmount.toFixed(2)}`
      : `৳${numAmount.toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-6">
            <Link to="/my-shipments" className="text-sm text-slate-500 hover:text-slate-800 font-medium">← Back to My Shipments</Link>
          </div>
          <LoadingSkeleton rows={8} />
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-6">
            <Link to="/my-shipments" className="text-sm text-slate-500 hover:text-slate-800 font-medium">← Back to My Shipments</Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <p className="text-slate-500">Shipment not found</p>
          </div>
        </div>
      </div>
    );
  }

  const isImport = shipment.serviceMode === 'Import' || shipment.mode === 'Import';
  const displayOrigin = shipment.origin || (isImport ? 'USA' : 'Bangladesh');
  const displayDestination = shipment.destination || (isImport ? 'Bangladesh' : 'USA');

  const totalUSD = calculateTotalUSD();
  const totalBDT = (totalUSD * exchangeRate).toFixed(2);
  const paidUSD = calculatePaidAmountUSD();
  const paidBDT = (paidUSD * exchangeRate).toFixed(2);
  const dueUSD = Math.max(0, totalUSD - paidUSD);
  const dueBDT = (dueUSD * exchangeRate).toFixed(2);

  const returnRecord = shipment.returnsRTO?.find(r => r.type === 'return');
  const rtoRecord = shipment.returnsRTO?.find(r => r.type === 'rto');

  const allDocuments = useMemo(() => {
    let docs = [...(shipment.documents || [])];
    if (shipment.items) {
      shipment.items.forEach(item => {
        if (item.documents) {
          item.documents.forEach(doc => {
            docs.push({ ...doc, shipmentItemId: item.id });
          });
        }
      });
    }
    return docs;
  }, [shipment]);

  const visibleDocuments = allDocuments.slice(0, 3);
  const hasMoreDocuments = allDocuments.length > visibleDocuments.length;

  const customerFacingStatuses = [
    'Under Review', 'Needs More Information', 'Approved', 'Rejected', 'Cancelled',
    'Received at USA Warehouse', 'Received at Dhaka Hub', 'On Hold', 'On Customs Hold',
    'On Carrier Hold', 'Shipment Locked', 'Ready for Dispatch', 'Shipped',
    'In International Transit', 'Arrived at Destination Country', 'Customs Clearance in Progress',
    'Released from Customs', 'Out for Delivery', 'Delivered', 'Failed Delivery',
    'Disposed', 'Seized', 'Awaiting Carrier Tracking', 'Awaiting Arrival at USA Warehouse',
    'Awaiting Arrival at Dhaka Hub', 'In Transit to Warehouse', 'Consolidation in Progress',
    'Sorting at Hub',
  ];

  const visibleEvents = shipment.trackingEvents?.filter(e => customerFacingStatuses.includes(e.status)) || [];

  const getServiceTypeLabel = (serviceType) => {
    switch (serviceType) {
      case 'express': return 'Express';
      case 'priority': return 'Priority';
      case 'standard': return 'Standard';
      default: return serviceType || 'N/A';
    }
  };

  const isItemAvailable = (item) => item && Object.keys(item).length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">

        <div className="flex items-center justify-between">
          <Link to="/my-shipments" className="text-sm text-slate-500 hover:text-slate-800 font-medium">← Back to My Shipments</Link>
          <button
            onClick={handleDownloadSummary}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#FF5C00] border border-slate-200 rounded-lg px-3 py-1.5 transition"
          >
            <span>📄</span> Download Summary
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Shipment {shipment.shipmentId || `SHP-${shipment.id}`}
              </p>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                {shipment.trackingNumber || 'N/A'}
              </h1>
            </div>
            <StatusBadge status={shipment.status} size="md" showDot />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800">Tracking No.</span>
            <span className="font-mono text-sm text-slate-900">{shipment.trackingNumber || 'N/A'}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shipment.trackingNumber || '');
                alert('Tracking number copied!');
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
              title="Copy tracking number"
            >
              📋
            </button>
          </div>

          {canCancelShipment(shipment.status) && (
            <button
              onClick={() => setCancelConfirmOpen(true)}
              className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5 transition"
            >
              Cancel Shipment
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-6">
          <h2 className="text-base font-bold text-slate-900">Shipment Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Origin</label>
              <p className="text-slate-900 font-medium">
                {isImport ? '🇺🇸 USA' : '🇧🇩 Bangladesh'}
              </p>
              <p className="text-sm text-slate-500">
                {shipment.sender?.fullName || '—'}, {shipment.sender?.city || ''}, {shipment.sender?.country || ''}
              </p>
              <p className="text-xs text-slate-400">{shipment.sender?.phone || ''}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination</label>
              <p className="text-slate-900 font-medium">
                {isImport ? '🇧🇩 Bangladesh' : '🇺🇸 USA'}
              </p>
              <p className="text-sm text-slate-500">
                {shipment.receiver?.fullName || '—'}, {shipment.receiver?.city || ''}, {shipment.receiver?.country || ''}
              </p>
              <p className="text-xs text-slate-400">{shipment.receiver?.phone || ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400">Service Mode</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {shipment.serviceMode || shipment.mode || '—'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400">Purchase Type</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">{shipment.purchaseType || '—'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400">Service Type</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {getServiceTypeLabel(shipment.serviceType)}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400">Weight</span>
              <p className="text-sm font-semibold text-slate-900 mt-1">{shipment.weightKg ? `${shipment.weightKg} kg` : '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Items in This Shipment</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2 text-right">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {shipment.items && shipment.items.length > 0 ? (
                  shipment.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-2 text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-2 text-slate-900 font-medium">{item.description || item.productDescription || '—'}</td>
                      <td className="py-3 px-2 text-slate-600">{item.category || item.productCategory || '—'}</td>
                      <td className="py-3 px-2 text-right text-slate-600">{item.quantity || 1}</td>
                      <td className="py-3 px-2 text-right text-slate-600">
                        {item.unitPrice ? formatCurrency(item.unitPrice, item.currency || 'USD') : item.unitPrice ? formatCurrency(item.unitPrice, 'USD') : '—'}
                      </td>
                      <td className="py-3 px-2 text-right text-slate-900 font-medium">
                        {item.totalPrice ? formatCurrency(item.totalPrice, item.currency || 'USD') : item.totalPrice ? formatCurrency(item.totalPrice, 'USD') : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No items available for this shipment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Shipment Timeline</h2>
          <p className="text-xs text-slate-400">Historical status events for this shipment</p>
          <ShipmentTimeline events={visibleEvents} initiallyVisible={5} />
        </div>

        {shipment.invoices && shipment.invoices.length > 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Cost Breakdown</h2>
            {shipment.invoices.map((invoice, idx) => (
              <div key={invoice.id || idx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">
                    Invoice #{invoice.invoice_id || invoice.id}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </span>
                </div>
                <table className="w-full text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-2 text-left font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                      <th className="py-2 text-right font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                      <th className="py-2 text-right font-semibold text-slate-500 uppercase tracking-wider">Unit Price</th>
                      <th className="py-2 text-right font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, itemIdx) => (
                      <tr key={itemIdx} className="border-b border-dashed border-slate-100/50">
                        <td className="py-2">{item.description}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">{item.unitPrice ? formatCurrency(item.unitPrice, 'USD') : '—'}</td>
                        <td className="py-2 text-right font-medium">{item.total ? formatCurrency(item.total, 'USD') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-100">
                      <td colSpan={3} className="py-2 font-bold text-slate-800 uppercase tracking-wider text-xs">Total</td>
                      <td className="py-2 text-right font-bold">{formatCurrency(invoice.total, 'USD')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}

            <div className="border-t-2 border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">Total (in BDT)</span>
                <span className="text-xl font-black text-[#FF5C00]">
                  {formatCurrency(totalBDT, 'BDT')} ({formatCurrency(totalUSD, 'USD')})
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80">
            <h2 className="text-base font-bold text-slate-900 mb-2">Cost Breakdown</h2>
            <p className="text-sm text-slate-500">
              Cost breakdown will be available once an invoice is generated for this shipment.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Documents</h2>

          {allDocuments.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {visibleDocuments.map((doc, idx) => (
                  <div key={doc.id || idx} className="border border-slate-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        📄
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-900 truncate">{doc.fileName}</p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          {doc.documentType ? doc.documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '—'}
                          {doc.createdAt && (
                            <span className="block">
                              {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="text-[10px] font-semibold text-[#FF5C00] hover:text-[#e55300] border border-[#FF5C00] rounded px-2 py-1 transition"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>

              {hasMoreDocuments && (
                <div className="pt-2">
                  <button
                    onClick={() => setDocumentsModalOpen(true)}
                    className="text-xs font-semibold text-[#FF5C00] hover:text-[#e55300] underline"
                  >
                    View All Documents ({allDocuments.length})
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No documents available for this shipment yet.
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Payments</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50/70 rounded-lg p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
              <p className="text-lg font-black text-slate-900">
                {shipment.invoices && shipment.invoices.length > 0 && totalUSD > 0
                  ? `${formatCurrency(totalUSD, 'USD')} — ${formatCurrency(totalBDT, 'BDT')}`
                  : shipment.price && totalUSD === 0
                    ? `${formatCurrency(shipment.price, 'USD')} — ${formatCurrency((parseFloat(shipment.price || 0) * exchangeRate).toFixed(2), 'BDT')}`
                    : '—'}
              </p>
            </div>
            <div className="bg-slate-50/70 rounded-lg p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Paid Amount</p>
              <p className="text-lg font-black text-emerald-700">
                {paidUSD > 0
                  ? `${formatCurrency(paidUSD, 'USD')} — ${formatCurrency(paidBDT, 'BDT')}`
                  : '—'}
              </p>
            </div>
            <div className="bg-slate-50/70 rounded-lg p-4 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Due</p>
              <p className={`text-lg font-black ${dueUSD > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                {paidUSD > 0
                  ? `${formatCurrency(dueUSD, 'USD')} — ${formatCurrency(dueBDT, 'BDT')}`
                  : '—'}
              </p>
            </div>
          </div>

          {shipment.payments && shipment.payments.length > 0 && (
            <div className="pt-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Payment History</h3>
              <div className="space-y-2">
                {shipment.payments.map((payment, idx) => (
                  <div key={payment.id || idx} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                    <span className="text-slate-600">
                      {payment.status === 'completed' ? '✅ Completed' :
                       payment.status === 'pending' ? '⏳ Pending' :
                       payment.status === 'failed' ? '❌ Failed' :
                       payment.status === 'refunded' ? '↩️ Refunded' :
                       payment.status === 'partially_refunded' ? '↩️ Partially Refunded' :
                       payment.status === 'under_review' ? '📋 Under Review' :
                       payment.status === 'reversed' ? '↩️ Reversed' : payment.status}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate(`/payments?shipment=${shipment.id}`)}
              className="text-xs font-semibold text-[#FF5C00] hover:text-[#e55300] underline"
            >
              View Payment History
            </button>
          </div>
        </div>

        {(returnRecord || rtoRecord) ? (
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Return & RTO</h2>
            {returnRecord && (
              <>
                <p className="text-xs text-slate-500 mb-2">Return initiated for this shipment</p>
                <div className="space-y-3 text-xs">
                  {returnRecord.affectedItems && returnRecord.affectedItems.length > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Affected Items</span>
                      <span className="text-slate-900 font-medium">{returnRecord.affectedItems.join(', ')}</span>
                    </div>
                  )}

                  {returnRecord.itemIds && returnRecord.itemIds.length > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Item IDs</span>
                      <span className="text-slate-900 font-medium">{returnRecord.itemIds.join(', ')}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">
                      {shipment.purchaseType === 'Assisted Purchase' ? 'Return Reason' : 'Purpose'}
                    </span>
                    <span className="text-slate-900 font-medium text-right max-w-[250px]">{returnRecord.reason || '—'}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Requested On</span>
                    <span className="text-slate-900 font-medium">
                      {returnRecord.requestedOn ? new Date(returnRecord.requestedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Status</span>
                    <StatusBadge status={returnRecord.status || 'initiated'} size="sm" />
                  </div>
                </div>
              </>
            )}
            {rtoRecord && (
              <>
                <p className="text-xs text-slate-500 mb-2">RTO initiated for this shipment</p>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Affected Items</span>
                    <span className="text-slate-900 font-medium">Entire Shipment</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">RTO Reason</span>
                    <span className="text-slate-900 font-medium text-right max-w-[250px]">{rtoRecord.reason || '—'}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Status</span>
                    <StatusBadge status={rtoRecord.status || 'initiated'} size="sm" />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80">
            <h2 className="text-base font-bold text-slate-900">Return & RTO</h2>
            <p className="text-sm text-slate-500">
              No return or RTO initiated for this shipment.
            </p>
          </div>
        )}

        {shipment.insurances && shipment.insurances.length > 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Insurance</h2>

            {shipment.insurances.map((insurance, idx) => (
              <div key={insurance.id || idx} className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Insurance ID</span>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{insurance.insuranceId || insurance.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Provider</span>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{insurance.provider || 'Dazzling Insurance'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                    <p className="mt-1">
                      <StatusBadge status={insurance.status === 'active' ? 'Approved' : insurance.status === 'claimed' ? 'Rejected' : insurance.status} size="sm" />
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Coverage</span>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {insurance.coverageAmount ? formatCurrency(insurance.coverageAmount, insurance.currency || 'USD') : '—'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Eligible Items</span>
                    <p className="text-sm text-slate-900 mt-1">
                      {insurance.eligibleItems && insurance.eligibleItems.length > 0
                        ? insurance.eligibleItems.join(', ')
                        : 'All standard shipment items'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Excluded</span>
                    <p className="text-sm text-slate-900 mt-1">
                      {insurance.excludedItems && insurance.excludedItems.length > 0
                        ? insurance.excludedItems.join(', ')
                        : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-100/80">
            <h2 className="text-base font-bold text-slate-900">Insurance</h2>
            <p className="text-sm text-slate-500">
              No insurance purchased for this shipment.
            </p>
          </div>
        )}

        <DocumentsModal
          documents={allDocuments}
          onClose={() => setDocumentsModalOpen(false)}
          onDownload={handleDownloadDocument}
        />

        {cancelConfirmOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCancelConfirmOpen(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Cancel Shipment</h3>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to cancel shipment <span className="font-mono text-rose-600">{shipment.trackingNumber}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCancelConfirmOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleCancelShipment}
                  className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition"
                >
                  Yes, Cancel Shipment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentView;