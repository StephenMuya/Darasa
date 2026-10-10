'use client';

/**
 * SomaHero – Orchestrator
 *
 * Single responsibility: compose the hero page from focused sub-components
 * and provide the shared CSS custom properties used by every child.
 *
 * Sub-components (each ≤ 300 lines, single responsibility):
 *  ├── heroAnimations.css  – keyframes & utility CSS classes
 *  ├── HeroNavbar.tsx      – sticky nav bar + mobile drawer
 *  ├── HeroBackground.tsx  – watermark words + ambient orbs (decorative)
 *  ├── HeroTextPanel.tsx   – headline, sub-heading, CTA buttons
 *  ├── HeroChatPanel.tsx   – interactive chatbot workspace card
 *  └── HeroLineArt.tsx     – bottom panoramic illustration strip
 */

import { useState } from 'react';

import './hero/heroAnimations.css';
import HeroNavbar     from './hero/HeroNavbar';
import HeroBackground from './hero/HeroBackground';
import HeroTextPanel  from './hero/HeroTextPanel';
import HeroChatPanel  from './hero/HeroChatPanel';
import HeroLineArt    from './hero/HeroLineArt';

export default function SomaHero() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#F5FAF7] via-[#EAF3EE] to-[#DCEDE2] text-slate-900 transition-colors duration-300"
      style={{
        ['--soma-accent'       as any]: '#1F7A4D',
        ['--soma-accent-hover' as any]: '#18633E',
        ['--soma-amber-glow'   as any]: '#FCE9C8',
        ['--soma-amber'        as any]: '#EE9B2E',
      }}
    >
      {/* 1. Navigation bar */}
      <HeroNavbar
        isOpen={mobileNavOpen}
        onToggle={() => setMobileNavOpen((prev) => !prev)}
      />

      {/* 2. Decorative background (watermark words + ambient orbs) */}
      <HeroBackground />

      {/* 3. Main content: headline ↔ chat panel side by side */}
      <main className="relative z-10 flex-1 flex flex-col justify-center w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-6 pb-2">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 xl:gap-14">
          <HeroTextPanel />
          <HeroChatPanel />
        </div>
      </main>

      {/* 4. Bottom panoramic line-art strip */}
      <HeroLineArt />
    </div>
  );
}
