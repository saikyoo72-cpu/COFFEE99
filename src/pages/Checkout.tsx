import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Wallet, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-dark-roast pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-primary-brown transition-colors mb-8 group"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Menu</span>
        </motion.button>

        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            Payment Choice
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block bg-primary-brown/10 px-8 py-4 rounded-3xl border border-primary-brown/20"
          >
            <p className="text-gray-400 text-sm font-light mb-1">Total Cart Amount</p>
            <p className="text-3xl font-serif font-bold text-white">₹{(totalPrice || 0).toFixed(2)}</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* 50% Option */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/checkout/pay-50')}
            className="group relative bg-latte-beige p-8 rounded-[40px] border border-white/5 hover:border-primary-brown/30 transition-all text-center flex flex-col items-center gap-6 shadow-xl"
          >
            <div className="w-20 h-20 bg-primary-brown/10 rounded-full flex items-center justify-center group-hover:bg-primary-brown transition-colors">
              <Wallet className="h-10 w-10 text-primary-brown group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Pay 50%</h3>
              <p className="text-gray-400 text-sm font-light">Book your table now and pay the rest later at the restaurant.</p>
            </div>
            <div className="w-full py-4 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] group-hover:bg-white group-hover:text-black transition-all">
              Book a Table
            </div>
          </motion.button>

          {/* 100% Option */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/checkout/pay-100')}
            className="group relative bg-latte-beige p-8 rounded-[40px] border border-white/5 hover:border-primary-brown/30 transition-all text-center flex flex-col items-center gap-6 shadow-xl"
          >
            <div className="w-20 h-20 bg-primary-brown/10 rounded-full flex items-center justify-center group-hover:bg-primary-brown transition-colors">
              <CreditCard className="h-10 w-10 text-primary-brown group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Pay 100%</h3>
              <p className="text-gray-400 text-sm font-light">Pay the full amount now for a completely seamless dining experience.</p>
            </div>
            <div className="w-full py-4 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] group-hover:bg-white group-hover:text-black transition-all">
              Book a Table
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
