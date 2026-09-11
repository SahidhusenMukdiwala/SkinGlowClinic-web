'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Save,
  RefreshCw,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Share2,
  Globe,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { fetchAdminSettingsApi, updateAdminSettingsApi } from '@/lib/api';

const InstagramIcon = ({ size = 17, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 17, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 17, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

const TABS = [
  { id: 'clinic', label: 'Clinic Profile', icon: Building2 },
  { id: 'contact', label: 'Contact & Location', icon: MapPin },
  { id: 'hours', label: 'Operating Hours', icon: Clock },
  { id: 'socials', label: 'Social Media', icon: Share2 },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('clinic');
  const [settingsMap, setSettingsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const token = localStorage.getItem('serviceToken');
      if (!token) return;

      const data = await fetchAdminSettingsApi(token);
      setSettingsMap(data.map || {});
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (key, value) => {
    setSettingsMap((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const token = localStorage.getItem('serviceToken');
      const updated = await updateAdminSettingsApi(token, settingsMap);
      setSettingsMap(updated.map || settingsMap);
      setStatusMsg({ type: 'success', text: 'Clinic settings updated successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Clinic Site Settings
          </h2>
          <p className="text-slate-500 text-sm">
            Configure clinic contact details, doctor profile, location, operating schedule, and Google Maps embed.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadSettings}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sand bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-xs transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-accent' : ''} />
            <span>Reload</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-soft text-primary text-sm font-bold shadow-gold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5 transition-all ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-sand pb-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-primary'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-accent' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Cards */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Clinic Profile */}
        {activeTab === 'clinic' && (
          <div className="bg-white rounded-3xl border border-sand/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-sand/60 pb-4">
              <h3 className="font-serif text-lg font-bold text-primary">Clinic Branding & Leadership</h3>
              <p className="text-xs text-slate-500">General clinic identity and lead physician information</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={settingsMap.clinic_name || ''}
                  onChange={(e) => handleChange('clinic_name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clinic Tagline
                </label>
                <input
                  type="text"
                  value={settingsMap.clinic_tagline || ''}
                  onChange={(e) => handleChange('clinic_tagline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Lead Doctor Name
                </label>
                <input
                  type="text"
                  value={settingsMap.doctor_name || ''}
                  onChange={(e) => handleChange('doctor_name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Doctor Qualifications
                </label>
                <input
                  type="text"
                  value={settingsMap.doctor_qualifications || ''}
                  onChange={(e) => handleChange('doctor_qualifications', e.target.value)}
                  placeholder="MD (Dermatology), Fellow in Aesthetic Medicine"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                About Clinic Narrative (Homepage & About page)
              </label>
              <textarea
                rows={4}
                value={settingsMap.about_text || ''}
                onChange={(e) => handleChange('about_text', e.target.value)}
                className="w-full p-4 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Contact & Location */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-3xl border border-sand/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-sand/60 pb-4">
              <h3 className="font-serif text-lg font-bold text-primary">Contact Details & Map Coordinates</h3>
              <p className="text-xs text-slate-500">Patient communication lines and interactive Google Maps iframe</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Phone
                </label>
                <input
                  type="text"
                  value={settingsMap.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  WhatsApp Support Number
                </label>
                <input
                  type="text"
                  value={settingsMap.whatsapp_number || ''}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clinic Notification Email
                </label>
                <input
                  type="email"
                  value={settingsMap.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Physical Clinic Address
              </label>
              <textarea
                rows={2}
                value={settingsMap.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Suite 402, Elite Medical Tower, Bandra West, Mumbai, Maharashtra 400050"
                className="w-full p-3.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
              />
            </div>

            {/* Google Maps Embed URL with Live Preview */}
            <div className="space-y-3 pt-4 border-t border-sand/60">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Google Maps Embed URL
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Paste the full HTTPS embed URL from Google Maps (e.g., https://www.google.com/maps/embed?pb=...)
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                  Live Preview Active
                </span>
              </div>

              <input
                type="url"
                value={settingsMap.map_embed_url || ''}
                onChange={(e) => handleChange('map_embed_url', e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />

              {/* Live Preview Container */}
              <div className="rounded-2xl border border-sand overflow-hidden bg-slate-100 shadow-inner">
                {settingsMap.map_embed_url && settingsMap.map_embed_url.startsWith('http') ? (
                  <iframe
                    src={settingsMap.map_embed_url}
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps Live Preview"
                    className="w-full"
                  />
                ) : (
                  <div className="h-56 flex flex-col items-center justify-center text-slate-400 text-sm">
                    <MapPin size={28} className="text-slate-300 mb-2" />
                    <span>Enter a valid Google Maps embed URL above to see the live iframe preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Operating Hours */}
        {activeTab === 'hours' && (
          <div className="bg-white rounded-3xl border border-sand/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-sand/60 pb-4">
              <h3 className="font-serif text-lg font-bold text-primary">Operating Hours & Availability</h3>
              <p className="text-xs text-slate-500">Displayed on the Contact page, Footer, and Appointment Stepper</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Working Hours Schedule
              </label>
              <textarea
                rows={4}
                value={settingsMap.working_hours || ''}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                placeholder="Monday - Saturday: 10:00 AM - 7:00 PM&#10;Sunday: By Prior Appointment Only"
                className="w-full p-4 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Use line breaks to cleanly separate weekdays from weekends or special doctor consultation slots.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Social Media */}
        {activeTab === 'socials' && (
          <div className="bg-white rounded-3xl border border-sand/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-sand/60 pb-4">
              <h3 className="font-serif text-lg font-bold text-primary">Social Media Profiles</h3>
              <p className="text-xs text-slate-500">Public clinic channels displayed in Navbar and Footer</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Instagram Profile URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <InstagramIcon size={17} />
                  </div>
                  <input
                    type="url"
                    value={settingsMap.instagram_url || ''}
                    onChange={(e) => handleChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/skinglowclinic"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Facebook Page URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FacebookIcon size={17} />
                  </div>
                  <input
                    type="url"
                    value={settingsMap.facebook_url || ''}
                    onChange={(e) => handleChange('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/skinglowclinic"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  YouTube Channel URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <YoutubeIcon size={17} />
                  </div>
                  <input
                    type="url"
                    value={settingsMap.youtube_url || ''}
                    onChange={(e) => handleChange('youtube_url', e.target.value)}
                    placeholder="https://youtube.com/@skinglowclinic"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-accent to-accent-soft text-primary font-bold text-sm shadow-gold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Saving Changes...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
