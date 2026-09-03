import React from 'react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge.jsx';

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

const TrackTimeline = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className="text-gray-500">No tracking events yet.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-4">
        {events.map((event, idx) => (
          <div key={event.id || idx} className="relative flex items-start">
            <div className="absolute left-0 flex items-center justify-center w-8 h-8 bg-primary rounded-full text-white">
              {statusIcons[event.status] || '📦'}
            </div>
            <div className="ml-12 p-4 bg-gray-50 rounded-lg flex-1">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={event.status} size="sm" />
                <span className="text-xs text-gray-500">
                  {event.createdAt ? format(new Date(event.createdAt), 'PPP p') : ''}
                </span>
              </div>
              {event.location && <p className="text-sm text-gray-700"><strong>Location:</strong> {event.location}</p>}
              {event.note && <p className="text-sm text-gray-600 mt-1">{event.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackTimeline;
