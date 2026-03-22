import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';

export default function Payment100() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-roast pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-primary-brown transition-colors mb-8 group"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Choice</span>
        </motion.button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Complete Your Booking</h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            Pay the full amount now for a completely hassle-free dining experience.
          </p>
        </div>

        <PaymentForm paymentMethod="full" title="Pay 100% & Confirm Table" />
      </div>
    </div>
  );
}
