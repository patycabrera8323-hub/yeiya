
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ARViewProps {
  onClose: () => void;
}

interface ARMarker {
  x: number;
  y: number;
  id: number;
  label: string;
}

export const ARView: React.FC<ARViewProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [stats, setStats] = useState({ cpu: 0, ram: 0, depth: 0 });
  const [markers, setMarkers] = useState<ARMarker[]>([]);

  // Three.js Refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const droneRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    // 1. Setup Camera
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError('Acceso denegado. Se requiere cámara para el modo espacial.');
      }
    }
    setupCamera();

    // 2. Setup Three.js Scene for AR Elements
    if (canvasContainerRef.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      canvasContainerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xa855f7, 2);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      // Load 3D Asset (Tech Drone/Node)
      const loader = new GLTFLoader();
      // Using a placeholder high-quality tech asset URL
      loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(2, 1, 0);
        scene.add(model);
        droneRef.current = model;
        setBooting(false);
      }, undefined, () => {
        // Fallback geometry if GLB fails
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xa855f7, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(2, 1, 0);
        scene.add(mesh);
        droneRef.current = mesh as any;
        setBooting(false);
      });

      const animate = () => {
        requestAnimationFrame(animate);
        if (droneRef.current) {
          droneRef.current.rotation.y += 0.01;
          droneRef.current.position.y += Math.sin(Date.now() * 0.002) * 0.005;
        }
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 20) + 40,
        ram: Math.floor(Math.random() * 15) + 70,
        depth: Math.random() * 5
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleScreenClick = (e: React.MouseEvent) => {
    if (booting || error) return;
    const labels = ["ANOMALY", "STRUCT_INT", "DATA_PT", "TARGET", "BIO_SIG"];
    setMarkers(prev => [...prev, {
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
      id: Date.now(),
      label: labels[Math.floor(Math.random() * labels.length)]
    }]);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden font-mono cursor-crosshair" onClick={handleScreenClick}>
      
      {/* 1. Camera Feed */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-50" />
      
      {/* 2. Three.js AR Overlay */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* 3. Interactive HUD Markers */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {markers.map(m => (
          <div key={m.id} className="absolute animate-[popIn_0.3s_ease-out]" style={{ top: `${m.y}%`, left: `${m.x}%`, transform: 'translate(-50%, -50%)' }}>
            <div className="w-10 h-10 border border-[#a855f7] rounded-full flex items-center justify-center animate-spin">
              <div className="w-6 h-1 bg-white/40" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#a855f7]/80 text-[8px] px-2 py-0.5 whitespace-nowrap font-bold">{m.label}</div>
          </div>
        ))}
      </div>

      {/* HUD Controls */}
      <div className="absolute inset-0 z-30 p-6 md:p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="bg-black/40 backdrop-blur-md p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="text-[10px] text-white font-syncopate uppercase tracking-widest">AR_INTERFACE // ACTIVE</div>
            </div>
            <div className="text-[8px] text-white/40 mt-1 uppercase">LIDAR_SCAN_ENGAGED</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="pointer-events-auto w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500/20 transition-all">✕</button>
        </div>

        <div className="flex justify-between items-end">
          <div className="grid grid-cols-2 gap-4 bg-black/40 backdrop-blur-md p-4 border border-white/5">
            <div><div className="text-[8px] text-white/30">DEPTH</div><div className="text-xl font-bold text-[#a855f7]">{stats.depth.toFixed(2)}m</div></div>
            <div><div className="text-[8px] text-white/30">THREAT</div><div className="text-xl font-bold text-white">LOW</div></div>
          </div>
          <div className="text-right">
            <div className="text-4xl md:text-6xl font-syncopate font-bold text-white tracking-tighter">NEXUS_AR</div>
            <div className="text-[9px] text-white/20 tracking-[0.5em] mt-2 font-mono">SEARMO_SYSTEMS_CORE</div>
          </div>
        </div>
      </div>

      {booting && (
        <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-[1px] bg-white/10 overflow-hidden">
            <div className="h-full bg-[#a855f7] animate-[loading_1s_infinite]" />
          </div>
          <span className="text-[9px] font-syncopate tracking-[0.6em] text-white/40">CALIBRATING_OPTICS</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes popIn { from { transform: translate(-50%, -50%) scale(0); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
      `}} />
    </div>
  );
};
