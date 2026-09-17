import React from 'react';
import { Sparkles } from 'lucide-react';
import { fetchTreatments, fetchCategoriesApi, fetchSettings } from '@/lib/api';
import TreatmentsList from '@/components/treatments/TreatmentsList';

export async function generateMetadata() {
  const settings = await fetchSettings();
  const clinicName = settings?.clinic_name || 'SkinGlow Clinic';
  return {
    title: `Specialized Treatments | ${clinicName}`,
    description: `Explore our complete spectrum of clinical dermatology, laser hair reduction, anti-aging aesthetics, and hair restoration therapies at ${clinicName}.`,
  };
}

export const revalidate = 60;

export default async function TreatmentsPage() {
  const [treatments, categories, settings] = await Promise.all([
    fetchTreatments(),
    fetchCategoriesApi(),
    fetchSettings(),
  ]);

  return (
    <div className="min-h-screen bg-clinic-bg pb-20">
      {/* Header Banner */}
      <header className="py-16 text-center bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle mb-12">
        <div className="container">
          <div className="badge mx-auto mb-3">
            <Sparkles size={14} />
            <span>Physician-Led Services</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mb-4">
            Clinical Treatments & Procedures
          </h1>
          <p className="text-sm sm:text-base text-clinic-muted max-w-2xl mx-auto leading-relaxed">
            Every treatment at {settings?.clinic_name || 'SkinGlow Clinic'} is backed by dermatological science, cutting-edge medical technology, and personalized clinical care.
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
