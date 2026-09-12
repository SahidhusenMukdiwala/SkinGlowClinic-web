'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Search, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  CalendarPlus,
  ArrowRight,
  RotateCcw,
  Lock,
  Loader2
} from 'lucide-react';
import { TREATMENT_CATEGORIES, CATEGORY_MAP } from '@/lib/constants';
import { 
  fetchTreatments,
  bookAppointmentApi, 
  fetchBookedSlotsApi, 
  loginApi, 
  registerCustomerApi, 
  getCurrentUser 
} from '@/lib/api';

const TIME_SLOTS = {
  morning: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'],
  evening: ['02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM', '07:00 PM'],
};

export default function BookingWizard({ treatments = [], settings = {}, categories = [] }) {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get('treatment');

  // Build dynamic category filter tabs from Admin API with fallback
  const categoryList = useMemo(() => {
    if (categories && categories.length > 0) {
      return [
        { id: 0, key: 'all', name: 'All Treatments' },
        ...categories.map((c) => ({ id: c.id, key: `cat-${c.id}`, name: c.name })),
      ];
    }
    return TREATMENT_CATEGORIES;
  }, [categories]);

  // Build dynamic category lookup map
  const categoryMap = useMemo(() => {
    const map = { ...CATEGORY_MAP };
    if (categories && categories.length > 0) {
      categories.forEach((c) => {
        map[c.id] = c.name;
      });
    }
    return map;
  }, [categories]);

  // Wizard Step State (1: Treatment, 2: Schedule, 3: Details, 4: Confirmed)
  const [currentStep, setCurrentStep] = useState(1);


  // Auth & Patient State
  const [currentUser, setCurrentUser] = useState(null);
  const [inlineAuthMode, setInlineAuthMode] = useState('login'); // 'login' | 'register'
  const [inlineAuthLoading, setInlineAuthLoading] = useState(false);
  const [inlineAuthError, setInlineAuthError] = useState('');
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authMobile, setAuthMobile] = useState('');

  // Step 1 State: Treatment Selection
  const [treatmentList, setTreatmentList] = useState(treatments);
  const [loadingTreatments, setLoadingTreatments] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  // Step 2 State: Schedule Selection
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Step 3 State: Patient Details
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    email: '',
    message: '',
    consent: true,
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Auto-sync current user and prefill patient contact details
  useEffect(() => {
    const syncUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const rawMobile = user.mobile || '';
        const cleanMobile = rawMobile.replace(/^\+?91[\s-]*/, '').replace(/\D/g, '').slice(-10);
        setFormData((prev) => ({
          ...prev,
          patient_name: prev.patient_name || user.full_name || '',
          email: prev.email || user.email || '',
          phone: prev.phone ? prev.phone.replace(/^\+?91[\s-]*/, '').replace(/\D/g, '').slice(-10) : cleanMobile,
        }));
      }
    };

    syncUser();
    window.addEventListener('auth-changed', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('auth-changed', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);


  // 1-second debounce timer for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Fetch treatments from API whenever selected category or debounced search changes
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (treatments && treatments.length > 0 && selectedCategory === 0 && !debouncedSearch) {
        setTreatmentList(treatments);
        return;
      }
    }

    let isMounted = true;
    setLoadingTreatments(true);

    fetchTreatments({
      category: selectedCategory === 0 ? null : selectedCategory,
      search: debouncedSearch.trim() || null,
    })
      .then((data) => {
        if (isMounted) {
          setTreatmentList(data || []);
          setLoadingTreatments(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch treatments from API', err);
        if (isMounted) {
          setLoadingTreatments(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, debouncedSearch]);

  // Pre-select treatment from URL query parameter if present
  useEffect(() => {
    if (treatmentList && treatmentList.length > 0) {
      if (preselectedSlug) {
        const found = treatmentList.find(t => t.slug === preselectedSlug);
        if (found) {
          setSelectedTreatment(found);
          setCurrentStep(2);
          return;
        }
      }
      if (!selectedTreatment) {
        setSelectedTreatment(treatmentList[0]);
      }
    }
  }, [treatmentList, preselectedSlug, selectedTreatment]);

  // Generate 14-day quick date picker items
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({
        iso: isoDate,
        dayName,
        dayNumber,
        monthName,
        isToday: i === 0,
      });
    }
    return dates;
  }, []);

  // Initialize selected date to tomorrow
  useEffect(() => {
    if (!selectedDate && dateOptions.length > 0) {
      setSelectedDate(dateOptions[1]?.iso || dateOptions[0]?.iso);
    }
  }, [dateOptions, selectedDate]);

  // Dynamically query booked time slots whenever appointment date changes
  useEffect(() => {
    if (!selectedDate) return;
    let isMounted = true;
    setLoadingSlots(true);

    fetchBookedSlotsApi(selectedDate).then(slots => {
      if (isMounted) {
        setBookedSlots(slots || []);
        setLoadingSlots(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  // Helper to check if a specific time slot is already reserved
  const normalizeSlot = (s) => (s ? s.replace(/^0/, '').trim().toUpperCase() : '');
  const isSlotBooked = (slot) => {
    const norm = normalizeSlot(slot);
    return bookedSlots.some(b => normalizeSlot(b) === norm);
  };


  // Helper to test if a time slot is in the past for today's date
  const isSlotInPast = (timeStr) => {
    if (!selectedDate) return false;
    const todayIso = new Date().toISOString().split('T')[0];
    if (selectedDate !== todayIso) return false;

    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return false;
    let [_, hours, minutes, period] = match;
    let h = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (period.toUpperCase() === 'AM' && h === 12) h = 0;

    const slotTime = new Date();
    slotTime.setHours(h, parseInt(minutes, 10), 0, 0);

    const cutoff = new Date();
    cutoff.setMinutes(cutoff.getMinutes() + 60);

    return slotTime < cutoff;
  };

  const goToStep = (step) => {
    setErrorMessage(null);
    setCurrentStep(step);
  };

  const handleNextFromStep1 = () => {
    if (!selectedTreatment) {
      setErrorMessage('Please select a clinical procedure to continue.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!selectedDate) {
      setErrorMessage('Please select an appointment date.');
      return;
    }
    if (!selectedTime) {
      setErrorMessage('Please select your preferred time slot.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(3);
  };

  const handleInlineLogin = async (e) => {
    e.preventDefault();
    setInlineAuthLoading(true);
    setInlineAuthError('');

    try {
      const data = await loginApi({
        identifier: authIdentifier.trim(),
        password: authPassword,
      });
      const user = data.user;
      setCurrentUser(user);
      const rawMobile = user.mobile || '';
      const cleanMobile = rawMobile.replace(/^\+?91[\s-]*/, '').replace(/\D/g, '').slice(-10);
      setFormData((prev) => ({
        ...prev,
        patient_name: user.full_name || prev.patient_name,
        email: user.email || prev.email,
        phone: cleanMobile || prev.phone,
      }));
    } catch (err) {
      setInlineAuthError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setInlineAuthLoading(false);
    }
  };

  const handleInlineRegister = async (e) => {
    e.preventDefault();
    setInlineAuthLoading(true);
    setInlineAuthError('');

    const cleanMobile = authMobile.trim().replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      setInlineAuthError('Please enter a valid 10-digit mobile number.');
      setInlineAuthLoading(false);
      return;
    }

    if (authPassword.length < 6) {
      setInlineAuthError('Password must be at least 6 characters.');
      setInlineAuthLoading(false);
      return;
    }

    try {
      const data = await registerCustomerApi({
        full_name: authFullName.trim(),
        email: authEmail.trim().toLowerCase(),
        mobile: `+91 ${cleanMobile}`,
        password: authPassword,
      });
      const user = data.user;
      setCurrentUser(user);
      setFormData((prev) => ({
        ...prev,
        patient_name: user.full_name || prev.patient_name,
        email: user.email || prev.email,
        phone: cleanMobile,
      }));
    } catch (err) {
      setInlineAuthError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setInlineAuthLoading(false);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      setErrorMessage('Please sign in or create an account to book your consultation.');
      return;
    }

    if (!formData.patient_name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanDigits = (formData.phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanDigits || cleanDigits.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.consent) {
      setErrorMessage('Please accept the clinic consultation terms to confirm booking.');
      return;
    }

    let combinedDateTime = new Date(`${selectedDate} 10:00:00`);
    if (selectedTime) {
      const match = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let [_, hours, minutes, period] = match;
        let h = parseInt(hours, 10);
        if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
        if (period.toUpperCase() === 'AM' && h === 12) h = 0;
        combinedDateTime = new Date(selectedDate);
        combinedDateTime.setHours(h, parseInt(minutes, 10), 0, 0);
      }
    }

    const payload = {
      patient_name: formData.patient_name.trim(),
      email: formData.email.trim(),
      phone: `+91 ${cleanDigits}`,
      treatment_id: selectedTreatment.id,
      preferred_date_time: combinedDateTime.toISOString(),
      message: formData.message.trim(),
    };

    setIsSubmitting(true);
    try {
      const response = await bookAppointmentApi(payload);
      setBookingConfirmation(response.data);
      setCurrentStep(4);
    } catch (err) {
      const msg = err.message || 'Failed to submit appointment. Please check your details.';
      setErrorMessage(msg);

      if (
        msg.toLowerCase().includes('reserved') ||
        msg.toLowerCase().includes('alternate slot') ||
        msg.toLowerCase().includes('conflict') ||
        msg.toLowerCase().includes('already')
      ) {
        fetchBookedSlotsApi(selectedDate).then(slots => setBookedSlots(slots || []));
        setSelectedTime('');
        setCurrentStep(2);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDisplayDate = (isoStr) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGoogleCalendarUrl = () => {
    if (!bookingConfirmation || !selectedDate || !selectedTime) return '#';
    const title = encodeURIComponent(`Appointment: ${selectedTreatment?.title} at SkinGlow Clinic`);
    const details = encodeURIComponent(
      `SkinGlow Clinic Consultation & Procedure: ${selectedTreatment?.title}\n` +
      `Doctor: Dr. Aisha Sharma, MD\n` +
      `Reference ID: ${bookingConfirmation.reference_id || 'SG-APPT'}\n` +
      `Address: ${settings.address || 'Radiant Medical Enclave, Linking Road, Bandra West, Mumbai'}\n` +
      `Phone: ${settings.phone || '+91 98201 23456'}`
    );
    const location = encodeURIComponent(settings.address || 'SkinGlow Clinic, Bandra West, Mumbai');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* 3-Step Interactive Stepper */}
      {currentStep < 4 && (
        <div className="flex items-center justify-between relative mb-10 px-4 max-w-xl mx-auto">
          <div className="absolute top-5 left-[15%] right-[15%] h-0.5 bg-gray-200 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-accent to-accent-soft transition-all duration-300"
              style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
            />
          </div>

          {/* Step 1 Pill */}
          <button 
            type="button"
            className="relative z-10 flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer"
            onClick={() => goToStep(1)}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-semibold text-xs sm:text-sm transition-all shadow-sm ${
              currentStep === 1
                ? 'border-accent bg-primary text-accent ring-4 ring-accent/20'
                : currentStep > 1
                ? 'border-accent bg-gradient-to-r from-accent to-accent-soft text-primary'
                : 'border-gray-200 bg-white text-gray-400'
            }`}>
              {currentStep > 1 ? <Check size={18} strokeWidth={2.5} /> : '1'}
            </div>
            <span className={`text-xs font-semibold whitespace-nowrap ${currentStep === 1 ? 'text-primary' : currentStep > 1 ? 'text-accent-hover' : 'text-clinic-muted'}`}>
              Select Procedure
            </span>
          </button>

          {/* Step 2 Pill */}
          <button 
            type="button"
            className="relative z-10 flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer disabled:cursor-not-allowed"
            onClick={() => selectedTreatment && goToStep(2)}
            disabled={!selectedTreatment}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-semibold text-xs sm:text-sm transition-all shadow-sm ${
              currentStep === 2
                ? 'border-accent bg-primary text-accent ring-4 ring-accent/20'
                : currentStep > 2
                ? 'border-accent bg-gradient-to-r from-accent to-accent-soft text-primary'
                : 'border-gray-200 bg-white text-gray-400'
            }`}>
              {currentStep > 2 ? <Check size={18} strokeWidth={2.5} /> : '2'}
            </div>
            <span className={`text-xs font-semibold whitespace-nowrap ${currentStep === 2 ? 'text-primary' : currentStep > 2 ? 'text-accent-hover' : 'text-clinic-muted'}`}>
              Date & Time
            </span>
          </button>

          {/* Step 3 Pill */}
          <button 
            type="button"
            className="relative z-10 flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer disabled:cursor-not-allowed"
            onClick={() => selectedTreatment && selectedDate && selectedTime && goToStep(3)}
            disabled={!selectedTreatment || !selectedDate || !selectedTime}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-semibold text-xs sm:text-sm transition-all shadow-sm ${
              currentStep === 3
                ? 'border-accent bg-primary text-accent ring-4 ring-accent/20'
                : 'border-gray-200 bg-white text-gray-400'
            }`}>
              3
            </div>
            <span className={`text-xs font-semibold whitespace-nowrap ${currentStep === 3 ? 'text-primary' : 'text-clinic-muted'}`}>
              Patient Details
            </span>
          </button>
        </div>
      )}

      {/* Main Wizard Card */}
      <div className="bg-white border border-clinic-border rounded-2xl p-6 sm:p-10 shadow-md min-h-[520px] flex flex-col relative">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: SELECT PROCEDURE */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6 pb-4 border-b border-clinic-border-subtle">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-1">
                Choose Your Clinical Procedure
              </h2>
              <p className="text-sm text-clinic-muted">
                Select the specialized treatment you wish to receive, or choose a comprehensive diagnostic consultation.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categoryList.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-accent shadow-sm'
                        : 'bg-clinic-bg border border-clinic-border-subtle text-clinic-text hover:bg-clinic-bg-alt'
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Treatment Search Filter */}
            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clinic-muted" size={18} />
              <input
                type="text"
                placeholder="Search procedures by name or concern (acne, laser, wrinkle)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-clinic-bg border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text shadow-sm"
              />
              {loadingTreatments && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-clinic-muted">
                  <Loader2 size={16} className="animate-spin text-accent" />
                  <span className="hidden sm:inline text-[11px]">Searching...</span>
                </div>
              )}
            </div>

            {/* Treatments Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 max-h-[460px] overflow-y-auto pr-1">
              {loadingTreatments && treatmentList.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-clinic-muted gap-3">
                  <Loader2 size={24} className="animate-spin text-accent" />
                  <p className="text-xs sm:text-sm">Fetching clinical procedures from server...</p>
                </div>
              ) : treatmentList.length > 0 ? (
                treatmentList.map(item => {
                  const isSelected = selectedTreatment?.id === item.id;
                  const catLabel = item.category?.name || item.category_name || categoryMap[Number(item.category_id || item.category)] || 'Clinical Procedure';
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-accent bg-amber-50/40 shadow-sm ring-1 ring-accent'
                          : 'border-clinic-border-subtle bg-clinic-bg hover:border-accent/40'
                      }`}
                      onClick={() => setSelectedTreatment(item)}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-accent-hover bg-accent/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                          {catLabel}
                        </span>
                        <h4 className="font-heading text-base font-bold text-primary mb-2 line-clamp-1">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed line-clamp-2 mb-4">{item.short_description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-clinic-muted pt-3 border-t border-dashed border-clinic-border-subtle mt-auto">
                        <span className="inline-flex items-center gap-1"><Clock size={13} /> {item.duration || '45 mins'}</span>
                        <span className="inline-flex items-center gap-1"><Sparkles size={13} /> MD Supervised</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-clinic-muted">
                  No clinical procedures match your search or filter criteria.
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-clinic-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-clinic-muted">
                <span>Selected: </span>
                <span className="font-semibold text-primary">
                  {selectedTreatment ? selectedTreatment.title : 'None chosen yet'}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary w-full sm:w-auto"
                onClick={handleNextFromStep1}
                disabled={!selectedTreatment}
              >
                <span>Continue to Schedule</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE DATE & TIME */}
        {currentStep === 2 && (
          <div>
            <div className="mb-6 pb-4 border-b border-clinic-border-subtle">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-1">
                Select Date & Preferred Time
              </h2>
              <p className="text-sm text-clinic-muted">
                Appointments with Dr. Aisha Sharma are scheduled in dedicated clinical slots to ensure zero wait times.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              {/* Date Selection Panel */}
              <div className="lg:col-span-6">
                <h3 className="font-heading text-base font-bold text-primary mb-3 flex items-center gap-2">
                  <CalendarIcon size={18} className="text-accent" />
                  <span>1. Choose Appointment Date</span>
                </h3>

                <div className="grid grid-cols-4 gap-2.5 mb-4">
                  {dateOptions.map(dateObj => {
                    const isSelected = selectedDate === dateObj.iso;
                    return (
                      <button
                        key={dateObj.iso}
                        type="button"
                        className={`border rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-accent bg-primary text-white shadow-sm'
                            : 'border-clinic-border-subtle bg-clinic-bg hover:bg-clinic-bg-alt text-clinic-text'
                        }`}
                        onClick={() => setSelectedDate(dateObj.iso)}
                      >
                        <span className={`text-[11px] uppercase font-bold ${isSelected ? 'text-accent' : 'text-clinic-muted'}`}>{dateObj.dayName}</span>
                        <span className="text-xl font-bold leading-none">{dateObj.dayNumber}</span>
                        <span className={`text-[11px] ${isSelected ? 'text-accent' : 'text-clinic-muted'}`}>{dateObj.monthName}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-dashed border-clinic-border-subtle">
                  <span className="text-xs text-clinic-muted whitespace-nowrap">Prefer a future date?</span>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-clinic-border-subtle bg-clinic-bg text-xs sm:text-sm text-clinic-text"
                  />
                </div>
              </div>

              {/* Time Slots Panel */}
              <div className="lg:col-span-6">
                <h3 className="font-heading text-base font-bold text-primary mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-accent" />
                  <span>2. Choose Available Time Slot</span>
                </h3>

                {/* Morning Slots */}
                <div className="mb-5">
                  <div className="text-xs uppercase font-bold text-clinic-muted tracking-wider mb-2">Morning Sessions (10:00 AM – 01:00 PM)</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.morning.map(slot => {
                      const isPast = isSlotInPast(slot);
                      const isBooked = isSlotBooked(slot);
                      const isSelected = selectedTime === slot;
                      const isDisabled = isPast || isBooked;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isDisabled}
                          className={`p-2.5 rounded-lg border text-xs sm:text-sm font-medium text-center transition-all ${
                            isBooked
                              ? 'opacity-60 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400 flex flex-col items-center justify-center py-1.5'
                              : isSelected
                              ? 'bg-accent text-primary font-semibold border-accent shadow-sm'
                              : isPast
                              ? 'opacity-35 cursor-not-allowed bg-clinic-bg-alt border-clinic-border-subtle line-through'
                              : 'bg-clinic-bg border-clinic-border-subtle text-clinic-text hover:border-accent'
                          }`}
                          onClick={() => !isDisabled && setSelectedTime(slot)}
                        >
                          <span>{slot}</span>
                          {isBooked && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-0.5">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon & Evening Slots */}
                <div>
                  <div className="text-xs uppercase font-bold text-clinic-muted tracking-wider mb-2">Afternoon & Evening (02:30 PM – 07:00 PM)</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.evening.map(slot => {
                      const isPast = isSlotInPast(slot);
                      const isBooked = isSlotBooked(slot);
                      const isSelected = selectedTime === slot;
                      const isDisabled = isPast || isBooked;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isDisabled}
                          className={`p-2.5 rounded-lg border text-xs sm:text-sm font-medium text-center transition-all ${
                            isBooked
                              ? 'opacity-60 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400 flex flex-col items-center justify-center py-1.5'
                              : isSelected
                              ? 'bg-accent text-primary font-semibold border-accent shadow-sm'
                              : isPast
                              ? 'opacity-35 cursor-not-allowed bg-clinic-bg-alt border-clinic-border-subtle line-through'
                              : 'bg-clinic-bg border-clinic-border-subtle text-clinic-text hover:border-accent'
                          }`}
                          onClick={() => !isDisabled && setSelectedTime(slot)}
                        >
                          <span>{slot}</span>
                          {isBooked && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-0.5">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-clinic-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                className="btn btn-secondary w-full sm:w-auto"
                onClick={() => goToStep(1)}
              >
                <ChevronLeft size={18} />
                <span>Back to Procedures</span>
              </button>

              <button
                type="button"
                className="btn btn-primary w-full sm:w-auto"
                onClick={handleNextFromStep2}
                disabled={!selectedDate || !selectedTime}
              >
                <span>Continue to Patient Details</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PATIENT DETAILS & CONFIRMATION */}
        {currentStep === 3 && (
          <div>
            <div className="mb-6 pb-4 border-b border-clinic-border-subtle">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-1">
                Patient Details & Booking Review
              </h2>
              <p className="text-sm text-clinic-muted">
                {currentUser
                  ? 'Review your contact information and confirm your clinical consultation.'
                  : 'Please sign in or create a patient account to reserve your clinical session.'}
              </p>
            </div>

            <form onSubmit={handleSubmitBooking}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                {/* Contact Fields Column */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {currentUser ? (
                    <>
                      {/* Logged-in Verified Patient Banner */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-primary">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {currentUser.full_name ? currentUser.full_name[0].toUpperCase() : 'P'}
                          </div>
                          <div>
                            <p className="font-semibold text-primary">Verified Account: {currentUser.full_name}</p>
                            <p className="text-[11px] text-slate-500">{currentUser.email} • {currentUser.mobile}</p>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          Verified
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1.5">
                          Full Legal Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Priya Sharma"
                          value={formData.patient_name}
                          onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-clinic-bg border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-primary mb-1.5">
                            Mobile Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center rounded-xl bg-clinic-bg border border-clinic-border-subtle focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all overflow-hidden">
                            <span className="px-3.5 py-2.5 bg-sand/30 border-r border-clinic-border-subtle text-xs font-bold text-primary select-none shrink-0 tracking-wide">
                              +91
                            </span>
                            <input
                              type="tel"
                              inputMode="numeric"
                              maxLength={10}
                              placeholder="9820123456"
                              value={formData.phone}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData({ ...formData, phone: val });
                              }}
                              className="w-full px-3.5 py-2.5 bg-transparent focus:outline-none text-sm text-clinic-text font-medium placeholder:text-clinic-muted"
                              required
                            />
                          </div>
                          {formData.phone && formData.phone.length > 0 && formData.phone.length < 10 ? (
                            <p className="text-[11px] text-amber-600 mt-1 font-medium">
                              Enter 10-digit number ({formData.phone.length}/10 entered)
                            </p>
                          ) : (
                            <p className="text-[11px] text-clinic-text-subtle mt-1">
                              Enter 10-digit mobile number
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-primary mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. priya.sharma@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-clinic-bg border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1.5">
                          Specific Skin Concerns or Medical History (Optional)
                        </label>
                        <textarea
                          placeholder="Mention any active breakouts, allergies, prior laser treatments, or questions for Dr. Sharma..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-clinic-bg border border-clinic-border-subtle focus:border-accent focus:outline-none text-sm text-clinic-text min-h-[90px]"
                        />
                      </div>

                      {/* <label className="flex items-start gap-2.5 text-xs text-clinic-muted cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-0.5 accent-accent"
                        />
                        <span>
                          I understand that SkinGlow Clinic requires 4 hours notice for appointment rescheduling. My medical data is safeguarded in strict clinical confidentiality.
                        </span>
                      </label> */}
                    </>
                  ) : (
                    /* INLINE AUTHENTICATION CARD */
                    <div className="p-6 sm:p-7 rounded-3xl bg-white border border-sand/70 shadow-md">
                      <div className="mb-5">
                        <div className="badge mb-2">
                          <Sparkles size={13} className="text-accent" />
                          <span>Patient Sign-In Required</span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-primary">
                          {inlineAuthMode === 'login' ? 'Sign In to Finalize Booking' : 'Create Account to Finalize Booking'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {inlineAuthMode === 'login'
                            ? 'Enter your registered email or mobile to confirm this reservation.'
                            : 'Sign up in 30 seconds to lock in your appointment slot with Dr. Sharma.'}
                        </p>
                      </div>

                      {/* Auth Tabs */}
                      <div className="flex rounded-2xl bg-sand/30 p-1 mb-5 border border-sand/40 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => {
                            setInlineAuthMode('login');
                            setInlineAuthError('');
                          }}
                          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                            inlineAuthMode === 'login' ? 'bg-white text-primary shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInlineAuthMode('register');
                            setInlineAuthError('');
                          }}
                          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                            inlineAuthMode === 'register' ? 'bg-white text-primary shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          Create Account
                        </button>
                      </div>

                      {inlineAuthError && (
                        <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                          <AlertCircle size={15} className="shrink-0" />
                          <span>{inlineAuthError}</span>
                        </div>
                      )}

                      {inlineAuthMode === 'login' ? (
                        <div className="flex flex-col gap-3.5">
                          <div>
                            <label className="block text-xs font-semibold text-primary mb-1">
                              Email Address or Mobile Number
                            </label>
                            <input
                              type="text"
                              placeholder="name@email.com or +91 9820123456"
                              value={authIdentifier}
                              onChange={(e) => setAuthIdentifier(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-primary mb-1">Password</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleInlineLogin}
                            disabled={inlineAuthLoading || !authIdentifier || !authPassword}
                            className="mt-2 w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-accent font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                          >
                            {inlineAuthLoading ? (
                              <>
                                <Loader2 size={16} className="animate-spin text-accent" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <span>Sign In & Continue Booking</span>
                                <ArrowRight size={15} />
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-primary mb-1">Full Legal Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Priya Sharma"
                              value={authFullName}
                              onChange={(e) => setAuthFullName(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-primary mb-1">Email Address</label>
                              <input
                                type="email"
                                placeholder="you@email.com"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-primary mb-1">Mobile Number</label>
                              <div className="flex items-center rounded-xl border border-sand/70 bg-cream/30 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent overflow-hidden transition-all">
                                <span className="px-3 py-2 bg-sand/30 border-r border-sand/70 text-xs font-bold text-primary select-none shrink-0">
                                  +91
                                </span>
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  maxLength={10}
                                  placeholder="9820123456"
                                  value={authMobile}
                                  onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setAuthMobile(digits);
                                  }}
                                  className="w-full px-3 py-2 bg-transparent text-sm text-primary focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-primary mb-1">Choose Password</label>
                            <input
                              type="password"
                              placeholder="At least 6 characters"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-sand/70 bg-cream/30 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleInlineRegister}
                            disabled={inlineAuthLoading || !authFullName || !authEmail || !authMobile || !authPassword}
                            className="mt-2 w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-accent font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                          >
                            {inlineAuthLoading ? (
                              <>
                                <Loader2 size={16} className="animate-spin text-accent" />
                                <span>Creating Account...</span>
                              </>
                            ) : (
                              <>
                                <span>Create Account & Continue Booking</span>
                                <ArrowRight size={15} />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Booking Summary Column */}
                <div className="lg:col-span-5">
                  <div className="bg-clinic-bg p-6 rounded-2xl border border-clinic-border flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-clinic-border-subtle">
                      <h4 className="font-heading text-base font-bold text-primary">Appointment Summary</h4>
                      <span className="badge">Pending Confirmation</span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase font-bold text-clinic-muted tracking-wider block">Procedure</span>
                      <span className="text-base font-bold text-primary block">{selectedTreatment?.title}</span>
                      <span className="text-xs text-clinic-muted">Duration: {selectedTreatment?.duration || '45-60 mins'} • Supervised by Dr. Aisha Sharma</span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase font-bold text-clinic-muted tracking-wider block">Scheduled Slot</span>
                      <span className="text-base font-bold text-accent-hover block">{formatDisplayDate(selectedDate)} at {selectedTime}</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-clinic-border-subtle text-xs text-clinic-muted leading-relaxed">
                      <strong className="text-primary font-semibold">SkinGlow Aesthetic Clinic</strong><br />
                      {settings.address || 'Radiant Medical Enclave, Linking Road, Bandra West, Mumbai'}<br />
                      Helpline: {settings.phone || '+91 98201 23456'}
                    </div>

                    <div className="text-[11px] text-clinic-muted italic leading-relaxed">
                      ✨ No pre-payment required. Consultation and procedure fees are settled securely at the clinic.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto pt-6 border-t border-clinic-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  className="btn btn-secondary w-full sm:w-auto"
                  onClick={() => goToStep(2)}
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={18} />
                  <span>Back to Schedule</span>
                </button>

                <button
                  type="submit"
                  className="btn btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !currentUser}
                >
                  {isSubmitting ? (
                    <span>Registering Booking...</span>
                  ) : !currentUser ? (
                    <span>Please Sign In Above to Book</span>
                  ) : (
                    <>
                      <span>Confirm & Book Appointment</span>
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION SCREEN */}
        {currentStep === 4 && bookingConfirmation && (
          <div className="text-center py-8 px-4 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl text-primary font-bold mb-2">
              Appointment Request Confirmed!
            </h2>
            <p className="text-sm sm:text-base text-clinic-muted mb-6">
              Thank you, <strong>{bookingConfirmation.patient_name}</strong>. Your appointment request has been logged in our clinic management system.
            </p>

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-accent text-sm font-semibold tracking-wide mb-6">
              <Sparkles size={16} />
              <span>Reference: # ${bookingConfirmation.id}</span>
            </div>

            <div className="w-full bg-clinic-bg border border-clinic-border rounded-2xl p-6 sm:p-8 text-left mb-6">
              <div className="flex justify-between py-2.5 border-b border-dashed border-clinic-border-subtle text-xs sm:text-sm">
                <span className="text-clinic-muted">Procedure</span>
                <span className="font-semibold text-primary">{bookingConfirmation.treatment?.title || selectedTreatment?.title}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-dashed border-clinic-border-subtle text-xs sm:text-sm">
                <span className="text-clinic-muted">Scheduled Slot</span>
                <span className="font-semibold text-accent-hover">{formatDisplayDate(bookingConfirmation.preferred_date_time || selectedDate)} at {selectedTime}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-dashed border-clinic-border-subtle text-xs sm:text-sm">
                <span className="text-clinic-muted">Attending Specialist</span>
                <span className="font-semibold text-primary">Dr. Aisha Sharma, MD</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-dashed border-clinic-border-subtle text-xs sm:text-sm">
                <span className="text-clinic-muted">Registered Phone</span>
                <span className="font-semibold text-primary">{bookingConfirmation.phone}</span>
              </div>
              <div className="flex justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-clinic-muted">Confirmation Email</span>
                <span className="font-semibold text-primary">{bookingConfirmation.email}</span>
              </div>
            </div>

            <div className="w-full bg-accent/10 border-l-4 border-accent p-4 rounded-r-xl text-left text-xs sm:text-sm text-clinic-text leading-relaxed mb-8">
              <strong>What Happens Next?</strong>
              <p className="mt-1">
                1. A confirmation receipt has been dispatched to <strong>{bookingConfirmation.email}</strong>.<br />
                2. Our clinical coordinator will call you within 2 business hours to confirm your arrival window.<br />
                3. Need immediate help? Call our front desk at <a href={`tel:${(settings.phone || '+919820123456').replace(/\s+/g, '')}`} className="font-semibold text-primary underline">{settings.phone || '+91 98201 23456'}</a>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary text-xs sm:text-sm"
              >
                <CalendarPlus size={16} />
                <span>Add to Google Calendar</span>
              </a>

              <button
                type="button"
                className="btn btn-secondary text-xs sm:text-sm"
                onClick={() => {
                  setBookingConfirmation(null);
                  setCurrentStep(1);
                  setFormData({ patient_name: '', phone: '', email: '', message: '', consent: true });
                }}
              >
                <RotateCcw size={16} />
                <span>Book Another Session</span>
              </button>

              <Link href="/" className="btn btn-primary text-xs sm:text-sm">
                <span>Return to Homepage</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
