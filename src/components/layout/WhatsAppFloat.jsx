import React from 'react';

export default function WhatsAppFloat() {
  const whatsappNumber = '919820123456';
  const defaultMessage = encodeURIComponent('Hello SkinGlow Clinic, I would like to inquire about your treatments.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      <span className="hidden sm:block mr-3 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with Clinic
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Chat with SkinGlow Clinic on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping -z-10"></span>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </div>
  );
}
