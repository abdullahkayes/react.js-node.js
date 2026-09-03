import React, { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadShipments = async () => {
      try {
        const res = await api.get('/shipments?page=1&limit=10');
        setShipments(res.data.shipments || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load shipments');
      } finally {
        setLoading(false);
      }
    };
    loadShipments();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 py-12"><div className="container mx-auto px-4 max-w-4xl"><CardSkeleton count={5} /></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Shipments</h2>
          <Link to="/book" className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
            New Shipment
          </Link>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!shipments.length ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 mb-4">No shipments yet.</p>
            <Link to="/book" className="text-primary font-semibold">Book your first shipment</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {shipments.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/shipments/${s.id}`)}
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-primary">{s.trackingNumber}</p>
                    <p className="text-sm text-gray-600">{s.serviceType} · {s.price} {s.currency}</p>
                    <p className="text-xs text-gray-500">
                      {s.sender?.city}, {s.sender?.country} → {s.receiver?.city}, {s.receiver?.country}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
