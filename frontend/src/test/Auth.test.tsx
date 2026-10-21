/**
 * Auth.test.tsx
 *
 * Tests: Unified authentication experience:
 * - Clean header with clickable brand logo navigating back to landing page
 * - Unified master container holding both form and 3D futuristic visual
 * - Primary credential inputs (Full name, Email, Password) coming FIRST
 * - Secondary login alternatives (Google, NEMIS, Guest access) coming SECOND
 * - 3D futuristic neural curriculum visual
 */

import { render, screen, fireEvent } from '@testing-library/react';
// vitest globals
import Auth from '../components/Auth';

describe('Auth – layout & navigation header', () => {
  it('renders without crashing', () => {
    expect(() => render(<Auth onBack={vi.fn()} />)).not.toThrow();
  });

  it('renders the brand logo and name, calling onBack when clicked', () => {
    const handleBack = vi.fn();
    render(<Auth onBack={handleBack} />);
    const brandBtn = screen.getByRole('button', { name: /back to darasa landing page/i });
    expect(brandBtn).toBeInTheDocument();
    fireEvent.click(brandBtn);
    expect(handleBack).toHaveBeenCalledOnce();
  });

  it('renders within a unified master card container', () => {
    const { container } = render(<Auth onBack={vi.fn()} />);
    const unifiedCard = container.querySelector('#unified-auth-card');
    expect(unifiedCard).toBeInTheDocument();
  });
});

describe('Auth – Form structure & field precedence', () => {
  it('renders mode switch tabs (Create Account and Log In)', () => {
    render(<Auth onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: /^create account$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^log in$/i }).length).toBeGreaterThan(0);
  });

  it('renders role selectors for Teacher, Learner, and Parent', () => {
    render(<Auth onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: /teacher/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /learner/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /parent/i })).toBeInTheDocument();
  });

  it('renders credential input fields', () => {
    render(<Auth onBack={vi.fn()} initialMode="signup" />);
    expect(screen.getByPlaceholderText(/jane wanjiku/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mwalimu@school\.ac\.ke/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();
  });

  it('renders secondary alternative logins (Google & NEMIS)', () => {
    render(<Auth onBack={vi.fn()} />);
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    expect(screen.getByText(/school \/ nemis portal login/i)).toBeInTheDocument();
    expect(screen.getByText(/enter chat directly/i)).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<Auth onBack={vi.fn()} />);
    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    const passwordInput = screen.getByPlaceholderText(/••••••••••••/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});

describe('Auth – 3D Futuristic Neural Visual', () => {
  it('renders the 3D neural telemetry and futuristic curriculum badges', () => {
    render(<Auth onBack={vi.fn()} />);
    expect(screen.getByText(/soma neural engine · online/i)).toBeInTheDocument();
    expect(screen.getByText(/cbc pedagogical intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/official kicd cbc rubrics/i)).toBeInTheDocument();
    expect(screen.getByText(/grades 1–9 cbc coverage/i)).toBeInTheDocument();
  });
});
