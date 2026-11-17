'use client';

import DarasaLogoMark from './DarasaLogoMark';

interface ChatHeaderProps {
  onBack: () => void;
}

/**
 * ChatHeader
 *
 * Minimal navigation bar for the intelligence workspace.
 * Retains solely the brand logo and word logo plus attached information:
 * - Darasa Logo Mark
 * - Wordmark: "Darasa"
 * - Attached information: "CBC Workspace" · "Kenya CBC Educational Intelligence"
 * All other clutter (Back to Home button, center strand badge, sidebar button, guest pill) removed.
 * Clicking the brand navigates back to the landing page.
 */
export default function ChatHeader({ onBack }: ChatHeaderProps) {
  return (
    <header className="relative z-30 w-full px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between border-b border-white/40 bg-white/20 backdrop-blur-md select-none">
      {/* Brand logo + word logo + attached information */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
        className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] rounded-xl cursor-pointer"
        aria-label="Darasa Home"
      >
        <DarasaLogoMark size="w-8 h-8 sm:w-9 sm:h-9" />
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit'] leading-none">
              Darasa
            </span>
            <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-widest hidden sm:inline bg-white/60 px-2 py-0.5 rounded-full border border-white/80">
              CBC Workspace
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-900 tracking-wider hidden sm:block mt-0.5">
            Kenya CBC Educational Intelligence
          </span>
        </div>
      </a>

      {/* Clean minimal spacer on the right */}
      <div className="w-8" aria-hidden="true" />
    </header>
  );
}
