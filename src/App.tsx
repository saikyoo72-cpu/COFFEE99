import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Branch from './pages/Branch';
import Menu from './pages/Menu';
import BranchMenu from './pages/BranchMenu';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Checkout from './pages/Checkout';
import Payment50 from './pages/Payment50';
import Payment100 from './pages/Payment100';
import OrderPlaced from './pages/OrderPlaced';
import TrackOrder from './pages/TrackOrder';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Cart from './components/Cart';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
            <Router>
            <div className="min-h-screen bg-beige font-sans selection:bg-brand-red/10 selection:text-brand-red">
            <Navbar />
            <main>
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
            </main>
            <Footer />
            <Cart />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}
