import type React from 'react';

/**
 * Type-safe interface for SomaAI CSS Custom Properties.
 * Eliminates the need for `as any` type assertions on style props.
 */
export interface SomaCSSVariables extends React.CSSProperties {
  '--soma-accent'?: string;
  '--soma-accent-hover'?: string;
  '--soma-amber-glow'?: string;
  '--soma-amber'?: string;
}
