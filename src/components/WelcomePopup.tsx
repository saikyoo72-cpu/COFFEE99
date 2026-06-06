import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PartyPopper, Disc, Flame } from 'lucide-react';

// Generative party particle data mapping multiple coordinates for party feel
const CONFETTI_PARTICLES = [
  { id: 1, char: '🎉', size: 24, left: '8%', top: '15%', duration: 4, delay: 0.1, rotate: 360, y: 40 },
  { id: 2, char: '✨', size: 18, left: '84%', top: '12%', duration: 3.5, delay: 0.4, rotate: 180, y: -40 },
  { id: 3, char: '🥳', size: 22, left: '78%', top: '75%', duration: 4.5, delay: 0.2, rotate: -360, y: 30 },
  { id: 4, char: '🎈', size: 20, left: '12%', top: '78%', duration: 4, delay: 0.7, rotate: 15, y: -30 },
];

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a shorter, snappier delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500); 
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 overflow-hidden">
          {/* Backdrop with elegant party night vibes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm gpu"
          />

          {/* Interactive Disco Glow Lights - Maximum Performance Optimization */}
          <div 
            className="absolute z-10 w-[300px] h-[300px] bg-primary-brown/10 blur-[60px] rounded-full pointer-events-none opacity-40 gpu animate-pulse"
          />

          {/* Popup Card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: "spring",
              damping: 30,
              stiffness: 400
            }}
            className="relative z-20 w-full max-w-[340px] bg-[#080808] rounded-[32px] overflow-hidden border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] gpu"
          >
            {/* Dynamic Disco Neon Ring */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary-brown via-purple-600 to-primary-brown bg-[length:200%_auto] animate-[shimmer_3s_infinite_linear]" />

            {/* Floating Confetti Layer */}
            <div className="absolute inset-0 pointer-events-none">
              {CONFETTI_PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    y: [0, p.y],
                    rotate: [0, p.rotate]
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute select-none font-sans"
                  style={{
                    left: p.left,
                    top: p.top,
                    fontSize: p.size,
                  }}
                >
                  {p.char}
                </motion.div>
              ))}
            </div>

            {/* Content Container */}
            <div className="p-8 pb-10 relative z-10 flex flex-col items-center text-center">
              
              <div className="mb-6 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
                <Sparkles className="h-3 w-3 text-primary-brown" />
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400">
                  Exclusive Squad Club
                </span>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary-brown/20 blur-xl rounded-full" />
                
                <div className="relative w-20 h-20 bg-[#121212] rounded-3xl flex items-center justify-center border border-white/5 shadow-inner">
                  <PartyPopper className="h-10 w-10 text-primary-brown relative z-10" />
                  
                  <span className="absolute -top-1 -right-1 bg-primary-brown text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Lounge
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-white mb-3 tracking-tight">
                Welcome to <br />
                <span className="italic text-primary-brown font-semibold">Coffee99 Arena! ⚡</span>
              </h2>

              <p className="text-[11px] sm:text-xs text-gray-400 font-light leading-relaxed max-w-[260px] mx-auto mb-8 font-sans">
                Experience Siliguri’s premier artisanal hub. From specialty brews to high-energy vibes, your squad's new home awaits!
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={handleClose}
                  className="w-full py-4 bg-primary-brown text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.25em] shadow-lg shadow-primary-brown/20 transition-all hover:bg-white hover:text-black active:scale-[0.98] cursor-pointer"
                >
                  Start the Vibes 🥳
                </button>

                <button
                  onClick={handleClose}
                  className="w-full py-2 text-[9px] font-bold text-gray-600 hover:text-gray-300 transition-colors uppercase tracking-[0.1em] cursor-pointer"
                >
                  Skip to Feed
                </button>
              </div>
            </div>
            
            {/* Corner Decorative */}
            <div className="absolute bottom-0 right-0 w-16 h-[1px] bg-gradient-to-l from-primary-brown/30 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
