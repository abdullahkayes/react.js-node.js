import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';

const REQUEST_STATUSES = [
  'Submitted',
  'Under Review',
  'Need More Information',
  'Approved',
  'Rejected',
  'Cancelled',
];

const SHIPMENT_STATUSES = [
  'Awaiting Carrier Tracking',
  'Awaiting Arrival at USA Warehouse',
  'Awaiting Arrival at Dhaka Hub',
  'Received at USA Warehouse',
  'Received at Dhaka Hub',
  'On Hold',
  'On Customs Hold',
  'On Carrier Hold',
  'In Transit to Warehouse',
  'Consolidation in Progress',
  'Shipment Locked',
  'Ready for Dispatch',
  'Shipped',
  'In International Transit',
  'Arrived at Destination Country',
  'Customs Clearance in Progress',
  'Released from Customs',
  'Sorting at Hub',
  'Out for Delivery',
  'Delivered',
  'Failed Delivery',
  'Cancelled',
  'Disposed',
  'Seized',
];

const WAREHOUSE_ARRIVAL_STATUSES = [
  'Received at USA Warehouse',
  'Received at Dhaka Hub',
];

const SUMMARY_CARD_STATUSES = {
  'USA Warehouse': 'Received at USA Warehouse',
  'In Transit': 'In International Transit',
  'Customs Clearance': 'Customs Clearance in Progress',
  'Delivered': 'Delivered',
};

const getStatusColor = (status, isRequest = false) => {
  if (isRequest) {
    switch (status) {
      case 'Under Review':
        return 'bg-amber-50 text-amber-600';
      case 'Need More Information':
        return 'bg-blue-50 text-blue-600';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-600';
      case 'Rejected':
        return 'bg-rose-50 text-rose-600';
      case 'Cancelled':
        return 'bg-slate-50 text-slate-600';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  }

  switch (status) {
    case 'Awaiting Carrier Tracking':
      return 'bg-slate-50 text-slate-600';
    case 'Awaiting Arrival at USA Warehouse':
    case 'Awaiting Arrival at Dhaka Hub':
      return 'bg-blue-50 text-blue-600';
    case 'Received at USA Warehouse':
    case 'Received at Dhaka Hub':
      return 'bg-purple-50 text-purple-600';
    case 'On Hold':
    case 'On Customs Hold':
    case 'On Carrier Hold':
      return 'bg-amber-50 text-amber-600';
    case 'In Transit to Warehouse':
      return 'bg-indigo-50 text-indigo-600';
    case 'Consolidation in Progress':
      return 'bg-cyan-50 text-cyan-600';
    case 'Shipment Locked':
      return 'bg-slate-50 text-slate-600';
    case 'Ready for Dispatch':
      return 'bg-emerald-50 text-emerald-600';
    case 'Shipped':
      return 'bg-blue-50 text-blue-600';
    case 'In International Transit':
      return 'bg-emerald-50 text-emerald-600';
    case 'Arrived at Destination Country':
      return 'bg-purple-50 text-purple-600';
    case 'Customs Clearance in Progress':
      return 'bg-amber-50 text-amber-600';
    case 'Released from Customs':
      return 'bg-emerald-50 text-emerald-600';
    case 'Sorting at Hub':
      return 'bg-cyan-50 text-cyan-600';
    case 'Out for Delivery':
      return 'bg-indigo-50 text-indigo-600';
    case 'Delivered':
      return 'bg-emerald-50 text-emerald-600';
    case 'Failed Delivery':
      return 'bg-rose-50 text-rose-600';
    case 'Cancelled':
      return 'bg-slate-50 text-slate-600';
    case 'Disposed':
      return 'bg-rose-50 text-rose-600';
    case 'Seized':
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-slate-50 text-slate-600';
  }
};

const getStatusDotColor = (status, isRequest = false) => {
  if (isRequest) {
    switch (status) {
      case 'Under Review':
        return 'bg-amber-500';
      case 'Need More Information':
        return 'bg-blue-500';
      case 'Approved':
        return 'bg-emerald-500';
      case 'Rejected':
        return 'bg-rose-500';
      case 'Cancelled':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  }

  switch (status) {
    case 'Awaiting Carrier Tracking':
      return 'bg-slate-500';
    case 'Awaiting Arrival at USA Warehouse':
    case 'Awaiting Arrival at Dhaka Hub':
      return 'bg-blue-500';
    case 'Received at USA Warehouse':
    case 'Received at Dhaka Hub':
      return 'bg-purple-500';
    case 'On Hold':
    case 'On Customs Hold':
    case 'On Carrier Hold':
      return 'bg-amber-500';
    case 'In Transit to Warehouse':
      return 'bg-indigo-500';
    case 'Consolidation in Progress':
      return 'bg-cyan-500';
    case 'Shipment Locked':
      return 'bg-slate-500';
    case 'Ready for Dispatch':
      return 'bg-emerald-500';
    case 'Shipped':
      return 'bg-blue-500';
    case 'In International Transit':
      return 'bg-emerald-500';
    case 'Arrived at Destination Country':
      return 'bg-purple-500';
    case 'Customs Clearance in Progress':
      return 'bg-amber-500';
    case 'Released from Customs':
      return 'bg-emerald-500';
    case 'Sorting at Hub':
      return 'bg-cyan-500';
    case 'Out for Delivery':
      return 'bg-indigo-500';
    case 'Delivered':
      return 'bg-emerald-500';
    case 'Failed Delivery':
      return 'bg-rose-500';
    case 'Cancelled':
      return 'bg-slate-500';
    case 'Disposed':
      return 'bg-rose-500';
    case 'Seized':
      return 'bg-red-500';
    default:
      return 'bg-slate-500';
  }
};

const canCancelShipment = (status) => {
  return !WAREHOUSE_ARRIVAL_STATUSES.includes(status) &&
         !['Delivered', 'Cancelled', 'Disposed', 'Seized'].includes(status);
};

const mockShipmentsData = [
  {
    id: 250514,
    shipmentId: 'SHP-250514',
    requestId: 'PA-260514',
    trackingNumber: 'DS458912',
    weightKg: '3.5',
    serviceType: 'express',
    purchaseType: 'Self-Purchase',
    serviceMode: 'Import',
    status: 'In International Transit',
    createdAt: '2025-07-10T08:30:00Z',
    updatedAt: '2025-07-15T16:20:00Z',
  },
  {
    id: 250521,
    shipmentId: 'SHP-250521',
    requestId: 'AP-2026-0001',
    trackingNumber: 'DS458913',
    weightKg: '1.2',
    serviceType: 'standard',
    purchaseType: 'N/A',
    serviceMode: 'Export',
    status: 'Received at USA Warehouse',
    createdAt: '2025-07-10T08:30:00Z',
    updatedAt: '2025-07-12T09:00:00Z',
  },
  {
    id: 250487,
    shipmentId: 'SHP-250487',
    requestId: 'PA-260515',
    trackingNumber: 'DS458877',
    weightKg: '5.8',
    serviceType: 'express',
    purchaseType: 'Self-Purchase',
    serviceMode: 'Import',
    status: 'Customs Clearance in Progress',
    createdAt: '2025-07-10T08:30:00Z',
    updatedAt: '2025-07-15T16:20:00Z',
  },
  {
    id: 250473,
    shipmentId: 'SHP-250473',
    requestId: 'PA-260516',
    trackingNumber: 'DS458799',
    weightKg: '0.5',
    serviceType: 'express',
    purchaseType: 'N/A',
    serviceMode: 'Export',
    status: 'Delivered',
    createdAt: '2025-07-01T08:30:00Z',
    updatedAt: '2025-07-10T11:00:00Z',
  },
  {
    id: 250462,
    shipmentId: 'SHP-250462',
    requestId: 'AP-2026-0002',
    trackingNumber: 'DS458765',
    weightKg: '12.0',
    serviceType: 'standard',
    purchaseType: 'Assisted Purchase',
    serviceMode: 'Import',
    status: 'Delivered',
    createdAt: '2025-06-25T08:30:00Z',
    updatedAt: '2025-07-08T11:00:00Z',
  },
  {
    id: 250433,
    shipmentId: 'SHP-250433',
    requestId: 'PA-260517',
    trackingNumber: 'DS458701',
    weightKg: '7.2',
    serviceType: 'express',
    purchaseType: 'N/A',
    serviceMode: 'Export',
    status: 'Disposed',
    createdAt: '2025-07-01T08:30:00Z',
    updatedAt: '2025-07-14T11:00:00Z',
  },
  {
    id: 250421,
    shipmentId: 'SHP-250421',
    requestId: 'AP-2026-0003',
    trackingNumber: 'DS458654',
    weightKg: '0.8',
    serviceType: 'standard',
    purchaseType: 'Assisted Purchase',
    serviceMode: 'Import',
    status: 'Seized',
    createdAt: '2025-07-01T08:30:00Z',
    updatedAt: '2025-07-13T09:00:00Z',
  },
  {
    id: 250398,
    shipmentId: 'SHP-250398',
    requestId: 'PA-260518',
    trackingNumber: 'DS458612',
    weightKg: '4.5',
    serviceType: 'express',
    purchaseType: 'Self-Purchase',
    serviceMode: 'Export',
    status: 'In International Transit',
    createdAt: '2025-07-08T08:30:00Z',
    updatedAt: '2025-07-16T08:00:00Z',
  },
];

const mockRequestsData = [
  {
    id: 1,
    requestId: 'PA-260519',
    status: 'Submitted',
    freightMode: 'air',
    serviceMode: 'Import',
    requestType: 'Self Purchase',
    typeKey: 'self',
    items: [{ id: 1 }],
    createdAt: '2025-07-20T10:00:00Z',
  },
  {
    id: 6,
    requestId: 'PA-260521',
    status: 'Submitted',
    freightMode: 'air',
    serviceMode: 'Export',
    requestType: 'Export Booking',
    typeKey: 'export',
    items: [{ id: 1 }],
    createdAt: '2025-07-21T08:00:00Z',
  },
  {
    id: 2,
    requestId: 'AP-2026-0004',
    status: 'Under Review',
    freightMode: 'sea',
    serviceMode: 'Export',
    requestType: 'Assisted Purchase',
    typeKey: 'assisted',
    items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    createdAt: '2025-07-19T14:00:00Z',
  },
  {
    id: 3,
    requestId: 'EXP-250720-123',
    status: 'Need More Information',
    freightMode: 'air',
    serviceMode: 'Export',
    requestType: 'Export Booking',
    typeKey: 'export',
    items: [{ id: 1 }],
    createdAt: '2025-07-20T09:30:00Z',
  },
  {
    id: 4,
    requestId: 'PA-260520',
    status: 'Approved',
    freightMode: 'air',
    serviceMode: 'Import',
    requestType: 'Self Purchase',
    typeKey: 'self',
    items: [{ id: 1 }, { id: 2 }],
    createdAt: '2025-07-18T11:00:00Z',
  },
  {
    id: 5,
    requestId: 'AP-2026-0005',
    status: 'Rejected',
    freightMode: 'sea',
    serviceMode: 'Import',
    requestType: 'Assisted Purchase',
    typeKey: 'assisted',
    items: [{ id: 1 }],
    createdAt: '2025-07-15T16:00:00Z',
  },
  {
    id: 7,
    requestId: 'EXP-250719-456',
    status: 'Cancelled',
    freightMode: 'sea',
    serviceMode: 'Export',
    requestType: 'Export Booking',
    typeKey: 'export',
    items: [{ id: 1 }],
    createdAt: '2025-07-19T12:00:00Z',
  },
];

const MyShipments = () => {
  const [requests, setRequests] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSummaryFilter, setActiveSummaryFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [cancelConfirm, setCancelConfirm] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCancelShipment = (shipmentId, trackingNumber) => {
    setCancelConfirm({ shipmentId, trackingNumber });
  };

  const confirmCancelShipment = async () => {
    if (!cancelConfirm) return;
    try {
      await api.put(`/shipments/${cancelConfirm.shipmentId}/cancel`);
      setShipments(prev => prev.map(s => 
        s.id === cancelConfirm.shipmentId ? { ...s, status: 'Cancelled' } : s
      ));
      setCancelConfirm(null);
    } catch (err) {
      console.error('Failed to cancel shipment:', err);
      alert('Failed to cancel shipment. Please try again.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [requestsRes, shipmentsRes] = await Promise.all([
          fetchAllRequests(),
          fetchAllShipments(),
        ]);
        setRequests(requestsRes);
        setShipments(shipmentsRes);
      } catch (err) {
        console.error('Failed to load shipments data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchAllRequests = async () => {
    const allRequests = [];
    
    try {
      const [selfRes, assistedRes, bookRes] = await Promise.all([
        api.get('/self-purchase?limit=100'),
        api.get('/assisted-purchase?limit=100'),
        api.get('/book-shipment?limit=100'),
      ]);

      if (selfRes.data?.requests && selfRes.data.requests.length > 0) {
        selfRes.data.requests.forEach(r => {
          if (REQUEST_STATUSES.includes(r.status)) {
            allRequests.push({
              ...r,
              requestType: 'Self Purchase',
              typeKey: 'self',
            });
          }
        });
      }

      if (assistedRes.data?.requests && assistedRes.data.requests.length > 0) {
        assistedRes.data.requests.forEach(r => {
          if (REQUEST_STATUSES.includes(r.status)) {
            allRequests.push({
              ...r,
              requestType: 'Assisted Purchase',
              typeKey: 'assisted',
            });
          }
        });
      }

      if (bookRes.data?.requests && bookRes.data.requests.length > 0) {
        bookRes.data.requests.forEach(r => {
          if (REQUEST_STATUSES.includes(r.status)) {
            allRequests.push({
              ...r,
              requestType: 'Export Booking',
              typeKey: 'export',
            });
          }
        });
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    }

    if (allRequests.length === 0) {
      return mockRequestsData;
    }

    return allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const fetchAllShipments = async () => {
    try {
      const res = await api.get('/shipments?limit=200');
      if (res.data?.shipments && res.data.shipments.length > 0) {
        return res.data.shipments.map(s => ({
          ...s,
          requestType: 'Shipment',
          typeKey: 'shipment',
        }));
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
    }
    return mockShipmentsData;
  };

  const handleSummaryCardClick = (filterKey) => {
    if (activeSummaryFilter === filterKey) {
      setActiveSummaryFilter(null);
      setStatusFilter('All Status');
    } else {
      setActiveSummaryFilter(filterKey);
      if (filterKey === 'Total Shipments') {
        setStatusFilter('All Status');
      } else {
        setStatusFilter(SUMMARY_CARD_STATUSES[filterKey]);
      }
    }
    setSearchTerm('');
    setTypeFilter('All Types');
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesSearch = searchTerm === '' ||
        r.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All Status' || r.status === statusFilter;
      const matchesType = typeFilter === 'All Types' || r.typeKey === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requests, searchTerm, statusFilter, typeFilter]);

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const matchesSearch = searchTerm === '' ||
        s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id?.toString().includes(searchTerm);

      const matchesStatus = statusFilter === 'All Status' || s.status === statusFilter;
      const matchesType = typeFilter === 'All Types' || typeFilter === 'shipment';

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [shipments, searchTerm, statusFilter, typeFilter]);

  const summaryCounts = useMemo(() => {
    const totalShipments = shipments.length;
    const usaWarehouse = shipments.filter(s => s.status === 'Received at USA Warehouse').length;
    const inTransit = shipments.filter(s => s.status === 'In International Transit').length;
    const customsClearance = shipments.filter(s => s.status === 'Customs Clearance in Progress').length;
    const delivered = shipments.filter(s => s.status === 'Delivered').length;

    return {
      'Total Shipments': totalShipments,
      'USA Warehouse': usaWarehouse,
      'In Transit': inTransit,
      'Customs Clearance': customsClearance,
      'Delivered': delivered,
    };
  }, [shipments]);

  const summaryCards = [
    { key: 'Total Shipments', icon: '📦', color: 'bg-blue-50 text-blue-500', iconBg: 'bg-blue-50', subtext: 'All time' },
    { key: 'USA Warehouse', icon: '🏭', color: 'bg-purple-50 text-purple-500', iconBg: 'bg-purple-50', subtext: 'Awaiting dispatch' },
    { key: 'In Transit', icon: '🚢', color: 'bg-amber-50 text-amber-500', iconBg: 'bg-amber-50', subtext: 'On the way' },
    { key: 'Customs Clearance', icon: '📋', color: 'bg-emerald-50 text-emerald-500', iconBg: 'bg-emerald-50', subtext: 'Under clearance' },
    { key: 'Delivered', icon: '✅', color: 'bg-teal-50 text-teal-500', iconBg: 'bg-teal-50', subtext: 'Successfully delivered' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-slate-900">My Shipments</h1>
            <p className="text-xs text-slate-400 mt-1">View and track all your shipments and requests in one place.</p>
          </div>
        </div>
        <CardSkeleton count={6} />
        <CardSkeleton count={1} />
        <CardSkeleton count={1} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700 antialiased p-2 sm:p-2 lg:p-2 space-y-2">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Shipments</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">View and track all your shipments and requests in one place.</p>
      </div>

      {/* Stat Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((card) => {
          const count = summaryCounts[card.key];
          const isActive = activeSummaryFilter === card.key;
          return (
            <button
              key={card.key}
              onClick={() => handleSummaryCardClick(card.key)}
              className={`bg-white rounded-xl p-3.5 shadow-2xs border transition-all duration-200 ${
                isActive 
                  ? 'border-[#FF5C00] shadow-[0_0_0_2px_rgba(255,92,0,0.2)]' 
                  : 'border-slate-100/80 hover:border-slate-200 hover:shadow-xs'
              } flex items-start gap-3 cursor-pointer`}
              aria-pressed={isActive}
            >
              <div className={`h-8 w-8 rounded-lg ${card.iconBg} ${isActive ? 'ring-2 ring-[#FF5C00]' : ''} flex items-center justify-center shrink-0`}>
                <span className="text-lg">{card.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-semibold leading-none truncate">{card.key}</p>
                <p className="text-base font-bold text-slate-900 mt-1">{count}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{card.subtext}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl p-5 shadow-2xs border border-slate-100/80 space-y-4">
        {/* Search and Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-800">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Request ID, Shipment ID, Tracking No. or Status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-3 pr-9 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#FF5C00] transition"
              />
              <span className="absolute right-3 top-3 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-800">Type</label>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#FF5C00] appearance-none cursor-pointer transition"
              >
                <option>All Types</option>
                <option value="self">Self Purchase</option>
                <option value="assisted">Assisted Purchase</option>
                <option value="export">Export Booking</option>
                <option value="shipment">Shipments</option>
              </select>
              <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">▼</span>
            </div>
          </div>
        </div>

        {/* Status Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-800">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#FF5C00] appearance-none cursor-pointer transition"
              >
                <option>All Status</option>
                {REQUEST_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                {SHIPMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">▼</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-800">Date Range</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 text-xs">📅</span>
              <input
                type="text"
                readOnly
                placeholder="Select start date — Select end date"
                className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-400 cursor-pointer focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Active Count Label */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900">
            {filteredRequests.length + filteredShipments.length} Records
          </p>
          {(activeSummaryFilter || statusFilter !== 'All Status' || typeFilter !== 'All Types') && (
            <button
              onClick={() => {
                setActiveSummaryFilter(null);
                setStatusFilter('All Status');
                setTypeFilter('All Types');
                setSearchTerm('');
              }}
              className="text-xs font-semibold text-[#FF5C00] hover:underline flex items-center gap-1"
            >
              <span>✕</span> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Requests & Bookings Table */}
      <div className="bg-white rounded-2xl p-5 shadow-2xs border border-slate-100/80 space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Requests & Bookings
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
              {filteredRequests.length}
            </span>
          </h2>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 transition">
            <span>📥</span> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                <th className="py-3 px-2">Request ID</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Freight Mode</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Created</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredRequests.map((r, idx) => (
                <tr key={r.id || idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-2 font-medium text-slate-900 text-[11px]">{r.requestId}</td>
                  <td className="py-4 px-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                      {r.requestType}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-slate-600 font-medium">
                    {r.items?.length || 0} item{r.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-2 text-slate-600 font-medium">
                    {r.freightMode === 'air' ? 'Air Freight' : 'Sea Freight'}
                  </td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(r.status, true)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(r.status, true)}`}></span>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-slate-500 font-medium text-[10px]">
                    {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button
                      onClick={() => navigate(`/request/${r.requestId}`)}
                      className="text-[11px] font-semibold text-slate-700 hover:text-[#FF5C00] transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No requests found matching your specified filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl p-5 shadow-2xs border border-slate-100/80 space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Shipments
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
              {filteredShipments.length}
            </span>
          </h2>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 transition">
            <span>📥</span> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                <th className="py-3 px-2">Shipment ID</th>
                <th className="py-3 px-2">Tracking No.</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Freight Type</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">ETA</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredShipments.map((s, idx) => (
                <tr key={s.id || idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-2 font-bold text-slate-900 leading-tight">{s.shipmentId || `SHP-${s.id}`}</td>
                  <td className="py-4 px-2 text-slate-500 font-medium text-[10px]">{s.trackingNumber}</td>
                  <td className="py-4 px-2 text-slate-600 font-medium">
                    {s.weightKg} kg
                  </td>
                  <td className="py-4 px-2">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <span className="text-slate-400 text-xs">
                        {s.serviceType === 'express' ? '⚡' : s.serviceType === 'priority' ? '🚀' : '📦'}
                      </span> {s.serviceType.charAt(0).toUpperCase() + s.serviceType.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(s.status)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(s.status)}`}></span>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-slate-500 font-medium text-[10px]">
                    {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => navigate(`/track/${s.trackingNumber}`)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-[#FF5C00] transition"
                      >
                        <span className="text-slate-400">🔍</span> Track
                      </button>
                      <button
                        onClick={() => navigate(`/shipment-view/${s.id}`)}
                        className="text-[11px] font-semibold text-slate-700 hover:text-[#FF5C00] transition"
                      >
                        View Details
                      </button>
                      {canCancelShipment(s.status) && (
                        <button
                          onClick={() => handleCancelShipment(s.id, s.trackingNumber)}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredShipments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No shipments found matching your specified filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCancelConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cancel Shipment</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to cancel shipment <span className="font-mono text-rose-600">{cancelConfirm.trackingNumber}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancelShipment}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition"
              >
                Yes, Cancel Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShipments;