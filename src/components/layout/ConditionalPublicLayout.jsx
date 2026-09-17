'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/layout/WhatsAppFloat';
import { SettingsProvider } from '@/context/SettingsContext';

export default function ConditionalPublicLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname ? pathname.startsWith('/admin') : false;

  if (isAdmin) {
    return <main className="flex-1 flex flex-col min-h-screen">{children}</main>;
  }

  return (
    <SettingsProvider>
      <Navbar />
      <main className="flex-1 flex flex-col min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </SettingsProvider>
  );
}
