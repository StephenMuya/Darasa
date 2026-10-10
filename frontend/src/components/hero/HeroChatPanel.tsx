'use client';

/**
 * HeroChatPanel
 * Single responsibility: Interactive chatbot workspace card shown on the right side.
 * Manages its own tab, input, and action-pill state — isolated from sibling panels.
 */

import { useState } from 'react';

/* ── Mini logo used in tabs & sidebar ── */
function DarasaLogoMark({ size = 'w-3.5 h-3.5' }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`${size} shrink-0`} fill="none">
      <circle cx="45" cy="55" r="18.5" stroke="currentColor" strokeWidth="9" className="text-slate-900" />
      <rect x="64" y="22" width="9" height="56" rx="4.5" fill="#EE9B2E" />
    </svg>
  );
}

/* ── Sidebar nav items data ── */
const SIDEBAR_NAV = [
  {
    href: '#home', label: 'Home', active: true,
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '#explore', label: 'Curriculum', active: false,
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    href: '#library', label: 'Library', active: false,
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  },
  {
    href: '#history', label: 'History', active: false,
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

/* ── Action pill definitions ── */
type PillMode = 'reasoning' | 'lesson' | 'research';
const ACTION_PILLS: { mode: PillMode; label: string; iconColor: string; prompt: string; iconPath: string; hidden?: boolean }[] = [
  {
    mode: 'reasoning',
    label: 'Reasoning',
    iconColor: 'text-amber-500',
    prompt: 'Explain plant transpiration with step-by-step CBC reasoning',
    iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    mode: 'lesson',
    label: 'Create Project',
    iconColor: 'text-purple-600',
    prompt: 'Design a science project on plant water loss with local materials',
    iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    mode: 'research',
    label: 'Deep Research',
    iconColor: 'text-blue-600',
    prompt: 'Ground this in KICD curriculum designs and assessment rubrics',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    hidden: true,
  },
];

export default function HeroChatPanel() {
  const [activeTab,  setActiveTab]  = useState<'darasa' | 'curriculum' | 'kicd'>('darasa');
  const [inputValue, setInputValue] = useState('');
  const [activeMode, setActiveMode] = useState<PillMode | null>(null);

  const handlePillClick = (mode: PillMode, prompt: string) => {
    setActiveMode(mode);
    setInputValue(prompt);
  };

  const tabBase    = 'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all';
  const tabActive  = 'bg-white text-slate-800 border border-[#1F7A4D]/25 shadow-2xs';
  const tabInactive = 'text-slate-600 hover:text-slate-900 hover:bg-white/40';

  return (
    <div
      id="hero-chat-container"
      className="order-2 lg:order-2 w-full lg:w-[48%] xl:w-[47%] 2xl:w-[46%] flex justify-center lg:justify-end items-center shrink-0"
    >
      <div className="w-full max-w-full sm:max-w-2xl lg:max-w-3xl xl:max-w-[860px] 2xl:max-w-[920px] app-window-floating">

        {/* App Window Frame */}
        <div className="w-full rounded-[26px] sm:rounded-[34px] bg-[#EAF3EE]/95 border border-[#1F7A4D]/20 shadow-[0_24px_50px_-12px_rgba(20,50,30,0.14)] overflow-hidden backdrop-blur-md">

          {/* Tab Bar */}
          <div className="px-4 sm:px-5 pt-3.5 pb-2.5 flex items-center gap-2 border-b border-[#1F7A4D]/15 bg-[#DFEDE4] select-none">
            <button type="button" aria-label="New chat tab" className="w-6 h-6 rounded-lg bg-white/90 border border-[#1F7A4D]/20 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button type="button" onClick={() => setActiveTab('curriculum')} className={`hidden sm:flex ${tabBase} ${activeTab === 'curriculum' ? tabActive : tabInactive}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400/80" /><span>Curriculum Hub</span>
            </button>
            <button type="button" onClick={() => setActiveTab('kicd')} className={`hidden sm:flex ${tabBase} ${activeTab === 'kicd' ? tabActive : tabInactive}`}>
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/80" /><span>KICD Curriculum</span>
            </button>
            <button type="button" onClick={() => setActiveTab('darasa')} className={`flex items-center gap-2 px-3.5 py-1 rounded-lg text-xs font-semibold transition-all ${activeTab === 'darasa' ? tabActive : tabInactive}`}>
              <DarasaLogoMark /><span>darasa</span><span className="ml-1 text-slate-400 hover:text-slate-600">×</span>
            </button>
            <span className="text-slate-400 text-xs px-1 select-none">···</span>
          </div>

          {/* Body: Sidebar + Chat Canvas */}
          <div className="flex flex-row min-h-[440px] sm:min-h-[500px] lg:min-h-[540px]">

            {/* Left Sidebar */}
            <aside className="w-52 sm:w-56 shrink-0 hidden md:flex flex-col justify-between border-r border-[#1F7A4D]/15 p-4 lg:p-5 text-left bg-[#E2EDE5]/70">
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 pt-1">
                  <DarasaLogoMark size="w-5 h-5" />
                  <span className="font-extrabold text-base text-slate-900 font-['Outfit']">darasa</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/90 border border-[#1F7A4D]/20 text-slate-500 text-xs shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search</span>
                  </div>
                  <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">⌘K</kbd>
                </div>
                <nav className="space-y-1 text-xs font-medium">
                  {SIDEBAR_NAV.map(({ href, label, active, icon }) => (
                    <a key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${active ? 'bg-white text-slate-900 border border-[#1F7A4D]/20 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}>
                      <svg className="w-4 h-4" style={active ? { color: 'var(--soma-accent)' } : {}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                      <span>{label}</span>
                    </a>
                  ))}
                </nav>
                <div className="pt-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block px-1 mb-1.5">Recent Lessons</span>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {['Plant transpiration lab...', 'Soil conservation project...', 'CBC formative rubric...'].map((item) => (
                      <p key={item} className="truncate px-1 py-0.5 hover:text-slate-900 cursor-pointer">{item}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-[#1F7A4D]/15 flex items-center gap-2 px-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs text-slate-700 font-medium">darasa Online</span>
              </div>
            </aside>

            {/* Main Chat Canvas */}
            <div className="flex-1 p-5 sm:p-7 lg:p-8 flex flex-col justify-between text-left bg-[#EAF3EE]">
              {/* Model Selector */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 border border-[#1F7A4D]/20 shadow-2xs text-xs font-semibold text-slate-800">
                  <DarasaLogoMark /><span>darasa 4o</span>
                  <svg className="w-3 h-3 text-slate-500 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Greeting + Orb */}
              <div className="py-7 sm:py-9 lg:py-10 flex flex-col items-center justify-center text-center space-y-3.5">
                <div className="relative flex items-center justify-center mb-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full luminous-3d-orb" />
                  <div className="absolute inset-0 rounded-full blur-md opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, #93C5FD 0%, #A7F3D0 100%)' }} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-slate-900 tracking-tight font-['Outfit']">Good Morning, Judha</h2>
                  <p className="text-xl sm:text-2xl lg:text-[1.7rem] font-bold tracking-tight text-slate-800 font-['Outfit']">
                    How Can I{' '}
                    <span style={{ color: 'var(--soma-accent)' }} className="underline decoration-emerald-500/30 underline-offset-4">
                      Assist You Today?
                    </span>
                  </p>
                </div>
              </div>

              {/* Prompt Card */}
              <div className="w-full rounded-2xl sm:rounded-3xl bg-white/95 border border-[#1F7A4D]/25 shadow-md p-4 sm:p-5 lg:p-6 space-y-4 transition-all focus-within:border-emerald-600/70">
                <div className="flex items-start gap-3">
                  <span className="text-base sm:text-lg shrink-0 mt-0.5 font-bold" style={{ color: 'var(--soma-accent)' }} aria-hidden="true">✦</span>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Initiate a query or send a command to the AI..."
                    aria-label="Ask darasa a CBC curriculum question"
                    className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button type="button" aria-label="Attach file" className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    {ACTION_PILLS.map(({ mode, label, iconColor, prompt, iconPath, hidden }) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handlePillClick(mode, prompt)}
                        className={`${hidden ? 'hidden sm:inline-flex' : 'inline-flex'} items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium border transition-all ${
                          activeMode === mode
                            ? 'bg-[#DDEFE4] text-emerald-900 border-[#1F7A4D]/50 shadow-2xs'
                            : 'bg-[#EAF3EE] text-[#18633E] border-[#1F7A4D]/20 hover:bg-[#DCEEE3]'
                        }`}
                      >
                        <svg className={`w-3.5 h-3.5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                        </svg>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                  <button type="button" aria-label="Send prompt" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 text-white transition-transform hover:scale-105 active:scale-95 shadow-xs" style={{ backgroundColor: 'var(--soma-accent)' }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
