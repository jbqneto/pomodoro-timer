import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Focus Beat | Focus Timer With Music',
  description: 'Focus Beat is a focus and break timer with music for deep work, study sessions, and concentration.',
  keywords: 'focus timer, focus timer with music, deep work timer, study timer with music, focus sessions, concentration music',
  authors: [{ name: 'Focus Beat' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Focus Beat | Focus Timer With Music',
    siteName: "Focus Beat",
    description: 'A focus and break timer with music for study, deep work, and concentration.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    languages: {
      'en': '',
      'pt': '',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/imgs/favico.ico" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
