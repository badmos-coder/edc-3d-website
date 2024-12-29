import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Custom shader for portal effect
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 1.0, 1.0),
    uProgress: 0
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uProgress;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Create circular portal effect
      float dist = length(vUv - 0.5);
      float circle = smoothstep(0.5, 0.0, dist);
      
      // Add ripple effect
      float ripple = sin(dist * 20.0 - uTime * 5.0) * 0.5 + 0.5;
      
      // Create energy field effect
      float energy = sin(vUv.x * 20.0 + uTime) * cos(vUv.y * 20.0 + uTime) * 0.5 + 0.5;
      
      // Combine effects based on progress
      float alpha = circle * (1.0 - uProgress) + ripple * uProgress;
      vec3 color = mix(uColor, vec3(1.0), energy * 0.5);
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ PortalMaterial });

function PortalEffect({ position, color = '#00ffff', progress = 0 }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
      materialRef.current.uProgress = progress;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[5, 5, 32, 32]} />
      <portalMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uColor={new THREE.Color(color)}
      />
    </mesh>
  );
}

export default PortalEffect;