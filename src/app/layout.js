import { Playfair_Display, Inter } from 'next/font/google';
import '@/styles/globals.css';
import ConditionalPublicLayout from '@/components/layout/ConditionalPublicLayout';

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
  return {
    title: `${clinicName} | ${tagline}`,
    description: settings?.about_text || `Experience physician-led clinical dermatology, bespoke aesthetic enhancements, and advanced laser treatments at ${clinicName}.`,
    keywords: ['skincare', 'dermatology clinic', 'aesthetic medicine', 'laser clinic', 'anti-aging', clinicName],
    authors: [{ name: clinicName }],
    metadataBase: new URL('http://localhost:3000'),
    openGraph: {
      title: `${clinicName} | ${tagline}`,
      description: settings?.about_text || `Physician-led clinical dermatology, bespoke aesthetic enhancements, and advanced laser treatments at ${clinicName}.`,
      type: 'website',
      locale: 'en_IN',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <ConditionalPublicLayout>
          {children}
        </ConditionalPublicLayout>
      </body>
    </html>
  );
}
