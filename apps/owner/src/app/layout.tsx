import type { Metadata } from 'next';
import { GOOGLE_FONTS_URL } from '@dinenovaai/ui/fonts';
import '@dinenovaai/ui/globals.css';
import '../styles/globals.css';

export const metadata: Metadata = { title: 'DineNova — Owner', description: 'Restaurant management dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      </head>
      <body className="bg-neutral-50 font-sans antialiased">{children}</body>
    </html>
  );
}
