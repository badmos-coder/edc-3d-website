import React, { useRef, useState } from 'react';
import { Text, Plane, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';

function MemberCard({ position, name, role, image, bio, social, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(image);

  // Create a hexagonal shape for the profile
  const hexGeometry = new THREE.CircleGeometry(1, 6);

  const { scale, rotation, glow } = useSpring({
    scale: hovered ? 1.1 : 1,
    rotation: hovered ? [0, Math.PI * 0.1, 0] : [0, 0, 0],
    glow: hovered ? 1 : 0.3,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(time + position[0]) * 0.002;
  });

  return (
    <animated.group
      ref={meshRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Profile Picture */}
      <mesh geometry={hexGeometry}>
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissiveIntensity={glow}
          emissive="#ffffff"
        />
      </mesh>

      {/* Border Glow */}
      <mesh geometry={hexGeometry} scale={1.05}>
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.5}
          wireframe
        />
      </mesh>

      {/* Name */}
      <Text
        position={[0, -1.3, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/cyberpunk.woff"
      >
        {name}
      </Text>

      {/* Role */}
      <Text
        position={[0, -1.6, 0]}
        fontSize={0.15}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        {role}
      </Text>
    </animated.group>
  );
}

function MemberModal({ member, onClose }) {
  const { name, role, bio, social, image } = member;
  const texture = useTexture(image);

  const [spring] = useSpring(() => ({
    scale: 1,
    from: { scale: 0 },
    config: { mass: 1, tension: 280, friction: 60 }
  }));

  return (
    <animated.group
      scale={spring.scale}
      position={[0, 0, 5]}
      onClick={onClose}
    >
      <Plane args={[4, 6]}>
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.9}
        />
      </Plane>

      {/* Profile Picture */}
      <mesh position={[0, 1.5, 0.1]} scale={1.5}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial
          map={texture}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Name & Role */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.3}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      <Text
        position={[0, -0.4, 0.1]}
        fontSize={0.2}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        {role}
      </Text>

      {/* Bio */}
      <Text
        position={[0, -1.2, 0.1]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {bio}
      </Text>

      {/* Social Links */}
      <group position={[0, -2.5, 0.1]}>
        {Object.entries(social).map(([platform, url], index) => (
          <Text
            key={platform}
            position={[index - 0.5, 0, 0]}
            fontSize={0.15}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
            onClick={() => window.open(url, '_blank')}
          >
            {platform}
          </Text>
        ))}
      </group>
    </animated.group>
  );
}

const teamMembers = [
  {
    name: 'Alex Kumar',
    role: 'President',
    image: '/assets/images/team/president.jpg',
    bio: 'Leading EDC with a passion for innovation and entrepreneurship.',
    social: {
      LinkedIn: 'https://linkedin.com/in/alex-kumar',
      Twitter: 'https://twitter.com/alex_kumar'
    }
  },
  // Add more team members here
];

function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/cyberpunk.woff"
      >
        Our Team
      </Text>

      {/* Team Grid */}
      <group position={[0, 0, -5]}>
        {teamMembers.map((member, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const position = [
            (col - 1) * 3,
            2 - row * 3,
            0
          ];

          return (
            <MemberCard
              key={member.name}
              {...member}
              position={position}
              onClick={() => setSelectedMember(member)}
            />
          );
        })}
      </group>

      {/* Modal */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </group>
  );
}

export default TeamSection;