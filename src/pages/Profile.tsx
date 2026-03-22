import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Plus, Trash2, Coffee, ExternalLink, User } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { Listing } from '../types';
import { menuItems } from '../data';

export default function Profile() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showListingModal, setShowListingModal] = useState(false);
  const [newListing, setNewListing] = useState({ title: '', description: '', price: '', image_url: '' });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('listings').select('*').eq('user_id', user?.id);
      if (data) setListings(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase.from('listings').insert([
        {
          user_id: user.id,
          title: newListing.title,
          description: newListing.description,
          price: parseFloat(newListing.price),
          image_url: newListing.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600'
        }
      ]).select();

      if (error) throw error;
      if (data) setListings([data[0], ...listings]);
      setShowListingModal(false);
      setNewListing({ title: '', description: '', price: '', image_url: '' });
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing');
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
      setListings(listings.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-primary-brown/10 rounded-full flex items-center justify-center mb-6">
          <User className="h-10 w-10 text-primary-brown" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-dark-roast mb-4">Your Profile</h1>
        <p className="text-gray-500 max-w-md mb-8">Please sign in to view your favorites and manage your listings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-dark-roast mb-2">My Dashboard</h1>
            <p className="text-gray-500 font-light">Manage your favorite coffees and custom blends</p>
          </div>
          <button
            onClick={() => setShowListingModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-brown text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-primary-brown/20"
          >
            <Plus className="h-4 w-4" />
            Create New Blend
          </button>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Listings Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary-brown/10 rounded-lg">
                <Coffee className="h-6 w-6 text-primary-brown" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-dark-roast">My Custom Blends</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid gap-4">
                {listings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-dark-roast">{listing.title}</h3>
                      <p className="text-primary-brown font-bold text-sm">₹{listing.price}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-black/5 rounded-3xl p-12 text-center">
                <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-light">No custom blends yet. Share your coffee creations with the world!</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Create Listing Modal */}
      <AnimatePresence>
        {showListingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowListingModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-beige w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 sm:p-12">
                <h2 className="text-3xl font-serif font-bold text-dark-roast mb-8">Create New Blend</h2>
                <form onSubmit={handleCreateListing} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Blend Title</label>
                    <input
                      required
                      type="text"
                      value={newListing.title}
                      onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-transparent focus:border-primary-brown/30 rounded-2xl outline-none transition-all shadow-sm font-light"
                      placeholder="e.g. Midnight Roast Special"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                    <textarea
                      required
                      value={newListing.description}
                      onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-transparent focus:border-primary-brown/30 rounded-2xl outline-none transition-all shadow-sm font-light h-32 resize-none"
                      placeholder="Describe your unique blend..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Price (₹)</label>
                      <input
                        required
                        type="number"
                        value={newListing.price}
                        onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                        className="w-full px-6 py-4 bg-white border border-transparent focus:border-primary-brown/30 rounded-2xl outline-none transition-all shadow-sm font-light"
                        placeholder="99"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Image URL (Optional)</label>
                      <input
                        type="url"
                        value={newListing.image_url}
                        onChange={(e) => setNewListing({ ...newListing, image_url: e.target.value })}
                        className="w-full px-6 py-4 bg-white border border-transparent focus:border-primary-brown/30 rounded-2xl outline-none transition-all shadow-sm font-light"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowListingModal(false)}
                      className="flex-1 py-4 border-2 border-primary-brown text-primary-brown rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-black transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-4 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-primary-brown/40"
                    >
                      Create Listing
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
