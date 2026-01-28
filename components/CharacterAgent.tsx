
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterAgentProps {
    isSpeaking: boolean;
    volume: number;
}

const Character: React.FC<CharacterAgentProps> = ({ isSpeaking, volume }) => {
    // Using a generic Ready Player Me avatar URL for the prototype
    // This is a placeholder; in production, you'd use your own model link
    const avatarUrl = 'https://models.readyplayer.me/65a6d396791937f26f743588.glb';
    const { scene, animations } = useGLTF(avatarUrl);
    const group = useRef<THREE.Group>(null);
    const { actions } = useAnimations(animations, group);

    const [mouthOpenFactor, setMouthOpenFactor] = useState(0);

    useEffect(() => {
        // Basic Idle animation if available
        if (actions && actions['Armature|mixamo.com|Layer0']) {
            actions['Armature|mixamo.com|Layer0']?.play();
        } else if (actions && Object.keys(actions).length > 0) {
            // Play the first animation found as idle
            actions[Object.keys(actions)[0]]?.play();
        }

        return () => {
            Object.values(actions).forEach(action => action?.stop());
        };
    }, [actions]);

    useFrame((state) => {
        if (group.current) {
            // Gentle rotation for life-like feel
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }

        // Simple procedural Lip Sync based on volume
        if (isSpeaking) {
            const targetMouthOpen = Math.min(volume * 5, 1);
            setMouthOpenFactor(prev => THREE.MathUtils.lerp(prev, targetMouthOpen, 0.2));
        } else {
            setMouthOpenFactor(prev => THREE.MathUtils.lerp(prev, 0, 0.2));
        }

        // Attempt to find the mouth blendshape or bone
        // In RPM models, 'mouthOpen' or 'jawOpen' is common
        scene.traverse((child) => {
            if ((child as any).isMesh && (child as any).morphTargetDictionary) {
                const mesh = child as THREE.Mesh;
                const index = mesh.morphTargetDictionary!['jawOpen'] || mesh.morphTargetDictionary!['mouthOpen'];
                if (index !== undefined) {
                    mesh.morphTargetInfluences![index] = mouthOpenFactor;
                }
            }
        });
    });

    {/* @ts-ignore */ }
    return <primitive ref={group} object={scene} scale={1.5} position={[0, -1.5, 0]} />;
};

export const CharacterAgent: React.FC<CharacterAgentProps> = (props) => {
    return (
        <group>
            {/* @ts-ignore */}
            <ambientLight intensity={0.5} />
            {/* @ts-ignore */}
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            {/* @ts-ignore */}
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Character {...props} />
        </group>
    );
};

// Preload the model
useGLTF.preload('https://models.readyplayer.me/65a6d396791937f26f743588.glb');
