'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';

/**
 * ImageUpload Component
 * @param {string} label - Input label
 * @param {string} value - Current image URL string
 * @param {File | null} file - Currently selected file (for parent form state)
 * @param {function} onFileChange - Callback when a file is selected: (file, previewUrl) => void
 * @param {function} onUrlChange - Callback when direct URL is typed: (url) => void
 * @param {function} onRemove - Callback when image is removed: () => void
 * @param {string} shape - 'cover' (16:9) | 'square' (1:1)
 * @param {string} hint - Subtitle or size guideline
 */
export default function ImageUpload({
  label = 'Featured Image',
  value = '',
  file = null,
  onFileChange,
  onUrlChange,
  onRemove,
  shape = 'cover',
  hint = 'JPG, PNG, or JPEG (Max 3 MB)',
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const previewUrl = file ? (typeof window !== 'undefined' ? URL.createObjectURL(file) : '') : value;

  const handleFileSelect = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    // Check mime type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid format. Only JPG, JPEG, and PNG images are allowed.');
      return;
    }

    // Check size (3MB)
    if (selectedFile.size > 3 * 1024 * 1024) {
      setError('File size exceeds the 3 MB limit.');
      return;
    }

    const preview = URL.createObjectURL(selectedFile);
    if (onFileChange) {
      onFileChange(selectedFile, preview);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-sand/40 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === 'upload' ? 'bg-white text-primary shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === 'url' ? 'bg-white text-primary shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {previewUrl ? (
        // Preview State
        <div className="relative group rounded-2xl overflow-hidden border border-sand bg-slate-900 shadow-sm">
          <div
            className={`w-full overflow-hidden flex items-center justify-center ${
              shape === 'square' ? 'h-48 max-w-48 mx-auto' : 'h-48 sm:h-56'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 text-white">
            <span className="text-xs font-medium truncate max-w-[200px]">
              {file ? file.name : (value.startsWith('http') ? 'External Image URL' : 'Image Set')}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors"
              title="Remove Image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : mode === 'upload' ? (
        // Upload Dropzone
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 ${
            dragOver
              ? 'border-accent bg-accent/5 scale-[1.01]'
              : 'border-sand hover:border-accent/60 bg-cream/40 hover:bg-cream/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-sand/60 flex items-center justify-center text-accent">
            <UploadCloud size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>
          </div>
        </div>
      ) : (
        // Direct URL Input
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon size={16} />
            </div>
            <input
              type="url"
              value={value}
              onChange={(e) => {
                setError(null);
                if (onUrlChange) onUrlChange(e.target.value);
              }}
              placeholder="https://images.unsplash.com/... or Cloudinary URL"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Paste a publicly accessible high-resolution image URL.
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
