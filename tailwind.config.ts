import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
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
  plugins: [animate, daisyui],
  daisyui: {
    themes: ['pastel', 'dracula'],
  },
};

export default config;
