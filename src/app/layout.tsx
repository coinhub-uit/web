import '@/app/globals.css';

import type { Metadata } from 'next';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Noto_Sans } from 'next/font/google';

import StoreProvider from '@/contexts/storeProvider';
import SwrConfig from '@/contexts/swrConfig';
import { SessionProvider } from 'next-auth/react';
import ThemeProvider from '@/contexts/themeProvider';

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
          <StoreProvider>
            <SwrConfig>
              <ThemeProvider>{children}</ThemeProvider>
            </SwrConfig>
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
