'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Inbox,
  Sparkles,
  ExternalLink,
  X,
  Layers,
  Star,
  FileText,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Appointments',
    href: '/admin/appointments',
    icon: CalendarCheck,
  },
  {
    label: 'Inquiries',
    href: '/admin/inquiries',
    icon: Inbox,
  },
];

const UPCOMING_ITEMS = [
  { label: 'Treatments', icon: Layers },
  { label: 'Testimonials', icon: Star },
  { label: 'Blogs', icon: FileText },
  { label: 'Site Settings', icon: Settings },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-primary text-white flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center text-primary shadow-gold">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white block leading-tight">
                SkinGlow
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent">
                Admin Console
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Core Operations
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-accent text-primary font-semibold shadow-gold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Content Management
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-accent font-semibold">
                Phase 5
              </span>
            </div>
            <div className="space-y-1 opacity-50">
              {UPCOMING_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                  >
                    <Icon size={18} className="text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-primary-light/50">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-accent hover:text-white bg-white/5 hover:bg-white/10 border border-accent/20 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </aside>
    </>
  );
}
