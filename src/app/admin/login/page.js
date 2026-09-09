'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { adminLoginApi } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('serviceToken');
    const savedUser = localStorage.getItem('currentUser');

    if (savedToken && savedUser) {
      router.replace('/admin/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await adminLoginApi({
        identifier: identifier.trim(),
        password,
      });

      // Directly navigate to dashboard after successful login
      router.replace('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email, mobile number, or password.');
      setLoading(false);
    }
  };

  const isNumericIdentifier = /^\+?[0-9\s-]+$/.test(identifier.trim());

  if (checkingAuth) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-cream">
        <div className="w-full max-w-md p-12 text-center bg-white border border-sand/50 rounded-2xl shadow-xl">
          <Loader2 size={32} className="mx-auto animate-spin text-accent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Checking secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-cream">
      <div className="w-full max-w-md p-8 sm:p-10 bg-white border border-sand/50 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <div className="badge mx-auto mb-3">
            <Sparkles size={13} className="text-accent" />
            <span>SkinGlow Administration</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">Admin Portal</h1>
          <p className="text-sm text-slate-500">
            Sign in using your registered clinic email address or mobile number.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-identifier"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"
            >
              {isNumericIdentifier && identifier.length > 3 ? (
                <Phone size={15} className="text-accent" />
              ) : (
                <Mail size={15} className="text-accent" />
              )}
              <span>Email Address or Mobile Number</span>
            </label>

            <div className="relative flex items-center">
              {isNumericIdentifier && identifier.length > 3 ? (
                <Phone size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              ) : (
                <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              )}
              <input
                id="login-identifier"
                type="text"
                required
                placeholder="admin@skinglow.com or +91 6547892145"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                autoComplete="username"
              />
            </div>
            <span className="text-[11px] text-slate-400">
              Accepts registered admin email or mobile number (e.g. +91 6547892145)
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"
            >
              <Lock size={15} className="text-accent" />
              <span>Password</span>
            </label>

            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-primary transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2 py-3.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Admin Portal</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
