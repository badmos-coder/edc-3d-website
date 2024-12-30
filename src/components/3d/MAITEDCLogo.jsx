import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Float } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'

const MAITEDCLogo = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()
  const [springs, api] = useSpring(() => ({
    scale: scale,
    config: { mass: 1, tension: 280, friction: 60 }
  }))

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1
  })

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <animated.group
        ref={groupRef}
        position={position}
        scale={springs.scale}
      >
        {/* EDC Text */}
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          position={[-2, 0, 0]}
        >
          EDC
          <meshStandardMaterial
            color="#00B4D8"
            emissive="#00B4D8"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>

        {/* MAIT Text */}
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.01}
          bevelOffset={0}
          bevelSegments={3}
          position={[-1.5, -1, 0]}
        >
          MAIT
          <meshStandardMaterial
            color="#FF0000"
            emissive="#FF0000"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>

        {/* Decorative elements */}
        <mesh position={[-3, 0.5, -0.1]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial
            color="#00B4D8"
            emissive="#00B4D8"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[2, 0.5, -0.1]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial
            color="#FF0000"
            emissive="#FF0000"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </animated.group>
    </Float>
  )
}

export default MAITEDCLogo