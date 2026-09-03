import React, { useState, useEffect } from 'react';
import api from '../api/axios.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';

const statusOptions = ['pending', 'picked_up', 'in_transit', 'customs', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

const AdminShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', search: '', dateFrom: '', dateTo: '' });
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const loadShipments = async (pageNum = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNum, limit: 20 });
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      const res = await api.get(`/admin/shipments?${params}`);
      setShipments(res.data.shipments || []);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const applyFilters = () => {
    setPage(1);
    loadShipments(1);
  };

  const updateStatus = async (status, location, note) => {
    try {
      await api.patch(`/admin/shipments/${selectedShipment.id}/status`, { status, location, note });
      setSelectedShipment(null);
      loadShipments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading && !shipments.length) return <CardSkeleton count={8} />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Shipments</h2>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by tracking #"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          />
          <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <button onClick={applyFilters} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Apply</button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Tracking #</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Price</th>
              <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="px-4 py-2 font-medium">{s.trackingNumber}</td>
                <td className="px-4 py-2">{s.user?.email || '—'}</td>
                <td className="px-4 py-2"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-2">{s.price} {s.currency}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => setSelectedShipment(s)}
                    className="px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">Showing {shipments.length} of {total}</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); loadShipments(p => p - 1); }} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span className="px-3 py-1">{page} / {pages}</span>
          <button disabled={page >= pages} onClick={() => { setPage(p => p + 1); loadShipments(p => p + 1); }} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      {selectedShipment && (
        <StatusModal shipment={selectedShipment} onClose={() => setSelectedShipment(null)} onSave={updateStatus} />
      )}
    </div>
  );
};

const StatusModal = ({ shipment, onClose, onSave }) => {
  const [status, setStatus] = useState(shipment.status);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="text-xl font-bold mb-4">Update Status — {shipment.trackingNumber}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows="3" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => { onSave(status, location, note); }} className="px-4 py-2 bg-primary text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AdminShipments;
