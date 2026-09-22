import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORY_MAP } from '@/lib/constants';

export default function TreatmentCard({ treatment }) {
  const categoryName =
    treatment.category?.name ||
    CATEGORY_MAP[treatment.category_id || treatment.category] ||
    'Clinical Aesthetic';

  return (
    <article className="bg-white rounded-xl overflow-hidden border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      <div className="relative w-full h-52 overflow-hidden bg-clinic-bg-alt">
        <Image
          src={treatment.image_url || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80'}
          alt={`${treatment.title} treatment at Skin Glow Clinic Himmatnagar`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/85 backdrop-blur-sm text-accent text-xs font-semibold flex items-center gap-1.5 shadow-sm">
          <Sparkles size={11} />
          <span>{categoryName}</span>
        </div>
        {treatment.price && Number(treatment.price) > 0 ? (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-primary text-xs font-mono font-bold shadow-sm border border-sand">
            ₹{Number(treatment.price).toLocaleString('en-IN')}
          </div>
        ) : null}
        {treatment.duration && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium flex items-center gap-1 shadow-sm">
            <Clock size={11} />
            <span>{treatment.duration}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-lg font-bold text-primary hover:text-accent transition-colors mb-2 line-clamp-1">
          <Link href={`/treatments/${treatment.slug}`}>
            {treatment.title}
          </Link>
        </h3>

        <p className="text-sm text-clinic-muted leading-relaxed mb-4 line-clamp-2 flex-1">
          {treatment.short_description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-clinic-border-subtle mt-auto">
          <Link href={`/treatments/${treatment.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors">
            <span>View Clinical Profile</span>
            <ArrowRight size={14} />
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/book-appointment?treatment=${treatment.slug}`} className="px-3.5 py-1.5 rounded-full bg-accent/15 hover:bg-accent text-primary text-xs font-semibold transition-all">
              Book
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
