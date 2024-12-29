import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { useInteractive } from '../../systems/EventSystem';
import { useCameraTransition } from '../controllers/CameraController';
import { useAudio } from '../../systems/AudioSystem';

const Section = ({ title, position, onClick, color = '#00ffff' }) => {
  const meshRef = useRef();
  const { playSound } = useAudio();
  
  const { isHovered } = useInteractive(meshRef, {
    onHover: () => {
      playSound('hover');
    },
    onClick: () => {
      playSound('click');
      onClick();
    }
  });

  const [springs] = useSpring(() => ({
    scale: isHovered ? 1.2 : 1,
    color: isHovered ? '#ff00ff' : color,
    config: { mass: 1, tension: 280, friction: 60 }
  }));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(time + position[0]) * 0.001;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <animated.mesh
        ref={meshRef}
        position={position}
        scale={springs.scale}
      >
        <Text
          fontSize={0.5}
          maxWidth={2}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="/fonts/cyberpunk.woff"
          anchorX="center"
          anchorY="middle"
        >
          {title}
          <animated.meshStandardMaterial
            color={springs.color}
            emissive={springs.color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Text>
      </animated.mesh>
    </Float>
  );
};

function InteractiveSections() {
  const { transitionTo } = useCameraTransition();

  const sections = [
    {
      title: 'About EDC',
      position: [-5, 2, 0],
      handler: () => transitionTo('about')
    },
    {
      title: 'Events',
      position: [5, 2, 0],
      handler: () => transitionTo('events')
    },
    {
      title: 'Gallery',
      position: [-5, -2, 0],
      handler: () => transitionTo('gallery')
    },
    {
      title: 'Team',
      position: [5, -2, 0],
      handler: () => transitionTo('team')
    }
  ];

  return (
    <group>
      {sections.map((section, index) => (
        <Section
          key={section.title}
          title={section.title}
          position={section.position}
          onClick={section.handler}
        />
      ))}
    </group>
  );
}

export default InteractiveSections;