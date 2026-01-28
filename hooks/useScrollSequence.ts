
import React, { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollSequence = (
  triggerRef: React.RefObject<HTMLDivElement>,
  view: 'cinema' | 'ar'
) => {
  useLayoutEffect(() => {
    if (view !== 'cinema' || !triggerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.config({ force3D: true });

      // Configure ScrollTrigger globally for stability
      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=600%", 
          scrub: 0.3,    
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true, // Critital: Recalculates everything on resize/fullscreen
          fastScrollEnd: true        // Prevents ghost animations when scrolling fast or resizing
        },
      });

      tl.to("#progress-bar", { width: "100%", ease: "none" }, 0);

      // --- ESCENA 1 (INTRO) ---
      tl.to(".scene-one-content", { y: -80, opacity: 0, scale: 0.98, duration: 1 }, 0);
      
      // --- ESCENA 2 (INTERSECCIÓN) ---
      tl.fromTo(".scene-two-img-left", { x: -30, opacity: 0 }, { x: 0, opacity: 0.4, duration: 1 }, 0.5);
      tl.fromTo(".scene-two-img-right", { x: 30, opacity: 0 }, { x: 0, opacity: 0.4, duration: 1 }, 0.5);
      tl.fromTo(".scene-two-text", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.6);
      
      tl.to(".scene-two-img-left", { x: -100, opacity: 0, duration: 1 }, 2);
      tl.to(".scene-two-img-right", { x: 100, opacity: 0, duration: 1 }, 2);
      tl.to(".scene-two-text", { opacity: 0, scale: 1.02, filter: "blur(5px)", duration: 1 }, 2);

      // --- ESCENA 3 (DUALIDAD) ---
      tl.fromTo(".scene-three-split-left", { x: "-100%" }, { x: "0%", duration: 1 }, 2.5);
      tl.fromTo(".scene-three-split-right", { x: "100%" }, { x: "0%", duration: 1 }, 2.5);
      tl.fromTo(".scene-three-title", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }, 3);
      
      tl.to(".scene-three-split-left", { x: "-100%", duration: 1 }, 4);
      tl.to(".scene-three-split-right", { x: "100%", duration: 1 }, 4);
      tl.to(".scene-three-title", { opacity: 0, y: -20, duration: 0.4 }, 4);

      // --- ESCENA DE REALIDAD AUMENTADA ---
      tl.fromTo(".scene-ar", 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, 
        4.2
      );
      tl.fromTo(".ar-text-content", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 4.7);
      
      tl.to(".scene-ar", { opacity: 0, y: 50, duration: 0.8, ease: "power2.in" }, 5.5);

      // --- ESCENA FINAL (CONTACTO) ---
      tl.fromTo(".scene-four", 
        { opacity: 0, pointerEvents: "none" }, 
        { opacity: 1, pointerEvents: "auto", duration: 0.6 }, 
        5.8
      );
      tl.fromTo(".scene-four-card", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }, 
        6.0
      );
      
    }, triggerRef);

    return () => ctx.revert();
  }, [view, triggerRef]);
};
