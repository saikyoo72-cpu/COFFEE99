import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://i.ibb.co/dxdtzhL/926df87b-7b63-4e3f-ba55-42ebd7dc4319.jpg',
    title: '',
    subtitle: '',
    buttonText: 'Grab this offer',
    link: '/menu'
  },
  {
    id: 2,
    image: 'https://i.ibb.co/MDjfV9Wf/6eb23f39-e9de-4a5d-bad4-299641f22cfb.jpg',
    title: '',
    subtitle: '',
    buttonText: 'Grab this offer',
    link: '/menu'
  },
  {
    id: 3,
    image: 'https://i.ibb.co/bg7NZx3Y/abf9d5cb-dc39-4f57-b86c-75a43ef3eec0.jpg',
    title: '',
    subtitle: '',
    buttonText: 'Grab this offer',
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
      className="relative w-full my-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[140px] md:h-[200px] overflow-hidden shadow-xl shadow-black/20 bg-latte-beige">
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
              className="absolute inset-0 bg-center opacity-90 bg-cover"
              style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            >
              {slides[currentIndex].title && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              )}
            </div>
            
            {slides[currentIndex].buttonText && (
              <div className="absolute bottom-4 left-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-white/20 transition-all shadow-lg cursor-pointer"
                >
                  {slides[currentIndex].buttonText}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </div>
            )}

            {slides[currentIndex].title && (
              <div className="relative h-full flex items-center px-8 md:px-16 pb-12">
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
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots - Minimalist & Centered */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
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
