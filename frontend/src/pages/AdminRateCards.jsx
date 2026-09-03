import React, { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';

const serviceTypeOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'priority', label: 'Priority' },
];

const zoneOptions = ['domestic', 'regional', 'international'];

const AdminRateCards = () => {
  const [rateCards, setRateCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ originZone: 'domestic', destinationZone: 'domestic', serviceType: 'standard', pricePerKg: '', baseFee: '', currency: 'USD' });

  const loadRateCards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/rate-cards');
      setRateCards(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load rate cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRateCards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/rate-cards/${editing.id}`, form);
      } else {
        await api.post('/admin/rate-cards', form);
      }
      setForm({ originZone: 'domestic', destinationZone: 'domestic', serviceType: 'standard', pricePerKg: '', baseFee: '', currency: 'USD' });
      setEditing(null);
      loadRateCards();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save rate card');
    }
  };

  const handleEdit = (card) => {
    setEditing(card);
    setForm({
      originZone: card.originZone,
      destinationZone: card.destinationZone,
      serviceType: card.serviceType,
      pricePerKg: card.pricePerKg,
      baseFee: card.baseFee,
      currency: card.currency,
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/rate-cards/${id}`);
      loadRateCards();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    }
  };

  if (loading && !rateCards.length) return <CardSkeleton count={5} />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Rate Cards</h2>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit' : 'Add'} Rate Card</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <select value={form.originZone} onChange={(e) => setForm({ ...form, originZone: e.target.value })} className="px-3 py-2 border rounded-lg">
            {zoneOptions.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <select value={form.destinationZone} onChange={(e) => setForm({ ...form, destinationZone: e.target.value })} className="px-3 py-2 border rounded-lg">
            {zoneOptions.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <select value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} className="px-3 py-2 border rounded-lg">
            {serviceTypeOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input type="number" step="0.01" value={form.pricePerKg} onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })} placeholder="Price per kg" className="px-3 py-2 border rounded-lg" required />
          <input type="number" step="0.01" value={form.baseFee} onChange={(e) => setForm({ ...form, baseFee: e.target.value })} placeholder="Base fee" className="px-3 py-2 border rounded-lg" required />
          <input type="text" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="px-3 py-2 border rounded-lg w-20" required />
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            {editing ? 'Update' : 'Add'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Origin Zone</th>
              <th className="px-4 py-2 text-left">Dest Zone</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Price/kg</th>
              <th className="px-4 py-2 text-left">Base Fee</th>
              <th className="px-4 py-2 text-left">Currency</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rateCards.map((rc) => (
              <tr key={rc.id} className="border-b">
                <td className="px-4 py-2">{rc.originZone}</td>
                <td className="px-4 py-2">{rc.destinationZone}</td>
                <td className="px-4 py-2">{rc.serviceType}</td>
                <td className="px-4 py-2">{rc.pricePerKg}</td>
                <td className="px-4 py-2">{rc.baseFee}</td>
                <td className="px-4 py-2">{rc.currency}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => handleEdit(rc)} className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">Edit</button>
                  <button onClick={() => handleDelete(rc.id)} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRateCards;
