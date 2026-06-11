import type { Metadata } from 'next';
import { inter, poppins } from '@dinenovaai/ui/fonts';
import '@dinenovaai/ui/globals.css';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'DineNova — Order',
  description: 'Order food at your table',
  manifest: '/manifest.json',
  themeColor: '#f97316',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-surface-base font-sans antialiased">{children}</body>
    </html>
  );
}
