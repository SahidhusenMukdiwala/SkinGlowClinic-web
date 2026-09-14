'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import {
  fetchAdminCustomersApi,
  fetchAdminCustomerDetailApi,
  updateCustomerStatusApi,
} from '@/lib/api';

const STATUS_CONFIG = {
  0: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  1: { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  2: { label: 'Completed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  3: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats Counters
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  // Filters & Pagination
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Status Toggle / Confirmation State
  const [confirmTarget, setConfirmTarget] = useState(null); // Customer to deactivate
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((type, text) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setFeedbackMsg({ type, text });
    toastTimerRef.current = setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Customer Detail Drawer / Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerAppointments, setCustomerAppointments] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState(null);

  // Debounce search input by 600ms
  const debounceTimerRef = useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(val.trim());
      setCurrentPage(1);
    }, 600);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;

      const data = await fetchAdminCustomersApi(token, {
        page: currentPage,
        limit: 10,
        status: statusFilter,
        search: searchQuery,
      });

      setCustomers(data.customers || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.total || 0);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load customer accounts.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Handle direct toggle or trigger confirmation modal
  const handleStatusClick = (customer) => {
    if (customer.is_active === 1) {
      // Prompt confirmation before deactivating
      setConfirmTarget(customer);
    } else {
      // Direct activation
      executeStatusUpdate(customer, 1);
    }
  };

  const executeStatusUpdate = async (customer, newStatus) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('serviceToken');
      await updateCustomerStatusApi(token, customer.id, newStatus === 1);

      showToast(
        'success',
        newStatus === 1
          ? `Customer "${customer.full_name}" is now active.`
          : `Customer "${customer.full_name}" has been deactivated. Active sessions revoked.`
      );

      // Update state locally for instantaneous responsiveness
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, is_active: newStatus } : c))
      );

      // Update counters
      setStats((prev) => {
        if (newStatus === 1) {
          return { ...prev, active: prev.active + 1, inactive: Math.max(0, prev.inactive - 1) };
        } else {
          return { ...prev, active: Math.max(0, prev.active - 1), inactive: prev.inactive + 1 };
        }
      });

      setConfirmTarget(null);
    } catch (err) {
      showToast('error', err.message || 'Failed to update customer status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open detail modal with appointment history
  const handleOpenDetail = async (customer) => {
    setSelectedCustomer(customer);
    setCustomerAppointments([]);
    setDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const token = localStorage.getItem('serviceToken');
      const data = await fetchAdminCustomerDetailApi(token, customer.id);
      setSelectedCustomer(data.customer || customer);
      setCustomerAppointments(data.appointments || []);
    } catch (err) {
      // Fallback to customer data
      setSelectedCustomer(customer);
    } finally {
      setLoadingDetail(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-accent/10 text-accent">
              <Users size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Registered Patient Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
            Customer Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage patient accounts, inspect appointment booking histories, and toggle active status.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Patients
            </p>
            <h3 className="text-2xl font-bold text-primary mt-1">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Active Accounts
            </p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">{stats.active}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Permitted to log in & book</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Inactive / Suspended
            </p>
            <h3 className="text-2xl font-bold text-rose-700 mt-1">{stats.inactive}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sessions blocked</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <UserX size={22} />
          </div>
        </div>
      </div> */}

      {/* Floating Toast Notification */}
      {feedbackMsg && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
              feedbackMsg.type === 'success'
                ? 'bg-white/95 border-emerald-200 text-emerald-950 shadow-emerald-500/10'
                : 'bg-white/95 border-rose-200 text-rose-950 shadow-rose-500/10'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h5 className="font-semibold text-xs text-slate-900">
                {feedbackMsg.type === 'success' ? 'Status Updated' : 'Action Failed'}
              </h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {feedbackMsg.text}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFeedbackMsg(null)}
              className="p-1 -mr-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Selection Box */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition cursor-pointer"
          >
            <option value="all">All Patients ({stats.total})</option>
            <option value="1">Active Only ({stats.active})</option>
            <option value="0">Inactive Only ({stats.inactive})</option>
          </select>
        </div>

        {/* Search Input with Debounce */}
        <div className="relative w-full md:w-80">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-9 py-2 rounded-xl text-sm border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={32} className="animate-spin text-accent mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading patient accounts...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle size={36} className="text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Error Loading Patients</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">{error}</p>
            <button
              type="button"
              onClick={loadCustomers}
              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-light"
            >
              Try Again
            </button>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-serif font-bold text-primary">No Patients Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'No customer accounts matched your current search or filter criteria.'
                : 'No patients have registered yet. New customer accounts will appear here automatically.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  handleClearSearch();
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-accent hover:text-accent-soft border border-accent/20 rounded-xl bg-accent/5"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 text-center w-12 sm:w-16">id</th>
                  <th className="py-3.5 px-4 sm:px-6">Patient</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer, index) => {
                  const initials = (customer.full_name || 'Patient')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  const isActive = customer.is_active === 1;
                  const rowNumber = (currentPage - 1) * 10 + index + 1;

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Row Index / Serial Number */}
                      <td className="py-4 px-4 text-center text-xs font-mono font-semibold text-slate-400">
                        {rowNumber}
                      </td>

                      {/* Patient Name & Avatar */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider shadow-sm shrink-0 ${
                              isActive
                                ? 'bg-gradient-to-br from-accent/20 to-accent-soft/30 text-primary border border-accent/30'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 truncate">
                                {customer.full_name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                                ID #{customer.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate">
                              Patient Account
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <Mail size={13} className="text-slate-400 shrink-0" />
                            <a
                              href={`mailto:${customer.email}`}
                              className="hover:text-accent truncate underline-offset-2 hover:underline"
                            >
                              {customer.email}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(customer.email, `mail-${customer.id}`)}
                              className="text-slate-300 hover:text-slate-500"
                              title="Copy email"
                            >
                              {copiedId === `mail-${customer.id}` ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <Phone size={13} className="text-slate-400 shrink-0" />
                            <a
                              href={`tel:${customer.mobile}`}
                              className="hover:text-accent font-mono truncate"
                            >
                              {customer.mobile}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(customer.mobile, `tel-${customer.id}`)}
                              className="text-slate-300 hover:text-slate-500"
                              title="Copy phone"
                            >
                              {copiedId === `tel-${customer.id}` ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleStatusClick(customer)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70'
                          }`}
                          title={`Click to ${isActive ? 'deactivate' : 'activate'} this account`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>
                            {new Date(customer.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(customer.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(customer)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition shadow-2xs"
                            title="View patient profile & appointment history"
                          >
                            <Eye size={14} className="text-slate-500" />
                            <span>History</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && customers.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-700">{customers.length}</span> of{' '}
              <span className="font-semibold text-slate-700">{totalCount}</span> patients
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="px-3 py-1 font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Account Deactivation */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert size={26} />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-primary">
                Deactivate Patient Account?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You are about to deactivate{' '}
                <span className="font-semibold text-slate-800">
                  {confirmTarget.full_name}
                </span>{' '}
                ({confirmTarget.email}).
              </p>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs text-rose-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle size={14} className="shrink-0" />
                Security Enforcement:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700 pl-1">
                <li>All active sessions for this patient will be immediately revoked.</li>
                <li>The patient will be blocked from logging in or booking consultations.</li>
                <li>Existing appointment records will remain safely preserved.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeStatusUpdate(confirmTarget, 0)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 shadow-sm"
              >
                {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                <span>Confirm Deactivation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail & Appointment History Modal */}
      {detailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 text-primary flex items-center justify-center font-bold text-sm tracking-wider">
                  {(selectedCustomer.full_name || 'Patient')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-primary">
                    {selectedCustomer.full_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">Customer #{selectedCustomer.id}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedCustomer.is_active === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedCustomer.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Mail size={14} className="text-slate-400" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Mobile Number
                  </span>
                  <div className="flex items-center gap-2 font-medium text-slate-800 font-mono">
                    <Phone size={14} className="text-slate-400" />
                    <span>{selectedCustomer.mobile}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Registered On
                  </span>
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Calendar size={14} className="text-slate-400" />
                    <span>
                      {new Date(selectedCustomer.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Account Status
                  </span>
                  <div className="flex items-center gap-2 font-medium">
                    {selectedCustomer.is_active === 1 ? (
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        Active & Verified
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1.5">
                        <ShieldAlert size={14} className="text-rose-600" />
                        Deactivated / Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Appointment Booking History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarCheck size={16} className="text-accent" />
                    <h4 className="font-serif font-bold text-sm text-primary">
                      Appointment Booking History ({customerAppointments.length})
                    </h4>
                  </div>
                </div>

                {loadingDetail ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                    <RefreshCw size={24} className="animate-spin text-accent mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Fetching appointment history...</p>
                  </div>
                ) : customerAppointments.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500">
                      No appointments booked under this patient profile yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {customerAppointments.map((appt) => {
                      const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG[0];
                      return (
                        <div
                          key={appt.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-accent/40 transition flex items-center justify-between text-xs gap-3"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {appt.treatment?.title || 'General Consultation'}
                            </p>
                            <div className="flex items-center gap-3 text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} className="text-slate-400" />
                                {new Date(appt.preferred_date_time).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} className="text-slate-400" />
                                {new Date(appt.preferred_date_time).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {appt.admin_notes && (
                              <p className="text-[11px] text-slate-400 italic mt-1 truncate">
                                Note: {appt.admin_notes}
                              </p>
                            )}
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-lg font-semibold border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setDetailModalOpen(false);
                  handleStatusClick(selectedCustomer);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                  selectedCustomer.is_active === 1
                    ? 'text-rose-700 bg-white border-rose-200 hover:bg-rose-50'
                    : 'text-emerald-700 bg-white border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {selectedCustomer.is_active === 1 ? 'Deactivate Customer' : 'Activate Customer'}
              </button>

              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
