import React, { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const BookShipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [senderOption, setSenderOption] = useState('new');
  const [receiverOption, setReceiverOption] = useState('new');

  const [senderForm, setSenderForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    label: 'Home',
  });

  const [receiverForm, setReceiverForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    label: 'Delivery',
  });

  const [packageInfo, setPackageInfo] = useState({
    weightKg: '',
    length: '',
    width: '',
    height: '',
    serviceType: 'standard',
    declaredValue: '',
  });

  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await api.get('/addresses');
        setAddresses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAddresses();
  }, []);

  const handleSenderChange = (e) => {
    const { name, value } = e.target;
    setSenderForm({ ...senderForm, [name]: value });
  };

  const handleReceiverChange = (e) => {
    const { name, value } = e.target;
    setReceiverForm({ ...receiverForm, [name]: value });
  };

  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setPackageInfo({ ...packageInfo, [name]: value });
  };

  const getSenderAddress = () => {
    if (senderOption === 'existing') {
      return addresses.find((a) => String(a.id) === senderForm.addressId);
    }
    return senderForm;
  };

  const getReceiverAddress = () => {
    if (receiverOption === 'existing') {
      return addresses.find((a) => String(a.id) === receiverForm.addressId);
    }
    return receiverForm;
  };

  const calculateQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const dimensions = packageInfo.length && packageInfo.width && packageInfo.height
        ? { length: parseFloat(packageInfo.length), width: parseFloat(packageInfo.width), height: parseFloat(packageInfo.height) }
        : undefined;
      const sender = getSenderAddress();
      const receiver = getReceiverAddress();
      const res = await api.post('/quotes', {
        originCountry: sender.country,
        destinationCountry: receiver.country,
        weightKg: parseFloat(packageInfo.weightKg),
        dimensions,
        serviceType: packageInfo.serviceType,
      });
      setQuote(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate quote');
    } finally {
      setLoading(false);
    }
  };

  const submitBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const sender = getSenderAddress();
      const receiver = getReceiverAddress();
      const senderPayload = sender.addressId ? { senderAddressId: sender.id } : { senderAddress: sender };
      const receiverPayload = receiver.addressId ? { receiverAddressId: receiver.id } : { receiverAddress: receiver };

      const dimensions = packageInfo.length && packageInfo.width && packageInfo.height
        ? { length: parseFloat(packageInfo.length), width: parseFloat(packageInfo.width), height: parseFloat(packageInfo.height) }
        : undefined;

      const res = await api.post('/shipments', {
        ...senderPayload,
        ...receiverPayload,
        serviceType: packageInfo.serviceType,
        weightKg: parseFloat(packageInfo.weightKg),
        dimensions,
        declaredValue: parseFloat(packageInfo.declaredValue) || 0,
      });

      navigate(`/checkout/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book shipment');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="border p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Sender Address</h3>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={senderOption === 'saved'}
              onChange={() => setSenderOption('saved')}
            />
            Use saved address
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={senderOption === 'new'}
              onChange={() => setSenderOption('new')}
            />
            New address
          </label>
        </div>
        {senderOption === 'saved' ? (
          <select
            value={senderForm.addressId || ''}
            onChange={(e) => setSenderForm({ ...senderForm, addressId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select an address</option>
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>{a.fullName} - {a.addressLine1}, {a.city}</option>
            ))}
          </select>
        ) : (
          <AddressForm values={senderForm} onChange={handleSenderChange} />
        )}
      </div>

      <div className="border p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Receiver Address</h3>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={receiverOption === 'saved'}
              onChange={() => setReceiverOption('saved')}
            />
            Use saved address
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={receiverOption === 'new'}
              onChange={() => setReceiverOption('new')}
            />
            New address
          </label>
        </div>
        {receiverOption === 'saved' ? (
          <select
            value={receiverForm.addressId || ''}
            onChange={(e) => setReceiverForm({ ...receiverForm, addressId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select an address</option>
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>{a.fullName} - {a.addressLine1}, {a.city}</option>
            ))}
          </select>
        ) : (
          <AddressForm values={receiverForm} onChange={handleReceiverChange} />
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weightKg"
            value={packageInfo.weightKg}
            onChange={handlePackageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Service Type</label>
          <select
            name="serviceType"
            value={packageInfo.serviceType}
            onChange={handlePackageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="standard">Standard (5-7 days)</option>
            <option value="express">Express (2-3 days)</option>
            <option value="priority">Priority (1-2 days)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Length (cm)</label>
          <input
            type="number"
            name="length"
            value={packageInfo.length}
            onChange={handlePackageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Width (cm)</label>
          <input
            type="number"
            name="width"
            value={packageInfo.width}
            onChange={handlePackageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={packageInfo.height}
            onChange={handlePackageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Declared Value (USD)</label>
          <input
            type="number"
            name="declaredValue"
            value={packageInfo.declaredValue}
            onChange={handlePackageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Review & Confirm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Sender</h4>
            {JSON.stringify(getSenderAddress())}
          </div>
          <div>
            <h4 className="font-medium mb-2">Receiver</h4>
            {JSON.stringify(getReceiverAddress())}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium">Package Details</h4>
          <p>Weight: {packageInfo.weightKg} kg</p>
          <p>Service: {packageInfo.serviceType}</p>
          {quote && <p>Price: <strong>{quote.price} {quote.currency}</strong></p>}
        </div>
      </div>
      {quote && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-medium mb-2">Price Summary</h4>
          <p>Total: <strong className="text-2xl text-primary">{quote.price} {quote.currency}</strong></p>
          <p>Estimated delivery: {quote.estimatedDays} days</p>
        </div>
      )}
      <button
        onClick={submitBooking}
        disabled={loading || !quote}
        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Booking...' : 'Confirm & Pay'}
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Book a Shipment</h2>
        <div className="flex mb-6">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setQuote(null) || setStep(s)}
              className={`flex-1 py-2 ${step === s ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Step {s}
            </button>
          ))}
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && (
          <div>
            {renderStep2()}
            {!quote && (
              <button
                onClick={calculateQuote}
                disabled={loading}
                className="mt-4 w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Calculate Quote'}
              </button>
            )}
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            {quote && <div className="mt-4 p-4 bg-blue-50 rounded-lg">Price: {quote.price} {quote.currency}</div>}
            <button
              onClick={() => setStep(3)}
              disabled={!quote}
              className="mt-4 w-full py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-800/90 disabled:opacity-50"
            >
              Continue to Review
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AddressForm = ({ values, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input type="text" name="fullName" placeholder="Full Name" value={values.fullName} onChange={onChange} className="px-3 py-2 border rounded-lg" required />
    <input type="text" name="phone" placeholder="Phone" value={values.phone} onChange={onChange} className="px-3 py-2 border rounded-lg" required />
    <input type="text" name="addressLine1" placeholder="Address Line 1" value={values.addressLine1} onChange={onChange} className="md:col-span-2 px-3 py-2 border rounded-lg" required />
    <input type="text" name="addressLine2" placeholder="Address Line 2" value={values.addressLine2} onChange={onChange} className="md:col-span-2 px-3 py-2 border rounded-lg" />
    <input type="text" name="city" placeholder="City" value={values.city} onChange={onChange} className="px-3 py-2 border rounded-lg" required />
    <input type="text" name="state" placeholder="State/Province" value={values.state} onChange={onChange} className="px-3 py-2 border rounded-lg" />
    <input type="text" name="postalCode" placeholder="Postal Code" value={values.postalCode} onChange={onChange} className="px-3 py-2 border rounded-lg" />
    <input type="text" name="country" placeholder="Country" value={values.country} onChange={onChange} className="px-3 py-2 border rounded-lg" required />
  </div>
);

export default BookShipment;
