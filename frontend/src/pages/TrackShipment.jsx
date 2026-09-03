import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import TrackTimeline from '../components/TrackTimeline.jsx';

const statusLabels = {
  pending: 'Pending',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  customs: 'Customs Clearance',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

const TrackShipment = () => {
  const { trackingNumber: urlTrackingNumber } = useParams();
  const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || '');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlTrackingNumber) {
      handleTrack(urlTrackingNumber);
    }
  }, [urlTrackingNumber]);

  const handleTrack = async (tn = null) => {
    const number = tn || trackingNumber;
    if (!number) return;
    setLoading(true);
    setError('');
    setShipment(null);
    try {
      const res = await api.get(`/track/${number}`);
      setShipment(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Tracking number not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-8">Track Your Shipment</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g. SP24XXXXXXX)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {shipment && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Tracking: {shipment.trackingNumber}</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                  {statusLabels[shipment.status] || shipment.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500">From</h4>
                  <p>
                    {shipment.origin?.city}, {shipment.origin?.country}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">To</h4>
                  <p>
                    {shipment.destination?.city}, {shipment.destination?.country}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-500">Service</h4>
                <p>
                  {shipment.serviceType} · {shipment.weightKg} kg · {shipment.price}{' '}
                  {shipment.currency}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-3">Tracking Events</h4>
                <TrackTimeline events={shipment.trackingEvents} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackShipment;
