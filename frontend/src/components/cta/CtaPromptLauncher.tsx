'use client';

import React from 'react';
import { Sparkles, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { QUICK_PROMPT_PILLS } from './ctaTypes';

interface CtaPromptLauncherProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSelectPrompt: (prompt: string) => void;
}

export default function CtaPromptLauncher({
  inputValue,
  setInputValue,
  onSubmit,
  onSelectPrompt,
}: CtaPromptLauncherProps) {
  return (
    <div
      id="how-it-works"
      className="w-full max-w-4xl mx-auto mt-8 sm:mt-10 lg:mt-12 rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/80 shadow-2xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(220, 240, 228, 0.45) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 24px 50px -12px rgba(20, 50, 30, 0.12), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95)',
      }}
    >
      <div className="text-center max-w-2xl mx-auto mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1F7A4D]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant AI Companion</span>
        </span>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Ask anything, get verified CBC guidance
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Select a sample prompt below or type your own question to start chatting immediately:
        </p>
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {QUICK_PROMPT_PILLS.map((prompt, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white/80 hover:bg-white hover:text-[#144D2E] border border-[#1F7A4D]/20 shadow-xs hover:shadow-sm transition-all text-left cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Interactive Chat Launcher Form */}
      <form onSubmit={onSubmit} className="w-full flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Darasa a CBC question (e.g. Plan Grade 5 Science water cycle)..."
            aria-label="Darasa quick prompt question"
            className="w-full px-5 py-4 rounded-full text-sm sm:text-base text-slate-900 placeholder-slate-500 bg-white/90 border border-[#1F7A4D]/30 focus:border-[#1F7A4D] focus:ring-2 focus:ring-[#1F7A4D]/20 shadow-inner outline-none transition-all"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              aria-label="Clear input text"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          aria-label="Start chatting with Darasa"
          className="group glass-btn-accent w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm sm:text-base font-bold text-[#0d4a25] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A4D] shadow-lg cursor-pointer"
          style={{ backgroundColor: 'var(--soma-accent)' }}
        >
          <span>Start Chatting</span>
          <Send className="w-4 h-4 text-[#0d4a25] transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      {/* Trust Guarantees */}
      <div className="mt-6 pt-5 border-t border-[#1F7A4D]/15 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#1F7A4D]" />
          <span>100% KICD Curriculum Aligned</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-4 h-4 text-[#EE9B2E]" />
          <span>Free to start • Zero credit card</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#1F7A4D]" />
          <span>Child-Safe & Family-Friendly</span>
        </div>
      </div>
    </div>
  );
}
