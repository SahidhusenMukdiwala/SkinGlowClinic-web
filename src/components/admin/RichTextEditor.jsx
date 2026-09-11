'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Sparkles,
  Code2,
  Eye,
  Edit3,
} from 'lucide-react';

/**
 * Modern TipTap WYSIWYG Editor
 */
export default function RichTextEditor({
  value = '',
  onChange,
  label = 'Article / Description Content',
  placeholder = 'Write or paste your clinical content here...',
  minHeight = '320px',
}) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'html'

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent font-semibold underline hover:text-accent-hover',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    immediatelyRender: false, // Prevents Next.js 14 SSR hydration warnings
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none focus:outline-none p-4 min-h-[300px] text-slate-800 font-sans leading-relaxed text-sm ' +
          'prose-headings:font-serif prose-headings:text-primary prose-headings:font-bold ' +
          'prose-h2:text-xl prose-h2:mt-4 prose-h2:mb-2 ' +
          'prose-h3:text-lg prose-h3:mt-3 prose-h3:mb-1.5 ' +
          'prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 ' +
          'prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-cream/40 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-slate-700',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) onChange(html);
    },
  });

  // Sync external value when changed (e.g. on modal open or reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Only set content if distinctly different to preserve cursor position
      if (editor.getText().trim() === '' && value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <div
          style={{ minHeight }}
          className="rounded-2xl border border-sand bg-cream/20 p-6 flex items-center justify-center text-slate-400 text-sm"
        >
          Loading rich editor...
        </div>
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (e.g., https://...):', previousUrl || 'https://');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertDoctorTip = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="clinical-note p-4 my-4 rounded-xl bg-amber-50/70 border-l-4 border-amber-500 text-slate-800">
          <strong>Doctor's Clinical Tip:</strong> Patient guidance or clinical care recommendation goes here.
        </div><p></p>`
      )
      .run();
  };

  return (
    <div className="space-y-2">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-sand/40 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeTab === 'editor'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Edit3 size={13} />
            <span>Visual WYSIWYG</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              activeTab === 'html'
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Code2 size={13} />
            <span>HTML Source</span>
          </button>
        </div>
      </div>

      {/* Editor Frame */}
      <div className="rounded-2xl border border-sand bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent transition-all">
        {/* WYSIWYG Toolbar */}
        {activeTab === 'editor' && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-[#FAF8F5] border-b border-sand/60">
            {/* Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading 2"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('heading', { level: 2 })
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              title="Heading 3"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Heading3 size={16} />
            </button>

            <div className="h-4 w-px bg-sand/80 mx-1" />

            {/* Inline Styles */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('bold')
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('italic')
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strike"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('strike')
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Strikethrough size={15} />
            </button>

            <div className="h-4 w-px bg-sand/80 mx-1" />

            {/* Lists & Quotes */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('bulletList')
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered List"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('orderedList')
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <ListOrdered size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Blockquote"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('blockquote')
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Quote size={15} />
            </button>

            <div className="h-4 w-px bg-sand/80 mx-1" />

            {/* Links & Doctor Tip Box */}
            <button
              type="button"
              onClick={setLink}
              title="Insert Link"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('link')
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <LinkIcon size={15} />
            </button>

            <button
              type="button"
              onClick={insertDoctorTip}
              title="Insert Clinical Callout Box"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-accent hover:bg-accent/10 transition-colors"
            >
              <Sparkles size={13} />
              <span>Doctor Tip</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Divider"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs transition-all"
            >
              <Minus size={15} />
            </button>

            <div className="h-4 w-px bg-sand/80 mx-1" />

            {/* Undo & Redo */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-primary disabled:opacity-30 transition-all"
            >
              <Undo size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-primary disabled:opacity-30 transition-all"
            >
              <Redo size={14} />
            </button>
          </div>
        )}

        {/* Content Area */}
        {activeTab === 'editor' ? (
          <div style={{ minHeight }} className="bg-white">
            <EditorContent editor={editor} />
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => {
              if (onChange) onChange(e.target.value);
              if (editor) editor.commands.setContent(e.target.value);
            }}
            style={{ minHeight }}
            className="w-full p-4 font-mono text-sm leading-relaxed text-slate-800 placeholder-slate-400 bg-white focus:outline-none resize-y"
          />
        )}
      </div>

      <p className="text-[11px] text-slate-400">
        Powered by TipTap WYSIWYG editor. Format directly on screen or switch to HTML Source.
      </p>
    </div>
  );
}
