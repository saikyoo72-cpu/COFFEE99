import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920',
    label: 'FOR CREATORS 🎥',
    title: 'Join Our Squad',
    subtitle: 'Are you a content creator? Collaborate with Coffee99, get featured, and grow with us.',
    buttonText: 'Join Now',
    link: '/creator-program'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=1920',
    label: 'Hot Picks 🔥',
    title: 'New Hot Items 🔥',
    subtitle: 'Try our latest hot and trending items, freshly made and full of flavor.',
    buttonText: 'Order Now',
    link: '/hot-items'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920',
    label: 'CREATORS 🎬',
    title: 'Creators Page',
    subtitle: 'Watch our latest videos, behind-the-scenes moments, and coffee stories.',
    buttonText: 'Watch Now',
    link: '/blogs'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&q=80&w=1920',
    label: 'Starting at ₹49 Only ✨',
    title: 'Bestseller Items',
    subtitle: 'Burger starts from ₹49 only! Taste the legends of Coffee99.',
    buttonText: 'Explore Now',
    link: '/bestsellers'
  }
];

function Sparkle({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.5, 0.8, 1.2, 0],
        opacity: [0, 1, 0.8, 1, 0],
        y: [0, -150],
        x: [0, (Math.random() - 0.5) * 150],
        rotate: [0, 180, 360]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut" 
      }}
      className="absolute text-yellow-300 text-2xl pointer-events-none drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]"
      style={{
        left: `${Math.random() * 100}%`,
        bottom: '-20px'
      }}
    >
      ✨
    </motion.div>
  );
}

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
      className="relative w-full pt-20 bg-[#050505] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Celebration Particles */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-10">
        {[...Array(12)].map((_, i) => (
          <Sparkle key={i} delay={i * 0.3} />
        ))}
      </div>

      {/* Decorative Celebration Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary-brown blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-purple-600 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="relative h-[200px] md:h-[260px] overflow-hidden shadow-xl shadow-black/20">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 180, damping: 25 },
              opacity: { duration: 0.5 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-pointer"
          >
            <Link to={slides[currentIndex].link} className="absolute inset-0 z-30" />
            <div 
              className="absolute inset-0 bg-center bg-cover"
              style={{ 
                backgroundImage: `url(${slides[currentIndex].image})`,
                filter: 'brightness(0.6) contrast(1.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            </div>
            
            <div className="relative h-full flex items-center px-6 md:px-16 lg:px-24">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6"
              >
                <div>
                  <span className="inline-block px-3 py-0.5 bg-primary-brown text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-primary-brown/30">
                    {slides[currentIndex].label}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl md:text-3xl font-serif font-bold text-white leading-none tracking-tight">
                      {slides[currentIndex].title}
                    </h2>
                    <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white group-hover:bg-primary-brown transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                  {slides[currentIndex].id === 4 && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] md:text-xs text-primary-brown font-black uppercase tracking-[0.2em] mt-1"
                    >
                      Burger starting at ₹49 only
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Navigation Dots */}
        <div className="absolute bottom-3 right-8 flex gap-1.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary-brown w-6' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
