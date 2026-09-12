'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?redirect=/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-cream">
      <div className="w-full max-w-md p-10 text-center bg-white border border-sand/50 rounded-3xl shadow-xl">
        <Loader2 size={32} className="mx-auto animate-spin text-accent" />
        <p className="mt-4 text-sm font-medium text-slate-500">Redirecting to secure login portal...</p>
      </div>
    </div>
  );
}
