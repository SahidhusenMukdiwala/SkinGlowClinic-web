const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skinglowclinic.com';

function cleanBaseUrl(url) {
  return (url || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

/**
 * 1. LocalBusiness + MedicalClinic Schema
 */
export function getLocalBusinessSchema(clinicData = {}, siteUrl = DEFAULT_SITE_URL) {
  const baseUrl = cleanBaseUrl(siteUrl);
  const clinicName = clinicData.clinic_name || 'Skin Glow Clinic';
  const doctorName = clinicData.doctor_name || 'Dr. Aisha Sharma';
  const phone = clinicData.phone || '+91 98201 23456';
  const address = clinicData.address || 'Opp. Civil Hospital, Post Office Road, Himmatnagar, Gujarat 383001';

  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'LocalBusiness'],
    '@id': `${baseUrl}/#clinic`,
    name: clinicName,
    alternateName: `${clinicName} Himmatnagar`,
    description: clinicData.about_text || 'Premier dermatology, clinical skincare, and advanced aesthetic laser clinic in Himmatnagar, Gujarat.',
    url: baseUrl,
    logo: `${baseUrl}/Skin%20Glow%20Logo.jpg`,
    image: `${baseUrl}/Skin%20Glow%20Logo.jpg`,
    telephone: phone,
    email: clinicData.email || 'contact@skinglow.com',
    priceRange: '₹₹',
    medicalSpecialty: 'Dermatology',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Himmatnagar',
      addressRegion: 'Gujarat',
      postalCode: '383001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.5969,
      longitude: 72.6813,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:30',
      },
    ],
    sameAs: [
      clinicData.facebook_url || 'https://facebook.com/skinglowclinic',
      clinicData.instagram_url || 'https://instagram.com/skinglowclinic',
      clinicData.youtube_url || 'https://youtube.com/@skinglowclinic',
    ].filter(Boolean),
    physician: {
      '@type': 'Physician',
      name: doctorName,
      jobTitle: 'Lead Dermatologist & Aesthetic Specialist',
      qualifications: clinicData.doctor_qualifications || 'MD, DNB (Dermatology, Venereology & Leprosy)',
    },
  };
}

/**
 * 2. FAQPage Schema
 */
export function getFAQSchema(faqItems = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * 3. MedicalProcedure Schema (for treatments)
 */
export function getMedicalProcedureSchema(treatment = {}, siteUrl = DEFAULT_SITE_URL) {
  const baseUrl = cleanBaseUrl(siteUrl);
  const title = treatment.title || 'Clinical Treatment';
  const description = treatment.short_description || treatment.full_description?.slice(0, 160) || `${title} at Skin Glow Clinic`;

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: title,
    description: description,
    procedureType: 'NonSurgicalProcedure',
    bodyLocation: 'Face and Body',
    code: {
      '@type': 'MedicalCode',
      code: treatment.slug || 'dermatology-procedure',
      codingSystem: 'SkinGlowClinicInternal',
    },
    recognizingAuthority: {
      '@type': 'MedicalClinic',
      name: 'Skin Glow Clinic',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Himmatnagar',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
    },
    image: treatment.image_url
      ? (treatment.image_url.startsWith('http') ? treatment.image_url : `${baseUrl}${treatment.image_url}`)
      : undefined,
    url: treatment.slug ? `${baseUrl}/treatments/${treatment.slug}` : `${baseUrl}/treatments`,
  };
}

/**
 * 4. BlogPosting / Article Schema
 */
export function getBlogPostingSchema(blog = {}, siteUrl = DEFAULT_SITE_URL) {
  const baseUrl = cleanBaseUrl(siteUrl);
  const title = blog.title || 'Skincare Article';
  const description = blog.excerpt || blog.content?.replace(/<[^>]+>/g, '').slice(0, 160) || title;
  const authorName = blog.author || 'Dr. Aisha Sharma, MD';
  const publishedDate = blog.createdAt || new Date().toISOString();
  const modifiedDate = blog.updatedAt || publishedDate;
  const coverImage = blog.cover_image
    ? (blog.cover_image.startsWith('http') ? blog.cover_image : `${baseUrl}${blog.cover_image}`)
    : `${baseUrl}/Skin%20Glow%20Logo.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blog.slug ? `${baseUrl}/blogs/${blog.slug}` : `${baseUrl}/blogs`,
    },
    headline: title,
    description: description,
    image: [coverImage],
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: 'Dermatologist',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Skin Glow Clinic',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/Skin%20Glow%20Logo.jpg`,
      },
    },
  };
}

/**
 * 5. BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items = [], siteUrl = DEFAULT_SITE_URL) {
  const baseUrl = cleanBaseUrl(siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const fullUrl = item.url.startsWith('http')
        ? item.url
        : `${baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: fullUrl,
      };
    }),
  };
}

/**
 * 6. AggregateRating Schema
 */
export function getAggregateRatingSchema(ratingData = {}, siteUrl = DEFAULT_SITE_URL) {
  const baseUrl = cleanBaseUrl(siteUrl);
  const ratingValue = ratingData.ratingValue || '4.9';
  const reviewCount = ratingData.reviewCount || 150;
  const clinicName = ratingData.clinic_name || 'Skin Glow Clinic';

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: clinicName,
    url: baseUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(ratingValue),
      bestRating: '5',
      worstRating: '1',
      reviewCount: Number(reviewCount),
    },
  };
}
