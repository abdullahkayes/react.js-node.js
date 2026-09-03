import React, { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <CardSkeleton count={6} />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return <p>No stats available</p>;

  const statCards = [
    { label: 'Shipments Today', value: stats.shipmentsToday },
    { label: 'In Transit', value: stats.inTransit },
    { label: 'Delivered This Month', value: stats.deliveredThisMonth },
    { label: 'Revenue This Month', value: `$${stats.revenueThisMonth}` },
    { label: 'Total Shipments', value: stats.totalShipments },
    { label: 'Total Users', value: stats.totalUsers },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-primary">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
