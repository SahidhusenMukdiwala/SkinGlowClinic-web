'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TREATMENT_CATEGORIES } from '@/lib/constants';
import TreatmentCard from '@/components/treatments/TreatmentCard';

export default function HomeServicesTabs({ treatments = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  const filteredTreatments = activeTab === 0
    ? treatments.slice(0, 6)
    : treatments.filter(t => t.category === activeTab);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
        {TREATMENT_CATEGORIES.map(category => {
          const isActive = activeTab === category.id;
          return (
            <button
              key={category.id}
              type="button"
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-accent shadow-sm'
                  : 'bg-white border border-clinic-border-subtle text-clinic-text hover:bg-clinic-bg-alt'
              }`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Grid of Treatment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredTreatments.length > 0 ? (
          filteredTreatments.map(treatment => (
            <TreatmentCard key={treatment.id || treatment.slug} treatment={treatment} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-clinic-muted">
            <p>No treatments found in this category.</p>
          </div>
        )}
      </div>

      {/* Explore All Link */}
      <div className="flex justify-center">
        <Link href="/treatments" className="btn btn-secondary">
          <span>Explore All 9+ Specialized Treatments</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
