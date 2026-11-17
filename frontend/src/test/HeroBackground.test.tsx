/**
 * HeroBackground.test.tsx
 *
 * Tests: watermark words are present and decorative orbs are in the DOM.
 * All elements are aria-hidden so we query by text content directly.
 */
import { render } from '@testing-library/react';
// vitest globals
import HeroBackground from '../components/hero/HeroBackground';

describe('HeroBackground – watermark words', () => {
  it('renders ASK. watermark text', () => {
    const { container } = render(<HeroBackground />);
    expect(container.textContent).toContain('ASK.');
  });

  it('renders LEARN. watermark text', () => {
    const { container } = render(<HeroBackground />);
    expect(container.textContent).toContain('LEARN.');
  });

  it('renders GROW. watermark text', () => {
    const { container } = render(<HeroBackground />);
    expect(container.textContent).toContain('GROW.');
  });

  it('watermark wrapper is aria-hidden', () => {
    const { container } = render(<HeroBackground />);
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).toBeInTheDocument();
  });
});

describe('HeroBackground – ambient orbs', () => {
  it('renders the bottom-left ambient orb element', () => {
    const { container } = render(<HeroBackground />);
    const orb = container.querySelector('.ambient-bottom-left-orb');
    expect(orb).toBeInTheDocument();
  });

  it('renders the right-side amber glow element', () => {
    const { container } = render(<HeroBackground />);
    const glow = container.querySelector('.ambient-right-amber-glow');
    expect(glow).toBeInTheDocument();
  });

  it('both orbs are non-interactive (pointer-events-none)', () => {
    const { container } = render(<HeroBackground />);
    const orbs = container.querySelectorAll('.ambient-bottom-left-orb, .ambient-right-amber-glow');
    orbs.forEach((orb) => {
      expect(orb.classList.contains('pointer-events-none')).toBe(true);
    });
  });
});
