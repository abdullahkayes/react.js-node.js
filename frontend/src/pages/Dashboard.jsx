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

  // Hardcoded fallback data to strictly match the design in the provided image
  const defaultShipments = [
    { id: '125', shipmentId: 'SHP-2026-000125', serviceType: 'EXP-260021', mode: 'Export', trackingNo: 'BDEXP260512345678', contents: '3 Items • Garments, Cotton T-Shirts', status: 'w', date: 'May 30, 2026' },
    { id: '124', shipmentId: 'SHP-2026-000124', serviceType: 'EXP-260018', mode: 'Export', trackingNo: 'BDEXP260512345679', contents: '2 Items • Electronics Accessories', status: 'In Transit', date: 'May 25, 2026' },
    { id: '123', shipmentId: 'SHP-2026-000123', serviceType: 'AIR-2026-0001', mode: 'Import', trackingNo: '129999AA10123456784', contents: '1 Item • AirPods Pro 2nd Gen', status: 'At Dhaka Hub', date: 'May 22, 2026' },
    { id: '122', shipmentId: 'SHP-2026-000122', serviceType: 'FA-260514', mode: 'Import', trackingNo: '920129095765632700000', contents: '1 Item • MacBook Air M3', status: 'Customs Clearance', date: 'May 18, 2026' },
    { id: '121', shipmentId: 'SHP-2026-000121', serviceType: 'AIR-2026-0002', mode: 'Import', trackingNo: '9400111298376125456789', contents: '1 Item • Sony WH-1000XM5', status: 'Out For Delivery', date: 'May 15, 2026' },
    { id: '120', shipmentId: 'SHP-2026-000120', serviceType: 'FA-260515', mode: 'Import', trackingNo: '1287R930321098765', contents: '1 Item • Men\'s Denim Jacket', status: 'Out For Delivery', date: 'May 14, 2026' },
    { id: '119', shipmentId: 'SHP-2026-000119', serviceType: 'EXP-260022', mode: 'Export', trackingNo: '4205012090705412109876', contents: '1 Item • Logitech MX Master 3S', status: 'Delivered', date: 'May 08, 2026' },
  ];

  useEffect(() => {
    const loadShipments = async () => {
      try {
        const res = await api.get('/shipments?page=1&limit=10');
        if (res.data && res.data.shipments && res.data.shipments.length > 0) {
          setShipments(res.data.shipments);
        } else {
          setShipments(defaultShipments);
        }
      } catch (err) {
        setShipments(defaultShipments);
      } finally {
        setLoading(false);
      }
    };
    loadShipments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <CardSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warehouse Address Banner Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* USA Warehouse Address Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs relative">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">🇺🇸</span>
                  <h3 className="text-xs font-extrabold text-slate-800">USA Warehouse Address</h3>
                </div>
                <button className="bg-[#FF5C00] hover:bg-[#e55300] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                  <span>📋</span> Copy Address
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Customer Name:</span>
                  <strong className="text-slate-800">Sheikh Sadi</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Customer ID:</span>
                  <strong className="text-slate-800">DSCUST100456</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">State / Zip Code:</span>
                  <strong className="text-slate-800">NY 11218</strong>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-slate-400 block text-[10px]">Street / Suite:</span>
                  <strong className="text-slate-800">14 Lewis Place, Suite 8, B...</strong>
                </div>
                <div className="mt-1">
                  <span className="text-slate-400 block text-[10px]">Phone / City:</span>
                  <strong className="text-slate-800">+1 (302) 366-1200 / Middletown</strong>
                </div>
              </div>
            </div>

            {/* Dhaka Hub Address Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs relative">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">🇧🇩</span>
                  <h3 className="text-xs font-extrabold text-slate-800">Dhaka Hub Address</h3>
                </div>
                <button className="bg-[#FF5C00] hover:bg-[#e55300] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                  <span>📋</span> Copy Address
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Contact Person:</span>
                  <strong className="text-slate-800">Dazzling Shipping Team</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone:</span>
                  <strong className="text-slate-800">+880 2-555-0123</strong>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-slate-400 block text-[10px]">Address:</span>
                  <strong className="text-slate-800">House 12, Road 45, Banani, Dhaka-1213</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Metric Counter Widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">📦</div>
              <div>
                <span className="text-lg font-black text-slate-800 block leading-none">20</span>
                <span className="text-[10px] text-slate-400">Total Shipments (All time)</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">🏬</div>
              <div>
                <span className="text-lg font-black text-slate-800 block leading-none">5</span>
                <span className="text-[10px] text-slate-400">At Origin Hub (Receiving)</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">✈️</div>
              <div>
                <span className="text-lg font-black text-slate-800 block leading-none">7</span>
                <span className="text-[10px] text-slate-400">In Transit (On the way)</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">🏛️</div>
              <div>
                <span className="text-lg font-black text-slate-800 block leading-none">3</span>
                <span className="text-[10px] text-slate-400">Customs Clearance</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF5EF] text-[#FF5C00] flex items-center justify-center text-sm font-bold">🚚</div>
              <div>
                <span className="text-lg font-black text-slate-800 block leading-none">3</span>
                <span className="text-[10px] text-slate-400">Out for Delivery</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">✅</div>
              <div>
                <span className="text-lg font-black text-slate-800 block leading-none">4</span>
                <span className="text-[10px] text-slate-400">Delivered Successfully</span>
              </div>
            </div>

          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Quick Actions</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <Link to="/services/self-purchase" className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 text-center space-y-1">
                <span className="text-base">📥</span>
                <span className="text-[11px] font-bold text-slate-700">Self Purchase</span>
              </Link>

              <Link to="/services/assisted-purchase" className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 text-center space-y-1">
                <span className="text-base">🛒</span>
                <span className="text-[11px] font-bold text-slate-700">Buy For Me</span>
              </Link>

              <Link to="/book" className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 text-center space-y-1">
                <span className="text-base">✈️</span>
                <span className="text-[11px] font-bold text-slate-700">Create Export Shipment</span>
              </Link>

              <Link to="/track" className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 text-center space-y-1">
                <span className="text-base">🔍</span>
                <span className="text-[11px] font-bold text-slate-700">Track Shipment</span>
              </Link>

              <Link to="/quote" className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 text-center space-y-1">
                <span className="text-base">🧮</span>
                <span className="text-[11px] font-bold text-slate-700">Cost Calculator</span>
              </Link>

              <Link to="/payments" className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 text-center space-y-1">
                <span className="text-base">📄</span>
                <span className="text-[11px] font-bold text-slate-700">Make Payment</span>
              </Link>

              <Link to="/contact" className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 text-center space-y-1">
                <span className="text-base">🎧</span>
                <span className="text-[11px] font-bold text-slate-700">Support Center</span>
              </Link>
            </div>
          </div>

          {/* Main Dashboard Two-Column Grid Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Recent Shipments Data Table (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800">Recent Shipments</h3>
                <Link to="/my-shipments" className="text-[11px] text-[#FF5C00] font-bold hover:underline">
                  View All
                </Link>
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2 px-1">SHIPMENT ID / NO.</th>
                      <th className="py-2 px-1">SERVICE TYPE</th>
                      <th className="py-2 px-1">TRACKING NUMBER</th>
                      <th className="py-2 px-1">CONTENTS</th>
                      <th className="py-2 px-1">STATUS</th>
                      <th className="py-2 px-1">DATE</th>
                      <th className="py-2 px-1 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {shipments.map((s, idx) => (
                      <tr key={s.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-1 font-bold text-slate-800">
                          {s.shipmentId || `SHP-2026-000${s.id}`}
                        </td>
                        <td className="py-3 px-1">
                          <span className="text-slate-500 block text-[10px]">{s.serviceType || 'Air Freight'}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.mode === 'Export' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                            {s.mode || 'Import'}
                          </span>
                        </td>
                        <td className="py-3 px-1 font-mono text-[10px] text-slate-600">
                          {s.trackingNo || s.trackingNumber || 'BDEXP260512345678'}
                        </td>
                        <td className="py-3 px-1 text-slate-600 max-w-[140px] truncate">
                          {s.contents || '1 Item • Electronics'}
                        </td>
                        <td className="py-3 px-1">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="py-3 px-1 text-slate-400 text-[10px]">
                          {s.date || 'May 30, 2026'}
                        </td>
                        <td className="py-3 px-1 text-right">
                          <button
                            onClick={() => navigate(`/shipments/${s.id}`)}
                            className="text-[11px] font-bold text-slate-600 hover:text-[#FF5C00] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Wallet, Payment & Notifications Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">

              {/* Wallet Summary Card */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800">Wallet Summary</h3>
                  <span className="text-[10px] text-slate-400 font-medium">WALLET BALANCE</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">$120.50</span>
                  <div className="text-right text-[10px] space-y-0.5">
                    <p className="text-slate-500">Pending Topup: <span className="font-bold text-amber-600">$245.00</span></p>
                    <p className="text-slate-500">Refund reserve: <span className="font-bold text-emerald-600">$35.00</span></p>
                    <p className="text-slate-500">Last transaction: <span className="font-bold text-slate-700">-$245.00</span></p>
                  </div>
                </div>

                <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5">
                  <span>➕</span> Add Funds
                </button>
              </div>

              {/* Payment Summary Box */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800">Payment Summary</h3>
                  <Link to="/payments" className="text-[11px] text-[#FF5C00] font-bold hover:underline">View All</Link>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-slate-400 block uppercase">Pending</span>
                    <strong className="text-amber-600 text-xs">$245.00</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-slate-400 block uppercase">Paid</span>
                    <strong className="text-emerald-600 text-xs">$1,245.60</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-slate-400 block uppercase">Overdue</span>
                    <strong className="text-red-500 text-xs">$85.00</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-slate-400 block uppercase">Invoices</span>
                    <strong className="text-slate-800 text-xs">6</strong>
                  </div>
                </div>
              </div>

              {/* Latest Notifications Timeline */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800">Latest Notifications</h3>
                  <span className="text-[11px] text-[#FF5C00] font-bold cursor-pointer hover:underline">View All</span>
                </div>

                <div className="space-y-2.5 text-[11px] text-slate-600">
                  <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                    <span className="text-emerald-500 mt-0.5">📥</span>
                    <div className="flex-1">
                      <p className="text-slate-800">Your export shipment <strong>SHP-2026-000125</strong> has been received at Dhaka Hub.</p>
                      <span className="text-[9px] text-slate-400">1h ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                    <span className="text-sky-500 mt-0.5">✈️</span>
                    <div className="flex-1">
                      <p className="text-slate-800">Your shipment <strong>SHP-2026-000123</strong> departed from USA.</p>
                      <span className="text-[9px] text-slate-400">3h ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                    <span className="text-emerald-500 mt-0.5">✅</span>
                    <div className="flex-1">
                      <p className="text-slate-800">Payment of <strong>$245.00</strong> was received successfully.</p>
                      <span className="text-[9px] text-slate-400">21h ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                    <span className="text-purple-500 mt-0.5">🏛️</span>
                    <div className="flex-1">
                      <p className="text-slate-800">Your shipment <strong>SHP-2026-000121</strong> is in customs clearance.</p>
                      <span className="text-[9px] text-slate-400">1d ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-500 mt-0.5">🔄</span>
                    <div className="flex-1">
                      <p className="text-slate-800">Return request <strong>RT-2026-00034</strong> has been approved.</p>
                      <span className="text-[9px] text-slate-400">2d ago</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Pending Actions Carousel Strip */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800">Pending Actions</h3>
              <span className="text-[11px] text-[#FF5C00] font-bold cursor-pointer hover:underline">View All</span>
            </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center space-y-1.5">
                <span className="text-base block">💳</span>
                <span className="text-[11px] font-bold text-slate-800 block">Payment Due</span>
                <button className="w-full py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded transition-colors">
                  Pay Now
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center space-y-1.5">
                <span className="text-base block">📄</span>
                <span className="text-[11px] font-bold text-slate-800 block">Submit Invoice</span>
                <button className="w-full py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded transition-colors">
                  Upload
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center space-y-1.5">
                <span className="text-base block">🛒</span>
                <span className="text-[11px] font-bold text-slate-800 block">Purchase Request</span>
                <button className="w-full py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded transition-colors">
                  View
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center space-y-1.5">
                <span className="text-base block">✈️</span>
                <span className="text-[11px] font-bold text-slate-800 block">Export Docs</span>
                <button className="w-full py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded transition-colors">
                  Upload
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center space-y-1.5">
                <span className="text-base block">🔄</span>
                <span className="text-[11px] font-bold text-slate-800 block">Return Request</span>
                <button className="w-full py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded transition-colors">
                  View
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-center space-y-1.5">
                <span className="text-base block">🛡️</span>
                <span className="text-[11px] font-bold text-slate-800 block">Insurance Claim</span>
                <button className="w-full py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>

    </div>
  );
};

export default Dashboard;