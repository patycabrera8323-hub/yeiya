
import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Contador numérico
    const counterInterval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(counterInterval);
          return 100;
        }
        // Incremento variable para realismo (saltos de carga)
        const jump = Math.floor(Math.random() * 3) + 1;
        return Math.min(prev + jump, 100);
      });
    }, 30);

    // 2. Animación de finalización
    if (count === 100) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // Efecto de salida: Deslizar hacia arriba como una cortina pesada
      tl.to(".preloader-text", { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" })
        .to(containerRef.current, { 
          yPercent: -100, 
          duration: 1.2, 
          ease: "expo.inOut",
          delay: 0.2
        });
    }

    return () => clearInterval(counterInterval);
  }, [count, onComplete]);

  // Textos de carga aleatorios estilo terminal
  const loadingTexts = [
    "LOADING NEURAL NETWORKS",
    "CALIBRATING OPTICS",
    "SYNCING DATABASES",
    "INITIALIZING AR CORE",
    "ESTABLISHING UPLINK"
  ];
  const [currentText, setCurrentText] = useState(loadingTexts[0]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 250);
    return () => clearInterval(textInterval);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden text-white cursor-wait">
        
        <div className="preloader-text flex flex-col items-center">
            {/* Contador Gigante */}
            <div className="text-[15vw] md:text-[12vw] font-syncopate font-bold leading-none tracking-tighter tabular-nums mix-blend-difference">
                {count < 10 ? `0${count}` : count}
            </div>
            
            <div className="w-full flex justify-between items-end px-2 mt-4 border-t border-white/20 pt-4 max-w-[300px] md:max-w-[500px]">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-[#6366f1] animate-pulse">SYSTEM_BOOT_V.2.0</span>
                    <span ref={textRef} className="text-[10px] font-mono text-white/50 uppercase min-w-[150px]">
                      {currentText}...
                    </span>
                </div>
                <div className="w-2 h-2 bg-white animate-spin" />
            </div>
        </div>

        {/* Fondo decorativo (Grid sutil) */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>
  );
};
