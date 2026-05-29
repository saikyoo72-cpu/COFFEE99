import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu as MenuIcon, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Our Blogs', path: '/blogs' },
  { name: 'For Creators', path: '/creator-program' },
  { name: 'About Us', path: '/#about' },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [storeName, setStoreName] = useState<string | undefined>(undefined);
  const { user, signOut } = useAuth();

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch dynamic store name (defaulting to shivmandir for branding)
    const fetchStoreName = async (retries = 6) => {
      // Add a staggered initial delay to allow server to fully settle (1.5s for navbar)
      if (retries === 6) await new Promise(r => setTimeout(r, 1500));

      try {
        const url = `/api/settings/shivmandir?t=${Date.now()}`;
        console.log(`[Navbar] Fetching store name (Attempt: ${7 - retries})`);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('[Navbar] Settings received:', data.store_name);
        if (data.store_name) setStoreName(data.store_name);
      } catch (err) {
        console.error('[Navbar] Error fetching store name:', err);
        if (retries > 0) {
          const delay = 3500;
          setTimeout(() => fetchStoreName(retries - 1), delay);
        }
      }
    };
    fetchStoreName();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-black/80 backdrop-blur-xl py-3 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center group relative">
              <Logo storeName={storeName} className="h-10 md:h-12 w-auto transition-all duration-500 group-hover:scale-105" />
              {isScrolled && (
                <motion.div 
                  layoutId="logo-glow"
                  className="absolute -inset-2 bg-primary-brown/10 blur-xl rounded-full -z-10"
                />
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative text-white font-semibold text-[11px] uppercase tracking-[0.3em] group"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-primary-brown">
                    {link.name}
                  </span>
                  <motion.span 
                    className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary-brown transition-all duration-300 group-hover:w-full"
                  />
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-latte-beige rounded-full border border-white/5">
                    <User className="h-4 w-4 text-primary-brown" />
                    <span className="text-xs font-medium text-dark-roast truncate max-w-[100px]">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="p-2.5 bg-white/5 hover:bg-primary-brown/10 rounded-full border border-white/10 transition-all duration-300 text-red-500/80 hover:text-red-500"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => openAuth('login')}
                    className="text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:text-primary-brown transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth('signup')}
                    className="px-8 py-3 bg-primary-brown text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(208,0,0,0.3)] hover:shadow-white/20"
                  >
                    Join Squad
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="text-dark-roast p-2 hover:bg-latte-beige/20 rounded-xl transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-cream-bg border-t border-latte-beige/20 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium text-dark-roast hover:bg-latte-beige/10 rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-4 pb-2 border-t border-latte-beige/20">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-latte-beige flex items-center justify-center border border-white/5">
                          <User className="h-5 w-5 text-primary-brown" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-dark-roast">{user.email?.split('@')[0]}</p>
                          <p className="text-xs text-gray-500 font-light">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          openAuth('login');
                          setIsOpen(false);
                        }}
                        className="py-4 bg-latte-beige text-dark-roast rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary-brown hover:text-white transition-all"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          openAuth('signup');
                          setIsOpen(false);
                        }}
                        className="py-4 bg-primary-brown text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg shadow-primary-brown/20"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
      />
    </>
  );
}
