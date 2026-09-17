'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
} from 'lucide-react';
import {
  fetchAdminTreatmentsApi,
  createAdminTreatmentApi,
  updateAdminTreatmentApi,
  deleteAdminTreatmentApi,
  fetchCategoriesApi,
} from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-xl border border-sand/40 bg-slate-50 flex items-center justify-center text-slate-400 text-sm animate-pulse">
      Loading editor...
    </div>
  ),
});

const CATEGORY_MAP = {
  1: { name: 'Skin', bg: 'bg-rose/20', text: 'text-rose-900', border: 'border-rose/30' },
  2: { name: 'Hair', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  3: { name: 'Laser', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  4: { name: 'Anti-Aging', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  5: { name: 'Body', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
};

export default function AdminTreatmentsPage() {
  const [treatments, setTreatments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal / Drawer State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState(1);
  const [formDuration, setFormDuration] = useState('30-45 mins');
  const [formPrice, setFormPrice] = useState(0);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(1);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formFile, setFormFile] = useState(null);

  useEffect(() => {
    fetchCategoriesApi().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });
  }, []);

  const loadTreatments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;

      const data = await fetchAdminTreatmentsApi(token, {
        page: currentPage,
        limit: 10,
        category: categoryFilter,
        category_id: categoryFilter,
        is_active: statusFilter,
        search,
      });

      setTreatments(data.treatments || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load treatments.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, categoryFilter, statusFilter, search]);

  useEffect(() => {
    loadTreatments();
  }, [loadTreatments]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedTreatment(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory(categories[0]?.id || 1);
    setFormDuration('45-60 mins');
    setFormPrice(0);
    setFormDisplayOrder(0);
    setFormIsActive(1);
    setFormShortDesc('');
    setFormFullDesc('');
    setFormImageUrl('');
    setFormFile(null);
    setFormMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (treatment) => {
    setIsEditing(true);
    setSelectedTreatment(treatment);
    setFormTitle(treatment.title || '');
    setFormSlug(treatment.slug || '');
    setFormCategory(treatment.category_id || treatment.category?.id || 1);
    setFormDuration(treatment.duration || '');
    setFormPrice(treatment.price ?? 0);
    setFormDisplayOrder(treatment.display_order ?? 0);
    setFormIsActive(treatment.is_active ?? 1);
    setFormShortDesc(treatment.short_description || '');
    setFormFullDesc(treatment.full_description || '');
    setFormImageUrl(treatment.image_url || '');
    setFormFile(null);
    setFormMsg(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val) => {
    setFormTitle(val);
    if (!isEditing) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormSlug(autoSlug);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormMsg({ type: 'error', text: 'Please enter a treatment title.' });
      return;
    }

    setSubmitting(true);
    setFormMsg(null);

    try {
      const token = localStorage.getItem('serviceToken');
      const formData = new FormData();
      formData.append('title', formTitle.trim());
      if (formSlug.trim()) formData.append('slug', formSlug.trim());
      formData.append('category_id', String(formCategory));
      formData.append('category', String(formCategory));
      formData.append('duration', formDuration.trim());
      formData.append('price', String(formPrice || 0));
      formData.append('display_order', String(formDisplayOrder));
      formData.append('is_active', String(formIsActive));
      formData.append('short_description', formShortDesc.trim());
      formData.append('full_description', formFullDesc.trim());

      if (formFile) {
        formData.append('image', formFile);
      } else if (formImageUrl.trim()) {
        formData.append('image_url', formImageUrl.trim());
      }

      if (isEditing) {
        await updateAdminTreatmentApi(token, selectedTreatment.id, formData);
      } else {
        await createAdminTreatmentApi(token, formData);
      }

      setModalOpen(false);
      loadTreatments();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('serviceToken');
      await deleteAdminTreatmentApi(token, deleteTarget.id);
      setDeleteTarget(null);
      loadTreatments();
    } catch (err) {
      alert(err.message || 'Failed to delete treatment.');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (treatment) => {
    try {
      const token = localStorage.getItem('serviceToken');
      const newStatus = treatment.is_active === 1 ? 0 : 1;
      await updateAdminTreatmentApi(token, treatment.id, { is_active: newStatus });
      setTreatments((prev) =>
        prev.map((t) => (t.id === treatment.id ? { ...t, is_active: newStatus } : t))
      );
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> */}
        {/* <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Treatments Catalog
          </h2>
          <p className="text-slate-500 text-sm">
            Manage clinical procedures, categories, descriptions, and media. Total: {totalCount}
          </p>
        </div> */}

        {/* <div className="flex items-center gap-3 self-start sm:self-auto">
          
        </div> */}
      {/* </div> */}

      {/* Filter Toolbar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-sand/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
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
            placeholder="Search treatments by title or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-cream/30 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        {/* Filters & Actions Container */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-initial sm:w-44 px-3.5 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-initial sm:w-36 px-3.5 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="1">Active Only</option>
            <option value="0">Inactive Only</option>
          </select>

          {/* Add Treatment Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-soft text-primary text-sm font-bold shadow-gold hover:shadow-lg transition-all shrink-0 whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add Treatment</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-sand/80 shadow-xs overflow-hidden">
        {loading && treatments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw size={24} className="animate-spin text-accent mx-auto mb-2" />
            <p className="text-sm font-medium">Loading clinical procedures...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle size={28} className="text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : treatments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Layers size={36} className="mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-base font-bold text-slate-700">No treatments found</p>
            <p className="text-xs text-slate-400 mt-1">Try changing your filters or add a new treatment procedure.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-sand bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6 w-16">ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Treatment</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/60 text-sm">
                {treatments.map((t) => {
                  const categoryName =
                    t.category?.name ||
                    categories.find((c) => c.id === (t.category_id || t.category))?.name ||
                    'General';
                  const isActive = t.is_active === 1;

                  return (
                    <tr key={t.id} className="hover:bg-sand/15 transition-colors">
                      {/* ID */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-semibold text-slate-500">
                        {t.id}
                      </td>

                      {/* Treatment Info & Thumbnail */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-sand/60 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={t.image_url || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80'}
                              alt={t.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-serif font-bold text-primary block truncate max-w-xs sm:max-w-sm">
                              {t.title}
                            </span>
                            <span className="text-xs text-slate-400 font-mono block">
                              /{t.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sand/30 text-primary border border-sand">
                          {categoryName}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                          <span>{t.duration || 'Flexible'}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-slate-800 text-xs font-semibold">
                        {t.price && Number(t.price) > 0 ? (
                          <span className="font-mono text-primary font-bold">
                            ₹{Number(t.price).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium italic">
                            Consultation
                          </span>
                        )}
                      </td>

                      {/* Order */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-mono font-semibold">
                        #{t.display_order}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(t)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          title="Click to toggle active status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-accent hover:bg-accent/10 transition-colors"
                            title="Edit Procedure"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(t)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Treatment"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sand shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand/60 bg-cream/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary">
                    {isEditing ? 'Edit Treatment Procedure' : 'Add New Clinical Treatment'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isEditing ? `ID #${selectedTreatment.id} • ${selectedTreatment.title}` : 'Fill in the treatment specifications below'}
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

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
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

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Treatment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., HydraFacial Elite MD"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="hydrafacial-elite-md"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              {/* Category, Duration, Price, Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g., 45-60 mins"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10) || 0))}
                      onWheel={(e) => e.target.blur()}
                      placeholder="0 (Free)"
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    onWheel={(e) => e.target.blur()}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formIsActive}
                    onChange={(e) => setFormIsActive(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <ImageUpload
                label="Treatment Hero Image"
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
                shape="cover"
                hint="Clinical photo showcasing the procedure (JPG/PNG, Max 3MB)"
              />

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Short Description (Card Summary)
                </label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Concise 1-2 sentence overview shown on treatment cards..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                />
              </div>

              {/* Full Clinical Description with RichTextEditor */}
              <RichTextEditor
                label="Full Clinical Procedure Profile & Benefits"
                value={formFullDesc}
                onChange={setFormFullDesc}
                placeholder="Detail the clinical steps, technology utilized, ideal candidates, and expected outcomes..."
                minHeight="280px"
              />

              {/* Modal Footer */}
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
                  <span>{submitting ? 'Saving...' : isEditing ? 'Update Treatment' : 'Create Treatment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Treatment"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this treatment? It will be safely soft-deleted from the active clinic catalog and booking options."
        confirmLabel="Delete Treatment"
      />
    </div>
  );
}
