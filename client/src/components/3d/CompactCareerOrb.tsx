import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CompactCareerOrbProps {
  score?: number; // 0 - 100
  className?: string;
}

function MiniScene({ score = 78 }: { score: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  // Stage color based on score
  const stageColor =
    score >= 75 ? '#30D6A0' : score >= 50 ? '#32C8F5' : score >= 25 ? '#8065FF' : '#F4B860';

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.5} color="#F5F7FF" />
      <pointLight position={[0, 0, 0]} intensity={2} color={stageColor} />

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#151D35"
          emissive={stageColor}
          emissiveIntensity={0.6}
          roughness={0.2}
          wireframe
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.4, 0.03, 16, 60]} />
        <meshStandardMaterial
          color={stageColor}
          emissive={stageColor}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

export const CompactCareerOrb: React.FC<CompactCareerOrbProps> = ({ score = 78, className = '' }) => {
  return (
    <div className={`relative w-28 h-28 flex items-center justify-center ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <MiniScene score={score} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm font-heading font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
          {score}%
        </span>
      </div>
    </div>
  );
};
