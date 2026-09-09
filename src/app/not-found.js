import React from 'react';
import Link from 'next/link';
import { Home, Calendar, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 text-center bg-clinic-bg">
      <div className="max-w-lg mx-auto flex flex-col items-center">
        <div className="badge mb-2">
          <Sparkles size={14} />
          <span>Page Not Found</span>
        </div>

        <div>
          <span className="font-heading text-7xl sm:text-8xl font-extrabold text-primary/15 tracking-wider select-none">
            404
          </span>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-3">
          Radiance Lost in Transit
        </h1>

        <p className="text-sm sm:text-base text-clinic-muted leading-relaxed mb-8">
          The page or treatment you are looking for may have been moved, renamed, or is currently undergoing rejuvenation. Let us guide you back.
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/" className="btn btn-primary">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
          <Link href="/book-appointment" className="btn btn-secondary">
            <Calendar size={18} />
            <span>Book Consultation</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
