'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle, FontFamily, FontSize } from '@tiptap/extension-text-style';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Type,
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
          levels: [1, 2, 3, 4],
        },
      }),
      TextStyle,
      FontFamily,
      FontSize,
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
          'tiptap focus:outline-none p-4 min-h-[300px] text-slate-800 font-sans leading-relaxed text-sm ' +
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 ' +
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 ' +
          '[&_li]:my-1 [&_li]:leading-normal ' +
          '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:font-serif [&_h1]:text-primary [&_h1]:mt-4 [&_h1]:mb-2 ' +
          '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:font-serif [&_h2]:text-primary [&_h2]:mt-3 [&_h2]:mb-1.5 ' +
          '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:font-serif [&_h3]:text-primary [&_h3]:mt-2.5 [&_h3]:mb-1 ' +
          '[&_h4]:text-base [&_h4]:font-bold [&_h4]:font-serif [&_h4]:text-primary [&_h4]:mt-2 [&_h4]:mb-1 ' +
          '[&_p]:my-2 [&_p]:leading-relaxed ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:bg-cream/40 [&_blockquote]:py-2 [&_blockquote]:px-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-slate-700',
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

  const handleFontFamilyChange = (val) => {
    if (!editor) return;
    try {
      const chain = editor.chain().focus();
      if (!val) {
        if (typeof chain.unsetFontFamily === 'function') {
          chain.unsetFontFamily().run();
        } else {
          chain.setMark('textStyle', { fontFamily: null }).run();
        }
      } else {
        if (typeof chain.setFontFamily === 'function') {
          chain.setFontFamily(val).run();
        } else {
          chain.setMark('textStyle', { fontFamily: val }).run();
        }
      }
    } catch (err) {
      console.warn('Font family change error:', err);
    }
  };

  const handleFontSizeChange = (val) => {
    if (!editor) return;
    try {
      const chain = editor.chain().focus();
      if (!val) {
        if (typeof chain.unsetFontSize === 'function') {
          chain.unsetFontSize().run();
        } else {
          chain.setMark('textStyle', { fontSize: null }).run();
        }
      } else {
        if (typeof chain.setFontSize === 'function') {
          chain.setFontSize(val).run();
        } else {
          chain.setMark('textStyle', { fontSize: val }).run();
        }
      }
    } catch (err) {
      console.warn('Font size change error:', err);
    }
  };

  return (
    <div className="space-y-2">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        {/* <div className="flex items-center gap-1 bg-sand/40 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
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
        </div> */}
      </div>

      {/* Editor Frame */}
      <div className="rounded-2xl border border-sand bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent transition-all">
        {/* WYSIWYG Toolbar */}
        {activeTab === 'editor' && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-[#FAF8F5] border-b border-sand/60">
            {/* Paragraph & Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              title="Normal Paragraph"
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                editor.isActive('paragraph') && !editor.isActive('heading')
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Type size={14} />
              <span>P</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              title="Heading 1 (Main Title)"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('heading', { level: 1 })
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Heading1 size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading 2 (Section)"
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
              title="Heading 3 (Subsection)"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('heading', { level: 3 })
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Heading3 size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              title="Heading 4 (Minor Subhead)"
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive('heading', { level: 4 })
                  ? 'bg-accent text-primary font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-white hover:text-primary hover:shadow-xs'
              }`}
            >
              <Heading4 size={16} />
            </button>

            <div className="h-4 w-px bg-sand/80 mx-1" />

            {/* Font Family Selector */}
            <select
              value={editor.getAttributes('textStyle').fontFamily || ''}
              onChange={(e) => handleFontFamilyChange(e.target.value)}
              className="px-2 py-1 rounded-lg border border-sand/80 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
              title="Font Family"
            >
              <option value="">Font: Default</option>
              <option value="Inter, sans-serif">Inter (Sans)</option>
              <option value="'Playfair Display', Georgia, serif">Playfair Display (Serif)</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="system-ui, sans-serif">System UI</option>
              <option value="'Courier New', Courier, monospace">Monospace</option>
            </select>

            {/* Font Size Selector */}
            <select
              value={editor.getAttributes('textStyle').fontSize || ''}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="px-2 py-1 rounded-lg border border-sand/80 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
              title="Font Size"
            >
              <option value="">Size: Auto</option>
              <option value="12px">12px (Small)</option>
              <option value="14px">14px (Compact)</option>
              <option value="16px">16px (Normal)</option>
              <option value="18px">18px (Medium)</option>
              <option value="20px">20px (Large)</option>
              <option value="24px">24px (XL)</option>
              <option value="28px">28px (2XL)</option>
              <option value="32px">32px (3XL)</option>
            </select>

            <div className="h-4 w-px bg-sand/80 mx-1" />

            {/* Inline Styles */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
              className={`p-1.5 rounded-lg transition-all ${editor.isActive('bold')
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
              className={`p-1.5 rounded-lg transition-all ${editor.isActive('italic')
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
              className={`p-1.5 rounded-lg transition-all ${editor.isActive('strike')
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
              className={`p-1.5 rounded-lg transition-all ${editor.isActive('bulletList')
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
              className={`p-1.5 rounded-lg transition-all ${editor.isActive('orderedList')
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
              className={`p-1.5 rounded-lg transition-all ${editor.isActive('blockquote')
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
              className={`p-1.5 rounded-lg transition-all ${editor.isActive('link')
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

      {/* <p className="text-[11px] text-slate-400">
        Powered by TipTap WYSIWYG editor. Format directly on screen or switch to HTML Source.
      </p> */}
    </div>
  );
}
