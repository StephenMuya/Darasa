'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PERSONA_CARDS } from './ctaTypes';

interface CtaPersonaCardsProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function CtaPersonaCards({ onSelectPrompt }: CtaPersonaCardsProps) {
  return (
    <div
      id="curriculum"
      className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 mt-8 sm:mt-10 lg:mt-12 text-left"
    >
      {PERSONA_CARDS.map((card) => (
        <div
          key={card.id}
          id={card.id}
          className="group relative rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl border border-white/70 hover:border-[#1F7A4D]/40"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(240, 248, 243, 0.55) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 12px 32px -6px rgba(31, 122, 77, 0.08)',
          }}
        >
          <div>
            {/* Top Header & Tag Pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1F7A4D]/10 border border-[#1F7A4D]/20 flex items-center justify-center transition-transform group-hover:scale-110">
                {card.icon}
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#144D2E] bg-white/80 border border-[#1F7A4D]/25">
                {card.tag}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-[#1F7A4D] transition-colors">
              {card.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {card.description}
            </p>

            {/* Highlights list */}
            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-700">
              {card.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A4D] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Quick-Start Action */}
          <div className="mt-6 pt-4 border-t border-[#1F7A4D]/15 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onSelectPrompt(card.samplePrompt)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#144D2E] hover:text-[#18633E] group/btn transition-colors cursor-pointer"
            >
              <span>{card.actionLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              KICD Aligned
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
