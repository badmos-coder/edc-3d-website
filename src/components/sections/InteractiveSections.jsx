// src/components/sections/InteractiveSections.js
import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { useInteractive } from '../../systems/EventSystem';

const Section = ({ title, position, onClick }) => {
  const meshRef = useRef();
  const { isHovered } = useInteractive(meshRef, {
    onClick: onClick
  });

  const { scale, color } = useSpring({
    scale: isHovered ? 1.2 : 1,
    color: isHovered ? '#ff00ff' : '#00B4D8',
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return (
    <animated.group
      ref={meshRef}
      position={position}
      scale={scale}
    >
      <mesh>
        <planeGeometry args={[2, 0.5]} />
        <animated.meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </animated.group>
  );
};

function InteractiveSections({ onSectionClick }) {
  const sections = [
    { id: 'about', title: 'About EDC', position: [-5, 2, 0] },
    { id: 'events', title: 'Events', position: [5, 2, 0] },
    { id: 'gallery', title: 'Gallery', position: [-5, -2, 0] },
    { id: 'team', title: 'Team', position: [5, -2, 0] }
  ];

  return (
    <group>
      {sections.map((section) => (
        <Section
          key={section.id}
          title={section.title}
          position={section.position}
          onClick={() => onSectionClick(section.id)}
        />
      ))}
    </group>
  );
}

export default InteractiveSections;