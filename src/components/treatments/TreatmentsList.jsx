'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { TREATMENT_CATEGORIES } from '@/lib/constants';
import TreatmentCard from './TreatmentCard';
import styles from '@/app/treatments/treatments.module.css';

export default function TreatmentsList({ initialTreatments = [] }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTreatments = useMemo(() => {
    return initialTreatments.filter(t => {
      const matchesCategory = activeCategory === 0 || t.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.short_description && t.short_description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [initialTreatments, activeCategory, searchQuery]);

  return (
    <>
      <div className={styles.filterBar}>
        {/* Search input */}
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search treatments by keyword (e.g. Laser, Peel, Botox)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Category Filter Pills */}
        <div className={styles.tabsContainer}>
          {TREATMENT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.tabBtn} ${activeCategory === cat.id ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filteredTreatments.length > 0 ? (
          filteredTreatments.map(treatment => (
            <TreatmentCard key={treatment.id || treatment.slug} treatment={treatment} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <h3>No matching treatments found</h3>
            <p>Try refining your search keyword or clearing the category filter.</p>
          </div>
        )}
      </div>
    </>
  );
}
