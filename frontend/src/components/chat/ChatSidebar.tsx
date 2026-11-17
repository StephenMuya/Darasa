import { Search, Plus } from 'lucide-react';
import DarasaLogoMark from './DarasaLogoMark';
import { SIDEBAR_NAV, RECENT_LESSONS } from './chatTypes';

interface ChatSidebarProps {
  onStartNewConversation: () => void;
  onSelectLesson: (lessonPrompt: string) => void;
}

export default function ChatSidebar({
  onStartNewConversation,
  onSelectLesson,
}: ChatSidebarProps) {
  return (
    <aside className="w-64 lg:w-72 shrink-0 flex flex-col justify-between border-r border-white/40 p-3.5 sm:p-4 text-left bg-white/20 backdrop-blur-md transition-all duration-300 animate-fade-in">
      <div className="space-y-3 flex flex-col flex-1 min-h-0">
        {/* Word Logo with uppercase first letter */}
        <div className="flex items-center gap-2 px-1 pt-0.5">
          <DarasaLogoMark size="w-5 h-5" />
          <span className="font-extrabold text-base text-slate-900 font-['Outfit']">Darasa</span>
        </div>

        {/* Search Feature */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 text-slate-600 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </div>
          <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white/40 text-slate-600 border border-white/60">
            ⌘K
          </kbd>
        </div>

        {/* Start a New Conversation button below search */}
        <button
          type="button"
          onClick={onStartNewConversation}
          aria-label="Start a new conversation"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/35 hover:bg-white/60 backdrop-blur-sm border border-white/60 text-slate-800 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-lg flex items-center justify-center text-white shadow-2xs"
              style={{ backgroundColor: 'var(--soma-accent)' }}
            >
              <Plus className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-800 group-hover:text-[#18633E]">New conversation</span>
          </div>
          <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white/40 text-slate-500 border border-white/60">
            ⌘N
          </kbd>
        </button>

        {/* Nav items */}
        <nav className="space-y-1 text-xs font-medium pt-0.5">
          {SIDEBAR_NAV.map(({ href, label, active, icon }) => (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                active
                  ? 'bg-white/50 text-slate-900 border border-white/70 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/20'
              }`}
            >
              <svg
                className="w-4 h-4"
                style={active ? { color: 'var(--soma-accent)' } : {}}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Recent Lessons List */}
        <div className="pt-1.5 flex-1 flex flex-col min-h-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1 mb-1.5">
            Recent Lessons
          </span>
          <div className="flex-1 space-y-1 text-xs text-slate-600 overflow-y-auto pr-1">
            {RECENT_LESSONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSelectLesson(item.replace('...', ''))}
                className="w-full text-left truncate px-2 py-1.5 rounded-lg hover:bg-white/45 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D]/50 shrink-0" />
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="pt-3 mt-auto border-t border-white/40 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs text-slate-700 font-medium">Darasa Online</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 bg-white/40 px-2 py-0.5 rounded-md border border-white/60">
          Instant Guest Access
        </span>
      </div>
    </aside>
  );
}
