
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  isSpeaking: boolean;
  volume: number;
}

const vertexShader = `
  varying vec3 vColor;
  varying float vOpacity;
  uniform float uTime;
  uniform float uVolume;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  
  void main() {
    float noiseBase = hash(dot(position, vec3(1.0, 2.0, 3.0)));
    vColor = mix(vec3(0.0, 0.4, 0.7), vec3(0.05, 0.0, 0.5), noiseBase * 0.5); 
    
    vec3 pos = position;
    float dist = length(pos);
    float faceShape = 1.0;

    vec3 eyeL = vec3(0.35, 0.45, 0.85);
    vec3 eyeR = vec3(-0.35, 0.45, 0.85);
    float dEyeL = length(pos - eyeL);
    float dEyeR = length(pos - eyeR);
    faceShape -= exp(-dEyeL * 9.0) * 0.35;
    faceShape -= exp(-dEyeR * 9.0) * 0.35;

    vec3 nosePos = vec3(0.0, 0.05, 1.1);
    float dNose = length(pos - nosePos);
    faceShape += exp(-dNose * 16.0) * 0.15;

    vec3 mouthPos = vec3(0.0, -0.4, 0.9);
    float dMouth = length(pos - mouthPos);
    float mouthReaction = uVolume * 2.0; 
    faceShape -= exp(-dMouth * (18.0 - mouthReaction)) * (0.15 + uVolume * 0.25);

    float jawFactor = smoothstep(-1.0, -0.2, pos.y);
    faceShape *= (0.9 + jawFactor * 0.1);

    pos *= faceShape;

    float noise = hash(dot(pos, vec3(12.9898, 78.233, 45.164)) + uTime);
    float vibration = (uVolume * 0.08) + 0.003; 
    pos += normalize(pos) * noise * vibration;

    float pulse = sin(uTime * 1.8 + pos.y * 2.5) * 0.006;
    pos += normalize(pos) * pulse;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float baseSize = 0.8;
    gl_PointSize = (baseSize + uVolume * 2.5) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    vOpacity = 0.15 + (uVolume * 0.4);
    float scanline = sin(pos.y * 180.0 + uTime * 6.0) * 0.08;
    vOpacity += scanline;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    float strength = 1.0 - (r * 2.0);
    strength = pow(strength, 4.5);
    gl_FragColor = vec4(vColor, vOpacity * strength);
  }
`;

const HolographicEntity: React.FC<AvatarProps> = ({ isSpeaking, volume }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 40000;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      const r = 1.0;
      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(theta);
    }
    return [pos];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uVolume: { value: 0 }
  }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uVolume.value = THREE.MathUtils.lerp(
        material.uniforms.uVolume.value,
        volume,
        0.1
      );
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
};

export const Avatar: React.FC<AvatarProps> = (props) => {
  const [cameraZ, setCameraZ] = useState(10.0);
  const [fov, setFov] = useState(30);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        setCameraZ(12.0);
        setFov(35);
      } else {
        setCameraZ(10.0);
        setFov(30);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-transparent overflow-visible">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, cameraZ], fov: fov }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <HolographicEntity {...props} />
        </Float>
      </Canvas>
    </div>
  );
};
