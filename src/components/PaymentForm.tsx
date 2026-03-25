import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, Users, Layout, CreditCard, Loader2, CheckCircle2, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface PaymentFormProps {
  paymentMethod: 'advance' | 'full';
  title: string;
}

export default function PaymentForm({ paymentMethod, title }: PaymentFormProps) {
  const navigate = useNavigate();
  const { cart, totalPrice, checkout, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'payment' | 'details'>('payment');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    people: '2',
    tableType: 'Standard'
  });

  const advanceAmount = totalPrice * 0.5;
  const payableAmount = paymentMethod === 'advance' ? advanceAmount : totalPrice;
  
  const upiLink = `upi://pay?pa=q941102797@ybi&pn=Inns Cafe Lounge&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=224x224&data=${encodeURIComponent(upiLink)}`;

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      const order = await checkout({
        name: formData.name,
        phone: formData.phone,
        paymentMethod,
        paymentType: 'qr', 
        payableAmount,
        bookingDetails: {
          people: formData.people,
          tableType: formData.tableType
        }
      });

      if (!order) throw new Error('Checkout failed');

      navigate('/order-placed', { 
        state: { 
          order, 
          formData, 
          cart: [...cart], 
          totalPrice,
          message: paymentMethod === 'advance' 
            ? "Order placed successfully. Please visit the cafe and pay remaining amount."
            : "Order placed successfully. Thank you for your full payment!"
        } 
      });
      clearCart();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-latte-beige p-8 rounded-[40px] border border-white/5 shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {step === 'payment' ? (
            <motion.div
              key="payment-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-8 flex items-center justify-center gap-3">
                <Wallet className="h-6 w-6 text-primary-brown" />
                Pay Advance to Book
              </h2>

              <div className="inline-block p-6 bg-white rounded-[40px] shadow-2xl border border-white/5 mb-6">
                <img 
                  src={qrCodeUrl} 
                  alt="COFFEE99 UPI QR Code" 
                  className="w-56 h-56 mx-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-primary-brown uppercase tracking-[0.2em]">COFFEE99 UPI</p>
                  <p className="text-xs text-gray-400 font-medium">q941102797@ybi</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-white font-bold text-lg mb-2">Payable Amount: ₹{(payableAmount || 0).toFixed(2)}</p>
                <p className="text-sm text-gray-400 font-light max-w-xs mx-auto">
                  Scan this QR code using any UPI app (PhonePe, Google Pay, Paytm) and complete the payment.
                </p>
              </div>

              <button
                onClick={() => setStep('details')}
                className="w-full py-5 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-primary-brown/40"
              >
                I Have Paid Advance
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="details-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                <User className="h-6 w-6 text-primary-brown" />
                Customer Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center"
                  >
                    {error}
                  </motion.div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        required
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-brown transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        required
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-brown transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Number of People</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <select
                        value={formData.people}
                        onChange={e => setFormData({ ...formData, people: e.target.value })}
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-brown transition-colors appearance-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                          <option key={n} value={n} className="bg-dark-roast">{n} People</option>
                        ))}
                        <option value="8+" className="bg-dark-roast">8+ People</option>
                      </select>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center"
                  >
                    {error}
                  </motion.div>
                )}
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="flex-1 py-5 bg-white/5 text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-[2] py-5 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-primary-brown/40 flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Confirm Order'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-latte-beige p-8 rounded-[40px] border border-white/5 shadow-2xl">
          <h2 className="text-xl font-serif font-bold text-white mb-6">Order Summary</h2>
          <div className="space-y-4 pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-white font-bold">₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>₹{(totalPrice || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-2">
              <span>{paymentMethod === 'advance' ? '50% Payable Now' : 'Total Payable'}</span>
              <span className="text-primary-brown">₹{(payableAmount || 0).toFixed(2)}</span>
            </div>
            {paymentMethod === 'advance' && (
              <p className="text-[10px] text-gray-500 italic text-right mt-2">
                Remaining ₹{( (totalPrice || 0) - (payableAmount || 0) ).toFixed(2)} to be paid at the restaurant.
              </p>
            )}
          </div>
        </div>

        <div className="bg-primary-brown/5 border border-primary-brown/10 p-6 rounded-3xl">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-primary-brown font-bold uppercase block mb-1">Note:</span>
            Your table will be reserved for 15 minutes from the booking time. Please show the confirmation message at the reception.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
