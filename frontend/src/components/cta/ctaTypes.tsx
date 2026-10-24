import React from 'react';
import { GraduationCap, BookOpen, HeartHandshake } from 'lucide-react';

export interface PersonaCard {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlights: string[];
  actionLabel: string;
  samplePrompt: string;
}

export const PERSONA_CARDS: PersonaCard[] = [
  {
    id: 'teachers',
    tag: 'For Teachers',
    title: 'Automate Rubrics & Schemes',
    description:
      'Generate QA-compliant lesson plans and 4-tier formative rubrics in seconds, strictly tailored to your exact KICD strand and sub-strand.',
    icon: <GraduationCap className="w-5 h-5 text-[#1F7A4D]" />,
    highlights: [
      'Official 4-tier assessment rubrics',
      'QA-proof lesson plan formats',
      'Strand & sub-strand breakdowns',
    ],
    actionLabel: 'Try Lesson Planner',
    samplePrompt: 'Draft a Grade 5 Agriculture lesson plan on soil conservation with a 4-tier rubric.',
  },
  {
    id: 'students',
    tag: 'For Learners',
    title: 'Socratic Inquiry Tutor',
    description:
      'An intelligent companion that guides you through STEM experiments, inquiry tasks, and practical portfolios without spoon-feeding answers.',
    icon: <BookOpen className="w-5 h-5 text-[#1F7A4D]" />,
    highlights: [
      'Inquiry-based guiding questions',
      'Step-by-step experiment instructions',
      'Interactive CBC portfolio ideas',
    ],
    actionLabel: 'Start Socratic Chat',
    samplePrompt: 'How can I build an improvised water filter for my Grade 4 Science practical task?',
  },
  {
    id: 'parents',
    tag: 'For Parents',
    title: 'Demystify Homework & Crafts',
    description:
      'Figure out weekend practical projects using common household items, understand assessment rubrics, and guide your child with ease.',
    icon: <HeartHandshake className="w-5 h-5 text-[#EE9B2E]" />,
    highlights: [
      'Zero-cost household item substitutes',
      'Plain-English rubric explanations',
      'Constructive parent-child activities',
    ],
    actionLabel: 'Demystify Homework',
    samplePrompt: 'What household items can replace papier-mâché for a Grade 3 indigenous craft project?',
  },
];

export const QUICK_PROMPT_PILLS = [
  '🌾 Grade 6 Agriculture soil conservation project',
  '📐 Form 1 Mathematics strand 2 lesson plan',
  '🧪 Grade 4 Integrated Science rubric generator',
  '🎨 Low-cost Grade 3 indigenous craft ideas',
];

export interface CallToActionProps {
  onOpenAuth?: (mode?: 'login' | 'signup', prompt?: string) => void;
}
