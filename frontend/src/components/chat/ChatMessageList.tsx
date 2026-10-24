'use client';

import React from 'react';
import { Sparkles, Check, Copy } from 'lucide-react';
import type { Message, RubricTier } from './chatTypes';

interface ChatMessageListProps {
  messages: Message[];
  isThinking: boolean;
  copiedRubricId: string | null;
  onCopyRubric: (msgId: string, rubric: RubricTier) => void;
  onSelectFollowUp: (prompt: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessageList({
  messages,
  isThinking,
  copiedRubricId,
  onCopyRubric,
  onSelectFollowUp,
  messagesEndRef,
}: ChatMessageListProps) {
  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-start gap-3 ${
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {/* Assistant Luminous Avatar */}
          {msg.sender === 'darasa' && (
            <div className="w-8 h-8 rounded-full luminous-3d-orb shrink-0 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-emerald-800" />
            </div>
          )}

          {/* Bubble */}
          <div
            className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm shadow-md transition-all ${
              msg.sender === 'user'
                ? 'rounded-tr-xs text-slate-900 border border-emerald-600/20'
                : 'rounded-tl-xs text-slate-900 border border-white/80'
            }`}
            style={
              msg.sender === 'user'
                ? {
                    background:
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 245, 230, 0.85) 100%)',
                  }
                : {
                    background:
                      'linear-gradient(145deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 248, 243, 0.70) 100%)',
                    backdropFilter: 'blur(16px)',
                  }
            }
          >
            {/* Bubble Header */}
            <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-[#1F7A4D]/15">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#144D2E] font-['Outfit']">
                  {msg.senderName}
                </span>
                {msg.sender === 'darasa' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1F7A4D]/10 text-[#1F7A4D] border border-[#1F7A4D]/20">
                    ✓ KICD Verified
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
            </div>

            {/* Text content */}
            <p className="leading-relaxed text-slate-800 whitespace-pre-line">{msg.text}</p>

            {/* Practical Improvised Materials */}
            {msg.materials && msg.materials.length > 0 && (
              <div className="mt-3 rounded-xl p-3 bg-white/85 border border-[#1F7A4D]/25 space-y-1">
                <h4 className="text-xs font-bold text-[#144D2E] flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>Locally Available Practical Materials:</span>
                </h4>
                <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                  {msg.materials.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Official 4-Tier Assessment Rubric */}
            {msg.rubric && (
              <div className="mt-3 rounded-xl overflow-hidden border border-[#1F7A4D]/25 bg-white/95 shadow-2xs">
                <div className="bg-[#1F7A4D]/10 px-3 py-1.5 border-b border-[#1F7A4D]/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#144D2E]">
                    Official 4-Tier Formative Rubric
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopyRubric(msg.id, msg.rubric!)}
                    aria-label="Copy rubric"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#144D2E] hover:underline cursor-pointer"
                  >
                    {copiedRubricId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#1F7A4D]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Rubric</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="divide-y divide-slate-200/70 text-[11px] sm:text-xs">
                  <div className="p-2 sm:p-2.5 flex items-start gap-2 bg-emerald-50/50">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] shrink-0">EE 4</span>
                    <div className="text-slate-800 leading-tight">
                      <strong className="font-semibold text-emerald-950">Exceeding Expectations (4): </strong>
                      <span>{msg.rubric.ee.replace(/^Exceeding Expectations \(4\):\s*/i, '')}</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-2.5 flex items-start gap-2 bg-teal-50/40">
                    <span className="px-1.5 py-0.5 rounded bg-teal-600 text-white font-bold text-[10px] shrink-0">ME 3</span>
                    <div className="text-slate-800 leading-tight">
                      <strong className="font-semibold text-teal-950">Meeting Expectations (3): </strong>
                      <span>{msg.rubric.me.replace(/^Meeting Expectations \(3\):\s*/i, '')}</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-2.5 flex items-start gap-2 bg-amber-50/40">
                    <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px] shrink-0">AE 2</span>
                    <div className="text-slate-800 leading-tight">
                      <strong className="font-semibold text-amber-950">Approaching Expectations (2): </strong>
                      <span>{msg.rubric.ae.replace(/^Approaching Expectations \(2\):\s*/i, '')}</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-2.5 flex items-start gap-2 bg-rose-50/40">
                    <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] shrink-0">BE 1</span>
                    <div className="text-slate-800 leading-tight">
                      <strong className="font-semibold text-rose-950">Below Expectations (1): </strong>
                      <span>{msg.rubric.be.replace(/^Below Expectations \(1\):\s*/i, '')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up suggestion pills */}
            {msg.followUps && msg.followUps.length > 0 && (
              <div className="mt-3 pt-2 border-t border-[#1F7A4D]/15 flex flex-wrap gap-1.5">
                {msg.followUps.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectFollowUp(prompt)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-slate-100 text-[#144D2E] border border-[#1F7A4D]/25 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Avatar */}
          {msg.sender === 'user' && (
            <div className="w-8 h-8 rounded-full bg-[#1F7A4D] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              MW
            </div>
          )}
        </div>
      ))}

      {/* AI Thinking Animation */}
      {isThinking && (
        <div className="flex items-start gap-3 justify-start animate-fade-in-out">
          <div className="w-8 h-8 rounded-full luminous-3d-orb shrink-0 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="rounded-2xl rounded-tl-xs p-3.5 bg-white/80 border border-white/80 shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1F7A4D] animate-ping" />
            <span className="text-xs font-medium text-slate-700">
              Grounding inquiry in KICD CBC frameworks...
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
