import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
const Blogs = lazy(() => import('./pages/Blogs'));
const CreatorProgram = lazy(() => import('./pages/CreatorProgram'));
const OfferDetail = lazy(() => import('./pages/OfferDetail'));
const HotItems = lazy(() => import('./pages/HotItems'));
const HotItemDetail = lazy(() => import('./pages/HotItemDetail'));

// Loading fallback component
const PageLoader = ({ isDark }: { isDark?: boolean }) => (
  <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f0f0f]' : 'bg-cream-bg'}`}>
    <div className={`w-12 h-12 border-4 ${isDark ? 'border-[#ff3c3c]' : 'border-primary-brown'} border-t-transparent rounded-full animate-spin`}></div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isDarkPage = location.pathname === '/blogs' || location.pathname === '/creator-program' || location.pathname.startsWith('/hot-items');

  return (
    <div className={`min-h-screen font-sans ${isDarkPage ? 'bg-[#0f0f0f]' : 'bg-cream-bg'}`}>
      {!isDarkPage && <Navbar />}
      <main>
        <Suspense fallback={<PageLoader isDark={isDarkPage} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/branch/:id" element={<Branch />} />
            <Route path="/branch/:id/menu" element={<BranchMenu />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/creator-program" element={<CreatorProgram />} />
            <Route path="/admin/:branchId/login" element={<AdminLogin />} />
            <Route path="/admin/:branchId/panel" element={<AdminPanel />} />
            <Route path="/checkout/choice" element={<Checkout />} />
            <Route path="/checkout/pay-50" element={<Payment50 />} />
            <Route path="/checkout/pay-100" element={<Payment100 />} />
            <Route path="/order-placed" element={<OrderPlaced />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/track-order/:id" element={<TrackOrder />} />
            <Route path="/offer/:id" element={<OfferDetail />} />
            <Route path="/hot-items" element={<HotItems />} />
            <Route path="/hot-items/:slug" element={<HotItemDetail />} />
          </Routes>
        </Suspense>
      </main>
      {!isDarkPage && <Footer />}
      <Cart />
    </div>
  );
}

export default function App() {
  React.useEffect(() => {
    const checkHealth = async (retries = 6) => {
      // Small staggered delay to give server time to stabilize
      if (retries === 6) await new Promise(r => setTimeout(r, 1000));

      try {
        const url = `/api/health?t=${Date.now()}`;
        console.log(`[App] API Health Check (Attempt: ${7 - retries})`);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log('[App] API Health Check Success:', data.status);
      } catch (err) {
        console.error('[App] API Health Check Failed:', err);
        if (retries > 0) {
          const delay = 3000;
          setTimeout(() => checkHealth(retries - 1), delay);
        }
      }
    };
    checkHealth();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ReviewProvider>
          <CartProvider>
            <Router>
              <ScrollToHash />
              <AppContent />
            </Router>
          </CartProvider>
        </ReviewProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
