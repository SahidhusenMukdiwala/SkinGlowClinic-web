'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitInquiryApi } from '@/lib/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      let digits = value.replace(/\D/g, '');
      if (digits.startsWith('91') && digits.length > 10) {
        digits = digits.slice(2);
      }
      setFormData(prev => ({ ...prev, phone: digits.slice(0, 10) }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneKeyDown = (e) => {
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Enter' ||
      (e.ctrlKey || e.metaKey)
    ) {
      return;
    }
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (formData.phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        phone: `+91 ${formData.phone}`,
      };
      const res = await submitInquiryApi(payload);
      setSuccessMsg(res.message || 'Thank you! Your inquiry has been submitted. Our team will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit your inquiry. Please verify your details or call our clinic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-7 sm:p-9 rounded-2xl border border-clinic-border-subtle shadow-md">
      <h3 className="font-heading text-2xl font-bold text-primary mb-2">Send Us a Message</h3>
      <p className="text-sm text-clinic-muted leading-relaxed mb-6">
        Have a question regarding our dermatological treatments, pricing, or consultation slots? Fill out the form below.
      </p>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="inquiry-name" className="block text-xs font-semibold text-primary mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="inquiry-name"
              name="name"
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-clinic-bg border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text transition-colors"
            />
          </div>

          <div>
            <label htmlFor="inquiry-email" className="block text-xs font-semibold text-primary mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="inquiry-email"
              name="email"
              type="email"
              required
              placeholder="priya@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-clinic-bg border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="inquiry-phone" className="block text-xs font-semibold text-primary mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden bg-clinic-bg border border-clinic-border-subtle focus-within:border-accent transition-colors">
              <span className="px-3.5 py-2.5 bg-clinic-bg-alt text-clinic-muted font-semibold text-xs flex items-center border-r border-clinic-border-subtle">
                +91
              </span>
              <input
                id="inquiry-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                placeholder="98765 43210"
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={handlePhoneKeyDown}
                className="w-full px-3.5 py-2.5 bg-transparent focus:outline-none text-sm text-clinic-text"
              />
            </div>
          </div>

          <div>
            <label htmlFor="inquiry-subject" className="block text-xs font-semibold text-primary mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              id="inquiry-subject"
              name="subject"
              type="text"
              required
              placeholder="e.g. Laser Hair Reduction Inquiry"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-clinic-bg border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="inquiry-message" className="block text-xs font-semibold text-primary mb-1.5">
            Message / Skin Concerns <span className="text-red-500">*</span>
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            required
            rows={4}
            placeholder="Tell us about your skin concerns, past treatments, or preferred consultation timing..."
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-clinic-bg border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full sm:w-auto justify-center self-start mt-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Sending Inquiry...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Submit Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
