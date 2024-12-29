import React, { useState, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSpring, animated } from '@react-spring/three'
import styled from 'styled-components'

const NavigationOverlay = styled.div`
  position: fixed;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 100;
`

const NavDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.2);
    background: #fff;
  }

  &:hover::before {
    content: '${props => props.label}';
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    font-size: 14px;
    white-space: nowrap;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`

function NavigationPoint({ position, text, isActive, onClick }) {
  const [hovered, setHovered] = useState(false)
  
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  })

  return (
    <animated.group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? '#ffffff' : '#666666'}
          emissive={isActive ? '#5588ff' : '#222222'}
          emissiveIntensity={isActive ? 2 : 0.5}
        />
      </mesh>
      <Text
        position={[0.3, 0, 0]}
        fontSize={0.2}
        color={isActive ? '#ffffff' : '#888888'}
        anchorX="left"
        anchorY="middle"
      >
        {text}
      </Text>
    </animated.group>
  )
}

const sections = [
  { id: 'home', label: 'Home', position: [5, 4, 0] },
  { id: 'about', label: 'About', position: [5, 2, 0] },
  { id: 'events', label: 'Events', position: [5, 0, 0] },
  { id: 'gallery', label: 'Gallery', position: [5, -2, 0] },
  { id: 'contact', label: 'Contact', position: [5, -4, 0] }
]

function Navigation3D() {
  const [activeSection, setActiveSection] = useState('home')
  const { camera } = useThree()

  const handleSectionChange = (sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    if (section) {
      // Animate camera movement
      gsap.to(camera.position, {
        x: section.position[0] - 5,
        y: section.position[1],
        z: 8,
        duration: 2,
        ease: 'power3.inOut'
      })
      setActiveSection(sectionId)
    }
  }

  useFrame((state) => {
    // Add subtle camera movement
    state.camera.position.y += Math.sin(state.clock.getElapsedTime() * 0.5) * 0.001
  })

  return (
    <>
      <group>
        {sections.map((section) => (
          <NavigationPoint
            key={section.id}
            position={section.position}
            text={section.label}
            isActive={activeSection === section.id}
            onClick={() => handleSectionChange(section.id)}
          />
        ))}
      </group>

      <NavigationOverlay>
        {sections.map((section) => (
          <NavDot
            key={section.id}
            active={activeSection === section.id}
            onClick={() => handleSectionChange(section.id)}
            label={section.label}
          />
        ))}
      </NavigationOverlay>
    </>
  )
}

export default Navigation3D