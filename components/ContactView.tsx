
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ContactViewProps {
  onClose: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onClose }) => {
  const compRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tlIn = gsap.timeline();
      
      tlIn.fromTo(".contact-overlay", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6 }
      )
      .fromTo(".unified-card", 
        { y: 50, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" },
        "-=0.4"
      )
      .fromTo(".data-row", 
        { x: -20, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );

      const pieces = gsap.utils.toArray(".puzzle-piece");
      
      const puzzleTl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1.5 });

      puzzleTl.to(pieces, {
        x: () => Math.random() * 400 - 200,     
        y: () => Math.random() * 400 - 200,     
        z: () => Math.random() * 300 - 150,     
        rotationX: () => Math.random() * 720 - 360,   
        rotationY: () => Math.random() * 720 - 360,
        rotationZ: () => Math.random() * 90 - 45,
        opacity: 0,
        scale: 0.4,
        boxShadow: "0 0 20px rgba(0,0,0,0.5)", 
        duration: 2.2,
        ease: "power4.inOut", 
        stagger: {
          grid: [4, 4],
          from: "random", 
          amount: 0.8
        }
      });

    }, compRef);

    return () => ctx.revert();
  }, []);

  const renderPuzzlePieces = () => {
    const pieces = [];
    const gridSize = 4;
    const abstractImage = "https://i.postimg.cc/LXs1c5Hv/IMG-20251231-102452.jpg"; 
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        pieces.push(
          <div 
            key={`${row}-${col}`} 
            className="puzzle-piece absolute w-[25.2%] h-[25.2%] bg-cover" 
            style={{ 
              top: `${row * 25}%`, 
              left: `${col * 25}%`,
              backgroundImage: `url("${abstractImage}")`,
              backgroundPosition: `${col * 33.333}% ${row * 33.333}%`, 
              backgroundSize: '400% 400%' 
            }}
          />
        );
      }
    }
    return pieces;
  };

  return (
    <div ref={compRef} className="contact-overlay fixed inset-0 z-[150] bg-[#000000]/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-hidden">
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[160] group"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 group-hover:bg-white group-hover:text-black transition-all duration-300">
           ✕
        </div>
      </button>

      <div className="w-full max-w-4xl perspective-1000">
        
        <div className="unified-card w-full bg-[#050505] relative shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-2xl border border-white/10">
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>

          <div className="flex-1 p-10 md:p-14 flex flex-col justify-center relative z-10 bg-gradient-to-r from-black via-black/95 to-transparent">
            
            <div className="mb-12">
               <h2 className="text-[10px] font-syncopate tracking-[0.4em] text-[#6366f1] mb-2 uppercase font-bold">Datos de Contacto</h2>
               <div className="h-px w-12 bg-[#6366f1]/50"></div>
            </div>

            <div className="space-y-10">
               
               <div className="data-row group">
                  <label className="block text-[9px] font-mono text-white/40 mb-2 uppercase tracking-widest group-hover:text-white transition-colors">EMAIL</label>
                  <a href="mailto:jesus@gmail.com" className="text-xl md:text-3xl font-syncopate text-white font-light group-hover:text-[#6366f1] transition-colors border-b border-transparent group-hover:border-[#6366f1] pb-1 inline-block">
                    jesus@gmail.com
                  </a>
               </div>

               <div className="data-row group">
                  <label className="block text-[9px] font-mono text-white/40 mb-2 uppercase tracking-widest group-hover:text-white transition-colors">TELÉFONO</label>
                  <a href="tel:55555556" className="text-xl md:text-3xl font-syncopate text-white font-light group-hover:text-[#6366f1] transition-colors">
                    55555556
                  </a>
               </div>

               <div className="data-row group">
                  <label className="block text-[9px] font-mono text-white/40 mb-2 uppercase tracking-widest group-hover:text-white transition-colors">DIRECCIÓN</label>
                  <p className="text-lg md:text-2xl font-syncopate text-white/80 font-light leading-tight">
                    CDMX <span className="text-[#6366f1]">número 89</span>
                  </p>
               </div>
            </div>
            
          </div>

          <div className="flex-1 bg-[#08080a] relative flex items-center justify-center min-h-[350px] md:min-h-auto overflow-hidden border-t md:border-t-0 md:border-l border-white/5">
             
             <div className="absolute inset-8 border border-white/5 opacity-50 z-0"></div>
             
             <div className="absolute bottom-6 w-full text-center z-20">
                <span className="text-[8px] font-syncopate uppercase tracking-[0.5em] text-white/20 animate-pulse">Abstract Logic</span>
             </div>

             <div className="relative w-64 h-64 md:w-72 md:h-72 perspective-1000 z-10">
                {renderPuzzlePieces()}
             </div>

          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; transform-style: preserve-3d; }
        .puzzle-piece { 
           backface-visibility: hidden; 
           transform-origin: center center;
           will-change: transform, opacity;
        }
      `}} />
    </div>
  );
};
