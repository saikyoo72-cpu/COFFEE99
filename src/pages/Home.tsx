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
      {/* 2. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slider & Drag Area */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
                scale: { duration: 0.8 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <img 
                src={slides[currentSlide].img} 
                alt={slides[currentSlide].title} 
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-tight drop-shadow-2xl">
                {slides[currentSlide].title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: "backOut" }}
                    className={word === 'Passion' || word === 'Neighborhood' || word === 'Art' || word === 'Desserts' || word === 'OFF' || word === 'Free' || word === 'Discount' || word === '₹99' || word === 'Cookie' || word === 'Aroma' || word === 'Retreat' || word === 'Care' ? 'italic text-primary-brown inline-block' : 'inline-block'}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary-brown w-8' 
                  : 'bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <PromotionalCarousel />

      {/* 6. CUSTOMER REVIEWS */}
      <section id="reviews" className="py-24 bg-primary-brown overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-white/60 font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">What Our <span className="italic text-black">Customers Say</span></h2>
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
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(currentReview?.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-white text-white" />
                    ))}
                  </div>
                  <p className="text-2xl md:text-4xl font-serif italic text-white mb-8 leading-relaxed">
                    "{currentReview?.text}"
                  </p>
                  <h4 className="text-lg font-bold text-black uppercase tracking-widest">
                    {currentReview?.name}
                  </h4>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + reviews.length) % reviews.length)}
                className="p-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-primary-brown transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % reviews.length)}
                className="p-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-primary-brown transition-all"
              >
                <ChevronRight className="h-6 w-6" />
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
      <section id="locations" className="py-24 bg-cream-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="text-center mb-16"
          >
            <span className="text-caramel font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Visit Us</span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark-roast">Our <span className="italic">5 Branches</span></h2>
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
      <section className="py-24 bg-black">
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
