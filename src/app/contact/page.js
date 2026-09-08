import React from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { fetchSettings } from '@/lib/api';
import ContactForm from '@/components/contact/ContactForm';
import SectionHeader from '@/components/common/SectionHeader';
import styles from './contact.module.css';

export const metadata = {
  title: 'Contact & Clinic Location | SkinGlow Clinic Mumbai',
  description: 'Reach out to SkinGlow Clinic in Bandra West, Mumbai. View clinic contact details, working hours, interactive inquiry form, and Google Maps location.',
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await fetchSettings();

  const cleanPhone = (settings.phone || '+91 98201 23456').replace(/\s+/g, '');
  const cleanEmail = settings.email || 'contact@skinglow.com';
  const cleanAddress = settings.address || 'Suite 402, Radiant Medical Enclave, Linking Road, Bandra West, Mumbai 400050';
  const cleanHours = settings.working_hours || 'Monday – Saturday: 10:00 AM – 7:30 PM | Sunday: By Appointment';
  const mapUrl = settings.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.045610815918!2d72.83151837599026!3d19.06173005241031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91130392bc7%3A0x63351d3b0b5e9f89!2sLinking%20Rd%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

  return (
    <div className={styles.contactPage}>
      {/* Header Banner */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className="badge" style={{ margin: '0 auto' }}>
            <Sparkles size={14} />
            <span>Connect With Us</span>
          </div>
          <h1 className={styles.pageTitle}>Get In Touch With Our Clinical Team</h1>
          <p className={styles.pageSubtitle}>
            Whether you are booking your first consultation, inquiring about a specialized laser procedure, or seeking follow-up guidance, our team is here to assist you.
          </p>
        </div>
      </div>

      {/* Main Info + Form Section */}
      <section className={styles.mainSection}>
        <div className={`container ${styles.contactGrid}`}>
          {/* Left Column: Direct Info Cards */}
          <div className={styles.infoColumn}>
            <div className={styles.cardsGrid}>
              {/* Phone */}
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <Phone size={22} />
                </div>
                <div className={styles.infoContent}>
                  <h4>Direct Clinical Phone</h4>
                  <p>
                    <a href={`tel:${cleanPhone}`} className={styles.infoLink}>
                      {settings.phone || '+91 98201 23456'}
                    </a>
                  </p>
                  <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Call for immediate appointment booking</p>
                </div>
              </div>

              {/* Email */}
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <Mail size={22} />
                </div>
                <div className={styles.infoContent}>
                  <h4>Email Inquiries</h4>
                  <p>
                    <a href={`mailto:${cleanEmail}`} className={styles.infoLink}>
                      {cleanEmail}
                    </a>
                  </p>
                  <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Typically replies within 24 business hours</p>
                </div>
              </div>

              {/* Address */}
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <MapPin size={22} />
                </div>
                <div className={styles.infoContent}>
                  <h4>Clinic Address</h4>
                  <p>{cleanAddress}</p>
                </div>
              </div>

              {/* Hours */}
              <div className={styles.infoCard}>
                <div className={styles.iconWrapper}>
                  <Clock size={22} />
                </div>
                <div className={styles.infoContent}>
                  <h4>Operating Hours</h4>
                  <p>{cleanHours}</p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className={styles.socialBox}>
              <h4>Connect on Social</h4>
              <div className={styles.socialLinks}>
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    Instagram ↗
                  </a>
                )}
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    Facebook ↗
                  </a>
                )}
                {settings.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    YouTube ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <ContactForm />
        </div>
      </section>

      {/* Google Maps Location Section */}
      <section className={styles.mapSection}>
        <div className="container">
          <SectionHeader
            badge="Clinic Location"
            title="Find Our Clinic in Bandra West"
            subtitle="Conveniently situated on Linking Road, Mumbai, with dedicated valet parking and serene clinical interiors."
          />

          <div className={styles.mapContainer}>
            <iframe
              src={mapUrl}
              title="SkinGlow Clinic Google Maps Location"
              className={styles.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
