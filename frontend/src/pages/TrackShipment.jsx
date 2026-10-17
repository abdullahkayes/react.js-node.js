import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const DEFAULT_TRACKING_NUMBER = 'DNO045211079';

const ASSISTED_PURCHASE_STATUS_REFERENCE = [
  'Awaiting Invoice',
  'Awaiting Advance Payment',
  'Ready to Purchase',
  'Partially Purchased',
  'Purchased',
];

const TERMINAL_REQUEST_STATUSES = ['Approved', 'Rejected', 'Cancelled'];
const TERMINAL_SHIPMENT_STATUSES = ['Delivered', 'Cancelled', 'Disposed', 'Seized'];

const SHIPMENT_RECORDS = [
  {
    trackingNumber: 'DNO045211079',
    customerId: 'CUST-1001',
    serviceMode: 'Export',
    freightMode: 'Sea',
    purchaseType: 'N/A',
    numberOfItems: 5,
    requestStatus: 'Approved',
    shipmentStatus: 'Shipped',
    assistedPurchaseStatus: 'Purchased',
    measurementValue: '3.40 CBM',
    origin: 'Bangladesh',
    destination: 'USA',
    lastUpdated: '2026-10-15T08:30:00Z',
    history: {
      'Under Review': '2026-09-20T10:00:00Z',
      Approved: '2026-09-21T12:30:00Z',
      'Received at Dhaka Hub': '2026-09-22T09:15:00Z',
      'In International Transit': '2026-09-25T15:00:00Z',
      Shipped: '2026-09-30T16:45:00Z',
    },
  },
  {
    trackingNumber: 'DS458912',
    customerId: 'CUST-1001',
    serviceMode: 'Import',
    freightMode: 'Air',
    purchaseType: 'Self Purchase',
    numberOfItems: 3,
    requestStatus: 'Approved',
    shipmentStatus: 'In International Transit',
    assistedPurchaseStatus: 'Purchased',
    measurementValue: '12.45 kg',
    origin: 'USA',
    destination: 'Bangladesh',
    lastUpdated: '2026-10-12T16:20:00Z',
    history: {
      'Under Review': '2026-10-01T11:00:00Z',
      Approved: '2026-10-02T14:15:00Z',
      'Received at USA Warehouse': '2026-10-04T09:40:00Z',
      'In International Transit': '2026-10-08T12:00:00Z',
    },
  },
  {
    trackingNumber: 'DS458913',
    customerId: 'CUST-1001',
    serviceMode: 'Import',
    freightMode: 'Air',
    purchaseType: 'Assisted Purchase',
    numberOfItems: 2,
    requestStatus: 'Approved',
    shipmentStatus: 'Released from Customs',
    assistedPurchaseStatus: 'Purchased',
    measurementValue: '8.10 kg',
    origin: 'USA',
    destination: 'Bangladesh',
    lastUpdated: '2026-10-14T07:50:00Z',
    history: {
      'Under Review': '2026-09-28T09:30:00Z',
      Approved: '2026-09-29T13:10:00Z',
      Purchased: '2026-10-01T15:00:00Z',
      'Received at USA Warehouse': '2026-10-03T08:45:00Z',
      'In International Transit': '2026-10-06T18:20:00Z',
      Shipped: '2026-10-08T10:00:00Z',
      'Released from Customs': '2026-10-11T17:30:00Z',
    },
  },
  {
    trackingNumber: 'DS458799',
    customerId: 'CUST-1002',
    serviceMode: 'Export',
    freightMode: 'Sea',
    purchaseType: 'N/A',
    numberOfItems: 4,
    requestStatus: 'Cancelled',
    shipmentStatus: 'Cancelled',
    assistedPurchaseStatus: 'Ready to Purchase',
    measurementValue: '2.88 CBM',
    origin: 'Bangladesh',
    destination: 'USA',
    lastUpdated: '2026-10-10T13:00:00Z',
    history: {
      'Under Review': '2026-09-18T09:30:00Z',
      Cancelled: '2026-09-20T11:00:00Z',
    },
  },
];

const CUSTOMER_REQUESTS = [
  {
    id: 'AP-2026-0001',
    customerId: 'CUST-1001',
    type: 'assisted',
    kindLabel: 'Assisted Purchase',
    status: 'Purchased',
    createdAt: '2026-10-12T16:10:00Z',
    title: 'Imported sports shoes from USA',
  },
  {
    id: 'AP-2026-0002',
    customerId: 'CUST-1001',
    type: 'assisted',
    kindLabel: 'Assisted Purchase',
    status: 'Awaiting Advance Payment',
    createdAt: '2026-10-08T13:05:00Z',
    title: 'Kitchen appliance bundle',
  },
  {
    id: 'AP-2026-0003',
    customerId: 'CUST-1001',
    type: 'assisted',
    kindLabel: 'Assisted Purchase',
    status: 'Ready to Purchase',
    createdAt: '2026-10-03T10:40:00Z',
    title: 'Laptop accessories',
  },
  {
    id: 'PA-260519',
    customerId: 'CUST-1001',
    type: 'self',
    kindLabel: 'Self Purchase',
    status: 'Approved',
    createdAt: '2026-10-14T09:00:00Z',
    title: 'Self-purchase pre-alert for garments',
  },
  {
    id: 'PA-260521',
    customerId: 'CUST-1001',
    type: 'self',
    kindLabel: 'Self Purchase',
    status: 'Need More Information',
    createdAt: '2026-10-11T14:25:00Z',
    title: 'Electronics supply shipment',
  },
  {
    id: 'PA-260522',
    customerId: 'CUST-1001',
    type: 'self',
    kindLabel: 'Self Purchase',
    status: 'Under Review',
    createdAt: '2026-10-05T12:15:00Z',
    title: 'Seasonal apparel shipment',
  },
  {
    id: 'EXP-250720-123',
    customerId: 'CUST-1001',
    type: 'export',
    kindLabel: 'Export Booking',
    status: 'Approved',
    createdAt: '2026-10-13T11:00:00Z',
    title: 'Export booking for knitwear',
  },
  {
    id: 'EXP-250721-456',
    customerId: 'CUST-1001',
    type: 'export',
    kindLabel: 'Export Booking',
    status: 'Under Review',
    createdAt: '2026-10-09T08:15:00Z',
    title: 'Export booking for home decor',
  },
  {
    id: 'EXP-250722-789',
    customerId: 'CUST-1001',
    type: 'export',
    kindLabel: 'Export Booking',
    status: 'Need More Information',
    createdAt: '2026-10-02T17:30:00Z',
    title: 'Export booking for industrial parts',
  },
];

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusBadgeClasses = (status) => {
  const value = status || 'Under Review';
  if (TERMINAL_REQUEST_STATUSES.includes(value) || TERMINAL_SHIPMENT_STATUSES.includes(value)) {
    return 'bg-rose-50 text-rose-700 border border-rose-200';
  }
  if (['Approved', 'Released from Customs', 'Out for Delivery', 'Delivered'].includes(value)) {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  if (['Need More Information', 'On Hold', 'On Customs Hold', 'On Carrier Hold', 'Customs Clearance in Progress'].includes(value)) {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }
  if (['Under Review', 'Received at USA Warehouse', 'Received at Dhaka Hub', 'In International Transit', 'Shipped'].includes(value)) {
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  }
  return 'bg-slate-100 text-slate-700 border border-slate-200';
};

const getShipmentByTrackingNumber = (number) => {
  const normalized = String(number || '').trim().toLowerCase();
  return SHIPMENT_RECORDS.find((record) => record.trackingNumber.toLowerCase() === normalized) || null;
};

const normalizeShipment = (record, fallbackTrackingNumber) => {
  const serviceMode = record?.serviceMode || 'Import';
  const purchaseType = record?.purchaseType || (serviceMode === 'Export' ? 'N/A' : 'Self Purchase');
  const freightMode = record?.freightMode || 'Air';
  const requestStatus = record?.requestStatus || 'Under Review';
  const shipmentStatus = record?.shipmentStatus || record?.status || 'Under Review';

  return {
    trackingNumber: record?.trackingNumber || fallbackTrackingNumber || DEFAULT_TRACKING_NUMBER,
    customerId: record?.customerId || 'CUST-1001',
    serviceMode,
    freightMode,
    purchaseType,
    numberOfItems: record?.numberOfItems || 1,
    requestStatus,
    shipmentStatus,
    status: shipmentStatus,
    assistedPurchaseStatus: record?.assistedPurchaseStatus || 'Purchased',
    measurementValue: record?.measurementValue || (freightMode === 'Sea' ? '2.50 CBM' : '12.00 kg'),
    origin: record?.origin || (serviceMode === 'Export' ? 'Bangladesh' : 'USA'),
    destination: record?.destination || (serviceMode === 'Export' ? 'USA' : 'Bangladesh'),
    lastUpdated: record?.lastUpdated || new Date().toISOString(),
    history: record?.history || {},
  };
};

const getCurrentCustomerStatus = (shipment) => {
  if (TERMINAL_REQUEST_STATUSES.includes(shipment?.requestStatus)) {
    return shipment.requestStatus;
  }
  if (shipment?.shipmentStatus && ['On Hold', 'On Customs Hold', 'On Carrier Hold', 'Customs Clearance in Progress', 'Released from Customs', 'Shipped', 'In International Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'Disposed', 'Seized'].includes(shipment.shipmentStatus)) {
    return shipment.shipmentStatus;
  }
  if (shipment?.requestStatus) {
    return shipment.requestStatus;
  }
  return 'Under Review';
};

const getTimelineNodes = (shipment) => {
  const requestStatus = shipment?.requestStatus || 'Under Review';
  const shipmentStatus = shipment?.shipmentStatus || 'Under Review';
  const isExport = shipment?.serviceMode === 'Export';
  const isAssistedPurchase = shipment?.purchaseType === 'Assisted Purchase';

  const lookup = {
    request: ['Under Review', 'Need More Information', 'Approved', 'Rejected', 'Cancelled'],
    importSelf: ['Received at USA Warehouse', 'In International Transit', 'Shipped', 'Released from Customs', 'Out for Delivery', 'Delivered'],
    importAssisted: ['Purchased', 'Received at USA Warehouse', 'In International Transit', 'Shipped', 'Released from Customs', 'Out for Delivery', 'Delivered'],
    export: ['Received at Dhaka Hub', 'In International Transit', 'Shipped', 'Released from Customs', 'Out for Delivery', 'Delivered'],
  };

  const baseSequence = isExport ? lookup.export : isAssistedPurchase ? lookup.importAssisted : lookup.importSelf;
  const requestNodeLabel = TERMINAL_REQUEST_STATUSES.includes(requestStatus)
    ? requestStatus
    : ['Under Review', 'Need More Information'].includes(requestStatus)
      ? requestStatus
      : 'Under Review';

  const requestNodeDate = shipment?.history?.[requestStatus] || shipment?.history?.['Under Review'] || shipment?.history?.Approved;

  const nodes = [
    { id: 1, label: requestNodeLabel, matchStatus: requestNodeLabel, date: requestNodeDate, isRequest: true },
    ...baseSequence.map((status, index) => ({
      id: index + 2,
      label: status,
      matchStatus: status,
      date: shipment?.history?.[status] || null,
      isRequest: false,
    })),
  ];

  const progressIndex = (statusValue) => {
    if (!statusValue) return -1;
    if (statusValue === 'Under Review' || statusValue === 'Need More Information') return 0;
    if (statusValue === 'Approved' || statusValue === 'Rejected' || statusValue === 'Cancelled') return 0;
    return baseSequence.indexOf(statusValue) + 1;
  };

  const terminalFinalStatus = TERMINAL_SHIPMENT_STATUSES.includes(shipmentStatus) ? shipmentStatus : 'Delivered';
  const finalLabel = TERMINAL_SHIPMENT_STATUSES.includes(shipmentStatus) ? shipmentStatus : 'Delivered';

  if (nodes.length > 0) {
    nodes[0].complete = TERMINAL_REQUEST_STATUSES.includes(requestStatus);
  }

  nodes.forEach((node) => {
    if (node.isRequest) {
      node.complete = TERMINAL_REQUEST_STATUSES.includes(requestStatus) || requestStatus === 'Under Review';
      return;
    }

    const achievedStatusOrder = progressIndex(shipmentStatus);
    const nodeOrder = baseSequence.indexOf(node.matchStatus) + 1;
    node.complete = achievedStatusOrder >= nodeOrder || (node.matchStatus === 'Delivered' && finalLabel === 'Delivered');
    if (node.matchStatus === 'Delivered' && TERMINAL_SHIPMENT_STATUSES.includes(shipmentStatus)) {
      node.label = terminalFinalStatus;
      node.complete = true;
    }
  });

  const lastNode = nodes[nodes.length - 1];
  if (lastNode) {
    lastNode.label = TERMINAL_SHIPMENT_STATUSES.includes(shipmentStatus) ? terminalFinalStatus : 'Delivered';
    lastNode.complete = TERMINAL_SHIPMENT_STATUSES.includes(shipmentStatus) || shipmentStatus === 'Delivered';
    lastNode.date = shipment?.history?.[terminalFinalStatus] || shipment?.history?.Delivered || lastNode.date;
  }

  return nodes;
};

const TrackShipment = () => {
  const { trackingNumber: urlTrackingNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || DEFAULT_TRACKING_NUMBER);
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLoggedIn = Boolean(user && user.id);

  useEffect(() => {
    if (urlTrackingNumber) {
      handleTrack(urlTrackingNumber);
      return;
    }
    handleTrack(DEFAULT_TRACKING_NUMBER);
  }, [urlTrackingNumber]);

  const handleTrack = async (tn = null) => {
    const nextTrackingNumber = String(tn || trackingNumber || '').trim();
    if (!nextTrackingNumber) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.get(`/track/${nextTrackingNumber}`);
      const apiShipment = res.data?.shipment || res.data || null;
      const selected = normalizeShipment(apiShipment || getShipmentByTrackingNumber(nextTrackingNumber), nextTrackingNumber);
      setShipment(selected);
    } catch (err) {
      const fallback = getShipmentByTrackingNumber(nextTrackingNumber) || {
        trackingNumber: nextTrackingNumber,
        customerId: user?.id || 'CUST-1001',
        serviceMode: 'Import',
        freightMode: 'Air',
        purchaseType: 'Self Purchase',
        numberOfItems: 1,
        requestStatus: 'Under Review',
        shipmentStatus: 'Received at USA Warehouse',
        measurementValue: '12.00 kg',
        origin: 'USA',
        destination: 'Bangladesh',
        lastUpdated: new Date().toISOString(),
        history: {},
      };
      setShipment(normalizeShipment(fallback, nextTrackingNumber));
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleTrack(trackingNumber);
  };

  const timelineNodes = useMemo(() => getTimelineNodes(shipment), [shipment]);

  const customerRecentRequests = useMemo(() => {
    const customerId = user?.id || user?.customerId || 'CUST-1001';
    return {
      assisted: CUSTOMER_REQUESTS.filter((item) => item.customerId === customerId && item.type === 'assisted').slice(0, 3),
      self: CUSTOMER_REQUESTS.filter((item) => item.customerId === customerId && item.type === 'self').slice(0, 3),
      export: CUSTOMER_REQUESTS.filter((item) => item.customerId === customerId && item.type === 'export').slice(0, 3),
    };
  }, [user]);

  const measurementFieldLabel = shipment?.freightMode === 'Sea' || shipment?.freightMode === 'Ocean' ? 'W/M (CBM)' : 'Volumetric Weight';
  const currentStatus = getCurrentCustomerStatus(shipment || {});

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <section className="relative overflow-hidden bg-[#061224] px-4 pb-20 pt-10 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,92,0,0.18),transparent_25%),url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Track <span className="text-[#FF5C00]">Your Shipment</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Enter a Dazzling Shipping tracking number to view the shipment status, route, and delivery progress.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 max-w-xl">
            <div className="flex items-center rounded-full bg-white p-1.5 pl-4 shadow-2xl shadow-slate-950/25">
              <span className="mr-2 text-sm text-slate-400">🔍</span>
              <input
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder="DNO045211079"
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#FF5C00] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#e65300] disabled:opacity-70"
              >
                {loading ? 'Searching...' : 'Track Now'}
              </button>
            </div>
          </form>

          {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
        </div>
      </section>

      <main className="relative z-20 mx-auto -mt-10 max-w-6xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
        {shipment && (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl text-[#FF5C00]">📦</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Tracking Number</p>
                    <div className="mt-1 flex items-center gap-2">
                      <h2 className="text-xl font-black tracking-tight text-slate-900">{shipment.trackingNumber}</h2>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(shipment.trackingNumber)}
                        className="text-slate-400 transition hover:text-slate-700"
                        title="Copy tracking number"
                        aria-label="Copy tracking number"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${statusBadgeClasses(currentStatus)}`}>
                  <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                  {currentStatus}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Service Mode</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{shipment.serviceMode}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Freight Mode</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{shipment.freightMode}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Purchase Type</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{shipment.purchaseType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Number of Items</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{shipment.numberOfItems}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Origin</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{shipment.origin}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Destination</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{shipment.destination}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Last Updated</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{formatDateTime(shipment.lastUpdated)}</p>
                </div>
              </div>

              <div className="mt-10">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-700">Shipment Timeline</h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Status based on shipment record</span>
                </div>

                <div className="grid gap-3 md:grid-cols-7">
                  {timelineNodes.map((node, index) => {
                    const nodeIsComplete = Boolean(node.complete);
                    const nodeIsCurrent = !nodeIsComplete && index === timelineNodes.findIndex((item) => !item.complete);

                    return (
                      <div key={`${node.id}-${node.label}`} className="relative flex min-h-[140px] flex-col items-center">
                        {index > 0 && <div className="absolute left-[-50%] top-4 hidden h-[2px] w-[100%] bg-slate-200 md:block" />}
                        <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-black ${
                          nodeIsComplete
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : nodeIsCurrent
                              ? 'border-[#FF5C00] bg-[#FF5C00] text-white'
                              : 'border-slate-300 bg-white text-slate-500'
                        }`}>
                          {nodeIsComplete ? '✓' : index + 1}
                        </div>
                        <div className="mt-3 text-center">
                          <p className={`text-[10px] font-bold leading-snug ${nodeIsComplete || nodeIsCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                            {node.label}
                          </p>
                          {nodeIsComplete && node.date && (
                            <p className="mt-2 text-[10px] text-emerald-700">{formatDateTime(node.date)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center gap-2">
                <span className="text-xl text-[#FF5C00]">📋</span>
                <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-700">Shipment Details</h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500">Customer ID</span>
                    <span className="text-sm font-bold text-slate-900">{shipment.customerId}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500">Measurement Field</span>
                    <span className="text-sm font-bold text-slate-900">{measurementFieldLabel}: {shipment.measurementValue}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500">Service Mode</span>
                    <span className="text-sm font-bold text-slate-900">{shipment.serviceMode}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500">Number of Items</span>
                    <span className="text-sm font-bold text-slate-900">{shipment.numberOfItems}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500">Freight Mode</span>
                    <span className="text-sm font-bold text-slate-900">{shipment.freightMode}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-500">Purchase Type</span>
                    <span className="text-sm font-bold text-slate-900">{shipment.purchaseType}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">Last Updated</span>
                <span className="text-sm font-bold text-slate-900">{formatDateTime(shipment.lastUpdated)}</span>
              </div>
            </div>

            {isLoggedIn && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-700">Recent Assisted Purchase Requests</h3>
                    <button
                      type="button"
                      onClick={() => navigate('/services/assisted-purchase')}
                      className="rounded-lg bg-[#FF5C00] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                    >
                      Create New
                    </button>
                  </div>
                  <div className="space-y-3">
                    {customerRecentRequests.assisted.length > 0 ? customerRecentRequests.assisted.map((request) => (
                      <div key={request.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">{request.id}</p>
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">{request.status}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-600">{request.title}</p>
                        <p className="mt-2 text-[10px] text-slate-400">{formatDateTime(request.createdAt)}</p>
                      </div>
                    )) : <p className="text-xs text-slate-500">No recent assisted purchase requests found.</p>}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-700">Recent Self-Purchase Requests</h3>
                    <button
                      type="button"
                      onClick={() => navigate('/services/self-purchase')}
                      className="rounded-lg bg-[#FF5C00] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                    >
                      Create New
                    </button>
                  </div>
                  <div className="space-y-3">
                    {customerRecentRequests.self.length > 0 ? customerRecentRequests.self.map((request) => (
                      <div key={request.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">{request.id}</p>
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{request.status}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-600">{request.title}</p>
                        <p className="mt-2 text-[10px] text-slate-400">{formatDateTime(request.createdAt)}</p>
                      </div>
                    )) : <p className="text-xs text-slate-500">No recent self-purchase requests found.</p>}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-700">Recent Export Bookings</h3>
                    <button
                      type="button"
                      onClick={() => navigate('/book')}
                      className="rounded-lg bg-[#FF5C00] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                    >
                      Create New
                    </button>
                  </div>
                  <div className="space-y-3">
                    {customerRecentRequests.export.length > 0 ? customerRecentRequests.export.map((request) => (
                      <div key={request.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">{request.id}</p>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{request.status}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-600">{request.title}</p>
                        <p className="mt-2 text-[10px] text-slate-400">{formatDateTime(request.createdAt)}</p>
                      </div>
                    )) : <p className="text-xs text-slate-500">No recent export bookings found.</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-black text-[#FF5C00]">i</span>
                <span>Assisted Purchase status reference: {ASSISTED_PURCHASE_STATUS_REFERENCE.join(' • ')}</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TrackShipment;