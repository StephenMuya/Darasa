// vitest globals
import { render, screen, fireEvent } from '@testing-library/react';
import CallToAction from '../components/CallToAction';

describe('CallToAction – layout & container', () => {
  it('renders with an accessible section landmark and id', () => {
    render(<CallToAction />);
    const section = screen.getByRole('region', { name: /call to action/i });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'call-to-action');
  });

  it('renders decorative dispersed dot tracks', () => {
    const { container } = render(<CallToAction />);
    const decorativeLayer = container.querySelector('[aria-hidden="true"]');
    expect(decorativeLayer).toBeInTheDocument();
  });
});

describe('CallToAction – heading structure & typography', () => {
  it('renders an h2 heading element with brand text fade', () => {
    render(<CallToAction />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(/Step into the Future of/i);
    expect(heading.textContent).toMatch(/Competency-Based Learning/i);
  });
});

describe('CallToAction – interactive prompt launcher (single card)', () => {
  it('renders the chat input field', () => {
    render(<CallToAction />);
    const input = screen.getByRole('textbox', { name: /quick prompt question/i });
    expect(input).toBeInTheDocument();
  });

  it('renders quick prompt pills', () => {
    render(<CallToAction />);
    expect(screen.getByText(/grade 6 agriculture soil conservation/i)).toBeInTheDocument();
    expect(screen.getByText(/form 1 mathematics/i)).toBeInTheDocument();
    expect(screen.getByText(/grade 3 indigenous craft ideas/i)).toBeInTheDocument();
  });

  it('updates input value when a quick prompt pill is clicked', () => {
    render(<CallToAction />);
    const pill = screen.getByText(/grade 6 agriculture soil conservation/i);
    fireEvent.click(pill);
    const input = screen.getByRole('textbox', { name: /quick prompt question/i }) as HTMLInputElement;
    expect(input.value).toMatch(/grade 6 agriculture/i);
  });

  it('triggers onOpenAuth when primary submit button is clicked', () => {
    const onOpenAuthMock = vi.fn();
    render(<CallToAction onOpenAuth={onOpenAuthMock} />);
    const submitBtn = screen.getByRole('button', { name: /start chatting with darasa/i });
    fireEvent.click(submitBtn);
    expect(onOpenAuthMock).toHaveBeenCalledWith('signup', '');
  });
});
