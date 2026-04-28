import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        panel: 'var(--color-panel)',
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)'
      }
    }
  },
  plugins: []
};

export default config;
