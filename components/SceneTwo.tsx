
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Helper for Progressive Loading (Blur-up effect)
const ProgressiveImage: React.FC<{ src: string; alt: string; className?: string; imgClassName?: string }> = ({ src, alt, className, imgClassName }) => {
  const [loaded, setLoaded] = useState(false);
  
  // Create a Low-Quality Image Placeholder (LQIP) URL using Cloudinary transformations
  const lqip = src.replace('/f_auto,q_auto/', '/f_auto,q_auto:low,e_blur:1000,w_50/');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blurred Placeholder */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          backgroundImage: `url(${lqip})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) scale(1.1)' 
        }}
      />
      {/* Main Image */}
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        className={`${imgClassName} w-full h-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export const SceneTwo: React.FC = () => {
  const leftImgRef = useRef<HTMLDivElement>(null);
  const rightImgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Función centralizada para mover las imágenes
    const animateParallax = (xFactor: number, yFactor: number) => {
      // xFactor & yFactor deben estar entre -0.5 y 0.5 (aprox)

      // Resonancia Estructural (Left Image) - Movimiento sutil
      if (leftImgRef.current) {
        gsap.to(leftImgRef.current, {
          x: xFactor * 40,
          y: yFactor * 40,
          rotationY: xFactor * 8,
          rotationX: -yFactor * 8,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto"
        });
      }

      // Flow Espacial (Right Image) - Movimiento más profundo (capas)
      if (rightImgRef.current) {
        gsap.to(rightImgRef.current, {
          x: -xFactor * 60,
          y: -yFactor * 60,
          rotationY: -xFactor * 12,
          rotationX: yFactor * 12,
          duration: 1.5,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    };

    // 1. Lógica para PC (Mouse)
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate cursor position relative to center (-0.5 to 0.5)
      const xPos = (e.clientX / window.innerWidth - 0.5);
      const yPos = (e.clientY / window.innerHeight - 0.5);
      animateParallax(xPos, yPos);
    };

    // 2. Lógica para Móvil (Giroscopio / Acelerómetro)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      // Gamma: Inclinación Izquierda/Derecha (-90 a 90)
      // Beta: Inclinación Frente/Atrás (-180 a 180)
      
      // Normalizamos Gamma: Dividimos entre 45 grados para tener un rango manejable (-1 a 1)
      const xRaw = e.gamma / 45; 
      
      // Normalizamos Beta: Restamos 45 grados (asumiendo que el usuario sostiene el cel a 45°)
      const yRaw = (e.beta - 45) / 45;

      // Clampeamos valores para evitar que las imágenes se salgan de pantalla en giros bruscos
      const xPos = Math.max(-1, Math.min(1, xRaw)) * 0.5; // Escalamos por 0.5 para igualar intensidad del mouse
      const yPos = Math.max(-1, Math.min(1, yRaw)) * 0.5;

      animateParallax(xPos, yPos);
    };

    // Detectar si es dispositivo táctil/móvil para optimizar listeners
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div ref={containerRef} className="scene-two absolute inset-0 flex items-center justify-center z-20 pointer-events-none overflow-hidden perspective-1000">
      
      {/* Floating Abstract Images with Parallax Refs - INCREASED SIZES */}
      <div className="scene-two-img-left absolute left-[2%] top-[15%] w-[45vw] md:w-[32vw] aspect-square opacity-0 will-change-transform">
        <div ref={leftImgRef} className="w-full h-full">
          <ProgressiveImage 
            src="https://res.cloudinary.com/dztibxp9k/image/upload/f_auto,q_auto/v1767598183/grok_image_1cg3dz_ewrxi0.webp" 
            alt="Resonancia Estructural" 
            className="w-full h-full border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            imgClassName="grayscale brightness-50 contrast-125"
          />
          <div className="absolute -bottom-6 left-0 text-[8px] md:text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Resonancia Estructural</div>
        </div>
      </div>

      <div className="scene-two-img-right absolute right-[2%] bottom-[10%] w-[40vw] md:w-[28vw] aspect-[4/5] opacity-0 will-change-transform">
        <div ref={rightImgRef} className="w-full h-full">
          <ProgressiveImage 
            src="https://res.cloudinary.com/dztibxp9k/image/upload/f_auto,q_auto/v1767598190/copilot_image_1767198785328_ijmgsi.webp" 
            alt="Flow Espacial" 
            className="w-full h-full border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            imgClassName="grayscale brightness-50 contrast-125"
          />
          <div className="absolute -top-6 right-0 text-[8px] md:text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 text-right">Flow Espacial</div>
        </div>
      </div>

      {/* Center Text - Stays centered but sits on a higher virtual layer */}
      <div className="scene-two-text opacity-0 text-center max-w-4xl px-6 md:px-10 will-change-transform relative z-40">
        <h2 className="text-4xl md:text-7xl font-syncopate font-bold mb-8 tracking-tighter leading-[1.1] uppercase">
          <span className="text-white block">Tú imaginas,</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white via-[35%] to-[#a855f7] drop-shadow-[0_0_25px_rgba(168,85,247,0.4)] block">
            Nosotros creamos
          </span>
        </h2>
        <p className="text-sm md:text-lg text-white/60 leading-relaxed font-mono tracking-widest uppercase max-w-xl mx-auto">
          Transformando conceptos abstractos en realidades digitales inmersivas.
        </p>
      </div>

    </div>
  );
};
