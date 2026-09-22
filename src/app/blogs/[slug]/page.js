import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
} from 'lucide-react';
import { fetchBlogBySlug, fetchSettings } from '@/lib/api';
import JsonLd from '@/components/seo/JsonLd';
import { getBlogPostingSchema, getBreadcrumbSchema } from '@/lib/seo/schemas';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const [data, settings] = await Promise.all([
    fetchBlogBySlug(params.slug),
    fetchSettings(),
  ]);
  const clinicName = settings?.clinic_name || 'Skin Glow Clinic';
  const doctorName = settings?.doctor_name || 'Dr. Aisha Sharma';

  if (!data || !data.blog) {
    return {
      title: `Article Not Found | ${clinicName}`,
    };
  }

  const { blog } = data;
  const title = `${blog.title} | ${clinicName}`;
  const description = blog.excerpt || blog.content?.replace(/<[^>]+>/g, '').slice(0, 160) || `Read "${blog.title}" by ${doctorName} at ${clinicName}, Himmatnagar.`;
  const image = blog.cover_image || '/Skin%20Glow%20Logo.jpg';

  return {
    title,
    description,
    keywords: [
      blog.title,
      blog.category || 'Skincare',
      'Himmatnagar skincare',
      'dermatology blog Gujarat',
      doctorName,
      clinicName,
    ],
    alternates: {
      canonical: `/blogs/${blog.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/blogs/${blog.slug}`,
      siteName: clinicName,
      locale: 'en_IN',
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      authors: [blog.author || doctorName],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const [data, settings] = await Promise.all([
    fetchBlogBySlug(params.slug),
    fetchSettings(),
  ]);

  if (!data || !data.blog) {
    notFound();
  }

  const { blog, related = [] } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent Article';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent Article';
    }
  };

  const blogPostingSchema = getBlogPostingSchema(blog);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blogs & Insights', url: '/blogs' },
    { name: blog.title, url: `/blogs/${blog.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-clinic-bg pb-24">
      <JsonLd data={[blogPostingSchema, breadcrumbSchema]} />
      {/* Breadcrumb Navigation */}
      <div className="bg-clinic-bg-alt/50 border-b border-clinic-border-subtle py-3.5 text-xs sm:text-sm text-clinic-muted">
        <div className="container max-w-4xl mx-auto px-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blogs" className="hover:text-accent transition-colors">Blogs & Insights</Link>
          <span>/</span>
          <span className="text-primary font-medium truncate max-w-xs sm:max-w-md">{blog.title}</span>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-12 lg:py-16 bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 text-xs text-clinic-muted mb-4 font-medium">
            <span className="px-3 py-1 rounded-full bg-accent/15 text-primary font-bold text-xs">
              Clinical Insights
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-accent" />
              {formatDate(blog.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-accent" />
              5 min read
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-8">
            {blog.title}
          </h1>

          {/* Author Byline Card */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-clinic-border-subtle">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-primary font-bold text-base shadow-xs overflow-hidden">
                {settings?.doctor_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.doctor_image} alt={`${settings?.doctor_name || 'Dr. Aisha Sharma'} — Dermatologist at Skin Glow Clinic Himmatnagar`} className="w-full h-full object-cover" />
                ) : (
                  (settings?.doctor_name || 'Dr').split(' ').map(n => n[0]).slice(0, 2).join('')
                )}
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-primary">
                  {settings?.doctor_name || 'Dr. Aisha Sharma'}{settings?.doctor_qualifications ? `, ${settings.doctor_qualifications}` : ''}
                </h4>
                <p className="text-xs text-clinic-muted">Dermatologist & Aesthetic Physician • {settings?.clinic_name || 'SkinGlow Clinic'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/book-appointment"
                className="px-4 py-2 rounded-full bg-primary hover:bg-primary-light text-white text-xs font-semibold transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Article Main Body */}
      <main className="container max-w-4xl mx-auto px-4 pt-10">
        {/* Cover Image */}
        {blog.cover_image && (
          <div className="relative h-72 sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-md border border-clinic-border-subtle mb-12">
            <Image
              src={blog.cover_image}
              alt={`${blog.title} — Clinical article by Skin Glow Clinic Himmatnagar`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Rich HTML Content Body */}
        <div
          className="prose prose-slate lg:prose-lg max-w-none text-clinic-text leading-relaxed font-sans
            [&>h2]:font-heading [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-bold [&>h2]:text-primary [&>h2]:mt-10 [&>h2]:mb-4
            [&>h3]:font-heading [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:text-primary [&>h3]:mt-8 [&>h3]:mb-3
            [&>p]:text-base [&>p]:sm:text-lg [&>p]:leading-relaxed [&>p]:text-slate-700 [&>p]:mb-5
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-6 [&>ul]:text-slate-700
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:mb-6 [&>ol]:text-slate-700
            [&>blockquote]:border-l-4 [&>blockquote]:border-accent [&>blockquote]:bg-clinic-bg-alt/70 [&>blockquote]:p-5 [&>blockquote]:rounded-r-2xl [&>blockquote]:italic [&>blockquote]:my-8 [&>blockquote]:font-serif [&>blockquote]:text-primary"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Clinical Medical Disclaimer */}
        {/* <div className="mt-14 p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3.5 text-xs sm:text-sm text-amber-900 leading-relaxed">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Clinical Medical Disclaimer</span>
            The contents published in this article are for general educational purposes and dermatological awareness only. Every individual’s skin barrier and health history is unique. Always schedule an in-person clinical consultation with a qualified dermatologist before commencing any clinical procedure or medical skincare protocol.
          </div>
        </div> */}

        {/* Author Bio Box */}
        <div className="mt-10 p-8 rounded-3xl bg-white border border-clinic-border-subtle shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-soft text-primary font-bold text-xl flex items-center justify-center shrink-0 shadow-gold overflow-hidden">
            {settings?.doctor_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.doctor_image} alt={`${settings?.doctor_name || 'Dr. Aisha Sharma'} — Dermatologist at Skin Glow Clinic Himmatnagar`} className="w-full h-full object-cover" />
            ) : (
              (settings?.doctor_name || 'Dr').split(' ').map(n => n[0]).slice(0, 2).join('')
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-heading text-lg font-bold text-primary">
                About {settings?.doctor_name || 'Our Doctor'}{settings?.doctor_qualifications ? `, ${settings.doctor_qualifications}` : ''}
              </h4>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Award size={12} /> Board Certified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed mb-4">
              {settings?.doctor_bio || `Senior Consultant Dermatologist specializing in non-invasive facial aesthetics, advanced laser protocols, and complex barrier restoration at ${settings?.clinic_name || 'SkinGlow Clinic'}.`}
            </p>
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
            >
              Consult with {settings?.doctor_name || 'our doctor'} <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Related Articles Section */}
        {related && related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-clinic-border-subtle">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading text-2xl font-bold text-primary">
                Related Clinical Articles
              </h3>
              <Link
                href="/blogs"
                className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
              >
                View All Articles <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogs/${item.slug}`}
                  className="group bg-white rounded-2xl border border-clinic-border-subtle shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={item.cover_image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'}
                      alt={`${item.title} — Skin Glow Clinic Himmatnagar`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <h4 className="font-heading text-base font-bold text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2 mb-2">
                      {item.title}
                    </h4>
                    <span className="text-xs text-accent font-semibold flex items-center gap-1 mt-3">
                      Read More <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-14 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-sand hover:bg-white text-slate-700 text-sm font-semibold transition-all shadow-xs"
          >
            <ArrowLeft size={16} />
            <span>Return to All Articles</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
