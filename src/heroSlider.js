/**
 * Coffee99 Hero Slider Logic
 * This script handles the automatic 3-second transitions for the hero section.
 */

const slides = [
  { 
    title: "Handcrafted Care", 
    text: "Every detail matters when it comes to your perfect coffee experience.", 
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920" 
  },
  { 
    title: "Latte Art Perfection", 
    text: "Where every cup is a canvas of bold flavor and artistic precision.", 
    img: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&q=80&w=1920" 
  },
  { 
    title: "Cozy Retreat", 
    text: "Your favorite neighborhood spot for bold flavors and edgy vibes.", 
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1920" 
  },
  { 
    title: "Urban Soul", 
    text: "Experience the ultimate community hub for coffee enthusiasts.", 
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1920" 
  },
];

let currentSlide = 0;

export function initHeroSlider(onSlideChange) {
  const interval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    if (onSlideChange) {
      onSlideChange(currentSlide, slides[currentSlide]);
    }
  }, 10000); // Changed to 10 seconds as per request

  return () => clearInterval(interval);
}

export { slides };
