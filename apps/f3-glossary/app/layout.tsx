import type React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });
const title = 'F3 Nation Xicon';
const description = 'Search exercises, terms, and articles from F3 Nation';

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    images: ['/f3-workout.jpg'],
    type: 'website',
    title,
    description,
    url: 'https://xicon.freemensworkout.org',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="f3-xicon-theme"
        >
          <main className="min-h-screen bg-background">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
