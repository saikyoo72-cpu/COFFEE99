import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ShoppingBag, 
  Clock, 
  Star, 
  ShieldCheck, 
  Info, 
  MapPin, 
  CheckCircle2,
  ArrowRight,
  Share2
} from 'lucide-react';

const offers = {
  '1': {
    title: 'Hot Brownie',
    tagline: 'Warm, Gooey & Decadent',
    description: 'Indulge in our signature Hot Brownie, served warm with a rich, fudgy center. It’s the ultimate dessert experience for any chocolate lover.',
    image: 'https://i.ibb.co/7dfLj61B/unnamed.jpg',
    price: '₹99',
    originalPrice: '₹149',
    terms: ['Available at all branches', 'Freshly baked daily', 'Best served warm'],
    highlights: ['Rich Belgian Chocolate', 'Gooey Center', 'Premium Quality'],
    validUntil: 'Dessert Special',
    menuId: 'menu-HOT DESSERT-0'
  },
  '2': {
    title: 'Chicken Popcorn',
    tagline: 'Extra Crunchy & Spicy Bites',
    description: 'Experience the perfect crunch with our signature Chicken Popcorn. Made with 100% tender chicken breast and a secret blend of spices, served in a generous portion.',
    image: 'https://i.ibb.co/Nd757XQq/unnamed.jpg',
    price: '₹199',
    originalPrice: '₹259',
    terms: ['Available at all branches', 'Valid for dine-in and takeaway', 'Limited time special price'],
    highlights: ['100% Real Chicken', 'Extra Crunchy', 'Spicy Dip Included'],
    validUntil: 'Ongoing',
    menuId: 'menu-CHICKEN FRY ITEMS-3'
  },
  '3': {
    title: 'Loaded Chicken Fries',
    tagline: 'Crispy, Cheesy & Irresistible',
    description: 'Indulge in our golden-brown fries, topped with tender chicken pieces, molten cheese sauce, and our secret spice blend. A perfect treat for any time of the day.',
    image: 'https://i.ibb.co/JjPpxCTY/unnamed.jpg',
    price: '₹149',
    originalPrice: '₹199',
    terms: ['Valid for dine-in and takeaway', 'Check availability at branch', 'Extra toppings at additional cost'],
    highlights: ['Extra Crispy', 'Premium Cheese', 'Tender Chicken'],
    validUntil: 'Always Open',
    menuId: 'menu-FRY ITEMS-0'
  }
};

export default function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const offer = offers[id as keyof typeof offers] || offers['1'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-cream-bg text-dark-roast selection:bg-primary-brown/30">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-cream-bg/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 md:px-8">
        <Link to="/" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-primary-brown transition-colors">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </nav>

      <main className="pt-16">
        {/* Immersive Premium Food Detail Hero (Tight Spacing) */}
        <section className="relative flex flex-col items-center justify-start bg-gradient-to-b from-[#050505] via-[#150a0a] to-[#050505] border-b border-white/5 px-4 pt-6 pb-12 overflow-hidden">
          {/* Subtle atmospheric glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary-brown/5 blur-[160px] rounded-full pointer-events-none" />
          
          <div className="max-w-6xl mx-auto w-full flex flex-col items-center relative z-10">
            {/* 1. Large, Dominant Product Image (Top Focus) */}
            <motion.div 
              initial={{ opacity: 0, scale: 1, y: 30 }}
              animate={{ opacity: 1, scale: 1.05, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center mb-10 md:mb-12"
            >
              <div className="relative w-full max-w-[90%] md:max-w-[85%] lg:max-w-[70%]">
                {/* Visual Depth Glow */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary-brown/20 blur-[100px] rounded-full -z-10" />
                
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-auto object-cover rounded-[40px] md:rounded-[64px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95)] border border-white/5 brightness-[1.1] contrast-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* 2. Text Hierarchy (Centered & Clean) */}
            <div className="max-w-4xl px-4 flex flex-col items-center text-center">
              {/* Tag Component */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className="inline-block px-5 py-2 bg-primary-brown/10 text-primary-brown text-[11px] font-black uppercase tracking-[0.5em] rounded-full mb-8 border border-primary-brown/20 backdrop-blur-sm">
                   Exclusive Taste
                </span>
              </motion.div>

              {/* Enhanced Product Title */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-bold text-white mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl"
              >
                {offer.title}
              </motion.h1>

              {/* Clear Description/Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-xl md:text-4xl text-white/70 font-light tracking-wide italic leading-snug max-w-3xl"
              >
                {offer.tagline}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Informative Details Section Below */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 pb-24 mt-16 md:mt-24">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Main Details */}
            <div className="lg:col-span-8 space-y-8">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-soft-cream rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black/40 border border-white/5"
              >
                <motion.div variants={itemVariants} className="mb-12">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary-brown mb-6 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Offer Details
                  </h2>
                  <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
                    {offer.description}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-6 mb-12">
                  {offer.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <CheckCircle2 className="w-5 h-5 text-primary-brown" />
                      <span className="text-sm font-bold text-white/60 uppercase tracking-wider">{highlight}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Terms & Conditions
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {offer.terms.map((term, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-white/50 leading-relaxed">
                        <div className="w-1 h-1 rounded-full bg-primary-brown mt-2 shrink-0" />
                        {term}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Branch Availability */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary-brown rounded-[40px] p-8 md:p-12 text-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold mb-2">Available at all branches</h2>
                    <p className="text-white/70 text-sm tracking-wide uppercase font-bold">Visit your nearest Coffee99 today</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/#branches" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Find Branch
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar / CTA */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-soft-cream rounded-[40px] p-8 md:p-10 shadow-2xl shadow-black/40 border border-white/5 sticky top-24"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-brown/10 text-primary-brown text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-primary-brown/20">
                    <Clock className="w-3 h-3" />
                    Valid until {offer.validUntil}
                  </div>
                  
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    {offer.originalPrice && (
                      <span className="text-white/20 line-through text-xl font-light">{offer.originalPrice}</span>
                    )}
                    <span className="text-5xl font-bold text-white tracking-tighter">{offer.price}</span>
                  </div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Limited availability</p>
                </div>

                <div className="space-y-3">
                  <Link 
                    to={`/menu#${offer.menuId}`}
                    className="w-full py-5 bg-primary-brown text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-brown/80 transition-all shadow-xl shadow-primary-brown/20 group"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Claim This Offer
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="w-full py-5 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all">
                    <Share2 className="w-4 h-4" />
                    Share Offer
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-soft-cream bg-gray-800 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${i+50}/40/40`} alt="User" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-4 border-soft-cream bg-primary-brown flex items-center justify-center text-[10px] font-bold text-white">
                      +2k
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-primary-brown mb-1">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Top Rated Offer</p>
                  </div>
                </div>
              </motion.div>

              {/* Help Card */}
              <div className="bg-white/5 rounded-[32px] p-6 border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-soft-cream rounded-2xl flex items-center justify-center shadow-sm">
                  <Info className="w-6 h-6 text-white/20" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Need help?</h4>
                  <p className="text-xs text-white/40">Contact our support team</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
