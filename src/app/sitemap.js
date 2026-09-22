import { fetchTreatments, fetchBlogs } from '@/lib/api';

function sanitizeSlug(slug) {
  if (!slug || typeof slug !== 'string') return '';
  return encodeURIComponent(slug.trim());
}

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://skinglowclinic.com').replace(/\/+$/, '');
  const now = new Date().toISOString();

  // Static routes configuration
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/treatments`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-appointment`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamically fetch treatments
  let treatmentRoutes = [];
  try {
    const treatments = await fetchTreatments();
    if (Array.isArray(treatments)) {
      treatmentRoutes = treatments
        .filter((t) => t && t.slug)
        .map((t) => ({
          url: `${baseUrl}/treatments/${sanitizeSlug(t.slug)}`,
          lastModified: t.updatedAt || t.createdAt || now,
          changeFrequency: 'monthly',
          priority: 0.9,
        }));
    }
  } catch (err) {
    console.error('Error generating treatment sitemap entries:', err);
  }

  // Dynamically fetch blogs
  let blogRoutes = [];
  try {
    const blogData = await fetchBlogs({ limit: 1000 });
    const blogs = Array.isArray(blogData?.blogs)
      ? blogData.blogs
      : Array.isArray(blogData)
      ? blogData
      : [];

    blogRoutes = blogs
      .filter((b) => b && b.slug && (b.is_published === undefined || b.is_published === 1 || b.is_published === true))
      .map((b) => ({
        url: `${baseUrl}/blogs/${sanitizeSlug(b.slug)}`,
        lastModified: b.updatedAt || b.createdAt || now,
        changeFrequency: 'daily',
        priority: 0.8,
      }));
  } catch (err) {
    console.error('Error generating blog sitemap entries:', err);
  }

  return [...staticRoutes, ...treatmentRoutes, ...blogRoutes];
}
