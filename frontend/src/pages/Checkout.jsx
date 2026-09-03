import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { CardSkeleton } from '../components/LoadingSkeleton.jsx';

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
    if (key) {
      stripePromise = loadStripe(key);
    } else {
      console.warn('VITE_STRIPE_PUBLISHABLE_KEY not set, Stripe will be simulated');
    }
  }
  return stripePromise;
};

const CheckoutForm = ({ clientSecret, shipmentId, onComplete }) => {
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (!stripePromise) {
        await api.post('/payments/mark-paid', { shipmentId });
        onComplete();
        return;
      }
      const stripe = await stripePromise;
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2027,
            cvc: '123',
          },
        },
      });
      if (error) {
        console.error(error);
      } else {
        onComplete();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">This is a test checkout. Use card: 4242 4242 4242 4242, any future date, any CVC.</p>
      <button
        onClick={handlePay}
        disabled={processing}
        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

const Checkout = () => {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initPayment = async () => {
      try {
        const shipmentRes = await api.get(`/shipments/${shipmentId}`);
        setShipment(shipmentRes.data);

        const intentRes = await api.post('/payments/create-intent', { shipmentId: shipmentRes.data.id });
        setClientSecret(intentRes.data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };
    initPayment();
  }, [shipmentId]);

  if (loading) return <div className="min-h-screen bg-gray-50 py-12"><div className="container mx-auto px-4 max-w-2xl"><CardSkeleton count={4} /></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {shipment && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">Shipment Summary</h3>
            <p>Tracking: {shipment.trackingNumber}</p>
            <p>Service: {shipment.serviceType}</p>
            <p>Total: <strong className="text-primary">{shipment.price} {shipment.currency}</strong></p>
          </div>
        )}

        {clientSecret && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Elements stripe={getStripe()} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} shipmentId={parseInt(shipmentId)} onComplete={() => navigate(`/shipments/${shipmentId}`)} />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
