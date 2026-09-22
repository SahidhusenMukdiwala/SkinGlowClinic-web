import { Playfair_Display, Inter } from 'next/font/google';
import '@/styles/globals.css';
import ConditionalPublicLayout from '@/components/layout/ConditionalPublicLayout';
import GoogleAnalytics from '@/components/seo/GoogleAnalytics';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

import { fetchSettings } from '@/lib/api';

export async function generateMetadata() {
  const settings = await fetchSettings();
  const clinicName = settings?.clinic_name || 'SkinGlow Clinic';
  const tagline = settings?.clinic_tagline || 'Premier Dermatology & Aesthetic Medicine';
  const description = settings?.about_text || `Experience physician-led clinical dermatology, bespoke aesthetic enhancements, and advanced laser treatments at ${clinicName}.`;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skinglowclinic.com'),
    title: `${clinicName} | ${tagline}`,
    description,
    keywords: [
      'skin care clinic',
      'Himmatnagar',
      'Gujarat',
      'dermatologist',
      'skin doctor',
      'skin specialist',
      clinicName,
      'best skin clinic Himmatnagar',
      'dermatology Himmatnagar',
      'skin treatment Gujarat',
      'Sabarkantha district',
      'aesthetic medicine',
      'laser clinic',
      'anti-aging',
    ],
    authors: [{ name: clinicName }],
    alternates: {
      canonical: '/',
      languages: {
        'en-IN': '/',
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/Skin%20Glow%20Logo.jpg' },
      ],
      shortcut: ['/favicon.ico'],
      apple: [
        { url: '/Skin%20Glow%20Logo.jpg' },
      ],
    },
    openGraph: {
      title: `${clinicName} | ${tagline}`,
      description,
      url: '/',
      siteName: clinicName,
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: '/Skin%20Glow%20Logo.jpg',
          width: 1200,
          height: 1200,
          alt: `${clinicName} - Himmatnagar`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${clinicName} — Best Skin Care Clinic in Himmatnagar, Gujarat`,
      description,
      images: ['/Skin%20Glow%20Logo.jpg'],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'YOUR_VERIFICATION_CODE',
    },
    other: {
      'geo.region': 'IN-GJ',
      'geo.placename': 'Himmatnagar',
      'geo.position': '23.5969;72.6813',
      'ICBM': '23.5969, 72.6813',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <ConditionalPublicLayout>
          {children}
        </ConditionalPublicLayout>
      </body>
    </html>
  );
}
