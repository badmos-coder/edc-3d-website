import React, { useRef, useState } from 'react';
import { Text, Plane, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';

function GalleryImage({ position, image, title, onClick, index }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(image);
  
  // Calculate grid position
  const row = Math.floor(index / 3);
  const col = index % 3;
  const xPos = (col - 1) * 4;
  const yPos = (row - 1) * 3;
  const finalPosition = [xPos, yPos, 0];

  const { scale, glow } = useSpring({
    scale: hovered ? 1.1 : 1,
    glow: hovered ? 1 : 0.3,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.z = Math.sin(time + index) * 0.1;
  });

  return (
    <animated.group
      ref={meshRef}
      position={finalPosition}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Plane args={[3, 2]}>
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissiveIntensity={glow}
          emissive="#ffffff"
        />
      </Plane>
      
      <Text
        position={[0, -1.2, 0.1]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </animated.group>
  );
}

function ImageModal({ image, title, onClose }) {
  const [spring] = useSpring(() => ({
    scale: 1,
    from: { scale: 0 },
    config: { mass: 1, tension: 280, friction: 60 }
  }));

  return (
    <animated.group
      scale={spring.scale}
      onClick={onClose}
      position={[0, 0, 5]}
    >
      <Plane args={[6, 4]}>
        <meshStandardMaterial
          map={useTexture(image)}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </Plane>
      
      <Text
        position={[0, -2.2, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </animated.group>
  );
}

const galleryImages = [
  {
    image: '/assets/images/gallery/startup-weekend-1.jpg',
    title: 'Startup Weekend 2023'
  },
  {
    image: '/assets/images/gallery/hackathon-1.jpg',
    title: 'Hackathon Finals'
  },
  {
    image: '/assets/images/gallery/workshop-1.jpg',
    title: 'AI Workshop'
  },
  {
    image: '/assets/images/gallery/pitch-1.jpg',
    title: 'Pitch Competition'
  },
  {
    image: '/assets/images/gallery/networking-1.jpg',
    title: 'Networking Event'
  },
  {
    image: '/assets/images/gallery/awards-1.jpg',
    title: 'Awards Ceremony'
  },
  {
    image: '/assets/images/gallery/team-1.jpg',
    title: 'Team Building'
  },
  {
    image: '/assets/images/gallery/conference-1.jpg',
    title: 'Tech Conference'
  },
  {
    image: '/assets/images/gallery/summit-1.jpg',
    title: 'E-Summit 2023'
  }
];

function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/cyberpunk.woff"
      >
        Gallery
      </Text>
      
      {/* Gallery Grid */}
      {galleryImages.map((item, index) => (
        <GalleryImage
          key={index}
          index={index}
          {...item}
          onClick={() => setSelectedImage(item)}
        />
      ))}
      
      {/* Modal */}
      {selectedImage && (
        <ImageModal
          {...selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </group>
  );
}

export default GallerySection;