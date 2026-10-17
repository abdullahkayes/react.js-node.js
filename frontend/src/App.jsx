import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import PublicLayout from './components/PublicLayout.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const QuoteCalculator = lazy(() => import('./pages/QuoteCalculator.jsx'));
const BookShipment = lazy(() => import('./pages/BookShipment.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const MyShipments = lazy(() => import('./pages/MyShipments.jsx'));
const ShipmentDetail = lazy(() => import('./pages/ShipmentDetail.jsx'));
const ShipmentView = lazy(() => import('./pages/ShipmentView.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const TrackShipment = lazy(() => import('./pages/TrackShipment.jsx'));
const Wallet = lazy(() => import('./pages/Wallet.jsx'));
const Payments = lazy(() => import('./pages/Payments.jsx'));
const Insurance = lazy(() => import('./pages/Insurance.jsx'));
const ReturnRTO = lazy(() => import('./pages/ReturnRTO.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const RequestDetail = lazy(() => import('./pages/RequestDetail.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminShipments = lazy(() => import('./pages/AdminShipments.jsx'));
const AdminRateCards = lazy(() => import('./pages/AdminRateCards.jsx'));
const AdminUsers = lazy(() => import('./pages/AdminUsers.jsx'));
const AssistedPurchase = lazy(() => import('./pages/services/AssistedPurchase.jsx'));
const SelfPurchase = lazy(() => import('./pages/services/SelfPurchase.jsx'));
const ExportImport = lazy(() => import('./pages/services/ExportImport.jsx'));
const AirFreight = lazy(() => import('./pages/services/AirFreight.jsx'));
const OceanFreight = lazy(() => import('./pages/services/OceanFreight.jsx'));
const DoorToDoor = lazy(() => import('./pages/services/DoorToDoor.jsx'));
const ShipmentInsurance = lazy(() => import('./pages/services/ShipmentInsurance.jsx'));
const WarehouseConsolidation = lazy(() => import('./pages/services/WarehouseConsolidation.jsx'));
const CustomsClearance = lazy(() => import('./pages/services/CustomsClearance.jsx'));
const AssistedPurchaseRequest = lazy(() => import('./pages/services/AssistedPurchaseRequest.jsx'));
const SelfPurchaseRequest = lazy(() => import('./pages/services/SelfPurchaseRequest.jsx'));
const AssistedPurchaseEdit = lazy(() => import('./pages/services/AssistedPurchaseEdit.jsx'));
const SelfPurchaseEdit = lazy(() => import('./pages/services/SelfPurchaseEdit.jsx'));
const BookShipmentRequest = lazy(() => import('./pages/BookShipmentRequest.jsx'));
const BookShipmentEdit = lazy(() => import('./pages/BookShipmentEdit.jsx'));
const HowItWorks = lazy(() => import('./pages/HowItWorks.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Policy = lazy(() => import('./pages/Policy.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const TermsOfService = lazy(() => import('./pages/policy/TermsOfService.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/policy/PrivacyPolicy.jsx'));
const ProhibitedItems = lazy(() => import('./pages/policy/ProhibitedItems.jsx'));
const CancellationPolicy = lazy(() => import('./pages/policy/CancellationPolicy.jsx'));
const PaymentPolicy = lazy(() => import('./pages/policy/PaymentPolicy.jsx'));
const ReturnPolicy = lazy(() => import('./pages/policy/ReturnPolicy.jsx'));
const ExportFailedDeliveryPolicy = lazy(() => import('./pages/policy/ExportFailedDeliveryPolicy.jsx'));
const InsurancePolicy = lazy(() => import('./pages/policy/InsurancePolicy.jsx'));

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
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />
          <Route
            path="/quote"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <QuoteCalculator />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/track"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <TrackShipment />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/track/:trackingNumber"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <TrackShipment />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />

          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/my-shipments"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <MyShipments />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/insurance"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Insurance />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/return-rto"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <ReturnRTO />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/book"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <BookShipment />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/wallet"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/payments"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
           <Route
             path="/shipments/:id"
             element={
               <DashboardLayout>
                 <ProtectedRoute>
                   <ShipmentDetail />
                 </ProtectedRoute>
               </DashboardLayout>
             }
           />
           <Route
             path="/shipment-view/:id"
             element={
               <DashboardLayout>
                 <ProtectedRoute>
                   <ShipmentView />
                 </ProtectedRoute>
               </DashboardLayout>
             }
           />
           <Route
             path="/checkout/:shipmentId"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />

          <Route
            path="/request/:requestId"
            element={
              <DashboardLayout>
                <ProtectedRoute>
                  <RequestDetail />
                </ProtectedRoute>
              </DashboardLayout>
            }
          />
          <Route path="/services/assisted-purchase" element={<DashboardLayout><ProtectedRoute><AssistedPurchase /></ProtectedRoute></DashboardLayout>} />
          <Route path="/services/assisted-purchase/:id" element={<DashboardLayout><ProtectedRoute><AssistedPurchaseRequest /></ProtectedRoute></DashboardLayout>} />
          <Route path="/services/assisted-purchase/:id/edit" element={<DashboardLayout><ProtectedRoute><AssistedPurchaseEdit /></ProtectedRoute></DashboardLayout>} />
          <Route path="/services/self-purchase" element={<DashboardLayout><ProtectedRoute><SelfPurchase /></ProtectedRoute></DashboardLayout>} />
          <Route path="/services/self-purchase/:id" element={<DashboardLayout><ProtectedRoute><SelfPurchaseRequest /></ProtectedRoute></DashboardLayout>} />
          <Route path="/services/self-purchase/:id/edit" element={<DashboardLayout><ProtectedRoute><SelfPurchaseEdit /></ProtectedRoute></DashboardLayout>} />
          <Route path="/services/book-shipment/:id" element={<DashboardLayout><ProtectedRoute><BookShipmentRequest /></ProtectedRoute></DashboardLayout>} />
          <Route path="/services/book-shipment/:id/edit" element={<DashboardLayout><ProtectedRoute><BookShipmentEdit /></ProtectedRoute></DashboardLayout>} />
          <Route path="/services/export-import" element={<PublicLayout><ExportImport /></PublicLayout>} />
          <Route path="/services/air-freight" element={<PublicLayout><AirFreight /></PublicLayout>} />
          <Route path="/services/ocean-freight" element={<PublicLayout><OceanFreight /></PublicLayout>} />
          <Route path="/services/door-to-door" element={<PublicLayout><DoorToDoor /></PublicLayout>} />
          <Route path="/services/return-rto" element={<PublicLayout><ReturnRTO /></PublicLayout>} />
          <Route path="/services/shipment-insurance" element={<PublicLayout><ShipmentInsurance /></PublicLayout>} />
          <Route path="/services/warehouse-consolidation" element={<PublicLayout><WarehouseConsolidation /></PublicLayout>} />
          <Route path="/services/customs-clearance" element={<PublicLayout><CustomsClearance /></PublicLayout>} />

          <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
          <Route path="/policy" element={<PublicLayout><Policy /></PublicLayout>} />
          <Route path="/policy/terms-of-service" element={<PublicLayout><TermsOfService /></PublicLayout>} />
          <Route path="/policy/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
          <Route path="/policy/prohibited-items" element={<PublicLayout><ProhibitedItems /></PublicLayout>} />
          <Route path="/policy/cancellation-policy" element={<PublicLayout><CancellationPolicy /></PublicLayout>} />
          <Route path="/policy/payment-policy" element={<PublicLayout><PaymentPolicy /></PublicLayout>} />
          <Route path="/policy/return-policy" element={<PublicLayout><ReturnPolicy /></PublicLayout>} />
          <Route path="/policy/export-failed-delivery-policy" element={<PublicLayout><ExportFailedDeliveryPolicy /></PublicLayout>} />
          <Route path="/policy/insurance-policy" element={<PublicLayout><InsurancePolicy /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />

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
