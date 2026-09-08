import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <div className={styles.brandIcon}>
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className={styles.brandTitle}>SkinGlow</h3>
                <span className={styles.brandTagline}>Aesthetic & Dermatology</span>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Experience physician-led aesthetic care, advanced laser therapies, and bespoke dermatological solutions designed to nourish your skin and elevate your confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link href="/"><ChevronRight size={14} /> Home</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/treatments"><ChevronRight size={14} /> Treatments</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/about"><ChevronRight size={14} /> About Doctor</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/testimonials"><ChevronRight size={14} /> Patient Reviews</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/blogs"><ChevronRight size={14} /> Skincare Blog</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/book-appointment"><ChevronRight size={14} /> Book Appointment</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className={styles.colTitle}>Treatments</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link href="/treatments?category=1"><ChevronRight size={14} /> Clinical Dermatology</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/treatments?category=4"><ChevronRight size={14} /> Anti-Aging & Fillers</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/treatments?category=3"><ChevronRight size={14} /> Laser Skin Rejuvenation</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/treatments?category=2"><ChevronRight size={14} /> Hair Restoration</Link>
              </li>
              <li className={styles.linkItem}>
                <Link href="/treatments?category=5"><ChevronRight size={14} /> Body Contouring</Link>
              </li>
            </ul>
          </div>

          {/* Clinic Contact & Hours */}
          <div>
            <h4 className={styles.colTitle}>Visit Clinic</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin size={18} className={styles.contactIcon} />
                <span>Suite 402, Royal Palms Avenue, Linking Road, Bandra West, Mumbai 400050</span>
              </li>
              <li className={styles.contactItem}>
                <Phone size={18} className={styles.contactIcon} />
                <span>+91 98765 43210</span>
              </li>
              <li className={styles.contactItem}>
                <Mail size={18} className={styles.contactIcon} />
                <span>contact@skinglowclinic.com</span>
              </li>
              <li className={styles.contactItem}>
                <Clock size={18} className={styles.contactIcon} />
                <span>Mon - Sat: 10:00 AM - 08:00 PM<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p>© {currentYear} SkinGlow Clinic. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/contact">Inquiries</Link>
            <Link href="/admin/login">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
