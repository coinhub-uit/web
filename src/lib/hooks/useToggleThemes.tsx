'use client';

import { useTheme } from 'next-themes';

export default function useToggleThemes(): {
  isDark: boolean;
  toggleThemes: () => void;
} {
  const { theme, setTheme, themes } = useTheme();
  const isDark = theme === themes[1];
  const toggleTheme = () => {
    const newTheme = theme === themes[0] ? themes[1] : themes[0];
    setTheme(newTheme);
  };
  return { isDark, toggleThemes: toggleTheme };
}
