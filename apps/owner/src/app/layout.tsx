import type { Metadata } from 'next';
import { inter, poppins } from '@dinenovaai/ui/fonts';
import '../styles/globals.css';

export const metadata: Metadata = { title: 'DineNova — Owner', description: 'Restaurant management dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-neutral-50 font-sans antialiased">{children}</body>
    </html>
  );
}
