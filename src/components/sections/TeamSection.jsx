// src/components/sections/TeamSection.jsx
import React, { useRef, useState } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { animated, useSpring } from '@react-spring/three'

const TeamMemberCard = ({ position, name, role, description, onClick }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  const springProps = useSpring({
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.position.y += Math.sin(time + position[0]) * 0.002
  })

  return (
    <animated.group
      ref={meshRef}
      position={position}
      scale={springProps.scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Member Card Background */}
      <mesh>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial
          color="#00B4D8"
          emissive="#00B4D8"
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Hexagonal Profile Picture Frame */}
      <mesh position={[0, 0.7, 0.1]}>
        <circleGeometry args={[0.5, 6]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Member Information */}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>

      <Text
        position={[0, -0.3, 0.2]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {role}
      </Text>

      <Text
        position={[0, -0.8, 0.2]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {description}
      </Text>
    </animated.group>
  )
}

const TeamSection = ({ onClose }) => {
  const [selectedMember, setSelectedMember] = useState(null)
  const groupRef = useRef()

  const springProps = useSpring({
    scale: 1,
    opacity: 1,
    from: { scale: 0, opacity: 0 },
    config: { mass: 1, tension: 280, friction: 60 }
  })

  const teamMembers = [
    {
      name: "Alex Kumar",
      role: "President",
      description: "Leading EDC with a passion for innovation and entrepreneurship.",
      position: [-4, 1, 0]
    },
    {
      name: "Sarah Singh",
      role: "Vice President",
      description: "Driving initiatives to foster startup culture in MAIT.",
      position: [0, 1, 0]
    },
    {
      name: "Rahul Sharma",
      role: "Technical Head",
      description: "Building the technical foundation for our future entrepreneurs.",
      position: [4, 1, 0]
    },
    {
      name: "Priya Patel",
      role: "Marketing Head",
      description: "Creating impactful strategies for EDC's growth and outreach.",
      position: [-4, -2, 0]
    },
    {
      name: "Arjun Gupta",
      role: "Event Coordinator",
      description: "Organizing engaging events that inspire innovation.",
      position: [0, -2, 0]
    },
    {
      name: "Maya Verma",
      role: "Content Lead",
      description: "Crafting compelling narratives for our entrepreneurial journey.",
      position: [4, -2, 0]
    }
  ]

  return (
    <animated.group
      ref={groupRef}
      scale={springProps.scale}
      opacity={springProps.opacity}
    >
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00B4D8"
        anchorX="center"
        anchorY="middle"
      >
        Our Team
      </Text>

      {teamMembers.map((member, index) => (
        <TeamMemberCard
          key={index}
          {...member}
          onClick={() => setSelectedMember(member)}
        />
      ))}

      {selectedMember && (
        <animated.group
          position={[0, 0, 2]}
          scale={useSpring({
            from: { scale: 0 },
            to: { scale: 1 },
            config: { mass: 1, tension: 280, friction: 60 }
          }).scale}
        >
          <mesh onClick={() => setSelectedMember(null)}>
            <planeGeometry args={[6, 4]} />
            <meshStandardMaterial
              color="#00B4D8"
              transparent
              opacity={0.9}
            />
          </mesh>

          <Text
            position={[0, 1, 0.1]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {selectedMember.name}
          </Text>

          <Text
            position={[0, 0.5, 0.1]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {selectedMember.role}
          </Text>

          <Text
            position={[0, -0.5, 0.1]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={5}
          >
            {selectedMember.description}
          </Text>
        </animated.group>
      )}
    </animated.group>
  )
}

export default TeamSection