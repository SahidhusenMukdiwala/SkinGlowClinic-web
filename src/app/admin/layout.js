'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';
import { getAdminProfileApi, adminLogoutApi } from '@/lib/api';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
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
      router.push('/login?redirect=/admin/dashboard');
      return;
    }

    if (storedUser && !adminUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role !== 0 && parsed.role !== 1) {
          router.replace('/login?redirect=/admin/dashboard');
          return;
        }
        setAdminUser(parsed);
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
        if (profile.role !== 0 && profile.role !== 1) {
          router.replace('/login?redirect=/admin/dashboard');
          return;
        }
        setAdminUser(profile);
        localStorage.setItem('currentUser', JSON.stringify(profile));
        localStorage.setItem('role', String(profile.role));
        setLoading(false);
      })
      .catch(() => {
        adminLogoutApi().finally(() => {
          router.push('/login?redirect=/admin/dashboard');
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginPage, router]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await adminLogoutApi();
    } finally {
      setAdminUser(null);
      setLoggingOut(false);
      setShowLogoutModal(false);
      router.push('/admin/login');
    }
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
  if (pathname.includes('/admin/customers')) pageTitle = 'Customer Accounts Management';
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
          onLogout={handleLogoutClick}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut size={24} />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-primary">
                Sign Out Confirmation
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to sign out of the Admin Console?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition disabled:opacity-50"
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
                    {/* <LogOut size={14} /> */}
                    <span>Okay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
