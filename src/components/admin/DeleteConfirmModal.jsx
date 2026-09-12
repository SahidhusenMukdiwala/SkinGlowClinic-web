'use client';

import React, { useEffect } from 'react';
import { Trash2, X, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Entry',
  message,
  itemName,
  loading = false,
  confirmLabel = 'Delete',
  isSoftDelete = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Clickable Backdrop */}
      <div
        className="fixed inset-0"
        onClick={!loading ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-delete-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-sand/40 p-6 z-10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150"
      >
        {/* Top Decorative Color Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-amber-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-40"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-xs">
            <Trash2 size={22} />
          </div>

          <div className="space-y-1.5 pr-3">
            <h3 id="modal-delete-title" className="font-serif text-lg font-bold text-primary">
              {title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {message || 'Are you sure you want to delete this entry?'}
            </p>
            {itemName && (
              <div className="mt-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 break-words flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="truncate">{itemName}</span>
              </div>
            )}
            {/* {isSoftDelete && (
              <p className="text-[11px] text-slate-400 pt-1">
                Note: This record will be safely soft-deleted from active clinical listings.
              </p>
            )} */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
