'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { TREATMENT_CATEGORIES } from '@/lib/constants';
import TreatmentCard from './TreatmentCard';

export default function TreatmentsList({ initialTreatments = [], initialCategories = [] }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return [{ id: 0, name: 'All Treatments' }, ...initialCategories];
    }
    return TREATMENT_CATEGORIES;
  }, [initialCategories]);

  const filteredTreatments = useMemo(() => {
    return initialTreatments.filter((t) => {
      const catId = t.category_id || t.category?.id || t.category;
      const matchesCategory = activeCategory === 0 || catId === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.short_description && t.short_description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [initialTreatments, activeCategory, searchQuery]);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        {/* Search input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clinic-muted" />
          <input
            type="text"
            placeholder="Search treatments (Laser, Peel, Hydra)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 justify-center md:justify-end w-full">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-accent shadow-sm'
                    : 'bg-white border border-clinic-border-subtle text-clinic-text hover:bg-clinic-bg-alt'
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreatments.length > 0 ? (
          filteredTreatments.map(treatment => (
            <TreatmentCard key={treatment.id || treatment.slug} treatment={treatment} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-clinic-muted bg-white rounded-2xl border border-clinic-border-subtle">
            <h3 className="font-heading text-lg font-bold text-primary mb-1">No matching treatments found</h3>
            <p className="text-sm">Try refining your search keyword or clearing the category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
