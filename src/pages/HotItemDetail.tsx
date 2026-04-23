import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ShoppingBag, ArrowRight, Clock, Star, Zap } from 'lucide-react';

const itemDetails = {
  fries: {
    name: 'Loaded French Fries',
    description: 'Crispy golden fries loaded with cheese and flavor. Perfect snack for every craving. Each bite is a mix of crunchy textures and molten goodness.',
    price: '₹90',
    image: 'https://files.catbox.moe/zkyu8y.png',
    prepTime: '12 min',
    energy: '320 kcal'
  },
  popcorn: {
    name: 'Chicken Balls',
    description: 'Crunchy, spicy, and bite-sized delight. Made with premium tender chicken breast and seasoned with our secret spice blend.',
    price: '₹99',
    image: 'https://files.catbox.moe/udbco5.png',
    prepTime: '15 min',
    energy: '450 kcal'
  },
  brownie: {
    name: 'Hot Brownie',
    description: 'Warm, gooey, chocolate heaven with ice cream. Indulge in our signature brownie, served hot with a melting scoop of vanilla and rich chocolate sauce.',
    price: '₹99',
    image: 'https://files.catbox.moe/zkyu8y.png',
    prepTime: '8 min',
    energy: '580 kcal'
  }
};

export default function HotItemDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? itemDetails[slug as keyof typeof itemDetails] : null;

  if (!item) {
    return <Navigate to="/hot-items" />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary-brown/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 md:px-8">
        <Link to="/hot-items" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-primary-brown transition-colors">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Specials
        </Link>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden border-b border-white/5">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
          </motion.div>
          
          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary-brown/20 text-primary-brown text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-6 border border-primary-brown/30 backdrop-blur-md">
                Chef's Recommendation
              </span>
              <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-serif font-bold mb-4 tracking-tighter drop-shadow-2xl">
                {item.name}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-24 relative z-20 pb-24">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Column: Details */}
            <div className="lg:col-span-8 space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-[#111111] rounded-[48px] p-8 md:p-16 border border-white/5 shadow-2xl"
              >
                <div className="grid sm:grid-cols-3 gap-8 mb-16 border-b border-white/5 pb-16">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary-brown/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5 text-primary-brown" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Time</p>
                      <p className="font-serif text-lg">{item.prepTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary-brown/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-primary-brown" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Energy</p>
                      <p className="font-serif text-lg">{item.energy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary-brown/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5 text-primary-brown" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Rating</p>
                      <p className="font-serif text-lg">5.0 / 5.0</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary-brown mb-8 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-primary-brown/40" />
                    Description
                  </h2>
                  <p className="text-xl md:text-3xl font-serif italic text-white/80 leading-relaxed font-light">
                    "{item.description}"
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: CTA */}
            <div className="lg:col-span-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="bg-[#111111] rounded-[48px] p-10 border border-white/5 shadow-2xl sticky top-24"
              >
                <div className="text-center mb-10">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-4">Starting From</p>
                  <p className="text-6xl font-bold tracking-tighter mb-2">{item.price}</p>
                  <div className="flex justify-center items-center gap-1.5 text-primary-brown">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Link 
                    to="/menu"
                    className="w-full py-6 bg-primary-brown text-white rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-xl shadow-primary-brown/20 group"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    ORDER NOW
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-center text-[10px] uppercase tracking-widest text-gray-500 font-medium">Available for dine-in & takeaway</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
