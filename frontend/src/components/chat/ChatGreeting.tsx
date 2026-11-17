'use client';


export default function ChatGreeting() {
  return (
    <div className="py-2 sm:py-3 flex flex-col items-center justify-center text-center space-y-1.5 sm:space-y-2">
      <div className="relative flex items-center justify-center mb-0.5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full luminous-3d-orb shadow-lg" />
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40 pointer-events-none animate-fade-in-out"
          style={{ background: 'radial-gradient(circle, #93C5FD 0%, #A7F3D0 100%)' }}
        />
      </div>
      <div className="space-y-0.5">
        <h2 className="text-lg sm:text-xl lg:text-[1.65rem] font-bold text-slate-900 tracking-tight font-['Outfit']">
          Good Morning, Judha
        </h2>
        <p className="text-base sm:text-lg lg:text-[1.4rem] font-bold tracking-tight text-slate-800 font-['Outfit']">
          How Can I{' '}
          <span
            style={{ color: 'var(--soma-accent)' }}
            className="underline decoration-emerald-500/30 underline-offset-4"
          >
            Assist You Today?
          </span>
        </p>
      </div>
      <p className="text-[11px] sm:text-xs text-slate-600 max-w-md mx-auto">
        Inquire on CBC schemes, formative rubrics, or practical lesson activities using local materials.
      </p>
    </div>
  );
}
