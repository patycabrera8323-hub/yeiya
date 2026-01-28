
import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollSequence } from './hooks/useScrollSequence';
import { SceneOne } from './components/SceneOne';
import { SceneTwo } from './components/SceneTwo';
import { SceneThree } from './components/SceneThree';
import { ARSection } from './components/ARSection';
import { SceneFour } from './components/SceneFour';
import { GrainOverlay } from './components/GrainOverlay';
import { UI } from './components/UI';
import { ARView } from './components/ARView';
import { ContactView } from './components/ContactView';
import { LiveAgentAR } from './components/LiveAgentAR';
import { PortfolioView } from './components/PortfolioView';
import { Preloader } from './components/Preloader';

const App: React.FC = () => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'cinema' | 'ar'>('cinema');
  const [showContact, setShowContact] = useState(false);
  const [showLiveAgent, setShowLiveAgent] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleRefresh);
    return () => window.removeEventListener('resize', handleRefresh);
  }, []);

  useScrollSequence(triggerRef, view);

  const scrollToContact = () => {
    window.scrollTo({ top: ScrollTrigger.maxScroll(window), behavior: 'smooth' });
  };

  const enterARMode = () => {
    gsap.to(containerRef.current, {
      opacity: 0, filter: 'blur(20px)', duration: 0.8, onComplete: () => setView('ar')
    });
  };

  const exitARMode = () => {
    setView('cinema');
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, filter: 'blur(0px)', duration: 1 });
  };

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <div className={`relative w-full min-h-screen bg-[#0a0a0a] transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <GrainOverlay />
        {view === 'cinema' ? (
          <div ref={containerRef}>
            <UI
              onARClick={enterARMode}
              onContactClick={() => setShowContact(true)}
              onLiveAgentClick={() => { setShowLiveAgent(true); setTimeout(() => window.dispatchEvent(new CustomEvent('SWITCH_AGENT_MODE', { detail: 'hologram' })), 100); }}
              on3DAgentClick={() => { setShowLiveAgent(true); setTimeout(() => window.dispatchEvent(new CustomEvent('SWITCH_AGENT_MODE', { detail: '3d' })), 100); }}
              onPortfolioClick={() => setShowPortfolio(true)}
            />
            <div ref={triggerRef} className="relative w-full h-screen overflow-hidden">
              <div className="absolute inset-0">
                <SceneOne />
                <SceneTwo />
                <SceneThree />
                <ARSection />
                <SceneFour onContact={scrollToContact} />
              </div>
            </div>
            <div className="fixed bottom-0 left-0 h-1 bg-white/10 w-full z-[100]"><div id="progress-bar" className="h-full bg-white w-0" /></div>
            {showContact && <ContactView onClose={() => setShowContact(false)} />}
            {showLiveAgent && <LiveAgentAR onClose={() => setShowLiveAgent(false)} />}
            {showPortfolio && <PortfolioView onClose={() => setShowPortfolio(false)} />}
          </div>
        ) : (
          <ARView onClose={exitARMode} />
        )}
      </div>
    </>
  );
};

export default App;
