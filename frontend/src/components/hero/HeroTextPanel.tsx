'use client';

/**
 * HeroTextPanel
 * Single responsibility: Left content column — headline, sub-heading, and CTA buttons.
 * Purely presentational; no internal state.
 */
interface HeroTextPanelProps {
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export default function HeroTextPanel({ onOpenAuth }: HeroTextPanelProps = {}) {
  const handleStartChatting = () => {
    if (onOpenAuth) {
      onOpenAuth('signup');
    } else {
      window.location.hash = '#auth';
    }
  };

  return (
    <div
      id="hero-text-container"
      className="order-1 lg:order-1 w-full lg:w-[48%] xl:w-[48%] 2xl:w-[47%] flex flex-col items-start justify-center text-left space-y-3 sm:space-y-3.5 lg:space-y-4 pr-0 xl:pr-4"
    >
      {/* ── Headline ── */}
      <div id="hero-heading-box" className="w-full mt-0">
        <h1 className="w-full text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[7rem] 2xl:text-[8.9rem] font-bold tracking-tight text-slate-900 leading-[0.98] font-['Libre_Baskerville',Georgia,serif]">
          Your trusted{' '}
          <span className="heading-highlight-fade px-2 sm:px-3.5 py-0.5 rounded-xl sm:rounded-2xl inline-block align-baseline my-0.5">
            <span className="heading-text-fade">CBC teacher</span>
          </span>
          , always one question away.
        </h1>
      </div>

      {/* ── Sub-heading ── */}
      <div id="hero-subheading-box" className="w-full max-w-2xl xl:max-w-4xl 2xl:max-w-5xl">
        <p className="w-full text-xs sm:text-sm md:text-base lg:text-[1.05rem] xl:text-[1.15rem] text-slate-700 leading-relaxed font-normal">
          Your trusted CBC companion, always one question away. Whether you&apos;re a parent figuring out a weekend practical project using common household items, a teacher drafting QA-proof lesson plans, or a learner mastering a new concept, Darasa has you covered. Get instant, step-by-step guidance anchored strictly in the official KICD Curriculum Designs—never a generic syllabus.
        </p>
      </div>

      {/* ── CTAs & availability notice ── */}
      <div id="hero-cta-box" className="w-full pt-0.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 w-full sm:w-auto">

          {/* Primary CTA */}
          <button
            type="button"
            onClick={handleStartChatting}
            aria-label="Start chatting with Darasa"
            className="group glass-btn-accent inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold text-[#0d4a25] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] focus-visible:ring-offset-2 cursor-pointer"
            
          >
            <span>Start chatting</span>
            <svg
              className="w-4 h-4 text-[#0d4a25] transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          {/* Secondary link */}
          <a
            href="#how-it-works"
            aria-label="See how it works"
            className="inline-flex items-center justify-center px-4 py-4 text-sm sm:text-base font-semibold text-slate-700 hover:text-[#1F7A4D] transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D]"
          >
            See how it works
          </a>
        </div>

        {/* Availability notice */}
        <p className="text-xs sm:text-sm text-slate-500 pt-3">
          Covering CBC Curriculum. More grades coming soon.
        </p>
      </div>
    </div>
  );
}
