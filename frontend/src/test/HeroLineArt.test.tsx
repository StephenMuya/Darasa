/**
 * HeroLineArt.test.tsx
 *
 * Tests: all three illustration images are present with correct alt text,
 * the decorative SVG motif exists, and the baseline gradient renders.
 */
import { render, screen } from '@testing-library/react';
// vitest globals
import HeroLineArt from '../components/hero/HeroLineArt';

describe('HeroLineArt – scene images', () => {
  it('renders the graduates scene image', () => {
    render(<HeroLineArt />);
    expect(
      screen.getByAltText(/graduating cbc students celebrating with mortarboards/i),
    ).toBeInTheDocument();
  });

  it('renders the students-at-desk scene image', () => {
    render(<HeroLineArt />);
    expect(
      screen.getByAltText(/three cbc uniform students studying around table/i),
    ).toBeInTheDocument();
  });

  it('renders the parent-child scene image', () => {
    render(<HeroLineArt />);
    expect(
      screen.getByAltText(/mother and daughter working together on laptop/i),
    ).toBeInTheDocument();
  });

  it('renders the teacher-learners classroom scene image', () => {
    render(<HeroLineArt />);
    expect(
      screen.getByAltText(/teacher guiding young cbc learners/i),
    ).toBeInTheDocument();
  });

  it('renders the teacher-student tablet scene image', () => {
    render(<HeroLineArt />);
    expect(
      screen.getByAltText(/teacher and learner exploring interactive digital lesson/i),
    ).toBeInTheDocument();
  });

  it('renders the parent-learner backpack scene image', () => {
    render(<HeroLineArt />);
    expect(
      screen.getByAltText(/mother encouraging learner with school backpack/i),
    ).toBeInTheDocument();
  });

  it('graduates image points to /images/graduates.png', () => {
    render(<HeroLineArt />);
    const img = screen.getByAltText(/graduating cbc students/i);
    expect(img).toHaveAttribute('src', '/images/graduates.png');
  });
});

describe('HeroLineArt – decorative elements', () => {
  it('renders the decorative SVG learning motif', () => {
    const { container } = render(<HeroLineArt />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders the ground baseline gradient bar', () => {
    const { container } = render(<HeroLineArt />);
    // The baseline is a div with a bg-gradient-to-r class
    const baseline = container.querySelector('[class*="bg-gradient-to-r"]');
    expect(baseline).toBeInTheDocument();
  });

  it('outer container is aria-hidden (purely decorative)', () => {
    const { container } = render(<HeroLineArt />);
    const outer = container.firstElementChild;
    expect(outer).toHaveAttribute('aria-hidden', 'true');
  });

  it('outer container is pointer-events-none', () => {
    const { container } = render(<HeroLineArt />);
    const outer = container.firstElementChild;
    expect(outer?.classList.contains('pointer-events-none')).toBe(true);
  });
});
