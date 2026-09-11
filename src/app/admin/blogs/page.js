'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
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
  FileText,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import {
  fetchAdminBlogsApi,
  createAdminBlogApi,
  updateAdminBlogApi,
  deleteAdminBlogApi,
} from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal / Drawer State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(1);
  const [formContent, setFormContent] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formFile, setFormFile] = useState(null);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;

      const data = await fetchAdminBlogsApi(token, {
        page: currentPage,
        limit: 10,
        is_published: publishedFilter,
        search,
      });

      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, publishedFilter, search]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedBlog(null);
    setFormTitle('');
    setFormSlug('');
    setFormIsPublished(1);
    setFormContent('');
    setFormCoverImage('');
    setFormFile(null);
    setFormMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setIsEditing(true);
    setSelectedBlog(blog);
    setFormTitle(blog.title || '');
    setFormSlug(blog.slug || '');
    setFormIsPublished(blog.is_published ?? 1);
    setFormContent(blog.content || '');
    setFormCoverImage(blog.cover_image || '');
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
      setFormMsg({ type: 'error', text: 'Please enter an article title.' });
      return;
    }
    if (!formContent.trim()) {
      setFormMsg({ type: 'error', text: 'Article content cannot be empty.' });
      return;
    }

    setSubmitting(true);
    setFormMsg(null);

    try {
      const token = localStorage.getItem('serviceToken');
      const formData = new FormData();
      formData.append('title', formTitle.trim());
      if (formSlug.trim()) formData.append('slug', formSlug.trim());
      formData.append('is_published', String(formIsPublished));
      formData.append('content', formContent.trim());

      if (formFile) {
        formData.append('cover_image', formFile);
      } else if (formCoverImage.trim()) {
        formData.append('cover_image', formCoverImage.trim());
      }

      if (isEditing) {
        await updateAdminBlogApi(token, selectedBlog.id, formData);
      } else {
        await createAdminBlogApi(token, formData);
      }

      setModalOpen(false);
      loadBlogs();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.message || 'Failed to save blog post.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const token = localStorage.getItem('serviceToken');
      await deleteAdminBlogApi(token, id);
      loadBlogs();
    } catch (err) {
      alert(err.message || 'Failed to delete blog post.');
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      const token = localStorage.getItem('serviceToken');
      const newStatus = blog.is_published === 1 ? 0 : 1;
      await updateAdminBlogApi(token, blog.id, { is_published: newStatus });
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, is_published: newStatus } : b))
      );
    } catch (err) {
      alert(err.message || 'Failed to toggle publish status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Clinical Blogs & Insights
          </h2>
          <p className="text-slate-500 text-sm">
            Publish clinical advice, dermatological breakthroughs, and patient guides. Total: {totalCount}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadBlogs}
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
            <span>Write Article</span>
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
            placeholder="Search articles by title or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-cream/30 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
        </div>

        <select
          value={publishedFilter}
          onChange={(e) => {
            setPublishedFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">All Articles</option>
          <option value="1">Published Only</option>
          <option value="0">Drafts Only</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-sand/80 shadow-xs overflow-hidden">
        {loading && blogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw size={24} className="animate-spin text-accent mx-auto mb-2" />
            <p className="text-sm font-medium">Loading clinical insights...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle size={28} className="text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText size={36} className="mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-base font-bold text-slate-700">No blog articles found</p>
            <p className="text-xs text-slate-400 mt-1">Write your first clinical insight article above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sand bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Article</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/60 text-sm">
                {blogs.map((blog) => {
                  const isPublished = blog.is_published === 1;

                  return (
                    <tr key={blog.id} className="hover:bg-sand/15 transition-colors">
                      {/* Cover & Title */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 border border-sand shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={blog.cover_image || DEFAULT_COVER}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-serif font-bold text-primary block truncate max-w-xs sm:max-w-md">
                            {blog.title}
                          </span>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        /{blog.slug}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(blog)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                          title="Click to toggle publish status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(blog)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-accent hover:bg-accent/10 transition-colors"
                            title="Edit Article"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(blog.id, blog.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Article"
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

      {/* Write / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sand shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand/60 bg-cream/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary">
                    {isEditing ? 'Edit Clinical Article' : 'Write New Clinical Insight'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Draft, format, and publish medical skincare articles
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
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., The Science Behind HydraFacial"
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
                    placeholder="science-behind-hydrafacial"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Publishing Status
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="is_published"
                      checked={formIsPublished === 1}
                      onChange={() => setFormIsPublished(1)}
                      className="text-accent focus:ring-accent"
                    />
                    <span className="font-semibold text-emerald-700">Published (Visible to Patients)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="is_published"
                      checked={formIsPublished === 0}
                      onChange={() => setFormIsPublished(0)}
                      className="text-accent focus:ring-accent"
                    />
                    <span className="font-semibold text-amber-700">Draft (Saved in Console)</span>
                  </label>
                </div>
              </div>

              {/* Cover Image Upload */}
              <ImageUpload
                label="Cover Image"
                value={formCoverImage}
                file={formFile}
                onFileChange={(file) => {
                  setFormFile(file);
                  setFormCoverImage('');
                }}
                onUrlChange={(url) => {
                  setFormCoverImage(url);
                  setFormFile(null);
                }}
                onRemove={() => {
                  setFormFile(null);
                  setFormCoverImage('');
                }}
                shape="cover"
                hint="High-resolution banner (1200x600 recommended, JPG/PNG, Max 3MB)"
              />

              {/* Rich Text Editor */}
              <RichTextEditor
                label="Article Body (Option 1 Custom Luxury Editor)"
                value={formContent}
                onChange={setFormContent}
                placeholder="Write your clinical insights, patient advice, procedure explanations..."
                minHeight="320px"
              />

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
                  <span>{submitting ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
