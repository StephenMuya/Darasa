/**
 * SomaHero.integration.test.tsx
 *
 * Integration smoke-test: verifies the full hero page composes correctly
 * and all major landmarks are present in a single render.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SomaHero from '../components/SomaHero';

describe('SomaHero – full page integration', () => {
  it('renders without crashing', () => {
    expect(() => render(<SomaHero />)).not.toThrow();
  });

  it('renders the darasa brand name', () => {
    render(<SomaHero />);
    expect(screen.getAllByText(/darasa/i).length).toBeGreaterThan(0);
  });

  it('renders the main h1 heading', () => {
    render(<SomaHero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the chat prompt input', () => {
    render(<SomaHero />);
    expect(screen.getByRole('textbox', { name: /ask darasa/i })).toBeInTheDocument();
  });

  it('renders CBC line art illustrations', () => {
    render(<SomaHero />);
    expect(screen.getByAltText(/graduating cbc students/i)).toBeInTheDocument();
    expect(screen.getByAltText(/three cbc uniform students/i)).toBeInTheDocument();
    expect(screen.getByAltText(/mother and daughter/i)).toBeInTheDocument();
    expect(screen.getByAltText(/teacher guiding young cbc learners/i)).toBeInTheDocument();
    expect(screen.getByAltText(/teacher and learner exploring interactive/i)).toBeInTheDocument();
    expect(screen.getByAltText(/mother encouraging learner/i)).toBeInTheDocument();
  });

  it('has a sticky header/nav landmark', () => {
    render(<SomaHero />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('has a main content landmark', () => {
    render(<SomaHero />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('mobile nav toggle works end-to-end', () => {
    render(<SomaHero />);
    const toggleBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
    // Drawer initially closed – only desktop links visible
    const linksBefore = screen.queryAllByRole('link', { name: /for parents/i });
    expect(linksBefore.length).toBe(1);
    // Open drawer
    fireEvent.click(toggleBtn);
    // Now both desktop + mobile links in DOM
    const linksAfter = screen.queryAllByRole('link', { name: /for parents/i });
    expect(linksAfter.length).toBe(2);
  });

  it('pill click fills the chat input (cross-component state)', () => {
    render(<SomaHero />);
    fireEvent.click(screen.getByRole('button', { name: /reasoning/i }));
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: /ask darasa/i });
    expect(input.value.length).toBeGreaterThan(0);
  });
});
