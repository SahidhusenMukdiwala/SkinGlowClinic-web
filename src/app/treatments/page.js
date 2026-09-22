import React from 'react';
import { Sparkles } from 'lucide-react';
import { fetchTreatments, fetchCategoriesApi, fetchSettings } from '@/lib/api';
import TreatmentsList from '@/components/treatments/TreatmentsList';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/seo/schemas';

export async function generateMetadata() {
  const settings = await fetchSettings();
  const clinicName = settings?.clinic_name || 'Skin Glow Clinic';
  const title = `Advanced Skin & Laser Treatments in Himmatnagar | ${clinicName}`;
  const description = `Explore physician-led clinical dermatology, laser hair removal, chemical peels, PRP hair restoration, and anti-aging treatments at ${clinicName} in Himmatnagar, Gujarat.`;

  return {
    title,
    description,
    keywords: [
      'skin treatments Himmatnagar',
      'dermatology clinic Himmatnagar',
      'laser hair removal Himmatnagar',
      'acne treatment Gujarat',
      'hydrafacial Himmatnagar',
      'chemical peel Himmatnagar',
      'PRP hair treatment Gujarat',
      'anti aging treatment Himmatnagar',
      clinicName,
    ],
    alternates: {
      canonical: '/treatments',
    },
    openGraph: {
      title,
      description,
      url: '/treatments',
      siteName: clinicName,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: '/Skin%20Glow%20Logo.jpg',
          width: 1200,
          height: 630,
          alt: `Clinical Treatments at ${clinicName} — Himmatnagar`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/Skin%20Glow%20Logo.jpg'],
    },
  };
}

export const revalidate = 60;

export default async function TreatmentsPage() {
  const [treatments, categories, settings] = await Promise.all([
    fetchTreatments(),
    fetchCategoriesApi(),
    fetchSettings(),
  ]);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Treatments', url: '/treatments' },
  ]);

  return (
    <div className="min-h-screen bg-clinic-bg pb-20">
      <JsonLd data={breadcrumbSchema} />
      {/* Header Banner */}
      <header className="py-16 text-center bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle mb-12">
        <div className="container">
          <div className="badge mx-auto mb-3">
            <Sparkles size={14} />
            <span>Physician-Led Services in Himmatnagar</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mb-4">
            Skin Treatments & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-soft to-accent-hover">
              Dermatology Services in Himmatnagar
            </span>
          </h1>
          <p className="text-sm sm:text-base text-clinic-muted max-w-2xl mx-auto leading-relaxed">
            Every treatment is available at our state-of-the-art clinic in Himmatnagar, Gujarat. Backed by dermatological science, cutting-edge medical technology, and personalized clinical care for patients across Sabarkantha.
          </p>
        </div>
      </header>

      {/* Main Listing Section */}
      <main className="container">
        <TreatmentsList initialTreatments={treatments} initialCategories={categories} />
      </main>
    </div>
  );
}
