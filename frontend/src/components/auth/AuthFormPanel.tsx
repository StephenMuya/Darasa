'use client';

import React from 'react';
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ROLE_OPTIONS, type UserRole } from './authTypes';

interface AuthFormPanelProps {
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  submitted: boolean;
  setSubmitted: (submitted: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEnterChat?: (prompt?: string) => void;
  onBack: () => void;
  initialPrompt?: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

/**
 * AuthFormPanel
 *
 * Left panel of the unified authentication card.
 * Compact width with restructured flow:
 * 1. Mode switcher (Create Account / Log In)
 * 2. Role picker
 * 3. Primary Email & Password form fields (FIRST)
 * 4. Submit button with backend integration & loading states
 * 5. Secondary auth alternatives (Google, NEMIS, Guest access) (SECOND)
 */
export default function AuthFormPanel({
  mode,
  setMode,
  role,
  setRole,
  showPassword,
  setShowPassword,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  submitted,
  setSubmitted,
  onSubmit,
  onEnterChat,
  onBack,
  initialPrompt,
  isSubmitting = false,
  errorMessage = null,
}: AuthFormPanelProps) {
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto text-left">
      {/* Mode Switch Tabs (Create Account / Log In) */}
      <div className="flex rounded-full bg-slate-200/60 p-1 mb-5 border border-white/60">
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setSubmitted(false);
          }}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
            mode === 'signup'
              ? 'bg-white text-slate-900 shadow-sm border border-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setSubmitted(false);
          }}
          className={`flex-1 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
            mode === 'login'
              ? 'bg-white text-slate-900 shadow-sm border border-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Log In
        </button>
      </div>

      {/* Header Info */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Libre_Baskerville',Georgia,serif]">
          {mode === 'signup' ? 'Get Started with Darasa' : 'Welcome Back'}
        </h1>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          {mode === 'signup'
            ? 'Unlock instant CBC schemes, rubrics, and household practicals.'
            : 'Enter your credentials to continue your lesson designs.'}
        </p>
      </div>

      {/* Role Selector Pills */}
      <div className="mb-4 text-left">
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Select Your Role
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {ROLE_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                role === id
                  ? 'bg-[#1F7A4D]/15 border-[#1F7A4D] text-[#144D2E] shadow-2xs font-bold'
                  : 'bg-white/60 border-white/80 text-slate-700 hover:bg-white hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in-out"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. PRIMARY LOGIN / SIGNUP FIELDS COME FIRST */}
      {submitted ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-center space-y-2 animate-fade-in-out my-3">
          <CheckCircle2 className="w-7 h-7 text-[#1F7A4D] mx-auto" />
          <h4 className="font-bold text-sm">Account Initialized</h4>
          <p className="text-xs text-slate-700">
            Welcome to Darasa! Redirecting to your CBC workspace...
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-1 text-xs font-bold text-[#1F7A4D] underline underline-offset-2 cursor-pointer"
          >
            Return to Landing Page
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Wanjiku"
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-white/90 border border-[#1F7A4D]/25 focus:border-[#1F7A4D] focus:ring-2 focus:ring-[#1F7A4D]/20 outline-none transition-all placeholder-slate-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mwalimu@school.ac.ke"
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-white/90 border border-[#1F7A4D]/25 focus:border-[#1F7A4D] focus:ring-2 focus:ring-[#1F7A4D]/20 outline-none transition-all placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">Password</label>
              {mode === 'login' && (
                <a href="#forgot" className="text-[10px] font-medium text-[#1F7A4D] hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-white/90 border border-[#1F7A4D]/25 focus:border-[#1F7A4D] focus:ring-2 focus:ring-[#1F7A4D]/20 outline-none transition-all placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label={mode === 'signup' ? 'Create Free Account' : 'Sign in to Darasa'}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1F7A4D] hover:bg-[#18633E] disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-0 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-1 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{mode === 'signup' ? 'Creating Account...' : 'Signing in...'}</span>
              </span>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* 2. SECONDARY AUTH OPTIONS COME SECOND */}
      <div className="relative flex items-center justify-center my-4">
        <div className="w-full border-t border-[#1F7A4D]/15" />
        <span className="absolute bg-[#F3F9F5] px-2.5 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Or continue with
        </span>
      </div>

      <div className="space-y-2">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => (onEnterChat ? onEnterChat(initialPrompt) : setSubmitted(true))}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* NEMIS / School Portal Button */}
        <button
          type="button"
          onClick={() => (onEnterChat ? onEnterChat(initialPrompt) : setSubmitted(true))}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/70 hover:bg-white border border-[#1F7A4D]/25 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D]" />
          <span>School / NEMIS Portal Login</span>
        </button>

        {/* Direct Guest Testing Option */}
        <button
          type="button"
          onClick={() => (onEnterChat ? onEnterChat(initialPrompt) : onBack())}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-[#1F7A4D]/20 text-[#144D2E] text-xs font-bold transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EE9B2E]" />
          <span>Enter Chat Directly (No credentials needed) →</span>
        </button>
      </div>

      {/* Toggle Footer Text */}
      <div className="mt-4 pt-3 border-t border-[#1F7A4D]/15 text-center text-xs text-slate-600">
        {mode === 'signup' ? (
          <span>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setSubmitted(false);
              }}
              className="font-bold text-[#144D2E] hover:underline cursor-pointer"
            >
              Log In
            </button>
          </span>
        ) : (
          <span>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSubmitted(false);
              }}
              className="font-bold text-[#144D2E] hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </span>
        )}
      </div>
    </div>
  );
}