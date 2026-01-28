
import React from 'react';

export const CompanyScene: React.FC = () => {
  return (
    <div className="scene-company absolute inset-0 z-[43] opacity-0 bg-[#fcfaff] text-[#1a1a2e] overflow-hidden flex items-center justify-center py-20">
      <div className="max-w-[1400px] w-full px-6 md:px-12 h-full flex flex-col justify-center">
        
        {/* Top Bar - Refined Indigo Edition Style */}
        <div className="company-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-[#6366f1] text-white text-[9px] font-bold rounded-full uppercase tracking-[0.1em] shadow-[0_4px_14px_rgba(99,102,241,0.4)]">
                V.02 Release
              </span>
              <span className="text-[10px] font-mono text-[#1a1a2e]/40 uppercase tracking-widest">Temporal Phase 2025</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-syncopate font-bold tracking-tighter leading-[0.85] company-reveal-title text-[#0f172a]">
              NUESTRA <br />MISIÓN.
            </h2>
          </div>
          <div className="max-w-md company-reveal-desc">
            <p className="text-lg md:text-xl text-[#475569] font-light leading-relaxed">
              Diseñamos el hardware invisible de la próxima década: una capa de inteligencia espacial que hace que el mundo sea infinitamente más interactivo.
            </p>
          </div>
        </div>

        {/* Bento Grid - Indigo & Quartz Aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full max-h-[60vh]">
          
          {/* Main Mission Card - Soft Indigo Fade */}
          <div className="company-card md:col-span-7 bg-white rounded-[2.5rem] p-10 flex flex-col justify-between border border-[#e2e8f0] hover:border-[#6366f1]/30 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.1)] transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <h4 className="text-[10px] font-syncopate font-bold mb-10 tracking-[0.2em] text-[#6366f1]">01 / FILOSOFÍA</h4>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6 text-[#1e293b]">
                Empoderar la percepción <br /> humana a través de AR.
              </h3>
              <p className="text-[#64748b] text-lg max-w-lg leading-relaxed">
                No buscamos reemplazar la realidad, sino iluminarla. Nuestra tecnología reduce la distancia entre la intención y el resultado físico.
              </p>
            </div>
            <div className="pt-8 relative z-10">
              <button className="group relative px-10 py-5 bg-[#0f172a] text-white rounded-2xl font-syncopate text-[9px] tracking-[0.2em] uppercase overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(15,23,42,0.3)] active:scale-95">
                <span className="relative z-10 group-hover:text-white">Descubre el Ecosistema</span>
                <div className="absolute inset-0 bg-[#6366f1] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
              </button>
            </div>
          </div>

          {/* Side Tech Card - Deep Obsidian Indigo */}
          <div className="company-card md:col-span-5 bg-[#0f172a] text-white rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative border border-white/5">
            <div className="absolute inset-0 opacity-20">
               <div className="w-full h-full bg-[radial-gradient(circle_at_50%_120%,#6366f1,transparent)]" />
            </div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-syncopate font-bold mb-10 tracking-[0.2em] text-white/30 uppercase">02 / MÉTRICAS DE IMPACTO</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Latencia Espacial</span>
                  <span className="text-2xl font-bold font-syncopate">1.2ms</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Precisión LiDAR</span>
                  <span className="text-2xl font-bold font-syncopate">99.98%</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Escala Global</span>
                  <span className="text-2xl font-bold font-syncopate">∞</span>
                </div>
              </div>
            </div>
            <div className="mt-10 flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#6366f1] rounded-full animate-ping" />
              </div>
              <span className="text-[9px] font-syncopate tracking-[0.3em] text-white/50 uppercase">Synch Status: Active</span>
            </div>
          </div>

          {/* Bottom Card - High Contrast Accent */}
          <div className="company-card md:col-span-12 bg-[#f1f5f9] rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white transition-all hover:bg-[#eef2ff]">
             <div className="flex-1 space-y-4">
                <h4 className="text-4xl font-bold tracking-tight italic text-[#1e293b]">Estética de la Claridad.</h4>
                <p className="text-[#64748b] max-w-xl font-light text-lg">
                  Inspirados por la precisión industrial, aplicamos un rigor matemático a cada interacción visual. SEARMO no es solo una herramienta, es un estándar de diseño.
                </p>
             </div>
             <div className="flex gap-6">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center justify-center border border-[#e2e8f0]">
                   <div className="w-10 h-[1px] bg-[#6366f1] rotate-45" />
                </div>
                <div className="w-24 h-24 bg-[#6366f1] rounded-3xl shadow-[0_20px_40px_rgba(99,102,241,0.3)] flex items-center justify-center rotate-12 group hover:rotate-0 transition-transform duration-500">
                   <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white]" />
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
