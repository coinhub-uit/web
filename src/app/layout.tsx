import StoreProvider from '@/app/storeProvider';
import type { Metadata } from 'next';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Noto_Sans } from 'next/font/google';

const noto_sans: NextFontWithVariable = Noto_Sans({
  variable: '--font-noto-sans',
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
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
