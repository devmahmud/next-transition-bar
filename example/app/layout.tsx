import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTransitionBar from 'next-transition-bar';
import Nav from './Nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'next-transition-bar Demo',
  description: 'Demo showcasing next-transition-bar features',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-gray-50 ${inter.className}`}>
        <NextTransitionBar color="#6366f1" height={3} showSpinner={false} />
        <Nav />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
