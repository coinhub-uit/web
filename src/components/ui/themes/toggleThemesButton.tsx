'use client';
import useToggleThemes from '@/lib/hooks/useToggleThemes';

export default function ToggleThemesButton() {
  const { isDark, toggleThemes } = useToggleThemes();

  return (
    <input
      type="checkbox"
      checked={isDark}
      onChange={toggleThemes}
      className="toggle"
    />
  );
}
