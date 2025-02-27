import type { Config } from 'tailwindcss';
import catppuccin from '@catppuccin/daisyui';
import daisyui from 'daisyui';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    logs: false,
    darkTheme: 'macchiato',
    themes: [
      catppuccin('latte', 'lavender'),
      catppuccin('macchiato', 'lavender'),
    ],
  },
} satisfies Config;
