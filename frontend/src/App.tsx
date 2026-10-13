import SomaHero from './components/SomaHero';
import ProblemStatement from './components/ProblemStatement';

export function App() {
  return (
    <div className="w-full h-screen h-[100dvh] overflow-y-auto overflow-x-hidden scroll-smooth">
      <div className="w-full h-screen">
        <SomaHero />
      </div>
      <div className="w-full min-h-screen">
        <ProblemStatement />
      </div>
    </div>
  );
}

export default App;
