
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Card3D from './Card3D';
import { CARDS_DATA } from '../portfolioData';

interface PortfolioViewProps {
    onClose: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onClose }) => {
    const totalItems = CARDS_DATA.length;

    const extendedData = useMemo(() => [
        ...CARDS_DATA, ...CARDS_DATA, ...CARDS_DATA,
        ...CARDS_DATA, ...CARDS_DATA, ...CARDS_DATA,
        ...CARDS_DATA, ...CARDS_DATA, ...CARDS_DATA
    ], [totalItems]);

    const [currentIndex, setCurrentIndex] = useState(totalItems * 4);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isJumping = useRef(false);

    const isMobile = windowWidth < 768;
    const cardWidth = isMobile ? 280 : 400;
    const gap = isMobile ? 16 : 40;
    const step = cardWidth + gap;
    const transitionDuration = 800;

    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNext = useCallback(() => {
        if (isTransitioning || isJumping.current) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isTransitioning]);

    const handlePrev = useCallback(() => {
        if (isTransitioning || isJumping.current) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    }, [isTransitioning]);

    useEffect(() => {
        if (!isTransitioning) return;
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, transitionDuration);
        return () => clearTimeout(timer);
    }, [isTransitioning]);

    useEffect(() => {
        if (!isTransitioning) {
            if (currentIndex >= totalItems * 6 || currentIndex <= totalItems * 2) {
                isJumping.current = true;
                const relativePos = ((currentIndex % totalItems) + totalItems) % totalItems;
                setCurrentIndex(totalItems * 4 + relativePos);

                requestAnimationFrame(() => {
                    isJumping.current = false;
                });
            }
        }
    }, [currentIndex, isTransitioning, totalItems]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        if (Math.abs(distance) > 40) {
            if (distance > 0) handleNext();
            else handlePrev();
        }
        touchStart.current = null;
        touchEnd.current = null;
    };

    const trackTransform = useMemo(() => {
        const offset = currentIndex * step;
        return `translateX(calc(50vw - ${cardWidth / 2}px - ${offset}px))`;
    }, [currentIndex, step, cardWidth]);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            {/* Content */}
            <div
                className="relative h-screen w-screen text-[#1c1e21] selection:bg-black/5 overflow-hidden flex flex-col"
                style={{
                    background: 'linear-gradient(135deg, #fdfcfc 0%, #fcfdfc 50%, #fcfcff 100%)'
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 md:top-10 md:right-10 z-[160] w-12 h-12 bg-white/40 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all border border-white/60"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Header */}
                <header className="absolute top-10 w-full pointer-events-none z-50 flex items-center justify-center">
                    <span className="text-[10px] font-bold tracking-[0.6em] opacity-30 uppercase text-black/60">SEARMO Portafolio Digital</span>
                </header>

                {/* Carousel */}
                <main className="relative flex-1 flex items-center overflow-visible">
                    <div className="hidden md:flex absolute inset-x-0 w-full justify-between px-10 z-50 pointer-events-none">
                        <button
                            onClick={handlePrev}
                            className="w-12 h-12 bg-white/40 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all border border-white/60 pointer-events-auto"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>

                        <button
                            onClick={handleNext}
                            className="w-12 h-12 bg-white/40 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all border border-white/60 pointer-events-auto"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>

                    <div
                        className="flex items-center will-change-transform"
                        style={{
                            gap: `${gap}px`,
                            transform: trackTransform,
                            transition: isTransitioning && !isJumping.current
                                ? `transform ${transitionDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`
                                : 'none',
                        }}
                    >
                        {extendedData.map((card, index) => {
                            const isNearFocus = Math.abs(index - currentIndex) <= 2;

                            return (
                                <div
                                    key={`${card.id}-${index}`}
                                    className="shrink-0"
                                    style={{ width: `${cardWidth}px` }}
                                >
                                    <Card3D
                                        data={card}
                                        isFocused={index === currentIndex}
                                        noAnimation={isJumping.current}
                                        width={cardWidth}
                                        isNearFocus={isNearFocus}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* Footer */}
                <footer className="absolute bottom-12 w-full flex flex-col items-center">
                    <div className="flex items-center gap-8">
                        <span className="h-[0.5px] w-12 bg-black/5"></span>
                        <span className="text-[14px] font-black tracking-[0.5em] bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-90">
                            BY SEARMO
                        </span>
                        <span className="h-[0.5px] w-12 bg-black/5"></span>
                    </div>
                </footer>
            </div>

            {/* CSS for 3D perspective */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .perspective-container {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        * {
          backface-visibility: hidden;
        }
      ` }} />
        </div>
    );
};
