import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Trophy, ArrowRight, ShoppingBag, Flame, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const bestsellers = [
  {
    id: 1,
    name: "Classic Cold Coffee",
    price: 119,
    image: "https://images.unsplash.com/photo-1541173230599-a362db2327a7?auto=format&fit=crop&q=80&w=800",
    desc: "The legend that started it all. Premium beans, chilled to perfection.",
    tag: "SIGNATURE",
    color: "bg-blue-500"
  },
  {
    id: 7,
    name: "Classic Burger",
    price: 49,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800",
    desc: "Simple, delicious, and unbeatable value. The perfect snack.",
    tag: "BEST PRICE",
    color: "bg-green-500"
  },
  {
    id: 2,
    name: "Oreo Shake",
    price: 120,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800",
    desc: "Thick, creamy, and loaded with crushed Oreos. A true fan favorite.",
    tag: "BEST VALUE",
    color: "bg-purple-500"
  },
  {
    id: 3,
    name: "Zinger Burger",
    price: 139,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    desc: "Extra crispy chicken, spicy mayo, and fresh lettuce in a toasted bun.",
    tag: "HOT & SPICY",
    color: "bg-red-500"
  },
  {
    id: 4,
    name: "Peri Peri Fries",
    price: 119,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800",
    desc: "Golden fries tossed in our secret fiery peri-peri seasoning.",
    tag: "CHEF'S PICK",
    color: "bg-orange-500"
  },
  {
    id: 5,
    name: "Chicken Popcorn",
    price: 99,
    image: "https://i.ibb.co/95JWsVQ/unnamed.jpg",
    desc: "Bite-sized bursts of crispy chicken joy. Perfect for snacking.",
    tag: "CRUNCHY",
    color: "bg-yellow-500"
  },
  {
    id: 6,
    name: "Loaded Cheese Fries",
    price: 90,
    image: "https://i.ibb.co/JjPpxCTY/unnamed.jpg",
    desc: "Smothered in molten cheese and our signature spice mix.",
    tag: "COMFORT FOOD",
    color: "bg-amber-500"
  }
];

const Bestsellers = () => {
  const { addToCart } = useCart();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAdd = (item: any) => {
    addToCart({
      id: `best-${item.id}`,
      name: item.name,
      price: item.price,
      branchName: "Coffee99",
      branchId: "shivmandir",
      image: item.image,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-brown/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-20 pb-32">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-300 hover:text-white group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-tight">BACK TO HOME</span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <div className="mb-20 text-center md:text-left relative">
          {/* Animated Sparkles for Header */}
          <div className="absolute -top-10 left-1/2 md:left-20 -translate-x-1/2 md:translate-x-0 w-40 h-40 pointer-events-none">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-4xl"
            >
              ✨
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold tracking-widest text-amber-400">HALL OF FAME</span>
          </motion.div>
          
          <div className="relative inline-block mb-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none"
            >
              OUR <span className="text-primary-brown drop-shadow-[0_0_20px_rgba(214,142,67,0.4)]">BESTSELLERS</span>
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-2 bg-primary-brown"
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mt-4 font-medium"
          >
            The legends. The icons. The flavors that defined a generation. Hand-picked by the community.
          </motion.p>
        </div>

        {/* Bestsellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellers.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-[#121212] border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-primary-brown/40">
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-100" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest text-white shadow-xl ${item.color}`}>
                      {item.tag}
                    </span>
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold">5.0</span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-black italic tracking-tighter mb-2 group-hover:text-primary-brown transition-colors">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Price</span>
                      <span className="text-2xl font-black tracking-tight text-white">₹{item.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAdd(item)}
                      className="group/btn relative px-6 py-3 bg-white text-black font-black italic text-sm rounded-2xl overflow-hidden transition-all active:scale-95 shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        ADD <Sparkles className="w-4 h-4" />
                      </span>
                      <div className="absolute inset-0 bg-primary-brown translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Main Image */}
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
                />
              </div>

              {/* Float Effect Elements */}
              <div className={`absolute -top-4 -right-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full ${item.color}`} />
            </motion.div>
          ))}
        </div>

        {/* CTA Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[50px] bg-gradient-to-br from-primary-brown/20 to-amber-900/10 border border-white/5 backdrop-blur-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <Flame className="w-20 h-20 text-primary-brown/20 rotate-12" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black italic mb-6">WANT THE FULL <span className="text-primary-brown">EXPERIENCE?</span></h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">Explore our entire catalogue of handcrafted treats and signature brews.</p>
          
          <Link 
            to="/menu"
            className="inline-flex items-center gap-4 px-10 py-5 bg-primary-brown hover:bg-primary-brown/80 text-white rounded-full font-black italic text-xl transition-all hover:gap-6 shadow-2xl shadow-primary-brown/20"
          >
            VIEW FULL MENU <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Bestsellers;
