import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(theme !== 'pastel');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    setTheme(event.target.checked ? 'dracula' : 'pastel');
  };

  return (
    <input
      type="checkbox"
      defaultChecked={isChecked}
      onChange={handleChange}
      className="toggle"
    />
  );
}
