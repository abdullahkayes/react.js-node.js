import React, { useState } from 'react';
import api from '../api/axios.js';
import { Link } from 'react-router-dom';

const serviceTypes = [
  { value: 'standard', label: 'Standard (5-7 days)', price: '$' },
  { value: 'express', label: 'Express (2-3 days)', price: '$$' },
  { value: 'priority', label: 'Priority (1-2 days)', price: '$$$' },
];

const QuoteCalculator = () => {
  const [formData, setFormData] = useState({
    originCountry: '',
    destinationCountry: '',
    weightKg: '',
    length: '',
    width: '',
    height: '',
    serviceType: 'standard',
  });
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuote(null);
    try {
      const dimensions = formData.length && formData.width && formData.height
        ? { length: parseFloat(formData.length), width: parseFloat(formData.width), height: parseFloat(formData.height) }
        : undefined;
      const res = await api.post('/quotes', {
        originCountry: formData.originCountry,
        destinationCountry: formData.destinationCountry,
        weightKg: parseFloat(formData.weightKg),
        dimensions,
        serviceType: formData.serviceType,
      });
      setQuote(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-8">Shipping Quote Calculator</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Origin Country</label>
                <input
                  type="text"
                  name="originCountry"
                  value={formData.originCountry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. United States"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Destination Country</label>
                <input
                  type="text"
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Bangladesh"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 2.5"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Type</label>
                <div className="space-y-2">
                  {serviceTypes.map((s) => (
                    <label key={s.value} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="serviceType"
                        value={s.value}
                        checked={formData.serviceType === s.value}
                        onChange={handleChange}
                        className="text-primary"
                      />
                      <span className="text-sm">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Length (cm)</label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Width (cm)</label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  step="0.1"
                />
              </div>
            </div>
          </form>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Calculate Quote'}
          </button>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

          {quote && (
            <div className="mt-6 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Quote Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{quote.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zone:</span>
                  <span className="font-medium">{quote.originZone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chargeable Weight:</span>
                  <span className="font-medium">{quote.chargeableWeight} kg</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-bold">Total Price:</span>
                  <span className="font-bold text-2xl text-primary">{quote.price} {quote.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium">{quote.estimatedDays} days</span>
                </div>
              </div>
              <Link
                to="/book"
                className="block mt-4 text-center py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 text-center"
              >
                Book Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;
