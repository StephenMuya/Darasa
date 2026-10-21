'use client';

import { Sparkles, ShieldCheck, Zap, BookOpen } from 'lucide-react';

interface AuthFuturisticVisualProps {
  initialPrompt?: string;
  onEnterChat?: (prompt?: string) => void;
}

/**
 * AuthFuturisticVisual
 *
 * Single responsibility: Displays the 3D futuristic curriculum intelligence visual
 * on the right side of the unified auth container.
 *
 * Upgrades the luminous-3d-orb design found above "Good Morning, Judha" into an
 * immersive 3D holographic neural visual with orbital gyroscopic rings, volumetric glow,
 * telemetry status badges, and interactive Socratic capability cues.
 */
export default function AuthFuturisticVisual({
  initialPrompt,
  onEnterChat,
}: AuthFuturisticVisualProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between text-center relative select-none py-6 px-4 sm:px-6">
      {/* ── Background Cyber Holographic Grid & Radial Lighting ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(52, 211, 153, 0.35) 1px, transparent 1px), radial-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, #10B981 0%, #059669 40%, transparent 70%)',
        }}
      />

      {/* ── Top Futuristic Telemetry Pill ── */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-inner">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono tracking-wider uppercase text-[11px]">Soma Neural Engine · Online</span>
      </div>

      {/* ── Core 3D Futuristic Luminous Orb Centerpiece ── */}
      <div className="relative z-10 my-auto py-8 flex flex-col items-center justify-center">
        {/* Outer Gyro Ring 1 */}
        <div
          aria-hidden="true"
          className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-emerald-400/30 pointer-events-none"
          style={{
            transform: 'rotateX(68deg) rotateZ(25deg)',
            boxShadow: '0 0 25px rgba(52, 211, 153, 0.25), inset 0 0 15px rgba(52, 211, 153, 0.2)',
          }}
        />

        {/* Outer Gyro Ring 2 (Counter-Angled) */}
        <div
          aria-hidden="true"
          className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-amber-300/35 pointer-events-none"
          style={{
            transform: 'rotateY(70deg) rotateZ(-35deg)',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.2)',
          }}
        />

        {/* Inner Gyro Ring 3 */}
        <div
          aria-hidden="true"
          className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-emerald-300/40 pointer-events-none"
          style={{
            transform: 'rotateX(-60deg) rotateZ(50deg)',
          }}
        />

        {/* The Volumetric 3D Luminous Core Orb (enlarged & enhanced from Hero) */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full luminous-3d-orb shadow-[0_0_50px_rgba(52,211,153,0.6)] relative z-10 flex items-center justify-center"
          >
            {/* Inner holographic core icon */}
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-950 opacity-80 drop-shadow-sm" />
          </div>

          {/* Ambient Multi-Layer Radial Halos */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-full blur-xl opacity-60 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #6EE7B7 0%, #10B981 50%, transparent 80%)',
            }}
          />
        </div>

        {/* Holographic Platform / Pedestal Shadow */}
        <div
          aria-hidden="true"
          className="w-44 h-8 rounded-full blur-md opacity-50 mt-4 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.6) 0%, transparent 70%)',
          }}
        />

        {/* Futuristic Sub-Title & Description */}
        <div className="mt-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit']">
            CBC Pedagogical Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-sm mx-auto leading-relaxed">
            Instant KICD strand alignment, formative rubric synthesis, and guided socratic learning.
          </p>
        </div>
      </div>

      {/* ── Bottom Futuristic Metric Pills ── */}
      <div className="relative z-10 w-full pt-4 border-t border-emerald-900/60 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-medium text-emerald-200/90">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/25">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Official KICD CBC Rubrics</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/25">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Grades 1–9 CBC Coverage</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/25">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Household Substitutes</span>
        </div>
      </div>

      {/* Quick Launch Direct Action if desired */}
      {onEnterChat && (
        <button
          type="button"
          onClick={() => onEnterChat(initialPrompt)}
          className="relative z-10 mt-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer transition-colors"
        >
          Skip sign up &amp; launch test session directly →
        </button>
      )}
    </div>
  );
}
