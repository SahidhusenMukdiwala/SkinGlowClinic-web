'use client';

import React from 'react';
import { Menu, LogOut, ShieldCheck, User } from 'lucide-react';

export default function AdminHeader({ adminUser, onToggleSidebar, onLogout, title }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-white/90 backdrop-blur-md border-b border-sand/60">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-serif text-lg sm:text-xl font-bold text-primary truncate">
          {title || 'Overview'}
        </h1>
      </div>

      {/* Admin User Profile & Sign Out */}
      <div className="flex items-center gap-3">
        {adminUser && (
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-cream border border-sand">
            {adminUser.profile_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={adminUser.profile_image}
                alt={adminUser.full_name || 'Admin'}
                className="w-7 h-7 rounded-full object-cover border border-accent/40 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                {adminUser.full_name ? adminUser.full_name.charAt(0) : 'A'}
              </div>
            )}
            <div className="text-left">
              <span className="block text-xs font-semibold text-primary leading-tight">
                {adminUser.full_name}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-accent font-medium leading-none">
                <ShieldCheck size={11} />
                <span>{adminUser.role === 0 ? 'Super Admin' : 'Admin'}</span>
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-semibold transition-colors"
          title="Sign Out"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
