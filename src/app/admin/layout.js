'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAdminProfileApi, adminLogoutApi } from '@/lib/api';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const verifiedRef = useRef(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('serviceToken');
    const storedUser = localStorage.getItem('currentUser');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (storedUser && !adminUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch {
        // ignore parse error
      }
    }

    if (verifiedRef.current) {
      setLoading(false);
      return;
    }

    verifiedRef.current = true;

    // Verify token with backend once
    getAdminProfileApi(token)
      .then((profile) => {
        setAdminUser(profile);
        localStorage.setItem('currentUser', JSON.stringify(profile));
        localStorage.setItem('role', String(profile.role));
        setLoading(false);
      })
      .catch(() => {
        adminLogoutApi().finally(() => {
          router.push('/admin/login');
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await adminLogoutApi();
    setAdminUser(null);
    router.push('/admin/login');
  };

  // If login page, render children directly without admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
        <Loader2 size={36} className="text-accent animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Verifying secure session...</p>
      </div>
    );
  }

  // Derive title from pathname
  let pageTitle = 'Dashboard Overview';
  if (pathname.includes('/admin/appointments')) pageTitle = 'Appointments Management';
  if (pathname.includes('/admin/inquiries')) pageTitle = 'Patient Inquiries Triage';
  if (pathname.includes('/admin/categories')) pageTitle = 'Categories Management';
  if (pathname.includes('/admin/treatments')) pageTitle = 'Treatments Catalog';
  if (pathname.includes('/admin/testimonials')) pageTitle = 'Patient Testimonials';
  if (pathname.includes('/admin/blogs')) pageTitle = 'Clinical Blogs & Insights';
  if (pathname.includes('/admin/settings')) pageTitle = 'Clinic Site Settings';

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <AdminHeader
          adminUser={adminUser}
          title={pageTitle}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
