// vitest globals
import { render, screen, fireEvent } from '@testing-library/react';
import PersonaFeatures from '../components/PersonaFeatures';

describe('PersonaFeatures – section & layout', () => {
  it('renders with an accessible section landmark and id', () => {
    render(<PersonaFeatures />);
    const section = screen.getByRole('region', { name: /cbc stakeholder capabilities/i });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'curriculum-personas');
  });

  it('renders calligraphed small-letter words above the heading', () => {
    render(<PersonaFeatures />);
    expect(
      screen.getByText(/tailored pedagogical companions for kenyan classrooms & homes/i)
    ).toBeInTheDocument();
  });

  it('renders heading and three persona cards', () => {
    render(<PersonaFeatures />);
    expect(screen.getByText(/architected for/i)).toBeInTheDocument();
    expect(screen.getByText(/teachers, learners & families/i)).toBeInTheDocument();

    expect(screen.getByText('Automate Rubrics & Schemes')).toBeInTheDocument();
    expect(screen.getByText('Socratic Inquiry Tutor')).toBeInTheDocument();
    expect(screen.getByText('Demystify Homework & Crafts')).toBeInTheDocument();
  });

  it('triggers onEnterChat or onOpenAuth when quick action buttons are clicked', () => {
    const onEnterChatMock = vi.fn();
    render(<PersonaFeatures onEnterChat={onEnterChatMock} />);
    const lessonPlannerBtn = screen.getByRole('button', { name: /try lesson planner/i });
    fireEvent.click(lessonPlannerBtn);
    expect(onEnterChatMock).toHaveBeenCalledWith(
      expect.stringMatching(/grade 5 agriculture lesson plan/i)
    );
  });
});
