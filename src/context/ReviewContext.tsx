import React, { createContext, useContext, useState, useEffect } from 'react';
import { testimonials as initialTestimonials } from '../data';

interface Review {
  name: string;
  text: string;
  rating: number;
  branchId?: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Review) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('coffee99_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved reviews:', e);
      }
    }
    return initialTestimonials;
  });

  useEffect(() => {
    localStorage.setItem('coffee99_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (review: Review) => {
    setReviews(prev => [...prev, review]);
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}
