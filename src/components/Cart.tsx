import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const { cart, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Cart Button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCart}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-[60] bg-primary-brown text-white p-4 rounded-full shadow-2xl hover:bg-white hover:text-black transition-all group flex items-center justify-center border-2 border-white/10"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-white text-primary-brown text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary-brown group-hover:border-white transition-colors">
                {totalItems}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 bg-dark-roast/40 backdrop-blur-sm z-[60]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-cream-bg shadow-2xl z-[70] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-latte-beige">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-brown p-2 rounded-xl">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white">
                    Your Cart
                  </h2>
                </div>
                <button
                  onClick={toggleCart}
                  className="p-2 hover:bg-black rounded-xl transition-colors text-gray-500 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                    <div className="w-20 h-20 bg-primary-brown/10 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-10 w-10 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white">Your cart is empty</h3>
                      <p className="text-gray-500 text-sm font-light">Add some delicious coffee to get started!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        className="flex gap-4 bg-latte-beige p-4 rounded-3xl shadow-sm border border-white/5"
                      >
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-serif font-bold text-white truncate pr-2">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-600 hover:text-primary-brown transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-[10px] text-primary-brown font-bold uppercase tracking-widest mb-2">{item.branchName}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-white font-bold">₹{Number(item.price || 0).toFixed(2)}</span>
                            <div className="flex items-center bg-black rounded-xl p-1">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-latte-beige rounded-lg transition-colors text-primary-brown"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-latte-beige rounded-lg transition-colors text-primary-brown"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-latte-beige border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 font-light">Total Amount</span>
                    <span className="text-2xl font-serif font-bold text-white">₹{Number(totalPrice || 0).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/checkout/choice');
                    }}
                    className="w-full py-4 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-primary-brown/40"
                  >
                    Order Now
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
