import type { Config } from 'tailwindcss';

import daisyui from 'daisyui';

const config: Config = {
  content: ['./src/components/**/*.tsx', './src/app/**/*.tsx'],
  plugins: [daisyui],
};

export default config;
