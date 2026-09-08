import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroGrid}`}>
        {/* Left Column: Headline & Overview */}
        <div className={styles.heroContent}>
          <div className="badge">
            <Sparkles size={14} />
            <span>Physician-Led Skincare</span>
          </div>

          <h1 className={styles.heroTitle}>
            Reveal Your Skin’s <br />
            <span className={styles.goldHighlight}>Radiant Perfection</span>
          </h1>

          <p className={styles.heroDescription}>
            Welcome to SkinGlow Clinic. We unite advanced medical dermatology with bespoke aesthetic artistry to deliver natural, transformative results tailored precisely to you.
          </p>

          <div className={styles.heroActions}>
            <Link href="/book-appointment" className="btn btn-primary">
              <Calendar size={18} />
              <span>Book Consultation</span>
            </Link>
            <Link href="/treatments" className="btn btn-secondary">
              <span>Explore Treatments</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Stats Summary */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10k+</span>
              <span className={styles.statLabel}>Happy Patients</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>15+</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>99.4%</span>
              <span className={styles.statLabel}>Satisfaction Rate</span>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Feature Preview */}
        <div className={styles.cardPreview}>
          <div className={styles.floatingCard}>
            <div className={styles.floatingCardHeader}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>The SkinGlow Standard</h3>
                <p style={{ fontSize: '0.85rem' }}>Dermatology excellence guaranteed</p>
              </div>
              <span className={`badge ${styles.badgeSuccess}`}>
                <CheckCircle2 size={13} />
                <span>Certified</span>
              </span>
            </div>

            <div className={styles.previewList}>
              <div className={styles.previewItem}>
                <div className={styles.previewItemIcon}>
                  <ShieldCheck size={20} />
                </div>
                <div className={styles.previewItemContent}>
                  <h4>FDA-Approved Laser Technology</h4>
                  <p>Clinically backed, non-invasive treatments with zero downtime.</p>
                </div>
              </div>

              <div className={styles.previewItem}>
                <div className={styles.previewItemIcon}>
                  <Sparkles size={20} />
                </div>
                <div className={styles.previewItemContent}>
                  <h4>Bespoke Treatment Plans</h4>
                  <p>Personalized protocols tailored to your unique skin profile.</p>
                </div>
              </div>

              <div className={styles.previewItem}>
                <div className={styles.previewItemIcon}>
                  <HeartHandshake size={20} />
                </div>
                <div className={styles.previewItemContent}>
                  <h4>Physician-Led Care</h4>
                  <p>Under the direct supervision of Board-Certified dermatologists.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
