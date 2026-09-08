'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  User,
} from 'lucide-react';
import { adminLoginApi, getAdminProfileApi } from '@/lib/api';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedToken = localStorage.getItem('skinglow_admin_token');
    const savedUser = localStorage.getItem('skinglow_admin_user');
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify with server profile
        getAdminProfileApi(savedToken)
          .then(profile => {
            setUser(profile);
            localStorage.setItem('skinglow_admin_user', JSON.stringify(profile));
          })
          .catch(() => {
            // Token expired or invalid
            handleLogout();
          });
      } catch {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await adminLoginApi({
        identifier: identifier.trim(),
        password,
      });

      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('skinglow_admin_token', data.access_token);
        localStorage.setItem('skinglow_admin_user', JSON.stringify(data.user));
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email, mobile number, or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skinglow_admin_token');
      localStorage.removeItem('skinglow_admin_user');
    }
    setIdentifier('');
    setPassword('');
  };

  const isNumericIdentifier = /^\+?[0-9\s-]+$/.test(identifier.trim());

  if (!isClient) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loginCard} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Loader2 size={32} className={styles.spinner} style={{ color: 'var(--color-accent)', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {user ? (
        /* Authenticated View */
        <div className={styles.authenticatedCard}>
          <div className={styles.authBadge}>
            <CheckCircle2 size={16} />
            <span>Authenticated Session Active</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
            Welcome, {user.full_name}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            You are logged into the SkinGlow Clinic management console.
          </p>

          <div className={styles.profileDetails}>
            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>
                <User size={15} />
                <span>Full Name</span>
              </span>
              <span className={styles.profileVal}>{user.full_name}</span>
            </div>

            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>
                <Mail size={15} />
                <span>Admin Email</span>
              </span>
              <span className={styles.profileVal}>{user.email}</span>
            </div>

            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>
                <Phone size={15} />
                <span>Admin Mobile</span>
              </span>
              <span className={styles.profileVal} style={{ color: 'var(--color-accent)' }}>
                {user.mobile || 'Not set'}
              </span>
            </div>

            <div className={styles.profileRow}>
              <span className={styles.profileLabel}>
                <ShieldCheck size={15} />
                <span>Privilege Level</span>
              </span>
              <span className="badge" style={{ background: 'var(--color-primary)', color: 'var(--color-white)' }}>
                {user.role === 0 ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>

          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        /* Login Form View */
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <div className="badge" style={{ margin: '0 auto' }}>
              <Sparkles size={13} />
              <span>SkinGlow Administration</span>
            </div>
            <h1>Admin Portal</h1>
            <p className={styles.cardSubtitle}>
              Sign in using your registered clinic email address or mobile number.
            </p>
          </div>

          {errorMsg && (
            <div className={styles.alertError}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="login-identifier" className={styles.label}>
                {isNumericIdentifier && identifier.length > 3 ? (
                  <Phone size={15} color="var(--color-accent)" />
                ) : (
                  <Mail size={15} color="var(--color-accent)" />
                )}
                <span>Email Address or Mobile Number</span>
              </label>

              <div className={styles.inputWrapper}>
                {isNumericIdentifier && identifier.length > 3 ? (
                  <Phone size={18} className={styles.inputIcon} />
                ) : (
                  <Mail size={18} className={styles.inputIcon} />
                )}
                <input
                  id="login-identifier"
                  type="text"
                  required
                  placeholder="admin@skinglow.com or +91 6547892145"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={styles.input}
                  autoComplete="username"
                />
              </div>
              <span className={styles.hintText}>
                Accepts registered admin email or mobile number (e.g. +91 6547892145)
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-password" className={styles.label}>
                <Lock size={15} color="var(--color-accent)" />
                <span>Password</span>
              </label>

              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePasswordBtn}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary ${styles.submitBtn}`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className={styles.spinner} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Admin Portal</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
