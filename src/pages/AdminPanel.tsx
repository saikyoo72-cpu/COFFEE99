import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabase';
import { Order } from '../types';
import { branches } from '../data';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  LogOut,
  TrendingUp,
  Clock,
  Menu,
  X,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Loader2,
  RefreshCw,
  Trash2,
  Eye,
  Settings,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'customers' | 'settings';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    isDanger?: boolean;
  } | null>(null);

  const branch = branches.find(b => b.id === branchId);
  const [storeName, setStoreName] = useState<string>(branch?.name || 'Coffee 99');

  const [realtimeStatus, setRealtimeStatus] = useState<string>('connecting');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = sessionStorage.getItem(`admin_auth_${branchId}`);
      if (isAuth !== 'true') {
        navigate(`/admin/${branchId}/login`);
        return;
      }
      fetchData();
    };

    checkAuth();

    // Set up real-time subscription
    setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Initializing subscription for branch: ${branchId}`);
    
    const channel = supabase
      .channel(`admin_orders_${branchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `branch_id=eq.${branchId}`
        },
        (payload) => {
          console.log('Real-time payload received:', payload);
          setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Event: ${payload.eventType} for ID: ${(payload.new as any)?.id || (payload.old as any)?.id}`);
          
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            setOrders(prev => {
              if (prev.find(o => o.id === newOrder.id)) return prev;
              return [newOrder, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id === payload.old.id));
          }
        }
      )
      .subscribe((status, err) => {
        console.log(`Real-time subscription status for ${branchId}:`, status);
        setRealtimeStatus(status);
        if (err) {
          setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Error: ${err.message}`);
        } else {
          setDebugInfo(prev => prev + `\n[${new Date().toLocaleTimeString()}] Status changed to: ${status}`);
        }
        
        if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription failed. Retrying in 5s...');
          setTimeout(fetchData, 5000);
        }
      });

    return () => {
      console.log(`Cleaning up real-time for branch: ${branchId}`);
      supabase.removeChannel(channel);
    };
  }, [navigate, branchId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
      
      // Fetch store settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('admin_settings')
        .select('store_name, store_email, store_address')
        .eq('branch_id', branchId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      if (settingsData?.store_name) setStoreName(settingsData.store_name);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? data : o));
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setConfirmConfig({
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order? This action cannot be undone.',
      isDanger: true,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);
          
          if (error) throw error;
          
          setOrders(prev => prev.filter(o => o.id !== orderId));
          setIsConfirmModalOpen(false);
        } catch (err) {
          console.error('Delete order error:', err);
        }
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleClearAllOrders = () => {
    setConfirmConfig({
      title: 'Clear All Orders',
      message: 'Are you sure you want to delete ALL orders for this branch? This action is permanent and cannot be undone.',
      isDanger: true,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('orders')
            .delete()
            .eq('branch_id', branchId);
          
          if (error) throw error;
          
          setOrders([]);
          setIsConfirmModalOpen(false);
        } catch (err) {
          console.error('Clear orders error:', err);
        }
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem(`admin_auth_${branchId}`);
    navigate(`/admin/${branchId}/login`);
  };

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_price, 0);

  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length;
  
  const uniqueCustomers = new Set(orders.map(o => o.customer_phone)).size;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Active Orders', value: activeOrders.toString(), icon: ShoppingBag, color: 'text-red-500' },
    { label: 'Total Customers', value: uniqueCustomers.toString(), icon: Users, color: 'text-red-400' },
  ];

  const customers = Array.from(new Set(orders.map(o => o.customer_phone))).map(phone => {
    const customerOrders = orders.filter(o => o.customer_phone === phone);
    const lastOrder = customerOrders[0];
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total_price, 0);
    return {
      name: lastOrder?.customer_name || 'Customer',
      phone: phone,
      orders: customerOrders.length,
      spent: `₹${totalSpent.toLocaleString()}`,
      status: customerOrders.length > 5 ? 'VIP' : 'Active'
    };
  });

  const renderDashboard = () => (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-soft-cream p-6 rounded-2xl shadow-sm border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-black/40 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-soft-cream rounded-2xl shadow-sm border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <div className="flex gap-4 items-center">
            <button 
              onClick={handleClearAllOrders}
              className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all"
            >
              Clear All Orders
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-primary-brown font-bold text-sm hover:underline"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/20 text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{order.customer_name}</span>
                        <span className="text-[10px] text-gray-500">{order.customer_phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">₹{Number(order.payable_amount || 0).toFixed(2)}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                          {order.payment_method === 'advance' ? `Bal: ₹${(Number(order.total_price || 0) - Number(order.payable_amount || 0)).toFixed(2)}` : 'Full Paid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleUpdateStatus(order.id, order.status === 'pending' ? 'confirmed' : 'pending')}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                          order.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-400'
                        }`}
                      >
                        {order.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(order.created_at).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-primary-brown transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-12 pr-4 py-3 bg-soft-cream border border-white/10 text-white rounded-xl outline-none focus:border-primary-brown transition-all"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 py-3 bg-soft-cream border border-white/10 rounded-xl font-medium text-gray-300 hover:bg-white/5 transition-all">
            <Filter className="h-5 w-5" /> Filter
          </button>
          <button 
            onClick={handleClearAllOrders}
            className="flex-grow sm:flex-grow-0 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            Clear All
          </button>
          <button className="flex-grow sm:flex-grow-0 px-6 py-3 bg-primary-brown text-white rounded-xl font-bold hover:bg-caramel transition-all shadow-lg shadow-primary-brown/20">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-soft-cream rounded-2xl shadow-sm border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/20 text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{order.customer_name}</span>
                        <span className="text-[10px] text-gray-500">{order.customer_phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Paid:</span>
                          <span className="text-white font-bold text-sm">₹{(order.payable_amount || 0).toFixed(2)}</span>
                        </div>
                        {order.payment_method === 'advance' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Due:</span>
                            <span className="text-gray-400 text-sm">₹${(Number(order.total_price || 0) - Number(order.payable_amount || 0)).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">₹{Number(order.total_price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleUpdateStatus(order.id, order.status === 'pending' ? 'confirmed' : 'pending')}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                          order.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-400'
                        }`}
                      >
                        {order.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 font-medium">{order.customer_phone}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-primary-brown transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-12 pr-4 py-3 bg-soft-cream border border-white/10 text-white rounded-xl outline-none focus:border-primary-brown transition-all"
          />
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-primary-brown text-white rounded-xl font-bold hover:bg-caramel transition-all shadow-lg shadow-primary-brown/20">
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-soft-cream p-6 rounded-2xl shadow-sm border border-white/5 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-primary-brown font-bold text-xl">
                {customer.name.charAt(0)}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                customer.status === 'VIP' ? 'bg-purple-500/10 text-purple-400' :
                customer.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                'bg-green-500/10 text-green-500'
              }`}>
                {customer.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{customer.name}</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" /> {customer.phone}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Orders</p>
                <p className="font-bold text-white">{customer.orders}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Spent</p>
                <p className="font-bold text-white">{customer.spent}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [settingsStoreName, setSettingsStoreName] = useState('');
  const [settingsStoreEmail, setSettingsStoreEmail] = useState('');
  const [settingsStoreAddress, setSettingsStoreAddress] = useState('');

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('store_name, store_email, store_address')
        .eq('branch_id', branchId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettingsStoreName(data.store_name || branch?.name || '');
        setSettingsStoreEmail(data.store_email || 'admin@coffee99.in');
        setSettingsStoreAddress(data.store_address || branch?.address || '');
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingSettings(true);
    setSettingsStatus(null);

    try {
      const updates: any = {
        branch_id: branchId,
        updated_at: new Date().toISOString(),
        store_name: settingsStoreName,
        store_email: settingsStoreEmail,
        store_address: settingsStoreAddress
      };

      if (newPassword && newPassword.length >= 4) {
        updates.password = newPassword;
      }

      const { error } = await supabase
        .from('admin_settings')
        .upsert(updates, { onConflict: 'branch_id' });

      if (error) throw error;

      setSettingsStatus({ type: 'success', message: 'Settings updated successfully!' });
      setNewPassword('');
      setStoreName(settingsStoreName);
    } catch (err: any) {
      setSettingsStatus({ type: 'error', message: err.message });
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const renderSettings = () => (
    <div className="max-w-3xl space-y-8">
      <form onSubmit={handleUpdateSettings} className="space-y-8">
        {/* Store Information */}
        <div className="bg-soft-cream p-8 rounded-[32px] shadow-sm border border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary-brown/10 rounded-2xl flex items-center justify-center text-primary-brown">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Store Information</h2>
              <p className="text-gray-400 text-sm">Customize your cafe's public details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Store Name</label>
              <input 
                type="text" 
                value={settingsStoreName}
                onChange={(e) => setSettingsStoreName(e.target.value)}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-primary-brown transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Contact Email</label>
              <input 
                type="email" 
                value={settingsStoreEmail}
                onChange={(e) => setSettingsStoreEmail(e.target.value)}
                className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-primary-brown transition-all" 
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Store Address</label>
            <textarea 
              value={settingsStoreAddress}
              onChange={(e) => setSettingsStoreAddress(e.target.value)}
              rows={3}
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-primary-brown transition-all resize-none"
            ></textarea>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-soft-cream p-8 rounded-[32px] shadow-sm border border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary-brown/10 rounded-2xl flex items-center justify-center text-primary-brown">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Security Settings</h2>
              <p className="text-gray-400 text-sm">Manage your admin access key</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">New Access Key (Optional)</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-primary-brown transition-all" 
            />
            <p className="mt-2 text-xs text-gray-500 italic">This key will be required for the next login on this branch.</p>
            
            <div className="mt-6 p-4 bg-primary-brown/5 border border-primary-brown/20 rounded-xl">
              <div className="flex items-center gap-2 text-primary-brown mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Note for Multi-Device</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                If you are using multiple devices, ensure you have configured a <strong>Master Password</strong> in the system settings. This acts as a global key that works across all branches and devices.
              </p>
            </div>
          </div>
        </div>

        {settingsStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl flex items-center gap-3 ${
              settingsStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}
          >
            {settingsStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{settingsStatus.message}</span>
          </motion.div>
        )}

        <div className="flex justify-end gap-4">
          <button 
            type="button"
            onClick={fetchSettings}
            className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
          >
            Reset
          </button>
          <button 
            type="submit"
            disabled={isUpdatingSettings}
            className="px-12 py-4 bg-primary-brown text-white rounded-2xl font-bold hover:bg-caramel transition-all shadow-lg shadow-primary-brown/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUpdatingSettings ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save All Changes'}
          </button>
        </div>
      </form>

      <div className="bg-soft-cream p-8 rounded-[32px] shadow-sm border border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">System Info</h2>
            <p className="text-gray-400 text-sm">Current branch and environment</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch ID</p>
            <p className="text-white font-mono text-sm">{branchId}</p>
          </div>
          <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch Name</p>
            <p className="text-white font-mono text-sm">{branch?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-soft-cream border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-brown rounded-lg flex items-center justify-center text-white font-bold">
            {storeName.charAt(0)}
          </div>
          <span className="font-bold text-white truncate max-w-[150px]">{storeName} Panel</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-soft-cream md:relative md:z-0 md:w-64 md:border-r md:border-white/5 flex flex-col transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/5 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-brown rounded-lg flex items-center justify-center text-white font-bold">
              {storeName.charAt(0)}
            </div>
            <span className="font-bold text-white truncate">{storeName} Panel</span>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-2 mt-16 md:mt-0">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as Tab);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-primary-brown text-white shadow-lg shadow-primary-brown/20' 
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <item.icon className="h-5 w-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-colors"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
        {/* Debug Console (Hidden by default, can be toggled or just shown for now) */}
        <div className="mb-6 bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-[10px] text-gray-400 max-h-32 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-primary-brown font-bold uppercase tracking-widest">Connection Logs</span>
            <button onClick={() => setDebugInfo('')} className="hover:text-white">Clear</button>
          </div>
          <pre className="whitespace-pre-wrap">{debugInfo || 'No logs yet...'}</pre>
        </div>

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white capitalize">{activeTab} Overview</h1>
            <p className="text-gray-500">Welcome back, {storeName}</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${realtimeStatus === 'SUBSCRIBED' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {realtimeStatus === 'SUBSCRIBED' ? 'Live' : 'Connecting...'}
              </span>
            </div>
            <button 
              onClick={fetchData}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-soft-cream border border-white/10 text-gray-300 rounded-xl font-bold text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
            </button>
            <button className="w-full sm:w-auto px-6 py-2.5 bg-primary-brown text-white rounded-xl font-bold text-sm hover:bg-caramel transition-all shadow-lg shadow-primary-brown/20">
              Generate Report
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-brown" />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'customers' && renderCustomers()}
              {activeTab === 'settings' && renderSettings()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && confirmConfig && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-soft-cream w-full max-w-md p-8 rounded-[32px] border border-white/10 shadow-2xl"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${confirmConfig.isDanger ? 'bg-red-500/10 text-red-500' : 'bg-primary-brown/10 text-primary-brown'}`}>
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{confirmConfig.title}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {confirmConfig.message}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConfig.onConfirm}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                    confirmConfig.isDanger 
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                      : 'bg-primary-brown hover:bg-caramel shadow-primary-brown/20'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-soft-cream w-full max-w-2xl p-8 rounded-[32px] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Order Details</h3>
                  <p className="text-gray-500 text-sm font-mono">#{selectedOrder.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Customer Info</h4>
                    <div className="space-y-2">
                      <p className="text-white font-bold text-lg">{selectedOrder.customer_name}</p>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span>{selectedOrder.customer_phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Order Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                            selectedOrder.status === status
                              ? 'bg-primary-brown text-white'
                              : 'bg-white/5 text-gray-500 hover:bg-white/10'
                          }`}
                        >
                          {status.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Info</h4>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Method</span>
                        <span className="text-white font-bold uppercase text-xs">{selectedOrder.payment_method}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Type</span>
                        <span className="text-white font-bold uppercase text-xs">{selectedOrder.payment_type}</span>
                      </div>
                      {selectedOrder.transaction_id && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Transaction ID</span>
                          <span className="text-white font-mono text-[10px]">{selectedOrder.transaction_id}</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Payable Amount</span>
                        <span className="text-primary-brown font-bold text-lg">₹{Number(selectedOrder.payable_amount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                      <div className="flex-grow">
                        <p className="text-white font-bold text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs">₹{item.price} x {item.quantity}</p>
                      </div>
                      <p className="text-white font-bold">₹{(Number(item.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center px-4">
                  <span className="text-gray-400 font-bold">Total Order Value</span>
                  <span className="text-2xl font-bold text-white">₹{Number(selectedOrder.total_price || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-white/5">
                <button
                  onClick={() => {
                    handleDeleteOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 px-6 py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-5 w-5" /> Delete Order
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-6 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
