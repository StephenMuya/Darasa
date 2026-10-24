import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Database, 
  GraduationCap, 
  BookOpen, 
  HeartHandshake, 
  FileText, 
  Copy,
  Check
} from 'lucide-react';
import { DEMO_DATA, type Persona } from './interactiveDemoData';

export const InteractiveDemo: React.FC = () => {
  const [activePersona, setActivePersona] = useState<Persona>('teacher');
  const [copied, setCopied] = useState(false);

  const current = DEMO_DATA[activePersona];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="interactive-demo" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-12">
      {/* Container Frame */}
      <div className="relative rounded-2xl p-1 bg-gradient-to-b from-emerald-500/30 via-slate-700/20 to-slate-800/40 shadow-2xl shadow-emerald-950/40">
        <div className="rounded-[15px] bg-[#0d1424] p-4 sm:p-6 lg:p-8 backdrop-blur-2xl">
          
          {/* Top Persona Toggle Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                  Live Interactive RAG Simulation
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Experience SomaAI for Every CBC Stakeholder
              </h3>
            </div>

            {/* Persona Switch Buttons */}
            <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setActivePersona('teacher')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activePersona === 'teacher'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Teachers</span>
              </button>

              <button
                onClick={() => setActivePersona('student')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activePersona === 'student'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Students</span>
              </button>

              <button
                onClick={() => setActivePersona('parent')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activePersona === 'parent'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Parents</span>
              </button>
            </div>
          </div>

          {/* Prompt Query Bar */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                Target CBC Learning Domain: <span className="text-emerald-400">{current.category}</span>
              </span>
              <span className="font-mono text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                {current.sourceConfidence}
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={current.prompt}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3.5 pl-4 pr-24 text-xs sm:text-sm text-slate-100 font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
              />
              <button 
                className="absolute right-2 px-4 py-2 bg-emerald-500/90 hover:bg-emerald-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Simulate prompt generation"
              >
                <span>Query</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick preset pills */}
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="text-slate-400">Curriculum Presets:</span>
              {current.suggestedPrompts.map((preset, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 cursor-pointer border border-slate-700 transition-colors"
                >
                  {preset}
                </span>
              ))}
            </div>
          </div>

          {/* RAG Context Retrieval & Response Card */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Metadata Pane (RAG Grounding) */}
            <div className="lg:col-span-4 bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400 font-semibold block">
                  Grounding & Citation
                </span>
                <p className="text-xs text-slate-300 mt-1 flex items-start gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{current.sourceDoc}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold block">
                  Curriculum Taxonomy
                </span>
                <div className="mt-1 space-y-1 text-xs">
                  <div className="text-slate-300">
                    <span className="text-slate-400">Strand:</span> {current.strand}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Sub-strand:</span> {current.subStrand}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold block mb-1.5">
                  Core Competencies Targeted
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {current.competencies.map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero hallucinations: Vector embeddings mapped directly to approved KICD syllabus.</span>
              </div>
            </div>

            {/* Right Generated Response Content */}
            <div className="lg:col-span-8 bg-slate-900/80 rounded-xl p-5 border border-emerald-500/20 relative shadow-lg">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">
                    {current.responseTitle}
                  </h4>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dynamic Body Content */}
              <div className="max-h-[380px] overflow-y-auto pr-1">
                {current.responseBody}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
