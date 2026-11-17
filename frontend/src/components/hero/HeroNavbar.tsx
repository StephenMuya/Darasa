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
  /** Callback to trigger auth view */
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
}

export default function HeroNavbar({ isOpen, onToggle, onOpenAuth }: HeroNavbarProps) {
  const handleOpenLogin = (e?: React.MouseEvent) => {
    if (onOpenAuth) {
      e?.preventDefault();
      onOpenAuth('login');
    } else {
      window.location.hash = '#login';
    }
  };

  const handleOpenSignup = () => {
    if (onOpenAuth) {
      onOpenAuth('signup');
    } else {
      window.location.hash = '#auth';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent transition-colors">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-2 sm:py-2.5 lg:py-3.5 flex items-center justify-between">

        {/* Brand Logo & Name */}
        <div className="flex items-center">
          <a
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] rounded-xl group"
            aria-label="Darasa Home"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-10 h-10 sm:w-11 sm:h-11 lg:w-13 lg:h-13 shrink-0 transition-transform group-hover:scale-105"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="45" cy="55" r="18.5" stroke="currentColor" strokeWidth="9" className="text-slate-900" />
              <rect x="64" y="22" width="9" height="56" rx="4.5" fill="#EE9B2E" />
            </svg>
            <span className="text-2xl sm:text-3xl lg:text-[2.4rem] font-black tracking-tight text-slate-900 font-['Outfit'] leading-none">
              Darasa
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
            onClick={handleOpenLogin}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] rounded-full cursor-pointer"
          >
            Log in
          </a>
          <button
            type="button"
            onClick={handleOpenSignup}
            className="glass-btn-accent inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#0d4a25] hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] cursor-pointer"
            
          >
            <span>Start Free</span>
            <svg className="w-3.5 h-3.5 text-[#0d4a25]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
              onClick={() => {
                onToggle();
                handleOpenSignup();
              }}
              className="glass-btn-accent w-full py-2.5 rounded-full text-sm font-bold text-[#0d4a25]"
              
            >
              Start Free
            </button>
            <a
              href="#login"
              onClick={(e) => {
                onToggle();
                handleOpenLogin(e);
              }}
              className="text-center py-2 text-sm font-semibold text-slate-700"
            >
              Log in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
