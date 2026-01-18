import { useState, useEffect, useMemo } from 'react';

const REVIEWS_KEY = 'summercamp_reviews';

export function useReviews() {
  const [reviews, setReviews] = useState([]);

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) {
        setReviews(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  }, [reviews]);

  const addReview = (campName, review) => {
    const newReview = {
      id: Date.now().toString(),
      campName,
      ...review,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [...prev, newReview]);
    return newReview;
  };

  const getCampReviews = (campName) => {
    return reviews.filter(r => r.campName === campName);
  };

  const getCampRating = (campName) => {
    const campReviews = getCampReviews(campName);
    if (campReviews.length === 0) return null;
    
    const sum = campReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / campReviews.length) * 10) / 10; // Round to 1 decimal
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  return {
    reviews,
    addReview,
    getCampReviews,
    getCampRating,
    deleteReview,
  };
}
