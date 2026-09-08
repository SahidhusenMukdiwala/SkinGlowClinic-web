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
import styles from './page.module.css';

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
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <div className="badge">
              <Sparkles size={14} />
              <span>Physician-Led Medical Aesthetics</span>
            </div>

            <h1 className={styles.heroTitle}>
              Reveal Your Skin’s <br />
              <span className={styles.goldHighlight}>Radiant Perfection</span>
            </h1>

            <p className={styles.heroDescription}>
              {settings.about_text ||
                'At SkinGlow Clinic, we blend cutting-edge medical dermatology with artistic aesthetic techniques. Our bespoke treatments restore balance, enhance radiance, and celebrate your natural skin health.'}
            </p>

            <div className={styles.heroActions}>
              <Link href="/book-appointment" className="btn btn-primary">
                <Calendar size={18} />
                <span>Book Consultation</span>
              </Link>
              <Link href="/treatments" className="btn btn-secondary">
                <span>Explore Treatments</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10k+</span>
                <span className={styles.statLabel}>Happy Patients</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>15+</span>
                <span className={styles.statLabel}>Years Experience</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>99.4%</span>
                <span className={styles.statLabel}>Satisfaction Rate</span>
              </div>
            </div>
          </div>

          <div className={styles.cardPreview}>
            <Image
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
              alt="SkinGlow Clinic Treatment Room"
              width={600}
              height={480}
              priority
              className={styles.cardHeroImage}
            />
            <div className={styles.floatingCardOverlay}>
              <div className={styles.floatingCardIcon}>
                <Award size={22} />
              </div>
              <div className={styles.floatingCardText}>
                <h4>Accredited Clinical Excellence</h4>
                <p>US-FDA cleared technology & physician-led protocols</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Choose Us */}
      <section className={styles.whyChooseSection}>
        <div className="container">
          <SectionHeader
            badge="The SkinGlow Standard"
            title="Why Discerning Patients Entrust Their Skin to Us"
            subtitle="We distinguish ourselves through uncompromising clinical precision, ethical medical counsel, and artistic harmony."
          />

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ShieldCheck size={26} />
              </div>
              <h3 className={styles.featureTitle}>Physician-Led Diagnostics</h3>
              <p className={styles.featureText}>
                Every protocol is designed and performed under the direct oversight of Board-Certified dermatologists, guaranteeing medical safety and precision.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Microscope size={26} />
              </div>
              <h3 className={styles.featureTitle}>US-FDA Cleared Technology</h3>
              <p className={styles.featureText}>
                We invest in gold-standard laser platforms, micro-infusion delivery systems, and sterile pharmaceutical formulations with proven clinical efficacy.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Sparkles size={26} />
              </div>
              <h3 className={styles.featureTitle}>Bespoke Formulations</h3>
              <p className={styles.featureText}>
                No one-size-fits-all treatments. We customize peel strengths, laser wavelengths, and active serums tailored specifically to diverse Indian skin tones.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <HeartHandshake size={26} />
              </div>
              <h3 className={styles.featureTitle}>Natural Radiance Focus</h3>
              <p className={styles.featureText}>
                We celebrate and enhance your innate beauty. Our aesthetic interventions prioritize harmonious, subtle refinement rather than exaggerated results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Specialized Treatments / Services Overview */}
      <section className={styles.servicesSection}>
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
      <section className={styles.doctorSection}>
        <div className={`container ${styles.doctorGrid}`}>
          <div className={styles.doctorImageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80"
              alt={settings.doctor_name || 'Dr. Aisha Sharma'}
              width={500}
              height={520}
              className={styles.doctorImage}
            />
            <div className={styles.doctorBadge}>
              <span>Lead Consultant Dermatologist</span>
            </div>
          </div>

          <div className={styles.doctorContent}>
            <div className="badge">
              <Sparkles size={14} />
              <span>Meet Your Physician</span>
            </div>
            <h3>{settings.doctor_name || 'Dr. Aisha Sharma'}</h3>
            <p className={styles.doctorSub}>
              {settings.doctor_qualifications || 'MD, DNB (Dermatology, Venereology & Leprosy), FAAD (USA)'}
            </p>

            <p className={styles.doctorBio}>
              With over 15 years of clinical practice in medical and aesthetic dermatology, Dr. Sharma brings an empathetic, science-backed approach to skin health. Having trained extensively in India and the United States, she is renowned for her master mastery of laser physics and subtle facial rejuvenation.
            </p>

            <div className={styles.credentialsList}>
              <div className={styles.credentialItem}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Fellow of the American Academy of Dermatology (FAAD)</span>
              </div>
              <div className={styles.credentialItem}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Member of the Indian Association of Dermatologists (IADVL)</span>
              </div>
              <div className={styles.credentialItem}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Over 25,000 successful clinical & laser procedures performed</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
      </section>

      {/* 5. Patient Testimonials */}
      <section className={styles.testimonialsSection}>
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
      <section className={styles.faqSection}>
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
      <section className={styles.ctaBannerSection}>
        <div className={`container ${styles.ctaGrid}`}>
          <div className={styles.ctaText}>
            <h2>Ready to Experience Physician-Led Skincare?</h2>
            <p>
              Take the first step toward lasting skin health. Schedule your in-depth diagnostic consultation with Dr. Aisha Sharma today.
            </p>
          </div>

          <div className={styles.ctaActions}>
            <Link href="/book-appointment" className="btn btn-primary" style={{ background: '#C9A96E', color: '#1A1A2E' }}>
              <Calendar size={18} />
              <span>Book Appointment</span>
            </Link>
            <a href={`tel:${(settings.phone || '+919820123456').replace(/\s+/g, '')}`} className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }}>
              <PhoneCall size={16} />
              <span>Call Clinic</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
