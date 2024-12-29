import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Text3D } from '@react-three/drei';
import { gsap } from 'gsap';
import SceneEnvironment from './environment/SceneEnvironment';
import { useAudio } from '../systems/AudioSystem';
import { useCameraTransition } from './controllers/CameraController';

function FloatingLogo({ position = [0, 0, 0] }) {
  const meshRef = useRef();
  const { playSound } = useAudio();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(time) * 0.002;
  });

  const handleClick = () => {
    playSound('click');
  };

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={1}
    >
      <mesh
        ref={meshRef}
        position={position}
        onClick={handleClick}
      >
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
        >
          EDC
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </mesh>
    </Float>
  );
}

function Experience() {
  const { camera } = useThree();
  const { transitionTo } = useCameraTransition();
  const { playSound } = useAudio();

  useEffect(() => {
    // Initial camera animation
    gsap.to(camera.position, {
      duration: 2,
      z: 8,
      ease: 'power3.inOut',
      onComplete: () => {
        playSound('background');
      }
    });
  }, [camera, playSound]);

  return (
    <>
      <SceneEnvironment />
      
      <FloatingLogo position={[0, 2, 0]} />
      
      {/* Add more interactive elements here */}
    </>
  );
}

export default Experience;