'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Inbox,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { fetchDashboardStatsApi } from '@/lib/api';

const STATUS_CONFIG = {
  0: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  1: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  2: { label: 'Completed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  3: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;
      const data = await fetchDashboardStatsApi(token);
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const kpis = stats?.kpis || {
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    unreadInquiries: 0,
    totalInquiries: 0,
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-primary text-xs font-semibold mb-1">
            <Sparkles size={13} className="text-accent" />
            <span>Clinical Operations Hub</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Executive Dashboard
          </h2>
          <p className="text-slate-500 text-sm">
            Real-time consultation bookings, patient inquiries, and daily clinic activity.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Appointments */}
        <div className="p-6 rounded-2xl bg-white border border-sand/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Bookings
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <CalendarCheck size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-primary">
              {loading ? '—' : kpis.totalAppointments}
            </div>
            <p className="text-xs text-slate-500 mt-1">All recorded patient appointments</p>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="p-6 rounded-2xl bg-white border border-sand/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today&apos;s Schedule
            </span>
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-primary">
              {loading ? '—' : kpis.todayAppointments}
            </div>
            <p className="text-xs text-slate-500 mt-1">Consultations scheduled for today</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="p-6 rounded-2xl bg-white border border-sand/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Pending Review
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-amber-600">
              {loading ? '—' : kpis.pendingAppointments}
            </div>
            <p className="text-xs text-slate-500 mt-1">Awaiting clinic staff confirmation</p>
          </div>
        </div>

        {/* Unread Inquiries */}
        <div className="p-6 rounded-2xl bg-white border border-sand/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose">
              Unread Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose/15 text-rose flex items-center justify-center">
              <Inbox size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-primary">
              {loading ? '—' : kpis.unreadInquiries}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Out of {kpis.totalInquiries} total messages received
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Activity Section: Pending Appointments & Unread Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Appointments Panel */}
        <div className="p-6 rounded-2xl bg-white border border-sand/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand/40">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-primary">Pending Appointments</h3>
                  {kpis.pendingAppointments > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 font-mono">
                      {kpis.pendingAppointments} new
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Awaiting clinic staff review & confirmation
                </p>
              </div>

              <Link
                href="/admin/appointments"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-primary transition-colors"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-xs text-slate-400 py-8 text-center">Loading pending appointments...</p>
              ) : !stats?.pendingAppointments || stats.pendingAppointments.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">All Appointments Reviewed</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    There are no pending consultation requests awaiting confirmation.
                  </p>
                </div>
              ) : (
                stats.pendingAppointments.map((appt) => {
                  const status = STATUS_CONFIG[appt.status] || STATUS_CONFIG[0];
                  const dateObj = new Date(appt.preferred_date_time);
                  const dateFormatted = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Pending Date';

                  return (
                    <Link
                      key={appt.id}
                      href="/admin/appointments"
                      className="p-4 rounded-xl bg-cream/40 border border-sand/50 hover:border-accent/40 hover:bg-cream/60 transition-all flex items-center justify-between gap-4 block"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-primary truncate">
                            {appt.patient_name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            #SG-{String(appt.id).padStart(5, '0')}
                          </span>
                        </div>
                        <p className="text-xs text-accent font-medium truncate mt-0.5">
                          {appt.treatment?.title || 'General Consultation'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{dateFormatted}</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${status.bg} ${status.text} ${status.border}`}
                      >
                        {status.label}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Unread Inquiries Panel */}
        <div className="p-6 rounded-2xl bg-white border border-sand/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand/40">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-primary">Unread Inquiries</h3>
                  {kpis.unreadInquiries > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose/15 text-rose font-mono">
                      {kpis.unreadInquiries} unread
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient messages awaiting review & response
                </p>
              </div>

              <Link
                href="/admin/inquiries"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-primary transition-colors"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-xs text-slate-400 py-8 text-center">Loading unread inquiries...</p>
              ) : !stats?.unreadInquiries || stats.unreadInquiries.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">Inbox Zero</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    All patient inquiries from the website contact form have been attended to.
                  </p>
                </div>
              ) : (
                stats.unreadInquiries.map((inq) => {
                  const dateObj = new Date(inq.createdAt);
                  const timeAgo = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '';

                  return (
                    <Link
                      key={inq.id}
                      href="/admin/inquiries"
                      className="p-4 rounded-xl bg-cream/40 border border-sand/50 hover:border-accent/40 hover:bg-cream/60 transition-all flex items-start justify-between gap-4 block"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full bg-accent shrink-0"
                            title="Unread"
                          />
                          <span className="font-semibold text-sm text-primary truncate">
                            {inq.name}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                          {inq.subject}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {inq.message}
                        </p>
                      </div>

                      <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                        {timeAgo}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
