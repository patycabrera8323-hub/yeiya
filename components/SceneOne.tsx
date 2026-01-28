
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const SceneOne: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. SECUENCIA DE ENTRADA CINEMÁTICA
      const tl = gsap.timeline({ delay: 0.2 });

      // Fondo abstracto entra primero
      tl.to(".abstract-bg", { opacity: 0.3, duration: 2, ease: "power2.inOut" }, 0);

      // El resplandor detrás del logo
      tl.fromTo(".logo-glow",
        { opacity: 0, scale: 0.5 },
        { opacity: 0.5, scale: 1, duration: 1.5, ease: "expo.out" },
        0.5
      );

      // El Logo Gigante (Pop-in con blur)
      tl.fromTo(logoRef.current,
        { opacity: 0, scale: 0.85, filter: "blur(20px)", rotationX: 10 },
        { opacity: 1, scale: 1, filter: "blur(0px)", rotationX: 0, duration: 1.4, ease: "power3.out" },
        "-=1.2"
      );

      // Textos (Staggered - uno tras otro)
      tl.fromTo(textRef.current,
        { y: -20, opacity: 0, letterSpacing: "1.2em" }, // Start with wider spacing
        { y: 0, opacity: 1, letterSpacing: "0.8em", duration: 1, ease: "circ.out" },
        "-=0.8"
      );

      tl.fromTo(dividerRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.8, ease: "expo.out" }, "-=0.6");

      tl.fromTo(subRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.6"
      );

      // 2. EFECTO TILT 3D INTERACTIVO (HOLOGRÁFICO)
      const handleMouseMove = (e: MouseEvent) => {
        if (!logoRef.current) return;
        
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calcular posición normalizada (-0.5 a 0.5)
        const xPos = (clientX / innerWidth - 0.5);
        const yPos = (clientY / innerHeight - 0.5);

        // Mover el logo sutilmente en 3D
        gsap.to(logoRef.current, {
          rotationY: xPos * 8,  // Rotación en eje Y
          rotationX: -yPos * 8, // Rotación en eje X
          x: xPos * 20,         // Pequeño desplazamiento lateral
          y: yPos * 20,         // Pequeño desplazamiento vertical
          duration: 1,
          ease: "power2.out",
          transformPerspective: 1000,
          overwrite: "auto"
        });

        // Mover el resplandor en dirección opuesta para profundidad
        gsap.to(".logo-glow", {
          x: -xPos * 40,
          y: -yPos * 40,
          duration: 1.5,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="scene-one absolute inset-0 flex items-center justify-center z-10 overflow-hidden pointer-events-none perspective-[2000px]">
      
      <div className="scene-one-content flex flex-col items-center justify-center w-full relative z-20 h-full">
        
        {/* Top Text - Optical Centering fixed with inline-block */}
        <div className="text-center mb-8 md:mb-12">
          <span 
            ref={textRef} 
            className="text-[9px] md:text-[10px] font-syncopate uppercase tracking-[0.8em] text-white/40 opacity-0 mix-blend-screen inline-block mr-[-0.8em]"
          >
            Soluciones para el futuro
          </span>
        </div>
        
        {/* === LOGO CONTAINER MASSIVE === */}
        <div ref={logoRef} className="relative group opacity-0 will-change-transform transform-gpu mb-8 md:mb-10">
          
          {/* 1. Aura / Glow Trasero */}
          <div className="logo-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-500/10 via-white/5 to-blue-500/10 blur-[80px] rounded-full opacity-0 pointer-events-none mix-blend-screen"></div>

          {/* 2. Partículas Flotantes (Dust Motes) */}
          <div className="absolute inset-0 z-0 opacity-60">
             <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-white rounded-full blur-[1px] animate-[float_4s_ease-in-out_infinite]" />
             <div className="absolute top-[60%] right-[30%] w-1.5 h-1.5 bg-purple-400 rounded-full blur-[2px] animate-[float_5s_ease-in-out_infinite_reverse]" />
             <div className="absolute bottom-[20%] left-[40%] w-1 h-1 bg-blue-300 rounded-full blur-[1px] animate-[float_6s_ease-in-out_infinite] delay-1000" />
          </div>

          {/* 3. Imagen Principal (Logo) */}
          <img 
            src="https://i.postimg.cc/kg6rK61f/Generated-Image-January-11-2026-8-51PM-removebg-preview.png" 
            alt="SEARMO" 
            className="w-[90vw] md:w-[55vw] max-h-[50vh] md:max-h-[60vh] object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_80px_rgba(168,85,247,0.4)] relative z-10 transition-all duration-700"
          />
          
          {/* 4. Reflejo/Brillo sobre la imagen (Overlay) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full mask-image-linear-gradient" />
        </div>

        {/* Divider & Subtitle - Size Further Reduced */}
        <div ref={dividerRef} className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 opacity-0"></div>
        
        <p ref={subRef} className="font-serif italic text-base md:text-xl text-white/50 max-w-md px-6 leading-relaxed opacity-0 text-shadow-sm text-center">
          Bienvenido a la nueva era , te acompañamos en el proceso .
        </p>
      </div>
      
      {/* Background Elements */}
      <div className="abstract-bg absolute -z-10 w-[140%] h-[140%] border border-white/[0.03] rounded-full blur-3xl opacity-0 animate-[pulse_8s_infinite] pointer-events-none" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(5px); }
        }
        .text-shadow-sm { text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
      `}} />
    </div>
  );
};
