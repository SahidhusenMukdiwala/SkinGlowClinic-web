'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitInquiryApi } from '@/lib/api';
import styles from './ContactForm.module.css';

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
      // If user pastes with leading +91 / 91 (e.g., 12 digits), strip country code
      if (digits.startsWith('91') && digits.length > 10) {
        digits = digits.slice(2);
      }
      setFormData(prev => ({ ...prev, phone: digits.slice(0, 10) }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneKeyDown = (e) => {
    // Allow control keys, backspace, delete, tab, arrow navigation, enter, and clipboard shortcuts
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
    // Block any non-digit character
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    // Ensure phone number contains exactly 10 digits
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
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Send Us a Message</h3>
      <p className={styles.formSubtitle}>
        Have a question regarding our dermatological treatments, pricing, or consultation slots? Fill out the form below.
      </p>

      {successMsg && (
        <div className={styles.alertSuccess}>
          <CheckCircle2 size={20} className={styles.alertIcon} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className={styles.alertError}>
          <AlertCircle size={20} className={styles.alertIcon} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputRow}>
          <div className={styles.formGroup}>
            <label htmlFor="inquiry-name" className={styles.label}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              id="inquiry-name"
              name="name"
              type="text"
              required
              placeholder="e.g. Dr. Priya Rao"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="inquiry-email" className={styles.label}>
              Email Address <span className={styles.required}>*</span>
            </label>
            <input
              id="inquiry-email"
              name="email"
              type="email"
              required
              placeholder="priya@example.com"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.formGroup}>
            <label htmlFor="inquiry-phone" className={styles.label}>
              Phone Number <span className={styles.required}>*</span>
            </label>
            <div className={styles.phoneInputWrapper}>
              <span className={styles.phonePrefix} aria-hidden="true">+91</span>
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
                className={styles.phoneInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="inquiry-subject" className={styles.label}>
              Subject <span className={styles.required}>*</span>
            </label>
            <input
              id="inquiry-subject"
              name="subject"
              type="text"
              required
              placeholder="e.g. Laser Hair Reduction Inquiry"
              value={formData.subject}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="inquiry-message" className={styles.label}>
            Message / Skin Concerns <span className={styles.required}>*</span>
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about your skin concerns, past treatments, or preferred consultation timing..."
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary ${styles.submitBtn}`}
        >
          {loading ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
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
