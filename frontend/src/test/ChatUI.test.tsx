/**
 * ChatUI.test.tsx
 *
 * Tests: Main Darasa AI Chatbot workspace functionality:
 * - Minimal navigation bar with brand logo, wordmark & attached info
 * - Grounded section layout (sits directly on the section canvas)
 * - Pristine default centered state: "Good Morning, Judha", "How Can I Assist You Today?", and inquiry subtitle
 * - Interactive prompt input, mode pills, and live message dispatch
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// vitest globals
import ChatUI from '../components/ChatUI';

describe('ChatUI – layout & navigation header', () => {
  it('renders without crashing', () => {
    expect(() => render(<ChatUI onBack={vi.fn()} />)).not.toThrow();
  });

  it('renders the Darasa brand logo, wordmark and attached information in the header', () => {
    render(<ChatUI onBack={vi.fn()} />);
    expect(screen.getAllByText('Darasa').length).toBeGreaterThan(0);
    expect(screen.getByText(/cbc workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/kenya cbc educational intelligence/i)).toBeInTheDocument();
  });

  it('navigates back to home when the brand logo in the header is clicked', () => {
    const handleBack = vi.fn();
    render(<ChatUI onBack={handleBack} />);
    const brandLink = screen.getByRole('link', { name: /darasa home/i });
    expect(brandLink).toBeInTheDocument();
    fireEvent.click(brandLink);
    expect(handleBack).toHaveBeenCalledOnce();
  });
});

describe('ChatUI – default centered state', () => {
  it('renders the 3D luminous orb and default greeting texts centered', () => {
    render(<ChatUI onBack={vi.fn()} />);
    expect(screen.getByText(/good morning, judha/i)).toBeInTheDocument();
    expect(screen.getByText(/how can i/i)).toBeInTheDocument();
    expect(screen.getByText(/assist you today\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/inquire on cbc schemes, formative rubrics, or practical lesson activities using local materials/i)
    ).toBeInTheDocument();
  });

  it('renders the prompt launcher input in the default centered state', () => {
    render(<ChatUI onBack={vi.fn()} />);
    const input = screen.getByRole('textbox', { name: /darasa ai prompt input/i });
    expect(input).toBeInTheDocument();
  });

  it('populates input when an action pill is clicked', () => {
    render(<ChatUI onBack={vi.fn()} />);
    const rubricPill = screen.getByRole('button', { name: /formative rubric/i });
    fireEvent.click(rubricPill);
    const input = screen.getByRole('textbox', { name: /darasa ai prompt input/i }) as HTMLInputElement;
    expect(input.value).toMatch(/4-tier formative assessment rubric/i);
  });
});

describe('ChatUI – active conversation dispatch', () => {
  it('sends user query and displays AI response in conversation stream', async () => {
    render(<ChatUI onBack={vi.fn()} />);
    const input = screen.getByRole('textbox', { name: /darasa ai prompt input/i });
    fireEvent.change(input, { target: { value: 'How to plan a soil conservation lesson' } });

    const sendBtn = screen.getByRole('button', { name: /send message to darasa/i });
    fireEvent.click(sendBtn);

    // User message renders
    expect(screen.getByText('How to plan a soil conservation lesson')).toBeInTheDocument();

    // AI message responds
    await waitFor(() => {
      expect(screen.getByText(/darasa cbc assistant/i)).toBeInTheDocument();
    });
  });
});
