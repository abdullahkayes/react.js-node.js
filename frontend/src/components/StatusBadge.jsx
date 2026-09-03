import React from 'react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  picked_up: { label: 'Picked Up', color: 'bg-blue-100 text-blue-800' },
  in_transit: { label: 'In Transit', color: 'bg-indigo-100 text-indigo-800' },
  customs: { label: 'Customs', color: 'bg-yellow-100 text-yellow-800' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  returned: { label: 'Returned', color: 'bg-purple-100 text-purple-800' },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClass}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
