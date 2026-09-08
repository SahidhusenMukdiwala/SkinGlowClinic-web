'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './HomeFAQ.module.css';

const FAQ_ITEMS = [
  {
    question: 'How do I know which treatment is right for my unique skin concern?',
    answer: 'Every journey at SkinGlow begins with an in-depth dermatological consultation. Dr. Aisha Sharma evaluates your skin barrier, hydration levels, pore congestion, and pigmentation using clinical imaging before tailoring a personalized, safe treatment protocol.',
  },
  {
    question: 'What is the recovery time or downtime for laser and chemical peel treatments?',
    answer: 'Most of our signature therapies, such as HydraFacial Elite MD and Carbon Spectra Laser Toning, have zero downtime — you can immediately return to your normal routine with instant radiance. For deeper peels or resurfacing lasers, mild erythema (redness) or fine flaking resolves within 3 to 5 days.',
  },
  {
    question: 'Are treatments safe for sensitive skin and deeper Indian skin tones?',
    answer: 'Absolutely. We specialize in Fitzpatrick Skin Types III to VI. Our triple-wavelength lasers and medical peel formulations are clinically calibrated to eliminate risks of post-inflammatory hyperpigmentation while delivering superior aesthetic outcomes.',
  },
  {
    question: 'How many sessions will I need to see significant, lasting results?',
    answer: 'While immediate luminosity is visible after a single HydraFacial or Laser Toning session, structural improvements (such as acne scar remodeling, pigmentation fading, or hair follicle bio-restoration) typically involve a customized sequence of 3 to 6 sessions spaced 3 to 4 weeks apart.',
  },
  {
    question: 'Are anti-wrinkle injections and dermal fillers painful or unnatural looking?',
    answer: 'We believe in subtle, undetectable enhancement. Using topical anaesthetic creams, micro-fine German needles, and FDA-approved products, procedures are virtually painless. Our clinical philosophy prioritizes natural facial harmony — never an overfilled or frozen appearance.',
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className={styles.faqList}>
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
          >
            <button
              type="button"
              className={styles.questionBtn}
              onClick={() => toggleFAQ(index)}
              aria-expanded={isOpen}
            >
              <span className={styles.questionText}>{item.question}</span>
              <span className={styles.iconWrapper}>
                <ChevronDown size={20} className={styles.chevron} />
              </span>
            </button>

            {isOpen && (
              <div className={styles.answerWrapper}>
                <p className={styles.answerText}>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
