/**
 * HeroChatPanel.test.tsx
 *
 * Tests: tab switching, prompt input, action pill interactions, send button.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroChatPanel from '../components/hero/HeroChatPanel';

// ── Initial render ─────────────────────────────────────────────────────────────

describe('HeroChatPanel – initial render', () => {
  it('renders the darasa greeting headline', () => {
    render(<HeroChatPanel />);
    expect(screen.getByText(/good morning/i)).toBeInTheDocument();
  });

  it('renders the "Assist You Today?" text', () => {
    render(<HeroChatPanel />);
    expect(screen.getByText(/assist you today/i)).toBeInTheDocument();
  });

  it('renders the prompt input field', () => {
    render(<HeroChatPanel />);
    expect(screen.getByRole('textbox', { name: /ask darasa/i })).toBeInTheDocument();
  });

  it('input starts empty', () => {
    render(<HeroChatPanel />);
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: /ask darasa/i });
    expect(input.value).toBe('');
  });

  it('renders the send button', () => {
    render(<HeroChatPanel />);
    expect(screen.getByRole('button', { name: /send prompt/i })).toBeInTheDocument();
  });
});

// ── Navigation Bar & Window Controls ───────────────────────────────────────

describe('HeroChatPanel – navigation bar & window controls', () => {
  it('does not render Curriculum Hub, KICD Curriculum, or darasa 4o tags', () => {
    render(<HeroChatPanel />);
    expect(screen.queryByText('Curriculum Hub')).not.toBeInTheDocument();
    expect(screen.queryByText('KICD Curriculum')).not.toBeInTheDocument();
    expect(screen.queryByText('darasa 4o')).not.toBeInTheDocument();
  });

  it('renders the start new conversation button below search', () => {
    render(<HeroChatPanel />);
    const newConvBtn = screen.getByRole('button', { name: /start a new conversation/i });
    expect(newConvBtn).toBeInTheDocument();
  });

  it('clicking new conversation resets the input', () => {
    render(<HeroChatPanel />);
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: /ask darasa/i });
    fireEvent.change(input, { target: { value: 'Something' } });
    expect(input.value).toBe('Something');
    const newConvBtn = screen.getByRole('button', { name: /start a new conversation/i });
    fireEvent.click(newConvBtn);
    expect(input.value).toBe('');
  });
});

// ── Action pills ───────────────────────────────────────────────────────────────

describe('HeroChatPanel – action pills', () => {
  it('renders the Reasoning pill', () => {
    render(<HeroChatPanel />);
    expect(screen.getByRole('button', { name: /reasoning/i })).toBeInTheDocument();
  });

  it('renders the Create Project pill', () => {
    render(<HeroChatPanel />);
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
  });

  it('clicking Reasoning pill fills the input with a prompt', () => {
    render(<HeroChatPanel />);
    fireEvent.click(screen.getByRole('button', { name: /reasoning/i }));
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: /ask darasa/i });
    expect(input.value).toMatch(/transpiration/i);
  });

  it('clicking Create Project pill fills the input with a lesson prompt', () => {
    render(<HeroChatPanel />);
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: /ask darasa/i });
    expect(input.value).toMatch(/plant water loss/i);
  });
});

// ── Prompt input ───────────────────────────────────────────────────────────────

describe('HeroChatPanel – prompt input', () => {
  it('accepts typed input', () => {
    render(<HeroChatPanel />);
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: /ask darasa/i });
    fireEvent.change(input, { target: { value: 'Explain photosynthesis' } });
    expect(input.value).toBe('Explain photosynthesis');
  });
});

// ── Sidebar ────────────────────────────────────────────────────────────────────

describe('HeroChatPanel – sidebar', () => {
  it('renders the Home sidebar nav item', () => {
    render(<HeroChatPanel />);
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
  });

  it('renders recent lesson entries', () => {
    render(<HeroChatPanel />);
    expect(screen.getByText(/plant transpiration lab/i)).toBeInTheDocument();
    expect(screen.getByText(/soil conservation project/i)).toBeInTheDocument();
  });

  it('shows the darasa Online status indicator', () => {
    render(<HeroChatPanel />);
    expect(screen.getByText(/darasa online/i)).toBeInTheDocument();
  });
});
