
import React from 'react';

export const GrainOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05] overflow-hidden">
      {/* 
         OPTIMIZACIÓN DE RENDIMIENTO:
         En lugar de usar un filtro SVG <feTurbulence> que recalcula píxeles en cada frame (matando la batería),
         usamos una imagen Base64 pequeña de ruido repetida.
      */}
      <div 
        className="absolute inset-[-200%] w-[400%] h-[400%] animate-[grain_8s_steps(10)_infinite]"
        style={{
          backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAAAAAAAAAABMTExERERmZmZnOtWxAAAACHRSTlMAMwAqrLbFwM0ZQMkAAAB5SURBVDjLxZNRCsAgDQSXPcEreP+76q8SMGkK3Yf5CMSX1aRJ5X8t6zkR4T72fuYi4r2T+5lE5H0m9zOJyPtM7mcSkfeZ3M8kIu8zuZ9JRN5ncj+TiLzP5H4mEXmfyf1MIvI+k/uZROR9Jvczicj7TO5nEpH3mdzPJCKP8wLjn0tq8sMA0QAAAABJRU5ErkJggg==")`,
          backgroundRepeat: 'repeat',
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
      `}} />
    </div>
  );
};
