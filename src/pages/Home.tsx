import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
import { slides } from '../heroSlider';
import { useCart } from '../context/CartContext';
import PromotionalCarousel from '../components/PromotionalCarousel';

import { useReviews } from '../context/ReviewContext';

export default function Home() {
  const { addToCart } = useCart();
  const { reviews, addReview } = useReviews();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    // Preload hero images for faster transitions
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.img;
    });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (info.offset.x > swipeThreshold) {
      setDirection(-1);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    })
  };

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.name && newReview.text) {
      addReview(newReview);
      setNewReview({ name: '', text: '', rating: 5 });
      setShowReviewForm(false);
      // Switch to the new review (which will be at the end of the array)
      setCurrentTestimonial(reviews.length);
    }
  };

  const currentReview = reviews[currentTestimonial] || reviews[0];

  return (
    <div className="overflow-x-hidden">
      <PromotionalCarousel />

      {/* 2. HERO SECTION */}
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden cursor-grab select-none">
        {/* Background Slider & Drag Area */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <motion.div
            className="relative h-full w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
          >
            {slides.map((slide, index) => (
              <div 
                key={index}
                className="w-screen h-full relative flex-shrink-0 transition-opacity duration-700"
                style={{
                  opacity: currentSlide === index ? 1 : 0,
                  position: 'absolute',
                  left: 0,
                  top: 0
                }}
              >
                <img 
                  src={slide.img} 
                  alt={slide.title} 
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                  loading={index === currentSlide ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-20 text-center w-full flex flex-col items-center justify-start h-full pointer-events-none pt-16 md:pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto px-4 w-full"
            >
              {slides[currentSlide].type === 'bestsellers' ? (
                <div className="relative w-full max-w-6xl mx-auto py-8 md:py-16 px-4 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/5 bg-black/20 backdrop-blur-sm shadow-2xl">
                  {/* Premium Subtle Background behind title and cards */}
                  <div className="absolute inset-0 -z-10 bg-black">
                    <img 
                      src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200" 
                      alt="" 
                      className="w-full h-full object-cover opacity-15 blur-md scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
                  </div>

                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-full overflow-hidden pointer-events-auto">
                      <motion.div 
                        className="flex gap-4 md:gap-8 justify-center px-4 overflow-x-auto md:overflow-visible no-scrollbar pb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {[
                          { 
                            name: "Burgers", 
                            price: 49, 
                            img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
                            label: "Starting at",
                            badge: "OFFER",
                            isPromo: true
                          },
                          { 
                            name: "Cold Coffee", 
                            price: 119, 
                            img: "https://images.unsplash.com/photo-1541173230599-a362db2327a7?auto=format&fit=crop&q=80&w=400",
                            premium: true 
                          },
                          { 
                            name: "Loaded Fries", 
                            price: 90, 
                            img: "https://i.ibb.co/JjPpxCTY/unnamed.jpg" 
                          },
                          { 
                            name: "Chicken Popcorn", 
                            price: 99, 
                            img: "https://i.ibb.co/95JWsVQ/unnamed.jpg" 
                          }
                        ].map((item, i) => (
                          <motion.div 
                            key={i}
                            whileHover={{ y: -10, scale: 1.05, filter: "brightness(1.15)" }}
                            className="group relative bg-[#0c0c0c]/80 backdrop-blur-2xl rounded-[2.5rem] p-2.5 md:p-4 border border-white/10 w-32 md:w-48 flex-shrink-0 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300"
                          >
                            {/* Premium Glow for Promo */}
                            {item.isPromo && (
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
                            )}
                            
                            <div className="relative h-24 md:h-36 overflow-hidden rounded-[1.5rem] mb-3">
                              <motion.img 
                                src={item.img} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                              />
                              {item.badge && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-bounce">
                                  <span className="text-[7px] md:text-[9px] font-black text-white italic tracking-tighter">{item.badge}</span>
                                </div>
                              )}
                              {/* Cinematic Animated Sweep */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                            </div>

                            <div className="px-1 text-center">
                              {item.label && (
                                <span className="text-[7px] md:text-[10px] text-primary-brown font-black uppercase tracking-[0.2em] block mb-1 opacity-80">{item.label}</span>
                              )}
                              <h3 className="text-[10px] md:text-sm font-black text-white uppercase tracking-widest truncate mb-1 md:mb-2">{item.name}</h3>
                              <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="text-xs md:text-base font-black text-primary-brown">₹{item.price}</span>
                                {item.isPromo && <span className="text-[8px] md:text-[10px] text-white/30 line-through font-bold">₹89</span>}
                              </div>
                              
                              <button 
                                onClick={() => addToCart({
                                  id: `hero-best-${i}`,
                                  name: item.name,
                                  price: Number(item.price),
                                  branchName: "Coffee99",
                                  branchId: "shivmandir",
                                  image: item.img,
                                })}
                                className="w-full py-2 bg-primary-brown hover:bg-white text-white hover:text-black rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-lg active:scale-95"
                              >
                                Add
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-gray-400 mt-6 md:mt-12 text-[10px] font-black tracking-[0.4em] uppercase italic opacity-40"
                    >
                      Premium Selections
                    </motion.p>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="flex flex-col items-center font-serif text-white mb-8 md:mb-12 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    {slides[currentSlide].title.split(' ').map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: i * 0.15, 
                          duration: 0.8, 
                          ease: [0.16, 1, 0.3, 1] 
                        }}
                        className={`${
                          i === 0 
                            ? 'text-5xl md:text-8xl font-bold mb-2 md:mb-4' 
                            : 'text-4xl md:text-7xl italic text-primary-brown font-medium'
                        }`}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-10 md:mb-14 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
                    {slides[currentSlide].text.split(' ').map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                        className="inline-block"
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 mb-12 md:mb-16 pointer-events-auto">
                    <a 
                      href="#locations" 
                      className="w-full sm:w-auto px-10 py-4 bg-primary-brown text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary-brown/40"
                    >
                      Find a Branch
                    </a>
                    <a 
                      href="#reviews" 
                      className="w-full sm:w-auto px-10 py-4 border-2 border-white text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Reviews
                    </a>
                  </div>
                </>
              )}

              {/* Navigation Dots - Centered and aligned below the button */}
              <div className="flex justify-center gap-4 pointer-events-auto">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-primary-brown w-10' 
                        : 'bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 3. BEST PICKS SECTION */}
      <section className="py-12 md:py-20 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="text-primary-brown font-bold text-[10px] md:text-sm uppercase tracking-[0.4em] mb-3 block">Curated Selection</span>
            <h2 className="text-3xl md:text-6xl font-serif text-white leading-tight">Our Best <span className="italic text-primary-brown">Picks in Taste</span></h2>
          </motion.div>

          <div className="relative">
            <motion.div 
              drag="x"
              dragConstraints={{ right: 0, left: -1400 }}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 35 }}
              className="flex gap-4 md:gap-8 cursor-grab active:cursor-grabbing px-2 py-4"
            >
              {[
                { 
                  name: "Loaded French Fries", 
                  price: 90, 
                  image: "https://i.ibb.co/JjPpxCTY/unnamed.jpg",
                  desc: "Crispy golden fries smothered in molten cheese and signature spices.",
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
                  desc: "Decadent chocolate brownie served warm for ultimate indulgence.",
                  tag: "🍰 DESSERT"
                },
                { 
                  name: "Zinger Burger", 
                  price: 139, 
                  image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
                  desc: "A crispy chicken zinger patty with fresh lettuce and spicy mayo.",
                  tag: "🍔 SPICY"
                },
                { 
                  name: "Peri Peri Fries", 
                  price: 119, 
                  image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
                  desc: "Classic fries tossed in a fiery peri-peri seasoning.",
                  tag: "🍟 FLAVORFUL"
                },
                { 
                  name: "Chicken Chips (Triangles)", 
                  price: 109, 
                  image: "https://i.ibb.co/7R2Y1wXk/unnamed.jpg",
                  desc: "Delicious triangular chicken chips, crispy on the outside.",
                  tag: "⚡ NEW"
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="min-w-[260px] md:min-w-[320px] bg-[#0c0c0c] rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group relative"
                  whileHover={{ y: -8 }}
                >
                  <div className="h-44 md:h-56 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent opacity-40" />
                    
                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary-brown/90 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                        {item.tag}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                      <span className="text-[10px] font-bold text-white tracking-widest uppercase">₹{item.price}</span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-lg font-serif font-bold text-white mb-2 leading-tight">{item.name}</h3>
                    <p className="text-gray-500 text-[11px] font-normal mb-6 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <button 
                      onClick={() => addToCart({
                        id: `pick-${idx}`,
                        name: item.name,
                        price: item.price,
                        branchName: "Coffee99",
                        branchId: "shivmandir",
                        image: item.image,
                      })}
                      className="w-full py-3 bg-white/5 hover:bg-primary-brown text-white rounded-full font-bold text-[9px] uppercase tracking-[0.25em] transition-all border border-white/10 flex items-center justify-center gap-2 group/btn"
                    >
                      <ShoppingBag className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section id="reviews" className="py-4 md:py-6 bg-primary-brown overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 md:mb-8"
          >
            <span className="text-white/60 font-bold text-[10px] uppercase tracking-[0.3em] mb-1 block">Testimonials</span>
            <h2 className="text-2xl md:text-3xl font-serif text-white">What Our <span className="italic text-black">Customers Say</span></h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -100, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="text-center"
                >
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(currentReview?.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-white text-white" />
                    ))}
                  </div>
                  <p className="text-lg md:text-2xl font-serif italic text-white mb-4 leading-relaxed px-4">
                    "{currentReview?.text}"
                  </p>
                  <h4 className="text-[10px] md:text-sm font-bold text-black uppercase tracking-widest">
                    {currentReview?.name}
                  </h4>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button 
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + reviews.length) % reviews.length)}
                className="p-2 rounded-full border border-white/50 text-white hover:bg-white hover:text-primary-brown transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % reviews.length)}
                className="p-2 rounded-full border border-white/50 text-white hover:bg-white hover:text-primary-brown transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Review Submission Option */}
            <div className="mt-16 text-center">
              {!showReviewForm ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviewForm(true)}
                  className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl"
                >
                  Leave a Review
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20 max-w-lg mx-auto"
                >
                  <h3 className="text-xl font-serif text-white mb-6">Share Your Experience</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-6 w-6 transition-colors ${
                              star <= newReview.rating ? 'fill-white text-white' : 'text-white/30'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                    <textarea
                      placeholder="Your Review"
                      required
                      rows={3}
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                    ></textarea>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="flex-1 py-3 border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-white text-primary-brown rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. LOCATIONS SECTION (Integrated into Home) */}
      <section id="locations" className="py-12 md:py-24 bg-cream-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="text-center mb-12"
          >
            <span className="text-caramel font-bold text-sm uppercase tracking-[0.3em] mb-2 block">Visit Us</span>
            <h2 className="text-3xl md:text-5xl font-serif text-dark-roast">Our <span className="italic">5 Branches</span></h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {branches.map((branch) => (
              <motion.div
                key={branch.id}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group bg-cream-bg rounded-[40px] overflow-hidden shadow-xl shadow-primary-brown/5 hover:shadow-2xl transition-all duration-500"
              >
                <Link to={`/branch/${branch.id}`} className="block h-64 overflow-hidden relative">
                  <img 
                    src={branch.image} 
                    alt={branch.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </Link>
                <div className="p-10">
                  <h3 className="text-2xl font-serif font-bold text-dark-roast mb-4">{branch.name}</h3>
                  <p className="text-slate-400 text-sm font-light mb-8 line-clamp-2">
                    {branch.description}
                  </p>
                  <div className="flex flex-col gap-4">
                    <Link 
                      to={`/branch/${branch.id}`}
                      className="inline-flex items-center text-primary-brown font-bold text-sm uppercase tracking-widest group/link"
                    >
                      Explore Branch <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
      <section className="py-12 md:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, rotateX: -45 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white">Why <span className="italic text-primary-brown">Choose Us</span></h2>
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
                  staggerChildren: 0.15
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Coffee, title: "Fresh Beans Daily", desc: "Roasted in small batches for peak flavor." },
              { icon: Utensils, title: "Delhi Imported Chicken", desc: "Specially sourced for authentic taste." },
              { icon: Users, title: "Comfort Seating", desc: "Ergonomic spaces for work or relax." },
              { icon: Zap, title: "Fast Service", desc: "Your coffee, ready when you are." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -30, filter: "blur(10px)" },
                  visible: { opacity: 1, x: 0, filter: "blur(0px)" }
                }}
                transition={{ duration: 0.6 }}
                className="bg-latte-beige p-10 rounded-[40px] text-center shadow-2xl shadow-black hover:bg-primary-brown transition-all duration-500 group border border-white/5"
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8 text-primary-brown group-hover:bg-white group-hover:text-primary-brown transition-colors">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed group-hover:text-white/80 transition-colors">
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
