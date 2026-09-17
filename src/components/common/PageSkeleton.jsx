import React from 'react';

/**
 * Basic pulsing block primitive
 */
export function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Multi-line text placeholder
 */
export function SkeletonText({ lines = 3, className = '' }) {
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-2/3'];
  return (
    <div className={`space-y-2.5 animate-pulse ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3.5 bg-slate-200/70 rounded ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

/**
 * Single card placeholder (for treatments, blogs, testimonials)
 */
export function SkeletonCard({ hasImage = true, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-clinic-border-subtle bg-white p-5 shadow-sm overflow-hidden animate-pulse flex flex-col ${className}`}
      aria-hidden="true"
    >
      {hasImage && (
        <div className="w-full h-48 bg-slate-200/80 rounded-xl mb-4" />
      )}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-20 bg-accent/15 rounded-full" />
        <div className="h-4 w-16 bg-slate-200/60 rounded" />
      </div>
      <div className="h-6 w-3/4 bg-slate-200/80 rounded mb-2.5" />
      <div className="space-y-2 mb-4 flex-1">
        <div className="h-3.5 bg-slate-200/60 rounded w-full" />
        <div className="h-3.5 bg-slate-200/60 rounded w-5/6" />
      </div>
      <div className="pt-4 border-t border-clinic-border-subtle/80 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200/60 rounded" />
        <div className="h-4 w-16 bg-accent/20 rounded" />
      </div>
    </div>
  );
}

/**
 * Page Header Banner Skeleton (matches standard clinic banner)
 */
export function SkeletonHeader({
  hasBadge = true,
  hasSubtitle = true,
  className = '',
}) {
  return (
    <header
      className={`py-14 sm:py-16 text-center bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle mb-10 sm:mb-12 animate-pulse ${className}`}
      aria-hidden="true"
    >
      <div className="container max-w-4xl mx-auto px-4 flex flex-col items-center">
        {hasBadge && (
          <div className="h-6 w-32 bg-accent/20 rounded-full mb-3.5" />
        )}
        <div className="h-9 sm:h-12 w-3/4 sm:w-2/3 bg-slate-200/80 rounded-lg mb-4" />
        {hasSubtitle && (
          <div className="space-y-2 w-full max-w-xl flex flex-col items-center">
            <div className="h-4 w-full bg-slate-200/60 rounded" />
            <div className="h-4 w-4/5 bg-slate-200/60 rounded" />
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Grid layout helper
 */
export function SkeletonGrid({
  count = 6,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  className = '',
}) {
  return (
    <div className={`grid ${columns} gap-6 sm:gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

/**
 * Comprehensive PageSkeleton component supporting multiple page layout variants
 */
export default function PageSkeleton({
  layout = 'default',
  count = 6,
  showHeader = true,
}) {
  return (
    <div className="min-h-screen bg-clinic-bg pb-20">
      {showHeader && <SkeletonHeader />}

      <main className="container mx-auto px-4">
        {/* Grid layout: Treatments, Blogs, Testimonials */}
        {layout === 'grid' && (
          <div className="space-y-8">
            {/* Search & Filter bar placeholder */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
              <div className="h-10 w-full sm:w-80 md:w-96 rounded-full bg-slate-200/70 animate-pulse" />
              <div className="h-10 w-full sm:w-44 rounded-full bg-slate-200/70 animate-pulse" />
            </div>
            <SkeletonGrid count={count} />
          </div>
        )}

        {/* Detail page layout: Treatments/[slug], Blogs/[slug] */}
        {layout === 'detail' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
            <div className="lg:col-span-8 space-y-6 animate-pulse">
              <div className="w-full h-80 sm:h-96 bg-slate-200/80 rounded-2xl" />
              <div className="h-8 bg-slate-200/80 rounded w-3/4" />
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-slate-200/60 rounded w-full" />
                <div className="h-4 bg-slate-200/60 rounded w-full" />
                <div className="h-4 bg-slate-200/60 rounded w-5/6" />
                <div className="h-4 bg-slate-200/60 rounded w-4/6" />
              </div>
              <div className="h-48 bg-slate-200/50 rounded-xl mt-6" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-clinic-border-subtle bg-white p-6 shadow-sm animate-pulse space-y-4">
                <div className="h-6 bg-slate-200/80 rounded w-1/2" />
                <div className="h-10 bg-accent/20 rounded-xl" />
                <div className="h-10 bg-slate-200/60 rounded-xl" />
                <div className="space-y-2 pt-3">
                  <div className="h-3.5 bg-slate-200/60 rounded w-full" />
                  <div className="h-3.5 bg-slate-200/60 rounded w-4/5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking layout: Book Appointment */}
        {layout === 'booking' && (
          <div className="max-w-4xl mx-auto">
            {/* Stepper indicator placeholder */}
            <div className="flex items-center justify-between mb-8 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20" />
                  <div className="hidden sm:block h-3.5 w-20 bg-slate-200/70 rounded" />
                </div>
              ))}
            </div>

            {/* Main wizard card placeholder */}
            <div className="rounded-2xl border border-clinic-border-subtle bg-white p-6 sm:p-10 shadow-sm animate-pulse space-y-6">
              <div className="h-7 w-1/3 bg-slate-200/80 rounded" />
              <div className="h-4 w-2/3 bg-slate-200/60 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-xl border border-slate-200/80 bg-slate-100/60 p-4 space-y-2">
                    <div className="h-4 w-1/2 bg-slate-200 rounded" />
                    <div className="h-3.5 w-3/4 bg-slate-200/70 rounded" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-6 border-t border-slate-100">
                <div className="h-10 w-24 bg-slate-200/70 rounded-lg" />
                <div className="h-10 w-32 bg-accent/30 rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {/* Contact page layout */}
        {layout === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto animate-pulse">
            <div className="lg:col-span-7 rounded-2xl border border-clinic-border-subtle bg-white p-8 space-y-5">
              <div className="h-6 w-1/3 bg-slate-200/80 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-11 bg-slate-200/60 rounded-lg" />
                <div className="h-11 bg-slate-200/60 rounded-lg" />
              </div>
              <div className="h-11 bg-slate-200/60 rounded-lg" />
              <div className="h-28 bg-slate-200/60 rounded-lg" />
              <div className="h-11 w-40 bg-accent/30 rounded-lg" />
            </div>
            <div className="lg:col-span-5 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-clinic-border-subtle bg-white p-5 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/15 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/3 bg-slate-200/80 rounded" />
                    <div className="h-3.5 w-3/4 bg-slate-200/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About page layout */}
        {layout === 'about' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-80 sm:h-96 rounded-2xl bg-slate-200/80" />
              <div className="space-y-4">
                <div className="h-5 w-24 bg-accent/20 rounded-full" />
                <div className="h-8 w-4/5 bg-slate-200/80 rounded" />
                <SkeletonText lines={4} />
                <div className="pt-2">
                  <div className="h-10 w-36 bg-accent/30 rounded-lg" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-clinic-border-subtle bg-white text-center space-y-2"
                >
                  <div className="h-7 w-12 bg-accent/25 rounded mx-auto" />
                  <div className="h-3.5 w-20 bg-slate-200/60 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin section layout */}
        {layout === 'admin' && (
          <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-slate-200/80 rounded" />
              <div className="h-10 w-32 bg-accent/30 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-sand/40 bg-white p-5 space-y-3"
                >
                  <div className="h-4 w-24 bg-slate-200/60 rounded" />
                  <div className="h-7 w-16 bg-slate-200/80 rounded" />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-sand/40 bg-white p-6 space-y-4">
              <div className="h-5 w-40 bg-slate-200/70 rounded" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Default fallback layout */}
        {layout === 'default' && (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: count > 3 ? 3 : count }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-clinic-border-subtle bg-white p-6 space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/15" />
                  <div className="h-5 w-1/2 bg-slate-200/80 rounded" />
                  <SkeletonText lines={2} />
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-clinic-border-subtle bg-white p-8 space-y-4">
              <div className="h-6 w-1/4 bg-slate-200/80 rounded" />
              <SkeletonText lines={4} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
