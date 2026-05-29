import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PartyPopper, Disc, Flame } from 'lucide-react';

// Generative party particle data mapping multiple coordinates for party feel
const CONFETTI_PARTICLES = [
  { id: 1, char: '🎉', size: 24, left: '8%', top: '15%', duration: 4, delay: 0.1, rotate: [0, 360], y: [-15, 25] },
  { id: 2, char: '✨', size: 18, left: '84%', top: '12%', duration: 3.2, delay: 0.4, rotate: [0, 180], y: [15, -25] },
  { id: 3, char: '🥳', size: 22, left: '78%', top: '75%', duration: 4.8, delay: 0.2, rotate: [0, -360], y: [-20, 20] },
  { id: 4, char: '🎈', size: 20, left: '12%', top: '78%', duration: 4.2, delay: 0.7, rotate: [-15, 15], y: [20, -20] },
  { id: 5, char: '🍻', size: 20, left: '88%', top: '42%', duration: 3.5, delay: 0.3, rotate: [0, 360], y: [-15, 15] },
  { id: 6, char: '🍔', size: 18, left: '7%', top: '48%', duration: 3.9, delay: 0.5, rotate: [-30, 30], y: [10, -20] },
  { id: 7, char: '💃', size: 22, left: '18%', top: '30%', duration: 5.2, delay: 0.8, rotate: [0, 20], y: [-10, 30] },
  { id: 8, char: '🍕', size: 18, left: '74%', top: '32%', duration: 4.1, delay: 0.6, rotate: [-180, 180], y: [25, -15] },
];

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Always trigger the popup on page reload so the experience is reliable and testable
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 7000); // Elegantly delayed to appear after exactly 7 seconds
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 overflow-hidden">
          {/* Backdrop with elegant party night vibes & heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Interactive Disco Glow Lights behind the popup */}
          <motion.div 
            animate={{
              scale: [1, 1.2, 0.9, 1.1, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute z-10 w-[450px] h-[450px] bg-gradient-to-tr from-[#b22222]/20 via-[#4b0082]/15 to-[#00ffff]/15 blur-[90px] rounded-full pointer-events-none"
          />

          {/* Popup Card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-full max-w-[360px] bg-gradient-to-b from-[#121212] to-[#040404] rounded-[40px] overflow-hidden border border-white/10 shadow-[0_45px_100px_rgba(0,0,0,0.95)]"
          >
            {/* Dynamic Disco Neon Ring */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-brown via-purple-600 to-brand-cyan animate-pulse" />

            {/* Floating Confetti Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {CONFETTI_PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0.3, 0.9, 0.3], 
                    scale: [0.8, 1.15, 0.8],
                    y: p.y,
                    rotate: p.rotate
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="absolute select-none"
                  style={{
                    left: p.left,
                    top: p.top,
                    fontSize: p.size,
                    filter: 'drop-shadow(0 0 8px rgba(255, 100, 0, 0.5))'
                  }}
                >
                  {p.char}
                </motion.div>
              ))}
            </div>

            {/* Luxury Disco/Lounge branding element */}
            <div className="p-8 pb-9 relative z-10 flex flex-col items-center text-center">
              
              {/* Premium micro badge */}
              <div className="mb-5 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <Sparkles className="h-3 w-3 text-primary-brown animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300">
                  Exclusive Vibes Club
                </span>
              </div>

              {/* Main glowing icon layout */}
              <div className="relative mb-6">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.12, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-primary-brown/30 blur-2xl rounded-full" 
                />
                
                {/* Spinning disco wheel element */}
                <div className="relative w-20 h-20 bg-[#161616] rounded-[28px] flex items-center justify-center border border-primary-brown/40 shadow-inner">
                  {/* Decorative neon ring */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-1 rounded-full border border-dashed border-primary-brown/30 opacity-70"
                  />
                  <PartyPopper className="h-10 w-10 text-primary-brown relative z-10" strokeWidth={1.5} />
                  
                  {/* Active pulsing tag */}
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff003c] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                    Lounge
                  </span>
                </div>
              </div>

              {/* High Contrast, easily readable main title */}
              <h2 className="text-2xl sm:text-3xl font-serif text-white mb-3.5 leading-tight tracking-tight">
                Welcome to the <br />
                <span className="italic text-primary-brown text-glow-red font-semibold">Coffee99 Arena! ⚡</span>
              </h2>

              <p className="text-[11px] sm:text-xs text-gray-300 font-light leading-relaxed max-w-[280px] mx-auto mb-7">
                Prepare yourself for Siliguri’s coolest hotspot. Unmatchable artisanal brews, mouth-watering eats, and high-energy squad atmosphere await! 🤝
              </p>

              {/* CTA Buttons */}
              <div className="w-full space-y-3">
                <button
                  onClick={handleClose}
                  className="group/btn relative w-full py-4 overflow-hidden bg-primary-brown text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-lg shadow-primary-brown/30 transition-all hover:shadow-primary-brown/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                >
                  {/* Elegant metallic sweeping effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    Start the Vibes 🥳
                  </span>
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-1.5 text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                >
                  Direct Entry
                </button>
              </div>

            </div>

            {/* Glowing party aesthetic corners */}
            <div className="absolute top-0 right-0 w-20 h-[1px] bg-gradient-to-l from-primary-brown/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-20 h-[1px] bg-gradient-to-r from-brand-cyan/40 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
