import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

function ParticleField({ count = 1000 }) {
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const x = Math.random() * 2000 - 1000
      const y = Math.random() * 2000 - 1000
      const z = Math.random() * 2000 - 1000

      temp.push({ time, factor, speed, x, y, z })
    }
    return temp
  }, [count])

  const particlesGeometry = useRef()

  useFrame((state) => {
    const positions = particlesGeometry.current.attributes.position.array

    particles.forEach((particle, i) => {
      const i3 = i * 3
      particle.time += particle.speed
      
      positions[i3] = particle.x + Math.sin(particle.time) * particle.factor
      positions[i3 + 1] = particle.y + Math.cos(particle.time) * particle.factor
      positions[i3 + 2] = particle.z + Math.sin(particle.time) * particle.factor
    })

    particlesGeometry.current.attributes.position.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry ref={particlesGeometry}>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={particles.length}
          array={new Float32Array(particles.length * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        color="#ffffff"
        transparent
        opacity={0.6}
      />
    </points>
  )
}

function FloatingObject({ position, scale, rotation, color }) {
  const mesh = useRef()
  const [spring, set] = useSpring(() => ({
    scale: scale,
    rotation: rotation,
    config: { mass: 1, tension: 280, friction: 60 }
  }))

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    mesh.current.position.y += Math.sin(time) * 0.002
  })

  const handlePointerOver = () => {
    set({
      scale: [scale[0] * 1.2, scale[1] * 1.2, scale[2] * 1.2],
      rotation: [rotation[0] + Math.PI / 4, rotation[1] + Math.PI / 4, rotation[2]]
    })
  }

  const handlePointerOut = () => {
    set({
      scale: scale,
      rotation: rotation
    })
  }

  return (
    <animated.mesh
      ref={mesh}
      position={position}
      scale={spring.scale}
      rotation={spring.rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <dodecahedronGeometry args={[1, 0]} />
      <MeshDistortMaterial
        color={color}
        speed={5}
        distort={0.3}
        radius={1}
      />
    </animated.mesh>
  )
}

function InteractiveEnvironment() {
  const floatingObjects = useMemo(() => [
    {
      position: [-5, 2, -5],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: '#ff6b6b'
    },
    {
      position: [5, -2, -3],
      scale: [1.2, 1.2, 1.2],
      rotation: [Math.PI / 4, 0, Math.PI / 4],
      color: '#4ecdc4'
    },
    {
      position: [0, 4, -4],
      scale: [0.8, 0.8, 0.8],
      rotation: [0, Math.PI / 4, 0],
      color: '#ffe66d'
    }
  ], [])

  return (
    <group>
      <ParticleField count={500} />
      
      {floatingObjects.map((obj, index) => (
        <Float
          key={index}
          speed={2}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <FloatingObject {...obj} />
        </Float>
      ))}

      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#000000"
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

export default InteractiveEnvironment