import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

type DaisyUIThemes =
  | 'pastel'
  | 'dracula'
  | 'light'
  | 'dark'
  | 'cupcake'
  | 'bumblebee'
  | 'emerald';

const config: Config & {
  daisyui?: {
    themes?: DaisyUIThemes[];
  };
} = {
  // darkMode: 'class',
  content: ['./src/**/*.{tsx,ts,jsx,js}'],
  plugins: [daisyui],
  daisyui: {
    themes: ['pastel', 'dracula'],
  },
};

export default config;
