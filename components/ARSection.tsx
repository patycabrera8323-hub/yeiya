
import React from 'react';

export const ARSection: React.FC = () => {
  return (
    <div className="scene-ar absolute inset-0 z-[45] opacity-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] text-black">
      
      <div className="max-w-[1400px] w-full px-6 md:px-12 relative z-10 h-full flex flex-col justify-center text-center">
        
        <div className="flex flex-col justify-center items-center h-full pb-20 md:pb-0">
            
            <div className="relative w-full flex flex-col items-center">
              <h3 className="text-[10vw] md:text-[8vw] font-bold tracking-tighter leading-[0.9] text-black mix-blend-multiply">
                REALIDAD
              </h3>
              <h3 className="text-[10vw] md:text-[8vw] font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#a855f7] to-gray-900 bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]">
                AUMENTADA
              </h3>
            </div>

            <div className="mt-20 flex flex-col items-center max-w-2xl mx-auto">
              
              <div className="ar-text-content space-y-8 flex flex-col items-center">
                <div className="w-12 h-[1px] bg-black/20 mb-4"></div>
                <p className="text-base md:text-xl text-gray-600 leading-relaxed font-light max-w-lg mx-auto italic">
                  <span className="font-semibold text-black">No es solo ver más.</span> Es sentir la información integrada en tu entorno. SEARMO transforma la latencia entre pensamiento y acción.
                </p>
                
                {/* Visual indicator removed as requested for a cleaner look */}
              </div>
            </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
    </div>
  );
};
