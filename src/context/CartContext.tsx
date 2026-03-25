import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';
import { CartItem, Order } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  checkout: (customerDetails: { 
    name: string; 
    phone: string; 
    paymentMethod: 'advance' | 'full'; 
    paymentType: 'qr' | 'upi' | 'phonepe'; 
    payableAmount: number;
    transactionId?: string;
    bookingDetails?: {
      people: string;
      tableType?: string;
    }
  }) => Promise<Order | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('coffee99_cart');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      // Ensure all prices are numbers
      return Array.isArray(parsed) ? parsed.map(item => ({
        ...item,
        price: parsePrice(item.price)
      })) : [];
    } catch (e) {
      console.error('Error parsing saved cart:', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('coffee99_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, price: parsePrice(item.price), quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = async (details: { 
    name: string; 
    phone: string; 
    paymentMethod: 'advance' | 'full'; 
    paymentType: 'qr' | 'upi' | 'phonepe'; 
    payableAmount: number;
    transactionId?: string;
    bookingDetails?: {
      people: string;
      tableType?: string;
    }
  }) => {
    if (cart.length === 0) return null;

    const orderData = {
      user_id: user?.id || null,
      branch_id: cart[0]?.branchId || 'default',
      customer_name: details.name,
      customer_phone: details.phone,
      items: cart,
      total_price: cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
      status: 'pending',
      payment_method: details.paymentMethod,
      payment_type: details.paymentType,
      payable_amount: details.payableAmount,
      transaction_id: details.transactionId || `TXN-${Date.now()}`,
      booking_details: details.bookingDetails,
      created_at: new Date().toISOString(),
    };

    console.log('Attempting to place order with data:', orderData);

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) {
      console.error('Detailed Supabase Error:', error);
      throw new Error(`Order Failed: ${error.message} (Code: ${error.code})`);
    }

    if (!data || data.length === 0) {
      console.warn('Order saved but could not be retrieved immediately (likely RLS). Proceeding with local data.');
      // Return a mock order object with a temporary ID so the UI doesn't crash
      return { ...orderData, id: `TEMP-${Date.now()}` } as Order;
    }

    return data[0] as Order;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const parsePrice = (p: any): number => {
    if (typeof p === 'number') return p;
    if (!p) return 0;
    // Extract first number from string (handles "Rs. 90/-", "₹119", "₹80 / ₹90")
    const match = String(p).match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
