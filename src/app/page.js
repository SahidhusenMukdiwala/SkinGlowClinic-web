import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Microscope,
  CheckCircle2,
  PhoneCall,
  HeartHandshake,
} from 'lucide-react';
import { fetchSettings, fetchTreatments, fetchTestimonials } from '@/lib/api';
import SectionHeader from '@/components/common/SectionHeader';
import HomeServicesTabs from '@/components/home/HomeServicesTabs';
import HomeTestimonials from '@/components/home/HomeTestimonials';
import HomeFAQ from '@/components/home/HomeFAQ';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, treatments, testimonials] = await Promise.all([
    fetchSettings(),
    fetchTreatments(),
    fetchTestimonials(),
  ]);

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative py-12 lg:py-20 bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="badge mb-4">
                <Sparkles size={14} />
                <span>Physician-Led Medical Aesthetics</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-primary font-bold tracking-tight leading-[1.15] mb-6">
                Reveal Your Skin’s <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-soft to-accent-hover">
                  Radiant Perfection
                </span>
              </h1>

              <p className="text-base sm:text-lg text-clinic-muted leading-relaxed max-w-xl mb-8">
                {settings.about_text ||
                  'At SkinGlow Clinic, we blend cutting-edge medical dermatology with artistic aesthetic techniques. Our bespoke treatments restore balance, enhance radiance, and celebrate your natural skin health.'}
              </p>

              <div className="flex items-center gap-4 flex-wrap mb-10">
                <Link href="/book-appointment" className="btn btn-primary">
                  <Calendar size={18} />
                  <span>Book Consultation</span>
                </Link>
                <Link href="/treatments" className="btn btn-secondary">
                  <span>Explore Treatments</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-clinic-border-subtle w-full max-w-lg">
                <div>
                  <span className="block font-heading text-2xl sm:text-3xl font-bold text-primary">10k+</span>
                  <span className="text-xs sm:text-sm text-clinic-muted">Happy Patients</span>
                </div>
                <div>
                  <span className="block font-heading text-2xl sm:text-3xl font-bold text-primary">15+</span>
                  <span className="text-xs sm:text-sm text-clinic-muted">Years Experience</span>
                </div>
                <div>
                  <span className="block font-heading text-2xl sm:text-3xl font-bold text-primary">99.4%</span>
                  <span className="text-xs sm:text-sm text-clinic-muted">Satisfaction Rate</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg border border-clinic-border-subtle">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
                alt="SkinGlow Clinic Treatment Room"
                width={600}
                height={480}
                priority
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-md flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                  <Award size={22} />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-primary">Accredited Clinical Excellence</h4>
                  <p className="text-xs text-clinic-muted">US-FDA cleared technology & physician-led protocols</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Choose Us */}
      <section className="py-20 bg-clinic-bg-alt/60">
        <div className="container">
          <SectionHeader
            badge="The SkinGlow Standard"
            title="Why Discerning Patients Entrust Their Skin to Us"
            subtitle="We distinguish ourselves through uncompromising clinical precision, ethical medical counsel, and artistic harmony."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                <ShieldCheck size={26} />
              </div>
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Physician-Led Diagnostics</h3>
              <p className="text-sm text-clinic-muted leading-relaxed">
                Every protocol is designed and performed under the direct oversight of Board-Certified dermatologists, guaranteeing medical safety and precision.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                <Microscope size={26} />
              </div>
              <h3 className="font-heading text-lg font-bold text-primary mb-2">US-FDA Cleared Technology</h3>
              <p className="text-sm text-clinic-muted leading-relaxed">
                We invest in gold-standard laser platforms, micro-infusion delivery systems, and sterile pharmaceutical formulations with proven clinical efficacy.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                <Sparkles size={26} />
              </div>
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Bespoke Formulations</h3>
              <p className="text-sm text-clinic-muted leading-relaxed">
                No one-size-fits-all treatments. We customize peel strengths, laser wavelengths, and active serums tailored specifically to diverse Indian skin tones.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                <HeartHandshake size={26} />
              </div>
              <h3 className="font-heading text-lg font-bold text-primary mb-2">Natural Radiance Focus</h3>
              <p className="text-sm text-clinic-muted leading-relaxed">
                We celebrate and enhance your innate beauty. Our aesthetic interventions prioritize harmonious, subtle refinement rather than exaggerated results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Specialized Treatments / Services Overview */}
      <section className="py-20 bg-white">
        <div className="container">
          <SectionHeader
            badge="Our Clinical Expertise"
            title="Comprehensive Dermatology & Aesthetic Therapies"
            subtitle="Explore our curated portfolio of physician-led clinical procedures engineered to restore, refine, and rejuvenate."
          />

          <HomeServicesTabs treatments={treatments} />
        </div>
      </section>

      {/* 4. Doctor Spotlight */}
      <section className="py-20 bg-clinic-bg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md">
              <Image
                src={settings.doctor_image || settings.doctor_profile_image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"}
                alt={settings.doctor_name || 'Dr. Aisha Sharma'}
                width={500}
                height={520}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-primary/85 backdrop-blur-sm text-white text-xs font-semibold">
                <span>Lead Consultant Dermatologist</span>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 items-start">
              <div className="badge">
                <Sparkles size={14} />
                <span>Meet Your Physician</span>
              </div>
              <h3 className="font-heading text-3xl font-bold text-primary">{settings.doctor_name || 'Dr. Aisha Sharma'}</h3>
              <p className="text-sm text-accent-hover font-semibold">
                {settings.doctor_qualifications || 'MD, DNB (Dermatology, Venereology & Leprosy), FAAD (USA)'}
              </p>

              <p className="text-sm sm:text-base text-clinic-muted leading-relaxed">
                With over 15 years of clinical practice in medical and aesthetic dermatology, Dr. Sharma brings an empathetic, science-backed approach to skin health. Having trained extensively in India and the United States, she is renowned for her mastery of laser physics and subtle facial rejuvenation.
              </p>

              <div className="flex flex-col gap-2.5 my-2">
                <div className="flex items-center gap-2.5 text-sm text-clinic-text">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Fellow of the American Academy of Dermatology (FAAD)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-clinic-text">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Member of the Indian Association of Dermatologists (IADVL)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-clinic-text">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Over 25,000 successful clinical & laser procedures performed</span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap mt-4">
                <Link href="/about" className="btn btn-secondary">
                  <span>Read Full Profile</span>
                  <ArrowRight size={15} />
                </Link>
                <Link href="/book-appointment" className="btn btn-primary">
                  <span>Schedule Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Patient Testimonials */}
      <section className="py-20 bg-clinic-bg-alt/50">
        <div className="container">
          <SectionHeader
            badge="Real Experiences"
            title="What Our Patients Say About Their Transformations"
            subtitle="Authentic reviews from individuals who transformed their skin confidence with our clinical team."
          />

          <HomeTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-20 bg-white">
        <div className="container">
          <SectionHeader
            badge="Got Questions?"
            title="Frequently Asked Clinical Questions"
            subtitle="Everything you need to know about our consultations, technologies, and post-procedure expectations."
          />

          <HomeFAQ />
        </div>
      </section>

      {/* 7. Luxury CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary-light to-primary text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="font-heading text-2xl sm:text-3xl text-white font-bold mb-3">
                Ready to Experience Physician-Led Skincare?
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Take the first step toward lasting skin health. Schedule your in-depth diagnostic consultation with Dr. Aisha Sharma today.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/book-appointment" className="btn btn-primary">
                <Calendar size={18} />
                <span>Book Appointment</span>
              </Link>
              <a
                href={`tel:${(settings.phone || '+919820123456').replace(/\s+/g, '')}`}
                className="btn btn-secondary border-white/30 text-white hover:bg-white/10"
              >
                <PhoneCall size={16} />
                <span>Call Clinic</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
