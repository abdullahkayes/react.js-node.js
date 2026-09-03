import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Home = () => {
  const { user, logout } = useAuth();
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [trackingResult, setTrackingResult] = React.useState(null);
  const [trackingError, setTrackingError] = React.useState('');
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackingError('');
    setTrackingResult(null);
    try {
      const res = await api.get(`/track/${trackingNumber}`);
      setTrackingResult(res.data);
    } catch (err) {
      setTrackingError(err.response?.data?.error || 'Tracking number not found');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Dazzling Shipping</h1>
          <nav className="flex items-center gap-4">
            <Link to="/quote" className="text-gray-600 hover:text-primary">Get a Quote</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary">Dashboard</Link>
                <button onClick={logout} className="text-gray-600 hover:text-primary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary">Login</Link>
                <Link to="/register" className="text-gray-600 hover:text-primary">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">International Shipping Made Simple</h2>
          <p className="text-lg text-gray-600 mb-8">Fast, reliable, and affordable shipping worldwide.</p>
          <div className="flex justify-center gap-4">
            <Link to="/quote" className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition">
              Get a Quote
            </Link>
            <Link to="/book" className="px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition">
              Book a Shipment
            </Link>
          </div>
        </section>

        <section className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-6">Track Your Shipment</h3>
            <form onSubmit={handleTrack} className="flex gap-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (e.g. SP24XXXXXXX)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
                Track
              </button>
            </form>
            {trackingError && <p className="text-red-500 mt-3 text-center">{trackingError}</p>}
            {trackingResult && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">Tracking: {trackingResult.trackingNumber}</p>
                <p className="text-sm text-gray-600">Status: {trackingResult.status}</p>
                <p className="text-sm text-gray-600">
                  From: {trackingResult.origin?.city}, {trackingResult.origin?.country} → {trackingResult.destination?.city}, {trackingResult.destination?.country}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
