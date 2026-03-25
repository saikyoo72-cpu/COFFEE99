import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Send } from 'lucide-react';

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: "hello@coffee99.com",
      subtext: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: "08927707769",
      subtext: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Main Branch",
      details: "123 Coffee Lane, Brew City, BC 12345",
      subtext: "Visit our flagship store"
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="h-6 w-6" />, name: "Instagram", url: "#" },
    { icon: <Facebook className="h-6 w-6" />, name: "Facebook", url: "#" },
    { icon: <Twitter className="h-6 w-6" />, name: "Twitter", url: "#" }
  ];

  return (
    <div className="pt-24 pb-20 bg-cream-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-brown font-bold text-sm uppercase tracking-[0.3em] mb-4 block"
          >
            Get In Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-dark-roast mb-6"
          >
            We'd Love to <span className="italic text-primary-brown">Hear From You</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg font-light"
          >
            Have a question about our coffee, want to host an event, or just want to say hi? Drop us a message below.
          </motion.p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20"
        >
          {contactInfo.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6 }}
              className="bg-white p-10 rounded-[40px] shadow-xl shadow-primary-brown/5 text-center group hover:bg-primary-brown transition-all duration-500"
            >
              <div className="w-16 h-16 bg-latte-beige rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-brown group-hover:bg-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-dark-roast mb-2 group-hover:text-white transition-colors">{item.title}</h3>
              <p className="text-primary-brown font-bold mb-1 group-hover:text-white transition-colors">{item.details}</p>
              <p className="text-gray-400 text-sm font-light group-hover:text-white/70 transition-colors">{item.subtext}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-primary-brown/10"
          >
            <h2 className="text-3xl font-serif text-dark-roast mb-8">Send us a <span className="italic text-primary-brown">Message</span></h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full px-6 py-4 bg-cream-bg border-none rounded-2xl focus:ring-2 focus:ring-primary-brown transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="Your Email"
                    className="w-full px-6 py-4 bg-cream-bg border-none rounded-2xl focus:ring-2 focus:ring-primary-brown transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help?"
                  className="w-full px-6 py-4 bg-cream-bg border-none rounded-2xl focus:ring-2 focus:ring-primary-brown transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Message</label>
                <textarea 
                  rows={5}
                  placeholder="Tell us more..."
                  className="w-full px-6 py-4 bg-cream-bg border-none rounded-2xl focus:ring-2 focus:ring-primary-brown transition-all outline-none resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-primary-brown text-white rounded-2xl font-bold uppercase tracking-[0.2em] hover:bg-dark-roast transition-all shadow-xl shadow-primary-brown/30 flex items-center justify-center gap-3"
              >
                Send Message <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>

          {/* Social & Map */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-serif text-dark-roast mb-8">Follow our <span className="italic text-primary-brown">Journey</span></h2>
              <div className="flex gap-6">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-brown shadow-lg hover:bg-primary-brown hover:text-white transition-all duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-80 bg-white p-4 rounded-[40px] shadow-2xl shadow-primary-brown/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.01923456789!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus"
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '24px' }} 
                allowFullScreen 
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
