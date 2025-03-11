'use client';
import { Themes } from '@/types/theme';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(theme === 'dracula');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? 'dracula' : 'pastel';
    setTheme(newTheme);
  };

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={handleChange}
      className="toggle"
    />
  );
}
