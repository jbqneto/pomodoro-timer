import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pomodoro Timer | Focus Technique • Técnica de Foco',
  description: 'A bilingual Pomodoro timer with YouTube playlists for better focus. Timer Pomodoro bilíngue com playlists do YouTube para melhor foco.',
  keywords: 'pomodoro, timer, focus, productivity, study, técnica, foco, produtividade, estudos',
  authors: [{ name: 'Pomodoro Timer App' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Pomodoro Timer | Focus Technique',
    siteName: "Focus Timer",
    description: 'A bilingual Pomodoro timer with YouTube playlists for better focus.',
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍅</text></svg>" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}