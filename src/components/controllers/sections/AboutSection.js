import React, { useRef } from 'react';
import { Text, Box, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import { MeshDistortMaterial } from '@react-three/drei';

function FloatingCard({ position, title, content, color }) {
  const meshRef = useRef();
  const [active, setActive] = React.useState(false);

  const { scale, rotation } = useSpring({
    scale: active ? 1.2 : 1,
    rotation: active ? [0, Math.PI / 4, 0] : [0, 0, 0],
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(time) * 0.002;
  });

  return (
    <animated.group
      ref={meshRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <Box args={[2, 3, 0.1]}>
        <MeshDistortMaterial
          color={color}
          speed={5}
          distort={0.2}
          radius={1}
        />
      </Box>
      <Text
        position={[0, 0.8, 0.06]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.1}
        color="#ffffff"
        maxWidth={1.5}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {content}
      </Text>
    </animated.group>
  );
}

function FloatingOrb({ position, scale = 1 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time) * 0.2;
    meshRef.current.rotation.y = Math.cos(time) * 0.2;
  });

  const { size, emissive } = useSpring({
    size: hovered ? scale * 1.2 : scale,
    emissive: hovered ? 2 : 0.5,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={size}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Sphere args={[1, 32, 32]}>
        <animated.meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={emissive}
          metalness={0.8}
          roughness={0.2}
          wireframe
        />
      </Sphere>
    </animated.mesh>
  );
}

function AboutSection() {
  const cards = [
    {
      title: 'Our Vision',
      content: 'Fostering innovation and entrepreneurship in the next generation of leaders.',
      position: [-4, 0, 0],
      color: '#00ffff'
    },
    {
      title: 'Our Mission',
      content: 'Creating a vibrant ecosystem for startups and innovators to thrive.',
      position: [0, 0, 0],
      color: '#ff00ff'
    },
    {
      title: 'Our Values',
      content: 'Innovation, Collaboration, Excellence, and Impact.',
      position: [4, 0, 0],
      color: '#ffff00'
    }
  ];

  const orbs = [
    { position: [-6, 3, -2], scale: 0.5 },
    { position: [6, 3, -2], scale: 0.5 },
    { position: [-6, -3, -2], scale: 0.5 },
    { position: [6, -3, -2], scale: 0.5 }
  ];

  return (
    <group position={[0, 0, -5]}>
      {cards.map((card, index) => (
        <FloatingCard key={index} {...card} />
      ))}
      {orbs.map((orb, index) => (
        <FloatingOrb key={index} {...orb} />
      ))}
      <Text
        position={[0, 3, 0]}
        fontSize={1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/cyberpunk.woff"
      >
        About EDC
      </Text>
    </group>
  );
}

export default AboutSection;