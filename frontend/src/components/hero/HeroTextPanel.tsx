'use client';

/**
 * HeroTextPanel
 * Single responsibility: Left content column — headline, sub-heading, and CTA buttons.
 * Purely presentational; no internal state.
 */
export default function HeroTextPanel() {
  return (
    <div
      id="hero-text-container"
      className="order-1 lg:order-1 w-full lg:flex-1 flex flex-col items-start justify-center text-left space-y-6 lg:space-y-8 pr-0 xl:pr-6"
    >
      {/* ── Headline ── */}
      <div id="hero-heading-box" className="w-full mt-[100px]">
        <h1 className="w-full text-5xl sm:text-6xl md:text-7xl lg:text-[4.25rem] xl:text-[6.50rem] 2xl:text-[8.00rem] font-bold tracking-tight text-slate-900 leading-[1.05] font-['Libre_Baskerville',Georgia,serif]">
          Your trusted CBC teacher, always one question away.
        </h1>
      </div>

      {/* ── Sub-heading (75% width) ── */}
      <div id="hero-subheading-box" className="w-full lg:w-3/4 max-w-2xl xl:max-w-3xl">
        <p className="w-full text-base sm:text-lg lg:text-xl xl:text-[1.35rem] 2xl:text-2xl text-slate-700 leading-relaxed font-normal">
          Ask about any lesson, project or concept and get answers grounded in
          the actual curriculum, not a generic syllabus.
        </p>
      </div>

      {/* ── CTAs & availability notice ── */}
      <div id="hero-cta-box" className="w-full pt-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">

          {/* Primary CTA */}
          <button
            type="button"
            aria-label="Start chatting with darasa"
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-semibold text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] focus-visible:ring-offset-2"
            style={{ backgroundColor: 'var(--soma-accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--soma-accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--soma-accent)')}
          >
            <span>Start chatting</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
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
