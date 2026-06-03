import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Ring3DProps {
  modelPath: string;
  scale?: number;
}

export function Ring3D({ modelPath, scale = 0.8 }: Ring3DProps) {
  const { scene } = useGLTF(modelPath);
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <PresentationControls
      global
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 4, Math.PI / 4]}
      azimuth={[-Math.PI / 4, Math.PI / 4]}
      config={{ mass: 2, tension: 400 }}
      snap={{ mass: 4, tension: 300 }}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={ref}>
          <Center>
            <primitive object={scene} scale={scale} />
          </Center>
        </group>
      </Float>
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <spotLight position={[-10, -10, -10]} intensity={1} color="#a7f3d0" />
      <Environment preset="city" />
    </PresentationControls>
  );
}
