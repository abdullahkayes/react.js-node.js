import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge.jsx';

const timelineStatusIcons = {
  'Under Review': '📋',
  'Needs More Information': '❓',
  'Approved': '✅',
  'Rejected': '❌',
  'Cancelled': '🚫',
  'Received at USA Warehouse': '🏭',
  'Received at Dhaka Hub': '🏭',
  'On Hold': '⏸️',
  'On Customs Hold': '🛃',
  'On Carrier Hold': '🚚',
  'Shipment Locked': '🔒',
  'Ready for Dispatch': '📦',
  'Shipped': '🚢',
  'In International Transit': '✈️',
  'Arrived at Destination Country': '🌍',
  'Customs Clearance in Progress': '📋',
  'Released from Customs': '✅',
  'Out for Delivery': '🚚',
  'Delivered': '✅',
  'Failed Delivery': '❌',
  'Disposed': '🗑️',
  'Seized': '⛔',
  'Awaiting Carrier Tracking': '⏳',
  'Awaiting Arrival at USA Warehouse': '🏭',
  'Awaiting Arrival at Dhaka Hub': '🏭',
  'In Transit to Warehouse': '🚛',
  'Consolidation in Progress': '📦',
  'Sorting at Hub': '📦',
};

const getTimelineIcon = (status) => timelineStatusIcons[status] || '📦';

const ShipmentTimeline = ({ events, initiallyVisible = 5 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const timelineRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!timelineRef.current || !containerRef.current) return;

    const checkOverflow = () => {
      const timeline = timelineRef.current;
      const container = containerRef.current;
      if (!timeline || !container) return;

      const timelineHeight = timeline.scrollHeight;
      const containerHeight = container.clientHeight;

      setShowExpandButton(timelineHeight > containerHeight && events.length > initiallyVisible);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [events, initiallyVisible]);

  const visibleEvents = isExpanded ? events : events.slice(0, initiallyVisible);

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
      <div ref={containerRef} className={isExpanded ? '' : 'max-h-[400px] overflow-hidden'}>
        <div ref={timelineRef} className="space-y-4">
          {visibleEvents.map((event, idx) => (
            <div key={event.id || idx} className="relative flex items-start">
              <div className="absolute left-0 flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full text-base">
                {getTimelineIcon(event.status)}
              </div>
              <div className="ml-12 p-3 bg-slate-50/50 rounded-lg flex-1 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={event.status} size="sm" showDot />
                  <span className="text-xs text-slate-500">
                    {event.createdAt ? format(new Date(event.createdAt), 'MMM d, yyyy • h:mm a') : ''}
                  </span>
                </div>
                {event.location && <p className="text-sm text-slate-700"><strong>Location:</strong> {event.location}</p>}
                {event.note && <p className="text-sm text-slate-600 mt-1">{event.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isExpanded && showExpandButton && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF5C00] hover:text-[#e55300] px-4 py-2 rounded-lg border border-[#FF5C00] bg-white transition-colors"
          >
            <span>📋</span> View Full Timeline ({events.length} events)
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(false)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 bg-white transition-colors"
          >
            <span>⬆️</span> Collapse Timeline
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentTimeline;