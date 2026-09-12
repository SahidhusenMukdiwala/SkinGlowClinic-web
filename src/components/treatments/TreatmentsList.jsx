'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { TREATMENT_CATEGORIES } from '@/lib/constants';
import { fetchTreatments } from '@/lib/api';
import TreatmentCard from './TreatmentCard';

export default function TreatmentsList({ initialTreatments = [], initialCategories = [] }) {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const categories = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return [{ id: 0, name: 'All Treatments' }, ...initialCategories];
    }
    return TREATMENT_CATEGORIES;
  }, [initialCategories]);

  // 1-second debounce for search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (initialTreatments && initialTreatments.length > 0 && activeCategory === 0 && !debouncedSearch) {
        setTreatments(initialTreatments);
        return;
      }
    }

    let isMounted = true;
    setLoading(true);

    fetchTreatments({
      category: activeCategory === 0 ? null : activeCategory,
      search: debouncedSearch.trim() || null,
    })
      .then((data) => {
        if (isMounted) {
          setTreatments(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch treatments', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, debouncedSearch]);

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
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text shadow-sm"
          />
          {loading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-xs text-clinic-muted">
              <Loader2 size={16} className="animate-spin text-accent" />
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 justify-center md:justify-end w-full">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
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
        {loading && treatments.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-clinic-muted bg-white rounded-2xl border border-clinic-border-subtle gap-3">
            <Loader2 size={24} className="animate-spin text-accent" />
            <p className="text-sm">Fetching clinical procedures from server...</p>
          </div>
        ) : treatments.length > 0 ? (
          treatments.map((treatment) => (
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
