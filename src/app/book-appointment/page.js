import React, { Suspense } from 'react';
import { Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';
import { fetchTreatments, fetchSettings } from '@/lib/api';
import BookingWizard from '@/components/booking/BookingWizard';

export const metadata = {
  title: 'Book an Appointment | SkinGlow Clinic Mumbai',
  description: 'Schedule a personalized medical dermatology or aesthetic consultation with Dr. Aisha Sharma at SkinGlow Clinic, Bandra West, Mumbai.',
};

export const revalidate = 60;

export default async function BookAppointmentPage() {
  const [treatments, settings] = await Promise.all([
    fetchTreatments(),
    fetchSettings(),
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
              <span>MD Dermatologist Directed</span>
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
          <BookingWizard treatments={treatments} settings={settings} />
        </Suspense>
      </main>
    </div>
  );
}
