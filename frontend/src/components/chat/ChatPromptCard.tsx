'use client';

import React from 'react';
import { Paperclip } from 'lucide-react';
import { ACTION_PILLS, type PillMode } from './chatTypes';

interface ChatPromptCardProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  activeMode: PillMode | null;
  onPillClick: (mode: PillMode, prompt: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatPromptCard({
  inputValue,
  onInputChange,
  activeMode,
  onPillClick,
  onSubmit,
}: ChatPromptCardProps) {
  return (
    <div className="w-full pt-2 sm:pt-3 max-w-4xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-xl sm:rounded-2xl glass-prompt-card p-3 sm:p-3.5 lg:p-4 space-y-2.5 sm:space-y-3 transition-all focus-within:border-emerald-600/70 focus-within:ring-2 focus-within:ring-emerald-500/15"
      >
        <div className="flex items-start gap-3">
          <span
            className="text-base sm:text-lg shrink-0 mt-0.5 font-bold animate-fade-in-out"
            style={{ color: 'var(--soma-accent)' }}
            aria-hidden="true"
          >
            ✦
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Initiate a query or send a command to the AI..."
            aria-label="Darasa AI prompt input"
            className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Action pills + Send button */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/40">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              aria-label="Attach file"
              className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white/40 transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Action pills */}
            {ACTION_PILLS.map(({ mode, label, iconColor, prompt, iconPath }) => (
              <button
                key={mode}
                type="button"
                onClick={() => onPillClick(mode, prompt)}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium border transition-all cursor-pointer ${
                  activeMode === mode
                    ? 'bg-emerald-600/20 text-emerald-950 border-emerald-500/40 shadow-2xs backdrop-blur-xs'
                    : 'bg-white/25 hover:bg-white/45 text-[#0d4a25] border-white/50 shadow-2xs backdrop-blur-xs'
                }`}
              >
                <svg className={`w-3 h-3 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                </svg>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Glass Send Button */}
          <button
            type="submit"
            aria-label="Send message to Darasa"
            className="glass-btn-accent w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            style={{ backgroundColor: 'var(--soma-accent)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>

      {/* Footer Microcopy */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
        <span>✦ Grounded strictly in official KICD Curriculum Designs • No credentials required</span>
        <span className="hidden sm:inline">Press Enter ↵ to send</span>
      </div>
    </div>
  );
}
