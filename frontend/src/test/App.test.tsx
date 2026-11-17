/**
 * App.test.tsx
 *
 * Tests: App navigation between landing page and dedicated Auth view
 * when user clicks "Start Free", "Log in", and "Start chatting",
 * and returns back on "Back to Home".
 */

import { render, screen, fireEvent } from '@testing-library/react';
// vitest globals
import App from '../App';

describe('App – navigation between landing page & Auth view', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders landing page by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/your trusted cbc companion/i)).toBeInTheDocument();
  });

  it('navigates to Auth view when "Start Free" is clicked', () => {
    render(<App />);
    const startFreeButtons = screen.getAllByRole('button', { name: /start free/i });
    fireEvent.click(startFreeButtons[0]);

    expect(screen.getByRole('heading', { level: 1, name: /get started with darasa/i })).toBeInTheDocument();
  });

  it('navigates to Auth view in login mode when "Log in" is clicked', () => {
    render(<App />);
    const loginLinks = screen.getAllByText(/log in/i);
    fireEvent.click(loginLinks[0]);

    expect(screen.getByRole('heading', { level: 1, name: /welcome back/i })).toBeInTheDocument();
  });

  it('navigates to Auth view when hero "Start chatting" is clicked', () => {
    render(<App />);
    const startChattingButtons = screen.getAllByRole('button', { name: /start chatting with darasa/i });
    fireEvent.click(startChattingButtons[0]);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('navigates to ChatUI when "Enter Chat Directly" is clicked from Auth view', () => {
    render(<App />);
    const startFreeButtons = screen.getAllByRole('button', { name: /start free/i });
    fireEvent.click(startFreeButtons[0]);

    const enterChatBtn = screen.getByRole('button', { name: /enter chat directly/i });
    fireEvent.click(enterChatBtn);

    expect(screen.getByText(/kenya cbc educational intelligence/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/darasa ai prompt input/i)).toBeInTheDocument();
  });

  it('navigates back to landing page from ChatUI when Back to Home is clicked', () => {
    window.location.hash = '#chat';
    render(<App />);

    expect(screen.getByLabelText(/darasa ai prompt input/i)).toBeInTheDocument();

    const homeBtn = screen.getByRole('link', { name: /darasa home/i });
    fireEvent.click(homeBtn);

    expect(screen.getByText(/your trusted cbc companion/i)).toBeInTheDocument();
  });
});
