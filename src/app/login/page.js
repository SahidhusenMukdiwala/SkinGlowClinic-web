'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { loginApi, registerCustomerApi, getCurrentUser, getUserRole } from '@/lib/api';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    const role = getUserRole();

    if (user && role !== null) {
      if (role === 0 || role === 1) {
        router.replace('/admin/dashboard');
      } else {
        router.replace(redirectTarget || '/book-appointment');
      }
    } else {
      setCheckingAuth(false);
    }
  }, [router, redirectTarget]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = await loginApi({
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      });

      const user = data?.user;
      if (user?.role === 0 || user?.role === 1) {
        router.replace('/admin/dashboard');
      } else {
        router.replace(redirectTarget || '/book-appointment');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const cleanMobile = regMobile.trim().replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      await registerCustomerApi({
        full_name: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        mobile: `+91 ${cleanMobile}`,
        password: regPassword,
      });

      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.replace(redirectTarget || '/book-appointment');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
      setLoading(false);
    }
  };

  const isNumericLogin = /^\+?[0-9\s-]+$/.test(loginIdentifier.trim());

  if (checkingAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-cream">
        <div className="w-full max-w-md p-10 text-center bg-white border border-sand/50 rounded-3xl shadow-xl">
          <Loader2 size={32} className="mx-auto animate-spin text-accent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Checking secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-cream">
      <div className="w-full max-w-lg p-8 sm:p-10 bg-white border border-sand/60 rounded-3xl shadow-xl">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="badge mx-auto mb-3">
            <Sparkles size={14} className="text-accent" />
            <span>SkinGlow Clinic Portal</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join SkinGlow Clinic'}
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {mode === 'login'
              ? 'Sign in to confirm appointments or access your clinical dashboard.'
              : 'Create a personal patient profile to easily schedule and manage treatments.'}
          </p>
        </div>

        {/* Auth Tabs Toggle */}
        <div className="flex rounded-2xl bg-sand/30 p-1 mb-6 border border-sand/40">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-primary'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm animate-fadeIn">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-identifier"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"
              >
                {isNumericLogin && loginIdentifier.length > 3 ? (
                  <Phone size={14} className="text-accent" />
                ) : (
                  <Mail size={14} className="text-accent" />
                )}
                <span>Email Address or Mobile Number</span>
              </label>
              <div className="relative flex items-center">
                {isNumericLogin && loginIdentifier.length > 3 ? (
                  <Phone size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                ) : (
                  <Mail size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                )}
                <input
                  id="login-identifier"
                  type="text"
                  required
                  placeholder="name@email.com or +91 9820123456"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"
              >
                <Lock size={14} className="text-accent" />
                <span>Password</span>
              </label>
              <div className="relative flex items-center">
                <Lock size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-primary transition-colors p-1"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-accent font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin text-accent" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center mt-3 text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-accent font-semibold hover:underline"
              >
                Create an account
              </button>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="reg-name"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
              >
                <User size={13} className="text-accent" />
                <span>Full Name</span>
              </label>
              <div className="relative flex items-center">
                <User size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="reg-email"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  <Mail size={13} className="text-accent" />
                  <span>Email Address</span>
                </label>
                <div className="relative flex items-center">
                  <Mail size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="reg-mobile"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  <Phone size={13} className="text-accent" />
                  <span>Mobile Number</span>
                </label>
                <div className="flex items-center rounded-xl border border-sand/70 bg-cream/30 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent transition-all overflow-hidden">
                  <span className="px-3.5 py-2.5 bg-sand/30 border-r border-sand/70 text-xs font-bold text-primary select-none shrink-0 tracking-wide">
                    +91
                  </span>
                  <input
                    id="reg-mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    placeholder="9820123456"
                    value={regMobile}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setRegMobile(digits);
                    }}
                    className="w-full px-3.5 py-2.5 bg-transparent text-sm text-primary placeholder-slate-400 focus:outline-none"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="reg-password"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  <Lock size={13} className="text-accent" />
                  <span>Password</span>
                </label>
                <div className="relative flex items-center">
                  <Lock size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-11 pr-9 py-2.5 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 text-slate-400 hover:text-primary transition-colors p-1"
                  >
                    {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="reg-confirm"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  <Lock size={13} className="text-accent" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative flex items-center">
                  <Lock size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    id="reg-confirm"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-accent font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin text-accent" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center mt-2 text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-accent font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-cream">
          <Loader2 size={32} className="animate-spin text-accent" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
