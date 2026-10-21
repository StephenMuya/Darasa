'use client';

/**
 * Auth.tsx
 *
 * Single responsibility: Displays the dedicated unified Auth experience.
 * Houses both the Authentication Form (left) and the 3D Futuristic Neural Visual (right)
 * inside a single, unified, grounded glassmorphism container.
 * Subcomponents adhere strictly to single functions and file lengths under 350 lines.
 */

import React, { useState } from 'react';
import AuthHeader from './auth/AuthHeader';
import AuthFormPanel from './auth/AuthFormPanel';
import AuthFuturisticVisual from './auth/AuthFuturisticVisual';
import { SOMA_THEME_VARS, SOMA_GRADIENTS } from '../theme/tokens';
import type { AuthProps, UserRole } from './auth/authTypes';
import './hero/heroAnimations.css';

export default function Auth({
  initialMode = 'signup',
  initialPrompt = '',
  onBack,
  onEnterChat,
}: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<UserRole>('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEnterChat) {
      onEnterChat(initialPrompt);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div
      id="auth-container"
      className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between text-slate-900 transition-colors"
      style={{
        background: SOMA_GRADIENTS.pageMesh,
        ...SOMA_THEME_VARS,
      }}
    >
      {/* ── Grounded, Static Ambient Background Radial Lighting (No Moving / Drifting Animation) ── */}
      <div
        aria-hidden="true"
        className="absolute top-10 right-0 w-[420px] sm:w-[620px] h-[420px] sm:h-[620px] rounded-full pointer-events-none select-none z-0 opacity-45"
        style={{
          filter: 'blur(95px)',
          background:
            'radial-gradient(circle at 60% 40%, rgba(252,210,140,0.45) 0%, rgba(238,155,46,0.18) 40%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] rounded-full pointer-events-none select-none z-0 opacity-45"
        style={{
          filter: 'blur(90px)',
          background:
            'radial-gradient(circle at 30% 70%, rgba(31,122,77,0.38) 0%, rgba(52,211,153,0.25) 30%, transparent 75%)',
        }}
      />

      {/* ── Top Header Navigation Bar ── */}
      <AuthHeader onBack={onBack} />

      {/* ── Unified Single Master Container (Both Left Form & Right 3D Visual) ── */}
      <main className="relative z-10 flex-1 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10 flex items-center justify-center">
        <div
          id="unified-auth-card"
          className="w-full rounded-3xl sm:rounded-[2rem] border border-white/80 shadow-[0_24px_60px_-15px_rgba(20,50,30,0.14)] backdrop-blur-2xl bg-white/75 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          style={{
            boxShadow:
              '0 24px 64px -16px rgba(20, 50, 30, 0.14), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* Left Column: Compact Sign In / Sign Up Form UI (lg:col-span-5) */}
          <div className="lg:col-span-5 p-6 sm:p-7 lg:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#1F7A4D]/15 bg-white/50 backdrop-blur-md">
            <AuthFormPanel
              mode={mode}
              setMode={setMode}
              role={role}
              setRole={setRole}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              submitted={submitted}
              setSubmitted={setSubmitted}
              onSubmit={handleSubmit}
              onEnterChat={onEnterChat}
              onBack={onBack}
              initialPrompt={initialPrompt}
            />
          </div>

          {/* Right Column: 3D Futuristic Luminous Visual (lg:col-span-7) */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-950/95 via-slate-950 to-[#0A2617] text-white">
            <AuthFuturisticVisual
              initialPrompt={initialPrompt}
              onEnterChat={onEnterChat}
            />
          </div>
        </div>
      </main>

      {/* ── Footer Attribution Bar ── */}
      <footer className="relative z-10 w-full py-3 px-4 sm:px-8 border-t border-[#1F7A4D]/15 bg-white/20 backdrop-blur-xs flex items-center justify-between text-xs text-slate-600">
        <span>© 2026 Darasa (SomaAI). All rights reserved.</span>
        <span>🇰🇪 Official Kenya CBC Intelligence Platform</span>
      </footer>
    </div>
  );
}
