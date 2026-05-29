import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { 
  ArrowRight, 
  Coffee, 
  Utensils, 
  Users, 
  Zap, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { branches, testimonials } from '../data';
import { useCart } from '../context/CartContext';
import PromotionalCarousel from '../components/PromotionalCarousel';
import { slides } from '../heroSlider';

import { useReviews } from '../context/ReviewContext';
import Typewriter from '../components/Typewriter';

import SEO from '../components/SEO';

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { reviews, addReview } = useReviews();
  const masterpiecesRef = useRef<HTMLDivElement>(null);
  const combosRef = useRef<HTMLDivElement>(null);

  const handleMasterpieceScroll = (direction: 'left' | 'right') => {
    const el = masterpiecesRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth > 768 ? 300 : 220;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleComboScroll = (direction: 'left' | 'right') => {
    const el = combosRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth > 768 ? 240 : 160;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Autoplay Masterpieces (Continuous Smooth Slow Drift)
  useEffect(() => {
    const el = masterpiecesRef.current;
    if (!el) return;

    let scroller: NodeJS.Timeout;
    let isVisible = false;

    const startDrifting = () => {
      clearInterval(scroller);
      scroller = setInterval(() => {
        if (isVisible && !document.hidden && el.scrollWidth > el.clientWidth) {
          const maxScroll = el.scrollWidth - el.clientWidth;
          if (el.scrollLeft >= maxScroll - 1) {
            el.scrollLeft = 0;
          } else {
            el.scrollLeft += 1;
          }
        }
      }, 30); // Gentle cinematic drift speed, extremely smooth & consistent
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startDrifting();
        } else {
          clearInterval(scroller);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(scroller);
      } else if (isVisible) {
        startDrifting();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(scroller);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Autoplay Combos (Continuous Smooth Slow Drift)
  useEffect(() => {
    const el = combosRef.current;
    if (!el) return;

    let scroller: NodeJS.Timeout;
    let isVisible = false;

    const startDrifting = () => {
      clearInterval(scroller);
      scroller = setInterval(() => {
        if (isVisible && !document.hidden && el.scrollWidth > el.clientWidth) {
          const maxScroll = el.scrollWidth - el.clientWidth;
          if (el.scrollLeft >= maxScroll - 1) {
            el.scrollLeft = 0;
          } else {
            el.scrollLeft += 1;
          }
        }
      }, 30); // Gentle cinematic drift speed, extremely smooth & consistent
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startDrifting();
        } else {
          clearInterval(scroller);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(scroller);
      } else if (isVisible) {
        startDrifting();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(scroller);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5, branchId: 'shivmandir' });
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');

  const optimizeImage = (url: string, width: number = 500, quality: number = 70) => {
    if (!url) return '';
    if (url.includes('images.unsplash.com')) {
      // Clean base url by dropping any existing query arguments so we can perfectly control sizing
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&fm=webp&fit=crop&w=${width}&q=${quality}`;
    }
    return url;
  };

  const filteredReviews = selectedBranchFilter === 'all'
    ? reviews
    : reviews.filter(r => r.branchId === selectedBranchFilter);

  useEffect(() => {
    if (filteredReviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % filteredReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [filteredReviews.length]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.name && newReview.text) {
      addReview({
        name: newReview.name,
        text: newReview.text,
        rating: newReview.rating,
        branchId: newReview.branchId
      });
      setNewReview({ name: '', text: '', rating: 5, branchId: 'shivmandir' });
      setShowReviewForm(false);
      setSelectedBranchFilter('all');
      setCurrentTestimonial(reviews.length);
    }
  };

  const currentReview = filteredReviews[currentTestimonial] || filteredReviews[0] || reviews[0];

  return (
    <div className="overflow-x-hidden">
      <SEO 
        title="Coffee99 | Best Coffee, Burgers & Vibes in Siliguri" 
        description="Experience the cinematic vibe at Coffee99. Your one-stop destination for artisanal coffee, slaying burgers, and late-night squad memories."
      />
      <PromotionalCarousel />

      {/* 2. HERO SECTION - Optimized for Speed with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Cinematic Video Background - GPU Accelerated */}
        <div className="absolute inset-0 z-0 gpu">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-85"
            poster={optimizeImage(slides[0].img, 800, 60)}
          >
            <source src="https://files.catbox.moe/9fdq9c.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
        </div>

        {/* Ambient Light Effects - Simplified for performance */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-primary-brown/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-1/4 -right-1/4 w-[300px] h-[300px] bg-brand-cyan/5 blur-[80px] rounded-full" />
        </div>

        <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center pt-24">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="text-primary-brown font-black text-[10px] md:text-xs uppercase tracking-[0.6em] mb-6 block">
                Welcome to the Squad
              </span>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-white mb-6 leading-none tracking-tight select-none">
                <Typewriter 
                  text="Handmade"
                  delay={0.2}
                  className="block text-white"
                  doneClassName="text-transparent"
                  doneStyle={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.45)' }}
                />
                <Typewriter 
                  text="Craft"
                  delay={1.5}
                  className="italic text-primary-brown block"
                  doneClassName="text-transparent"
                  doneStyle={{ WebkitTextStroke: '1px rgba(139, 90, 43, 0.6)' }}
                />
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="text-sm md:text-lg text-gray-300 mb-8 font-light tracking-wide max-w-xl mx-auto leading-relaxed border-l border-primary-brown/30 pl-6 md:pl-10 text-center"
            >
              {slides[0].text}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex flex-row items-center justify-center gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto"
            >
              <a 
                href="#locations" 
                className="group relative px-5 py-2.5 md:px-7 md:py-3.5 bg-primary-brown text-white rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] transition-all hover:bg-primary-brown/95 active:scale-95 shadow-lg shadow-primary-brown/10 shrink-0 text-center cursor-pointer"
              >
                Find a Branch
              </a>
              <a 
                href="#reviews" 
                className="group relative px-5 py-2.5 md:px-7 md:py-3.5 border border-white/10 hover:border-white/30 text-white/80 hover:text-white rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.2em] transition-all backdrop-blur-md bg-white/5 active:scale-95 shrink-0 text-center cursor-pointer"
              >
                Reviews
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary-brown to-transparent" />
        </motion.div>
      </section>

      {/* 3. BEST PICKS SECTION - Optimized & Compact */}
      <section className="py-8 bg-[#050505] overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-primary-brown/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              className="text-left"
            >
              <span className="text-primary-brown font-black text-[9px] uppercase tracking-[0.4em] mb-2 block">Squad Picks</span>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                Selected <span className="italic text-primary-brown">Masterpieces</span>
              </h2>
            </motion.div>
            
            {/* Elegant Cinematic Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleMasterpieceScroll('left')}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary-brown hover:border-primary-brown/40 transition-all duration-300 active:scale-95 bg-white/5 cursor-pointer"
                aria-label="Previous Masterpiece"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleMasterpieceScroll('right')}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-primary-brown hover:border-primary-brown/40 transition-all duration-300 active:scale-95 bg-white/5 cursor-pointer"
                aria-label="Next Masterpiece"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div 
              ref={masterpiecesRef}
              className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar px-2 py-2"
            >
              {[
                { 
                  name: "Loaded French Fries", 
                  price: 90, 
                  image: "https://i.ibb.co/JjPpxCTY/unnamed.jpg",
                  desc: "Crispy golden fries smothered in molten cheese.",
                  tag: "🔥 BESTSELLER"
                },
                { 
                  name: "Chicken Popcorn", 
                  price: 99, 
                  image: "https://i.ibb.co/95JWsVQ/unnamed.jpg",
                  desc: "Crunchy, spicy, and bite-sized chicken delight.",
                  tag: "🍗 CRISPY"
                },
                { 
                  name: "Oreo Shake", 
                  price: 120, 
                  image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400",
                  desc: "Creamy, thick, and loaded with crushed Oreos.",
                  tag: "🥤 CHILLED"
                },
                { 
                  name: "Hot Brownie", 
                  price: 99, 
                  image: "https://i.ibb.co/7dfLj61B/unnamed.jpg",
                  desc: "Indulgent brownie served warm.",
                  tag: "🍰 DESSERT"
                },
                { 
                  name: "Paneer Tikka Roll", 
                  price: 110, 
                  image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400",
                  desc: "Spiced paneer wrap with fresh chutney.",
                  tag: "🌯 TASTY ROLL"
                },
                { 
                  name: "Hazelnut Cold Coffee", 
                  price: 130, 
                  image: "https://images.unsplash.com/photo-1461023058043-07fc21e3543d?auto=format&fit=crop&q=80&w=400",
                  desc: "Rich espresso with premium hazelnut syrup.",
                  tag: "☕ REFRESHING"
                },
                { 
                  name: "Loaded Nachos", 
                  price: 140, 
                  image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=400",
                  desc: "Crispy nachos with salsa, sour cream, and cheese.",
                  tag: "🌮 MEXICAN WOW"
                },
                { 
                  name: "Red Velvet Waffle", 
                  price: 110, 
                  image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400",
                  desc: "Fresh red velvet waffle topped with white chocolate.",
                  tag: "🧇 INDULGENT"
                },
                { 
                  name: "Crispy Veg Nuggets", 
                  price: 85, 
                  image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=400",
                  desc: "Crunchy golden nuggets served with tasty dip.",
                  tag: "🍟 BITE-SIZE"
                },
                { 
                  name: "KitKat Premium Shake", 
                  price: 130, 
                  image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400",
                  desc: "Creamy chocolate shake blended with KitKat bar bits.",
                  tag: "🥤 DOUBLE CHOCO"
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="min-w-[145px] sm:min-w-[170px] md:min-w-[220px] snap-start snap-always shrink-0 bg-[#0c0c0c] rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 group flex flex-col justify-between hover:border-primary-brown/40"
                >
                  <div className="h-20 sm:h-28 md:h-32 overflow-hidden relative">
                    <img 
                      src={optimizeImage(item.image, 300, 60)} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/90 rounded border border-white/10">
                      <span className="text-[6.5px] sm:text-[8px] font-black text-primary-brown uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/95 border border-primary-brown/30 rounded">
                      <span className="text-[9px] sm:text-xs font-black text-primary-brown">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Bold, bright solid white title to be highly readable for anyone with glasses/power */}
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 leading-tight line-clamp-2 select-text font-sans">
                        {item.name}
                      </h3>
                      {/* High-contrast lighter grey */}
                      <p className="text-gray-300 text-[9px] sm:text-[11px] font-normal mb-2 leading-relaxed line-clamp-1">
                        {item.desc}
                      </p>
                    </div>

                    <button 
                      onClick={() => addToCart({
                        id: `pick-${idx}`,
                        name: item.name,
                        price: item.price,
                        branchName: "Coffee99",
                        branchId: "shivmandir",
                        image: item.image,
                      })}
                      className="w-full py-1.5 bg-primary-brown hover:bg-primary-brown/95 text-white font-extrabold text-[8px] sm:text-[10px] uppercase tracking-wider transition-all rounded-lg flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-md"
                    >
                      <ShoppingBag className="w-2.5 h-2.5 text-white" />
                      Add to Squad
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMBOS SECTION - Optimized & Compact */}
      <section className="py-8 bg-black overflow-hidden border-t border-white/5 relative">
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-brand-cyan/5 blur-[100px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              className="text-left"
            >
              <span className="text-brand-cyan font-black text-[9px] uppercase tracking-[0.4em] mb-2 block">Squad Deals</span>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                Slaying <span className="italic text-brand-cyan">Combos</span>
              </h2>
            </motion.div>
            
            {/* Elegant Cinematic Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleComboScroll('left')}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-cyan hover:border-brand-cyan/40 transition-all duration-300 active:scale-95 bg-white/5 cursor-pointer"
                aria-label="Previous Combo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleComboScroll('right')}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-cyan hover:border-brand-cyan/40 transition-all duration-300 active:scale-95 bg-white/5 cursor-pointer"
                aria-label="Next Combo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div 
              ref={combosRef}
              className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar px-2 py-2"
            >
              {[
                { 
                  name: "Veg Burger + Fries + Coke", 
                  price: 119, 
                  image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600",
                  desc: "The ultimate classic veg meal delight.",
                  tag: "🍔 VEG MEAL"
                },
                { 
                  name: "Chicken Burger + Fries + Coke", 
                  price: 129, 
                  image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600",
                  desc: "Crispy chicken burger combo.",
                  tag: "🍗 CHICKEN MEAL"
                },
                { 
                  name: "Crispy Nuggets + Oreo Shake", 
                  price: 189, 
                  image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600",
                  desc: "Chilled Oreo milkshake paired with hot crispy golden nuggets.",
                  tag: "🍗 SQUAD DELICE"
                },
                { 
                  name: "Paneer Wrap + Hot Brownie", 
                  price: 189, 
                  image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=600",
                  desc: "Grilled wrap served with hot brownie.",
                  tag: "🌯 SWEET & SPICY"
                },
                { 
                  name: "Loaded Fries + Hazelnut Coffee", 
                  price: 199, 
                  image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600",
                  desc: "Loaded cheesy fries and cold brew.",
                  tag: "🍟 TWIN BEAT"
                },
                { 
                  name: "Cheese Corn Sandwich + Peach Iced Tea", 
                  price: 149, 
                  image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600",
                  desc: "Melted cheese & sweet corn grilled sandwich with peach iced tea.",
                  tag: "🥪 SQUAD FAVORITE"
                },
                { 
                  name: "Club Sandwich + KitKat Shake", 
                  price: 199, 
                  image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600",
                  desc: "Club sandwich with KitKat milkshake.",
                  tag: "🥪 CLUB FEAST"
                },
                { 
                  name: "Garlic Bread + Cappuccino", 
                  price: 149, 
                  image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=600",
                  desc: "Cheesy garlic bread with hot cappuccino.",
                  tag: "☕ REFRESH SPREAD"
                },
                { 
                  name: "Crispy Momos + Virgin Mojito", 
                  price: 159, 
                  image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600",
                  desc: "Crispy fried momos and lime cooler.",
                  tag: "🥟 RETRO BLAST"
                },
                { 
                  name: "Tandoori Grill Sandwich + Chai", 
                  price: 129, 
                  image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600",
                  desc: "Smoky tandoori sandwich and tea.",
                  tag: "☕ TEATIME DUO"
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="min-w-[145px] sm:min-w-[170px] md:min-w-[220px] snap-start snap-always shrink-0 bg-[#0c0c0c] rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 group flex flex-col justify-between hover:border-brand-cyan/40"
                >
                  <div className="h-20 sm:h-28 md:h-32 overflow-hidden relative">
                    <img 
                      src={optimizeImage(item.image, 300, 60)} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/90 rounded border border-white/10">
                      <span className="text-[6.5px] sm:text-[8px] font-black text-brand-cyan uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/95 border border-brand-cyan/30 rounded">
                      <span className="text-[9px] sm:text-xs font-black text-brand-cyan">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Bold, bright solid white title to be highly readable for anyone with glasses/power */}
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 leading-tight line-clamp-2 select-text font-sans">
                        {item.name}
                      </h3>
                      {/* High-contrast lighter grey */}
                      <p className="text-gray-300 text-[9px] sm:text-[11px] font-normal mb-2 leading-relaxed line-clamp-1">
                        {item.desc}
                      </p>
                    </div>

                    <button 
                      onClick={() => addToCart({
                        id: `combo-home-flat-${idx}`,
                        name: item.name,
                        price: item.price,
                        branchName: "Coffee99",
                        branchId: "shivmandir",
                        image: item.image,
                      })}
                      className="w-full py-1.5 bg-brand-cyan hover:bg-brand-cyan/95 text-black font-extrabold text-[8px] sm:text-[10px] uppercase tracking-wider transition-all rounded-lg flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-md"
                    >
                      <ShoppingBag className="w-2.5 h-2.5 text-black" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS - Cinematic Redesign */}
      <section id="reviews" className="py-20 bg-[#080808] overflow-hidden relative">
        {/* Cinematic Backdrop with Vignette and Bloom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-primary-brown/5 to-black pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        
        {/* Soft Radial Bloom */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-brown/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <span className="text-primary-brown font-black text-[10px] uppercase tracking-[0.5em] mb-3 block">Squad Resonance</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter col-title">
              The <span className="italic text-primary-brown text-glow-red">Voices</span>
            </h2>
          </motion.div>

          {/* Centered Branch Filter - Premium, Smaller & Compact Dropdown */}
          <div className="flex flex-col items-center justify-center mb-10 select-branch-area">
            <div className="relative inline-block">
              <select
                value={selectedBranchFilter}
                onChange={(e) => {
                  setSelectedBranchFilter(e.target.value);
                  setCurrentTestimonial(0);
                }}
                className="appearance-none bg-[#111] hover:bg-[#161616] text-white/70 hover:text-white border border-white/10 rounded-full px-5 py-2.5 pr-9 text-[9px] uppercase tracking-widest font-black focus:outline-none focus:border-primary-brown/45 cursor-pointer transition-all duration-300 shadow-lg text-center"
              >
                <option value="all">📍 All Branches</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id} className="bg-black text-white">📍 {b.name}</option>
                ))}
              </select>
              <div className="absolute top-1/2 right-3.5 -translate-y-1/2 pointer-events-none text-white/40 text-[6px]">
                ▼
              </div>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden min-h-[360px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedBranchFilter}-${currentTestimonial}`}
                  initial={{ opacity: 0, scale: 0.98, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.02, x: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <div className="glass-dark p-8 md:p-14 rounded-[50px] border-white/5 shadow-2xl relative overflow-hidden group/card">
                    {/* Subtle internal atmospheric glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-brown/10 blur-[80px] rounded-full" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1a1a1a] to-primary-brown/20 border border-white/10 flex items-center justify-center font-serif text-2xl italic text-primary-brown mb-5 shadow-inner shadow-black">
                        {currentReview?.name ? currentReview.name.charAt(0) : "C"}
                      </div>

                      {currentReview?.branchId && (
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] uppercase tracking-widest font-black text-primary-brown mb-5">
                          📍 {branches.find(b => b.id === currentReview.branchId)?.name || "Siliguri Squad"}
                        </div>
                      )}

                      <div className="flex justify-center gap-1.5 mb-8">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < (currentReview?.rating || 5) ? 'fill-primary-brown text-primary-brown' : 'text-white/5'}`} />
                        ))}
                      </div>

                      <blockquote className="text-lg md:text-2xl font-serif italic text-white/90 leading-snug text-center tracking-tight mb-10 max-w-2xl min-h-[80px] flex items-center justify-center">
                        "{currentReview?.text || "No reviews found under this branch yet. Be the first to share your story!"}"
                      </blockquote>

                      <div className="flex flex-col items-center">
                        <div className="w-8 h-[1px] bg-primary-brown/40 mb-4" />
                        <h4 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.5em] italic">
                          {currentReview?.name || "Coffee99 Patron"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls - Sleek & Grounded */}
            <div className="flex justify-center gap-8 mt-12">
              <button 
                onClick={() => setCurrentTestimonial((prev) => (filteredReviews.length ? (prev - 1 + filteredReviews.length) % filteredReviews.length : 0))}
                className="group w-12 h-12 rounded-full border border-white/10 glass-dark flex items-center justify-center text-white/40 hover:text-primary-brown hover:border-primary-brown/40 transition-all duration-500 active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={() => setCurrentTestimonial((prev) => (filteredReviews.length ? (prev + 1) % filteredReviews.length : 0))}
                className="group w-12 h-12 rounded-full border border-white/10 glass-dark flex items-center justify-center text-white/40 hover:text-primary-brown hover:border-primary-brown/40 transition-all duration-500 active:scale-90 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Review Form Toggler - Premium Glass Style */}
            <div className="mt-16 text-center">
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="group relative px-10 py-4 glass-dark text-white border border-white/5 rounded-full font-black text-[9px] uppercase tracking-[0.4em] transition-all hover:border-primary-brown/30 hover:shadow-[0_0_20px_rgba(178,34,34,0.15)] active:scale-95 cursor-pointer"
                >
                  <span className="relative z-10 group-hover:text-primary-brown transition-colors">Share Your Story</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/95 backdrop-blur-3xl p-8 md:p-12 rounded-[40px] border border-white/10 max-w-xl mx-auto shadow-2xl relative z-20"
                >
                  <h3 className="text-xl md:text-2xl font-serif text-white mb-6 tracking-tight">Join the Vibe</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="flex justify-center gap-3 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="transition-transform hover:scale-110 active:scale-90"
                        >
                          <Star 
                            className={`h-6 w-6 transition-colors ${
                              star <= newReview.rating ? 'fill-primary-brown text-primary-brown' : 'text-white/5'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-row items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-[20px] px-4 py-2 mx-auto max-w-xs">
                      <span className="text-gray-400 font-black text-[8px] uppercase tracking-wider">Branch visited:</span>
                      <div className="relative inline-block">
                        <select
                          value={newReview.branchId}
                          onChange={(e) => setNewReview({ ...newReview, branchId: e.target.value })}
                          className="appearance-none bg-transparent text-white border-none py-0.5 pl-1 pr-6 text-[9px] uppercase tracking-widest font-black focus:outline-none cursor-pointer"
                        >
                          {branches.map(b => (
                            <option key={b.id} value={b.id} className="bg-black text-white">{b.name}</option>
                          ))}
                        </select>
                        <div className="absolute top-1/2 right-1.5 -translate-y-1/2 pointer-events-none text-white/40 text-[5px]">
                          ▼
                        </div>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Your Tag Name"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white placeholder:text-white/20 focus:outline-none focus:border-primary-brown/40 transition-all font-light text-xs"
                    />
                    <textarea
                      placeholder="The Experience..."
                      required
                      rows={3}
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-[20px] text-white placeholder:text-white/20 focus:outline-none focus:border-primary-brown/40 transition-all resize-none font-light text-xs"
                    ></textarea>
                    <div className="flex gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="flex-1 py-4 glass-dark text-white/60 rounded-full font-bold text-[9px] uppercase tracking-widest hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-primary-brown text-white rounded-full font-bold text-[9px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(178,34,34,0.4)] transition-all active:scale-95"
                      >
                        Post Story
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. LOCATIONS SECTION - Optimized & Compact */}
      <section id="locations" className="py-16 bg-[#080808] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-brown/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary-brown font-black text-[9px] uppercase tracking-[0.4em] mb-3 block">Squad territories</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">
              The <span className="italic text-primary-brown">Hubs</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {branches.map((branch, idx) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => navigate(`/branch/${branch.id}`)}
                className="group relative bg-[#0c0c0c] rounded-[32px] overflow-hidden border border-white/5 transition-all duration-500 gpu cursor-pointer hover:border-primary-brown/40 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                <div className="flex flex-row md:flex-col h-[130px] md:h-auto">
                  <div className="block w-1/3 md:w-full h-full md:h-44 overflow-hidden relative shrink-0">
                    <img 
                      src={optimizeImage(branch.image, 400, 50)} 
                      alt={branch.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-4 md:p-6 flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1 h-1 rounded-full bg-primary-brown animate-pulse" />
                      <span className="text-[7px] md:text-[8px] font-black text-primary-brown uppercase tracking-widest italic">Live Now</span>
                    </div>
                    <h3 className="text-base md:text-xl font-serif font-black text-white mb-1 tracking-tight group-hover:text-primary-brown transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-gray-500 text-[9px] md:text-[10px] font-light mb-4 line-clamp-1">
                      {branch.address}
                    </p>
                    <div className="flex items-center gap-3">
                      <button 
                        className="px-4 py-2 bg-primary-brown/10 group-hover:bg-primary-brown text-white rounded-full font-black text-[8px] uppercase tracking-[0.2em] transition-all border border-primary-brown/10 active:scale-95"
                      >
                        Enter
                      </button>
                      <button className="p-2 glass rounded-full text-white/40 group-hover:text-white transition-colors border border-white/5">
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT / STORY SECTION */}
      <section id="about" className="py-24 bg-latte-beige overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading Section - Now Above the Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 lg:mb-16"
          >
            <span className="text-primary-brown font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              Bold Flavors, <span className="italic text-primary-brown">Edgy Vibes</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Image Section - Left Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -100 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative flex justify-center lg:justify-start"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl border-8 border-white/5 relative z-10">
                <img 
                  src="https://i.ibb.co/MD8b5gHk/image.jpg" 
                  alt="Raja - Founder of Coffee99" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              {/* Subtle accent circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-primary-brown/20 rounded-full -z-0 hidden lg:block"></div>
            </motion.div>

            {/* Text Section - Right Side */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7"
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    staggerChildren: 0.2,
                    duration: 0.8,
                    ease: "easeOut"
                  }
                }
              }}
            >
              <motion.p variants={{ hidden: { opacity: 0, y: 20, filter: "blur(5px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }} className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                Founded in 2018 by Raja, Coffee99 is a first-generation passion project that transformed a simple dream into Siliguri’s ultimate neighborhood retreat. We’re a community-driven hub dedicated to handcrafted brews and fresh bites, ensuring every cup reflects our commitment to quality. Whether you're here for a quiet espresso or a lively catch-up, Coffee99 is where bold flavors and unforgettable moments collide.
              </motion.p>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-wrap gap-10">
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold text-primary-brown">2018</span>
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Established</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold text-primary-brown">15k+</span>
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Happy Clients</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US (Moved to last) */}
      <section className="py-10 md:py-12 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, rotateX: -45 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-white">Why <span className="italic text-primary-brown">Choose Us</span></h2>
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
                  staggerChildren: 0.12
                }
              }
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {[
              { icon: Coffee, title: "Fresh Beans Daily", desc: "Roasted in small batches for peak flavor." },
              { icon: Utensils, title: "Delhi Chicken", desc: "Specially sourced for authentic taste." },
              { icon: Users, title: "Comfort Seating", desc: "Ergonomic spaces to work or relax." },
              { icon: Zap, title: "Fast Service", desc: "Your coffee, ready when you are." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
                className="bg-latte-beige/30 p-5 md:p-6 rounded-[24px]/[20px] rounded-3xl text-center shadow-lg hover:bg-primary-brown transition-all duration-300 group border border-white/5"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-brown group-hover:bg-white group-hover:text-primary-brown transition-colors">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xs md:text-sm font-serif font-bold text-white mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-400 text-[10px] md:text-xs font-light leading-snug group-hover:text-white/80 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
