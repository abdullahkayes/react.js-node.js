import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import StatusBadge from '../components/StatusBadge.jsx';
import TrackTimeline from '../components/TrackTimeline.jsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.jsx';

const statusIcons = {
  pending: '⏳',
  picked_up: '🚚',
  in_transit: '🚛',
  customs: '🏢',
  out_for_delivery: '🚚',
  delivered: '✅',
  cancelled: '❌',
  returned: '↩️',
};

const purchaseTypeLabels = {
  'Self-Purchase': 'Self Purchase',
  'Assisted Purchase': 'Assisted Purchase',
  'N/A': 'N/A',
};

const mockRequestDetails = {
  'PA-260514': {
    requestId: 'PA-260514',
    shipmentId: 'SHP-250514',
    trackingNo: 'DS458912',
    purchaseType: 'Self-Purchase',
    serviceMode: 'Import',
    freightType: 'Air Freight',
    category: 'CAT-B',
    items: '2 items',
    status: 'in_transit',
    statusLabel: 'In Transit',
    statusColor: 'bg-emerald-50 text-emerald-600',
    statusDot: 'bg-emerald-500',
    eta: '18 Jul 2025',
    requestDate: '10 Jul 2025',
    serviceLevel: 'Air Freight (Express)',
    weight: '3.5 kg',
    dimensions: '30 × 20 × 10 cm',
    declaredValue: '$120.00',
    shippingCharge: '$45.99',
    paymentStatus: 'paid',
    origin: 'USA Warehouse',
    destination: 'Dhaka, Bangladesh',
    sender: {
      name: 'Sheikh Sadi',
      address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
      phone: '+1 (212) 555-0123',
    },
    receiver: {
      name: 'Md. Rahim Uddin',
      address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
      phone: '+880 17XXXXXXXX',
    },
    notes: 'Handle with care. Electronics inside.',
    trackingEvents: [
      { id: 1, status: 'pending', createdAt: '2025-07-10T08:30:00+06:00', location: 'USA', note: 'Request submitted successfully' },
      { id: 2, status: 'picked_up', createdAt: '2025-07-11T14:15:00+06:00', location: 'USA Warehouse', note: 'Items purchased and picked up' },
      { id: 3, status: 'picked_up', createdAt: '2025-07-12T09:00:00+06:00', location: 'USA Warehouse', note: 'Received at USA warehouse' },
      { id: 4, status: 'in_transit', createdAt: '2025-07-13T11:45:00+06:00', location: 'US Port', note: 'Shipped to Bangladesh' },
      { id: 5, status: 'customs', createdAt: '2025-07-15T16:20:00+06:00', location: 'Bangladesh Customs', note: 'Released from customs' },
      { id: 6, status: 'customs', createdAt: '2025-07-15T08:30:00+06:00', location: 'Dhaka Hub', note: 'Arrived at Dhaka hub sorting facility' },
    ],
  },
  'AP-2026-0001': {
    requestId: 'AP-2026-0001',
    shipmentId: 'SHP-250521',
    trackingNo: 'DS458913',
    purchaseType: 'Assisted Purchase',
    serviceMode: 'Export',
    freightType: 'Sea Freight',
    category: 'Document',
    items: '1 item',
    status: 'picked_up',
    statusLabel: 'USA Warehouse',
    statusColor: 'bg-blue-50 text-blue-600',
    statusDot: 'bg-blue-500',
    eta: '—',
    requestDate: '10 Jul 2025',
    serviceLevel: 'Sea Freight (Standard)',
    weight: '1.2 kg',
    dimensions: '25 × 15 × 2 cm',
    declaredValue: '$50.00',
    shippingCharge: '$28.50',
    paymentStatus: 'unpaid',
    origin: 'USA Warehouse',
    destination: 'Chittagong Port, Bangladesh',
    sender: {
      name: 'Sheikh Sadi',
      address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
      phone: '+1 (212) 555-0123',
    },
    receiver: {
      name: 'Md. Rahim Uddin',
      address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
      phone: '+880 17XXXXXXXX',
    },
    notes: 'Documents only. No physical items.',
    trackingEvents: [
      { id: 1, status: 'pending', createdAt: '2025-07-10T08:30:00+06:00', location: 'USA', note: 'Request submitted' },
      { id: 2, status: 'picked_up', createdAt: '2025-07-11T14:15:00+06:00', location: 'USA Warehouse', note: 'Received at USA warehouse' },
    ],
  },
  'PA-260515': {
    requestId: 'PA-260515',
    shipmentId: 'SHP-250487',
    trackingNo: 'DS458877',
    purchaseType: 'Self-Purchase',
    serviceMode: 'Import',
    freightType: 'Air Freight',
    category: 'CAT-B',
    items: '3 items',
    status: 'customs',
    statusLabel: 'Customs Clearance',
    statusColor: 'bg-amber-50 text-amber-600',
    statusDot: 'bg-amber-500',
    eta: '22 Jul 2025',
    requestDate: '12 Jul 2025',
    serviceLevel: 'Air Freight (Express)',
    weight: '5.8 kg',
    dimensions: '40 × 30 × 20 cm',
    declaredValue: '$250.00',
    shippingCharge: '$89.99',
    paymentStatus: 'paid',
    origin: 'USA Warehouse',
    destination: 'Dhaka, Bangladesh',
    sender: {
      name: 'Sheikh Sadi',
      address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
      phone: '+1 (212) 555-0123',
    },
    receiver: {
      name: 'Md. Rahim Uddin',
      address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
      phone: '+880 17XXXXXXXX',
    },
    notes: 'Fragile items. Handle with extra care.',
    trackingEvents: [
      { id: 1, status: 'pending', createdAt: '2025-07-12T08:30:00+06:00', location: 'USA', note: 'Request submitted' },
      { id: 2, status: 'picked_up', createdAt: '2025-07-13T14:15:00+06:00', location: 'USA Warehouse', note: 'Picked up from seller' },
      { id: 3, status: 'picked_up', createdAt: '2025-07-14T09:00:00+06:00', location: 'USA Warehouse', note: 'Received at warehouse' },
      { id: 4, status: 'in_transit', createdAt: '2025-07-15T11:45:00+06:00', location: 'US Port', note: 'Departed USA' },
      { id: 5, status: 'customs', createdAt: '2025-07-18T16:20:00+06:00', location: 'Bangladesh Customs', note: 'Under customs clearance' },
      { id: 6, status: 'customs', createdAt: '2025-07-19T08:30:00+06:00', location: 'Bangladesh Customs', note: 'Awaiting duty payment' },
    ],
  },
  'PA-260516': {
    requestId: 'PA-260516',
    shipmentId: 'SHP-250473',
    trackingNo: 'DS458799',
    purchaseType: 'N/A',
    serviceMode: 'Export',
    freightType: 'Air Freight',
    category: 'CAT-A',
    items: '1 item',
    status: 'delivered',
    statusLabel: 'Delivered',
    statusColor: 'bg-emerald-50 text-emerald-600',
    statusDot: 'bg-emerald-500',
    eta: '10 Jul 2025',
    requestDate: '01 Jul 2025',
    serviceLevel: 'Air Freight (Express)',
    weight: '0.5 kg',
    dimensions: '20 × 15 × 1 cm',
    declaredValue: '$25.00',
    shippingCharge: '$15.00',
    paymentStatus: 'paid',
    origin: 'USA Warehouse',
    destination: 'Dhaka, Bangladesh',
    sender: {
      name: 'Sheikh Sadi',
      address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
      phone: '+1 (212) 555-0123',
    },
    receiver: {
      name: 'Md. Rahim Uddin',
      address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
      phone: '+880 17XXXXXXXX',
    },
    notes: 'Document shipment. No physical goods.',
    trackingEvents: [
      { id: 1, status: 'pending', createdAt: '2025-07-01T08:30:00+06:00', location: 'USA', note: 'Request submitted' },
      { id: 2, status: 'picked_up', createdAt: '2025-07-02T14:15:00+06:00', location: 'USA Warehouse', note: 'Picked up' },
      { id: 3, status: 'picked_up', createdAt: '2025-07-03T09:00:00+06:00', location: 'USA Warehouse', note: 'Received at warehouse' },
      { id: 4, status: 'in_transit', createdAt: '2025-07-04T11:45:00+06:00', location: 'US Port', note: 'Shipped' },
      { id: 5, status: 'customs', createdAt: '2025-07-06T16:20:00+06:00', location: 'Bangladesh Customs', note: 'Cleared customs' },
      { id: 6, status: 'out_for_delivery', createdAt: '2025-07-08T09:00:00+06:00', location: 'Dhaka Hub', note: 'Out for delivery' },
      { id: 7, status: 'delivered', createdAt: '2025-07-10T11:00:00+06:00', location: 'Dhaka', note: 'Delivered successfully' },
    ],
  },
  'AP-2026-0002': {
    requestId: 'AP-2026-0002',
    shipmentId: 'SHP-250462',
    trackingNo: 'DS458765',
    purchaseType: 'Assisted Purchase',
    serviceMode: 'Import',
    freightType: 'Sea Freight',
    category: 'CAT-C',
    items: '2 items',
    status: 'delivered',
    statusLabel: 'Delivered',
    statusColor: 'bg-emerald-50 text-emerald-600',
    statusDot: 'bg-emerald-500',
    eta: '08 Jul 2025',
    requestDate: '25 Jun 2025',
    serviceLevel: 'Sea Freight (Standard)',
    weight: '12.0 kg',
    dimensions: '60 × 40 × 30 cm',
    declaredValue: '$400.00',
    shippingCharge: '$150.00',
    paymentStatus: 'paid',
    origin: 'USA Warehouse',
    destination: 'Dhaka, Bangladesh',
    sender: {
      name: 'Sheikh Sadi',
      address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
      phone: '+1 (212) 555-0123',
    },
    receiver: {
      name: 'Md. Rahim Uddin',
      address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
      phone: '+880 17XXXXXXXX',
    },
    notes: 'Heavy items. Verify weight before shipping.',
    trackingEvents: [
      { id: 1, status: 'pending', createdAt: '2025-06-25T08:30:00+06:00', location: 'USA', note: 'Request submitted' },
      { id: 2, status: 'picked_up', createdAt: '2025-06-26T14:15:00+06:00', location: 'USA Warehouse', note: 'Picked up from seller' },
      { id: 3, status: 'picked_up', createdAt: '2025-06-27T09:00:00+06:00', location: 'USA Warehouse', note: 'Received at warehouse' },
      { id: 4, status: 'in_transit', createdAt: '2025-06-28T11:45:00+06:00', location: 'US Port', note: 'Shipped via sea freight' },
      { id: 5, status: 'customs', createdAt: '2025-07-05T16:20:00+06:00', location: 'Bangladesh Customs', note: 'Cleared customs' },
      { id: 6, status: 'out_for_delivery', createdAt: '2025-07-07T09:00:00+06:00', location: 'Dhaka Hub', note: 'Out for delivery' },
      { id: 7, status: 'delivered', createdAt: '2025-07-08T11:00:00+06:00', location: 'Dhaka', note: 'Delivered successfully' },
    ],
  },
  'PA-260517': {
    requestId: 'PA-260517',
    shipmentId: 'SHP-250433',
    trackingNo: 'DS458701',
    purchaseType: 'N/A',
    serviceMode: 'Export',
    freightType: 'Air Freight',
    category: 'CAT-B',
    items: '4 items',
    status: 'returned',
    statusLabel: 'Returned',
    statusColor: 'bg-rose-50 text-rose-600',
    statusDot: 'bg-rose-500',
    eta: '—',
    requestDate: '01 Jul 2025',
    serviceLevel: 'Air Freight (Express)',
    weight: '7.2 kg',
    dimensions: '50 × 35 × 25 cm',
    declaredValue: '$300.00',
    shippingCharge: '$120.00',
    paymentStatus: 'refunded',
    origin: 'USA Warehouse',
    destination: 'Dhaka, Bangladesh',
    sender: {
      name: 'Sheikh Sadi',
      address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
      phone: '+1 (212) 555-0123',
    },
    receiver: {
      name: 'Md. Rahim Uddin',
      address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
      phone: '+880 17XXXXXXXX',
    },
    notes: 'Return requested by customer.',
    trackingEvents: [
      { id: 1, status: 'pending', createdAt: '2025-07-01T08:30:00+06:00', location: 'USA', note: 'Request submitted' },
      { id: 2, status: 'picked_up', createdAt: '2025-07-02T14:15:00+06:00', location: 'USA Warehouse', note: 'Picked up' },
      { id: 3, status: 'picked_up', createdAt: '2025-07-03T09:00:00+06:00', location: 'USA Warehouse', note: 'Received at warehouse' },
      { id: 4, status: 'in_transit', createdAt: '2025-07-04T11:45:00+06:00', location: 'US Port', note: 'Shipped' },
      { id: 5, status: 'customs', createdAt: '2025-07-06T16:20:00+06:00', location: 'Bangladesh Customs', note: 'Return requested at customs' },
      { id: 6, status: 'returned', createdAt: '2025-07-14T11:00:00+06:00', location: 'USA Warehouse', note: 'Shipment returned to origin' },
    ],
  },
  'AP-2026-0003': {
    requestId: 'AP-2026-0003',
    shipmentId: 'SHP-250421',
    trackingNo: 'DS458654',
    purchaseType: 'Assisted Purchase',
    serviceMode: 'Import',
    freightType: 'Sea Freight',
    category: 'Document',
    items: '1 item',
    status: 'returned',
    statusLabel: 'RTO',
    statusColor: 'bg-rose-50 text-rose-600',
    statusDot: 'bg-rose-500',
    eta: '—',
    requestDate: '01 Jul 2025',
    serviceLevel: 'Sea Freight (Standard)',
    weight: '0.8 kg',
    dimensions: '22 × 16 × 2 cm',
    declaredValue: '$35.00',
    shippingCharge: '$22.00',
    paymentStatus: 'refunded',
    origin: 'USA Warehouse',
    destination: 'Dhaka, Bangladesh',
    sender: {
      name: 'Sheikh Sadi',
      address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
      phone: '+1 (212) 555-0123',
    },
    receiver: {
      name: 'Md. Rahim Uddin',
      address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
      phone: '+880 17XXXXXXXX',
    },
    notes: 'Document rejected by customs. RTO initiated.',
    trackingEvents: [
      { id: 1, status: 'pending', createdAt: '2025-07-01T08:30:00+06:00', location: 'USA', note: 'Request submitted' },
      { id: 2, status: 'picked_up', createdAt: '2025-07-02T14:15:00+06:00', location: 'USA Warehouse', note: 'Picked up from seller' },
      { id: 3, status: 'picked_up', createdAt: '2025-07-03T09:00:00+06:00', location: 'USA Warehouse', note: 'Received at warehouse' },
      { id: 4, status: 'in_transit', createdAt: '2025-07-05T11:45:00+06:00', location: 'US Port', note: 'Shipped via sea freight' },
      { id: 5, status: 'customs', createdAt: '2025-07-09T16:20:00+06:00', location: 'Bangladesh Customs', note: 'Customs rejected shipment' },
      { id: 6, status: 'returned', createdAt: '2025-07-13T09:00:00+06:00', location: 'USA Warehouse', note: 'RTO completed, back at origin' },
    ],
  },
  'PA-260518': {
    requestId: 'PA-260518',
    shipmentId: 'SHP-250398',
    trackingNo: 'DS458612',
    purchaseType: 'Self-Purchase',
    serviceMode: 'Export',
    freightType: 'Air Freight',
    category: 'CAT-C',
    items: '2 items',
    status: 'in_transit',
    statusLabel: 'In Transit',
    statusColor: 'bg-emerald-50 text-emerald-600',
    statusDot: 'bg-emerald-500',
    eta: '19 Jul 2025',
    requestDate: '08 Jul 2025',
    serviceLevel: 'Air Freight (Express)',
    weight: '4.5 kg',
    dimensions: '35 × 25 × 15 cm',
    declaredValue: '$180.00',
    shippingCharge: '$65.00',
    paymentStatus: 'paid',
    origin: 'USA Warehouse',
    destination: 'Dhaka, Bangladesh',
    sender: {
      name: 'Sheikh Sadi',
      address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
      phone: '+1 (212) 555-0123',
    },
    receiver: {
      name: 'Md. Rahim Uddin',
      address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
      phone: '+880 17XXXXXXXX',
    },
    notes: 'Export shipment. Ensure customs documentation is complete.',
    trackingEvents: [
      { id: 1, status: 'pending', createdAt: '2025-07-08T08:30:00+06:00', location: 'USA', note: 'Request submitted' },
      { id: 2, status: 'picked_up', createdAt: '2025-07-09T14:15:00+06:00', location: 'USA Warehouse', note: 'Picked up from seller' },
      { id: 3, status: 'picked_up', createdAt: '2025-07-10T09:00:00+06:00', location: 'USA Warehouse', note: 'Received at warehouse' },
      { id: 4, status: 'in_transit', createdAt: '2025-07-11T11:45:00+06:00', location: 'US Port', note: 'Departed USA' },
      { id: 5, status: 'in_transit', createdAt: '2025-07-13T16:20:00+06:00', location: 'Dubai Hub', note: 'In transit via connecting flight' },
      { id: 6, status: 'in_transit', createdAt: '2025-07-16T08:00:00+06:00', location: 'Dhaka Hub', note: 'Arrived at Dhaka hub' },
    ],
  },
};

const getMockRequest = (requestId) => {
  if (mockRequestDetails[requestId]) {
    return mockRequestDetails[requestId];
  }
  
  if (requestId.startsWith('EXP-')) {
    return {
      requestId: requestId,
      shipmentId: null,
      trackingNo: null,
      purchaseType: 'N/A',
      serviceMode: 'Export',
      freightType: 'Air Freight',
      category: 'CAT-B',
      items: '1 item',
      status: 'Submitted',
      statusLabel: 'Submitted',
      statusColor: 'bg-slate-50 text-slate-600',
      statusDot: 'bg-slate-400',
      eta: '—',
      requestDate: '21 Sep 2025',
      serviceLevel: 'Air Freight (Express)',
      weight: '2.5 kg',
      dimensions: '30 × 20 × 10 cm',
      declaredValue: '$150.00',
      shippingCharge: '$55.00',
      paymentStatus: 'pending',
      origin: 'Bangladesh',
      destination: 'USA',
      sender: {
        name: 'Md. Rahim Uddin',
        address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
        phone: '+880 17XXXXXXXX',
      },
      receiver: {
        name: 'Sheikh Sadi',
        address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
        phone: '+1 (212) 555-0123',
      },
      notes: 'Export shipment pending processing.',
      trackingEvents: [
        { id: 1, status: 'pending', createdAt: '2025-09-21T08:30:00+06:00', location: 'Bangladesh', note: 'Request submitted successfully' },
      ],
    };
  }
  
  if (requestId.startsWith('PA-') || requestId.startsWith('AP-')) {
    return {
      requestId: requestId,
      shipmentId: null,
      trackingNo: null,
      purchaseType: requestId.startsWith('PA-') ? 'Self-Purchase' : 'Assisted Purchase',
      serviceMode: 'Import',
      freightType: 'Air Freight',
      category: 'CAT-A',
      items: '1 item',
      status: 'Under Review',
      statusLabel: 'Under Review',
      statusColor: 'bg-blue-50 text-blue-600',
      statusDot: 'bg-blue-500',
      eta: '—',
      requestDate: '21 Sep 2025',
      serviceLevel: 'Air Freight (Express)',
      weight: '1.5 kg',
      dimensions: '20 × 15 × 5 cm',
      declaredValue: '$75.00',
      shippingCharge: '$30.00',
      paymentStatus: 'pending',
      origin: 'USA',
      destination: 'Bangladesh',
      sender: {
        name: 'Sheikh Sadi',
        address: '14 Lewis Place, Suite 8, Brooklyn, NY 11218, USA',
        phone: '+1 (212) 555-0123',
      },
      receiver: {
        name: 'Md. Rahim Uddin',
        address: 'House 12, Road 45, Banani, Dhaka-1213, Bangladesh',
        phone: '+880 17XXXXXXXX',
      },
      notes: 'Request under review.',
      trackingEvents: [
        { id: 1, status: 'pending', createdAt: '2025-09-21T10:00:00+06:00', location: 'USA', note: 'Request submitted' },
      ],
    };
  }
  
  return null;
};

const RequestDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const res = await api.get(`/requests/${requestId}`);
        if (res.data && Object.keys(res.data).length > 0) {
          setRequest(res.data);
        } else {
          setRequest(getMockRequest(requestId));
        }
      } catch (err) {
        setRequest(getMockRequest(requestId));
      } finally {
        setLoading(false);
      }
    };
    loadRequest();
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-slate-900">Request Details</h1>
            <p className="text-xs text-slate-400 mt-1">Loading request information...</p>
          </div>
        </div>
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-slate-900">Request Details</h1>
            <p className="text-xs text-slate-400 mt-1">Request not found.</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-xs font-bold text-slate-600 hover:text-[#FF5C00] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors">← Back</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
          <p className="text-slate-500 text-sm">The request <strong>{requestId}</strong> could not be found. It may have been removed or the ID is incorrect.</p>
        </div>
      </div>
    );
  }

  const currentStep = request.trackingEvents?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => navigate('/my-shipments')} className="text-[10px] font-semibold text-slate-400 hover:text-[#FF5C00] transition">← My Shipments</button>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Request Details</h1>
          <p className="text-xs text-slate-400 mt-1">Request ID: <span className="font-mono font-bold text-slate-700">{request.requestId}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${request.statusColor}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${request.statusDot}`}></span>
            {request.statusLabel || request.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Request Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Request Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Request ID</label>
                <p className="text-sm font-medium text-slate-800 font-mono">{request.requestId}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipment ID</label>
                <p className="text-sm font-medium text-slate-800 font-mono">{request.shipmentId}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tracking Number</label>
                <p className="text-sm font-medium text-slate-800 font-mono">{request.trackingNo}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Request Date</label>
                <p className="text-sm font-medium text-slate-800">{request.requestDate}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase Type</label>
                <p className="text-sm font-medium text-slate-800">{purchaseTypeLabels[request.purchaseType] || request.purchaseType}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Mode</label>
                <p className="text-sm font-medium text-slate-800">{request.serviceMode}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freight Type</label>
                <p className="text-sm font-medium text-slate-800">{request.freightType}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <p className="text-sm font-medium text-slate-800">{request.category}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items</label>
                <p className="text-sm font-medium text-slate-800">{request.items}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ETA</label>
                <p className="text-sm font-medium text-slate-800">{request.eta || '—'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Addresses Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Addresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Origin / Sender</h3>
                <p className="text-sm font-semibold text-slate-800">{request.sender?.name}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{request.sender?.address}</p>
                <p className="text-xs text-slate-500">Phone: {request.sender?.phone}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination / Receiver</h3>
                <p className="text-sm font-semibold text-slate-800">{request.receiver?.name}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{request.receiver?.address}</p>
                <p className="text-xs text-slate-500">Phone: {request.receiver?.phone}</p>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          {request.notes && (
            <div className="bg-[#FFF8F0] rounded-2xl p-6 border border-orange-100 space-y-2">
              <h2 className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider flex items-center gap-1.5">
                <span>📝</span> Notes / Instructions
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{request.notes}</p>
            </div>
          )}

          {/* Tracking Timeline */}
          {request.trackingEvents && request.trackingEvents.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tracking Timeline</h2>
              <TrackTimeline events={request.trackingEvents} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Billing Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Billing Summary</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping Charge</span>
                <span className="font-bold text-slate-900">{request.shippingCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Declared Value</span>
                <span className="font-bold text-slate-900">{request.declaredValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Weight</span>
                <span className="font-bold text-slate-900">{request.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dimensions</span>
                <span className="font-bold text-slate-900">{request.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Level</span>
                <span className="font-bold text-slate-900">{request.serviceLevel}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between">
                <span className="text-slate-700 font-bold">Total</span>
                <span className="font-black text-[#FF5C00]">{request.shippingCharge}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <button
              onClick={() => navigate(`/track/${request.trackingNo}`)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              🔍 Track Shipment
            </button>
            <button
              onClick={() => navigate('/my-shipments')}
              className="w-full py-2.5 bg-[#FF5C00] hover:bg-[#e55300] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              ← Back to My Shipments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
