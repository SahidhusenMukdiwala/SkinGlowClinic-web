import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Calendar, Sparkles, CheckCircle2, PhoneCall } from 'lucide-react';
import { fetchTreatmentBySlug, fetchSettings } from '@/lib/api';
import { CATEGORY_MAP } from '@/lib/constants';
import JsonLd from '@/components/seo/JsonLd';
import { getMedicalProcedureSchema, getBreadcrumbSchema } from '@/lib/seo/schemas';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const [data, settings] = await Promise.all([
    fetchTreatmentBySlug(params.slug),
    fetchSettings(),
  ]);
  const clinicName = settings?.clinic_name || 'Skin Glow Clinic';
  if (!data || !data.treatment) {
    return {
      title: `Treatment Not Found | ${clinicName}`,
    };
  }

  const { treatment } = data;
  const title = `${treatment.title} in Himmatnagar | ${clinicName}`;
  const description = treatment.short_description
    ? `${treatment.short_description} Available at ${clinicName}, Himmatnagar, Gujarat.`
    : `Learn about ${treatment.title} at ${clinicName} in Himmatnagar, Gujarat. Physician-led clinical dermatology and advanced aesthetic care.`;
  const image = treatment.image_url || '/Skin%20Glow%20Logo.jpg';

  return {
    title,
    description,
    keywords: [
      treatment.title,
      `${treatment.title} Himmatnagar`,
      `${treatment.title} cost Gujarat`,
      `best ${treatment.title} clinic`,
      'Himmatnagar skin treatment',
      'dermatologist Himmatnagar',
      clinicName,
    ],
    alternates: {
      canonical: `/treatments/${treatment.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/treatments/${treatment.slug}`,
      siteName: clinicName,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${treatment.title} at ${clinicName} — Himmatnagar`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
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

  // Render rich HTML from TipTap or markdown-like sections into clean semantic blocks
  const renderFormattedDescription = (text) => {
    if (!text) return null;

    // Detect if content contains HTML tags from TipTap editor
    if (/<[a-z][\s\S]*>/i.test(text)) {
      return (
        <div
          className="rich-text-content text-clinic-text leading-relaxed font-sans"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }

    const blocks = text.split('\n\n');
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-heading text-xl sm:text-2xl font-bold text-primary mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map(line => line.replace(/^- /, ''));
        return (
          <ul key={idx} className="list-disc pl-5 mb-4 space-y-1.5 text-clinic-muted text-sm sm:text-base">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').map(line => line.replace(/^\d+\.\s/, ''));
        return (
          <ol key={idx} className="list-decimal pl-5 mb-4 space-y-1.5 text-clinic-muted text-sm sm:text-base">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <p key={idx} className="text-sm sm:text-base text-clinic-muted leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  const medicalProcedureSchema = getMedicalProcedureSchema(treatment);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Treatments', url: '/treatments' },
    { name: treatment.title, url: `/treatments/${treatment.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-clinic-bg pb-20">
      <JsonLd data={[medicalProcedureSchema, breadcrumbSchema]} />
      {/* Breadcrumbs */}
      <div className="bg-clinic-bg-alt/50 border-b border-clinic-border-subtle py-3 text-xs sm:text-sm text-clinic-muted">
        <div className="container flex items-center gap-2">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/treatments" className="hover:text-accent transition-colors">Treatments</Link>
          <span>/</span>
          <span className="text-primary font-medium">{treatment.title}</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="py-12 lg:py-16 bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle">
        <div className="container">
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <div className="badge">
              <Sparkles size={12} />
              <span>{categoryName}</span>
            </div>
            {treatment.duration && (
              <div className="badge bg-white text-primary border-primary/20">
                <Clock size={12} />
                <span>Duration: {treatment.duration}</span>
              </div>
            )}
            <div className="badge bg-sand/30 text-primary border-sand">
              <span>
                {treatment.price && Number(treatment.price) > 0
                  ? `Fee: ₹${Number(treatment.price).toLocaleString('en-IN')}`
                  : 'Consultation Included'}
              </span>
            </div>
            <div className="badge bg-emerald-50 text-emerald-800 border-emerald-200">
              <span>Available at our Himmatnagar clinic</span>
            </div>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mb-3">
            {treatment.title}
          </h1>
          <p className="text-base sm:text-lg text-clinic-muted max-w-3xl leading-relaxed">
            {treatment.short_description} Available at our specialized dermatology facility in Himmatnagar, Gujarat.
          </p>
        </div>
      </header>

      {/* Main Content Layout */}
      <section className="py-12">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-clinic-border-subtle">
              <Image
                src={treatment.image_url || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80'}
                alt={`${treatment.title} treatment at Skin Glow Clinic Himmatnagar`}
                width={800}
                height={440}
                priority
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Detailed Clinical Profile */}
            <article className="prose max-w-none">
              {renderFormattedDescription(treatment.full_description || treatment.short_description)}
            </article>

            {/* Safety & Clinical Guarantee Callout */}
            <div className="bg-clinic-bg-alt p-6 rounded-xl border border-clinic-border flex items-start gap-4">
              <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading text-base font-bold text-primary mb-1">
                  {settings?.clinic_name || 'Skin Glow Clinic'} — Himmatnagar, Gujarat
                </h4>
                <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed">
                  Available at our Himmatnagar clinic. This procedure is administered exclusively using sterile medical disposables and US-FDA cleared clinical equipment under the direct supervision of Board-Certified dermatologists for patients across Gujarat.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Direct Booking Card */}
            <div className="bg-white p-6 rounded-2xl border border-clinic-border shadow-md sticky top-24">
              <h3 className="font-heading text-xl font-bold text-primary mb-1">Schedule This Treatment</h3>
              <p className="text-xs sm:text-sm text-clinic-muted mb-6 leading-relaxed">
                Personalized diagnostic evaluation and customized procedure with {settings?.doctor_name || 'our lead physician'}.
              </p>

              <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-clinic-border-subtle text-xs sm:text-sm">
                <div className="flex items-center justify-between text-clinic-muted">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> Session Time</span>
                  <span className="font-semibold text-primary">{treatment.duration || '45 mins'}</span>
                </div>
                <div className="flex items-center justify-between text-clinic-muted">
                  <span className="flex items-center gap-1.5"><Sparkles size={14} /> Procedure Fee</span>
                  <span className="font-bold font-mono text-primary">
                    {treatment.price && Number(treatment.price) > 0
                      ? `₹${Number(treatment.price).toLocaleString('en-IN')}`
                      : 'On Consultation'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-clinic-muted">
                  <span className="flex items-center gap-1.5"><Sparkles size={14} /> Category</span>
                  <span className="font-semibold text-primary">{categoryName}</span>
                </div>
                <div className="flex items-center justify-between text-clinic-muted">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Supervised By</span>
                  <span className="font-semibold text-primary">{settings?.doctor_qualifications ? `${settings.doctor_qualifications} Specialist` : 'MD Dermatologist'}</span>
                </div>
              </div>

              <Link
                href={`/book-appointment?treatment=${treatment.slug}`}
                className="btn btn-primary w-full justify-center mb-3"
              >
                <Calendar size={18} />
                <span>Book This Treatment</span>
              </Link>

              <a
                href={`tel:${(settings.phone || '+919820123456').replace(/\s+/g, '')}`}
                className="btn btn-secondary w-full justify-center text-xs sm:text-sm"
              >
                <PhoneCall size={16} />
                <span>Call to Inquire</span>
              </a>
            </div>

            {/* Related Treatments */}
            {related.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-clinic-border-subtle shadow-sm">
                <h4 className="font-heading text-base font-bold text-primary mb-4">Related Procedures</h4>
                <div className="flex flex-col gap-3">
                  {related.map(item => (
                    <Link
                      key={item.id}
                      href={`/treatments/${item.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-clinic-bg transition-colors group"
                    >
                      <Image
                        src={item.image_url || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80'}
                        alt={`${item.title} at Skin Glow Clinic Himmatnagar`}
                        width={52}
                        height={52}
                        className="w-13 h-13 rounded-lg object-cover"
                      />
                      <div>
                        <h5 className="font-heading text-sm font-bold text-primary group-hover:text-accent transition-colors line-clamp-1">
                          {item.title}
                        </h5>
                        <span className="text-xs text-clinic-muted">{item.duration || 'Learn more'}</span>
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
