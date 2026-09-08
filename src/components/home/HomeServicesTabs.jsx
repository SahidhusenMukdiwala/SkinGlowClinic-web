'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TREATMENT_CATEGORIES } from '@/lib/constants';
import TreatmentCard from '@/components/treatments/TreatmentCard';
import styles from './HomeServicesTabs.module.css';

export default function HomeServicesTabs({ treatments = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  const filteredTreatments = activeTab === 0
    ? treatments.slice(0, 6)
    : treatments.filter(t => t.category === activeTab);

  return (
    <div className={styles.wrapper}>
      {/* Category Tabs */}
      <div className={styles.tabsContainer}>
        {TREATMENT_CATEGORIES.map(category => (
          <button
            key={category.id}
            type="button"
            className={`${styles.tabBtn} ${activeTab === category.id ? styles.active : ''}`}
            onClick={() => setActiveTab(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid of Treatment Cards */}
      <div className={styles.grid}>
        {filteredTreatments.length > 0 ? (
          filteredTreatments.map(treatment => (
            <TreatmentCard key={treatment.id || treatment.slug} treatment={treatment} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No treatments found in this category.</p>
          </div>
        )}
      </div>

      {/* Explore All Link */}
      <div className={styles.actionRow}>
        <Link href="/treatments" className="btn btn-secondary">
          <span>Explore All 9+ Specialized Treatments</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
