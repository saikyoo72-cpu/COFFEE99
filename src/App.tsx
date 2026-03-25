import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ReviewProvider } from './context/ReviewContext';
import Cart from './components/Cart';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToHash from './components/ScrollToHash';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Branch = lazy(() => import('./pages/Branch'));
const Menu = lazy(() => import('./pages/Menu'));
const BranchMenu = lazy(() => import('./pages/BranchMenu'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Payment50 = lazy(() => import('./pages/Payment50'));
const Payment100 = lazy(() => import('./pages/Payment100'));
const OrderPlaced = lazy(() => import('./pages/OrderPlaced'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-bg">
    <div className="w-12 h-12 border-4 border-primary-brown border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ReviewProvider>
          <CartProvider>
            <Router>
              <ScrollToHash />
              <div className="min-h-screen bg-cream-bg font-sans">
                <Navbar />
                <main>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/branch/:id" element={<Branch />} />
                      <Route path="/branch/:id/menu" element={<BranchMenu />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/admin/:branchId/login" element={<AdminLogin />} />
                      <Route path="/admin/:branchId/panel" element={<AdminPanel />} />
                      <Route path="/checkout/choice" element={<Checkout />} />
                      <Route path="/checkout/pay-50" element={<Payment50 />} />
                      <Route path="/checkout/pay-100" element={<Payment100 />} />
                      <Route path="/order-placed" element={<OrderPlaced />} />
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/track-order/:id" element={<TrackOrder />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <Cart />
              </div>
            </Router>
          </CartProvider>
        </ReviewProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
