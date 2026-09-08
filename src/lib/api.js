import { CLINIC_DEFAULTS } from './constants';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
    image_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Gold-standard diode laser with ice-cooling technology for permanent, virtually pain-free hair reduction across all skin types.',
    full_description: 'Experience the pinnacle of clinical laser hair removal. Our state-of-the-art triple-wavelength laser platform seamlessly merges 755nm Alexandrite, 808nm Diode, and 1064nm Nd:YAG energy to target hair follicles at varying structural depths.\n\n### Why SkinGlow Laser Is Superior\n- **Integrated Ice-Cooling Contact Tip**: Keeps the epidermal surface at a soothing 4°C, preventing thermal discomfort.\n- **Safe for Fitzpatrick Types I to VI**: Optimized pulse parameters ensure safety on deeper Indian skin tones without risk of burns or hyperpigmentation.\n- **Rapid Treatment Speed**: High-frequency in-motion delivery enables full legs or back coverage in under 40 minutes.',
  },
  {
    title: 'Carbon Spectra Laser Toning (Hollywood Peel)',
    id: 6,
    slug: 'carbon-spectra-toning',
    category: 3,
    duration: '45 mins',
    image_url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Q-Switched Nd:YAG laser combined with liquid carbon lotion for intense pore tightening, oil control, and instant luminosity.',
    full_description: 'Celebrated as the Hollywood Laser Peel, this procedure begins with an application of medical-grade nano-carbon lotion that binds deeply to oil and debris within pores.\n\nWhen the Q-switched laser pulses over the skin, the carbon particles instantly vaporize, carrying away dead skin cells, shrinking enlarged pores, stimulating collagen remodeling, and evening out skin pigmentation. Zero downtime with instant red-carpet radiance.',
  },
  {
    id: 7,
    title: 'Botox & Dysport Dynamic Wrinkle Smoothing',
    slug: 'botox-wrinkle-smoothing',
    category: 4,
    duration: '30 mins',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    short_description: 'Precision neuromodulator injections to soften forehead lines, crow’s feet, and frown lines while maintaining natural expression.',
    full_description: 'Administered exclusively by certified dermatologists, our neuromodulator therapies subtly relax targeted hyperactive facial muscles that create stubborn expression lines.\n\n### Key Treatment Areas\n- **Horizontal Forehead Lines**: Smoothing worry creases for a serene, youthful upper face.\n- **Glabellar Frown Lines (11s)**: Softening deep furrow lines between the brows.\n- **Crow’s Feet**: Rejuvenating the delicate lateral eye contours.\n- **Masseter Reduction**: Slimming the jawline and relieving nocturnal teeth grinding (bruxism).\n\nResults emerge within 4 to 7 days, maintaining a refreshed, expressive appearance for 4 to 6 months.',
  },
  {
    id: 8,
    title: 'Hyaluronic Dermal Fillers & Facial Sculpting',
    slug: 'dermal-fillers-sculpting',
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

export async function fetchSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch settings');
    const json = await res.json();
    return { ...CLINIC_DEFAULTS, ...(json.data?.map || {}) };
  } catch {
    return CLINIC_DEFAULTS;
  }
}

export async function fetchTreatments(category) {
  try {
    const url = category ? `${API_BASE}/treatments?category=${category}` : `${API_BASE}/treatments`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch treatments');
    const json = await res.json();
    return json.data || FALLBACK_TREATMENTS;
  } catch {
    if (category) {
      const parsed = parseInt(category, 10);
      return FALLBACK_TREATMENTS.filter(t => t.category === parsed);
    }
    return FALLBACK_TREATMENTS;
  }
}

export async function fetchTreatmentBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/treatments/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch treatment detail');
    const json = await res.json();
    return json.data;
  } catch {
    const found = FALLBACK_TREATMENTS.find(t => t.slug === slug);
    if (!found) return null;
    const related = FALLBACK_TREATMENTS.filter(t => t.id !== found.id && t.category === found.category).slice(0, 3);
    return { treatment: found, related };
  }
}

export async function fetchTestimonials() {
  try {
    const res = await fetch(`${API_BASE}/testimonials`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    const json = await res.json();
    return json.data || FALLBACK_TESTIMONIALS;
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}

export async function submitInquiryApi(payload) {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit inquiry. Please try again.');
  }
  return data;
}

export async function adminLoginApi(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Authentication failed. Please check credentials.');
  }
  return data.data;
}

export async function getAdminProfileApi(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch admin profile.');
  }
  return data.data;
}
