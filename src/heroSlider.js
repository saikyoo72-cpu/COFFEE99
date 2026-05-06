/**
 * Coffee99 Hero Slider Logic
 * This script handles the automatic 3-second transitions for the hero section.
 */

const slides = [
  { 
    title: "Handcrafted Care", 
    text: "Every detail matters when it comes to your perfect coffee experience.", 
    img: "https://i.ibb.co/x9dBcWN/unnamed.jpg" 
  },
  { 
    title: "Cozy Retreat", 
    text: "Your favorite neighborhood spot for bold flavors and edgy vibes.", 
    img: "https://i.ibb.co/4wthMNQg/unnamed.jpg" 
  },
  { 
    title: "Our Bestsellers", 
    text: "Experience the most-loved flavors from Burger to Cold Coffee. Starting at ₹49.", 
    img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=1920",
    type: "bestsellers"
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
