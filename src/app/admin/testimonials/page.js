'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Star,
  Edit2,
  Trash2,
  RefreshCw,
  Sparkles,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
} from 'lucide-react';
import {
  fetchAdminTestimonialsApi,
  createAdminTestimonialApi,
  updateAdminTestimonialApi,
  deleteAdminTestimonialApi,
} from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  // Form Fields
  const [formPatientName, setFormPatientName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formReviewText, setFormReviewText] = useState('');
  const [formIsActive, setFormIsActive] = useState(1);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formFile, setFormFile] = useState(null);

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;

      const data = await fetchAdminTestimonialsApi(token, {
        page: currentPage,
        limit: 10,
        is_active: statusFilter,
        search,
      });

      setTestimonials(data.testimonials || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, search]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setFormPatientName('');
    setFormRating(5);
    setFormReviewText('');
    setFormIsActive(1);
    setFormImageUrl('');
    setFormFile(null);
    setFormMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
    setFormPatientName(item.patient_name || '');
    setFormRating(item.rating || 5);
    setFormReviewText(item.review_text || '');
    setFormIsActive(item.is_active ?? 1);
    setFormImageUrl(item.patient_image || '');
    setFormFile(null);
    setFormMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formPatientName.trim() || !formReviewText.trim()) {
      setFormMsg({ type: 'error', text: 'Please fill in patient name and review.' });
      return;
    }

    setSubmitting(true);
    setFormMsg(null);

    try {
      const token = localStorage.getItem('serviceToken');
      const formData = new FormData();
      formData.append('patient_name', formPatientName.trim());
      formData.append('rating', String(formRating));
      formData.append('review_text', formReviewText.trim());
      formData.append('is_active', String(formIsActive));

      if (formFile) {
        formData.append('patient_image', formFile);
      } else if (formImageUrl.trim()) {
        formData.append('patient_image', formImageUrl.trim());
      }

      if (isEditing) {
        await updateAdminTestimonialApi(token, selectedItem.id, formData);
      } else {
        await createAdminTestimonialApi(token, formData);
      }

      setModalOpen(false);
      loadTestimonials();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete testimonial by "${name}"?`)) return;

    try {
      const token = localStorage.getItem('serviceToken');
      await deleteAdminTestimonialApi(token, id);
      loadTestimonials();
    } catch (err) {
      alert(err.message || 'Failed to delete testimonial.');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const token = localStorage.getItem('serviceToken');
      const newStatus = item.is_active === 1 ? 0 : 1;
      await updateAdminTestimonialApi(token, item.id, { is_active: newStatus });
      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, is_active: newStatus } : t))
      );
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Patient Testimonials
          </h2>
          <p className="text-slate-500 text-sm">
            Curate verified patient reviews, star ratings, and success stories. Total: {totalCount}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadTestimonials}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sand bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-xs transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-accent' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-soft text-primary text-sm font-bold shadow-gold hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-sand/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={17} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search reviews by patient name or quote..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-cream/30 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">All Reviews</option>
          <option value="1">Active (Visible)</option>
          <option value="0">Inactive (Hidden)</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-sand/80 shadow-xs overflow-hidden">
        {loading && testimonials.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw size={24} className="animate-spin text-accent mx-auto mb-2" />
            <p className="text-sm font-medium">Loading patient feedback...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle size={28} className="text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare size={36} className="mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-base font-bold text-slate-700">No testimonials found</p>
            <p className="text-xs text-slate-400 mt-1">Add your first patient testimonial above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sand bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Patient</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Excerpt</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/60 text-sm">
                {testimonials.map((item) => {
                  const isActive = item.is_active === 1;

                  return (
                    <tr key={item.id} className="hover:bg-sand/15 transition-colors">
                      {/* Patient Avatar & Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-sand shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.patient_image || DEFAULT_AVATAR}
                              alt={item.patient_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-serif font-bold text-primary block">
                            {item.patient_name}
                          </span>
                        </div>
                      </td>

                      {/* Star Rating */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= (item.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }
                            />
                          ))}
                        </div>
                      </td>

                      {/* Review Text Snippet */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs sm:max-w-md">
                        <p className="line-clamp-2 italic">
                          &ldquo;{item.review_text}&rdquo;
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          title="Click to toggle active status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{isActive ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-accent hover:bg-accent/10 transition-colors"
                            title="Edit Testimonial"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.patient_name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-sand/60 flex items-center justify-between text-xs text-slate-500 bg-cream/20">
            <span>
              Page {currentPage} of {totalPages} ({totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-sand bg-white disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-sand bg-white disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sand shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand/60 bg-cream/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary">
                    {isEditing ? 'Edit Patient Testimonial' : 'Add New Testimonial'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Patient review details & verification
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {formMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${formMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                >
                  {formMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{formMsg.text}</span>
                </div>
              )}

              {/* Patient Name & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    placeholder="e.g., Ananya Deshmukh"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Visibility Status
                  </label>
                  <select
                    value={formIsActive}
                    onChange={(e) => setFormIsActive(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value={1}>Active (Visible on Homepage)</option>
                    <option value={0}>Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Interactive Star Rating */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Star Rating (1 to 5) *
                </label>
                <div className="flex items-center gap-2 bg-cream/40 p-3 rounded-2xl border border-sand">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={
                          star <= formRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {formRating} out of 5 Stars
                  </span>
                </div>
              </div>

              {/* Patient Photo */}
              <ImageUpload
                label="Patient Photo (Optional)"
                value={formImageUrl}
                file={formFile}
                onFileChange={(file) => {
                  setFormFile(file);
                  setFormImageUrl('');
                }}
                onUrlChange={(url) => {
                  setFormImageUrl(url);
                  setFormFile(null);
                }}
                onRemove={() => {
                  setFormFile(null);
                  setFormImageUrl('');
                }}
                shape="square"
                hint="Square portrait (Leave empty to use luxury default avatar)"
              />

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Review & Feedback Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formReviewText}
                  onChange={(e) => setFormReviewText(e.target.value)}
                  placeholder="Paste the patient's exact clinical experience and feedback quote..."
                  className="w-full p-4 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-sand/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-sand text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-soft text-primary text-sm font-bold shadow-gold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{submitting ? 'Saving...' : isEditing ? 'Update Review' : 'Add Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
