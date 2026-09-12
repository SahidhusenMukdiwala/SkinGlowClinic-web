import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold tracking-tight text-white">SkinGlow</h3>
                <span className="text-xs uppercase tracking-wider text-accent">Aesthetic & Dermatology</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Experience physician-led aesthetic care, advanced laser therapies, and bespoke dermatological solutions designed to nourish your skin and elevate your confidence.
            </p>
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
                <span>Suite 402, Royal Palms Avenue, Linking Road, Bandra West, Mumbai 400050</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-300">
                <Phone size={16} className="text-accent shrink-0" />
                <span>+91 98201 23456</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-300">
                <Mail size={16} className="text-accent shrink-0" />
                <span>contact@skinglow.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-300">
                <Clock size={16} className="text-accent shrink-0 mt-1" />
                <span>Mon - Sat: 10:00 AM - 07:30 PM<br />Sunday: By Appointment</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {currentYear} SkinGlow Clinic. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-accent transition-colors">Inquiries</Link>
            <Link href="/treatments" className="hover:text-accent transition-colors">Procedures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
