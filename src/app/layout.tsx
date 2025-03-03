import '@/app/globals.css';

import type { Metadata } from 'next';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Noto_Sans } from 'next/font/google';

import StoreProvider from '@/app/storeProvider';
import SwrConfig from '@/app/swrConfig';

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
    <html lang="en">
      <body className={`${noto_sans.variable} antialiased`}>
        <StoreProvider>
          <SwrConfig>
            {/* TODO: Sidebar / Navbar here */}
            {children}
          </SwrConfig>
        </StoreProvider>
      </body>
    </html>
  );
}
