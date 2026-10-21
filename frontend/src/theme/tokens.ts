import type { SomaCSSVariables } from './themeTypes';

/**
 * SomaAI Core Brand & Palette Design Tokens
 * System-wide single source of truth for colors, CSS custom properties, and background gradients.
 */

export const SOMA_COLORS = {
  accent: '#1F7A4D',
  accentHover: '#18633E',
  amberGlow: '#FCE9C8',
  amber: '#EE9B2E',
  mintSoft: '#F0F8F3',
  mintLight: '#DCF0E3',
  mintMedium: '#BCE2CB',
  forestLight: '#8CCFA6',
  forestMid: '#5CB47F',
  forestDark: '#144D2E',
} as const;

export const SOMA_THEME_VARS: SomaCSSVariables = {
  '--soma-accent': SOMA_COLORS.accent,
  '--soma-accent-hover': SOMA_COLORS.accentHover,
  '--soma-amber-glow': SOMA_COLORS.amberGlow,
  '--soma-amber': SOMA_COLORS.amber,
};

export const SOMA_GRADIENTS = {
  /** Canonical mint-and-sage uniform gradient used across Landing, Auth & CTA */
  pageMesh: 'linear-gradient(160deg, #F0F8F3 0%, #DCF0E3 26%, #BCE2CB 58%, #8CCFA6 84%, #5CB47F 100%)',
  /** Chat workspace glass backdrop gradient */
  chatWorkspace: 'linear-gradient(to bottom right, #F5FAF7, #EAF3EE, #DCEDE2)',
  /** Libre Baskerville headline brand text-fade */
  headingTextFade: 'linear-gradient(95deg, #144D2E 0%, #1F7A4D 42%, #52B788 75%, #9AE6B4 95%, #D1FAE5 100%)',
} as const;
