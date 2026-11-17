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
import {
  HeroNavbar,
  HeroBackground,
  HeroTextPanel,
  HeroChatPanel,
  HeroLineArt,
} from './hero/index';
import { SOMA_THEME_VARS } from '../theme/tokens';

interface SomaHeroProps {
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export default function SomaHero({ onOpenAuth }: SomaHeroProps = {}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div
      className="relative h-screen max-h-screen w-full overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#F5FAF7] via-[#EAF3EE] to-[#DCEDE2] text-slate-900 transition-colors duration-300"
      style={SOMA_THEME_VARS}
    >
      {/* 1. Navigation bar */}
      <HeroNavbar
        isOpen={mobileNavOpen}
        onToggle={() => setMobileNavOpen((prev) => !prev)}
        onOpenAuth={onOpenAuth}
      />

      {/* 2. Decorative background (watermark words + ambient orbs) */}
      <HeroBackground />

      {/* 3. Main content: headline ↔ chat panel side by side */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col justify-center w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-1 sm:py-2">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 xl:gap-12">
          <HeroTextPanel onOpenAuth={onOpenAuth} />
          <HeroChatPanel />
        </div>
      </main>

      {/* 4. Bottom panoramic line-art strip */}
      <HeroLineArt />
    </div>
  );
}
