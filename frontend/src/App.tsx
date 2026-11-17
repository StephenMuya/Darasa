import SomaHero from './components/SomaHero';
import ProblemStatement from './components/ProblemStatement';
import PersonaFeatures from './components/PersonaFeatures';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Auth from './components/Auth';
import ChatUI from './components/ChatUI';
import { useNavigationRouter } from './hooks/useNavigationRouter';

export function App() {
  const {
    currentView,
    authMode,
    initialPrompt,
    openAuth,
    openChat,
    backToLanding,
  } = useNavigationRouter();

  if (currentView === 'chat') {
    return (
      <ChatUI
        initialPrompt={initialPrompt}
        onBack={backToLanding}
      />
    );
  }

  if (currentView === 'auth') {
    return (
      <Auth
        initialMode={authMode}
        initialPrompt={initialPrompt}
        onBack={backToLanding}
        onEnterChat={openChat}
      />
    );
  }

  return (
    <div className="w-full h-screen h-[100dvh] overflow-y-auto overflow-x-hidden scroll-smooth">
      <div className="w-full h-screen">
        <SomaHero onOpenAuth={openAuth} />
      </div>
      <div className="w-full min-h-screen">
        <ProblemStatement />
      </div>
      <div className="w-full min-h-screen">
        <PersonaFeatures onOpenAuth={openAuth} onEnterChat={openChat} />
      </div>
      <div className="w-full min-h-screen">
        <CallToAction onOpenAuth={openAuth} />
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}

export default App;
