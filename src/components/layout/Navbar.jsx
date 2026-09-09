'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, Calendar } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-primary/10 transition-all">
      <div className="container h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" onClick={closeMobileMenu}>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-accent group-hover:scale-105 transition-transform shadow-sm">
            <Sparkles size={18} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-2xl font-bold tracking-tight text-primary">SkinGlow</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8 list-none">
            <li><Link href="/" className="text-sm font-medium text-clinic-text hover:text-accent transition-colors">Home</Link></li>
            <li><Link href="/treatments" className="text-sm font-medium text-clinic-text hover:text-accent transition-colors">Treatments</Link></li>
            <li><Link href="/about" className="text-sm font-medium text-clinic-text hover:text-accent transition-colors">About</Link></li>
            <li><Link href="/testimonials" className="text-sm font-medium text-clinic-text hover:text-accent transition-colors">Testimonials</Link></li>
            <li><Link href="/blogs" className="text-sm font-medium text-clinic-text hover:text-accent transition-colors">Blogs</Link></li>
            <li><Link href="/contact" className="text-sm font-medium text-clinic-text hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </nav>

        {/* Action CTA & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Link href="/book-appointment" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent to-accent-soft hover:from-accent-hover hover:to-accent text-primary font-semibold text-sm shadow-gold transition-all hover:-translate-y-0.5">
            <Calendar size={16} />
            <span>Book Appointment</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className="md:hidden p-2 rounded-lg text-primary hover:bg-clinic-bg-alt transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-6 py-5 bg-[#FDFBF7] border-b border-primary/10 shadow-lg animate-fadeIn">
          <Link href="/" className="py-2 text-base font-medium text-clinic-text hover:text-accent transition-colors" onClick={closeMobileMenu}>Home</Link>
          <Link href="/treatments" className="py-2 text-base font-medium text-clinic-text hover:text-accent transition-colors" onClick={closeMobileMenu}>Treatments</Link>
          <Link href="/about" className="py-2 text-base font-medium text-clinic-text hover:text-accent transition-colors" onClick={closeMobileMenu}>About Doctor & Clinic</Link>
          <Link href="/testimonials" className="py-2 text-base font-medium text-clinic-text hover:text-accent transition-colors" onClick={closeMobileMenu}>Patient Reviews</Link>
          <Link href="/blogs" className="py-2 text-base font-medium text-clinic-text hover:text-accent transition-colors" onClick={closeMobileMenu}>Skincare Insights</Link>
          <Link href="/contact" className="py-2 text-base font-medium text-clinic-text hover:text-accent transition-colors" onClick={closeMobileMenu}>Contact & Inquiry</Link>
          <Link href="/book-appointment" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-accent to-accent-soft text-primary font-semibold text-sm shadow-gold mt-2" onClick={closeMobileMenu}>
            <Calendar size={16} />
            <span>Book Appointment</span>
          </Link>
        </div>
      )}
    </header>
  );
}
