interface DarasaLogoMarkProps {
  size?: string;
}

export default function DarasaLogoMark({ size = 'w-4 h-4' }: DarasaLogoMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${size} shrink-0`} fill="none" aria-hidden="true">
      <circle cx="45" cy="55" r="18.5" stroke="currentColor" strokeWidth="9" className="text-slate-900" />
      <rect x="64" y="22" width="9" height="56" rx="4.5" fill="#EE9B2E" />
    </svg>
  );
}
