import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// Custom shader for portal effect
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#00B4D8'),
    uColorEnd: new THREE.Color('#FF0000')
  },
  // Vertex shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;
    
    void main() {
      // Create circular portal effect
      vec2 center = vec2(0.5);
      float dist = length(vUv - center);
      float circle = smoothstep(0.5, 0.2, dist);
      
      // Add ripple effect
      float ripple = sin(dist * 50.0 - uTime * 3.0) * 0.1;
      circle += ripple;
      
      // Create color gradient
      vec3 color = mix(uColorStart, uColorEnd, vUv.y);
      
      // Add glow effect
      float glow = exp(-dist * 3.0);
      color += glow * 0.5;
      
      gl_FragColor = vec4(color, circle);
    }
  `
)

// Extend Three.js with our custom material
extend({ PortalMaterial })

const PortalEffect = ({ position = [0, 0, 0] }) => {
  const portalRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    materialRef.current.uTime = state.clock.getElapsedTime()
    portalRef.current.rotation.z += 0.001
  })

  return (
    <mesh
      ref={portalRef}
      position={position}
    >
      <planeGeometry args={[5, 5]} />
      <portalMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default PortalEffect