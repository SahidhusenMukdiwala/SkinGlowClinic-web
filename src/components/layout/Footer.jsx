'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const InstagramIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  const clinicName = settings?.clinic_name || 'SkinGlow Clinic';
  const clinicTagline = settings?.clinic_tagline || 'Aesthetic & Dermatology';
  const aboutNarrative =
    settings?.about_text ||
    'Experience physician-led aesthetic care, advanced laser therapies, and bespoke dermatological solutions designed to nourish your skin and elevate your confidence.';
  const address =
    settings?.address ||
    'Suite 402, Royal Palms Avenue, Linking Road, Bandra West, Mumbai 400050';
  const phone = settings?.phone || '+91 98201 23456';
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const email = settings?.email || 'contact@skinglow.com';
  const workingHours =
    settings?.working_hours ||
    'Mon - Sat: 10:00 AM - 07:30 PM | Sunday: By Appointment';

  const hasSocials =
    Boolean(settings?.instagram_url) ||
    Boolean(settings?.facebook_url) ||
    Boolean(settings?.youtube_url);

  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-xl font-bold tracking-tight text-white truncate">
                  {clinicName}
                </h3>
                <span className="text-xs uppercase tracking-wider text-accent block truncate">
                  {clinicTagline}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {aboutNarrative}
            </p>

            {/* Social Links */}
            {hasSocials && (
              <div className="flex items-center gap-2.5 pt-2">
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-accent hover:bg-white/20 transition-colors"
                  >
                    <InstagramIcon size={15} />
                  </a>
                )}
                {settings?.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-accent hover:bg-white/20 transition-colors"
                  >
                    <FacebookIcon size={15} />
                  </a>
                )}
                {settings?.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-accent hover:bg-white/20 transition-colors"
                  >
                    <YoutubeIcon size={15} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-accent mb-4 tracking-wide">Quick Links</h4>
            <ul className="flex flex-col gap-2 list-none">
              <li>
                <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Home
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Treatments
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> About Doctor
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Patient Reviews
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Skincare Blog
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Treatment Categories */}
          <div>
            <h4 className="font-heading text-base font-semibold text-accent mb-4 tracking-wide">Treatments</h4>
            <ul className="flex flex-col gap-2 list-none">
              <li>
                <Link href="/treatments?category=1" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Clinical Dermatology
                </Link>
              </li>
              <li>
                <Link href="/treatments?category=4" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Anti-Aging & Fillers
                </Link>
              </li>
              <li>
                <Link href="/treatments?category=3" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Laser Skin Rejuvenation
                </Link>
              </li>
              <li>
                <Link href="/treatments?category=2" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Hair Restoration
                </Link>
              </li>
              <li>
                <Link href="/treatments?category=5" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-accent transition-colors">
                  <ChevronRight size={14} className="text-accent/70" /> Body Contouring
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinic Contact & Hours */}
          <div>
            <h4 className="font-heading text-base font-semibold text-accent mb-4 tracking-wide">Visit Clinic</h4>
            <ul className="flex flex-col gap-3 list-none">
              <li className="flex items-start gap-2.5 text-sm text-gray-300">
                <MapPin size={16} className="text-accent shrink-0 mt-1" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-300">
                <Phone size={16} className="text-accent shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-accent transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-300">
                <Mail size={16} className="text-accent shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-300">
                <Clock size={16} className="text-accent shrink-0 mt-1" />
                <span className="leading-relaxed whitespace-pre-line">{workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {currentYear} {clinicName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-accent transition-colors">Inquiries</Link>
            <Link href="/treatments" className="hover:text-accent transition-colors">Procedures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
