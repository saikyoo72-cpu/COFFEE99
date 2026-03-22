import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, ChevronRight, Clock, CheckCircle2, Coffee, Truck, MapPin, Search, X } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string; description: string }> = {
  pending: { label: 'Order Placed', icon: Clock, color: 'text-yellow-500', description: 'Waiting for confirmation' },
  confirmed: { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500', description: 'Restaurant has accepted your order' },
  preparing: { label: 'Preparing', icon: Coffee, color: 'text-orange-500', description: 'Your coffee is being brewed' },
  'out-for-delivery': { label: 'Out for Delivery', icon: Truck, color: 'text-purple-500', description: 'Our rider is on the way' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-500', description: 'Enjoy your coffee!' },
  cancelled: { label: 'Cancelled', icon: X, color: 'text-red-500', description: 'Order was cancelled' },
};

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];

export default function TrackOrder() {
  const { id } = useParams();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState(id || '');

  useEffect(() => {
    if (id) {
      setSearchId(id);
    }
  }, [id]);

  useEffect(() => {
    if (user || searchId) {
      fetchOrders();
      
      // Subscribe to real-time updates
      const channelName = user ? `orders_user_${user.id}` : `orders_id_${searchId}`;
      const filter = user ? `user_id=eq.${user.id}` : `id=eq.${searchId}`;

      const subscription = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: filter }, () => {
          fetchOrders();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [user, searchId]);

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select('*');
      
      if (user) {
        query = query.eq('user_id', user.id);
      } else if (searchId) {
        // If not logged in, only allow fetching by exact ID
        query = query.eq('id', searchId);
      } else {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: OrderStatus) => {
    return statusOrder.indexOf(status);
  };

  if (!user && !searchId) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-primary-brown/10 rounded-full flex items-center justify-center mb-6">
          <Package className="h-10 w-10 text-primary-brown" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-dark-roast mb-4">Track Your Order</h1>
        <p className="text-gray-500 max-w-md mb-8">Please sign in to view your order history, or enter your Order ID below to track a specific order.</p>
        <div className="relative group max-w-sm w-full mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-brown transition-colors" />
          <input 
            type="text"
            placeholder="Enter Order ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-transparent focus:border-primary-brown/30 rounded-2xl outline-none transition-all shadow-sm font-light"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-beige">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-dark-roast mb-2 flex items-center gap-3">
              Track Your Orders
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Live
              </span>
            </h1>
            <p className="text-gray-500 font-light">Real-time updates for your delicious coffee</p>
          </div>
          
          <div className="relative group max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-brown transition-colors" />
            <input 
              type="text"
              placeholder="Search by Order ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-transparent focus:border-primary-brown/30 rounded-2xl outline-none transition-all shadow-sm font-light"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-brown border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[40px] p-12 text-center shadow-xl border border-white/5">
            <div className="w-20 h-20 bg-primary-brown/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-primary-brown" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-dark-roast mb-2">No orders found</h3>
            <p className="text-gray-500 font-light mb-8">You haven't placed any orders yet. Time for some coffee?</p>
            <a 
              href="/menu" 
              className="inline-block px-8 py-4 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-dark-roast transition-all shadow-lg shadow-primary-brown/20"
            >
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {orders
              .filter(order => order.id.toLowerCase().includes(searchId.toLowerCase()))
              .map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-white/5"
              >
                {/* Order Header */}
                <div className="p-8 bg-latte-beige flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Package className="h-8 w-8 text-primary-brown" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-primary-brown uppercase tracking-widest mb-1">Order ID</p>
                      <h3 className="text-xl font-serif font-bold text-dark-roast">#{order.id.slice(0, 8).toUpperCase()}</h3>
                      <p className="text-xs text-gray-500 font-light">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-primary-brown uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-2xl font-serif font-bold text-dark-roast">₹{(order.total_price || 0).toFixed(2)}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white ${statusConfig[order.status].color} shadow-sm`}>
                      {statusConfig[order.status].label}
                    </div>
                  </div>
                </div>

                {/* Tracking Progress */}
                {order.status !== 'cancelled' && (
                  <div className="p-8 border-b border-gray-100">
                    <div className="relative flex justify-between">
                      {/* Progress Line */}
                      <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(getStatusIndex(order.status) / (statusOrder.length - 1)) * 100}%` }}
                          className="h-full bg-primary-brown"
                        />
                      </div>

                      {statusOrder.map((status, index) => {
                        const Icon = statusConfig[status].icon;
                        const isActive = getStatusIndex(order.status) >= index;
                        const isCurrent = order.status === status;

                        return (
                          <div key={status} className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                              isActive ? 'bg-primary-brown text-white scale-110 shadow-lg' : 'bg-gray-100 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-primary-brown/20' : ''}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <p className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${
                              isActive ? 'text-primary-brown' : 'text-gray-400'
                            }`}>
                              {statusConfig[status].label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-sm font-bold text-dark-roast uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-primary-brown" />
                        Order Items
                      </h4>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="flex-grow">
                              <p className="text-sm font-bold text-dark-roast">{item.name}</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">x{item.quantity} • {item.branchName}</p>
                            </div>
                            <p className="text-sm font-bold text-dark-roast">₹{((item.price || 0) * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h4 className="text-sm font-bold text-dark-roast uppercase tracking-widest mb-6 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary-brown" />
                          Delivery Details
                        </h4>
                        <div className="bg-latte-beige/30 p-6 rounded-3xl space-y-3">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500 font-light">Customer</span>
                            <span className="text-xs font-bold text-dark-roast">{order.customer_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500 font-light">Phone</span>
                            <span className="text-xs font-bold text-dark-roast">{order.customer_phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500 font-light">Payment</span>
                            <span className="text-xs font-bold text-dark-roast uppercase tracking-widest">{order.payment_method} ({order.payment_type})</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary-brown text-white p-6 rounded-3xl shadow-lg shadow-primary-brown/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="h-5 w-5" />
                          <p className="text-xs font-bold uppercase tracking-widest">Current Status</p>
                        </div>
                        <p className="text-xl font-serif font-bold mb-1">{statusConfig[order.status].label}</p>
                        <p className="text-xs font-light opacity-80">{statusConfig[order.status].description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
