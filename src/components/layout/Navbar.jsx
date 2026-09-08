'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, Calendar } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        {/* Brand Logo */}
        <Link href="/" className={styles.brand} onClick={closeMobileMenu}>
          <div className={styles.brandIcon}>
            <Sparkles size={20} strokeWidth={2.2} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>SkinGlow</span>
            {/* <span className={styles.brandSubtitle}>Aesthetic Clinic</span> */}
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className={styles.navLinks}>
            <li><Link href="/" className={styles.navLink}>Home</Link></li>
            <li><Link href="/treatments" className={styles.navLink}>Treatments</Link></li>
            <li><Link href="/about" className={styles.navLink}>About</Link></li>
            <li><Link href="/testimonials" className={styles.navLink}>Testimonials</Link></li>
            <li><Link href="/blogs" className={styles.navLink}>Blogs</Link></li>
            <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
          </ul>
        </nav>

        {/* Action CTA */}
        <div className={styles.ctaWrapper}>
          <Link href="/book-appointment" className={`btn btn-primary ${styles.bookBtn}`}>
            <Calendar size={16} />
            <span>Book Appointment</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className={styles.mobileToggle} 
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.mobileNavLink} onClick={closeMobileMenu}>Home</Link>
        <Link href="/treatments" className={styles.mobileNavLink} onClick={closeMobileMenu}>Treatments</Link>
        <Link href="/about" className={styles.mobileNavLink} onClick={closeMobileMenu}>About Doctor & Clinic</Link>
        <Link href="/testimonials" className={styles.mobileNavLink} onClick={closeMobileMenu}>Patient Reviews</Link>
        <Link href="/blogs" className={styles.mobileNavLink} onClick={closeMobileMenu}>Skincare Insights</Link>
        <Link href="/contact" className={styles.mobileNavLink} onClick={closeMobileMenu}>Contact & Inquiry</Link>
        <Link href="/book-appointment" className="btn btn-primary" onClick={closeMobileMenu} style={{ marginTop: '0.5rem' }}>
          <Calendar size={16} />
          <span>Book Appointment</span>
        </Link>
      </div>
    </header>
  );
}
