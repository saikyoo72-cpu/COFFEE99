import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1920',
    label: 'COMMUNITY 🎥',
    title: 'Join Our Community',
    subtitle: 'Are you a content creator? Collaborate with Coffee99, get featured, and grow with our community.',
    buttonText: 'Join Now',
    link: '/creator-program'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=1920',
    label: 'THE SQUAD 🔥',
    title: 'Coffee99 Squad',
    subtitle: 'Experience the boldest flavors with the coolest community in Siliguri.',
    buttonText: 'Order Now',
    link: '/hot-items'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920',
    label: 'FRESH 🎬',
    title: 'Freshly Brewed Daily',
    subtitle: 'Handcrafted excellence in every cup, delivered with passion everyday.',
    buttonText: 'Watch Now',
    link: '/blogs'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&q=80&w=1920',
    label: 'LIFESTYLE ✨',
    title: 'More Than Coffee',
    subtitle: 'A place for memories, connections, and the finest artisanal eats.',
    buttonText: 'Explore Now',
    link: '/bestsellers'
  }
];

function FadeGlow({ color = "#D00000", delay = 0 }: { color?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.3, 0],
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity, 
        delay,
        ease: "linear" 
      }}
      className="absolute blur-[80px] rounded-full pointer-events-none gpu"
      style={{
        backgroundColor: color,
        width: '250px',
        height: '250px',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
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
    if (isPaused) return;
    const timer = setInterval(nextSlide, 2500); 
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '5%' : '-5%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '5%' : '-5%',
      opacity: 0,
    })
  };

  return (
    <div 
      className="relative w-full pt-10 bg-black overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 z-0 opacity-20 flex justify-around overflow-hidden pointer-events-none">
        <FadeGlow color="#D00000" delay={0} />
        <FadeGlow color="#00BB9F" delay={4} />
      </div>

      <div className="relative h-[130px] md:h-[180px] overflow-hidden border-b border-white/5">
        <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: 0.6, ease: "easeOut" },
                opacity: { duration: 0.4 },
              }}
              className="absolute inset-0 gpu"
            >
              <Link to={slides[currentIndex].link} className="absolute inset-0 z-30" />
              <div 
                className="absolute inset-0 bg-center bg-cover transition-transform duration-[2000ms] scale-105"
                style={{ 
                  backgroundImage: `url(${(() => {
                    const imgUrl = slides[currentIndex].image;
                    const baseUrl = imgUrl.split('?')[0];
                    return `${baseUrl}?auto=format&fm=webp&fit=crop&w=1000&q=60`;
                  })()})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
              </div>
            
            <div className="relative h-full flex items-center px-8 md:px-24">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  <span className="w-fit px-3 py-1 glass-dark text-white text-[8px] font-black uppercase tracking-[0.4em] rounded-full">
                    {slides[currentIndex].label}
                  </span>
                  <div>
                    <h2 className="text-2xl md:text-4xl font-serif font-black text-white leading-tight mb-1">
                      {slides[currentIndex].title}
                    </h2>
                    <p className="text-gray-400 text-[10px] md:text-xs font-light max-w-lg hidden md:block">
                      {slides[currentIndex].subtitle}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Controls */}
        <div className="absolute bottom-6 right-8 flex items-center gap-6 z-40">
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-[2px] transition-all duration-500 ${
                  index === currentIndex ? 'bg-primary-brown w-10' : 'bg-white/10 w-4 hover:bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
