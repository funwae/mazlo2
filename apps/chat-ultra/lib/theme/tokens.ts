/**
 * Design Tokens for Chat Ultra
 * Based on docs/04_VISUAL_DESIGN_SYSTEM.md
 */

export const colors = {
  // Background Colors
  'bg-root': '#050712',
  'bg-surface': '#0B0E1C',
  'bg-surface-soft': '#101426',
  'bg-elevated': '#151A2E',

  // Text Colors
  'text-primary': '#F7FAFC',
  'text-secondary': '#A0AEC0',
  'text-muted': '#718096',
  'text-invert': '#050712',

  // Accent Colors
  'accent-primary': '#4FD1FF',
  'accent-secondary': '#FFB347',
  'accent-info': '#63B3ED',
  'accent-success': '#48BB78',
  'accent-warning': '#ECC94B',
  'accent-danger': '#F56565',

  // Neutral Grayscale
  'gray-50': '#F7FAFC',
  'gray-100': '#EDF2F7',
  'gray-200': '#E2E8F0',
  'gray-300': '#CBD5E0',
  'gray-400': '#A0AEC0',
  'gray-500': '#718096',
  'gray-600': '#4A5568',
  'gray-700': '#2D3748',
  'gray-800': '#1A202C',
} as const;

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const;

export const borderRadius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  pill: '999px',
} as const;

export const shadows = {
  1: '0 14px 45px rgba(0, 0, 0, 0.45)',
  2: '0 22px 65px rgba(0, 0, 0, 0.65)',
  'glow-primary': '0 0 12px rgba(79,209,255,0.35)',
  'glow-mazlo': '0 0 6px rgba(79,209,255,0.45)',
} as const;

export const typography = {
  fontSans: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
  fontCJK: '"PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", system-ui, sans-serif',
  sizes: {
    h0: '40px',
    h1: '32px',
    h2: '24px',
    h3: '20px',
    h4: '16px',
    body: '16px',
    'body-small': '14px',
    label: '12px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
  lineHeights: {
    body: 1.5,
    tight: 1.6,
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '961px',
  lg: '1280px',
  xl: '1600px',
} as const;

export const borders = {
  default: 'rgba(255,255,255,0.06)',
  strong: 'rgba(255,255,255,0.14)',
} as const;

