import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Database, 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  BookOpen, 
  HeartHandshake, 
  FileText, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

type Persona = 'teacher' | 'student' | 'parent';

interface DemoContent {
  prompt: string;
  category: string;
  suggestedPrompts: string[];
  sourceDoc: string;
  sourceConfidence: string;
  strand: string;
  subStrand: string;
  competencies: string[];
  responseTitle: string;
  responseBody: React.ReactNode;
}

export const InteractiveDemo: React.FC = () => {
  const [activePersona, setActivePersona] = useState<Persona>('teacher');
  const [copied, setCopied] = useState(false);

  const demoData: Record<Persona, DemoContent> = {
    teacher: {
      category: 'Junior Secondary (Grade 7) · Integrated Science',
      prompt: 'Generate an inquiry-based lesson plan for "Separation of Mixtures" with CBC formative assessment rubrics.',
      suggestedPrompts: [
        'Grade 7: Mixtures & Pure Substances',
        'Grade 4: Agriculture & Nutrition Soil Prep',
        'Grade 8: Pre-Technical Studies Safety Guide'
      ],
      sourceDoc: 'KICD JSS Integrated Science Curriculum Design (KLB/KICD 2024, pg 42)',
      sourceConfidence: '99.6% Semantic Alignment',
      strand: '1.0 Matter and Materials',
      subStrand: '1.2 Separation of Insoluble Solids from Liquids (Filtration & Decantation)',
      competencies: ['Critical Thinking', 'Collaboration', 'Digital Literacy'],
      responseTitle: 'Formative Lesson Plan & 4-Tier Assessment Rubric',
      responseBody: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
            <span className="font-semibold block mb-1">🎯 Specific Learning Outcome:</span>
            By the end of the lesson, the learner should be able to separate muddy water using sand filtration, record observations systematically, and appreciate safe water handling at home.
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Key Inquiry Question (KIQ):
            </h5>
            <p className="text-slate-300 italic pl-5">
              "How can we obtain clear water from turbid pond water using materials available around our community?"
            </p>
          </div>

          {/* 4-Tier Rubric Table */}
          <div>
            <h5 className="font-semibold text-white mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> CBC Formative Assessment Matrix:
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/60 text-slate-300">
                    <th className="p-2 font-medium">Exceeding (4)</th>
                    <th className="p-2 font-medium">Meeting (3)</th>
                    <th className="p-2 font-medium">Approaching (2)</th>
                    <th className="p-2 font-medium">Below (1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-400">
                  <tr>
                    <td className="p-2 text-emerald-300 bg-emerald-950/10 font-medium">
                      Accurately sets multi-stage filter and explains particle size physics clearly.
                    </td>
                    <td className="p-2 text-teal-300 bg-teal-950/10">
                      Successfully separates mixture into clean filtrate following instructions.
                    </td>
                    <td className="p-2 text-amber-300 bg-amber-950/10">
                      Requires partial teacher prompting to order filter media correctly.
                    </td>
                    <td className="p-2 text-red-300 bg-red-950/10">
                      Unable to set up filtration apparatus without continuous direction.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },

    student: {
      category: 'Upper Primary (Grade 6) · Agriculture & Technology',
      prompt: 'Help me design an eco-friendly drip irrigation model using recycled plastic bottles for my CBC homework project.',
      suggestedPrompts: [
        'Grade 6: Drip Irrigation Project',
        'Grade 5: Indigenous Vegetables preservation',
        'Grade 7: Simple Solar Cooker experiment'
      ],
      sourceDoc: 'KICD Agriculture Grade 6 Curriculum Design & Practical Guide (2024)',
      sourceConfidence: '98.9% Semantic Alignment',
      strand: '2.0 Crop Production Practices',
      subStrand: '2.3 Water Conservation in Small-Scale Farming',
      competencies: ['Creativity & Imagination', 'Problem Solving', 'Environmental Citizenship'],
      responseTitle: 'Socratic Guide: Building Your Low-Cost Irrigation System',
      responseBody: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/20 text-teal-200">
            <span className="font-semibold block mb-1">💡 Socratic Challenge:</span>
            Before starting, ask yourself: Why is giving plants a slow drip near the roots better than pouring a whole cup of water on the leaves during a hot day?
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-white">Recommended Materials (Locally Sourced):</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <li className="p-2 rounded bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                2L used water bottle (cleaned)
              </li>
              <li className="p-2 rounded bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Small safety pin or heated nail (with adult)
              </li>
              <li className="p-2 rounded bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Potted sukuma wiki or spinach seedling
              </li>
              <li className="p-2 rounded bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Twine or small wooden stick support
              </li>
            </ul>
          </div>

          <div className="p-2.5 rounded bg-slate-800/40 border border-slate-700 text-slate-300">
            <span className="text-amber-400 font-semibold">Your Learning Journal Entry:</span> Measure how long 500ml lasts with 1 pinhole vs 2 pinholes. Record in your CBC Portfolio!
          </div>
        </div>
      )
    },

    parent: {
      category: 'Parent Guidance · CBC Assessment Decoder',
      prompt: 'My Grade 4 child scored "Approaching Expectations" in Creative Arts. How do I help without doing the work myself?',
      suggestedPrompts: [
        'Decoding Grade 4 Creative Arts Report',
        'Supporting JSS Math Homework at Home',
        'Understanding CBC Rubric Scores 1 to 4'
      ],
      sourceDoc: 'KICD Parental Empowerment & Engagement Guidelines (CBC Framework)',
      sourceConfidence: '99.2% Semantic Alignment',
      strand: 'Family & Community Engagement',
      subStrand: 'Constructive Home-School Partnership',
      competencies: ['Communication', 'Self-Efficacy in Learners'],
      responseTitle: 'Parent Action Guide: Fostering Independence & Mastery',
      responseBody: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-amber-200">
            <span className="font-semibold block mb-1">📘 What "Approaching Expectations" (Level 2) Means:</span>
            Your child understands the concept basics, but requires some scaffolding or encouragement to complete the task independently. It is NOT a failure—it is an active growth stage!
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-white">3 Meaningful Actions for Parents:</p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700">
                <strong className="text-emerald-400">1. Ask Open Questions:</strong> Instead of drawing for them, ask: <em>"What story are you trying to tell with these colors?"</em>
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700">
                <strong className="text-emerald-400">2. Celebrate the Process, Not Perfection:</strong> CBC values effort, critical thinking, and trial-and-error over photo-perfect artwork.
              </div>
              <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700">
                <strong className="text-emerald-400">3. Write a Note in the CBC Link Book:</strong> Inform the teacher about the home practice you observed.
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const current = demoData[activePersona];

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
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
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
                className="absolute right-2 px-4 py-2 bg-emerald-500/90 hover:bg-emerald-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <h4 className="text-sm font-semibold text-white">
                    {current.responseTitle}
                  </h4>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
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
