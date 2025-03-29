import '@/app/globals.css';

import type { Metadata } from 'next';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Noto_Sans } from 'next/font/google';

import StoreProvider from '@/contexts/storeProvider';
import SwrConfig from '@/contexts/swrConfig';
import ThemeProvider from '@/contexts/themeProvider';
import SessionProvider from '@/contexts/sessionProvider';

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
        <StoreProvider>
          <SwrConfig>
            <ThemeProvider>
              <SessionProvider>{children}</SessionProvider>
            </ThemeProvider>
          </SwrConfig>
        </StoreProvider>
      </body>
    </html>
  );
}
