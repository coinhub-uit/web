'use client';

import { ThemeProvider } from 'next-themes';

export default function ThemeConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="pastel"
      themes={['pastel', 'dracula']}
    >
      {children}
    </ThemeProvider>
  );
}
