import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CardData } from '../portfolioData';

interface Card3DProps {
    data: CardData;
    isFocused?: boolean;
    isNearFocus?: boolean;
    noAnimation?: boolean;
    width: number;
}

const Card3D: React.FC<Card3DProps> = ({ data, isFocused = false, isNearFocus = true, noAnimation = false, width }) => {
    const [transform, setTransform] = useState('rotateY(0deg) rotateX(0deg) translateZ(0px)');
    const [shadow, setShadow] = useState('0 4px 20px rgba(0,0,0,0.01)');
    const [shine, setShine] = useState({ opacity: 0, x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isMutedByBrowser, setIsMutedByBrowser] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isMounted = useRef(true);
    const playPromiseRef = useRef<Promise<void> | null>(null);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !data.video || videoError || !isNearFocus) return;

        const handlePlay = async () => {
            try {
                if (isFocused) {
                    video.muted = false;
                    video.volume = 1.0;
                    playPromiseRef.current = video.play();
                    await playPromiseRef.current;
                    setIsMutedByBrowser(false);
                } else {
                    if (playPromiseRef.current) {
                        await playPromiseRef.current;
                    }
                    if (isMounted.current && !video.paused) {
                        video.pause();
                    }
                }
            } catch (error: any) {
                if (error.name === 'NotAllowedError' && isFocused) {
                    video.muted = true;
                    setIsMutedByBrowser(true);
                    video.play().catch(() => { });
                }
            }
        };

        handlePlay();
    }, [isFocused, isNearFocus, data.video, videoError]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !isFocused || window.innerWidth < 768) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (centerY - y) / 50;
        const rotateY = (x - centerX) / 50;

        setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(40px)`);
        setShadow('0 30px 60px rgba(0,0,0,0.12)');
        setShine({ opacity: 0.15, x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    }, [isFocused]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setTransform('rotateY(0deg) rotateX(0deg) translateZ(0px)');
        setShadow(isFocused ? '0 20px 50px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.01)');
        setShine({ ...shine, opacity: 0 });
    }, [shine, isFocused]);

    return (
        <div
            className={`perspective-container transition-all cubic-bezier(0.16, 1, 0.3, 1) ${noAnimation ? 'duration-0' : 'duration-800'
                } ${isFocused ? 'scale-100 z-30 opacity-100' : 'scale-[0.85] opacity-20 blur-[2px] md:blur-[4px]'
                }`}
            style={{ width: `${width}px` }}
        >
            <div
                className={`relative p-[10px] md:p-[14px] rounded-[40px] md:rounded-[55px] transition-all duration-1000 ${isFocused
                        ? 'bg-gradient-to-br from-white/60 via-white/40 to-white/60 shadow-[0_0_80px_rgba(255,255,255,0.8)]'
                        : 'bg-transparent'
                    }`}
            >
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform,
                        boxShadow: shadow,
                        transition: isHovered
                            ? 'transform 0.1s ease-out, box-shadow 0.3s ease'
                            : (noAnimation ? 'none' : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.8s ease'),
                        aspectRatio: '3/4.2'
                    }}
                    className="relative bg-[#080808] rounded-[32px] md:rounded-[45px] preserve-3d cursor-pointer overflow-hidden group border border-white/10 w-full"
                >
                    <div
                        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-700"
                        style={{
                            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.12) 0%, transparent 65%)`,
                            opacity: shine.opacity
                        }}
                    />

                    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                        {data.image && (
                            <img
                                src={data.image}
                                alt=""
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isFocused
                                        ? (data.video && !videoError && isNearFocus ? 'opacity-0' : 'opacity-100')
                                        : 'opacity-30'
                                    }`}
                            />
                        )}
                        {data.video && !videoError && isNearFocus && (
                            <video
                                ref={videoRef}
                                src={data.video}
                                loop
                                playsInline
                                autoPlay
                                muted={!isFocused}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
                            />
                        )}
                    </div>

                    {isFocused && isMutedByBrowser && (
                        <div className="absolute top-6 right-6 z-40 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 animate-pulse">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" /></svg>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 z-10" />

                    <div
                        className={`absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 flex flex-col justify-end transition-all duration-1000 ease-out ${isFocused ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                    >
                        <h3 className="text-white text-base md:text-xl font-[900] mb-3 tracking-tighter drop-shadow-2xl leading-tight">
                            {data.title}
                        </h3>
                        <div className="h-[0.5px] w-8 bg-white/20 mb-5 transition-all duration-1000 delay-300" style={{ width: isFocused ? '32px' : '0px' }} />
                        <p className="text-white/70 text-[7px] md:text-[8.5px] font-medium leading-relaxed uppercase tracking-[0.7em] drop-shadow-lg">
                            {data.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card3D;
