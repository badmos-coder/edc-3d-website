import React, { useRef, useState } from 'react';
import { Text, Plane, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';

function EventCard({ position, title, date, description, image, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(image);

  const { scale, rotation, glowIntensity } = useSpring({
    scale: hovered ? 1.1 : 1,
    rotation: hovered ? [0, Math.PI * 0.05, 0] : [0, 0, 0],
    glowIntensity: hovered ? 1 : 0.3,
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
      {/* Event Image */}
      <Plane args={[3, 2]}>
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissiveIntensity={glowIntensity}
          emissive="#ffffff"
        />
      </Plane>

      {/* Event Title */}
      <Text
        position={[0, 1.2, 0.1]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/cyberpunk.woff"
      >
        {title}
      </Text>

      {/* Event Date */}
      <Text
        position={[0, -1.1, 0.1]}
        fontSize={0.15}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        {date}
      </Text>

      {/* Event Description */}
      <Text
        position={[0, -1.4, 0.1]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
      >
        {description}
      </Text>
    </animated.group>
  );
}

function EventsCarousel({ events }) {
  const groupRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
  const rotationSpeed = useRef(0);

  useFrame(() => {
    groupRef.current.rotation.y += rotationSpeed.current;
    rotationSpeed.current *= 0.95; // Damping
  });

  const handleNext = () => {
    rotationSpeed.current = -0.1;
    setActiveIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    rotationSpeed.current = 0.1;
    setActiveIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <group ref={groupRef}>
      {events.map((event, index) => {
        const angle = (index * Math.PI * 2) / events.length;
        const radius = 8;
        const position = [
          Math.sin(angle) * radius,
          0,
          Math.cos(angle) * radius
        ];
        return (
          <EventCard
            key={index}
            {...event}
            position={position}
            rotation={[0, -angle, 0]}
          />
        );
      })}
      
      {/* Navigation Arrows */}
      <group position={[0, 0, radius + 2]}>
        <mesh onClick={handlePrev}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
        </mesh>
      </group>
      <group position={[0, 0, -(radius + 2)]}>
        <mesh onClick={handleNext}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

const events = [
  {
    title: 'Startup Weekend',
    date: 'March 15-17, 2024',
    description: 'An intense 54-hour event where entrepreneurs come together to build startups from scratch.',
    image: '/assets/images/startup-weekend.jpg'
  },
  {
    title: 'Innovation Summit',
    date: 'April 5, 2024',
    description: 'Annual gathering of industry leaders, innovators, and entrepreneurs.',
    image: '/assets/images/innovation-summit.jpg'
  },
  {
    title: 'Pitch Perfect',
    date: 'April 20, 2024',
    description: 'Learn the art of pitching from successful entrepreneurs and investors.',
    image: '/assets/images/pitch-perfect.jpg'
  },
  {
    title: 'Tech Expo',
    date: 'May 10, 2024',
    description: 'Showcase of cutting-edge technology and innovative solutions.',
    image: '/assets/images/tech-expo.jpg'
  },
  {
    title: 'E-Summit 2024',
    date: 'May 25-26, 2024',
    description: 'The flagship event of EDC featuring workshops, competitions, and networking opportunities.',
    image: '/assets/images/e-summit.jpg'
  }
];

function EventsSection() {
  const sectionRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    sectionRef.current.position.y = Math.sin(time * 0.5) * 0.2;
  });

  return (
    <group ref={sectionRef}>
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/cyberpunk.woff"
      >
        Upcoming Events
      </Text>
      
      <EventsCarousel events={events} />
    </group>
  );
}

export default EventsSection;