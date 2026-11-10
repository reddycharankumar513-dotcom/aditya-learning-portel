import React, { useRef, useState, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { WebGLFallback } from './WebGLFallback';

// Error Boundary to catch WebGL context creation failures
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[3D Canvas Fallback Activated]:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Particle field
function ParticleField({ count = 200 }) {
  const points = useRef<THREE.Points>(null!);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color('#8065FF');
    const c2 = new THREE.Color('#32C8F5');
    const tempCol = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const radius = 2.4 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      tempCol.lerpColors(c1, c2, Math.random());
      col[i * 3] = tempCol.r;
      col[i * 3 + 1] = tempCol.g;
      col[i * 3 + 2] = tempCol.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.05;
      points.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Orbiting Rings
function OrbitRings() {
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  const ring3 = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (ring1.current) {
      ring1.current.rotation.z += delta * 0.2;
      ring1.current.rotation.x += delta * 0.1;
    }
    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.25;
      ring2.current.rotation.z += delta * 0.15;
    }
    if (ring3.current) {
      ring3.current.rotation.x += delta * 0.18;
      ring3.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group>
      {/* Outer Cyan Ring */}
      <mesh ref={ring1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#32C8F5"
          emissive="#32C8F5"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Middle Violet Ring */}
      <mesh ref={ring2} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[2.6, 0.012, 16, 100]} />
        <meshStandardMaterial
          color="#8065FF"
          emissive="#8065FF"
          emissiveIntensity={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Outer Fine Highlight Ring */}
      <mesh ref={ring3} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[2.9, 0.008, 16, 100]} />
        <meshStandardMaterial
          color="#A68BFF"
          emissive="#A68BFF"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Floating Geometrical Nodes
function FloatingNodes() {
  const nodeGroup = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (nodeGroup.current) {
      nodeGroup.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={nodeGroup}>
      <mesh position={[1.8, 0.6, 0.8]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#32C8F5" emissive="#32C8F5" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-1.7, -0.8, 0.9]}>
        <icosahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color="#8065FF" emissive="#8065FF" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.5, 1.9, -1.2]}>
        <dodecahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial color="#30D6A0" emissive="#30D6A0" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.8, -1.8, -1.1]}>
        <octahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial color="#F4B860" emissive="#F4B860" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

// Central Interactive AI Sphere
function CoreSphere() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.3;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.15;
      wireframeRef.current.rotation.z += delta * 0.1;
      const pulse = 1 + Math.sin(t * 2) * 0.03;
      wireframeRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      {/* Central Glowing Physical Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          color="#151D35"
          emissive="#5332E0"
          emissiveIntensity={0.65}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Geometric Outer Wireframe Lattice */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.45, 2]} />
        <meshStandardMaterial
          color="#8065FF"
          emissive="#32C8F5"
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
}

// Scene with lighting and pointer parallax
function Scene() {
  const sceneGroup = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (sceneGroup.current) {
      // Subtle smooth parallax following mouse pointer
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 12;
      sceneGroup.current.rotation.y = THREE.MathUtils.lerp(sceneGroup.current.rotation.y, targetX, 0.05);
      sceneGroup.current.rotation.x = THREE.MathUtils.lerp(sceneGroup.current.rotation.x, -targetY, 0.05);
    }
  });

  return (
    <group ref={sceneGroup}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#A68BFF" />
      <directionalLight position={[-5, -5, -5]} intensity={1.2} color="#32C8F5" />
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#8065FF" distance={5} />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
        <CoreSphere />
        <OrbitRings />
        <FloatingNodes />
        <ParticleField count={220} />
      </Float>
    </group>
  );
}

interface AIIntelligenceSphereProps {
  className?: string;
}

export const AIIntelligenceSphere: React.FC<AIIntelligenceSphereProps> = ({ className = '' }) => {
  const [webglSupported, setWebglSupported] = useState<boolean>(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  });

  if (!webglSupported) {
    return <WebGLFallback className={className} />;
  }

  return (
    <div className={`relative w-full h-[420px] lg:h-[520px] ${className}`}>
      <CanvasErrorBoundary fallback={<WebGLFallback className={className} />}>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          dpr={[1, 2]} // Crisp rendering up to 2x pixel ratio
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0); // Fully transparent background
          }}
        >
          <Scene />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};
