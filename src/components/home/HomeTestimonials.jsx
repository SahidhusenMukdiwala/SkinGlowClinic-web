'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Star, CheckCircle2, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HomeTestimonials.module.css';

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

  // Ensure currentIndex stays within bounds if visibleCards changes
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

  // Touch handlers for mobile swipe
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
      className={styles.sliderContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Patient Testimonials Slider"
    >
      <div className={styles.sliderControlsTop}>
        <div className={styles.statusIndicator}>
          <span className={`${styles.livePulse} ${isPaused ? styles.pausedPulse : ''}`} />
          <span>{isPaused ? 'Paused on Hover' : 'Auto-Sliding Reviews'}</span>
        </div>
        <div className={styles.navButtons}>
          <button
            onClick={prevSlide}
            className={styles.navButton}
            aria-label="Previous review"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className={styles.navButton}
            aria-label="Next review"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.sliderViewport}>
        <div
          className={styles.sliderTrack}
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
          }}
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={styles.slideItem}
              style={{ flex: `0 0 ${100 / visibleCards}%` }}
            >
              <article className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.stars}>
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="#C9A96E" color="#C9A96E" />
                    ))}
                  </div>
                  <Quote size={28} className={styles.quoteIcon} />
                </div>

                <p className={styles.quoteText}>
                  &ldquo;{item.review_text}&rdquo;
                </p>

                <div className={styles.patientInfo}>
                  <Image
                    src={item.patient_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                    alt={item.patient_name}
                    width={52}
                    height={52}
                    className={styles.avatar}
                  />
                  <div>
                    <h4 className={styles.patientName}>{item.patient_name}</h4>
                    <div className={styles.verifiedBadge}>
                      <CheckCircle2 size={13} color="#10B981" />
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
      <div className={styles.dotsContainer}>
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to review slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
