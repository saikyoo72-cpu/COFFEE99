import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Star, 
  TrendingUp, 
  Award, 
  Crown, 
  Coffee, 
  DollarSign, 
  Users, 
  Instagram, 
  ArrowRight,
  CheckCircle2,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { Logo } from '../components/Logo';

const tiers = [
// ... existing tiers ...
  {
    id: 'starter',
    title: 'Starter Creators',
    icon: <Star className="w-8 h-8 text-[#ff3c3c]" />,
    requirements: {
      followers: 'Below 10K',
      reach: '500K+ Weekly'
    },
    benefits: [
      'Free meals & drinks',
      'Exclusive cafe experience',
      'Content creation access',
      'Tagging on official page'
    ],
    color: 'from-blue-500/20 to-transparent'
  },
  {
    id: 'growth',
    title: 'Growth Creators',
    icon: <TrendingUp className="w-8 h-8 text-[#ff3c3c]" />,
    requirements: {
      followers: 'Below 10K',
      reach: '1M+ Weekly'
    },
    benefits: [
      'Paid collaboration deals',
      'Negotiable payouts',
      'Priority branch access',
      'Brand merchandise'
    ],
    color: 'from-purple-500/20 to-transparent'
  },
  {
    id: 'rising',
    title: 'Rising Creators',
    icon: <Award className="w-8 h-8 text-[#ff3c3c]" />,
    requirements: {
      followers: '10K – 30K',
      reach: '1M+ Weekly'
    },
    benefits: [
      'Fixed paid promotions',
      'Featured on Coffee99 page',
      'Event invitations',
      'Content collaboration'
    ],
    color: 'from-orange-500/20 to-transparent'
  },
  {
    id: 'pro',
    title: 'Pro Creators',
    icon: <Crown className="w-8 h-8 text-[#ff3c3c]" />,
    requirements: {
      followers: '30K – 60K+',
      reach: 'High Engagement'
    },
    benefits: [
      'Premium collaborations',
      'Long-term partnerships',
      'Highest payout rates',
      'Brand Ambassador status'
    ],
    color: 'from-[#ff3c3c]/20 to-transparent'
  }
];

const benefits = [
  {
    title: 'Free Food & Access',
    description: 'Enjoy complimentary meals and drinks at any of our branches while you create.',
    icon: <Coffee className="w-6 h-6" />
  },
  {
    title: 'Paid Promotions',
    description: 'Get compensated for your creativity and reach with competitive rates.',
    icon: <DollarSign className="w-6 h-6" />
  },
  {
    title: 'Brand Exposure',
    description: 'Get featured on our official social media platforms and reach our audience.',
    icon: <Users className="w-6 h-6" />
  },
  {
    title: 'Long-term Deals',
    description: 'Opportunity for recurring partnerships and becoming a face of the brand.',
    icon: <Zap className="w-6 h-6" />
  }
];

export default function CreatorProgram() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-[#ff3c3c]/30 font-sans scroll-smooth overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0f0f0f]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo className="h-6 w-auto" />
            <span className="font-bold text-base tracking-tight group-hover:text-[#ff3c3c] transition-colors">
              Creators
            </span>
          </Link>
          
          <Link 
            to="/" 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-semibold transition-all duration-300 border border-white/5 active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </header>

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-[1.1]">
              Collaborate with <span className="text-[#ff3c3c]">Coffee99</span> ☕
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8">
              Turn your content into real rewards. Join our creator program and grow with us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a 
                href="#apply"
                className="px-8 py-3.5 bg-[#ff3c3c] text-white rounded-full font-bold text-base hover:bg-[#ff5555] transition-all shadow-lg shadow-[#ff3c3c]/20 flex items-center gap-2 group"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link 
                to="/blogs"
                className="px-8 py-3.5 bg-white/5 text-white rounded-full font-bold text-base hover:bg-white/10 transition-all border border-white/10"
              >
                View Creator Hub
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Tiers Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Creator Tiers</h2>
            <p className="text-gray-400 text-sm">Find where you fit and unlock exclusive perks.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`relative p-7 rounded-[28px] bg-gradient-to-b ${tier.color} border border-white/5 hover:border-[#ff3c3c]/30 transition-all group`}
              >
                <div className="mb-5 p-2.5 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{tier.title}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Followers</span>
                    <span className="text-base font-medium text-white">{tier.requirements.followers}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Weekly Reach</span>
                    <span className="text-base font-medium text-white">{tier.requirements.reach}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Benefits</p>
                  {tier.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff3c3c] shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white/5 py-20 mb-24">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Why Partner with Us?</h2>
              <p className="text-gray-400 text-sm">We value creativity and authentic storytelling.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 bg-[#ff3c3c]/10 rounded-xl flex items-center justify-center mx-auto mb-5 text-[#ff3c3c]">
                    {benefit.icon}
                  </div>
                  <h4 className="text-lg font-bold mb-2">{benefit.title}</h4>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Apply Section */}
        <section id="apply" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">How to Apply</h2>
            <p className="text-gray-400 text-sm">Three simple steps to start your journey.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { step: '01', title: 'Create', desc: 'Create high-quality content about Coffee99' },
              { step: '02', title: 'Share', desc: 'Share your reach and profile analytics' },
              { step: '03', title: 'Contact', desc: 'Reach out via Instagram or our form' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-7 rounded-2xl bg-[#1a1a1a] border border-white/5"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#ff3c3c] rounded-full text-[10px] font-bold tracking-widest">
                  STEP {item.step}
                </span>
                <h5 className="text-lg font-bold mb-1.5 mt-1.5">{item.title}</h5>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <a 
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] text-white rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl"
            >
              <Instagram className="w-5 h-5" />
              Apply via Instagram
            </a>
            <p className="text-gray-500 text-xs italic">
              All collaborations are reviewed based on content quality and engagement.
            </p>
          </motion.div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center">
        <Logo className="h-6 w-auto mx-auto mb-4 opacity-50" />
        <p className="text-gray-600 text-xs uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Coffee99 Creator Program. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
