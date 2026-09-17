import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Star,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Award,
  ArrowRight,
  MessageSquareQuote,
} from 'lucide-react';
import { fetchTestimonials, fetchSettings } from '@/lib/api';

export async function generateMetadata() {
  const settings = await fetchSettings();
  const clinicName = settings?.clinic_name || 'SkinGlow Clinic';
  return {
    title: `Patient Stories & Verified Testimonials | ${clinicName}`,
    description: `Read genuine verified reviews and patient experiences for clinical dermatology, laser hair reduction, and anti-aging treatments at ${clinicName}.`,
  };
}

export const revalidate = 60;

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([
    fetchTestimonials(),
    fetchSettings(),
  ]);

  return (
    <div className="min-h-screen bg-clinic-bg pb-24">
      {/* Header Banner */}
      <header className="py-16 lg:py-20 text-center bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-primary text-xs font-semibold mb-4">
            <Sparkles size={14} className="text-accent" />
            <span>Verified Patient Experiences</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-primary font-bold tracking-tight mb-5 leading-tight">
            Transformative Journeys & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-soft to-accent-hover">
              Real Patient Stories
            </span>
          </h1>
          <p className="text-base sm:text-lg text-clinic-muted max-w-2xl mx-auto leading-relaxed">
            Discover how our personalized, dermatologist-led protocols have restored radiance, solved persistent skin challenges, and elevated patient confidence.
          </p>
        </div>
      </header>

      {/* Aggregate Trust Bar */}
      <section className="container max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-clinic-border-subtle shadow-md grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-clinic-border-subtle">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <span className="font-heading text-3xl font-bold text-primary">4.9 / 5.0</span>
            <span className="text-xs text-clinic-muted mt-0.5">Average Patient Rating</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 lg:pt-2">
            <span className="font-heading text-3xl font-bold text-primary">10,000+</span>
            <span className="text-xs text-clinic-muted mt-0.5">Patients Treated</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 lg:pt-2">
            <span className="font-heading text-3xl font-bold text-primary">99.4%</span>
            <span className="text-xs text-clinic-muted mt-0.5">Clinical Satisfaction</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 lg:pt-2">
            <span className="font-heading text-3xl font-bold text-primary">15+ Years</span>
            <span className="text-xs text-clinic-muted mt-0.5">Dermatology Excellence</span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-7 border border-clinic-border-subtle shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-accent/15 group-hover:text-accent/30 transition-colors">
                <MessageSquareQuote size={36} />
              </div>

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* Treatment Badge */}
                {review.treatment_name && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-clinic-bg-alt text-primary text-xs font-semibold border border-clinic-border-subtle">
                      {review.treatment_name}
                    </span>
                  </div>
                )}

                {/* Review Text */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                  &ldquo;{review.review_text}&rdquo;
                </p>
              </div>

              {/* Patient Identity */}
              <div className="pt-4 border-t border-clinic-border-subtle/70 flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-sand">
                  <Image
                    src={review.patient_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={review.patient_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading text-sm font-bold text-primary">{review.patient_name}</h4>
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-xs text-clinic-muted">
                    {review.date || 'Verified Patient'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Consultation Call to Action */}
        <section className="mt-20 rounded-3xl bg-gradient-to-r from-primary via-primary-light to-primary text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-xl border border-accent/20">
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-semibold mb-4">
              <Sparkles size={13} />
              <span>Begin Your Journey</span>
            </div>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Ready to Experience Your Own Skin Transformation?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Join thousands of satisfied patients who trust {settings?.doctor_name || 'our doctor'}{settings?.doctor_qualifications ? `, ${settings.doctor_qualifications}` : ''} and the {settings?.clinic_name || 'SkinGlow'} clinical team for honest guidance and noticeable results.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/book-appointment"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-accent to-accent-soft hover:from-accent-hover hover:to-accent text-primary font-bold text-sm shadow-gold transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <Calendar size={16} />
                <span>Book Consultation</span>
              </Link>
              <Link
                href="/treatments"
                className="px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-white font-medium text-sm transition-colors inline-flex items-center gap-1.5"
              >
                <span>View Procedures</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
