import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';
import { fetchTreatments, fetchSettings, fetchCategoriesApi } from '@/lib/api';

const BookingWizard = dynamic(() => import('@/components/booking/BookingWizard'), {
  ssr: false,
  loading: () => (
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
  ),
});

export async function generateMetadata() {
  const settings = await fetchSettings();
  const clinicName = settings?.clinic_name || 'SkinGlow Clinic';
  const doctorName = settings?.doctor_name || 'our doctor';
  return {
    title: `Book an Appointment | ${clinicName}`,
    description: `Schedule a personalized medical dermatology or aesthetic consultation with ${doctorName} at ${clinicName}.`,
  };
}

export const revalidate = 60;

export default async function BookAppointmentPage() {
  const [treatments, settings, categories] = await Promise.all([
    fetchTreatments(),
    fetchSettings(),
    fetchCategoriesApi(),
  ]);


  return (
    <div className="min-h-screen bg-clinic-bg pb-20">
      {/* Header Banner */}
      <header className="py-14 text-center bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle mb-10">
        <div className="container">
          <div className="badge mx-auto mb-3">
            <Sparkles size={14} />
            <span>Physician-Led Skincare</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mb-3">
            Schedule Your Private Consultation
          </h1>
          <p className="text-sm sm:text-base text-clinic-muted max-w-xl mx-auto leading-relaxed">
            Experience bespoke aesthetic precision and clinical dermatology designed specifically for your skin and hair profile.
          </p>

          {/* Clinical Trust Highlights */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap mt-6 text-xs sm:text-sm font-medium text-primary">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-accent" />
              <span>{settings?.doctor_qualifications ? `${settings.doctor_qualifications} Directed` : 'MD Dermatologist Directed'}</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-accent hidden sm:inline-block" />
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-accent" />
              <span>Zero-Wait Dedicated Slot</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-accent hidden sm:inline-block" />
            <div className="flex items-center gap-1.5">
              <Award size={16} className="text-accent" />
              <span>US FDA Approved Technology</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Booking Container */}
      <main className="container">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20 text-clinic-muted gap-4">
              <div className="w-10 h-10 border-4 border-clinic-border-subtle border-t-accent rounded-full animate-spin" />
              <p className="text-sm">Loading clinical procedures and available slots...</p>
            </div>
          }
        >
          <BookingWizard treatments={treatments} settings={settings} categories={categories} />
        </Suspense>
      </main>
    </div>
  );
}
