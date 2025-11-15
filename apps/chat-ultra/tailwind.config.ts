import type { Config } from 'tailwindcss';
import { colors, spacing, borderRadius, shadows, typography, breakpoints } from './lib/theme/tokens';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        border: {
          default: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.14)',
        },
      },
      spacing: spacing,
      borderRadius: borderRadius,
      boxShadow: shadows,
      fontFamily: {
        sans: typography.fontSans.split(', '),
        cjk: typography.fontCJK.split(', '),
      },
      fontSize: {
        h0: [typography.sizes.h0, { lineHeight: typography.lineHeights.tight }],
        h1: [typography.sizes.h1, { lineHeight: typography.lineHeights.tight }],
        h2: [typography.sizes.h2, { lineHeight: typography.lineHeights.tight }],
        h3: [typography.sizes.h3, { lineHeight: typography.lineHeights.tight }],
        h4: [typography.sizes.h4, { lineHeight: typography.lineHeights.tight, fontWeight: typography.weights.semibold }],
        body: [typography.sizes.body, { lineHeight: typography.lineHeights.body }],
        'body-small': [typography.sizes['body-small'], { lineHeight: typography.lineHeights.body }],
        label: [typography.sizes.label, { lineHeight: '1.2' }],
      },
      screens: {
        sm: breakpoints.sm,
        md: breakpoints.md,
        lg: breakpoints.lg,
        xl: breakpoints.xl,
      },
    },
  },
  plugins: [],
};

export default config;

