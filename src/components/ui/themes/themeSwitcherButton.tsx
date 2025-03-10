'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsChecked(theme === 'dracula');
  }, [theme]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? 'dracula' : 'pastel';
    setTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={handleChange}
      className="toggle"
    />
  );
}
