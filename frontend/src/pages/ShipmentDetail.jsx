import React, { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import TrackTimeline from '../components/TrackTimeline.jsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.jsx';

const ShipmentDetail = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadShipment = async () => {
      try {
        const res = await api.get(`/shipments/${id}`);
        setShipment(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load shipment');
      } finally {
        setLoading(false);
      }
    };
    loadShipment();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50 py-12"><div className="container mx-auto px-4 max-w-4xl"><LoadingSkeleton rows={8} /></div></div>;

  if (error) return <div className="min-h-screen bg-gray-50 py-12"><div className="container mx-auto px-4 max-w-4xl"><p className="text-red-500">{error}</p></div></div>;

  if (!shipment) return <div className="min-h-screen bg-gray-50 py-12"><div className="container mx-auto px-4 max-w-4xl"><p>Shipment not found</p></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/dashboard" className="text-primary hover:underline mb-4 inline-block">← Back to Dashboard</Link>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{shipment.trackingNumber}</h2>
              <p className="text-gray-600">Tracking Number</p>
            </div>
            <StatusBadge status={shipment.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sender</h3>
              <p className="font-semibold">{shipment.sender?.fullName}</p>
              <p className="text-sm text-gray-600">{shipment.sender?.addressLine1}</p>
              <p className="text-sm text-gray-600">{shipment.sender?.city}, {shipment.sender?.state} {shipment.sender?.postalCode}</p>
              <p className="text-sm text-gray-600">{shipment.sender?.country}</p>
              <p className="text-sm text-gray-600">Phone: {shipment.sender?.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Receiver</h3>
              <p className="font-semibold">{shipment.receiver?.fullName}</p>
              <p className="text-sm text-gray-600">{shipment.receiver?.addressLine1}</p>
              <p className="text-sm text-gray-600">{shipment.receiver?.city}, {shipment.receiver?.state} {shipment.receiver?.postalCode}</p>
              <p className="text-sm text-gray-600">{shipment.receiver?.country}</p>
              <p className="text-sm text-gray-600">Phone: {shipment.receiver?.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Shipment Details</h3>
              <p><strong>Service:</strong> {shipment.serviceType}</p>
              <p><strong>Weight:</strong> {shipment.weightKg} kg</p>
              {shipment.dimensions && (
                <p><strong>Dimensions:</strong> {shipment.dimensions.length} × {shipment.dimensions.width} × {shipment.dimensions.height} cm</p>
              )}
              {shipment.declaredValue && <p><strong>Declared Value:</strong> {shipment.declaredValue} {shipment.currency}</p>}
              <p><strong>Total Price:</strong> <span className="font-bold text-primary">{shipment.price} {shipment.currency}</span></p>
              <p><strong>Payment:</strong> <span className={`font-medium ${shipment.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{shipment.paymentStatus}</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Tracking Timeline</h3>
          <TrackTimeline events={shipment.trackingEvents || []} />
        </div>

        {shipment.paymentStatus === 'unpaid' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Payment</h3>
            <p className="mb-4">Complete your payment to proceed.</p>
            <Link
              to={`/checkout/${shipment.id}`}
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
            >
              Pay Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentDetail;
