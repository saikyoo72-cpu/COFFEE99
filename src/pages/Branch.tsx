import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Clock, ArrowLeft, Coffee, Utensils, Star, Image as ImageIcon, ShoppingBag, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { branches } from '../data';
import { useCart } from '../context/CartContext';

export default function Branch() {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();
  const branch = branches.find(b => b.id === id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, branch]);

  if (!branch) {
    return <Navigate to="/" replace />;
  }

  const filteredMenu = branch.menu.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="pt-16 md:pt-20">
      {/* Branch Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={branch.image} 
            alt={branch.name} 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="inline-flex items-center text-primary-brown hover:text-white font-bold transition-all bg-black/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl shadow-black/10 group text-xs uppercase tracking-widest">
                <ArrowLeft className="mr-2 h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Home
              </Link>
              <Link to={`/admin/${branch.id}/login`} className="inline-flex items-center text-white hover:text-primary-brown font-bold transition-all bg-black/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl shadow-black/10 group text-xs uppercase tracking-widest">
                Admin Panel <Coffee className="ml-2 h-3.5 w-3.5" />
              </Link>
            </div>
            <h1 className="text-4xl md:text-7xl font-serif text-white mb-6 drop-shadow-2xl">{branch.name}</h1>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center bg-black/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-white text-sm">
                <MapPin className="h-4 w-4 mr-2 text-primary-brown" />
                {branch.address}
              </div>
              <div className="flex items-center bg-black/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-white text-sm">
                <Clock className="h-4 w-4 mr-2 text-primary-brown" />
                {branch.hours}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info & Menu Section */}
      <section className="py-24 bg-cream-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
            {/* Main Menu Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="mb-16">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-primary-brown font-bold text-sm uppercase tracking-[0.3em]">Our Menu</span>
                  <div className="h-px w-12 bg-primary-brown/20"></div>
                </div>
                <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">Explore Our <span className="italic text-primary-brown">Selection</span></h3>
                
                <p className="text-gray-400 font-light leading-relaxed text-lg mb-12">
                  Each item is prepared fresh using the finest ingredients. Our coffee is roasted in-house to ensure maximum flavor and aroma.
                </p>

                <div className="text-center md:text-left">
                  <Link 
                    to={`/branch/${branch.id}/menu`}
                    className="inline-flex items-center px-12 py-5 bg-primary-brown text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary-brown/40 group"
                  >
                    View Full Menu
                    <ShoppingBag className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-latte-beige p-10 rounded-[40px] shadow-2xl shadow-black border border-white/5"
              >
                <h3 className="text-xl font-serif text-white mb-8 flex items-center">
                  <Star className="h-5 w-5 mr-3 text-primary-brown fill-primary-brown" /> Branch Details
                </h3>
                <div className="space-y-8">
                  <div className="group">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Address</p>
                    <p className="text-gray-400 font-light leading-relaxed">{branch.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Opening Hours</p>
                    <p className="text-gray-400 font-light">{branch.hours}</p>
                  </div>
                </div>
              </motion.div>

              <motion.a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address + " Coffee99 Siliguri")}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="block rounded-[40px] overflow-hidden h-72 border border-primary-brown/5 shadow-2xl shadow-primary-brown/10 relative group cursor-pointer"
              >
                <iframe 
                  src={branch.mapEmbed}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="Google Maps"
                  className="grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none"
                ></iframe>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                  <div className="bg-primary-brown text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                    Open in Google Maps
                  </div>
                </div>
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-brown font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Our Space</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">Branch <span className="italic text-primary-brown">Gallery</span></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {branch.gallery.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/5 group"
                onClick={() => setSelectedImageIndex(idx)}
              >
                <div className="relative w-full h-full">
                  <img 
                    src={img} 
                    alt={`${branch.name} gallery ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                      <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[210] p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-primary-brown transition-all border border-white/20 shadow-2xl group"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Navigation Buttons */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => 
                  prev !== null ? (prev - 1 + branch.gallery.length) % branch.gallery.length : null
                );
              }}
              className="absolute left-2 md:left-8 z-[210] p-3 md:p-4 bg-white/5 backdrop-blur-md rounded-full text-white hover:bg-primary-brown transition-all border border-white/10 group md:h-20 md:w-20 flex items-center justify-center shadow-2xl"
            >
              <ChevronLeft className="h-6 w-6 md:h-10 md:w-10 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => 
                  prev !== null ? (prev + 1) % branch.gallery.length : null
                );
              }}
              className="absolute right-2 md:right-8 z-[210] p-3 md:p-4 bg-white/5 backdrop-blur-md rounded-full text-white hover:bg-primary-brown transition-all border border-white/10 group md:h-20 md:w-20 flex items-center justify-center shadow-2xl"
            >
              <ChevronRight className="h-6 w-6 md:h-10 md:w-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={branch.gallery[selectedImageIndex]} 
                alt="Gallery preview" 
                className="w-full h-auto max-h-[85vh] md:max-h-[92vh] md:w-auto md:max-w-[90vw] object-contain rounded-[32px] md:rounded-[60px] shadow-[0_0_200px_rgba(0,0,0,0.9)] border border-white/20"
                referrerPolicy="no-referrer"
              />
              
              {/* Pagination Indicator */}
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                {branch.gallery.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === selectedImageIndex ? 'w-8 md:w-10 bg-primary-brown' : 'w-1.5 md:w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
