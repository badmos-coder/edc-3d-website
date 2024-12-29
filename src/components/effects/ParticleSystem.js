import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'

const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 1.0, 1.0),
    uPixelRatio: 1,
    uSize: 100
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uSize;
    
    attribute float aScale;
    attribute vec3 aRandomness;
    
    varying vec3 vColor;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Rotation
      float angle = atan(modelPosition.x, modelPosition.z);
      float distanceToCenter = length(modelPosition.xz);
      float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
      angle += angleOffset;
      
      modelPosition.x = cos(angle) * distanceToCenter;
      modelPosition.z = sin(angle) * distanceToCenter;
      
      // Randomness
      modelPosition.xyz += aRandomness;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      // Size
      gl_PointSize = uSize * aScale * uPixelRatio;
      gl_PointSize *= (1.0 / - viewPosition.z);
      
      // Color
      vColor = color;
    }
  `,
  // Fragment Shader
  `
    varying vec3 vColor;
    
    void main() {
      // Disc pattern
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - strength;
      strength = pow(strength, 10.0);
      
      // Final color
      vec3 color = mix(vec3(0.0), vColor, strength);
      gl_FragColor = vec4(color, strength);
    }
  `
)

function generateParticleAttributes(count) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const randomness = new Float32Array(count * 3)

  const insideColor = new THREE.Color('#00ffff')
  const outsideColor = new THREE.Color('#ff00ff')

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // Position
    const radius = Math.random() * 10 + 5
    const spinAngle = radius * Math.random()
    const branchAngle = (i % 3) * ((Math.PI * 2) / 3)

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius
    positions[i3 + 1] = (Math.random() - 0.5) * 3
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius

    // Randomness
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)

    randomness[i3] = randomX
    randomness[i3 + 1] = randomY
    randomness[i3 + 2] = randomZ

    // Color
    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, radius / 15)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    // Scale
    scales[i] = Math.random()
  }

  return {
    positions,
    colors,
    scales,
    randomness
  }
}

function ParticleSystem({ count = 5000 }) {
  const { positions, colors, scales, randomness } = useMemo(
    () => generateParticleAttributes(count),
    [count]
  )

  const materialRef = useRef()
  const pointsRef = useRef()

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={count}
          array={scales}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandomness"
          count={count}
          array={randomness}
          itemSize={3}
        />
      </bufferGeometry>
      <particleMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  )
}

export default ParticleSystem