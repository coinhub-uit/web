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
    <NextThemeProvider attribute="class" defaultTheme="pastel" themes={themes}>
      {children}
    </NextThemeProvider>
  );
}
