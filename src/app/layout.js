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

export const metadata = {
  title: 'SkinGlow Clinic | Premier Dermatology & Aesthetic Medicine',
  description: 'Experience physician-led clinical dermatology, bespoke aesthetic enhancements, and advanced laser treatments in Mumbai.',
  keywords: ['skincare', 'dermatology clinic', 'aesthetic medicine', 'laser clinic', 'anti-aging', 'skin doctor Mumbai'],
  authors: [{ name: 'SkinGlow Clinic' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'SkinGlow Clinic | Premier Dermatology & Aesthetic Medicine',
    description: 'Physician-led clinical dermatology, bespoke aesthetic enhancements, and advanced laser treatments.',
    type: 'website',
    locale: 'en_IN',
  },
};

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
