import React from 'react';
import Link from 'next/link';
import { Home, Calendar, ArrowRight, Sparkles, HelpCircle, Compass } from 'lucide-react';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.contentWrapper}>
        <div className="badge">
          <Sparkles size={14} />
          <span>Page Not Found</span>
        </div>

        <div className={styles.errorCodeWrapper}>
          <span className={styles.errorCode}>404</span>
        </div>

        <h1 className={styles.title}>Radiance Lost in Transit</h1>

        <p className={styles.description}>
          The page or treatment you are looking for may have been moved, renamed, or is currently undergoing rejuvenation. Let us guide you back.
        </p>

        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
          <Link href="/book-appointment" className="btn btn-secondary">
            <Calendar size={18} />
            <span>Book Consultation</span>
          </Link>
        </div>

        {/* Quick Navigation Suggestions */}
        {/* <div className={styles.popularSection}>
          <h3 className={styles.popularTitle}>Looking for something specific?</h3>
          <div className={styles.linksGrid}>
            <Link href="/treatments" className={styles.suggestedLink}>
              <Compass size={15} color="var(--color-accent)" />
              <span>Explore All Treatments</span>
            </Link>
            <Link href="/about" className={styles.suggestedLink}>
              <Sparkles size={15} color="var(--color-accent)" />
              <span>About Dr. Aisha Sharma</span>
            </Link>
            <Link href="/testimonials" className={styles.suggestedLink}>
              <ArrowRight size={15} color="var(--color-accent)" />
              <span>Patient Testimonials</span>
            </Link>
            <Link href="/contact" className={styles.suggestedLink}>
              <HelpCircle size={15} color="var(--color-accent)" />
              <span>Clinic Location & Contact</span>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}
