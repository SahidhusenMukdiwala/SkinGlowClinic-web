'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomeTestimonials({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCards, setVisibleCards] = useState(2);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive card count detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else {
        setVisibleCards(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = testimonials.length;
  const maxIndex = Math.max(0, total - visibleCards);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide effect (advances every 4.5 seconds)
  useEffect(() => {
    if (isPaused || total <= visibleCards) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, total, visibleCards, nextSlide]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div
      className="relative max-w-5xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Patient Testimonials Slider"
    >
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-clinic-muted">
          <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
          <span>{isPaused ? 'Paused on Hover' : 'Auto-Sliding Reviews'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-9 h-9 rounded-full bg-white border border-clinic-border-subtle hover:border-accent flex items-center justify-center text-primary hover:text-accent shadow-sm transition-all"
            aria-label="Previous review"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="w-9 h-9 rounded-full bg-white border border-clinic-border-subtle hover:border-accent flex items-center justify-center text-primary hover:text-accent shadow-sm transition-all"
            aria-label="Next review"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden py-2">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
          }}
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="px-3 shrink-0"
              style={{ flex: `0 0 ${100 / visibleCards}%` }}
            >
              <article className="bg-white p-7 rounded-2xl border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="#C9A96E" color="#C9A96E" />
                    ))}
                  </div>
                  <Quote size={24} className="text-accent/40" />
                </div>

                <p className="text-clinic-text text-sm sm:text-base leading-relaxed italic mb-6">
                  &ldquo;{item.review_text}&rdquo;
                </p>

                <div className="flex items-center gap-3.5 pt-4 border-t border-clinic-border-subtle mt-auto">
                  <Image
                    src={item.patient_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                    alt={item.patient_name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent/30"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-primary text-base">{item.patient_name}</h4>
                    <div className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 size={12} />
                      <span>Verified Patient</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-6 bg-accent' : 'w-2.5 bg-gray-300 hover:bg-accent/60'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to review slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
