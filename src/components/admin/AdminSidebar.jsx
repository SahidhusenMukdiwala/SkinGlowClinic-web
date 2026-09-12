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
  Tags,
} from 'lucide-react';

const OPERATIONS_NAV = [
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

const CONTENT_NAV = [
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: Tags,
  },
  {
    label: 'Treatments',
    href: '/admin/treatments',
    icon: Layers,
  },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    icon: Star,
  },
  {
    label: 'Blogs & Insights',
    href: '/admin/blogs',
    icon: FileText,
  },
  {
    label: 'Site Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  const renderLink = (item) => {
    const Icon = item.icon;
    const isActive =
      pathname === item.href ||
      (item.href !== '/admin/dashboard' && pathname.startsWith(`${item.href}/`)) ||
      (item.href !== '/admin/dashboard' && pathname === item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={true}
        onClick={() => {
          if (onClose) onClose();
        }}
        className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ease-out cursor-pointer select-none ${isActive
            ? 'bg-accent text-primary font-semibold shadow-gold'
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon
          size={18}
          className={`transition-transform duration-150 group-hover:scale-110 ${
            isActive ? 'text-primary' : 'text-slate-400 group-hover:text-white'
          }`}
        />
        <span className="flex-1">{item.label}</span>
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </Link>
    );
  };

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-primary text-white flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
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
              {OPERATIONS_NAV.map(renderLink)}
            </nav>
          </div>

          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Content Management
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                Active
              </span>
            </div>
            <nav className="space-y-1">
              {CONTENT_NAV.map(renderLink)}
            </nav>
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
