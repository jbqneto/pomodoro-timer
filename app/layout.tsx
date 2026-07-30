import './globals.css';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Focus Beat | Focus Timer With Music',
  description: 'Focus Beat is a focus and break timer with music for deep work, study sessions, and concentration.',
  keywords: 'focus timer, focus timer with music, deep work timer, study timer with music, focus sessions, concentration music',
  authors: [{ name: 'Focus Beat' }],
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
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
