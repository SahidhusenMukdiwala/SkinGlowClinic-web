import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, Clock, ArrowRight, User, BookOpen, Search } from 'lucide-react';
import { fetchBlogs } from '@/lib/api';
import SectionHeader from '@/components/common/SectionHeader';

export const metadata = {
  title: 'Clinical Skincare Blogs & Dermatological Insights | SkinGlow Clinic Mumbai',
  description: 'Evidence-based skincare advice, breakthrough aesthetic procedures, and clinical guides written by Dr. Aisha Sharma MD at SkinGlow Clinic.',
};

export const revalidate = 60;

export default async function BlogsPage({ searchParams }) {
  const query = searchParams?.search || '';
  const data = await fetchBlogs({ search: query });
  const blogs = data?.blogs || [];

  const featuredBlog = blogs[0];
  const gridBlogs = blogs.slice(1);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent Article';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent Article';
    }
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').slice(0, 160) + '...';
  };

  return (
    <div className="min-h-screen bg-clinic-bg pb-24">
      {/* Header Banner */}
      <header className="py-16 lg:py-20 text-center bg-gradient-to-b from-primary/5 via-clinic-bg to-clinic-bg border-b border-clinic-border-subtle">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-primary text-xs font-semibold mb-4">
            <Sparkles size={14} className="text-accent" />
            <span>Physician-Authored Skincare Education</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-primary font-bold tracking-tight mb-5 leading-tight">
            Clinical Insights & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-soft to-accent-hover">
              Dermatological Breakthroughs
            </span>
          </h1>
          <p className="text-base sm:text-lg text-clinic-muted max-w-2xl mx-auto leading-relaxed">
            Evidence-based medical advice, behind-the-scenes clinical science, and proactive aesthetic care designed to empower your skin health journey.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        {/* Featured Blog Hero Card */}
        {featuredBlog && (
          <div className="mb-16">
            <div className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <BookOpen size={14} />
              <span>Featured Clinical Article</span>
            </div>
            <Link
              href={`/blogs/${featuredBlog.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl p-6 sm:p-8 border border-clinic-border-subtle shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="lg:col-span-7 relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={featuredBlog.cover_image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80'}
                  alt={featuredBlog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-primary shadow-sm">
                    {featuredBlog.category || 'Clinical Dermatology'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between py-2">
                <div>
                  <div className="flex items-center gap-4 text-xs text-clinic-muted mb-3 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-accent" />
                      {formatDate(featuredBlog.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-accent" />
                      {featuredBlog.read_time || '5 min read'}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl lg:text-3xl font-bold text-primary group-hover:text-accent transition-colors leading-snug mb-4">
                    {featuredBlog.title}
                  </h2>

                  <p className="text-clinic-muted text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                    {stripHtml(featuredBlog.content)}
                  </p>
                </div>

                <div className="pt-6 border-t border-clinic-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-primary font-bold text-sm">
                      AS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary">{featuredBlog.author || 'Dr. Aisha Sharma, MD'}</div>
                      <div className="text-[11px] text-clinic-muted">Lead Dermatologist</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                Latest Publications
              </h3>
              <p className="text-sm text-clinic-muted">
                Explore scientific analyses, patient treatment guides, and clinical protocols.
              </p>
            </div>
          </div>

          {gridBlogs.length === 0 && !featuredBlog ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-clinic-border-subtle">
              <BookOpen size={40} className="mx-auto text-accent mb-3" />
              <h4 className="text-lg font-bold text-primary mb-1">No articles published yet</h4>
              <p className="text-sm text-clinic-muted">Our clinical team is currently preparing new educational content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(gridBlogs.length > 0 ? gridBlogs : blogs).map((blog) => (
                <article
                  key={blog.id}
                  className="group bg-white rounded-2xl border border-clinic-border-subtle shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <Link href={`/blogs/${blog.slug}`} className="relative h-56 w-full overflow-hidden bg-slate-100 block">
                    <Image
                      src={blog.cover_image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-primary shadow-xs">
                        {blog.category || 'Skin Science'}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-clinic-muted mb-2.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-accent" />
                          {formatDate(blog.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-accent" />
                          {blog.read_time || '4 min read'}
                        </span>
                      </div>

                      <Link href={`/blogs/${blog.slug}`}>
                        <h4 className="font-heading text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug mb-3">
                          {blog.title}
                        </h4>
                      </Link>

                      <p className="text-xs sm:text-sm text-clinic-muted leading-relaxed line-clamp-3 mb-6">
                        {stripHtml(blog.content)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-clinic-border-subtle/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-primary text-xs font-bold">
                          AS
                        </div>
                        <span className="text-xs font-medium text-slate-700">Dr. Aisha Sharma</span>
                      </div>

                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="text-xs font-bold text-accent group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1"
                      >
                        Read <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Consultation Call to Action Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-primary via-primary-light to-primary text-white p-8 sm:p-12 relative overflow-hidden shadow-lg border border-accent/20">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-semibold mb-4">
              <Sparkles size={13} />
              <span>Personalized Diagnosis</span>
            </div>
            <h3 className="font-heading text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Have Specific Skin Concerns? Consult With Dr. Aisha Sharma MD
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Every skin type possesses unique biological needs. Schedule an in-depth dermatological consultation at our Bandra West clinic for comprehensive evaluation and custom care.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/book-appointment"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-accent to-accent-soft hover:from-accent-hover hover:to-accent text-primary font-bold text-sm shadow-gold transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <Calendar size={16} />
                <span>Book Clinical Consultation</span>
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white font-medium text-sm transition-colors"
              >
                Inquire With Our Team
              </Link>
            </div>
          </div>
          {/* Subtle Background Glow */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        </section>
      </main>
    </div>
  );
}
