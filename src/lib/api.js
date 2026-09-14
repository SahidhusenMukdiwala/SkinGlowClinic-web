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
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
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
    treatment_name: 'HydraFacial Elite MD',
    date: 'August 2026',
  },
  {
    id: 2,
    patient_name: 'Rohan Mehta',
    patient_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    review_text: 'I underwent 4 sessions of PRP Hair Bio-Restoration. The results have been remarkable — hair fall stopped entirely by the second month and my crown density has significantly thickened. Truly a physician-led clinical experience with no false promises.',
    rating: 5,
    treatment_name: 'PRP Hair Bio-Restoration',
    date: 'July 2026',
  },
  {
    id: 3,
    patient_name: 'Pooja Kapoor',
    patient_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    review_text: 'The Triple-Wavelength Laser Hair Reduction is painless! The cooling tip is amazing and there was zero irritation afterwards. After 3 sessions, I barely have any regrowth. Best skincare decision I have made.',
    rating: 5,
    treatment_name: 'Triple-Wavelength Laser Hair Reduction',
    date: 'June 2026',
  },
  {
    id: 4,
    patient_name: 'Vikram Singhania',
    patient_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    review_text: 'Dr. Sharma has an artistic eye for natural anti-aging enhancements. The subtle wrinkle smoothing took years off my tired expression without making my forehead look frozen. Transparent consultation and meticulous care.',
    rating: 5,
    treatment_name: 'Botox Anti-Wrinkle Smoothing',
    date: 'May 2026',
  },
  {
    id: 5,
    patient_name: 'Meera Nambiar',
    patient_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    review_text: 'I suffered from hormonal cystic acne and stubborn pigmentation for years. The personalized chemical peel regimen combined with medical skincare guidance cleared my complexion within 8 weeks. I feel so confident going makeup-free now.',
    rating: 5,
    treatment_name: 'Advanced Medical Chemical Peels',
    date: 'April 2026',
  },
  {
    id: 6,
    patient_name: 'Sameer Merchant',
    patient_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    review_text: 'The Q-Switched laser toning completely revitalized my dull skin and erased persistent sun spots from outdoor sports. Exceptional clinical care, zero downtime, and Dr. Sharma explains every step of the procedure with great clarity.',
    rating: 5,
    treatment_name: 'Q-Switched Laser Toning',
    date: 'March 2026',
  },
];

const FALLBACK_BLOGS = [
  {
    id: 1,
    title: 'The Clinical Science Behind HydraFacial: Why Vortex Infusion Works',
    slug: 'clinical-science-behind-hydrafacial',
    cover_image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    content: `<h2>Understanding Hydradermabrasion Mechanisms</h2>
<p>Modern clinical dermatology has moved away from harsh manual extractions that disrupt the stratum corneum barrier. Instead, patented vortex-fusion technology combines simultaneous vacuum extraction with pressurized micro-droplet dermal saturation.</p>

<h3>Key Benefits for Fitzpatrick Types III–VI</h3>
<ul>
  <li><strong>Zero Barrier Damage:</strong> Unlike mechanical microdermabrasion crystals, gentle fluid vortex minimizes post-inflammatory hyperpigmentation (PIH).</li>
  <li><strong>Targeted Booster Penetration:</strong> Customized peptides and cross-linked hyaluronic acid penetrate up to 30% deeper into stratum corneum micro-channels.</li>
  <li><strong>Immediate Dewy Clarification:</strong> Dead keratinized corneocytes are painlessly aspirated without downtime.</li>
</ul>

<blockquote>"A healthy skin barrier requires regular cellular exfoliation without triggering the dermal inflammatory cascade." — Dr. Aisha Sharma, MD</blockquote>

<h3>Recommended Clinical Frequency</h3>
<p>For optimal barrier support and pore clarity, dermatologists recommend monthly sessions, particularly during seasonal climate transitions.</p>`,
    category: 'Skin Science',
    read_time: '4 min read',
    author: 'Dr. Aisha Sharma, MD',
    createdAt: '2026-08-15T10:00:00.000Z',
    is_published: 1,
  },
  {
    id: 2,
    title: 'PRP vs. Low-Level Laser Therapy: Choosing the Right Hair Regrowth Protocol',
    slug: 'prp-vs-low-level-laser-hair-regrowth',
    cover_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    content: `<h2>Combating Androgenetic Alopecia with Evidence-Based Science</h2>
<p>Follicular miniaturization is driven by DHT binding to androgen receptors on dermal papilla cells. Both Autologous Platelet-Rich Plasma (PRP) and Low-Level Laser Therapy (LLLT) present clinically proven non-surgical solutions.</p>

<h3>Platelet-Rich Plasma (PRP) Therapy</h3>
<p>PRP concentrates bioactive growth factors—specifically VEGF, PDGF, and FGF—derived from the patient's own autologous plasma. When micro-infused around weakened follicles, these growth factors stimulate neo-vascularization and transition telogen (resting) follicles into active anagen growth.</p>

<h3>Low-Level Laser Light Stimulation (655nm)</h3>
<p>Cold medical laser diodes stimulate mitochondrial cytochrome c oxidase, boosting ATP energy production directly within follicular stem cells. LLLT is 100% painless and serves as an exceptional synergistic maintenance protocol alongside PRP.</p>

<h3>The Dual Combination Protocol</h3>
<p>In clinical trials, patients undergoing 4 sessions of PRP paired with bi-weekly LLLT demonstrated a <strong>38% greater terminal hair count</strong> at 6 months compared to monotherapy.</p>`,
    category: 'Hair Restoration',
    read_time: '6 min read',
    author: 'Dr. Aisha Sharma, MD',
    createdAt: '2026-07-28T09:30:00.000Z',
    is_published: 1,
  },
  {
    id: 3,
    title: 'Debunking Anti-Aging Myths: Natural Neuromodulator Micro-Dosing Explained',
    slug: 'debunking-anti-aging-myths-neuromodulators',
    cover_image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=1200&q=80',
    content: `<h2>The Philosophy of Natural Facial Architecture</h2>
<p>The biggest misconception surrounding aesthetic neurotoxin treatments is the fear of looking "frozen" or "emotionless." Modern clinical aesthetics focuses strictly on micro-dosing and precise anatomical muscular targeting.</p>

<h3>How Micro-Dosing Preserves Dynamic Emotion</h3>
<p>By administering calibrated micro-droplets directly into the hyperactive fibers of the frontalis, procerus, and orbicularis oculi muscles, we soften dynamic wrinkles while leaving baseline facial animation completely intact.</p>

<ul>
  <li><strong>Subtle Softening:</strong> Frown lines and forehead furrows are smoothed without dropping brow height.</li>
  <li><strong>Preventative Aging:</strong> Prevents shallow expression lines from etching into permanent dermal static scars.</li>
  <li><strong>Zero Downtime:</strong> The 15-minute lunchtime procedure leaves no visible traces.</li>
</ul>

<blockquote>"Great aesthetic medicine is invisible. People should notice that you look radiant, well-rested, and glowing—never that you have had a procedure done." — Dr. Aisha Sharma, MD</blockquote>`,
    category: 'Anti-Aging',
    read_time: '5 min read',
    author: 'Dr. Aisha Sharma, MD',
    createdAt: '2026-06-19T14:15:00.000Z',
    is_published: 1,
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

export async function fetchTreatments(paramsOrCategory, maybeSearch) {
  try {
    let category = null;
    let search = null;
    if (typeof paramsOrCategory === 'object' && paramsOrCategory !== null) {
      category = paramsOrCategory.category;
      search = paramsOrCategory.search;
    } else {
      category = paramsOrCategory;
      search = maybeSearch;
    }

    const queryParams = new URLSearchParams();
    if (category && category !== 'all' && category !== 0 && category !== '0') {
      queryParams.append('category', category);
    }
    if (search && typeof search === 'string' && search.trim()) {
      queryParams.append('search', search.trim());
    }

    const qs = queryParams.toString();
    const url = qs ? `treatments?${qs}` : 'treatments';
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
    const found = FALLBACK_TREATMENTS.find((t) => t.slug === slug);
    if (!found) return null;
    const related = FALLBACK_TREATMENTS.filter(
      (t) => t.id !== found.id && t.category === found.category
    ).slice(0, 3);
    return { treatment: found, related };
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

export async function fetchBlogs(params = {}) {
  try {
    const res = await axiosServices.get('blogs', { params });
    const data = res.data?.data;
    if (data && Array.isArray(data.blogs)) {
      return data;
    }
    return {
      blogs: Array.isArray(data) ? data : FALLBACK_BLOGS,
      total: Array.isArray(data) ? data.length : FALLBACK_BLOGS.length,
      totalPages: 1,
      currentPage: 1,
    };
  } catch {
    return {
      blogs: FALLBACK_BLOGS,
      total: FALLBACK_BLOGS.length,
      totalPages: 1,
      currentPage: 1,
    };
  }
}

export async function fetchBlogBySlug(slug) {
  try {
    const res = await axiosServices.get(`blogs/${slug}`);
    return res.data?.data || null;
  } catch {
    const found = FALLBACK_BLOGS.find((b) => b.slug === slug);
    if (!found) return null;
    const related = FALLBACK_BLOGS.filter((b) => b.id !== found.id).slice(0, 3);
    return { blog: found, related };
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

// ==============================|| AUTH & USER APIS ||============================== //

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserRole() {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  return role !== null && role !== undefined ? Number(role) : null;
}

export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('serviceToken') || sessionStorage.getItem('serviceToken');
  return Boolean(token);
}

export function isAdmin() {
  const role = getUserRole();
  return role === 0 || role === 1;
}

export function isCustomer() {
  const role = getUserRole();
  return role === 2;
}

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
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: data.user }));
    }
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check credentials.';
    throw new Error(msg);
  }
}

export const loginApi = adminLoginApi;

export async function registerCustomerApi(userData) {
  try {
    const res = await axiosServices.post('auth/register', userData);
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
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: data.user }));
    }
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
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

// ==============================|| CATEGORIES API ||============================== //

export async function fetchCategoriesApi() {
  try {
    const res = await axiosServices.get('categories');
    return res.data?.data || [];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}

export async function fetchAdminCategoriesApi(token, params = {}) {
  try {
    const config = {
      params,
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };
    const res = await axiosServices.get('admin/categories', config);
    return res.data?.data || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch categories.');
  }
}

export async function createAdminCategoryApi(token, payload) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.post('admin/categories', payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to create category.';
    throw new Error(msg);
  }
}

export async function updateAdminCategoryApi(token, id, payload) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.put(`admin/categories/${id}`, payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to update category.';
    throw new Error(msg);
  }
}

export async function deleteAdminCategoryApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.delete(`admin/categories/${id}`, config);
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.message || err.message || 'Failed to delete category.';
    throw new Error(msg);
  }
}

// ==============================|| PHASE 5: TREATMENTS CRUD ||============================== //

export async function fetchAdminTreatmentsApi(token, params = {}) {
  try {
    const config = {
      params,
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };
    const res = await axiosServices.get('admin/treatments', config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch treatments.');
  }
}

export async function fetchAdminTreatmentByIdApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.get(`admin/treatments/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch treatment details.');
  }
}

export async function createAdminTreatmentApi(token, payload) {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };
    const res = await axiosServices.post('admin/treatments', payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to create treatment.';
    throw new Error(msg);
  }
}

export async function updateAdminTreatmentApi(token, id, payload) {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };
    const res = await axiosServices.put(`admin/treatments/${id}`, payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to update treatment.';
    throw new Error(msg);
  }
}

export async function deleteAdminTreatmentApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.delete(`admin/treatments/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to delete treatment.');
  }
}

// ==============================|| PHASE 5: TESTIMONIALS CRUD ||============================== //

export async function fetchAdminTestimonialsApi(token, params = {}) {
  try {
    const config = {
      params,
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };
    const res = await axiosServices.get('admin/testimonials', config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch testimonials.');
  }
}

export async function fetchAdminTestimonialByIdApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.get(`admin/testimonials/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch testimonial.');
  }
}

export async function createAdminTestimonialApi(token, payload) {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };
    const res = await axiosServices.post('admin/testimonials', payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to create testimonial.';
    throw new Error(msg);
  }
}

export async function updateAdminTestimonialApi(token, id, payload) {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };
    const res = await axiosServices.put(`admin/testimonials/${id}`, payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to update testimonial.';
    throw new Error(msg);
  }
}

export async function deleteAdminTestimonialApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.delete(`admin/testimonials/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to delete testimonial.');
  }
}

// ==============================|| PHASE 5: BLOGS (PUBLIC & ADMIN) ||============================== //

export async function fetchBlogsApi(params = {}) {
  try {
    const res = await axiosServices.get('blogs', { params });
    return res.data?.data || { blogs: [], total: 0, totalPages: 1 };
  } catch {
    return { blogs: [], total: 0, totalPages: 1 };
  }
}

export async function fetchBlogBySlugApi(slug) {
  try {
    const res = await axiosServices.get(`blogs/${slug}`);
    return res.data?.data || null;
  } catch {
    return null;
  }
}

export async function fetchAdminBlogsApi(token, params = {}) {
  try {
    const config = {
      params,
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };
    const res = await axiosServices.get('admin/blogs', config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch blogs.');
  }
}

export async function fetchAdminBlogByIdApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.get(`admin/blogs/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch blog article.');
  }
}

export async function createAdminBlogApi(token, payload) {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };
    const res = await axiosServices.post('admin/blogs', payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to create blog post.';
    throw new Error(msg);
  }
}

export async function updateAdminBlogApi(token, id, payload) {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };
    const res = await axiosServices.put(`admin/blogs/${id}`, payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to update blog post.';
    throw new Error(msg);
  }
}

export async function deleteAdminBlogApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.delete(`admin/blogs/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to delete blog post.');
  }
}

// ==============================|| PHASE 5: SITE SETTINGS ||============================== //

export async function fetchAdminSettingsApi(token) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.get('admin/settings', config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch settings.');
  }
}

export async function updateAdminSettingsApi(token, payload) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.put('admin/settings', payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to save site settings.';
    throw new Error(msg);
  }
}

// ==============================|| PHASE 5: DIRECT IMAGE UPLOAD ||============================== //

export async function uploadImageApi(token, file, folder = 'skinglowclinic/general') {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axiosServices.post('admin/upload', formData, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to upload image.');
  }
}

// ==============================|| PHASE 9: CUSTOMER MANAGEMENT ||============================== //

export async function fetchAdminCustomersApi(token, params = {}) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    
    // Explicitly handle status: 1 (active), 0 (inactive), or all
    if (params.status !== undefined && params.status !== null && params.status !== '' && params.status !== 'all') {
      const normalizedStatus = (params.status === '1' || params.status === 1 || params.status === 'active') ? '1' : '0';
      query.append('status', normalizedStatus);
    }

    const queryString = query.toString();
    const url = `admin/customers${queryString ? `?${queryString}` : ''}`;
    const res = await axiosServices.get(url, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch customers.');
  }
}

export async function fetchAdminCustomerDetailApi(token, id) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.get(`admin/customers/${id}`, config);
    return res.data?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to fetch customer details.');
  }
}

export async function updateCustomerStatusApi(token, id, isActive) {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axiosServices.patch(
      `admin/customers/${id}/status`,
      { is_active: isActive ? 1 : 0 },
      config
    );
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to update customer status.';
    throw new Error(msg);
  }
}

export async function updateAdminProfileApi(token, payload) {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const config = {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };
    const res = await axiosServices.put('auth/profile', payload, config);
    return res.data?.data;
  } catch (err) {
    const data = err.response?.data;
    const msg = data?.errors?.[0]?.message || data?.message || err.message || 'Failed to update profile.';
    throw new Error(msg);
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
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: null }));
    }
  }
}

export const logoutApi = adminLogoutApi;

