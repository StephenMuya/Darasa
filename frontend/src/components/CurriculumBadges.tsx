import React from 'react';
import { 
  BrainCircuit, 
  Users, 
  Lightbulb, 
  Globe2, 
  GraduationCap, 
  Sparkles, 
  Cpu
} from 'lucide-react';

interface Competency {
  name: string;
  swahili: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
}

const competencies: Competency[] = [
  {
    name: 'Critical Thinking & Problem Solving',
    swahili: 'Ufikiri wa Kina & Utatuzi',
    icon: BrainCircuit,
    color: 'text-amber-400 bg-amber-500/10',
    borderColor: 'border-amber-500/20'
  },
  {
    name: 'Communication & Collaboration',
    swahili: 'Mawasiliano & Ushirikiano',
    icon: Users,
    color: 'text-emerald-400 bg-emerald-500/10',
    borderColor: 'border-emerald-500/20'
  },
  {
    name: 'Imagination & Creativity',
    swahili: 'Ubunifu & Ndoto',
    icon: Lightbulb,
    color: 'text-pink-400 bg-pink-500/10',
    borderColor: 'border-pink-500/20'
  },
  {
    name: 'Digital Literacy',
    swahili: 'Ujuzi wa Kidijitali',
    icon: Cpu,
    color: 'text-cyan-400 bg-cyan-500/10',
    borderColor: 'border-cyan-500/20'
  },
  {
    name: 'Citizenship',
    swahili: 'Uraia Mwema',
    icon: Globe2,
    color: 'text-blue-400 bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    name: 'Self-Efficacy',
    swahili: 'Kujiamini & Uwezo',
    icon: Sparkles,
    color: 'text-purple-400 bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    name: 'Learning to Learn',
    swahili: 'Kujifunza Kujifunza',
    icon: GraduationCap,
    color: 'text-teal-400 bg-teal-500/10',
    borderColor: 'border-teal-500/20'
  }
];

export const CurriculumBadges: React.FC = () => {
  return (
    <div className="w-full py-8 border-y border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <p className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
                Official CBC Pillars · KICD Matrix
              </p>
            </div>
            <h4 className="text-sm font-medium text-slate-300">
              Integrated across all 7 CBC Core Competencies
            </h4>
          </div>
          <span className="text-xs text-slate-400 self-start md:self-auto">
            Early Years • Middle School • Junior Secondary School (JSS)
          </span>
        </div>

        {/* Competencies Horizontal Scroll / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 pt-2">
          {competencies.map((comp, idx) => {
            const Icon = comp.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center p-3 rounded-xl border ${comp.borderColor} bg-slate-900/70 hover:bg-slate-800/80 transition-all duration-300 group hover:-translate-y-1`}
              >
                <div className={`p-2.5 rounded-lg mb-2.5 ${comp.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200 leading-tight">
                  {comp.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono italic">
                  {comp.swahili}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
