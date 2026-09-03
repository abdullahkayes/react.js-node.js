import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const QuoteCalculator = lazy(() => import('./pages/QuoteCalculator.jsx'));
const BookShipment = lazy(() => import('./pages/BookShipment.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const ShipmentDetail = lazy(() => import('./pages/ShipmentDetail.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const TrackShipment = lazy(() => import('./pages/TrackShipment.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminShipments = lazy(() => import('./pages/AdminShipments.jsx'));
const AdminRateCards = lazy(() => import('./pages/AdminRateCards.jsx'));
const AdminUsers = lazy(() => import('./pages/AdminUsers.jsx'));

function App() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quote" element={<QuoteCalculator />} />
          <Route path="/track" element={<TrackShipment />} />
          <Route path="/track/:trackingNumber" element={<TrackShipment />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book"
            element={
              <ProtectedRoute>
                <BookShipment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipments/:id"
            element={
              <ProtectedRoute>
                <ShipmentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:shipmentId"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="shipments" element={<AdminShipments />} />
            <Route path="rate-cards" element={<AdminRateCards />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
