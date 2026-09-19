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
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { getCurrentUser, logoutApi } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';
import { isAdminUser } from '@/lib/constants';

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
  const { settings } = useSettings();
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

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutApi();
    } finally {
      setCurrentUser(null);
      setLoggingOut(false);
      setShowLogoutModal(false);
      router.push('/');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isUserAdmin = isAdminUser(currentUser);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-primary/10 transition-all">
        <div className="container h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center py-1 group cursor-pointer" onClick={closeMobileMenu}>
          <img
            src="/skin-glow-logo-transparent.png"
            alt={settings?.clinic_name || 'SkinGlow Clinic'}
            className="h-14 sm:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
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
                      isUserAdmin ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isUserAdmin ? 'Administrator' : 'Patient'}
                    </span>
                  </div>

                  <div className="py-1">
                    {isUserAdmin ? (
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
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-primary hover:bg-sand/30 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream/98 backdrop-blur-xl border-t border-sand/40 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 text-base font-medium transition-colors ${
                    active ? 'text-accent font-bold' : 'text-slate-700 hover:text-accent'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
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
              onClick={handleLogoutClick}
              className="mt-2 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-center cursor-pointer"
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

    {/* Sign Out Confirmation Modal - Rendered outside header to prevent backdrop-filter containing block trap */}
    {showLogoutModal && (
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={() => !loggingOut && setShowLogoutModal(false)}
      >
        <div 
          className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <LogOut size={24} />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-serif font-bold text-primary">
              Sign Out Confirmation
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to sign out of your account?
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={loggingOut}
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loggingOut}
              onClick={handleConfirmLogout}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loggingOut ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Signing Out...</span>
                </>
              ) : (
                <>
                  <LogOut size={14} />
                  <span>Okay, Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}
