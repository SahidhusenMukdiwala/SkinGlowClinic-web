export const TREATMENT_CATEGORIES = [
  { id: 0, key: 'all', name: 'All Treatments' },
  { id: 1, key: 'skin', name: 'Clinical Skin' },
  { id: 2, key: 'hair', name: 'Hair Restoration' },
  { id: 3, key: 'laser', name: 'Advanced Laser' },
  { id: 4, key: 'anti-aging', name: 'Anti-Aging & Aesthetics' },
  { id: 5, key: 'body', name: 'Body Contouring' },
];

export const CATEGORY_MAP = {
  1: 'Clinical Skin',
  2: 'Hair Restoration',
  3: 'Advanced Laser',
  4: 'Anti-Aging & Aesthetics',
  5: 'Body Contouring',
};

export const CLINIC_DEFAULTS = {
  clinic_name: 'SkinGlow Clinic',
  clinic_tagline: 'Physician-Led Clinical Dermatology & Aesthetic Excellence',
  doctor_name: 'Dr. Aisha Sharma',
  doctor_qualifications: 'MD, DNB (Dermatology, Venereology & Leprosy), FAAD (USA)',
  phone: '+91 98201 23456',
  email: 'contact@skinglow.com',
  address: 'Suite 402, Radiant Medical Enclave, Linking Road, Bandra West, Mumbai 400050',
  working_hours: 'Monday – Saturday: 10:00 AM – 7:30 PM | Sunday: By Appointment',
  whatsapp_number: '+919820123456',
  map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.045610815918!2d72.83151837599026!3d19.06173005241031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91130392bc7%3A0x63351d3b0b5e9f89!2sLinking%20Rd%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  facebook_url: 'https://facebook.com/skinglowclinic',
  instagram_url: 'https://instagram.com/skinglowclinic',
  youtube_url: 'https://youtube.com/@skinglowclinic',
  about_text: 'At SkinGlow Clinic, we blend cutting-edge medical dermatology with artistic aesthetic techniques. Our bespoke treatments are personalized to restore balance, enhance radiance, and celebrate your natural skin health with uncompromising clinical excellence.',
  about_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
};

export const ROLES = Object.freeze({
  SUPER_ADMIN: 0,
  ADMIN: 1,
  CUSTOMER: 2,
});

export const ROLE_NAMES = Object.freeze({
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.CUSTOMER]: 'Patient / Customer',
});

export const ROLE_GROUPS = Object.freeze({
  SUPER_ADMIN_ONLY: [ROLES.SUPER_ADMIN],
  ADMINS_ONLY: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  CUSTOMERS_ONLY: [ROLES.CUSTOMER],
  ALL_AUTHENTICATED: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER],
});

export const isAdminUser = (user) => {
  return Boolean(user && (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN));
};

export const isCustomerUser = (user) => {
  return Boolean(user && user.role === ROLES.CUSTOMER);
};

