
import React from 'react';

export const SectorScene: React.FC = () => {
  return (
    <div className="scene-sectors absolute inset-0 z-[42] opacity-0 flex items-center overflow-hidden bg-[#050505]">
      
      {/* Texto cinético de fondo */}
      <div className="sectors-bg-text absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="text-[45vw] font-syncopate font-bold text-white/[0.01] leading-none select-none translate-y-10">
          CORE
        </div>
      </div>

      <div className="relative w-full h-full flex flex-col justify-center">
        
        {/* Cabecera Principal */}
        <div className="px-6 md:px-20 mb-8 md:mb-16 relative z-10 w-full max-w-4xl">
          <div className="overflow-hidden">
            <h2 className="sectors-title text-[10vw] md:text-[6vw] font-syncopate font-bold leading-[0.9] md:leading-[0.8] tracking-tighter text-white uppercase italic">
              Major <br /> 
              <span className="text-white/10 ml-[5vw] md:ml-[5vw]">Interventions.</span>
            </h2>
          </div>
          <div className="sectors-desc mt-4 md:mt-6 ml-[2vw]">
            <p className="text-xs md:text-base text-white/40 font-light leading-relaxed tracking-widest uppercase max-w-md flex items-center gap-2">
              <span className="md:hidden">←</span> Desliza para explorar <span className="md:hidden">→</span>
            </p>
          </div>
        </div>

        {/* TRACK HORIZONTAL DE INTERVENCIONES */}
        <div className="sectors-track flex gap-4 md:gap-12 px-6 md:px-20 w-max relative z-20 items-start">
          
          {/* 01: RETAIL NEXUS (Antes 02) */}
          <div className="sector-item min-w-[72vw] md:min-w-[30vw] flex flex-col gap-4 md:gap-6 group">
            <div className="relative w-full aspect-[3/4] md:aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                alt="Retail Nexus" 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-[9px] md:text-[10px] font-mono bg-black/50 backdrop-blur px-2 py-1 border border-white/20">01</div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-xl md:text-3xl font-syncopate font-bold text-white tracking-tighter">RETAIL NEXUS</h3>
              <p className="text-[10px] md:text-xs text-white/40 leading-relaxed uppercase tracking-[0.15em]">
                Interfaces para superficies comerciales.
              </p>
            </div>
          </div>

          {/* 02: BIO-SPACE (Antes 03) */}
          <div className="sector-item min-w-[72vw] md:min-w-[30vw] flex flex-col gap-4 md:gap-6 group md:mt-12">
            <div className="relative w-full aspect-[3/4] md:aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1518005020453-eb5453e1dfec?auto=format&fit=crop&q=80&w=1000" 
                alt="Bio Space" 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-[9px] md:text-[10px] font-mono bg-black/50 backdrop-blur px-2 py-1 border border-white/20">02</div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-xl md:text-3xl font-syncopate font-bold text-white tracking-tighter">BIO-SPACE</h3>
              <p className="text-[10px] md:text-xs text-white/40 leading-relaxed uppercase tracking-[0.15em]">
                Monitorización ambiental mediante AR.
              </p>
            </div>
          </div>

          {/* 03: DATA ARCHITECTURE (Antes 04) */}
          <div className="sector-item min-w-[72vw] md:min-w-[30vw] flex flex-col gap-4 md:gap-6 group mr-10 md:mr-20">
            <div className="relative w-full aspect-[3/4] md:aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                alt="Data Architecture" 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-[9px] md:text-[10px] font-mono bg-black/50 backdrop-blur px-2 py-1 border border-white/20">03</div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-xl md:text-3xl font-syncopate font-bold text-white tracking-tighter">DATA ARCH</h3>
              <p className="text-[10px] md:text-xs text-white/40 leading-relaxed uppercase tracking-[0.15em]">
                Infraestructura invisible de datos.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Líneas decorativas */}
      <div className="absolute top-0 left-[8%] w-px h-full bg-white/5" />
      <div className="absolute top-0 right-[8%] w-px h-full bg-white/5" />
    </div>
  );
};
