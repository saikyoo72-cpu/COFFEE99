import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Home, ChevronRight, Star, Send, X } from 'lucide-react';
import { useReviews } from '../context/ReviewContext';

export default function OrderPlaced() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addReview } = useReviews();
  const { order, formData, cart, totalPrice, message } = location.state || {};
  
  const [showReviewModal, setShowReviewModal] = useState(true);
  const [review, setReview] = useState({ name: formData?.name || '', text: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (review.name && review.text) {
      addReview(review);
      setSubmitted(true);
      setTimeout(() => setShowReviewModal(false), 2000);
    }
  };

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
                    <span className="text-white font-bold">₹{(Number(item.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <span className="text-white font-serif font-bold">Total Amount</span>
                  <span className="text-2xl font-serif font-bold text-primary-brown">₹{Number(totalPrice || 0).toFixed(2)}</span>
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

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-latte-beige w-full max-w-md p-8 rounded-[40px] border border-white/10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {!submitted ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-brown/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-primary-brown fill-primary-brown" />
                    </div>
                    <h2 className="text-2xl font-serif text-white">How was your <span className="italic text-primary-brown">Experience?</span></h2>
                    <p className="text-gray-400 text-sm font-light mt-2">Your feedback helps us grow!</p>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReview({ ...review, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-8 w-8 transition-all ${
                              star <= review.rating ? 'fill-primary-brown text-primary-brown scale-110' : 'text-white/20'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={review.name}
                        onChange={(e) => setReview({ ...review, name: e.target.value })}
                        className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-brown transition-all"
                      />
                      <textarea
                        placeholder="What did you love about your order?"
                        required
                        rows={4}
                        value={review.text}
                        onChange={(e) => setReview({ ...review, text: e.target.value })}
                        className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-brown transition-all resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-5 bg-primary-brown text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-primary-brown/30 flex items-center justify-center gap-3"
                    >
                      Submit Review <Send className="h-5 w-5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-serif text-white mb-2">Thank You!</h2>
                  <p className="text-gray-400 font-light">Your review has been added to our wall.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
