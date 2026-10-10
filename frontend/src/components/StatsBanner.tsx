import React from 'react';
import { ShieldCheck, Zap, BookMarked, Globe, CheckCircle } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const stats = [
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'KICD Aligned',
      detail: 'Official designs & learning areas',
      color: 'text-emerald-400'
    },
    {
      icon: Zap,
      value: '<1.2s',
      label: 'RAG Latency',
      detail: 'Ultra-fast semantic search',
      color: 'text-cyan-400'
    },
    {
      icon: BookMarked,
      value: 'PP1 — Grade 9',
      label: 'Curriculum Coverage',
      detail: 'Early Years, Primary & JSS',
      color: 'text-amber-400'
    },
    {
      icon: Globe,
      value: 'Bi-Lingual',
      label: 'English & Kiswahili',
      detail: 'Context-aware translation',
      color: 'text-teal-400'
    }
  ];

  return (
    <div className="w-full py-12 border-t border-slate-800/80 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col items-start p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className={`text-2xl lg:text-3xl font-extrabold ${stat.color} font-['Outfit']`}>
                    {stat.value}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {stat.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom verification badge */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/50 pt-6">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Formative Assessment 4-Level Rubrics
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Socratic Inquiry-Based Tutoring
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Parental Link Book Companion
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Low-Bandwidth Classroom Sync
          </span>
        </div>
      </div>
    </div>
  );
};
