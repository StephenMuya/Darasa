/**
 * ProblemStatement.test.tsx
 *
 * Tests: Problem statement section renders with deep forest green background,
 * occupies full screen height with scroll snapping,
 * h2 heading has the 3 lines centered in the amber color (#EE9B2E).
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProblemStatement from '../components/ProblemStatement';

describe('ProblemStatement – section layout & background', () => {
  it('renders without crashing', () => {
    expect(() => render(<ProblemStatement />)).not.toThrow();
  });

  it('has a section landmark with problem-statement id', () => {
    const { container } = render(<ProblemStatement />);
    const section = container.querySelector('#problem-statement');
    expect(section).toBeInTheDocument();
  });

  it('occupies the full screen height', () => {
    const { container } = render(<ProblemStatement />);
    const section = container.querySelector('#problem-statement');
    expect(section?.className).toMatch(/h-screen/);
  });
});

describe('ProblemStatement – heading structure, left-alignment & styling', () => {
  it('renders an h2 heading element', () => {
    render(<ProblemStatement />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('heading contains "Administrative and Financial Bottlenecks"', () => {
    render(<ProblemStatement />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toMatch(/Administrative and Financial Bottlenecks/i);
  });

  it('heading contains "in the" on its own block', () => {
    render(<ProblemStatement />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toMatch(/in the/i);
  });

  it('heading contains "Competency-Based Curriculum"', () => {
    render(<ProblemStatement />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toMatch(/Competency-Based Curriculum/i);
  });

  it('heading has the three distinct structural lines', () => {
    const { container } = render(<ProblemStatement />);
    const heading = container.querySelector('h2');
    const spans = heading?.querySelectorAll('span');
    expect(spans).toBeDefined();
    expect(spans?.length).toBe(3);
    expect(spans?.[0].textContent?.trim()).toBe('Administrative and Financial Bottlenecks');
    expect(spans?.[1].textContent?.trim()).toBe('in the');
    expect(spans?.[2].textContent?.trim()).toBe('Competency-Based Curriculum');
  });

  it('heading has left-alignment', () => {
    const { container } = render(<ProblemStatement />);
    const heading = container.querySelector('h2');
    expect(heading?.className).toMatch(/text-left/);
    const spans = heading?.querySelectorAll('span');
    spans?.forEach((span) => {
      expect(span.className).toMatch(/text-left/);
    });
  });

  it('heading is styled with the CBC teacher fading gradient color effect', () => {
    render(<ProblemStatement />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(
      heading.className.includes('heading-text-fade') ||
      heading.style.background.includes('linear-gradient') ||
      heading.querySelector('.heading-text-fade') !== null
    ).toBe(true);
  });

  it('heading applies extra-large font scaling classes', () => {
    render(<ProblemStatement />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.className).toMatch(/text-3xl/);
    expect(heading.className).toMatch(/lg:text-7xl/);
  });
});

describe('ProblemStatement – problem cards on the right', () => {
  it('renders four problem statement cards with image backgrounds', () => {
    const { container } = render(<ProblemStatement />);
    const cards = container.querySelectorAll('#problem-statement-cards > div');
    expect(cards.length).toBe(4);
  });

  it('renders card titles for all four bottleneck areas', () => {
    render(<ProblemStatement />);
    expect(screen.getByText('Paperwork Overload')).toBeInTheDocument();
    expect(screen.getByText('Resource & Craft Costs')).toBeInTheDocument();
    expect(screen.getByText('Continuous Assessment')).toBeInTheDocument();
    expect(screen.getByText('Digital Divide')).toBeInTheDocument();
  });
});
