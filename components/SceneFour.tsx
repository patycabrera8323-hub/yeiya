
import React from 'react';

interface SceneFourProps {
  onContact: () => void;
}

export const SceneFour: React.FC<SceneFourProps> = ({ onContact }) => {
  return (
    <div className="scene-four absolute inset-0 z-50 flex items-center justify-center overflow-hidden opacity-0">
      
      {/* Fondo: Imagen de arquitectura Estática y Profunda */}
      <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://res.cloudinary.com/dztibxp9k/image/upload/f_auto,q_auto/v1767593507/smart-urbanism_duxbgq.webp" 
            alt="Nexus Background" 
            className="w-full h-full object-cover opacity-[0.3] saturate-[0.8] contrast-110 brightness-[0.6]"
          />
        </div>
        
        {/* Degradado para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20"></div>
      </div>

      <div className="relative z-30 container mx-auto px-6 md:px-20 py-10 md:py-0 pointer-events-auto overflow-y-auto md:overflow-visible max-h-screen md:max-h-none">
        {/* Rejilla con GAP aumentado de gap-8 a gap-16/20 y max-width ampliado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 items-stretch max-w-7xl mx-auto">
          
          {/* Card 1: VISIÓN (DORADO) */}
          <div 
            className="scene-four-card opacity-0 group relative overflow-hidden bg-white/[0.03] p-8 md:p-12 border border-white/10 backdrop-blur-xl rounded-[2.5rem] flex flex-col justify-between min-h-[350px] md:min-h-[520px] transition-all duration-700 hover:border-[#fbbf24]/50 hover:shadow-[0_0_40px_rgba(251,191,36,0.15)]"
          >
            {/* Barrido de luz dorada */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10" />

            <div className="absolute inset-0 z-0 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000">
                <img 
                    src="https://res.cloudinary.com/dztibxp9k/image/upload/f_auto,q_auto/v1767596765/ra3_p2ouwk.webp" 
                    alt="Vision Portal" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
            </div>
            
            <div className="relative z-20">
              <div className="w-8 h-[1px] bg-[#fbbf24] mb-8 group-hover:w-16 transition-all duration-500" />
              <h4 className="text-3xl md:text-5xl font-syncopate mb-6 tracking-[0.2em] text-white uppercase group-hover:text-[#fbbf24] transition-colors leading-tight">VISIÓN</h4>
              <p className="text-base md:text-xl text-white/50 leading-relaxed font-light group-hover:text-white/80 transition-colors">Anticipamos las necesidades del mañana proyectando soluciones que hoy parecen inaprensibles.</p>
            </div>
            
            <div className="mt-8 text-[11px] md:text-xs font-mono text-[#fbbf24] tracking-[0.4em] uppercase font-bold relative z-20">
               01 // PROSPECTIVA
            </div>
          </div>

          {/* Card 2: RAZÓN (PÚRPURA) */}
          <div 
            className="scene-four-card opacity-0 group relative overflow-hidden bg-white/[0.03] p-8 md:p-12 border border-white/10 backdrop-blur-xl rounded-[2.5rem] flex flex-col justify-between min-h-[350px] md:min-h-[520px] transition-all duration-700 hover:border-[#a855f7]/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)]"
          >
            {/* Barrido de luz púrpura */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a855f7]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10" />

            <div className="absolute inset-0 z-0 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-1000">
                <img 
                    src="https://res.cloudinary.com/dztibxp9k/image/upload/f_auto,q_auto/v1767597149/ar-cdmx-1767067401075_iwz7xz.webp" 
                    alt="Reason Portal" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
            </div>

            <div className="relative z-20">
              <div className="w-8 h-[1px] bg-[#a855f7] mb-8 group-hover:w-16 transition-all duration-500" />
              <h4 className="text-3xl md:text-5xl font-syncopate mb-6 tracking-[0.2em] text-[#a855f7] uppercase leading-tight">RAZÓN</h4>
              <p className="text-base md:text-xl text-white/70 leading-relaxed font-light">Lógica y creatividad fusionadas para crear interfaces que respiran e interactúan de forma orgánica.</p>
            </div>
            
            <div className="mt-8 text-[11px] md:text-xs font-mono text-[#a855f7] tracking-[0.4em] uppercase font-bold relative z-20">
               02 // ARQUITECTURA
            </div>
          </div>

          {/* Card 3: FLUJO (CYAN) */}
          <div 
            className="scene-four-card opacity-0 group relative overflow-hidden bg-white/[0.03] p-8 md:p-12 border border-white/10 backdrop-blur-xl rounded-[2.5rem] flex flex-col justify-between min-h-[350px] md:min-h-[520px] transition-all duration-700 hover:border-[#00f5ff]/50 hover:shadow-[0_0_40px_rgba(0,245,255,0.15)]"
          >
            {/* Barrido de luz cyan */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f5ff]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10" />

            <div className="absolute inset-0 z-0 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000">
                <img 
                    src="https://res.cloudinary.com/dztibxp9k/image/upload/f_auto,q_auto/v1767596764/mundo_urutgq.webp" 
                    alt="Flow Portal" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
            </div>

            <div className="relative z-20">
              <div className="w-8 h-[1px] bg-[#00f5ff] mb-8 group-hover:w-16 transition-all duration-500" />
              <h4 className="text-3xl md:text-5xl font-syncopate mb-6 tracking-[0.2em] text-white uppercase group-hover:text-[#00f5ff] transition-colors leading-tight">FLUJO</h4>
              <p className="text-base md:text-xl text-white/50 leading-relaxed font-light group-hover:text-white/80 transition-colors">Transiciones fluidas que eliminan la fricción entre el pensamiento humano y la acción inmediata.</p>
            </div>
            
            <div className="mt-8 text-[11px] md:text-xs font-mono text-[#00f5ff] tracking-[0.4em] uppercase font-bold relative z-20">
               03 // EXPERIENCIA
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
