
import React, { useEffect } from 'react';
import { gsap } from 'gsap';

interface DevelopmentsViewProps {
  onClose: () => void;
}

export const DevelopmentsView: React.FC<DevelopmentsViewProps> = ({ onClose }) => {
  useEffect(() => {
    gsap.fromTo(".dev-content", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 }
    );
  }, []);

  const developments = [
    {
      title: "Sistemas Core",
      desc: "Arquitectura backend de alta disponibilidad diseñada para procesar datos espaciales en tiempo real.",
      tag: "INFRAESTRUCTURA"
    },
    {
      title: "Interfaces Neuro",
      desc: "Diseño UX/UI que responde a la intención del usuario mediante análisis de flujo cognitivo.",
      tag: "DISEÑO"
    },
    {
      title: "Motores AR",
      desc: "Renderizado volumétrico optimizado para dispositivos móviles de última generación.",
      tag: "REALIDAD VIRTUAL"
    }
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-[#0a0a0a] text-white overflow-y-auto px-6 py-20 md:p-32 animate-[fadeIn_0.6s_ease-out]">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onClose}
          className="mb-12 text-[10px] font-syncopate tracking-[0.4em] text-white/40 hover:text-white transition-colors uppercase"
        >
          ← Regresar al inicio
        </button>

        <h2 className="dev-content text-5xl md:text-8xl font-syncopate font-bold tracking-tighter mb-12">
          LO QUE HEMOS <br /> <span className="text-white/20">DESARROLLADO.</span>
        </h2>

        <div className="grid gap-12 mt-20">
          {developments.map((dev, i) => (
            <div key={i} className="dev-content group border-t border-white/10 pt-10">
              <span className="text-[10px] font-mono text-[#6366f1] tracking-widest uppercase mb-4 block">
                {dev.tag}
              </span>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h3 className="text-3xl md:text-5xl font-syncopate font-bold group-hover:translate-x-4 transition-transform duration-500">
                  {dev.title}
                </h3>
                <p className="max-w-md text-white/50 text-sm md:text-base leading-relaxed">
                  {dev.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 pt-20 border-t border-white/5 text-center dev-content">
          <p className="text-white/20 font-syncopate text-[9px] tracking-[0.5em] uppercase">
            Impulsando la frontera digital // 2025
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; filter: blur(10px); }
          to { opacity: 1; filter: blur(0px); }
        }
      `}} />
    </div>
  );
};
