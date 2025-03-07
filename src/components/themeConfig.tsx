'use client';

import { ThemeProvider } from 'next-themes';

export default function ThemeConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
