/**
 * HeroTextPanel.test.tsx
 *
 * Tests: headline content, sub-heading, primary CTA button, and secondary link.
 */
import { render, screen } from '@testing-library/react';
// vitest globals
import HeroTextPanel from '../components/hero/HeroTextPanel';

describe('HeroTextPanel – headline', () => {
  it('renders an h1 element', () => {
    render(<HeroTextPanel />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('h1 contains the brand keyword "CBC"', () => {
    render(<HeroTextPanel />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/CBC/i);
  });

  it('h1 is inside the hero-heading-box container', () => {
    const { container } = render(<HeroTextPanel />);
    const box = container.querySelector('#hero-heading-box');
    expect(box).toBeInTheDocument();
    expect(box?.querySelector('h1')).toBeInTheDocument();
  });
});

describe('HeroTextPanel – sub-heading', () => {
  it('renders the sub-heading paragraph', () => {
    render(<HeroTextPanel />);
    const subheading = screen.getByText(/official KICD Curriculum Designs/i);
    expect(subheading).toBeInTheDocument();
  });

  it('sub-heading is inside hero-subheading-box', () => {
    const { container } = render(<HeroTextPanel />);
    const box = container.querySelector('#hero-subheading-box');
    expect(box).toBeInTheDocument();
    expect(box?.querySelector('p')).toBeInTheDocument();
  });
});

describe('HeroTextPanel – CTAs', () => {
  it('renders the primary "Start chatting" button', () => {
    render(<HeroTextPanel />);
    expect(screen.getByRole('button', { name: /start chatting/i })).toBeInTheDocument();
  });

  it('primary button has an accessible aria-label', () => {
    render(<HeroTextPanel />);
    const btn = screen.getByRole('button', { name: /start chatting with darasa/i });
    expect(btn).toBeInTheDocument();
  });

  it('renders the "See how it works" secondary link', () => {
    render(<HeroTextPanel />);
    const link = screen.getByRole('link', { name: /see how it works/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#how-it-works');
  });

  it('renders the availability notice', () => {
    render(<HeroTextPanel />);
    expect(screen.getByText(/covering cbc curriculum/i)).toBeInTheDocument();
  });

  it('primary button has glassmorphism styling', () => {
    render(<HeroTextPanel />);
    const btn = screen.getByRole('button', { name: /start chatting/i });
    expect(btn.className).toContain('glass-btn-accent');
  });
});
