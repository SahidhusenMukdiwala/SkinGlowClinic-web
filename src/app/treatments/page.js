import React from 'react';
import { Sparkles } from 'lucide-react';
import { fetchTreatments } from '@/lib/api';
import TreatmentsList from '@/components/treatments/TreatmentsList';
import styles from './treatments.module.css';

export const metadata = {
  title: 'Specialized Treatments | SkinGlow Clinic Mumbai',
  description: 'Explore our complete spectrum of clinical dermatology, laser hair reduction, anti-aging aesthetics, and hair restoration therapies in Mumbai.',
};

export const revalidate = 60;

export default async function TreatmentsPage() {
  const treatments = await fetchTreatments();

  return (
    <div className={styles.treatmentsPage}>
      {/* Header Banner */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className="badge" style={{ margin: '0 auto' }}>
            <Sparkles size={14} />
            <span>Physician-Led Services</span>
          </div>
          <h1 className={styles.pageTitle}>Clinical Treatments & Procedures</h1>
          <p className={styles.pageSubtitle}>
            Every treatment at SkinGlow Clinic is backed by dermatological science, cutting-edge medical technology, and personalized clinical care.
          </p>
        </div>
      </div>

      {/* Main Listing Section */}
      <section className={styles.treatmentsSection}>
        <div className="container">
          <TreatmentsList initialTreatments={treatments} />
        </div>
      </section>
    </div>
  );
}
