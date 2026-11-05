import '../globals.css';
import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { inter } from '../font';
import { rootMetadata } from '@/lib/seo';
import { UmamiAnalytics } from '@/components/UmamiAnalytics';

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };
export const metadata = rootMetadata('en');

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <UmamiAnalytics />
      </body>
    </html>
  );
}
