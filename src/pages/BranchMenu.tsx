import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, ArrowLeft, Plus, Star, ChevronRight, AlertCircle } from 'lucide-react';
import { branches } from '../data';
import { useCart } from '../context/CartContext';
import { parsePrice } from '../utils/price';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function BranchMenu() {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();
  const branch = branches.find(b => b.id === id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [outOfStockItems, setOutOfStockItems] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      localStorage.setItem('coffee99_branch_id', id);
      fetchAvailability();
    }
  }, [id]);

  const fetchAvailability = async () => {
    try {
      const q = query(
        collection(db, 'menu_availability'),
        where('branch_id', '==', id),
        where('is_available', '==', false)
      );
      const snapshot = await getDocs(q);
      setOutOfStockItems(snapshot.docs.map(doc => doc.data().item_id));
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  if (!branch) {
    return <Navigate to="/" replace />;
  }

  const categories = ['All', ...branch.menu.map(c => c.title)];

  const filteredMenu = branch.menu.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Basic category match
      let matchesCategory = activeCategory === 'All' || category.title === activeCategory;
      
      // Special case for TEA as per prompt example (includes ICED TEA)
      if (activeCategory === 'TEA' && category.title === 'ICED TEA') {
        matchesCategory = true;
      }

      // Special case for WRAP (ensure it doesn't accidentally include VEG WRAP unless intended, 
      // but prompt says they are separate, so the basic match handles it)
      
      return matchesSearch && matchesCategory;
    })
  })).filter(category => category.items.length > 0);

  const recommendedItems = branch.menu
    .flatMap(c => c.items)
    .filter(item => item.highlight);

  return (
    <div className="min-h-screen bg-cream-bg pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <Link to={`/branch/${branch.id}`} className="inline-flex items-center text-primary-brown hover:text-white font-bold transition-all group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to {branch.name}
              </Link>
              <Link to={`/admin/${branch.id}/login`} className="inline-flex items-center text-primary-brown hover:text-white font-bold transition-all group">
                Admin Panel <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white">{branch.name} <span className="italic text-primary-brown">Menu</span></h1>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-brown transition-colors" />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-latte-beige rounded-2xl shadow-xl outline-none border-2 border-transparent focus:border-primary-brown/20 transition-all text-white font-light"
            />
          </div>
        </div>

        {/* Category Navigation */}
        <div className="relative mb-12">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-primary-brown text-white shadow-lg shadow-primary-brown/30 scale-105'
                    : 'bg-latte-beige text-gray-400 hover:bg-latte-beige/80 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Menu Items Grid */}
          <div className="lg:col-span-3">
            <div className="space-y-16">
              {filteredMenu.length > 0 ? (
                filteredMenu.map((category, catIdx) => (
                  <div key={catIdx}>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-serif text-white">{category.title}</h2>
                      <div className="h-px flex-grow bg-white/5 ml-8"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                      {category.items.map((item, itemIdx) => {
                        const itemId = `menu-${category.title}-${itemIdx}`;
                        const isOutOfStock = outOfStockItems.includes(itemId);

                        return (
                          <motion.div
                            layout
                            key={`${category.title}-${item.name}-${itemIdx}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: itemIdx * 0.05 }}
                            className={`bg-latte-beige rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group relative border ${
                              isOutOfStock ? 'border-red-500/20 opacity-80' : 'border-white/5'
                            }`}
                            data-category={category.title.toLowerCase()}
                          >
                            {/* Content Section */}
                            <div className="p-6 relative">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-lg font-serif font-bold group-hover:text-primary-brown transition-colors leading-tight ${
                                  isOutOfStock ? 'text-gray-500' : 'text-white'
                                }`}>
                                  {item.name}
                                </h3>
                                <span className={`font-bold text-lg ${isOutOfStock ? 'text-gray-600' : 'text-primary-brown'}`}>
                                  {item.price}
                                </span>
                              </div>
                              
                              <p className="text-gray-400 text-sm font-light mb-8 line-clamp-2 min-h-[40px]">
                                {item.description}
                              </p>

                              {isOutOfStock && (
                                <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> Out of Stock
                                </div>
                              )}

                              {/* Add Button */}
                              <motion.button 
                                whileTap={isOutOfStock ? {} : { scale: 0.9 }}
                                disabled={isOutOfStock}
                                onClick={() => {
                                  if (isOutOfStock) return;
                                  addToCart({
                                    id: `${branch.id}-${item.name}`,
                                    name: item.name,
                                    price: parsePrice(item.price),
                                    branchName: branch.name,
                                    branchId: branch.id,
                                    image: item.image
                                  });
                                }}
                                className={`absolute bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                                  isOutOfStock 
                                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                                    : 'bg-primary-brown text-white shadow-primary-brown/20 hover:bg-white hover:text-black'
                                }`}
                              >
                                <Plus className="h-6 w-6" />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 bg-latte-beige rounded-3xl border border-dashed border-white/10">
                  <p className="text-gray-500 font-light italic">No items found matching your criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recommended */}
          <div className="hidden lg:block">
            <div className="sticky top-32 space-y-8">
              <div className="bg-latte-beige rounded-3xl p-8 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <Star className="h-5 w-5 text-primary-brown fill-primary-brown" />
                  <h3 className="text-xl font-serif text-white">Recommended</h3>
                </div>

                <div className="space-y-6">
                  {recommendedItems.map((item, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex gap-4 items-center mb-4">
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-primary-brown transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-primary-brown font-bold text-sm">{item.price}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          addToCart({
                            id: `${branch.id}-${item.name}`,
                            name: item.name,
                            price: parsePrice(item.price),
                            branchName: branch.name,
                            branchId: branch.id,
                            image: item.image
                          });
                        }}
                        className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-white/10 rounded-xl hover:bg-primary-brown hover:text-white hover:border-primary-brown transition-all"
                      >
                        Quick Add
                      </button>
                    </div>
                  ))}
                </div>

                <Link 
                  to={`/branch/${branch.id}/menu`}
                  className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-primary-brown uppercase tracking-widest hover:text-white transition-colors pt-6 border-t border-white/5"
                >
                  View Full Menu <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Promo Card */}
              <div className="bg-primary-brown rounded-3xl p-8 relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-2xl font-serif text-white mb-2">Get 20% OFF</h4>
                  <p className="text-white/80 text-sm font-light mb-6">On your first order above ₹500</p>
                  <button className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                    Claim Offer
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                  <ShoppingBag className="h-32 w-32 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
