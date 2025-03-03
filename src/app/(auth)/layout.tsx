import '@/app/globals.css';

import type { Metadata } from 'next';

import StoreProvider from '@/app/storeProvider';
import SwrConfig from '@/app/swrConfig';

export const metadata: Metadata = {
  title: 'CoinHub',
  description: 'Let us protect your money', // TODO: For login?? " ... | Login"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <SwrConfig>{children}</SwrConfig>
    </StoreProvider>
  );
}
