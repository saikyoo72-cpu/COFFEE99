import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Play, MapPin, MessageSquare } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'reels', label: 'Reels', icon: Play, path: '/blogs' },
    { id: 'branches', label: 'Branches', icon: MapPin, path: '/#locations' },
    { id: 'contact', label: 'Contact', icon: MessageSquare, path: '/#reviews' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.substring(1);
    }
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-[100] pointer-events-none">
      <motion.nav 
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
        className="bg-black/95 backdrop-blur-xl border-t border-white/10 h-15 px-3 flex items-center justify-between pointer-events-auto relative shadow-[0_-8px_30px_rgba(0,0,0,0.9)] gpu"
      >
        {/* Top Edge Glow - Clean & Subtle */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-brown/50 to-transparent" />
        
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link 
              key={item.id} 
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full pt-0.5"
            >
              <div className="relative group p-1">
                <motion.div
                  animate={{ 
                    scale: active ? 1.1 : 1,
                    y: active ? -1 : 0
                  }}
                  className={`relative z-10 transition-colors duration-300 ${active ? 'text-primary-brown' : 'text-gray-400'}`}
                >
                  <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </motion.div>

                {active && (
                  <motion.div 
                    layoutId="active-nav-glow"
                    className="absolute inset-0 bg-primary-brown/15 blur-lg rounded-full -z-0"
                  />
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest mt-1 transition-colors duration-300 ${active ? 'text-white' : 'text-gray-500'}`}>
                {item.label}
              </span>
              
              {active && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute bottom-0.5 w-1 h-1 bg-primary-brown rounded-full shadow-[0_0_8px_rgba(178,34,34,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default BottomNav;
