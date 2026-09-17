'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Loader2, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import { TREATMENT_CATEGORIES } from '@/lib/constants';
import { fetchTreatments } from '@/lib/api';
import TreatmentCard from './TreatmentCard';

export default function TreatmentsList({ initialTreatments = [], initialCategories = [] }) {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const categories = useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return [{ id: 0, name: 'All Treatments' }, ...initialCategories];
    }
    return TREATMENT_CATEGORIES;
  }, [initialCategories]);

  const activeCategoryObj = useMemo(() => {
    return categories.find((cat) => cat.id === activeCategory);
  }, [categories, activeCategory]);

  // Click outside and Escape key listeners to close filter dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
  }, [activeCategory, debouncedSearch, initialTreatments]);

  return (
    <div>
      {/* Controls: Search & Category Filter Dropdown */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Search input */}
        <div className="relative w-full sm:w-80 md:w-96 shrink-0">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clinic-muted" />
          <input
            type="text"
            placeholder="Search treatments (Laser, Peel, Hydra)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text shadow-sm transition-all"
          />
          {loading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-xs text-clinic-muted">
              <Loader2 size={16} className="animate-spin text-accent" />
            </div>
          )}
        </div>

        {/* Category Filter Option */}
        <div className="relative w-full sm:w-auto shrink-0 flex items-center gap-2 justify-end" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all cursor-pointer shadow-sm ${
              activeCategory !== 0
                ? 'bg-primary text-accent border-primary ring-2 ring-accent/20'
                : 'bg-white border-clinic-border-subtle text-clinic-text hover:bg-clinic-bg-alt hover:border-accent/40'
            }`}
            aria-expanded={isFilterOpen}
            aria-haspopup="true"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className={activeCategory !== 0 ? 'text-accent' : 'text-clinic-muted'} />
              <span>
                {activeCategory === 0 ? 'Filter by Category' : activeCategoryObj?.name || 'Category'}
              </span>
            </div>
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''} ${
                activeCategory !== 0 ? 'text-accent' : 'text-clinic-muted'
              }`}
            />
          </button>

          {/* Quick Clear Filter Icon Button */}
          {activeCategory !== 0 && (
            <button
              type="button"
              onClick={() => setActiveCategory(0)}
              title="Clear category filter"
              className="w-8 h-8 rounded-full bg-white border border-clinic-border-subtle text-clinic-muted hover:text-primary hover:border-accent/40 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <X size={14} />
            </button>
          )}

          {/* Category Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-72 bg-white rounded-2xl border border-clinic-border-subtle shadow-xl py-2 z-30">
              <div className="px-4 py-2 text-xs font-semibold text-clinic-muted uppercase tracking-wider border-b border-clinic-border-subtle flex items-center justify-between">
                <span>Categories</span>
                {activeCategory !== 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory(0);
                      setIsFilterOpen(false);
                    }}
                    className="text-xs text-accent hover:underline font-normal cursor-pointer"
                  >
                    Reset to All
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary/5 text-primary font-bold'
                          : 'text-slate-700 hover:bg-clinic-bg hover:text-primary'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <Check size={16} className="text-accent shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Indicator Badge */}
      {activeCategory !== 0 && (
        <div className="flex items-center gap-2 mb-6 text-xs text-clinic-muted">
          <span>Active Filter:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-accent text-xs font-medium shadow-sm">
            {activeCategoryObj?.name}
            <button
              type="button"
              onClick={() => setActiveCategory(0)}
              className="hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Remove filter"
            >
              <X size={12} />
            </button>
          </span>
        </div>
      )}

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
