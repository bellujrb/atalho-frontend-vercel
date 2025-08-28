import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import Script from 'next/script';
import './globals.css';
import { AppContextProvider } from '@/contexts/app-context';
import { ArtifactProvider } from '@/contexts/artifact-context';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Atalho',
  description: 'Seu cursor financeiro.',
};

export const viewport = {
  maximumScale: 1,
};

export const dynamic = 'force-static';
export const revalidate = false;

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        variables: {
          colorPrimary: "#10b981"
        }
      }}
    >
      <html
        lang="pt-BR"
        className={`${geist.variable} ${geistMono.variable}`}
      >
        <body className="antialiased">
          <Providers>
            <Script
              src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
              strategy="beforeInteractive"
            />
            <AppContextProvider>
              <ArtifactProvider>
                {children}
              </ArtifactProvider>
            </AppContextProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
