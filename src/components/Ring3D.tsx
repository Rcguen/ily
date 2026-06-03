import { useRef } from 'react';
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

  useFrame((_state, delta) => {
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
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={ref}>
          <Center>
            <primitive object={scene} scale={scale} />
          </Center>
        </group>
      </Float>
      
      <ambientLight intensity={0.1} color="#0f172a" />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#a7f3d0" />
      <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={1} intensity={10} color="#34d399" />
      <spotLight position={[0, -5, 5]} angle={0.8} penumbra={1} intensity={5} color="#fbbf24" />
      <Environment preset="night" environmentIntensity={0.3} />
    </PresentationControls>
  );
}

useGLTF.preload('./ring.glb');
