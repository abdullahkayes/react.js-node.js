import React from 'react';

const statusConfig = {
  'Under Review': { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border border-amber-100' },
  'Needs More Information': { label: 'Needs More Information', color: 'bg-blue-50 text-blue-700 border border-blue-100' },
  'Approved': { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  'Rejected': { label: 'Rejected', color: 'bg-rose-50 text-rose-700 border border-rose-100' },
  'Cancelled': { label: 'Cancelled', color: 'bg-slate-50 text-slate-700 border border-slate-100' },
  'Received at USA Warehouse': { label: 'Received at USA Warehouse', color: 'bg-purple-50 text-purple-700 border border-purple-100' },
  'Received at Dhaka Hub': { label: 'Received at Dhaka Hub', color: 'bg-purple-50 text-purple-700 border border-purple-100' },
  'On Hold': { label: 'On Hold', color: 'bg-amber-50 text-amber-700 border border-amber-100' },
  'On Customs Hold': { label: 'On Customs Hold', color: 'bg-amber-50 text-amber-700 border border-amber-100' },
  'On Carrier Hold': { label: 'On Carrier Hold', color: 'bg-amber-50 text-amber-700 border border-amber-100' },
  'Shipment Locked': { label: 'Shipment Locked', color: 'bg-slate-50 text-slate-700 border border-slate-100' },
  'Ready for Dispatch': { label: 'Ready for Dispatch', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  'Shipped': { label: 'Shipped', color: 'bg-blue-50 text-blue-700 border border-blue-100' },
  'In International Transit': { label: 'In International Transit', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  'Arrived at Destination Country': { label: 'Arrived at Destination Country', color: 'bg-purple-50 text-purple-700 border border-purple-100' },
  'Customs Clearance in Progress': { label: 'Customs Clearance in Progress', color: 'bg-amber-50 text-amber-700 border border-amber-100' },
  'Released from Customs': { label: 'Released from Customs', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  'Out for Delivery': { label: 'Out for Delivery', color: 'bg-indigo-50 text-indigo-700 border border-indigo-100' },
  'Delivered': { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  'Failed Delivery': { label: 'Failed Delivery', color: 'bg-rose-50 text-rose-700 border border-rose-100' },
  'Disposed': { label: 'Disposed', color: 'bg-rose-50 text-rose-700 border border-rose-100' },
  'Seized': { label: 'Seized', color: 'bg-red-50 text-red-700 border border-red-100' },
  'Awaiting Carrier Tracking': { label: 'Awaiting Carrier Tracking', color: 'bg-slate-50 text-slate-700 border border-slate-100' },
  'Awaiting Arrival at USA Warehouse': { label: 'Awaiting Arrival at USA Warehouse', color: 'bg-blue-50 text-blue-700 border border-blue-100' },
  'Awaiting Arrival at Dhaka Hub': { label: 'Awaiting Arrival at Dhaka Hub', color: 'bg-blue-50 text-blue-700 border border-blue-100' },
  'In Transit to Warehouse': { label: 'In Transit to Warehouse', color: 'bg-indigo-50 text-indigo-700 border border-indigo-100' },
  'Consolidation in Progress': { label: 'Consolidation in Progress', color: 'bg-cyan-50 text-cyan-700 border border-cyan-100' },
  'Sorting at Hub': { label: 'Sorting at Hub', color: 'bg-cyan-50 text-cyan-700 border border-cyan-100' },
};

const StatusBadge = ({ status, size = 'md', showDot = false }) => {
  const config = statusConfig[status] || { label: status, color: 'bg-slate-50 text-slate-700 border border-slate-100' };
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${config.color} ${sizeClass} border`}>
      {showDot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />}
      {config.label}
    </span>
  );
};

export default StatusBadge;