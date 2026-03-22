import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Coffee, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { branches } from '../data';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { branchId } = useParams();

  const branch = branches.find(b => b.id === branchId);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password, branchId }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem(`admin_auth_${branchId}`, 'true');
        navigate(`/admin/${branchId}/panel`);
      } else {
        setError(data.message || 'Invalid access key');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-soft-cream rounded-[32px] p-10 w-full max-w-md shadow-2xl border border-white/5"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-primary-brown rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            C
          </div>
          <h1 className="text-2xl font-bold text-white">
            {branch ? `${branch.name} Admin` : 'Admin Console'}
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">
              Access Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-6 py-4 bg-black/40 border-2 border-white/10 rounded-2xl outline-none focus:border-primary-brown transition-all text-lg text-white pr-14"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && <p className="mt-2 text-red-500 text-sm font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary-brown text-white rounded-2xl font-bold text-lg hover:bg-caramel transition-all shadow-lg shadow-primary-brown/20"
          >
            Login
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-8 flex items-center justify-center gap-2 text-gray-500 font-medium hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Website
        </button>
      </motion.div>
    </div>
  );
}
