'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Menu, 
  X, 
  Calendar, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { getCurrentUser, logoutApi } from '@/lib/api';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Treatments', href: '/treatments' },
  { label: 'About', href: '/about' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);

  const isLinkActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Sync auth state on mount and on custom 'auth-changed' event
  useEffect(() => {
    const checkUser = () => {
      setCurrentUser(getCurrentUser());
    };

    checkUser();

    window.addEventListener('auth-changed', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('auth-changed', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logoutApi();
    setCurrentUser(null);
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isAdminUser = currentUser && (currentUser.role === 0 || currentUser.role === 1);

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-primary/10 transition-all">
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
          <ul className="flex items-center gap-1.5 lg:gap-2 list-none p-1 rounded-full bg-sand/20 border border-sand/30">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={true}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 ease-out flex items-center justify-center ${
                      active
                        ? 'bg-white text-primary font-semibold shadow-xs'
                        : 'text-clinic-text hover:text-accent hover:bg-white/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-accent rounded-full animate-fadeIn" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action CTA & User Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Book Appointment CTA */}
          <Link 
            href="/book-appointment" 
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent to-accent-soft hover:from-accent-hover hover:to-accent text-primary font-semibold text-sm shadow-gold transition-all hover:-translate-y-0.5"
          >
            <Calendar size={16} />
            <span>Book Appointment</span>
          </Link>

          {/* Right Hand Side: Login / Account Menu */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(prev => !prev)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/20 bg-white/80 hover:bg-white text-primary text-sm font-medium transition-all shadow-sm"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                  {currentUser.full_name ? currentUser.full_name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline max-w-[110px] truncate text-xs font-semibold">
                  {currentUser.full_name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-sand/60 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-sand/40">
                    <p className="text-xs font-bold text-primary truncate">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isAdminUser ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isAdminUser ? 'Administrator' : 'Patient'}
                    </span>
                  </div>

                  <div className="py-1">
                    {isAdminUser ? (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-primary hover:bg-sand/20 transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-accent" />
                        <span>Admin Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        href="/book-appointment"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-primary hover:bg-sand/20 transition-colors"
                      >
                        <Calendar size={15} className="text-accent" />
                        <span>Book Consultation</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-sand/40 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary/20 text-primary hover:border-accent hover:text-accent font-medium text-sm transition-all hover:bg-white/80 shadow-xs"
            >
              <User size={15} />
              <span>Login</span>
            </Link>
          )}

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
        <div className="md:hidden flex flex-col gap-2.5 px-6 py-5 bg-[#FDFBF7] border-b border-primary/10 shadow-lg animate-fadeIn">
          {currentUser && (
            <div className="p-3 mb-2 rounded-xl bg-sand/20 border border-sand/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-primary">{currentUser.full_name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/20 text-primary">
                {isAdminUser ? 'Admin' : 'Patient'}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1 my-1">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={closeMobileMenu}
                  className={`py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all duration-150 flex items-center justify-between ${
                    active
                      ? 'bg-primary text-accent font-semibold shadow-xs'
                      : 'text-clinic-text hover:text-accent hover:bg-sand/20'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </Link>
              );
            })}
          </div>

          {isAdminUser && (
            <Link href="/admin/dashboard" className="py-2 text-base font-semibold text-accent hover:underline flex items-center gap-2" onClick={closeMobileMenu}>
              <ShieldCheck size={18} />
              <span>Admin Portal</span>
            </Link>
          )}

          <Link href="/book-appointment" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-accent to-accent-soft text-primary font-semibold text-sm shadow-gold mt-2" onClick={closeMobileMenu}>
            <Calendar size={16} />
            <span>Book Appointment</span>
          </Link>

          {currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-center"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 text-primary font-medium text-sm mt-2 hover:bg-white"
              onClick={closeMobileMenu}
            >
              <User size={16} />
              <span>Login / Create Account</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

