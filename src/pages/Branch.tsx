import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Clock, ArrowLeft, Coffee, Utensils, Star, Image as ImageIcon, ShoppingBag, Search, X, ChevronLeft, ChevronRight, Play, Tv, Flame, Film, Eye, Heart } from 'lucide-react';
import { branches } from '../data';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

const branchVideos: Record<string, Array<{ title: string; desc: string; duration: string; views: string; videoUrl: string; thumbnail: string }>> = {
  shivmandir: [
    {
      title: "Shivmandir Golden Hour Vibes ⚡",
      desc: "Watch our gorgeous outdoor seating lit up at sunset, packed with high-energy groups.",
      duration: "0:45",
      views: "12,410 views",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-steaming-cup-of-hot-coffee-41620-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Perfect Latte Art Masterclass ☕",
      desc: "Watch our head barista craft complex multi-layer swan microfoam live in real-time.",
      duration: "1:12",
      views: "8,924 views",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-milk-into-coffee-cup-34416-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600"
    }
  ],
  hakimpara: [
    {
      title: "Hakimpara City Center Rush ⚡",
      desc: "Siliguri's high-energy hotspot in full swing during peak evening hours.",
      duration: "0:30",
      views: "18,290 views",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-machine-brewing-espresso-41618-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Sizzling Burger Combo Prep 🍔",
      desc: "Crispy chicken burger patties tossed and served boiling hot with loaded double cheese fries.",
      duration: "1:05",
      views: "24,115 views",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-crispy-fries-dropped-in-slow-motion-41610-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600"
    }
  ],
  shalbari: [
    {
      title: "Cozy Shalbari Escape Lounge 🍃",
      desc: "A beautiful virtual tour around our highway oasis featuring rich wood elements and comfortable couches.",
      duration: "0:55",
      views: "6,520 views",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-34407-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=600"
    }
  ],
  "bara-mohansingh": [
    {
      title: "Medical More Professional Hub Reset ⚡",
      desc: "Perfect peaceful workspace where local doctors and students come to reload with our high-caf blends.",
      duration: "0:40",
      views: "9,311 views",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-milk-into-coffee-cup-34416-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=600"
    }
  ],
  "ashram-para": [
    {
      title: "Ashram Para Weekend Family Feast 🍕",
      desc: "Laughter, giant combo boards, family groups, and towering custom milkshakes.",
      duration: "1:15",
      views: "11,105 views",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-34407-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=600"
    }
  ]
};

export default function Branch() {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();
  const branch = branches.find(b => b.id === id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ title: string; videoUrl: string } | null>(null);

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
      <SEO 
        title={`${branch.name} | Coffee99 ${branch.id}`}
        description={`Visit Coffee99 at ${branch.name}. Located at ${branch.address}. Perfect spot for artisanal coffee and slaying burger combos.`}
        keywords={`coffee99 ${branch.id}, coffee shop ${branch.id}, cafe in ${branch.id}, Coffee99 ${branch.name}`}
        image={branch.image}
      />
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
            <div className="lg:col-span-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#0b0b0b] p-8 rounded-[36px] shadow-2xl shadow-black/40 border border-white/5 space-y-8 font-sans"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xl font-serif text-white flex items-center">
                    <Star className="h-5 w-5 mr-3 text-primary-brown fill-primary-brown" /> Hub Details
                  </h3>
                  {branch.rating && (
                    <div className="flex items-center gap-1 bg-primary-brown/15 px-3 py-1 rounded-xl border border-primary-brown/20 text-xs font-bold text-primary-brown">
                      <span>{branch.rating}</span>
                      <Star className="h-3 w-3 fill-primary-brown text-primary-brown" />
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 font-sans">
                      <MapPin className="h-3.5 w-3.5 text-primary-brown" /> Exact Address
                    </p>
                    <p className="text-gray-300 font-light leading-relaxed text-sm font-sans">{branch.address}</p>
                  </div>

                  {branch.phone && (
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 font-sans">
                        <Phone className="h-3.5 w-3.5 text-primary-brown" /> Contact Phone
                      </p>
                      <a 
                        href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                        className="text-gray-300 hover:text-primary-brown font-medium transition-colors text-sm font-sans"
                      >
                        {branch.phone}
                      </a>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 font-sans">
                      <Clock className="h-3.5 w-3.5 text-primary-brown" /> Opening Hours
                    </p>
                    <p className="text-gray-300 font-light text-sm font-sans">{branch.hours}</p>
                  </div>

                  {branch.reviews && (
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 font-sans font-bold">Google Authority Rank</p>
                      <div className="text-gray-300 font-light text-sm flex items-center gap-1.5 font-sans">
                        <span className="text-white font-bold">{branch.rating} / 5.0</span>
                        <span className="text-white/40">•</span>
                        <span>{branch.reviews} Verified Reviews</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Micro Actions Block */}
                <div className="pt-4 border-t border-white/5 space-y-3 font-sans">
                  {branch.googleBusinessProfile && (
                    <>
                      <a 
                        href={branch.googleBusinessProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 px-6 bg-primary-brown text-white hover:bg-white hover:text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-primary-brown/20"
                      >
                        <MapPin className="h-4 w-4" /> Get Directions
                      </a>
                      <a 
                        href={`${branch.googleBusinessProfile}&showreviews=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Star className="h-4 w-4 text-primary-brown" /> View Google Reviews
                      </a>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Lazy Embedded Iframe Map Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="block rounded-[36px] overflow-hidden h-72 border border-white/5 bg-[#0a0a0a] relative group shadow-2xl"
              >
                <iframe 
                  src={branch.mapEmbed}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title={`Google Maps location - Coffee99 ${branch.name}`}
                  className="grayscale invert opacity-50 hover:opacity-100 transition-all duration-700 filter contrast-95 saturate-100"
                ></iframe>
                {branch.googleBusinessProfile && (
                  <a 
                    href={branch.googleBusinessProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-auto"
                  >
                    <div className="bg-black/95 border border-white/10 text-white hover:bg-primary-brown px-5 py-3 rounded-full text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                      Open in Google Maps &rarr;
                    </div>
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Videos Section - Highly Interactive Aesthetic Visual Showcase */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        {/* Neon Glow lighting behind */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-brown/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Tv className="h-4.5 w-4.5 text-primary-brown animate-pulse" />
                <span className="text-primary-brown font-bold text-xs uppercase tracking-[0.3em]">Cinematic Hub Chronicles</span>
                <span className="bg-[#ff003c] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-bounce">
                  Live Reel
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                Vibes in <span className="italic text-primary-brown">Motion ⚡</span>
              </h2>
              <p className="text-gray-400 font-light mt-3 text-sm md:text-base max-w-xl">
                Experience the raw atmosphere of our {branch.name} branch. See our skilled baristas, hot food sizzles, and student squad gatherings in action below!
              </p>
            </div>
            
            <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
              <Film className="h-4 w-4 text-primary-brown" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                {(branchVideos[branch.id || 'shivmandir'] || branchVideos['shivmandir']).length} Exclusive Clips Loaded
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {(branchVideos[branch.id || 'shivmandir'] || branchVideos['shivmandir']).map((v, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-[#121212] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl hover:border-primary-brown/30 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Thumbnail container */}
                <div className="relative aspect-video w-full overflow-hidden shrink-0">
                  <img 
                    src={v.thumbnail} 
                    alt={v.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Glass overlay fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 group-hover:via-black/25 transition-all duration-500" />

                  {/* Red Hot Cinematic Play Button */}
                  <button
                    onClick={() => setActiveVideo({ title: v.title, videoUrl: v.videoUrl })}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary-brown/90 hover:bg-primary-brown text-white flex items-center justify-center shadow-[0_0_30px_rgba(178,34,34,0.6)] transform group-hover:scale-110 active:scale-95 transition-all duration-500 cursor-pointer z-20 group"
                  >
                    <Play className="h-7 w-7 text-white fill-white ml-1 group-hover:rotate-12 transition-transform duration-300" />
                  </button>

                  {/* Play duration badge */}
                  <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[10px] font-mono text-gray-300">
                    {v.duration}
                  </div>

                  {/* Active view count badge */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[9px] font-bold text-primary-brown flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
                    {v.views}
                  </div>
                </div>

                {/* Video Info container */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#090909]">
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-white mb-2 tracking-tight group-hover:text-primary-brown transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed mb-6">
                      {v.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between font-sans">
                    <button
                      onClick={() => setActiveVideo({ title: v.title, videoUrl: v.videoUrl })}
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-primary-brown tracking-widest hover:text-white transition-colors cursor-pointer"
                    >
                      Stream Video Reels &rarr;
                    </button>
                    
                    <div className="flex gap-4 text-gray-500">
                      <span className="flex items-center gap-1.5 text-xs hover:text-red-500 cursor-pointer transition-colors">
                        <Heart className="h-3.5 w-3.5" /> Like
                      </span>
                      <span className="flex items-center gap-1.5 text-xs hover:text-primary-brown cursor-pointer transition-colors">
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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

      {/* Cinematic Video Player Modal */}
      <AnimatePresence>
        {activeVideo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl"
            onClick={() => setActiveVideo(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[230] p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-[#ff003c] transition-all border border-white/20 shadow-2xl group cursor-pointer"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[800px] bg-[#0d0d0d] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.95)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Elegant header */}
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent p-6 z-10 flex items-center justify-between pointer-events-none">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-red-500 tracking-[0.3em]">Playing branch reel</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-serif tracking-wide">{activeVideo.title}</h4>
                </div>
              </div>

              {/* Real HTML5 Loop video player */}
              <div className="relative aspect-video w-full bg-black">
                <video 
                  src={activeVideo.videoUrl} 
                  autoPlay 
                  loop 
                  controls 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom tag bar */}
              <div className="bg-[#080808] p-5 flex items-center justify-between border-t border-white/5 font-sans">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                  ⚡ Official Coffee99 Cinematic Showcase
                </span>
                <span className="text-[9px] font-black uppercase text-primary-brown tracking-widest italic animate-pulse">
                  Now Screening
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
