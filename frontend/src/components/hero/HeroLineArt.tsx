'use client';

/**
 * HeroLineArt
 * Single responsibility: Bottom panoramic line-art illustration strip.
 * Contains the six scenes (teacher & class, students at desk, tablet exploration,
 * parent with backpack, parent & child laptop, graduating students)
 * plus the decorative learning contours and baseline gradient.
 * Purely presentational — data-driven, declarative, and accessible.
 */

interface LineArtScene {
  id: string;
  src: string;
  alt: string;
}

const LINE_ART_SCENES: LineArtScene[] = [
  {
    id: 'teacher-learners',
    src: '/images/teacher-learners-class.png',
    alt: 'Teacher guiding young CBC learners listening attentively with books',
  },
  {
    id: 'students-desk',
    src: '/images/students-desk.png',
    alt: 'Three CBC uniform students studying around table with textbook, notebook and tablet',
  },
  {
    id: 'teacher-student-tablet',
    src: '/images/teacher-student-tablet.png',
    alt: 'Teacher and learner exploring interactive digital lesson on tablet',
  },
  {
    id: 'parent-learner-backpack',
    src: '/images/parent-learner-backpack.png',
    alt: 'Mother encouraging learner with school backpack',
  },
  {
    id: 'parent-child',
    src: '/images/parent-child.png',
    alt: 'Mother and daughter working together on laptop',
  },
  {
    id: 'graduates',
    src: '/images/graduates.png',
    alt: 'Graduating CBC students celebrating with mortarboards and scrolls',
  },
];

export default function HeroLineArt() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden select-none pointer-events-none mt-auto pt-1 sm:pt-2"
    >
      {/* Seamless top divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1F7A4D]/20 to-transparent mb-1 sm:mb-2" />

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

      {/* Main artwork row – 6 continuous line-art scenes occupying almost the entire screen width */}
      <div className="w-full max-w-[99vw] 2xl:max-w-[1920px] mx-auto px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 flex flex-row items-end justify-between gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 pb-0 relative z-10">
        {LINE_ART_SCENES.map((scene) => (
          <div key={scene.id} className="flex-1 min-w-0 flex justify-center items-end max-w-[16.5%]">
            <img
              src={scene.src}
              alt={scene.alt}
              decoding="async"
              className="w-full max-h-32 sm:max-h-44 md:max-h-52 lg:max-h-60 xl:max-h-72 2xl:max-h-80 object-contain object-bottom transition-all duration-300"
            />
          </div>
        ))}
      </div>

      {/* Ground baseline blending mask (seamless transition into following section) */}
      <div className="relative w-full">
        <div className="absolute -top-3 left-0 right-0 h-3 bg-gradient-to-t from-[#DCEDE2]/70 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
