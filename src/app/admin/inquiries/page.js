'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Inbox,
  Mail,
  Phone,
  User,
  Clock,
  Trash2,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import {
  fetchAdminInquiriesApi,
  markInquiryReadApi,
  deleteAdminInquiryApi,
} from '@/lib/api';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Inquiry for Modal
  const [selectedInq, setSelectedInq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;

      const data = await fetchAdminInquiriesApi(token, {
        page: currentPage,
        limit: 10,
        is_read: readFilter,
        search,
      });

      setInquiries(data.inquiries || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load patient inquiries.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, readFilter, search]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const handleOpenModal = async (inq) => {
    setSelectedInq(inq);
    setModalOpen(true);

    // If unread, automatically mark as read
    if (inq.is_read === 0) {
      try {
        const token = localStorage.getItem('serviceToken');
        await markInquiryReadApi(token, inq.id, 1);
        setInquiries((prev) =>
          prev.map((item) => (item.id === inq.id ? { ...item, is_read: 1 } : item))
        );
      } catch {
        // ignore background status update error
      }
    }
  };

  const handleToggleRead = async (e, inq) => {
    e.stopPropagation();
    const newStatus = inq.is_read === 1 ? 0 : 1;
    try {
      const token = localStorage.getItem('serviceToken');
      await markInquiryReadApi(token, inq.id, newStatus);
      setInquiries((prev) =>
        prev.map((item) => (item.id === inq.id ? { ...item, is_read: newStatus } : item))
      );
      if (selectedInq && selectedInq.id === inq.id) {
        setSelectedInq({ ...selectedInq, is_read: newStatus });
      }
    } catch (err) {
      alert(err.message || 'Failed to update read status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) return;
    try {
      const token = localStorage.getItem('serviceToken');
      await deleteAdminInquiryApi(token, selectedInq.id);
      setModalOpen(false);
      loadInquiries();
    } catch (err) {
      alert(err.message || 'Failed to delete inquiry');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Patient Inquiries Triage
          </h2>
          <p className="text-slate-500 text-sm">
            Review general messages, treatment questions, and consultation requests. Total: {totalCount}
          </p>
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sand/70 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-accent' : ''} />
          <span>Refresh</span>
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
              placeholder="Search by patient name, subject, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand/70 bg-cream/20 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
          </div>

          {/* Read / Unread Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Inquiries' },
              { id: '0', label: 'Unread Only' },
              { id: '1', label: 'Read' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setReadFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  readFilter === tab.id
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

      {/* Inquiries List */}
      <div className="bg-white rounded-2xl border border-sand/60 shadow-sm overflow-hidden">
        <div className="divide-y divide-sand/40">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw size={24} className="animate-spin text-accent mx-auto mb-2" />
              <span>Loading inquiries...</span>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              No inquiries found for the selected filter.
            </div>
          ) : (
            inquiries.map((inq) => {
              const isUnread = inq.is_read === 0;
              const dateObj = new Date(inq.createdAt);
              const formattedDate = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <div
                  key={inq.id}
                  onClick={() => handleOpenModal(inq)}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-cream/40 transition-colors ${
                    isUnread ? 'bg-accent/[0.03] font-medium' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="pt-1 shrink-0">
                      {isUnread ? (
                        <div
                          className="w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-accent/20"
                          title="Unread"
                        />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" title="Read" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm ${
                            isUnread ? 'font-bold text-primary' : 'font-semibold text-slate-800'
                          }`}
                        >
                          {inq.name}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">
                          &bull; {inq.phone}
                        </span>
                      </div>

                      <p
                        className={`text-xs mt-0.5 truncate ${
                          isUnread ? 'font-semibold text-primary' : 'text-slate-700'
                        }`}
                      >
                        {inq.subject}
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {inq.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-sand/30">
                    <span className="text-[11px] text-slate-400">{formattedDate}</span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(e, inq)}
                      className="px-2.5 py-1 rounded-lg border border-sand text-[11px] font-medium text-slate-600 hover:bg-white hover:text-primary transition-colors"
                    >
                      {isUnread ? 'Mark Read' : 'Mark Unread'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
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

      {/* Inquiry Detail Modal */}
      {modalOpen && selectedInq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-sand/70 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-cream/60 border-b border-sand/50">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-accent" />
                <span className="font-serif text-lg font-bold text-primary">
                  Patient Inquiry
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
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Contact Card */}
              <div className="p-4 rounded-2xl bg-cream/40 border border-sand/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary text-base">
                    {selectedInq.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(selectedInq.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs pt-1">
                  <a
                    href={`tel:${selectedInq.phone}`}
                    className="flex items-center gap-1.5 text-accent font-semibold hover:underline"
                  >
                    <Phone size={14} />
                    <span>{selectedInq.phone}</span>
                  </a>
                  <a
                    href={`mailto:${selectedInq.email}`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-primary truncate"
                  >
                    <Mail size={14} />
                    <span className="truncate">{selectedInq.email}</span>
                  </a>
                </div>
              </div>

              {/* Subject */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Subject / Area of Concern
                </span>
                <p className="text-sm font-semibold text-primary">{selectedInq.subject}</p>
              </div>

              {/* Message Body */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Patient Message
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInq.message}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-sand/40">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 py-2 px-3 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedInq.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sand bg-white hover:bg-cream text-xs font-semibold text-primary transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call Patient</span>
                  </a>
                  <a
                    href={`mailto:${selectedInq.email}?subject=Re: ${encodeURIComponent(selectedInq.subject)}`}
                    className="btn btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Mail size={13} />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
