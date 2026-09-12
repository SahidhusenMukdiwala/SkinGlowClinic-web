'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Tags,
  Sparkles,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  fetchAdminCategoriesApi,
  createAdminCategoryApi,
  updateAdminCategoryApi,
  deleteAdminCategoryApi,
} from '@/lib/api';
import { TableSkeleton } from '@/components/admin/AdminTableSkeleton';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal / Drawer State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;

      const data = await fetchAdminCategoriesApi(token, {
        status: statusFilter,
        search,
      });

      setCategories(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    setFormName('');
    setFormMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setIsEditing(true);
    setSelectedCategory(cat);
    setFormName(cat.name || '');
    setFormMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormMsg({ type: 'error', text: 'Please enter a category name.' });
      return;
    }

    setSubmitting(true);
    setFormMsg(null);

    try {
      const token = localStorage.getItem('serviceToken');
      const payload = {
        name: formName.trim(),
      };

      if (isEditing) {
        await updateAdminCategoryApi(token, selectedCategory.id, payload);
      } else {
        await createAdminCategoryApi(token, payload);
      }

      setModalOpen(false);
      loadCategories();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.message || 'Operation failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      const token = localStorage.getItem('serviceToken');
      const newStatus = cat.status === 1 ? 0 : 1;
      await updateAdminCategoryApi(token, cat.id, { status: newStatus });
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  const handleDelete = (cat) => {
    if (cat.treatmentCount > 0) {
      alert(
        `Cannot remove "${cat.name}". It is currently assigned to ${cat.treatmentCount} active treatment procedure(s). Please reassign or delete them first.`
      );
      return;
    }
    setDeleteTarget(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('serviceToken');
      await deleteAdminCategoryApi(token, deleteTarget.id);
      setDeleteTarget(null);
      loadCategories();
    } catch (err) {
      alert(err.message || 'Failed to delete category.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Clinical Categories
          </h2>
          <p className="text-slate-500 text-sm">
            Manage treatment disciplines, specialties, and taxonomy. Total: {categories.length}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadCategories}
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
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-sand/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={17} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-cream/30 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">All Status</option>
          <option value="1">Active Only</option>
          <option value="0">Inactive Only</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-sand/80 shadow-xs overflow-hidden">
        {loading && categories.length === 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sand bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6 w-20">ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Category Name</th>
                  <th className="py-3.5 px-4 w-36">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right w-28">Actions</th>
                </tr>
              </thead>
              <TableSkeleton rows={5} columns={4} />
            </table>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle size={28} className="text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Tags size={36} className="mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-base font-bold text-slate-700">No categories found</p>
            <p className="text-xs text-slate-400 mt-1">
              Add your first treatment category above to organize clinical procedures.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sand bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6 w-20">ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Category Name</th>
                  <th className="py-3.5 px-4 w-36">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/60 text-sm">
                {categories.map((cat) => {
                  const isActive = cat.status === 1;

                  return (
                    <tr key={cat.id} className="hover:bg-sand/15 transition-colors">
                      {/* ID */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-semibold text-slate-500">
                        #{cat.id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                            <Tags size={16} />
                          </div>
                          <span className="font-semibold text-primary">
                            {cat.name}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to toggle active status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-accent hover:bg-accent/10 transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Category"
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
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sand shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand/60 bg-cream/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary">
                    {isEditing ? 'Edit Category' : 'Add Clinical Category'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isEditing ? `Editing ID #${selectedCategory.id}` : 'Create a new procedure specialty'}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    formMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {formMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{formMsg.text}</span>
                </div>
              )}

              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={45}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Medi-Facials, Anti-Aging, Body Sculpting"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

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
                  <span>{submitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}</span>
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
        title="Delete Category"
        itemName={deleteTarget?.name}
        message="Are you sure you want to delete this clinical category? It will be safely soft-deleted from active taxonomies."
        confirmLabel="Delete Category"
      />
    </div>
  );
}
