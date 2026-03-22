import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Home, ChevronRight } from 'lucide-react';

export default function OrderPlaced() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, formData, cart, totalPrice, message } = location.state || {};

  if (!order) {
    return (
      <div className="min-h-screen bg-dark-roast flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">No order details found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary-brown text-white rounded-xl uppercase tracking-widest text-sm font-bold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-roast pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-latte-beige p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            {message || "Your Order Has Been Placed Successfully!"}
          </h1>
          <p className="text-gray-400 font-light mb-10">
            Thank you for your order. Please show this confirmation at the counter.
          </p>
          
          <div className="bg-black/40 rounded-3xl p-8 text-left space-y-6 border border-white/5 mb-10">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-primary-brown uppercase tracking-widest mb-1">Customer Name</p>
                <p className="text-white font-medium">{formData.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary-brown uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-white font-medium">{formData.phone}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-primary-brown uppercase tracking-widest mb-4">Order Summary</p>
              <div className="space-y-3">
                {cart.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-300 font-light">
                      {item.name} <span className="text-primary-brown font-bold ml-1">x{item.quantity}</span>
                    </span>
                    <span className="text-white font-bold">₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <span className="text-white font-serif font-bold">Total Amount</span>
                  <span className="text-2xl font-serif font-bold text-primary-brown">₹{(totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
              <span className="text-white font-mono text-xs">#{order.id ? order.id.toString().slice(0, 12).toUpperCase() : 'N/A'}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 py-5 px-12 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-primary-brown/40"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
