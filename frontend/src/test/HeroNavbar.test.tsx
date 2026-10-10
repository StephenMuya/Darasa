/**
 * HeroNavbar.test.tsx
 *
 * Tests: branding, desktop nav links, auth CTAs, and mobile drawer toggle.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroNavbar from '../components/hero/HeroNavbar';

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderNavbar(isOpen = false) {
  const onToggle = vi.fn();
  const result = render(<HeroNavbar isOpen={isOpen} onToggle={onToggle} />);
  return { ...result, onToggle };
}

// ── Brand ─────────────────────────────────────────────────────────────────────

describe('HeroNavbar – branding', () => {
  it('renders the darasa brand name', () => {
    renderNavbar();
    expect(screen.getByText('darasa')).toBeInTheDocument();
  });

  it('home link points to "/"', () => {
    renderNavbar();
    const homeLink = screen.getByRole('link', { name: /darasa home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders the SVG logo mark', () => {
    const { container } = renderNavbar();
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});

// ── Desktop navigation ────────────────────────────────────────────────────────

describe('HeroNavbar – desktop nav links', () => {
  const expectedLinks = [
    { label: 'Curriculum Strands', href: '#curriculum' },
    { label: 'For Teachers',       href: '#teachers' },
    { label: 'For Learners',       href: '#students' },
    { label: 'For Parents',        href: '#parents' },
    { label: 'How It Works',       href: '#how-it-works' },
  ];

  it.each(expectedLinks)('renders "$label" link with correct href', ({ label, href }) => {
    renderNavbar();
    const links = screen.getAllByRole('link', { name: label });
    // The same link appears in both desktop nav and mobile drawer markup;
    // at least one of them must carry the correct href.
    expect(links.some((l) => l.getAttribute('href') === href)).toBe(true);
  });
});

// ── Auth CTAs ─────────────────────────────────────────────────────────────────

describe('HeroNavbar – auth CTAs', () => {
  it('renders a "Log in" link', () => {
    renderNavbar();
    expect(screen.getAllByText(/log in/i).length).toBeGreaterThan(0);
  });

  it('renders a "Start Free" button', () => {
    renderNavbar();
    expect(screen.getAllByText(/start free/i).length).toBeGreaterThan(0);
  });
});

// ── Mobile drawer toggle ──────────────────────────────────────────────────────

describe('HeroNavbar – mobile drawer', () => {
  it('mobile menu button calls onToggle when clicked', () => {
    const { onToggle } = renderNavbar(false);
    const toggleBtn = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(toggleBtn);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('drawer is hidden when isOpen=false', () => {
    renderNavbar(false);
    // Mobile nav links are only rendered when isOpen=true
    const drawerLinks = screen.queryAllByRole('link', { name: /how it works/i });
    // Only the desktop link exists (which is inside a hidden-on-mobile nav)
    expect(drawerLinks.length).toBe(1);
  });

  it('drawer is visible when isOpen=true', () => {
    renderNavbar(true);
    // When open, both desktop + mobile links are in the DOM
    const drawerLinks = screen.queryAllByRole('link', { name: /how it works/i });
    expect(drawerLinks.length).toBe(2);
  });
});
