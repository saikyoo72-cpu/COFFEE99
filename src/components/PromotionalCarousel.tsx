import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1920',
    title: 'Limited Time Offer',
    subtitle: 'Get 20% off on all cold brews!',
    buttonText: 'Order Now',
    link: '/menu'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1920',
    title: 'New Arrival',
    subtitle: 'Try our new Delhi Imported Chicken Sandwich.',
    buttonText: 'View Menu',
    link: '/menu'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920',
    title: 'Coffee99 Rewards',
    subtitle: 'Join our creator program and earn rewards.',
    buttonText: 'Join Now',
    link: '/creator-program'
  }
];

export default function PromotionalCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) {
      const resumeTimer = setTimeout(() => setIsPaused(false), 5000);
      return () => clearTimeout(resumeTimer);
    }
  }, [isPaused]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 3000); // Slower for a more professional feel
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[160px] md:h-[200px] overflow-hidden rounded-3xl shadow-xl shadow-black/20 border border-white/10 bg-latte-beige">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            </div>
            
            <div className="relative h-full flex items-center px-8 md:px-16">
              <div className="max-w-xl">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block px-3 py-1 bg-primary-brown/20 text-primary-brown text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-3 border border-primary-brown/30">
                    Featured Offer
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1 leading-tight">
                    {slides[currentIndex].title}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-400 mb-4 font-light max-w-sm">
                    {slides[currentIndex].subtitle}
                  </p>
                  {slides[currentIndex].buttonText && (
                    <Link
                      to={slides[currentIndex].link}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white hover:text-primary-brown transition-colors group"
                    >
                      {slides[currentIndex].buttonText}
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots - Minimalist */}
        <div className="absolute bottom-4 right-8 flex gap-1.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary-brown w-4' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
