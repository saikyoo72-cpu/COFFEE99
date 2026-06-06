import React from 'react';
import { motion } from 'motion/react';

export default function AnnouncementStrip() {
  const text = "NEW BRANCH OPEN NOW • PRADHAN NAGAR • NIVEDITA ROAD • VISIT TODAY • COFFEE99 IS GROWING • ";
  const repeatedText = Array(10).fill(text).join("");

  return (
    <div className="bg-black border-y border-white/5 py-3 overflow-hidden whitespace-nowrap relative z-40">
      <div className="flex items-center">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-4 items-center"
        >
          <span className="text-[10px] md:text-xs font-bold text-white/90 uppercase tracking-[0.3em] font-sans">
            {repeatedText}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
