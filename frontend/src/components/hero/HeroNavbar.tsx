'use client';


/**
 * HeroNavbar
 * Single responsibility: Renders the darasa navigation bar.
 * Includes desktop nav links, auth CTAs, and a mobile drawer.
 */

interface HeroNavbarProps {
  /** Controls whether the mobile drawer is open */
  isOpen: boolean;
  onToggle: () => void;
}

export default function HeroNavbar({ isOpen, onToggle }: HeroNavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent transition-colors">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-5 lg:py-6 flex items-center justify-between">

        {/* Brand Logo & Name */}
        <div className="flex items-center">
          <a
            href="/"
            className="flex items-center gap-3 sm:gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] rounded-xl group"
            aria-label="darasa Home"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 shrink-0 transition-transform group-hover:scale-105"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="45" cy="55" r="18.5" stroke="currentColor" strokeWidth="9" className="text-slate-900" />
              <rect x="64" y="22" width="9" height="56" rx="4.5" fill="#EE9B2E" />
            </svg>
            <span className="text-3xl sm:text-4xl lg:text-[2.85rem] font-black tracking-tight text-slate-900 font-['Outfit'] leading-none">
              darasa
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-slate-700">
          {[
            { href: '#curriculum', label: 'Curriculum Strands' },
            { href: '#teachers',   label: 'For Teachers' },
            { href: '#students',   label: 'For Learners' },
            { href: '#parents',    label: 'For Parents' },
            { href: '#how-it-works', label: 'How It Works' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hover:text-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] rounded-sm"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] rounded-full"
          >
            Log in
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D]"
            style={{ backgroundColor: 'var(--soma-accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--soma-accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--soma-accent)')}
          >
            <span>Start Free</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D]"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#F5FAF7]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 shadow-xl border-b border-[#1F7A4D]/15">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-800">
            {[
              { href: '#curriculum', label: 'Curriculum Strands' },
              { href: '#teachers',   label: 'For Teachers' },
              { href: '#students',   label: 'For Learners' },
              { href: '#parents',    label: 'For Parents' },
              { href: '#how-it-works', label: 'How It Works' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={onToggle}
                className="px-3 py-2 rounded-lg hover:bg-slate-200/60"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#1F7A4D]/15 flex flex-col gap-2">
            <button
              type="button"
              className="w-full py-2.5 rounded-full text-sm font-semibold text-white shadow-xs"
              style={{ backgroundColor: 'var(--soma-accent)' }}
            >
              Start Free
            </button>
            <a href="#login" className="text-center py-2 text-sm font-semibold text-slate-700">
              Log in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
