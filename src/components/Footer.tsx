import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Coffee, Instagram, Facebook, MapPin } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async (retries = 6) => {
      // Add a staggered initial delay to allow server to fully settle (2s for footer)
      if (retries === 6) await new Promise(r => setTimeout(r, 2000));

      try {
        const url = `/api/settings/shivmandir?t=${Date.now()}`;
        console.log(`[Footer] Fetching settings (Attempt: ${7 - retries})`);
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('[Footer] Settings received:', data.store_name);
        setSettings(data);
      } catch (err) {
        console.error('[Footer] Error fetching footer settings:', err);
        if (retries > 0) {
          const delay = 4000;
          setTimeout(() => fetchSettings(retries - 1), delay);
        }
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#050505] text-white pt-32 pb-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand */}
          <div className="space-y-8">
            <Logo storeName={settings?.store_name} className="h-12 w-auto" />
            <p className="text-gray-500 font-light leading-relaxed text-sm">
              {settings?.store_description || "Coffee99 is more than just a cafe; it's a culture of bold flavors and edgy vibes. Born in Siliguri, dedicated to the worldwide coffee squad."}
            </p>
            <div className="flex space-x-6">
              {[
                { icon: Instagram, href: "https://www.instagram.com/coffee99shivmandir/" },
                { icon: Facebook, href: "https://www.facebook.com/shivmandircoffee99/" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-brown hover:text-white hover:scale-110 transition-all duration-500"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-primary-brown uppercase tracking-[0.4em]">The Menu</h4>
            <ul className="space-y-5">
              <li><Link to="/blogs" className="text-gray-400 font-light text-sm hover:text-primary-brown transition-colors">Stories & Reels</Link></li>
              <li><Link to="/creator-program" className="text-gray-400 font-light text-sm hover:text-primary-brown transition-colors">Join Creators</Link></li>
              <li><Link to="/#locations" className="text-gray-400 font-light text-sm hover:text-primary-brown transition-colors">Our Hubs</Link></li>
            </ul>
          </div>

          {/* Hubs */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-primary-brown uppercase tracking-[0.4em]">Official Hub</h4>
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-gray-600 mt-1" />
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                Shivmandir, Siliguri<br/>
                West Bengal, India
              </p>
            </div>
          </div>

          {/* Credits */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black text-primary-brown uppercase tracking-[0.4em]">Architects</h4>
            <p className="text-gray-500 font-light text-sm italic">
              Crafted with passion <br/> 
              <span className="text-white font-black uppercase tracking-widest text-[11px] not-italic">By saikyoo</span>
            </p>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] font-medium uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} {settings?.store_name || "Coffee99"} Group. No Limits.
          </p>
          <div className="flex gap-8 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-600">
            <span className="hover:text-primary-brown cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-primary-brown cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
