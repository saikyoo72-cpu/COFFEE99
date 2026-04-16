import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { fullMenu, branches } from '../data';
import { useCart } from '../context/CartContext';
import { parsePrice } from '../utils/price';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Menu() {
  const { addToCart } = useCart();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [outOfStockItems, setOutOfStockItems] = useState<string[]>([]);

  const lastBranchId = localStorage.getItem('coffee99_branch_id') || 'shivmandir';
  const lastBranch = branches.find(b => b.id === lastBranchId);

  useEffect(() => {
    fetchAvailability();
  }, [lastBranchId]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const targetItem = allItems.find(i => i.itemId === id);
      if (targetItem) {
        setActiveCategory(targetItem.categoryTitle);
      }
    }
  }, [location.hash]);

  const fetchAvailability = async () => {
    try {
      const q = query(
        collection(db, 'menu_availability'),
        where('branch_id', '==', lastBranchId),
        where('is_available', '==', false)
      );
      const snapshot = await getDocs(q);
      setOutOfStockItems(snapshot.docs.map(doc => doc.data().item_id));
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const categories = ['All', ...fullMenu.map(c => c.title)];

  const allItems = fullMenu.flatMap(category => 
    category.items.map((item, idx) => ({ 
      ...item, 
      categoryTitle: category.title,
      itemId: `menu-${category.title}-${idx}`
    }))
  );

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Basic category match
    let matchesCategory = activeCategory === 'All' || item.categoryTitle === activeCategory;
    
    // Special case for TEA as per prompt example (includes ICED TEA)
    if (activeCategory === 'TEA' && item.categoryTitle === 'ICED TEA') {
      matchesCategory = true;
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-cream-bg pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-caramel font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Full Selection</span>
          <h1 className="text-4xl md:text-6xl font-serif text-dark-roast mb-8">Our <span className="italic">Menu</span></h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group mb-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-caramel transition-colors" />
            <input 
              type="text" 
              placeholder="Search for your favorite coffee or snack..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-latte-beige rounded-[32px] shadow-xl shadow-primary-brown/5 outline-none border-2 border-transparent focus:border-caramel/20 transition-all text-dark-roast font-light"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary-brown text-white shadow-lg shadow-primary-brown/30' 
                    : 'bg-latte-beige text-primary-brown hover:bg-primary-brown/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              const isOutOfStock = outOfStockItems.includes(item.itemId);
              
              return (
                <motion.div
                  layout
                  id={item.itemId}
                  key={`${item.categoryTitle}-${item.name}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  transition={{ duration: 0.5 }}
                  className={`bg-latte-beige rounded-[32px] overflow-hidden shadow-xl shadow-primary-brown/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative ${
                    item.highlight ? 'ring-2 ring-caramel ring-offset-4 ring-offset-cream-bg' : ''
                  } ${isOutOfStock ? 'opacity-80' : ''} ${
                    location.hash === `#${item.itemId}` ? 'ring-4 ring-primary-brown ring-offset-4' : ''
                  }`}
                  data-category={item.categoryTitle.toLowerCase()}
                >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-serif font-bold ${isOutOfStock ? 'text-gray-500' : 'text-dark-roast'}`}>{item.name}</h3>
                    <span className={`font-bold ${isOutOfStock ? 'text-gray-600' : 'text-caramel'}`}>{item.price}</span>
                  </div>
                  <p className="text-slate-400 text-xs font-light mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  {isOutOfStock && (
                    <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Out of Stock
                    </div>
                  )}

                  <motion.button 
                    whileTap={isOutOfStock ? {} : { scale: 0.95 }}
                    disabled={isOutOfStock}
                    onClick={() => {
                      if (isOutOfStock) return;
                      addToCart({
                        id: item.itemId,
                        name: item.name,
                        price: parsePrice(item.price),
                        branchName: lastBranch?.name || 'Coffee99 Menu',
                        branchId: lastBranchId,
                        image: item.image
                      });
                    }}
                    className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isOutOfStock 
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : item.highlight 
                          ? 'bg-primary-brown text-white hover:bg-dark-roast' 
                          : 'bg-cream-bg text-primary-brown hover:bg-primary-brown hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 font-light italic">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
