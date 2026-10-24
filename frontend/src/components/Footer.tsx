'use client';

/**
 * Footer
 *
 * Single responsibility: Renders the site-wide footer with identical
 * ambient mint-and-sage background palette, brand identity, navigation columns,
 * newsletter sign-up, and copyright/compliance notices.
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Mail, 
  Sparkles
} from 'lucide-react';
import './hero/heroAnimations.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      id="landing-footer"
      aria-label="Darasa Footer"
      className="relative w-full overflow-hidden text-slate-800 border-t border-[#1F7A4D]/25 transition-colors pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
      style={{
        /* Green & white palette — identical gradient family blending from soft mint into lush forest */
        background: 'linear-gradient(160deg, #F0F8F3 0%, #DCF0E3 26%, #BCE2CB 58%, #8CCFA6 84%, #5CB47F 100%)',
        ['--soma-accent'       as any]: '#1F7A4D',
        ['--soma-accent-hover' as any]: '#18633E',
        ['--soma-amber-glow'   as any]: '#FCE9C8',
        ['--soma-amber'        as any]: '#EE9B2E',
      }}
    >
      {/* ── Ambient Radial Orbs for Background Uniformity ── */}
      <div
        aria-hidden="true"
        className="ambient-right-amber-glow absolute top-0 right-0 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full pointer-events-none select-none z-0 opacity-60"
        style={{
          filter: 'blur(90px)',
          background:
            'radial-gradient(circle at 60% 40%, rgba(252,210,140,0.45) 0%, rgba(238,155,46,0.20) 40%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />
      <div
        aria-hidden="true"
        className="ambient-bottom-left-orb absolute bottom-0 left-0 w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full pointer-events-none select-none z-0 opacity-60"
        style={{
          filter: 'blur(85px)',
          background:
            'radial-gradient(circle at 30% 70%, rgba(31,122,77,0.40) 0%, rgba(52,211,153,0.30) 40%, transparent 75%)',
          transform: 'translateZ(0)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        {/* ── Top Grid: Brand Column + Navigation Columns + Newsletter ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-10 sm:pb-14 border-b border-[#1F7A4D]/15">
          
          {/* Column 1: Brand Info (span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            <a
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] rounded-xl group"
              aria-label="Darasa Home"
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
            </a>

            <p className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-sm">
              The intelligent AI companion purpose-built for Kenya's Competency-Based Curriculum. 
              Empowering teachers, learners, and parents with verified guidance strictly grounded in official KICD frameworks.
            </p>

            {/* Verification & Compliance Badges */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-[#144D2E] bg-white/70 border border-[#1F7A4D]/25 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1F7A4D]" />
                <span>KICD Curriculum Aligned</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-[#144D2E] bg-white/70 border border-[#1F7A4D]/25 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#EE9B2E]" />
                <span>Child-Safe & Family-First</span>
              </span>
            </div>
          </div>

          {/* Column 2: Curriculum Strands (span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-['Outfit'] mb-3 sm:mb-4">
              Curriculum
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {[
                { label: 'Pre-Primary (PP1 & PP2)', href: '#curriculum' },
                { label: 'Lower Primary (Grades 1–3)', href: '#curriculum' },
                { label: 'Upper Primary (Grades 4–6)', href: '#curriculum' },
                { label: 'Junior School (Grades 7–9)', href: '#curriculum' },
                { label: 'Senior School Pathways', href: '#curriculum' },
                { label: '4-Tier Assessment Rubrics', href: '#curriculum' },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-[#1F7A4D] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1F7A4D] rounded-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Audiences & Solutions (span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-['Outfit'] mb-3 sm:mb-4">
              Audiences
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {[
                { label: 'For CBC Teachers', href: '#teachers' },
                { label: 'For Junior Learners', href: '#students' },
                { label: 'For Parents & Guardians', href: '#parents' },
                { label: 'Lesson Plan Generator', href: '#teachers' },
                { label: 'Household Crafts Finder', href: '#parents' },
                { label: 'Socratic Inquiry AI', href: '#students' },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-[#1F7A4D] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1F7A4D] rounded-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Community (span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-['Outfit'] mb-2">
              Stay Informed
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
              Get weekly CBC insights, curriculum updates, and practical project guides sent directly to your inbox.
            </p>

            {subscribed ? (
              <div className="w-full p-3.5 rounded-2xl bg-white/80 border border-[#1F7A4D]/30 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#144D2E]">
                <Check className="w-4 h-4 text-[#1F7A4D] shrink-0" />
                <span>Thank you! You are subscribed to CBC updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address..."
                    aria-label="Email address for curriculum updates"
                    className="w-full pl-10 pr-3 py-2.5 rounded-full text-xs sm:text-sm text-slate-900 placeholder-slate-500 bg-white/90 border border-[#1F7A4D]/30 focus:border-[#1F7A4D] focus:ring-2 focus:ring-[#1F7A4D]/20 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Subscribe to updates"
                  className="glass-btn-accent px-5 py-2.5 rounded-full text-xs font-bold text-[#0d4a25] hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0 inline-flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: 'var(--soma-accent)' }}
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0d4a25]" />
                </button>
              </form>
            )}

            <p className="mt-2.5 text-[11px] text-slate-600">
              No spam ever. Grounded in Kenyan educational excellence.
            </p>
          </div>

        </div>

        {/* ── Bottom Bar: Copyright & Compliance ── */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span>© 2026 Darasa (SomaAI). All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <span>🇰🇪</span>
            <span>Proudly built for Kenya's Competency-Based Curriculum</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a href="#privacy" className="hover:text-[#1F7A4D] transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-400">•</span>
            <a href="#terms" className="hover:text-[#1F7A4D] transition-colors">
              Terms of Service
            </a>
            <span className="text-slate-400">•</span>
            <a href="#safety" className="hover:text-[#1F7A4D] transition-colors">
              Child Safety
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
