'use client';

interface AuthHeaderProps {
  onBack: () => void;
}

/**
 * AuthHeader
 *
 * Minimal, uncluttered navigation header for the Auth experience.
 * Replaces the old "Back to Home" pill, redundant center logo, and far-right text
 * with our actual clickable brand logo and name that routes directly back to home.
 */
export default function AuthHeader({ onBack }: AuthHeaderProps) {
  return (
    <header className="relative z-20 w-full px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#1F7A4D]/15 bg-white/20 backdrop-blur-md">
      {/* Brand Logo & Name as Clickable Navigation to Home */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to Darasa landing page"
        className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] rounded-xl cursor-pointer"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 transition-transform group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="45" cy="55" r="18.5" stroke="currentColor" strokeWidth="9" className="text-slate-900" />
          <rect x="64" y="22" width="9" height="56" rx="4.5" fill="#EE9B2E" />
        </svg>
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Outfit'] leading-none">
          Darasa
        </span>
      </button>

      {/* Clean minimal spacer (all center words and far-right text removed as requested) */}
      <div className="w-10" aria-hidden="true" />
    </header>
  );
}
