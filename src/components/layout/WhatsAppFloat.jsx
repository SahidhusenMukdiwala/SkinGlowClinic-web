import React from 'react';
import styles from './WhatsAppFloat.module.css';

export default function WhatsAppFloat() {
  const whatsappNumber = '919876543210';
  const defaultMessage = encodeURIComponent('Hello SkinGlow Clinic, I would like to inquire about your treatments.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className={styles.whatsappWrapper}>
      <span className={styles.tooltip}>Chat with Clinic</span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
        aria-label="Chat with SkinGlow Clinic on WhatsApp"
      >
        <span className={styles.pulseRing}></span>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </div>
  );
}
