import React from 'react';
import { GraduationCap, BookOpen, HeartHandshake } from 'lucide-react';

export type UserRole = 'teacher' | 'student' | 'parent';

export interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { id: 'teacher', label: 'Teacher', icon: GraduationCap },
  { id: 'student', label: 'Learner', icon: BookOpen },
  { id: 'parent', label: 'Parent', icon: HeartHandshake },
];

export interface AuthProps {
  /** Initial mode for the auth view */
  initialMode?: 'login' | 'signup';
  /** Optional initial prompt to display in the chat preview or input */
  initialPrompt?: string;
  /** Callback to navigate back to the landing page */
  onBack: () => void;
  /** Callback to enter chat without credentials */
  onEnterChat?: (prompt?: string) => void;
}
