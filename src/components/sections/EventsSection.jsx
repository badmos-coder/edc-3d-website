// src/components/sections/EventsSection.js
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
//import * as THREE from 'three';

const EventCard = ({ position, title, date, description, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const { scale } = useSpring({
    scale: hovered ? 1.1 : 1,
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
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial
          color="#00B4D8"
          emissive="#00B4D8"
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      <Text
        position={[0, 0.5, 0.1]}
        fontSize={0.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.15}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {date}
      </Text>
      
      <Text
        position={[0, -0.5, 0.1]}
        fontSize={0.1}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {description}
      </Text>
    </animated.group>
  );
};

function EventsSection() {
  const groupRef = useRef();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const carouselRadius = 8;

  const events = [
    {
      title: "Startup Weekend",
      date: "March 15-17, 2024",
      description: "48-hour intensive startup building experience"
    },
    {
      title: "Innovation Summit",
      date: "April 5, 2024",
      description: "Annual gathering of innovators and entrepreneurs"
    },
    {
      title: "Pitch Perfect",
      date: "April 20, 2024",
      description: "Learn the art of pitching from industry experts"
    }
  ];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00B4D8"
        anchorX="center"
        anchorY="middle"
      >
        Upcoming Events
      </Text>

      {events.map((event, index) => {
        const angle = (index / events.length) * Math.PI * 2;
        const x = Math.cos(angle) * carouselRadius;
        const z = Math.sin(angle) * carouselRadius;
        
        return (
          <EventCard
            key={event.title}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
            {...event}
            onClick={() => setSelectedEvent(event)}
          />
        );
      })}

      {selectedEvent && (
        <group
          position={[0, 0, 2]}
          onClick={() => setSelectedEvent(null)}
        >
          <mesh>
            <planeGeometry args={[6, 4]} />
            <meshStandardMaterial
              color="#00B4D8"
              transparent
              opacity={0.9}
            />
          </mesh>
          
          <Text
            position={[0, 1, 0.1]}
            fontSize={0.3}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {selectedEvent.title}
          </Text>
          
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {selectedEvent.date}
          </Text>
          
          <Text
            position={[0, -1, 0.1]}
            fontSize={0.15}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            maxWidth={5}
          >
            {selectedEvent.description}
          </Text>
        </group>
      )}
    </group>
  );
}

export default EventsSection;