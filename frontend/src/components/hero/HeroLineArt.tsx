'use client';

/**
 * HeroLineArt
 * Single responsibility: Bottom panoramic line-art illustration strip.
 * Contains the three scenes (graduates, students-at-desk, parent-child)
 * plus the decorative learning motif and baseline gradient.
 * Purely presentational — no state, no interactivity.
 */
export default function HeroLineArt() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden select-none pointer-events-none mt-auto pt-4"
    >
      {/* Seamless top divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1F7A4D]/20 to-transparent mb-2" />

      {/* Ambient atmospheric glow in the bottom-left space */}
      <div
        aria-hidden="true"
        className="absolute left-0 bottom-0 w-80 lg:w-[480px] h-48 lg:h-64 pointer-events-none -z-0 opacity-45 blur-3xl transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(ellipse at bottom left, rgba(167, 243, 208, 0.4) 0%, rgba(252, 233, 200, 0.22) 35%, rgba(234, 243, 238, 0) 70%)',
        }}
      />

      {/* Subtle topographic learning contours */}
      <div
        aria-hidden="true"
        className="absolute left-0 bottom-3 w-64 lg:w-[380px] h-24 pointer-events-none -z-0 opacity-25 overflow-hidden"
      >
        <svg viewBox="0 0 380 90" fill="none" className="w-full h-full text-[#1F7A4D]">
          <path d="M 0 50 C 90 35, 190 70, 380 40" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 5" />
          <path d="M 0 75 C 110 60, 220 85, 380 65" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      {/* Main artwork row */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-end justify-center gap-3 sm:gap-6 md:gap-9 lg:gap-11 pb-0 relative z-10">

        {/* Decorative element: open book + knowledge sprout */}
        <div className="hidden sm:flex flex-shrink-0 items-end justify-end max-w-[15%] md:max-w-[16%] lg:max-w-[170px] mb-0.5 opacity-65">
          <svg
            viewBox="0 0 160 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto text-[#184C30]"
          >
            {/* Ground entry */}
            <path d="M 0 98 L 60 98" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Open textbook */}
            <path d="M 60 98 C 68 86, 84 82, 98 84 C 108 85, 118 90, 122 98" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 98 84 L 98 98" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 60 98 C 68 90, 80 88, 98 88 C 108 88, 116 93, 122 98" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            {/* Growth sprout */}
            <path d="M 98 84 C 98 76, 99 69, 103 64 C 106 60, 111 59, 114 61 C 117 64, 116 68, 112 72 C 108 76, 102 78, 99 82" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 101 68 C 97 64, 93 63, 90 65 C 87 67, 88 71, 92 74 C 95 76, 98 77, 99 79" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Baseline exit */}
            <path d="M 122 98 L 160 98" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Scene 1 – Graduating students */}
        <div className="flex-shrink-0 flex justify-center items-end max-w-[28%] sm:max-w-[26%] md:max-w-[270px]">
          <img
            src="/images/graduates.png"
            alt="Graduating CBC students celebrating with mortarboards and scrolls"
            className="w-full max-h-28 sm:max-h-36 md:max-h-44 lg:max-h-52 object-contain object-bottom transition-all duration-300"
          />
        </div>

        {/* Scene 2 – Students collaborating at desk */}
        <div className="flex-shrink-0 flex justify-center items-end max-w-[38%] sm:max-w-[35%] md:max-w-[370px]">
          <img
            src="/images/students-desk.png"
            alt="Three CBC uniform students studying around table with textbook, notebook and tablet"
            className="w-full max-h-28 sm:max-h-36 md:max-h-44 lg:max-h-52 object-contain object-bottom transition-all duration-300"
          />
        </div>

        {/* Scene 3 – Parent & child on laptop */}
        <div className="flex-shrink-0 flex justify-center items-end max-w-[30%] sm:max-w-[28%] md:max-w-[310px]">
          <img
            src="/images/parent-child.png"
            alt="Mother and daughter working together on laptop"
            className="w-full max-h-28 sm:max-h-36 md:max-h-44 lg:max-h-52 object-contain object-bottom transition-all duration-300"
          />
        </div>

      </div>

      {/* Ground baseline gradient */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#1F7A4D]/25 via-[#EE9B2E]/60 to-[#1F7A4D]/25" />
    </div>
  );
}
