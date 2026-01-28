
import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';

interface UIProps {
  onARClick: () => void;
  onContactClick: () => void;
  onLiveAgentClick: () => void;
  on3DAgentClick: () => void;
  onPortfolioClick: () => void;
}

export const UI: React.FC<UIProps> = ({ onARClick, onContactClick, onLiveAgentClick, on3DAgentClick, onPortfolioClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);

    if (newState) {
      gsap.to(".side-menu", { x: 0, opacity: 1, duration: 0.8, ease: "expo.out" });
      gsap.fromTo(".menu-item",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );
      gsap.fromTo(".nav-icon-img",
        { opacity: 0, scale: 0.5, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "back.out(1.5)", delay: 0.4, stagger: 0.1 }
      );
    } else {
      gsap.to(".side-menu", { x: "100%", opacity: 0, duration: 0.6, ease: "expo.in" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-end items-center z-[130] pointer-events-none">
        <button
          onClick={toggleMenu}
          className="pointer-events-auto group focus:outline-none w-12 h-12 flex flex-col items-end justify-center gap-[6px]"
        >
          <div className={`h-[1px] bg-white transition-all duration-700 ease-expo origin-center ${isMenuOpen ? 'w-8 rotate-45 translate-y-[7px]' : 'w-8 group-hover:w-10'}`} />
          <div className={`h-[1px] bg-white/50 transition-all duration-500 ease-out ${isMenuOpen ? 'w-0 opacity-0' : 'w-4 group-hover:w-6'}`} />
          <div className={`h-[1px] bg-white transition-all duration-700 ease-expo origin-center ${isMenuOpen ? 'w-8 -rotate-45 -translate-y-[7px]' : 'w-6 group-hover:w-8'}`} />
        </button>
      </header>

      <div ref={menuRef} className={`side-menu fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#050505]/95 backdrop-blur-3xl z-[120] border-l border-white/5 shadow-2xl translate-x-full opacity-0 flex flex-col justify-center px-8 md:px-16 pointer-events-auto`}>
        <div className="space-y-12 flex flex-col">

          <div className="menu-item opacity-0">
            <span className="text-[8px] font-mono text-white/10 tracking-[0.8em] uppercase block mb-8">01 // NEURAL_LINK</span>
            <button onClick={() => { onLiveAgentClick(); toggleMenu(); }} className="group flex items-center gap-8 text-left w-full">
              <div className="w-16 h-16 flex items-center justify-center relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#6366f1]/5 rounded-lg group-hover:bg-[#6366f1]/10" />
                <img src="https://i.postimg.cc/jdG5G53m/freepik-icono-robot-humanoide-estilizado-proporciones-huma-14430-removebg-preview.png" alt="AI" className="nav-icon-img relative z-10 w-12 h-12 object-contain" />
              </div>
              <span className="text-2xl font-syncopate font-bold text-white group-hover:text-[#6366f1] leading-none">INICIAR YEIYA</span>
            </button>
          </div>

          <div className="menu-item opacity-0">
            <span className="text-[8px] font-mono text-white/10 tracking-[0.8em] uppercase block mb-8">02 // DIRECT_UPLINK</span>
            <button onClick={() => { onContactClick(); toggleMenu(); }} className="group flex items-center gap-8 text-left w-full">
              <div className="w-16 h-16 flex items-center justify-center relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#d946ef]/5 rounded-lg group-hover:bg-[#d946ef]/10" />
                <img src="https://i.postimg.cc/GmFyKG3q/freepik-icono-minimalista-contacto-en-svg-lneas-nen-morada-96830-removebg-preview.png" alt="Contact" className="nav-icon-img relative z-10 w-12 h-12 object-contain" />
              </div>
              <span className="text-2xl font-syncopate font-bold text-white group-hover:text-[#d946ef] leading-none">CONTACTO</span>
            </button>
          </div>

          <div className="menu-item opacity-0">
            <span className="text-[8px] font-mono text-white/10 tracking-[0.8em] uppercase block mb-8">03 // CREATIVE_SHOWCASE</span>
            <button onClick={() => { onPortfolioClick(); toggleMenu(); }} className="group flex items-center gap-8 text-left w-full">
              <div className="w-16 h-16 flex items-center justify-center relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#a855f7]/5 rounded-lg group-hover:bg-[#a855f7]/10" />
                <img src="https://i.postimg.cc/CKS21G6b/freepik-icon-de-realidad-aumentada-futurista-con-lneas-nen-89238-removebg-preview.png" alt="Portfolio" className="nav-icon-img relative z-10 w-12 h-12 object-contain" />
              </div>
              <span className="text-2xl font-syncopate font-bold text-white group-hover:text-[#a855f7] leading-none">PORTAFOLIO</span>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && <div onClick={toggleMenu} className="fixed inset-0 z-[115] bg-black/80 backdrop-blur-md" />}
      <style dangerouslySetInnerHTML={{ __html: `.ease-expo { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }` }} />
    </>
  );
};
