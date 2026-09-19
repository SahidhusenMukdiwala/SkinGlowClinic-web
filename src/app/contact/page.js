import React from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
} from 'lucide-react';
import { fetchSettings } from '@/lib/api';
import ContactForm from '@/components/contact/ContactForm';
import SectionHeader from '@/components/common/SectionHeader';

const InstagramIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

export async function generateMetadata() {
  const settings = await fetchSettings();
  const clinicName = settings?.clinic_name || 'SkinGlow Clinic';
  return {
    title: `Contact & Clinic Location | ${clinicName}`,
    description: `Reach out to ${clinicName}. View clinic contact details, working hours, interactive inquiry form, and Google Maps location.`,
  };
}

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await fetchSettings();

  const cleanPhone = (settings.phone || '+91 98201 23456').replace(/\s+/g, '');
  const cleanEmail = settings.email || 'contact@skinglow.com';
  const cleanAddress = settings.address || 'Suite 402, Radiant Medical Enclave, Linking Road, Bandra West, Mumbai 400050';
  const cleanHours = settings.working_hours || 'Monday – Saturday: 10:00 AM – 7:30 PM | Sunday: By Appointment';
  const mapUrl = settings.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.045610815918!2d72.83151837599026!3d19.06173005241031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91130392bc7%3A0x63351d3b0b5e9f89!2sLinking%20Rd%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

  return (
    <div className="min-h-screen bg-clinic-bg pb-20">
      {/* Header Banner */}
      <header className="py-16 text-center bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle mb-16">
        <div className="container">
          <div className="badge mx-auto mb-3">
            <Sparkles size={14} />
            <span>Connect With Us</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-primary font-bold mb-4">
            Get In Touch With Our Clinical Team
          </h1>
          <p className="text-sm sm:text-base text-clinic-muted max-w-2xl mx-auto leading-relaxed">
            Whether you are booking your first consultation, inquiring about a specialized laser procedure, or seeking follow-up guidance, our team is here to assist you.
          </p>
        </div>
      </header>

      {/* Main Info + Form Section */}
      <section className="mb-20">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-clinic-border-subtle shadow-sm flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-heading text-base font-bold text-primary mb-1">Direct Clinical Phone</h4>
                <a href={`tel:${cleanPhone}`} className="text-sm font-semibold text-accent-hover hover:underline">
                  {settings.phone || '+91 98201 23456'}
                </a>
                <p className="text-xs text-clinic-muted mt-1">Call for immediate appointment booking</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-clinic-border-subtle shadow-sm flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-heading text-base font-bold text-primary mb-1">Email Inquiries</h4>
                <a href={`mailto:${cleanEmail}`} className="text-sm font-semibold text-accent-hover hover:underline">
                  {cleanEmail}
                </a>
                <p className="text-xs text-clinic-muted mt-1">Typically replies within 24 business hours</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-clinic-border-subtle shadow-sm flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-heading text-base font-bold text-primary mb-1">Clinic Address</h4>
                <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed">{cleanAddress}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-clinic-border-subtle shadow-sm flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-heading text-base font-bold text-primary mb-1">Operating Hours</h4>
                <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed">{cleanHours}</p>
              </div>
            </div>

            {/* Social Channels */}
            {(settings.instagram_url || settings.facebook_url || settings.youtube_url) && (
              <div className="bg-white p-5 rounded-2xl border border-clinic-border-subtle shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-primary mb-0.5">Connect on Social</h4>
                    <p className="text-xs text-clinic-muted">Follow our clinical updates & results</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                      title="Instagram"
                      className="w-10 h-10 rounded-xl bg-accent/10 text-primary hover:bg-accent hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 hover:shadow"
                    >
                      <InstagramIcon size={18} />
                    </a>
                  )}
                  {settings.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                      title="Facebook"
                      className="w-10 h-10 rounded-xl bg-accent/10 text-primary hover:bg-accent hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 hover:shadow"
                    >
                      <FacebookIcon size={18} />
                    </a>
                  )}
                  {settings.youtube_url && (
                    <a
                      href={settings.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Subscribe on YouTube"
                      title="YouTube"
                      className="w-10 h-10 rounded-xl bg-accent/10 text-primary hover:bg-accent hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 hover:shadow"
                    >
                      <YoutubeIcon size={18} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Google Maps Location Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <SectionHeader
            badge="Clinic Location"
            title="Find Our Clinic in Bandra West"
            subtitle="Conveniently situated on Linking Road, Mumbai, with dedicated valet parking and serene clinical interiors."
          />

          <div className="rounded-2xl overflow-hidden shadow-md border border-clinic-border-subtle h-96 w-full">
            <iframe
              src={mapUrl}
              title={`${settings?.clinic_name || 'SkinGlow Clinic'} Google Maps Location`}
              className="w-full h-full border-0"
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
