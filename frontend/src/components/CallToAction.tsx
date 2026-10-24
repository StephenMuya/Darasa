'use client';

/**
 * CallToAction.tsx
 *
 * Single responsibility: Displays the final call-to-action section.
 * Coordinates the uniform mint-and-sage background, ambient glowing orbs,
 * watermark typography, persona value cards, and interactive chat launcher.
 * Subcomponents adhere strictly to single functions and file lengths under 350 lines.
 */

import React, { useState } from 'react';
import CtaPromptLauncher from './cta/CtaPromptLauncher';
import { SOMA_THEME_VARS, SOMA_GRADIENTS } from '../theme/tokens';
import type { CallToActionProps } from './cta/ctaTypes';
import './hero/heroAnimations.css';

export default function CallToAction({ onOpenAuth }: CallToActionProps = {}) {
  const [inputValue, setInputValue] = useState('');

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenAuth) {
      onOpenAuth('signup', inputValue);
    } else {
      window.location.hash = '#auth';
    }
  };

  return (
    <section
      id="call-to-action"
      aria-label="Call to Action"
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center text-left px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-16"
      style={{
        background: SOMA_GRADIENTS.pageMesh,
        ...SOMA_THEME_VARS,
      }}
    >
      {/* ── Dispersed Green & White Dots Tracks ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      >
        {/* Track 1: Far Left Gutter Axis */}
        <div className="absolute top-0 bottom-0 left-2 sm:left-3 lg:left-4">
          <span className="absolute top-[12%] -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[35%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1F7A4D] shadow-[0_0_8px_rgba(31,122,77,0.85)] opacity-85" />
          <span className="absolute top-[68%] -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[88%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#34D399] shadow-[0_0_10px_rgba(52,211,153,0.85)] opacity-85" />
        </div>

        {/* Track 2: Mid-Right Vertical Axis */}
        <div className="hidden md:block absolute top-0 bottom-0 right-[42%]">
          <span className="absolute top-[18%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1F7A4D] shadow-[0_0_8px_rgba(31,122,77,0.85)] opacity-80" />
          <span className="absolute top-[48%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[75%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#18633E] shadow-[0_0_8px_rgba(24,99,62,0.85)] opacity-80" />
        </div>

        {/* Track 3: Far-Right-Inner Axis */}
        <div className="hidden sm:block absolute top-0 bottom-0 right-[22%]">
          <span className="absolute top-[16%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[50%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.85)] opacity-85" />
          <span className="absolute top-[82%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
        </div>

        {/* Track 4: Far Right Vertical Axis */}
        <div className="absolute top-0 bottom-0 right-6 sm:right-10 lg:right-14">
          <span className="absolute top-[10%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1F7A4D] shadow-[0_0_8px_rgba(31,122,77,0.85)] opacity-85" />
          <span className="absolute top-[32%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[58%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1F7A4D] shadow-[0_0_8px_rgba(31,122,77,0.85)] opacity-80" />
          <span className="absolute top-[86%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
        </div>
      </div>

      {/* ── Watermark Typography Layer ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between py-12 px-4 md:px-12 z-0 leading-none font-extrabold tracking-tighter"
      >
        <span
          className="text-[clamp(5rem,14vw,12rem)] -translate-x-6 md:-translate-x-10 translate-y-2"
          style={{ color: 'rgba(31, 122, 77, 0.05)' }}
        >
          IMPACT.
        </span>
        <span
          className="text-[clamp(5rem,14vw,12rem)] self-center -translate-y-4"
          style={{ color: 'rgba(31, 122, 77, 0.05)' }}
        >
          CLARITY.
        </span>
        <span
          className="text-[clamp(5rem,14vw,12rem)] self-end translate-x-6 md:translate-x-10 translate-y-4"
          style={{ color: 'rgba(31, 122, 77, 0.05)' }}
        >
          EXCEL.
        </span>
      </div>

      {/* ── Ambient Radial Orbs ── */}
      <div
        aria-hidden="true"
        className="ambient-right-amber-glow absolute top-1/4 right-0 w-[420px] sm:w-[600px] lg:w-[750px] h-[420px] sm:h-[600px] lg:h-[750px] rounded-full pointer-events-none select-none z-0 transition-opacity duration-500"
        style={{
          filter: 'blur(90px)',
          background:
            'radial-gradient(circle at 60% 40%, rgba(252,210,140,0.50) 0%, rgba(238,155,46,0.25) 40%, rgba(252,233,200,0.10) 70%, transparent 100%)',
          transform: 'translateZ(0)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-8 left-1/4 w-[360px] sm:w-[520px] h-[360px] sm:h-[520px] rounded-full pointer-events-none select-none z-0"
        style={{
          filter: 'blur(95px)',
          background:
            'radial-gradient(circle, rgba(31,122,77,0.28) 0%, rgba(52,211,153,0.18) 45%, transparent 75%)',
          transform: 'translateZ(0)',
        }}
      />
      <div
        aria-hidden="true"
        className="ambient-bottom-left-orb absolute bottom-0 left-0 w-[380px] sm:w-[560px] lg:w-[720px] h-[380px] sm:h-[560px] lg:h-[720px] rounded-full pointer-events-none select-none z-0 transition-opacity duration-500"
        style={{
          filter: 'blur(85px)',
          background:
            'radial-gradient(circle at 30% 70%, rgba(31,122,77,0.55) 0%, rgba(52,211,153,0.42) 28%, rgba(167,243,208,0.25) 55%, transparent 80%)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* ── Main Content Container ── */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col items-center justify-center text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#1F7A4D]/25 text-[#144D2E] text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm mb-4 sm:mb-6">
          <span className="flex h-2 w-2 rounded-full bg-[#1F7A4D] animate-pulse" />
          <span>Grounded in Official KICD Curriculum Frameworks</span>
        </div>

        {/* Heading in Libre Baskerville with Brand Text Fade */}
        <h2
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] sm:leading-[1.12] font-['Libre_Baskerville',Georgia,serif] text-center drop-shadow-sm heading-text-fade max-w-5xl mx-auto"
          style={{
            background: 'linear-gradient(95deg, #144D2E 0%, #1F7A4D 42%, #52B788 75%, #9AE6B4 95%, #D1FAE5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          <span>Step into the Future of</span>
          <span className="block mt-1 sm:mt-2">Competency-Based Learning</span>
        </h2>

        {/* Sub-heading */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-700 max-w-3xl mx-auto text-center leading-relaxed font-normal">
          Empower your classroom, practical tasks, and home projects. Darasa provides instant, 
          curriculum-aligned guidance tailored specifically to Kenyan educators, learners, and families.
        </p>

        {/* Master Glassmorphic Launchpad Box */}
        <CtaPromptLauncher
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSubmit={handleStartChat}
          onSelectPrompt={handleSelectPrompt}
        />
      </div>
    </section>
  );
}
