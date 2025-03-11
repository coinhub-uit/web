'use client';

import { Themes } from '@/types/theme';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const themes: Themes[] = ['pastel', 'dracula'];

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemeProvider attribute="data-theme" themes={themes}>
      {children}
    </NextThemeProvider>
  );
}
