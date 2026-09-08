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
import styles from './about.module.css';

export const metadata = {
  title: 'About Our Clinic & Physicians | SkinGlow Clinic Mumbai',
  description: 'Learn about SkinGlow Clinic, our founding philosophy, Dr. Aisha Sharma, MD, and our state-of-the-art dermatological equipment in Mumbai.',
};

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await fetchSettings();

  return (
    <div className={styles.aboutPage}>
      {/* Header Banner */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className="badge" style={{ margin: '0 auto' }}>
            <Sparkles size={14} />
            <span>Our Clinical Heritage</span>
          </div>
          <h1 className={styles.pageTitle}>Science Meets Aesthetic Artistry</h1>
          <p className={styles.pageSubtitle}>
            Dedicated to empowering your skin health through rigorous evidence-based dermatology, compassionate physician counsel, and bespoke clinical solutions.
          </p>
        </div>
      </div>

      {/* Clinic Story & Philosophy */}
      <section className={styles.missionSection}>
        <div className={`container ${styles.missionGrid}`}>
          <div className={styles.missionContent}>
            <div className="badge">
              <Sparkles size={14} />
              <span>Our Philosophy</span>
            </div>
            <h2>Where Clinical Rigor Meets Bespoke Aesthetics</h2>
            <p className={styles.missionText}>
              {settings.about_text ||
                'Founded on the principle that true skin radiance is an outcome of profound cellular health, SkinGlow Clinic offers an elevated sanctuary for advanced dermatological care in Mumbai.'}
            </p>
            <p className={styles.missionText}>
              We depart from conventional beauty spas by providing purely physician-led medical interventions. Every laser pulse, chemical formulation, and injectable protocol is calibrated to your skin’s unique biological requirements.
            </p>

            <div className={styles.pillarsGrid}>
              <div className={styles.pillarCard}>
                <h4>Evidence-Based Protocols</h4>
                <p>Groundbreaking clinical therapies supported by international dermatological research.</p>
              </div>
              <div className={styles.pillarCard}>
                <h4>Transparent Medical Ethics</h4>
                <p>Honest clinical recommendations without unnecessary upsells or artificial guarantees.</p>
              </div>
              <div className={styles.pillarCard}>
                <h4>Bespoke Personalization</h4>
                <p>Custom treatments formulated exclusively for your specific Fitzpatrick skin profile.</p>
              </div>
              <div className={styles.pillarCard}>
                <h4>Hospital-Grade Hygiene</h4>
                <p>Sterile autoclave instruments and disposable medical consumables for every visit.</p>
              </div>
            </div>
          </div>

          <div className={styles.missionImageWrapper}>
            <Image
              src={settings.about_image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'}
              alt="SkinGlow Clinic Facilities"
              width={600}
              height={460}
              className={styles.missionImage}
            />
          </div>
        </div>
      </section>

      {/* Doctor Profile Section */}
      <section className={styles.doctorProfileSection}>
        <div className={`container ${styles.doctorGrid}`}>
          <div>
            <Image
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
              alt={settings.doctor_name || 'Dr. Aisha Sharma'}
              width={500}
              height={500}
              className={styles.doctorPhoto}
            />
          </div>

          <div className={styles.doctorDetails}>
            <div className="badge">
              <Award size={14} />
              <span>Founder & Medical Director</span>
            </div>
            <h3>{settings.doctor_name || 'Dr. Aisha Sharma'}</h3>
            <p className={styles.doctorQuals}>
              {settings.doctor_qualifications || 'MD, DNB (Dermatology, Venereology & Leprosy), FAAD (USA)'}
            </p>

            <p className={styles.doctorText}>
              Dr. Aisha Sharma is an acclaimed dermatologist with over 15 years of rigorous clinical practice. Having graduated with top honors and completed specialized fellowships in procedural laser surgery and aesthetic medicine in the US, Dr. Sharma combines medical precision with an acute eye for natural proportion.
            </p>
            <p className={styles.doctorText}>
              &ldquo;My mission is never to change who you are, but to restore your innate glow and bolster your skin barrier with lasting vitality.&rdquo;
            </p>

            <div className={styles.credentialsList}>
              <div className={styles.credItem}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Fellow, American Academy of Dermatology (FAAD)</span>
              </div>
              <div className={styles.credItem}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Life Member, Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)</span>
              </div>
              <div className={styles.credItem}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Certified Specialist in Laser Physics & Aesthetic Injectables</span>
              </div>
            </div>

            <Link href="/book-appointment" className="btn btn-primary">
              <Calendar size={18} />
              <span>Book Consultation With Dr. Sharma</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology & Safety Standards */}
      <section className={styles.techSection}>
        <div className="container">
          <SectionHeader
            badge="Advanced Technology"
            title="Gold-Standard Clinical Infrastructure"
            subtitle="We exclusively deploy globally accredited medical systems that optimize safety and therapeutic results."
          />

          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <Microscope size={24} />
              </div>
              <h4>Triple-Wavelength Laser System</h4>
              <p>
                Combines Alexandrite (755nm), Diode (808nm), and Nd:YAG (1064nm) wavelengths with -4°C sapphire cooling for virtually painless, permanent hair reduction across Indian skin.
              </p>
            </div>

            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <Zap size={24} />
              </div>
              <h4>Q-Switched Nd:YAG Laser</h4>
              <p>
                Nanosecond photo-acoustic energy targeting deep dermal melasma, tattoo ink, stubborn sun lentigines, and enlarged pores with no epidermal thermal injury.
              </p>
            </div>

            <div className={styles.techCard}>
              <div className={styles.techIcon}>
                <ShieldCheck size={24} />
              </div>
              <h4>Medical-Grade Hydradermabrasion</h4>
              <p>
                Patented Vortex-Fusion technology delivering deep vacuum extractions, salicylic clarifying exfoliation, and targeted peptide antioxidant saturation in 45 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>Begin Your Skin Transformation Today</h2>
            <p>
              Schedule your confidential diagnostic evaluation with Dr. Aisha Sharma and receive a customized clinical treatment plan.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/book-appointment" className="btn btn-primary" style={{ background: '#C9A96E', color: '#1A1A2E' }}>
                <Calendar size={18} />
                <span>Schedule Consultation</span>
              </Link>
              <a href={`tel:${(settings.phone || '+919820123456').replace(/\s+/g, '')}`} className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }}>
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
