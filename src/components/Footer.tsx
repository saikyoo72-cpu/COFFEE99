import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Coffee, Instagram, Facebook, MapPin } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async (retries = 5) => {
      try {
        // Use absolute path from origin for better robustness
        const url = `${window.location.origin}/api/settings/shivmandir`;
        console.log(`[Footer] Fetching settings from: ${url} (Retries left: ${retries})`);
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
        }
        const data = await res.json();
        console.log('[Footer] Settings received:', data);
        setSettings(data);
      } catch (err) {
        console.error('[Footer] Error fetching footer settings:', err);
        if (retries > 0) {
          const delay = 2000 + (5 - retries) * 1000; // Exponential-ish backoff
          console.log(`[Footer] Retrying fetch footer settings in ${delay}ms... (${retries} retries left)`);
          setTimeout(() => fetchSettings(retries - 1), delay);
        }
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Logo storeName={settings?.store_name} className="h-10 w-auto" />
            </div>
            <p className="text-gray-400 font-light leading-relaxed">
              {settings?.store_address || "Your neighborhood cafe serving handcrafted coffee and fresh bites since 2015. Experience the perfect blend of comfort and quality."}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/coffee99shivmandir/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-latte-beige hover:bg-primary-brown hover:text-white rounded-lg transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/shivmandircoffee99/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-latte-beige hover:bg-primary-brown hover:text-white rounded-lg transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-serif font-bold text-primary-brown">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/blogs" className="text-gray-400 font-light hover:text-primary-brown transition-colors">Our Blogs</Link></li>
              <li><Link to="/#locations" className="text-gray-400 font-light hover:text-primary-brown transition-colors">Locations</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <ul className="space-y-4 text-gray-400 font-light">
              <li className="flex items-center gap-2 pt-2">
                <span className="font-black text-white text-lg uppercase tracking-wider">Designed by The Aspirion</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center text-gray-500 text-sm font-light">
          <p>&copy; {new Date().getFullYear()} {settings?.store_name || "Coffee99"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
