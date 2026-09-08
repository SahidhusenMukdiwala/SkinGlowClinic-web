import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Calendar, Sparkles, ChevronRight, CheckCircle2, ShieldAlert, PhoneCall } from 'lucide-react';
import { fetchTreatmentBySlug, fetchSettings } from '@/lib/api';
import { CATEGORY_MAP } from '@/lib/constants';
import styles from './treatmentDetail.module.css';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const data = await fetchTreatmentBySlug(params.slug);
  if (!data || !data.treatment) {
    return {
      title: 'Treatment Not Found | SkinGlow Clinic',
    };
  }

  const { treatment } = data;
  return {
    title: `${treatment.title} | SkinGlow Clinic Mumbai`,
    description: treatment.short_description || `Learn about ${treatment.title} at SkinGlow Clinic. Physician-led dermatology and laser aesthetics.`,
  };
}

export default async function TreatmentDetailPage({ params }) {
  const [data, settings] = await Promise.all([
    fetchTreatmentBySlug(params.slug),
    fetchSettings(),
  ]);

  if (!data || !data.treatment) {
    notFound();
  }

  const { treatment, related = [] } = data;
  const categoryName = CATEGORY_MAP[treatment.category] || 'Clinical Aesthetic';

  // Render markdown-like sections into clean semantic blocks
  const renderFormattedDescription = (text) => {
    if (!text) return null;

    const blocks = text.split('\n\n');
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx}>{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map(line => line.replace(/^- /, ''));
        return (
          <ul key={idx}>
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').map(line => line.replace(/^\d+\.\s/, ''));
        return (
          <ol key={idx}>
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ol>
        );
      }
      return <p key={idx}>{trimmed}</p>;
    });
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbsBar}>
        <div className={`container ${styles.breadcrumbLinks}`}>
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/treatments">Treatments</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.currentBreadcrumb}>{treatment.title}</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className={styles.heroHeader}>
        <div className="container">
          <div className={styles.heroMeta}>
            <div className="badge">
              <Sparkles size={12} />
              <span>{categoryName}</span>
            </div>
            {treatment.duration && (
              <div className="badge" style={{ background: 'var(--color-white)', color: 'var(--color-primary)' }}>
                <Clock size={12} />
                <span>Duration: {treatment.duration}</span>
              </div>
            )}
          </div>

          <h1 className={styles.heroTitle}>{treatment.title}</h1>
          <p className={styles.heroSummary}>{treatment.short_description}</p>
        </div>
      </header>

      {/* Main Content Layout */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.contentGrid}`}>
          {/* Main Column */}
          <div className={styles.mainColumn}>
            {/* Visual Image */}
            <div className={styles.featureImageWrapper}>
              <Image
                src={treatment.image_url || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80'}
                alt={treatment.title}
                width={800}
                height={440}
                priority
                className={styles.featureImage}
              />
            </div>

            {/* Detailed Clinical Profile */}
            <article className={styles.richText}>
              {renderFormattedDescription(treatment.full_description || treatment.short_description)}
            </article>

            {/* Safety & Clinical Guarantee Callout */}
            <div style={{
              background: 'var(--color-bg-alt)',
              padding: '1.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'flex-start',
            }}>
              <CheckCircle2 size={24} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
                  SkinGlow Clinical Safety Assurance
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: '1.6', margin: 0 }}>
                  This procedure is administered exclusively using sterile medical disposables and US-FDA cleared clinical equipment under the direct supervision of Board-Certified dermatologists.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Direct Booking Card */}
            <div className={styles.bookingCard}>
              <h3 className={styles.bookingCardTitle}>Schedule This Treatment</h3>
              <p className={styles.bookingCardSub}>
                Personalized diagnostic evaluation and customized procedure with Dr. Aisha Sharma.
              </p>

              <div className={styles.metricsList}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>
                    <Clock size={15} />
                    <span>Session Time</span>
                  </span>
                  <span className={styles.metricValue}>{treatment.duration || '45 mins'}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>
                    <Sparkles size={15} />
                    <span>Category</span>
                  </span>
                  <span className={styles.metricValue}>{categoryName}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>
                    <CheckCircle2 size={15} />
                    <span>Supervised By</span>
                  </span>
                  <span className={styles.metricValue}>MD Dermatologist</span>
                </div>
              </div>

              <Link
                href={`/book-appointment?treatment=${treatment.slug}`}
                className={`btn btn-primary ${styles.sidebarActionBtn}`}
              >
                <Calendar size={18} />
                <span>Book This Treatment</span>
              </Link>

              <a
                href={`tel:${(settings.phone || '+919820123456').replace(/\s+/g, '')}`}
                className={`btn btn-secondary ${styles.sidebarActionBtn}`}
              >
                <PhoneCall size={16} />
                <span>Call to Inquire</span>
              </a>
            </div>

            {/* Related Treatments */}
            {related.length > 0 && (
              <div className={styles.relatedBox}>
                <h4 className={styles.relatedTitle}>Related Procedures</h4>
                <div className={styles.relatedList}>
                  {related.map(item => (
                    <Link
                      key={item.id}
                      href={`/treatments/${item.slug}`}
                      className={styles.relatedItem}
                    >
                      <Image
                        src={item.image_url || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80'}
                        alt={item.title}
                        width={60}
                        height={60}
                        className={styles.relatedThumb}
                      />
                      <div className={styles.relatedInfo}>
                        <h4>{item.title}</h4>
                        <span>{item.duration || 'Learn more'}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
