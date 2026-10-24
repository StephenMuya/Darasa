/**
 * Footer.test.tsx
 *
 * Tests: Footer renders with uniform brand mint-and-sage background,
 * displays Darasa branding, navigation links across curriculum and audiences,
 * handles newsletter subscription state, and includes Kenyan CBC attribution.
 */

import { render, screen, fireEvent } from '@testing-library/react';
// vitest globals
import Footer from '../components/Footer';

describe('Footer – layout & background uniformity', () => {
  it('renders without crashing', () => {
    expect(() => render(<Footer />)).not.toThrow();
  });

  it('has a footer landmark with landing-footer id', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('#landing-footer');
    expect(footer).toBeInTheDocument();
  });

  it('has the uniform mint-and-sage brand gradient background', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('#landing-footer') as HTMLElement;
    expect(footer.style.background).toContain('linear-gradient');
    // jsdom normalizes hex colors (#F0F8F3 -> rgb(240, 248, 243))
    expect(footer.style.background).toMatch(/(#F0F8F3|rgb\(240,\s*248,\s*243\))/);
  });

  it('renders ambient decorative glow orbs', () => {
    const { container } = render(<Footer />);
    const amberGlow = container.querySelector('.ambient-right-amber-glow');
    const mintOrb = container.querySelector('.ambient-bottom-left-orb');
    expect(amberGlow).toBeInTheDocument();
    expect(mintOrb).toBeInTheDocument();
  });
});

describe('Footer – brand identity & navigation', () => {
  it('renders Darasa brand name and logo mark', () => {
    render(<Footer />);
    expect(screen.getByText('Darasa')).toBeInTheDocument();
  });

  it('renders curriculum links', () => {
    render(<Footer />);
    expect(screen.getByText('Pre-Primary (PP1 & PP2)')).toBeInTheDocument();
    expect(screen.getByText('Lower Primary (Grades 1–3)')).toBeInTheDocument();
    expect(screen.getByText('Upper Primary (Grades 4–6)')).toBeInTheDocument();
    expect(screen.getByText('Junior School (Grades 7–9)')).toBeInTheDocument();
  });

  it('renders audience solution links', () => {
    render(<Footer />);
    expect(screen.getByText('For CBC Teachers')).toBeInTheDocument();
    expect(screen.getByText('For Junior Learners')).toBeInTheDocument();
    expect(screen.getByText('For Parents & Guardians')).toBeInTheDocument();
  });

  it('renders compliance and trust badges', () => {
    render(<Footer />);
    expect(screen.getByText(/KICD Curriculum Aligned/i)).toBeInTheDocument();
    expect(screen.getByText(/Child-Safe & Family-First/i)).toBeInTheDocument();
  });
});

describe('Footer – newsletter form & interactive feedback', () => {
  it('renders the newsletter subscription input and button', () => {
    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /email address for curriculum updates/i });
    const button = screen.getByRole('button', { name: /subscribe to updates/i });
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('shows success feedback upon submitting a valid email', () => {
    render(<Footer />);
    const input = screen.getByRole('textbox', { name: /email address for curriculum updates/i });
    const button = screen.getByRole('button', { name: /subscribe to updates/i });

    fireEvent.change(input, { target: { value: 'teacher@shule.ac.ke' } });
    fireEvent.click(button);

    expect(screen.getByText(/Thank you! You are subscribed to CBC updates/i)).toBeInTheDocument();
  });
});

describe('Footer – copyright & Kenyan CBC attribution', () => {
  it('renders copyright statement and Kenya CBC badge', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Darasa \(SomaAI\)\. All rights reserved\./i)).toBeInTheDocument();
    expect(screen.getByText(/Proudly built for Kenya's Competency-Based Curriculum/i)).toBeInTheDocument();
  });

  it('renders legal and safety links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Child Safety')).toBeInTheDocument();
  });
});
