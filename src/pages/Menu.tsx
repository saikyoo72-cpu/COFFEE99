import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag } from 'lucide-react';
import { fullMenu } from '../data';
import { useCart } from '../context/CartContext';
import { parsePrice } from '../utils/price';

export default function Menu() {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...fullMenu.map(c => c.title)];

  const allItems = fullMenu.flatMap(category => 
    category.items.map(item => ({ ...item, categoryTitle: category.title }))
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
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                key={`${item.categoryTitle}-${item.name}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5 }}
                className={`bg-latte-beige rounded-[32px] overflow-hidden shadow-xl shadow-primary-brown/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ${
                  item.highlight ? 'ring-2 ring-caramel ring-offset-4 ring-offset-cream-bg' : ''
                }`}
                data-category={item.categoryTitle.toLowerCase()}
              >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-serif font-bold text-dark-roast">{item.name}</h3>
                  <span className="text-caramel font-bold">{item.price}</span>
                </div>
                <p className="text-slate-400 text-xs font-light mb-6 leading-relaxed">
                  {item.description}
                </p>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart({
                        id: `menu-${item.categoryTitle}-${idx}`,
                        name: item.name,
                        price: parsePrice(item.price),
                        branchName: 'Coffee99 Menu',
                        branchId: 'shivmandir',
                        image: item.image
                      });
                    }}
                  className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    item.highlight 
                      ? 'bg-primary-brown text-white hover:bg-dark-roast' 
                      : 'bg-cream-bg text-primary-brown hover:bg-primary-brown hover:text-white'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
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
