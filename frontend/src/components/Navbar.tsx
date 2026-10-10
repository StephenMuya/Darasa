import React, { useState } from 'react';
import { Sparkles, BookOpen, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-500/10 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-[#0B0F19]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                  Soma<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> CBC Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Kenya Competency-Based Curriculum AI</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#teachers" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span>Teachers</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded text-slate-400 border border-slate-700">Plans</span>
            </a>
            <a href="#students" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span>Students</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded text-slate-400 border border-slate-700">Tutor</span>
            </a>
            <a href="#parents" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span>Parents</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded text-slate-400 border border-slate-700">Guides</span>
            </a>
            <a href="#curriculum" className="hover:text-emerald-400 transition-colors">
              KICD Strands
            </a>
            <a href="#rag-engine" className="hover:text-emerald-400 transition-colors">
              RAG Architecture
            </a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </button>
            <a
              href="#interactive-demo"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
            <a
              href="#teachers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-emerald-400 rounded-lg hover:bg-slate-800/50"
            >
              For Teachers (Lesson Plans & Rubrics)
            </a>
            <a
              href="#students"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-emerald-400 rounded-lg hover:bg-slate-800/50"
            >
              For Students (Socratic CBC Tutor)
            </a>
            <a
              href="#parents"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-emerald-400 rounded-lg hover:bg-slate-800/50"
            >
              For Parents (Assessment Support)
            </a>
            <a
              href="#interactive-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600"
            >
              Launch Interactive Demo
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};
