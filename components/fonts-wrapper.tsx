"use client"

import { Geist, Geist_Mono } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

interface FontsWrapperProps {
  children: React.ReactNode;
}

export function FontsWrapper({ children }: FontsWrapperProps) {
  return (
    <div className={`${geist.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}

