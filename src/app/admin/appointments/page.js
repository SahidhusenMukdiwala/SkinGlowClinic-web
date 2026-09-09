'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import {
  fetchAdminAppointmentsApi,
  updateAdminAppointmentApi,
  deleteAdminAppointmentApi,
} from '@/lib/api';

const STATUS_CONFIG = {
  0: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  1: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  2: { label: 'Completed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  3: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Appointment for Modal / Drawer
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(0);
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;

      const data = await fetchAdminAppointmentsApi(token, {
        page: currentPage,
        limit: 10,
        status: statusFilter,
        search,
      });

      setAppointments(data.appointments || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, search]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleOpenModal = (appt) => {
    setSelectedAppt(appt);
    setEditStatus(appt.status);
    setEditNotes(appt.admin_notes || '');
    setUpdateMsg(null);
    setModalOpen(true);
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg(null);

    try {
      const token = localStorage.getItem('serviceToken');
      const updated = await updateAdminAppointmentApi(token, selectedAppt.id, {
        status: editStatus,
        admin_notes: editNotes,
      });

      setSelectedAppt(updated);
      setUpdateMsg({ type: 'success', text: 'Appointment updated successfully!' });

      // Refresh list
      loadAppointments();
    } catch (err) {
      setUpdateMsg({ type: 'error', text: err.message || 'Failed to update.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this appointment?')) return;
    try {
      const token = localStorage.getItem('serviceToken');
      await deleteAdminAppointmentApi(token, selectedAppt.id);
      setModalOpen(false);
      loadAppointments();
    } catch (err) {
      alert(err.message || 'Failed to delete appointment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Appointments Management
          </h2>
          <p className="text-slate-500 text-sm">
            Review, confirm, reschedule, or cancel patient clinical bookings. Total: {totalCount}
          </p>
        </div>

        <button
          type="button"
          onClick={loadAppointments}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sand/70 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-accent' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-sand/60 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, mobile number, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand/70 bg-cream/20 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: '0', label: 'Pending' },
              { id: '1', label: 'Confirmed' },
              { id: '2', label: 'Completed' },
              { id: '3', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-cream/60 hover:bg-cream text-slate-600 border border-sand/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl border border-sand/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/70 border-b border-sand/50 text-[11px] uppercase font-bold tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Ref ID</th>
                <th className="py-3.5 px-4 sm:px-6">Patient</th>
                <th className="py-3.5 px-4 sm:px-6">Procedure</th>
                <th className="py-3.5 px-4 sm:px-6">Scheduled Date & Time</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/40 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <RefreshCw size={24} className="animate-spin text-accent mx-auto mb-2" />
                    <span>Loading appointments...</span>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No appointments match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => {
                  const status = STATUS_CONFIG[appt.status] || STATUS_CONFIG[0];
                  const d = new Date(appt.preferred_date_time);
                  const formattedDateTime = !isNaN(d.getTime())
                    ? d.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Invalid Date';

                  return (
                    <tr
                      key={appt.id}
                      className="hover:bg-cream/30 transition-colors cursor-pointer"
                      onClick={() => handleOpenModal(appt)}
                    >
                      <td className="py-4 px-4 sm:px-6 font-mono text-xs font-semibold text-accent">
                        {appt.reference_id}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-semibold text-primary">{appt.patient_name}</div>
                        <div className="text-xs text-slate-500">{appt.phone}</div>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className="font-medium text-slate-700">
                          {appt.treatment?.title || 'General Dermatology'}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 font-medium">
                        {formattedDateTime}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenModal(appt)}
                          className="px-3 py-1.5 rounded-lg border border-sand/70 bg-white hover:bg-slate-50 text-xs font-semibold text-primary transition-colors shadow-xs"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-cream/30 border-t border-sand/40">
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages} ({totalCount} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1 || loading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-sand/70 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-sand/70 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Detail & Status Update Modal */}
      {modalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-sand/70 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-cream/60 border-b border-sand/50">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-primary">
                  Appointment Details
                </span>
                <span className="font-mono text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-accent/10">
                  {selectedAppt.reference_id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-primary transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {updateMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    updateMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {updateMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{updateMsg.text}</span>
                </div>
              )}

              {/* Patient Info Card */}
              <div className="p-4 rounded-2xl bg-cream/40 border border-sand/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-accent" />
                    <span className="font-semibold text-primary">{selectedAppt.patient_name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Booked: {new Date(selectedAppt.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <a
                    href={`tel:${selectedAppt.phone}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-accent font-medium py-1"
                  >
                    <Phone size={14} className="text-slate-400" />
                    <span>{selectedAppt.phone}</span>
                  </a>
                  <a
                    href={`mailto:${selectedAppt.email}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-accent font-medium py-1 truncate"
                  >
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{selectedAppt.email}</span>
                  </a>
                </div>
              </div>

              {/* Procedure & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-sand/60 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Selected Procedure
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {selectedAppt.treatment?.title || 'General Consultation'}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Duration: {selectedAppt.treatment?.duration || '30-45 mins'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-sand/60 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Scheduled Time
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    {new Date(selectedAppt.preferred_date_time).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Patient Note */}
              {selectedAppt.message && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Patient&apos;s Clinical Notes / Concerns
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    &ldquo;{selectedAppt.message}&rdquo;
                  </div>
                </div>
              )}

              {/* Management Form */}
              <form onSubmit={handleSaveAppointment} className="space-y-4 pt-2 border-t border-sand/40">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1.5">
                    Update Appointment Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 0, label: 'Pending' },
                      { id: 1, label: 'Confirmed' },
                      { id: 2, label: 'Completed' },
                      { id: 3, label: 'Cancelled' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setEditStatus(st.id)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          editStatus === st.id
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white text-slate-600 border-sand hover:bg-cream'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="admin-notes" className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1.5">
                    Internal Admin Notes
                  </label>
                  <textarea
                    id="admin-notes"
                    rows="3"
                    placeholder="Add internal clinic notes (e.g. prescription details, follow-up schedule, payment status)..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-sand/70 bg-cream/20 text-xs text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 py-2 px-3 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                    <span>Delete Record</span>
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <Save size={15} />
                    <span>{updating ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
