import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Microscope,
  Award,
  Zap,
  PhoneCall,
} from 'lucide-react';
import { fetchSettings } from '@/lib/api';
import SectionHeader from '@/components/common/SectionHeader';

export async function generateMetadata() {
  const settings = await fetchSettings();
  const clinicName = settings?.clinic_name || 'SkinGlow Clinic';
  const doctorName = settings?.doctor_name || 'Dr. Aisha Sharma';
  return {
    title: `About Our Clinic & Physicians | ${clinicName}`,
    description: `Learn about ${clinicName}, our founding philosophy, ${doctorName}, and our state-of-the-art dermatological equipment.`,
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await fetchSettings();

  return (
    <div className="min-h-screen bg-clinic-bg">
      {/* Header Banner */}
      <header className="py-16 text-center bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle mb-16">
        <div className="container">
          <div className="badge mx-auto mb-3">
            <Sparkles size={14} />
            <span>Our Clinical Heritage</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mb-4">
            Science Meets Aesthetic Artistry
          </h1>
          <p className="text-sm sm:text-base text-clinic-muted max-w-2xl mx-auto leading-relaxed">
            Dedicated to empowering your skin health through rigorous evidence-based dermatology, compassionate physician counsel, and bespoke clinical solutions.
          </p>
        </div>
      </header>

      {/* Clinic Story & Philosophy */}
      <section className="mb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4 items-start">
              <div className="badge">
                <Sparkles size={14} />
                <span>Our Philosophy</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                Where Clinical Rigor Meets Bespoke Aesthetics
              </h2>
              <p className="text-sm sm:text-base text-clinic-muted leading-relaxed">
                {settings.about_text ||
                  'Founded on the principle that true skin radiance is an outcome of profound cellular health, SkinGlow Clinic offers an elevated sanctuary for advanced dermatological care in Mumbai.'}
              </p>
              <p className="text-sm sm:text-base text-clinic-muted leading-relaxed">
                We depart from conventional beauty spas by providing purely physician-led medical interventions. Every laser pulse, chemical formulation, and injectable protocol is calibrated to your skin’s unique biological requirements.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
                <div className="bg-white p-5 rounded-xl border border-clinic-border-subtle shadow-sm">
                  <h4 className="font-heading text-base font-bold text-primary mb-1.5">Evidence-Based Protocols</h4>
                  <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed">Groundbreaking clinical therapies supported by international dermatological research.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-clinic-border-subtle shadow-sm">
                  <h4 className="font-heading text-base font-bold text-primary mb-1.5">Transparent Medical Ethics</h4>
                  <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed">Honest clinical recommendations without unnecessary upsells or artificial guarantees.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-clinic-border-subtle shadow-sm">
                  <h4 className="font-heading text-base font-bold text-primary mb-1.5">Bespoke Personalization</h4>
                  <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed">Custom treatments formulated exclusively for your specific Fitzpatrick skin profile.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-clinic-border-subtle shadow-sm">
                  <h4 className="font-heading text-base font-bold text-primary mb-1.5">Hospital-Grade Hygiene</h4>
                  <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed">Sterile autoclave instruments and disposable medical consumables for every visit.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-lg border border-clinic-border-subtle">
              <Image
                src={settings.about_image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'}
                alt={`${settings.clinic_name || 'SkinGlow'} Clinic Facilities`}
                width={600}
                height={460}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Profile Section */}
      <section className="py-20 bg-clinic-bg-alt/60">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-md">
              <Image
                src={settings.doctor_image || settings.doctor_profile_image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"}
                alt={settings.doctor_name || 'Lead Specialist'}
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 items-start">
              <div className="badge">
                <Award size={14} />
                <span>Founder & Medical Director</span>
              </div>
              <h3 className="font-heading text-3xl font-bold text-primary">{settings.doctor_name || 'Dr. Aisha Sharma'}</h3>
              <p className="text-sm font-semibold text-accent-hover">
                {settings.doctor_qualifications || 'MD, DNB (Dermatology, Venereology & Leprosy), FAAD (USA)'}
              </p>

              <p className="text-sm sm:text-base text-clinic-muted leading-relaxed">
                {settings.doctor_bio || (
                  `${settings.doctor_name || 'Our lead physician'} is an acclaimed specialist with rigorous clinical practice, combining medical precision with an acute eye for natural proportion and patient-centric dermatology.`
                )}
              </p>
              <p className="text-sm sm:text-base text-primary italic leading-relaxed border-l-2 border-accent pl-4 my-1">
                &ldquo;My mission is never to change who you are, but to restore your innate glow and bolster your skin barrier with lasting vitality.&rdquo;
              </p>

              <div className="flex flex-col gap-2.5 my-3">
                <div className="flex items-center gap-2.5 text-sm text-clinic-text">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Fellow, American Academy of Dermatology (FAAD)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-clinic-text">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Life Member, Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-clinic-text">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Certified Specialist in Laser Physics & Aesthetic Injectables</span>
                </div>
              </div>

              <Link href="/book-appointment" className="btn btn-primary mt-2">
                <Calendar size={18} />
                <span>Book Consultation With {settings.doctor_name || 'Specialist'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Safety Standards */}
      <section className="py-20 bg-white">
        <div className="container">
          <SectionHeader
            badge="Advanced Technology"
            title="Gold-Standard Clinical Infrastructure"
            subtitle="We exclusively deploy globally accredited medical systems that optimize safety and therapeutic results."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-clinic-bg p-8 rounded-2xl border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                <Microscope size={24} />
              </div>
              <h4 className="font-heading text-lg font-bold text-primary mb-2">Triple-Wavelength Laser System</h4>
              <p className="text-sm text-clinic-muted leading-relaxed">
                Combines Alexandrite (755nm), Diode (808nm), and Nd:YAG (1064nm) wavelengths with -4°C sapphire cooling for virtually painless, permanent hair reduction across Indian skin.
              </p>
            </div>

            <div className="bg-clinic-bg p-8 rounded-2xl border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                <Zap size={24} />
              </div>
              <h4 className="font-heading text-lg font-bold text-primary mb-2">Q-Switched Nd:YAG Laser</h4>
              <p className="text-sm text-clinic-muted leading-relaxed">
                Nanosecond photo-acoustic energy targeting deep dermal melasma, tattoo ink, stubborn sun lentigines, and enlarged pores with no epidermal thermal injury.
              </p>
            </div>

            <div className="bg-clinic-bg p-8 rounded-2xl border border-clinic-border-subtle hover:border-accent/40 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-heading text-lg font-bold text-primary mb-2">Medical-Grade Hydradermabrasion</h4>
              <p className="text-sm text-clinic-muted leading-relaxed">
                Patented Vortex-Fusion technology delivering deep vacuum extractions, salicylic clarifying exfoliation, and targeted peptide antioxidant saturation in 45 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary-light to-primary text-white text-center">
        <div className="container">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-4">
              Begin Your Skin Transformation Today
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-8">
              Schedule your confidential diagnostic evaluation with {settings.doctor_name || 'our lead specialist'} and receive a customized clinical treatment plan.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/book-appointment" className="btn btn-primary">
                <Calendar size={18} />
                <span>Schedule Consultation</span>
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
    </div>
  );
}
