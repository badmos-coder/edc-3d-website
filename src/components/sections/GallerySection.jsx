// src/components/sections/GallerySection.js
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

const ImagePlane = ({ position, imageUrl, title, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const { scale } = useSpring({
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(time + position[0]) * 0.001;
  });

  return (
    <animated.group
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial
          color="#00B4D8"
          transparent
          opacity={0.1}
        />
      </mesh>
      <Text
        position={[0, -1, 0]}
        fontSize={0.1}
        color="#00B4D8"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </animated.group>
  );
};

function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const groupRef = useRef();

  const images = [
    { id: 1, title: 'Startup Weekend', url: '/images/gallery/startup.jpg' },
    { id: 2, title: 'Hackathon', url: '/images/gallery/hackathon.jpg' },
    { id: 3, title: 'Workshop', url: '/images/gallery/workshop.jpg' },
    { id: 4, title: 'E-Summit', url: '/images/gallery/esummit.jpg' }
  ];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#00B4D8"
        anchorX="center"
        anchorY="middle"
      >
        Gallery
      </Text>

      {images.map((image, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        return (
          <ImagePlane
            key={image.id}
            position={[col * 3 - 1.5, row * -2, 0]}
            imageUrl={image.url}
            title={image.title}
            onClick={() => setSelectedImage(image)}
          />
        );
      })}

      {selectedImage && (
        <group position={[0, 0, 2]}>
          <mesh
            onClick={() => setSelectedImage(null)}
          >
            <planeGeometry args={[4, 3]} />
            <meshBasicMaterial
              color="#00B4D8"
              transparent
              opacity={0.2}
            />
          </mesh>
          <Text
            position={[0, -1.7, 0.1]}
            fontSize={0.2}
            color="#00B4D8"
            anchorX="center"
            anchorY="middle"
          >
            {selectedImage.title}
          </Text>
        </group>
      )}
    </group>
  );
}

export default GallerySection;