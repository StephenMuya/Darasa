import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  HeartHandshake, 
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { InteractiveDemo } from './InteractiveDemo';
import { CurriculumBadges } from './CurriculumBadges';
import { StatsBanner } from './StatsBanner';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] radial-glow pointer-events-none -z-10 blur-3xl opacity-80" />
      <div className="absolute top-48 right-10 w-[450px] h-[450px] radial-glow-amber pointer-events-none -z-10 blur-3xl opacity-50" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 -z-20 opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14">
        
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-slate-200 text-xs sm:text-sm font-medium mb-8 shadow-lg shadow-emerald-500/10 hover:border-emerald-500/50 transition-all cursor-pointer group">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-400">SomaAI 2.0</span>
          <span className="text-slate-400">|</span>
          <span>Next-Gen RAG for Kenya Competency-Based Curriculum</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Unlocking the Full Potential of{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Kenya's CBC
          </span>{' '}
          with Intelligent RAG.
        </h1>

        {/* Subtitle / Value Proposition */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          The purpose-built educational intelligence platform for{' '}
          <span className="text-white font-medium underline decoration-emerald-500/50 decoration-2 underline-offset-4">teachers</span>,{' '}
          <span className="text-white font-medium underline decoration-teal-500/50 decoration-2 underline-offset-4">students</span>, and{' '}
          <span className="text-white font-medium underline decoration-amber-500/50 decoration-2 underline-offset-4">parents</span>. 
          Grounded directly on official KICD curriculum designs, strands, and 4-tier formative rubrics.
        </p>

        {/* Interactive Quick Search Bar Mockup */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center p-1.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-xl backdrop-blur-xl focus-within:border-emerald-500/70 transition-all">
            <Search className="w-5 h-5 text-emerald-400 ml-3 shrink-0" />
            <input
              type="text"
              readOnly
              value="e.g. Grade 7 Pre-Technical Studies: Tools safety lesson plan & rubrics"
              className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-300 px-3 focus:outline-none cursor-default"
            />
            <a
              href="#interactive-demo"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* CTA Button Group */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#interactive-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try Interactive CBC Demo</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#three-stakeholders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition-all"
          >
            <span>Learn How It Works</span>
          </a>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>KICD Curriculum Design Matched</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero Hallucinations (Vector Grounded)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>English & Kiswahili Ready</span>
          </div>
        </div>

        {/* Three Target Persona Cards Grid */}
        <div id="three-stakeholders" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Persona 1: Teachers */}
          <div id="teachers" className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/30">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wide">For Educators</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Lesson Plans</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Teachers & Facilitators
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Eliminate hours of manual paperwork. Generate lesson plans mapped to specific KICD strands, key inquiry questions, core competencies, and objective 4-level formative rubrics.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Strand & Sub-strand auto-tagging</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Formative assessment rubrics (Levels 1–4)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Community service learning integration</span>
              </div>
            </div>
          </div>

          {/* Persona 2: Students */}
          <div id="students" className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-teal-950/30">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase text-teal-400 font-semibold tracking-wide">For Learners</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">Socratic AI</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Junior & Primary Students
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              An AI tutor that asks guiding questions instead of spoon-feeding direct answers. Empowers learners to tackle practical tasks, STEM experiments, and creative portfolios.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Inquiry-based guided problem solving</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Locally available materials guide</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Encourages critical thinking & self-efficacy</span>
              </div>
            </div>
          </div>

          {/* Persona 3: Parents */}
          <div id="parents" className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/30">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wide">For Guardians</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Decoded</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Parents & Guardians
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Demystify CBC grading reports, understand what your child's teachers expect, and support evening home assignments constructively without doing the projects yourself.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Exceeding vs. Meeting expectations decoded</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Parent-Child collaborative activities</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Constructive link book communication</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Live Playground Centerpiece */}
      <InteractiveDemo />

      {/* 7 Core CBC Competencies Banner */}
      <CurriculumBadges />

      {/* Key Metric & Trust Banner */}
      <StatsBanner />

    </div>
  );
};
