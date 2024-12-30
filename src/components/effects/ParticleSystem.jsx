// src/components/effects/ParticleSystem.jsx
import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleSystem = ({ count = 1000 }) => {
  const points = useRef()
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const distance = Math.random() * 10 + 5
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(360)

      let x = distance * Math.sin(theta) * Math.cos(phi)
      let y = distance * Math.sin(theta) * Math.sin(phi)
      let z = distance * Math.cos(theta)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    
    return positions
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      points.current.geometry.attributes.position.array[i3] += Math.sin(time + i) * 0.001
      points.current.geometry.attributes.position.array[i3 + 1] += Math.cos(time + i) * 0.001
      points.current.geometry.attributes.position.array[i3 + 2] += Math.sin(time + i) * 0.001
    }

    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00B4D8"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default ParticleSystem