'use client';

import './hero/heroAnimations.css';

interface ProblemCard {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  alt: string;
  tiltClass: string;
  offsetClass: string;
}

const PROBLEM_CARDS: ProblemCard[] = [
  {
    id: 'admin-bottleneck',
    tag: 'Administration & Finance',
    title: 'Paperwork Overload',
    description: 'Manual records, extensive compliance folders, and time-consuming administrative reporting.',
    imageSrc: '/images/problem-admin-paperwork.jpg',
    alt: 'School administrator and teacher reviewing stacks of physical files and records',
    tiltClass: '-rotate-[2.2deg]',
    offsetClass: 'sm:-translate-y-2 lg:-translate-y-4',
  },
  {
    id: 'parent-bottleneck',
    tag: 'Parents & Homes',
    title: 'Resource & Craft Costs',
    description: 'Frequent practical homework assignments requiring costly materials and family time.',
    imageSrc: '/images/problem-parent-crafts.jpg',
    alt: 'Father and daughter working on hands-on practical craft project using household materials',
    tiltClass: 'rotate-[2.5deg]',
    offsetClass: 'sm:translate-y-4 lg:translate-y-6',
  },
  {
    id: 'teacher-bottleneck',
    tag: 'Teachers & Classes',
    title: 'Continuous Assessment',
    description: 'Managing complex individual rubrics and grading strands for overcrowded classrooms.',
    imageSrc: '/images/problem-teacher-assessment.jpg',
    alt: 'Teacher in classroom with stacks of books managing continuous assessment papers',
    tiltClass: 'rotate-[1.8deg]',
    offsetClass: 'sm:-translate-y-1 lg:-translate-y-3',
  },
  {
    id: 'learner-bottleneck',
    tag: 'Learners & Schools',
    title: 'Digital Divide',
    description: 'Disparities in tablet availability, network connectivity, and digital learning tools.',
    imageSrc: '/images/problem-student-digital.jpg',
    alt: 'Young learner using interactive tablet for digital curriculum learning at school desk',
    tiltClass: '-rotate-[2.4deg]',
    offsetClass: 'sm:translate-y-3 lg:translate-y-5',
  },
];

/**
 * ProblemStatement
 *
 * Single responsibility: Displays the problem statement section.
 *
 * Features:
 * - Green and white theme harmonized with the hero section.
 * - Bold uppercase serif headline in Soma gradient text-fade on the left.
 * - Four thematic cards with background images depicting CBC bottlenecks on the right.
 * - Sparse vertically aligned green & white decorative dots.
 */
export default function ProblemStatement() {
  return (
    <section
      id="problem-statement"
      aria-label="Problem Statement"
      className="relative w-full h-screen min-h-screen h-[100dvh] overflow-hidden flex flex-col justify-center text-left px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3 sm:py-5 lg:py-6"
      style={{
        /* Green & white palette — more pronounced green gradient blending from soft mint into lush forest */
        background: 'linear-gradient(160deg, #F0F8F3 0%, #DCF0E3 26%, #BCE2CB 58%, #8CCFA6 84%, #5CB47F 100%)',
        ['--soma-accent'       as any]: '#1F7A4D',
        ['--soma-accent-hover' as any]: '#18633E',
        ['--soma-amber-glow'   as any]: '#FCE9C8',
        ['--soma-amber'        as any]: '#EE9B2E',
      }}
    >
      {/* ── Vertically Aligned, Dispersed Green & White Dots (Minimalist & Sparse) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      >
        {/* Track 1: Far Left Gutter Axis */}
        <div className="absolute top-0 bottom-0 left-2 sm:left-3 lg:left-4">
          <span className="absolute top-[15%] -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[38%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1F7A4D] shadow-[0_0_8px_rgba(31,122,77,0.85)] opacity-85" />
          <span className="absolute top-[64%] -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[85%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#34D399] shadow-[0_0_10px_rgba(52,211,153,0.85)] opacity-85" />
        </div>

        {/* Track 2: Mid-Right Vertical Axis */}
        <div className="hidden md:block absolute top-0 bottom-0 right-[42%]">
          <span className="absolute top-[22%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1F7A4D] shadow-[0_0_8px_rgba(31,122,77,0.85)] opacity-80" />
          <span className="absolute top-[52%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[78%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#18633E] shadow-[0_0_8px_rgba(24,99,62,0.85)] opacity-80" />
        </div>

        {/* Track 3: Far-Right-Inner Axis */}
        <div className="hidden sm:block absolute top-0 bottom-0 right-[22%]">
          <span className="absolute top-[18%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[48%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.85)] opacity-85" />
          <span className="absolute top-[80%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
        </div>

        {/* Track 4: Far Right Vertical Axis */}
        <div className="absolute top-0 bottom-0 right-6 sm:right-10 lg:right-14">
          <span className="absolute top-[14%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1F7A4D] shadow-[0_0_8px_rgba(31,122,77,0.85)] opacity-85" />
          <span className="absolute top-[36%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
          <span className="absolute top-[60%] translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1F7A4D] shadow-[0_0_8px_rgba(31,122,77,0.85)] opacity-80" />
          <span className="absolute top-[88%] translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] opacity-90" />
        </div>
      </div>

      {/* ── Right-side warm amber glow — same as hero ── */}
      <div
        aria-hidden="true"
        className="ambient-right-amber-glow absolute top-1/3 right-0 w-[420px] sm:w-[600px] lg:w-[750px] h-[420px] sm:h-[600px] lg:h-[750px] rounded-full pointer-events-none select-none z-0 transition-opacity duration-500"
        style={{
          filter: 'blur(90px)',
          background:
            'radial-gradient(circle at 60% 40%, rgba(252,210,140,0.50) 0%, rgba(238,155,46,0.25) 40%, rgba(252,233,200,0.10) 70%, transparent 100%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── Top-left lush green ambient orb ── */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/4 w-[360px] sm:w-[520px] h-[360px] sm:h-[520px] rounded-full pointer-events-none select-none z-0"
        style={{
          filter: 'blur(95px)',
          background:
            'radial-gradient(circle, rgba(31,122,77,0.28) 0%, rgba(52,211,153,0.18) 45%, transparent 75%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── Bottom-left ambient mint-green orb ── */}
      <div
        aria-hidden="true"
        className="ambient-bottom-left-orb absolute bottom-0 left-0 w-[380px] sm:w-[560px] lg:w-[720px] h-[380px] sm:h-[560px] lg:h-[720px] rounded-full pointer-events-none select-none z-0 transition-opacity duration-500"
        style={{
          filter: 'blur(85px)',
          background:
            'radial-gradient(circle at 30% 70%, rgba(31,122,77,0.55) 0%, rgba(52,211,153,0.42) 28%, rgba(167,243,208,0.25) 55%, transparent 80%)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* ── Main Content: Left Heading + Right Four Cards ── */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-8 xl:gap-12">
        {/* Left Column: Heading */}
        <div id="problem-statement-heading-box" className="w-full lg:w-[50%] xl:w-[51%] 2xl:w-[52%] flex flex-col items-start justify-center text-left shrink-0">
          <h2
            className="w-full text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.75rem] 2xl:text-[5.75rem] font-black uppercase tracking-tight leading-[1.10] sm:leading-[1.14] font-['Libre_Baskerville',Georgia,serif] text-left flex flex-col items-start justify-center drop-shadow-sm heading-text-fade"
            style={{
              background: 'linear-gradient(95deg, #144D2E 0%, #1F7A4D 42%, #52B788 75%, #9AE6B4 95%, #D1FAE5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            <span className="block w-full text-left heading-text-fade">
              Administrative and Financial Bottlenecks
            </span>
            <span className="block w-full text-left my-2 sm:my-3 lg:my-4 font-black heading-text-fade">
              in the
            </span>
            <span className="block w-full text-left heading-text-fade">
              Competency-Based Curriculum
            </span>
          </h2>
        </div>

        {/* Right Column: Four Problem Cards with Image Backgrounds (Taller, Slightly Wider, Increased Spacing) */}
        <div
          id="problem-statement-cards"
          className="w-full lg:w-[47%] xl:w-[46%] 2xl:w-[45%] max-w-[540px] sm:max-w-[600px] lg:max-w-[560px] xl:max-w-[620px] 2xl:max-w-[680px] grid grid-cols-1 sm:grid-cols-2 gap-4.5 sm:gap-5 lg:gap-5.5 xl:gap-6 2xl:gap-7 shrink-0"
        >
          {PROBLEM_CARDS.map((card) => (
            <div
              key={card.id}
              className={`group relative rounded-2xl xl:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ease-out border border-white/60 hover:border-emerald-400/80 h-64 sm:h-72 md:h-80 lg:h-72 xl:h-[340px] 2xl:h-[390px] flex flex-col justify-between p-4 sm:p-5 xl:p-6 ${card.tiltClass} ${card.offsetClass} hover:rotate-0 hover:scale-[1.03] hover:z-20`}
              style={{
                backgroundImage: `url(${card.imageSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Darkened overlay ensuring sharp contrast and readability */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/55 to-slate-950/30 group-hover:from-slate-950/95 group-hover:via-slate-950/65 transition-colors duration-300 pointer-events-none"
              />

              {/* Top Tag Pill */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-200 bg-slate-950/70 border border-emerald-400/40 backdrop-blur-md">
                  {card.tag}
                </span>
              </div>

              {/* Bottom Information */}
              <div className="relative z-10 text-left">
                <h3 className="text-sm sm:text-base xl:text-lg font-bold text-white tracking-tight drop-shadow-sm group-hover:text-emerald-300 transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs xl:text-sm text-slate-200/90 line-clamp-3 mt-1.5 leading-relaxed font-normal drop-shadow-sm">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
