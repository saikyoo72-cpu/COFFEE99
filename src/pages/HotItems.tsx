import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Star } from 'lucide-react';

const hotItems = [
  {
    slug: 'fries',
    name: 'Loaded French Fries',
    tagline: 'Cheesy, crispy, and loaded with flavor.',
    image: 'https://files.catbox.moe/zkyu8y.png',
    rating: 4.9
  },
  {
    slug: 'popcorn',
    name: 'Chicken Balls',
    tagline: 'Crunchy, spicy, and bite-sized delight.',
    image: 'https://files.catbox.moe/udbco5.png',
    rating: 4.8
  },
  {
    slug: 'brownie',
    name: 'Hot Brownie',
    tagline: 'Warm, gooey, chocolate heaven with ice cream.',
    image: 'https://files.catbox.moe/zkyu8y.png',
    rating: 5.0
  }
];

export default function HotItems() {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary-brown font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Seasonal Specials</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">New <span className="italic text-primary-brown">Hot Items 🔥</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Discover our latest trending creations, crafted with premium ingredients and served fresh for the ultimate experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotItems.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-[#111111] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group"
            >
              <Link to={`/hot-items/${item.slug}`} className="block h-64 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 blur-[1px] group-hover:blur-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 right-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-primary-brown fill-current" />
                  <span className="text-[10px] font-bold text-white tracking-widest">{item.rating}</span>
                </div>
              </Link>
              <div className="p-10">
                <h3 className="text-2xl font-serif font-bold mb-3">{item.name}</h3>
                <p className="text-gray-400 text-sm font-light mb-8 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
                <Link 
                  to={`/hot-items/${item.slug}`}
                  className="inline-flex items-center text-primary-brown font-bold text-xs uppercase tracking-widest group/link"
                >
                  View Secret Recipe <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 p-12 bg-white/5 rounded-[48px] border border-white/5 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-brown/40 to-transparent" />
          <ChefHat className="w-12 h-12 text-primary-brown/40 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" />
          <h2 className="text-2xl font-serif font-bold mb-4 italic">Hungry for more?</h2>
          <p className="text-gray-400 text-sm font-light mb-8 max-w-lg mx-auto">
            Check our full menu for over 100+ delicious handcrafted items from premium coffees to crunchy snacks.
          </p>
          <Link 
            to="/menu"
            className="inline-block px-10 py-4 bg-primary-brown text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-primary-brown/20"
          >
            Explore Full Menu
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
