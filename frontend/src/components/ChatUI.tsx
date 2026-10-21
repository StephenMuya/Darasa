'use client';

/**
 * ChatUI.tsx
 *
 * Dedicated CBC Intelligence Workspace.
 * Sits directly on the section without an artificial window container.
 * Default state: Vertically and horizontally centered with the 3D luminous orb,
 * greeting typography, and interactive prompt card.
 * Active state: Seamless conversation stream with instant KICD pedagogical guidance.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatHeader from './chat/ChatHeader';
import ChatMessageList from './chat/ChatMessageList';
import ChatPromptCard from './chat/ChatPromptCard';
import { CBCInquiryService } from '../services/cbcInquiryService';
import { SOMA_THEME_VARS } from '../theme/tokens';
import type {
  ChatUIProps,
  Message,
  PillMode,
  RubricTier,
} from './chat/chatTypes';
import { nextMsgId } from './chat/chatTypes';
import './hero/heroAnimations.css';

export default function ChatUI({ initialPrompt = '', onBack }: ChatUIProps) {
  // Default state: empty messages array before any conversation is initiated
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState(initialPrompt);
  const [activeMode, setActiveMode] = useState<PillMode | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedRubricId, setCopiedRubricId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  const handlePillClick = (mode: PillMode, prompt: string) => {
    setActiveMode(mode);
    setInputValue(prompt);
  };

  const handleCopyRubric = (msgId: string, rubric: RubricTier) => {
    const textToCopy = [
      `Official CBC 4-Tier Rubric: ${rubric.strand}`,
      `• EE 4: ${rubric.ee}`,
      `• ME 3: ${rubric.me}`,
      `• AE 2: ${rubric.ae}`,
      `• BE 1: ${rubric.be}`,
    ].join('\n');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(textToCopy).catch(() => {});
      }
    } catch {
      // Ignore clipboard write failures in test or unsupported environments
    }

    setCopiedRubricId(msgId);
    setTimeout(() => setCopiedRubricId(null), 2000);
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = (customText ?? inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: nextMsgId(),
      sender: 'user',
      senderName: 'You (Educator)',
      timestamp: 'Just now',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setActiveMode(null);
    setIsThinking(true);

    setTimeout(() => {
      const inquiryResult = CBCInquiryService.generateResponse(query);

      const aiMsg: Message = {
        id: nextMsgId(),
        sender: 'darasa',
        senderName: 'Darasa CBC Assistant',
        timestamp: 'Just now',
        text: inquiryResult.text,
        materials: inquiryResult.materials,
        rubric: inquiryResult.rubric,
        followUps: inquiryResult.followUps,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 400);
  };

  const handleResetToDefault = () => {
    setMessages([]);
    setInputValue('');
    setActiveMode(null);
  };

  return (
    <div
      id="chat-ui-workspace"
      className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#F5FAF7] via-[#EAF3EE] to-[#DCEDE2] text-slate-900 transition-colors"
      style={SOMA_THEME_VARS}
    >
      {/* ── Ambient Radial Orbs matching Hero section ── */}
      <div
        aria-hidden="true"
        className="ambient-right-amber-glow absolute top-10 right-0 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] rounded-full pointer-events-none select-none z-0 opacity-55"
        style={{
          filter: 'blur(90px)',
          background:
            'radial-gradient(circle at 60% 40%, rgba(252,210,140,0.55) 0%, rgba(238,155,46,0.25) 40%, rgba(252,233,200,0.10) 70%, transparent 100%)',
          transform: 'translateZ(0)',
        }}
      />
      <div
        aria-hidden="true"
        className="ambient-bottom-left-orb absolute bottom-0 left-0 w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] rounded-full pointer-events-none select-none z-0 opacity-55"
        style={{
          filter: 'blur(85px)',
          background:
            'radial-gradient(circle at 30% 70%, rgba(52,211,153,0.50) 0%, rgba(110,231,183,0.35) 28%, rgba(252,215,160,0.20) 55%, transparent 80%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* ── Top Navigation Header (Only Brand Logo Mark, Wordmark & Attached Info) ── */}
      <ChatHeader onBack={onBack} />

      {/* ── Main Canvas (Sits directly on the section without nested window box) ── */}
      <main
        aria-label="Darasa AI Conversation Workspace"
        className="relative z-20 flex-1 min-h-0 w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-5 flex flex-col justify-between overflow-hidden"
      >
        {messages.length > 0 ? (
          /* Active Conversation Stream */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Conversation reset control in active view */}
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/60 hover:bg-white/90 border border-white/80 shadow-2xs transition-all cursor-pointer"
              >
                <span>+ New Conversation</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-4 text-left">
              <ChatMessageList
                messages={messages}
                isThinking={isThinking}
                copiedRubricId={copiedRubricId}
                onCopyRubric={handleCopyRubric}
                onSelectFollowUp={(prompt) => handleSendMessage(undefined, prompt)}
                messagesEndRef={messagesEndRef}
              />
            </div>

            {/* Bottom Input Area */}
            <div className="pt-2 sm:pt-3">
              <ChatPromptCard
                inputValue={inputValue}
                onInputChange={setInputValue}
                activeMode={activeMode}
                onPillClick={handlePillClick}
                onSubmit={handleSendMessage}
              />
            </div>
          </div>
        ) : (
          /* ── Default Centered State: Orb + Typography + Input Elements ── */
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto px-2 sm:px-4">
            {/* 3D Luminous Orb */}
            <div className="relative flex items-center justify-center mb-3 sm:mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full luminous-3d-orb shadow-xl" />
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-45 pointer-events-none animate-fade-in-out"
                style={{ background: 'radial-gradient(circle, #93C5FD 0%, #A7F3D0 100%)' }}
              />
            </div>

            {/* Centered Heading Texts */}
            <div className="space-y-0.5 sm:space-y-1 mb-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
                Good Morning, Judha
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-800 font-['Outfit']">
                How Can I{' '}
                <span
                  style={{ color: 'var(--soma-accent)' }}
                  className="underline decoration-emerald-500/30 underline-offset-4"
                >
                  Assist You Today?
                </span>
              </p>
            </div>

            {/* Descriptive Inquire Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-5 sm:mb-6 leading-relaxed">
              Inquire on CBC schemes, formative rubrics, or practical lesson activities using local materials.
            </p>

            {/* Centered Master Input Launcher Card */}
            <div className="w-full max-w-3xl mx-auto">
              <ChatPromptCard
                inputValue={inputValue}
                onInputChange={setInputValue}
                activeMode={activeMode}
                onPillClick={handlePillClick}
                onSubmit={handleSendMessage}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
