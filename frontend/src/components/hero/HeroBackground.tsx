'use client';

/**
 * HeroBackground
 * Single responsibility: Renders purely decorative, non-interactive background layers.
 *  - Oversized watermark words: ASK. / LEARN. / GROW.
 *  - Ambient bottom-left mint-green gradient orb
 *  - Ambient right-side warm amber gradient glow
 *
 * All elements are aria-hidden and pointer-events-none.
 * CSS animation classes are defined in heroAnimations.css.
 */
export default function HeroBackground() {
  return (
    <>
      {/* ── Watermark typography layer ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between py-12 px-4 md:px-12 z-0 leading-none font-extrabold tracking-tighter"
      >
        <span
          className="text-[clamp(6rem,18vw,16rem)] -translate-x-6 md:-translate-x-12 -translate-y-4"
          style={{ color: 'rgba(31, 122, 77, 0.07)' }}
        >
          ASK.
        </span>
        <span
          className="text-[clamp(6rem,18vw,16rem)] self-center -translate-y-6"
          style={{ color: 'rgba(31, 122, 77, 0.07)' }}
        >
          LEARN.
        </span>
        <span
          className="text-[clamp(6rem,18vw,16rem)] self-end translate-x-6 md:translate-x-12 translate-y-4"
          style={{ color: 'rgba(31, 122, 77, 0.07)' }}
        >
          GROW.
        </span>
      </div>

      {/* ── Right-side warm amber radial glow (behind chat window) ── */}
      <div
        aria-hidden="true"
        className="ambient-right-amber-glow absolute top-1/3 right-0 w-[420px] sm:w-[600px] lg:w-[750px] h-[420px] sm:h-[600px] lg:h-[750px] rounded-full pointer-events-none select-none z-0 transition-opacity duration-500"
        style={{
          filter: 'blur(90px)',
          background:
            'radial-gradient(circle at 60% 40%, rgba(252, 210, 140, 0.55) 0%, rgba(238, 155, 46, 0.28) 40%, rgba(252, 233, 200, 0.10) 70%, transparent 100%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── Bottom-left ambient mint-green gradient orb ── */}
      <div
        aria-hidden="true"
        className="ambient-bottom-left-orb absolute bottom-0 left-0 w-[380px] sm:w-[560px] lg:w-[720px] h-[380px] sm:h-[560px] lg:h-[720px] rounded-full pointer-events-none select-none z-0 transition-opacity duration-500"
        style={{
          filter: 'blur(85px)',
          background:
            'radial-gradient(circle at 30% 70%, rgba(52, 211, 153, 0.55) 0%, rgba(110, 231, 183, 0.38) 28%, rgba(252, 215, 160, 0.22) 55%, rgba(31, 122, 77, 0.10) 75%, transparent 100%)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
