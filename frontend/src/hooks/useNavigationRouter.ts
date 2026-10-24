import { useState, useEffect, useCallback } from 'react';

export type AppView = 'landing' | 'auth' | 'chat';
export type AuthMode = 'login' | 'signup';

export interface UseNavigationRouterReturn {
  currentView: AppView;
  authMode: AuthMode;
  initialPrompt: string;
  openAuth: (mode?: AuthMode, prompt?: string) => void;
  openChat: (prompt?: string) => void;
  backToLanding: () => void;
}

/**
 * useNavigationRouter
 *
 * Custom hook encapsulating client-side hash routing, browser history
 * synchronization, and view mode state across Landing, Auth, and Chat.
 */
export function useNavigationRouter(): UseNavigationRouterReturn {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [initialPrompt, setInitialPrompt] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#chat') {
        setCurrentView('chat');
      } else if (hash === '#login') {
        setAuthMode('login');
        setCurrentView('auth');
      } else if (hash === '#auth' || hash === '#signup') {
        setAuthMode('signup');
        setCurrentView('auth');
      } else if (hash === '' || hash === '#home') {
        setCurrentView('landing');
      }
    };

    // Evaluate initial route on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAuth = useCallback((mode: AuthMode = 'signup', prompt?: string) => {
    setAuthMode(mode);
    if (prompt) setInitialPrompt(prompt);
    setCurrentView('auth');
    window.location.hash = mode === 'login' ? '#login' : '#auth';
  }, []);

  const openChat = useCallback((prompt?: string) => {
    if (prompt) setInitialPrompt(prompt);
    setCurrentView('chat');
    window.location.hash = '#chat';
  }, []);

  const backToLanding = useCallback(() => {
    setCurrentView('landing');
    if (
      window.location.hash === '#auth' ||
      window.location.hash === '#login' ||
      window.location.hash === '#signup' ||
      window.location.hash === '#chat'
    ) {
      window.history.pushState(null, '', window.location.pathname);
    }
  }, []);

  return {
    currentView,
    authMode,
    initialPrompt,
    openAuth,
    openChat,
    backToLanding,
  };
}
