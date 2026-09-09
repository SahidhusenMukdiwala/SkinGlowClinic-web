import axiosServices from './axios';
import { CLINIC_DEFAULTS } from './constants';

const FALLBACK_TREATMENTS = [
  {
    id: 1,
    title: 'HydraFacial Elite MD',
    slug: 'hydrafacial-elite-md',
    category: 1,
    duration: '45-60 mins',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Medical-grade hydradermabrasion that cleanses, exfoliates, extracts impurities, and hydrates with antioxidant serums.',
    full_description: 'HydraFacial Elite MD is a multi-step clinical treatment that combines the benefits of next-level hydradermabrasion, automated painless extractions, and a patented Vortex-Fusion delivery of skin-nourishing antioxidants, peptides, and hyaluronic acid.\n\n### Clinical Procedure Overview\n1. **Deep Cleansing & Exfoliation**: Gentle peeling agents loosen dead epidermal cells and reveal fresh, radiant layers underneath.\n2. **Painless Vacuum Extraction**: Automated vortex suction effortlessly unclogs congested pores without manual trauma or inflammation.\n3. **Targeted Booster Infusion**: Tailored peptides and brightening complexes address your unique pigmentation, fine lines, or dehydration concerns.\n4. **Antioxidant Saturation**: Rich botanical antioxidants seal the dermal barrier, providing an instantaneous, dewy radiance with zero downtime.\n\n### Ideal Candidates\nRecommended for patients battling dullness, congested pores, uneven texture, fine lines, and seasonal dryness seeking radiant skin before events or as monthly maintenance.',
  },
  {
    id: 2,
    title: 'Advanced Medical Chemical Peels',
    slug: 'medical-chemical-peels',
    category: 1,
    duration: '30-45 mins',
    image_url: 'https://images.unsplash.com/photo-1512290900672-1a0149021873?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Tailored AHA/BHA and TCA clinical peels designed to resurface hyperpigmentation, active acne, and stubborn sun spots.',
    full_description: 'Our dermatologist-supervised chemical peeling protocols utilize bespoke blends of glycolic acid, salicylic acid, lactic acid, and modified TCA to stimulate regulated cellular turnover and collagen renewal.\n\n### Treatment Highlights\n- **Acne Clarifying Peel**: Penetrates deep into the pilosebaceous units to dissolve comedones, regulate sebum, and diminish P. acnes bacteria.\n- **Radiance Melasma Peel**: Gently breaks down melanin clusters, visibly fading post-inflammatory hyperpigmentation (PIH) and melasma patches.\n- **Renewal Anti-Aging Peel**: Accelerates dermal regeneration, minimizing shallow fine lines and refining coarse skin texture.\n\nExpect mild tingling during application followed by subtle flaking over 3 to 5 days, revealing smoother, clearer skin.',
  },
  {
    id: 3,
    title: 'PRP Hair Follicle Bio-Restoration',
    slug: 'prp-hair-restoration',
    category: 2,
    duration: '60 mins',
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Autologous platelet-rich plasma micro-injections to halt hair thinning, nourish dormant follicles, and stimulate dense regrowth.',
    full_description: 'Platelet-Rich Plasma (PRP) therapy harnesses your body’s own concentrated bioactive growth factors to reverse follicular miniaturization and stimulate cellular proliferation in dormant hair follicles.\n\n### Protocol Steps\n1. **Precision Blood Draw**: A small blood sample is collected using sterile medical vacutainers.\n2. **Dual-Spin Centrifugation**: Advanced centrifugal isolation separates pure, platelet-dense plasma rich in VEGF and PDGF growth factors.\n3. **Micro-Infusion**: Using micro-fine German needles and topical numbing for maximum comfort, the concentrated PRP is placed directly at the follicular root level.\n\n### Typical Treatment Plan\nA series of 3 to 4 monthly sessions followed by quarterly maintenance ensures progressive hair density and strengthening.',
  },
  {
    id: 4,
    title: 'Low-Level Laser Hair Stimulation (LLLT)',
    slug: 'laser-hair-stimulation',
    category: 2,
    duration: '45 mins',
    image_url: 'https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?auto=format&fit=crop&w=1000&q=80',
    short_description: 'FDA-cleared photobiomodulation therapy to oxygenate the scalp, improve micro-circulation, and boost hair thickness.',
    full_description: 'Low-Level Laser Therapy (LLLT) is a pain-free, non-thermal light therapy that utilizes cold medical diodes at 655nm wavelength to invigorate mitochondrial activity in weakened hair cells.\n\n- Increases ATP production and cellular respiration\n- Enhances scalp vascularity, transporting essential nutrients directly to hair roots\n- Ideal as a stand-alone therapy or synergistically combined with PRP for accelerated restoration.',
  },
  {
    id: 5,
    title: 'Triple-Wavelength Laser Hair Reduction',
    slug: 'laser-hair-reduction',
    category: 3,
    duration: '30-60 mins',
    image_url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Pain-free gold standard permanent hair reduction combining Alexandrite (755nm), Diode (808nm), and Nd:YAG (1064nm) lasers.',
    full_description: 'Say goodbye to razor bumps, ingrown hairs, and endless waxing sessions. Our medical-grade Triple-Wavelength diode platform simultaneously targets all three structural depths of the hair follicle.\n\nIntegrated with -5°C sapphire crystal contact cooling, sessions are virtually painless and safe across all Indian Fitzpatrick skin types (III–VI).',
  },
  {
    id: 6,
    title: 'Q-Switched Nd:YAG Laser Toning & Carbon Peel',
    slug: 'q-switched-laser-toning',
    category: 3,
    duration: '45 mins',
    image_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Acoustic photo-mechanical laser pulses to shatter stubborn dermal pigmentation, melasma, and shrink enlarged pores.',
    full_description: 'Q-Switched Nd:YAG laser emission delivers ultra-short nanosecond energy pulses that photomechanically fragment melanin clusters into microscopic particles, which are then naturally eliminated by your body’s immune phagocytes.\n\nCombined with a liquid medical carbon mask (Hollywood Carbon Peel), it purges oxidized sebum, refines skin pores, and imparts instant photographic clarity.',
  },
  {
    id: 7,
    title: 'Botox Anti-Wrinkle Smoothing',
    slug: 'botox-anti-wrinkle-smoothing',
    category: 4,
    duration: '30 mins',
    image_url: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Precision neurotoxin micro-dosing to soften dynamic forehead lines, crow’s feet, and frown furrows while preserving natural expression.',
    full_description: 'Administered exclusively by Dr. Aisha Sharma MD, our micro-dosing protocol utilizes genuine FDA-approved onabotulinumtoxinA to gently relax hyperactive facial mimetic muscles.\n\nOur philosophy emphasizes soft, subtle rejuvenation: you will look rested, refreshed, and youthful — never frozen or unnatural. Visible smoothing appears within 4 to 7 days and endures for 4 to 6 months.',
  },
  {
    id: 8,
    title: 'Dermal Volumizing Fillers',
    slug: 'dermal-volumizing-fillers',
    category: 4,
    duration: '45-60 mins',
    image_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Premium cross-linked hyaluronic acid gels to restore lost mid-face volume, enhance cheekbones, and define lips.',
    full_description: 'Using world-renowned FDA-approved hyaluronic acid matrices (Juvederm & Restylane), our aesthetic specialists restore youthfulness by replenishing lost facial structural support.\n\nWe adhere strictly to natural facial proportions — enhancing high cheek contours, softening nasolabial folds, sculpting crisp jawlines, or adding subtle hydration and contour to lips.',
  },
  {
    id: 9,
    title: 'CryoSculpt Non-Invasive Body Contouring',
    slug: 'cryosculpt-body-contouring',
    category: 5,
    duration: '60 mins',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Targeted cryolipolysis fat cell freezing for stubborn subcutaneous deposits on the abdomen, flanks, and thighs.',
    full_description: 'CryoSculpt harnesses controlled medical cooling (-9°C) to induce natural apoptosis (cell death) in stubborn subcutaneous fat cells without injuring surrounding skin, muscle, or nerve tissue.\n\nOver the subsequent 6 to 12 weeks, your body’s lymphatic system naturally processes and permanently flushes away the crystalized fat cells, resulting in a visibly firmer, sculpted silhouette.',
  },
];

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    patient_name: 'Ananya Deshmukh',
    patient_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    review_text: 'My experience with HydraFacial Elite MD at SkinGlow Clinic was beyond exceptional. Dr. Aisha and her team analyzed my skin barrier first, and after just one session, my stubborn post-inflammatory redness was virtually gone. The clinic hygiene and ambiance are world-class.',
    rating: 5,
  },
  {
    id: 2,
    patient_name: 'Rohan Mehta',
    patient_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    review_text: 'I underwent 4 sessions of PRP Hair Bio-Restoration. The results have been remarkable — hair fall stopped entirely by the second month and my crown density has significantly thickened. Truly a physician-led clinical experience with no false promises.',
    rating: 5,
  },
  {
    id: 3,
    patient_name: 'Pooja Kapoor',
    patient_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    review_text: 'The Triple-Wavelength Laser Hair Reduction is painless! The cooling tip is amazing and there was zero irritation afterwards. After 3 sessions, I barely have any regrowth. Best skincare decision I have made.',
    rating: 5,
  },
  {
    id: 4,
    patient_name: 'Vikram Singhania',
    patient_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    review_text: 'Dr. Sharma has an artistic eye for natural anti-aging enhancements. The subtle wrinkle smoothing took years off my tired expression without making my forehead look frozen. Transparent consultation and meticulous care.',
    rating: 5,
  },
];

// ==============================|| PUBLIC APIS ||============================== //

export async function fetchSettings() {
  try {
    const res = await axiosServices.get('settings');
    return { ...CLINIC_DEFAULTS, ...(res.data?.data?.map || {}) };
  } catch {
    return CLINIC_DEFAULTS;
  }
}

export async function fetchTreatments(category) {
  try {
    const url = category && category !== 'all' ? `treatments?category=${category}` : 'treatments';
    const res = await axiosServices.get(url);
    return res.data?.data || FALLBACK_TREATMENTS;
  } catch {
    return FALLBACK_TREATMENTS;
  }
}

export async function fetchTreatmentBySlug(slug) {
  try {
    const res = await axiosServices.get(`treatments/${slug}`);
    return res.data?.data || null;
  } catch {
    return FALLBACK_TREATMENTS.find((t) => t.slug === slug) || null;
  }
}

export async function fetchTestimonials() {
  try {
    const res = await axiosServices.get('testimonials');
    return res.data?.data || FALLBACK_TESTIMONIALS;
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}

export async function submitInquiryApi(payload) {
  try {
    const res = await axiosServices.post('inquiries', payload);
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to submit inquiry.';
    throw new Error(msg);
  }
}

export async function bookAppointmentApi(payload) {
  try {
    const res = await axiosServices.post('appointments', payload);
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(data.errors[0].message || data.message);
    }
    throw new Error(data?.message || err.message || 'Failed to schedule appointment. Please try again.');
  }
}

export async function fetchBookedSlotsApi(date) {
  try {
    const res = await axiosServices.get(`appointments/booked-slots?date=${encodeURIComponent(date)}`);
    return res.data?.data || [];
  } catch {
    return [];
  }
}

// ==============================|| AUTH & ADMIN APIS ||============================== //

export async function adminLoginApi(credentials) {
  try {
    const res = await axiosServices.post('auth/login', credentials);
    const data = res.data?.data;
    if (typeof window !== 'undefined' && data) {
      if (data.access_token) {
        localStorage.setItem('serviceToken', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      }
      if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('role', String(data.user.role));
      }
    }
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check credentials.';
    throw new Error(msg);
  }
}

export async function getAdminProfileApi(token) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.get('auth/me', config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch admin profile.');
  }
}

export async function fetchDashboardStatsApi(token) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.get('admin/dashboard/stats', config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch dashboard metrics.');
  }
}

export async function fetchAdminAppointmentsApi(token, params = {}) {
  try {
    const config = {
      params,
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };
    const res = await axiosServices.get('admin/appointments', config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch appointments.');
  }
}

export async function fetchAdminAppointmentByIdApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.get(`admin/appointments/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch appointment details.');
  }
}

export async function updateAdminAppointmentApi(token, id, payload) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.patch(`admin/appointments/${id}`, payload, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to update appointment.');
  }
}

export async function deleteAdminAppointmentApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.delete(`admin/appointments/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to delete appointment.');
  }
}

export async function fetchAdminInquiriesApi(token, params = {}) {
  try {
    const config = {
      params,
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };
    const res = await axiosServices.get('admin/inquiries', config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch inquiries.');
  }
}

export async function markInquiryReadApi(token, id, is_read = 1) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.patch(`admin/inquiries/${id}/read`, { is_read }, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to update inquiry status.');
  }
}

export async function deleteAdminInquiryApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.delete(`admin/inquiries/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to delete inquiry.');
  }
}

export async function adminLogoutApi() {
  try {
    const refreshToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('refreshToken')
        : null;
    await axiosServices.post('auth/logout', { refreshToken });
  } catch {
    // ignore server logout failure
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('serviceToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      sessionStorage.clear();
    }
  }
}
