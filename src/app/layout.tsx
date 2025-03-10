import '@/app/globals.css';

import type { Metadata } from 'next';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Noto_Sans } from 'next/font/google';

import StoreConfig from '@/components/storeConfig';
import SwrConfig from '@/components/swrConfig';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from 'next-themes';

const noto_sans: NextFontWithVariable = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CoinHub',
  description: 'Let us protect your money',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${noto_sans.variable} antialiased`}>
        <SessionProvider>
          <StoreConfig>
            <SwrConfig>
              <ThemeProvider
                attribute="data-theme"
                enableSystem={false}
                defaultTheme="pastel"
              >
                {children}
              </ThemeProvider>
            </SwrConfig>
          </StoreConfig>
        </SessionProvider>
      </body>
    </html>
  );
}
