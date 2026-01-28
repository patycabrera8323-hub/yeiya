
import React from 'react';

export const SceneThree: React.FC = () => {
  return (
    <div className="scene-three absolute inset-0 z-40 flex items-center justify-center overflow-hidden pointer-events-none">
      
      {/* Split Panels */}
      <div className="scene-three-split-left absolute left-0 top-0 w-1/2 h-full bg-[#111] will-change-transform flex items-center justify-end pr-10 border-r border-white/5">
         <div className="rotate-90 origin-right translate-x-12 whitespace-nowrap text-[6vh] md:text-[10vh] font-syncopate text-white/5 select-none uppercase">SISTEMAS</div>
      </div>
      
      <div className="scene-three-split-right absolute right-0 top-0 w-1/2 h-full bg-[#0d0d0d] will-change-transform flex items-center justify-start pl-10">
         <div className="-rotate-90 origin-left -translate-x-12 whitespace-nowrap text-[6vh] md:text-[10vh] font-syncopate text-white/5 select-none uppercase">LÓGICA</div>
      </div>

      <div className="scene-three-title relative z-50 text-center will-change-transform px-4 flex flex-col items-center justify-center">
        
        {/* Aura/Glow Background Container - ESTÁTICA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[250%] bg-[#3b82f6]/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen opacity-60" />

        {/* Title - AZUL ELÉCTRICO */}
        <h3 className="relative z-10 text-5xl md:text-7xl font-syncopate font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 via-[45%] to-[#3b82f6] drop-shadow-[0_0_35px_rgba(59,130,246,0.8)]">
          DUALIDAD
        </h3>
        <p className="relative z-10 mt-4 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-blue-200/80 italic drop-shadow-md">
          Fragmentación de lo Absoluto
        </p>
      </div>

    </div>
  );
};
