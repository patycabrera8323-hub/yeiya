
import React from 'react';

export const SceneWorks: React.FC = () => {
  const works = [
    {
      id: "01",
      client: "NEURAL LINK",
      title: "Cortex Interface",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      desc: "Visualización de datos cerebrales en tiempo real."
    },
    {
      id: "02",
      client: "AERO SPACE",
      title: "Orbital HUD",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
      desc: "Sistemas de navegación para órbita baja."
    },
    {
      id: "03",
      client: "CYBER DYNAMICS",
      title: "Drone Swarm",
      image: "https://images.unsplash.com/photo-1535378437327-1e14798e2596?q=80&w=2070&auto=format&fit=crop",
      desc: "Algoritmos de coordinación autónoma."
    }
  ];

  return (
    <div className="scene-works absolute inset-0 z-[48] opacity-0 flex flex-col justify-center items-center bg-black overflow-hidden pointer-events-none">
      
      {/* Background sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1a1a,transparent_70%)]" />

      <div className="container mx-auto px-6 relative z-10 w-full">
        
        <div className="mb-12 md:mb-20 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
             <div className="h-px w-12 bg-white/20"></div>
             <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Selected Projects</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-syncopate font-bold text-white tracking-tight uppercase">
            Constructing <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-transparent">The Unseen.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {works.map((work, index) => (
            <div key={index} className={`work-card-${index + 1} group relative`}>
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 border border-white/10 group-hover:border-white/30 transition-colors duration-500">
                <img 
                  src={work.image} 
                  alt={work.title} 
                  className="w-full h-full object-cover grayscale brightness-75 contrast-125 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                {/* ID Overlay */}
                <div className="absolute top-4 right-4 font-mono text-xs text-white/30 border border-white/10 px-2 py-1 bg-black/50 backdrop-blur-sm">
                  {work.id}
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <div className="text-[9px] font-syncopate text-[#6366f1] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {work.client}
                </div>
                <h3 className="text-xl md:text-2xl font-syncopate text-white group-hover:text-[#6366f1] transition-colors duration-300">
                  {work.title}
                </h3>
                <p className="text-xs text-white/40 font-mono leading-relaxed max-w-[90%]">
                  {work.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
