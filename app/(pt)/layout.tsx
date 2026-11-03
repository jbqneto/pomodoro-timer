import '../globals.css';
import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { inter } from '../font';
import { rootMetadata } from '@/lib/seo';

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };
export const metadata = rootMetadata('pt');

export default function PortugueseRootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><body className={inter.className}>{children}</body></html>;
}
