import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Coffee, Instagram, Facebook, MapPin } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings/shivmandir')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error fetching footer settings:', err));
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
