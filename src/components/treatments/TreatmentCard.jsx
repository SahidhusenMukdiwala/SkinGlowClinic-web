import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORY_MAP } from '@/lib/constants';
import styles from './TreatmentCard.module.css';

export default function TreatmentCard({ treatment }) {
  const categoryName = CATEGORY_MAP[treatment.category] || 'Clinical Aesthetic';

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={treatment.image_url || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80'}
          alt={treatment.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
        <div className={styles.categoryBadge}>
          <Sparkles size={12} />
          <span>{categoryName}</span>
        </div>
        {treatment.duration && (
          <div className={styles.durationBadge}>
            <Clock size={12} />
            <span>{treatment.duration}</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link href={`/treatments/${treatment.slug}`}>
            {treatment.title}
          </Link>
        </h3>

        <p className={styles.description}>
          {treatment.short_description}
        </p>

        <div className={styles.footer}>
          <Link href={`/treatments/${treatment.slug}`} className={styles.link}>
            <span>View Clinical Profile</span>
            <ArrowRight size={15} />
          </Link>
          <Link href={`/book-appointment?treatment=${treatment.slug}`} className={styles.bookBtn}>
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
