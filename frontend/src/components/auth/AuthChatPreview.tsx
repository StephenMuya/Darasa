'use client';

import {
  Sparkles,
  Paperclip,
  CheckCircle2,
  Check,
  Send,
} from 'lucide-react';

interface AuthChatPreviewProps {
  copiedRubric: boolean;
  onCopyRubric: () => void;
  initialPrompt?: string;
  onEnterChat?: (prompt?: string) => void;
}

export default function AuthChatPreview({
  copiedRubric,
  onCopyRubric,
  initialPrompt,
  onEnterChat,
}: AuthChatPreviewProps) {
  return (
    <section
      aria-label="Darasa CBC chatbot preview"
      className="lg:col-span-7 w-full flex flex-col justify-center"
    >
      <div className="w-full rounded-3xl glass-chat-window shadow-2xl border border-white/85 overflow-hidden transition-all duration-300">
        {/* Chatbot Window Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-white/50 bg-white/30 backdrop-blur-md select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56]/85 border border-red-400/40" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/85 border border-amber-400/40" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F]/85 border border-emerald-400/40" />
            <span className="ml-2 text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5 font-['Outfit']">
              <span>Darasa Interactive Workspace</span>
            </span>
          </div>

          {/* Strand Pill */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#144D2E] bg-white/70 border border-[#1F7A4D]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Grade 7 • Integrated Science</span>
            </span>
          </div>
        </div>

        {/* Conversation Thread Canvas */}
        <div className="p-4 sm:p-5 lg:p-6 space-y-4 max-h-[560px] overflow-y-auto text-left">
          {/* Sub-strand breadcrumb pill */}
          <div className="flex justify-center">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 bg-white/60 px-3 py-1 rounded-full border border-white/80 shadow-2xs">
              Strand 2.0: Living Things ➔ Sub-strand 2.3: Plant Physiology & Transpiration
            </span>
          </div>

          {/* Message 1: User / Educator Query */}
          <div className="flex items-start gap-3 justify-end">
            <div
              className="max-w-[85%] rounded-2xl rounded-tr-xs p-3.5 sm:p-4 text-xs sm:text-sm text-slate-900 border border-emerald-600/20 shadow-xs"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 245, 230, 0.75) 100%)',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-emerald-600/10">
                <span className="font-bold text-[#144D2E] text-xs">Jane W. (Teacher)</span>
                <span className="text-[10px] text-slate-500">9:15 AM</span>
              </div>
              <p className="leading-relaxed">
                {initialPrompt ||
                  'How can my Grade 7 learners carry out an investigation to demonstrate plant transpiration using locally available household materials, and how do I assess them on an official CBC 4-tier rubric?'}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium">
                <Paperclip className="w-3 h-3" />
                <span>CBC Lesson Inquiry Request</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#1F7A4D] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              JW
            </div>
          </div>

          {/* Message 2: Darasa Socratic Assistant Response */}
          <div className="flex items-start gap-3 justify-start">
            {/* Glowing 3D Orb Avatar */}
            <div className="w-9 h-9 rounded-full luminous-3d-orb shrink-0 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-emerald-800" />
            </div>

            <div
              className="max-w-[92%] rounded-2xl rounded-tl-xs p-4 sm:p-5 text-xs sm:text-sm text-slate-900 border border-white/80 shadow-md space-y-3"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 248, 243, 0.65) 100%)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Assistant Header */}
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#1F7A4D]/15">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#144D2E] font-['Outfit'] text-xs sm:text-sm">
                    Darasa CBC Assistant
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1F7A4D]/10 text-[#1F7A4D] border border-[#1F7A4D]/20">
                    ✓ KICD Verified
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">Just now</span>
              </div>

              {/* Socratic Guidance Introduction */}
              <p className="leading-relaxed text-slate-800">
                Jambo Mwalimu Jane! In Kenya&apos;s CBC, practical investigations with locally available materials build self-efficacy and scientific inquiry without expensive laboratory glassware.
              </p>

              {/* Improvised Local Materials Card */}
              <div className="rounded-xl p-3 bg-white/80 border border-[#1F7A4D]/20 space-y-1.5">
                <h4 className="text-xs font-bold text-[#144D2E] flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>Locally Available Practical Setup:</span>
                </h4>
                <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                  <li>
                    <strong>Chamber:</strong> Clean transparent polyethene shopping bag (dry inside).
                  </li>
                  <li>
                    <strong>Specimen:</strong> Healthy potted plant or leafy branch on school compound.
                  </li>
                  <li>
                    <strong>Fastener:</strong> Sisal string, rubber band, or banana fiber.
                  </li>
                  <li>
                    <strong>Exposure:</strong> 30–45 minutes in direct morning sunlight.
                  </li>
                </ul>
              </div>

              {/* Formative 4-Tier Rubric Table Preview */}
              <div className="rounded-xl overflow-hidden border border-[#1F7A4D]/25 bg-white/95 shadow-2xs">
                <div className="bg-[#1F7A4D]/10 px-3 py-1.5 border-b border-[#1F7A4D]/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#144D2E]">
                    Official 4-Tier CBC Assessment Rubric
                  </span>
                  <span className="text-[10px] font-mono text-slate-600">Sub-strand 2.3</span>
                </div>
                <div className="divide-y divide-slate-200/70 text-[11px] sm:text-xs">
                  <div className="p-2 sm:p-2.5 flex items-start gap-2 bg-emerald-50/50">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] shrink-0">EE 4</span>
                    <span className="text-slate-800 leading-tight">
                      <strong>Exceeding Expectations:</strong> Sets up apparatus independently, formulates hypothesis on stomata, and tests sun vs. shade conditions.
                    </span>
                  </div>
                  <div className="p-2 sm:p-2.5 flex items-start gap-2 bg-teal-50/40">
                    <span className="px-1.5 py-0.5 rounded bg-teal-600 text-white font-bold text-[10px] shrink-0">ME 3</span>
                    <span className="text-slate-800 leading-tight">
                      <strong>Meeting Expectations:</strong> Correctly constructs chamber and identifies collected water droplets as transpired water vapor.
                    </span>
                  </div>
                  <div className="p-2 sm:p-2.5 flex items-start gap-2 bg-amber-50/40">
                    <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white font-bold text-[10px] shrink-0">AE 2</span>
                    <span className="text-slate-800 leading-tight">
                      <strong>Approaching Expectations:</strong> Assembles enclosure with peer assistance; requires prompting to explain condensation origin.
                    </span>
                  </div>
                  <div className="p-2 sm:p-2.5 flex items-start gap-2 bg-rose-50/40">
                    <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] shrink-0">BE 1</span>
                    <span className="text-slate-800 leading-tight">
                      <strong>Below Expectations:</strong> Needs guided step-by-step assistance to enclose leaf and record observations.
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Action Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onCopyRubric}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-[#144D2E] border border-[#1F7A4D]/25 transition-all shadow-2xs cursor-pointer"
                >
                  {copiedRubric ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1F7A4D]" />
                      <span>Copied to Lesson Plan</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4D]" />
                      <span>Copy 4-Tier Rubric</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => (onEnterChat ? onEnterChat(initialPrompt) : undefined)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Generate Lesson Plan Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Interactive Prompt Box Preview */}
        <div className="p-3 sm:p-4 border-t border-white/50 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2 rounded-2xl bg-white/90 border border-[#1F7A4D]/30 px-3.5 py-2 shadow-inner">
            <Paperclip className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
            <input
              type="text"
              readOnly
              value="Ask Darasa to generate schemes of work, lesson plans, or inquiry tasks..."
              aria-label="Darasa conversation demo input"
              className="w-full bg-transparent text-xs sm:text-sm text-slate-700 outline-none cursor-default"
            />
            <button
              type="button"
              aria-label="Send query demo"
              onClick={() => (onEnterChat ? onEnterChat(initialPrompt) : undefined)}
              className="glass-btn-accent w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-white cursor-pointer"
              style={{ backgroundColor: 'var(--soma-accent)' }}
            >
              <Send className="w-3.5 h-3.5 text-[#0d4a25]" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
            <span>✦ Grounded strictly in official KICD Curriculum Designs</span>
            <span className="hidden sm:inline">Press Enter ↵ to ask</span>
          </div>
        </div>
      </div>
    </section>
  );
}
