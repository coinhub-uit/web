'use client';

import { useTheme } from 'next-themes';

export default function useToggleThemes(isDark: boolean) {
  const { theme, setTheme } = useTheme();
}
