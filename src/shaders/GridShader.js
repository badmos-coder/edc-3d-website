import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'

const GridMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 1.0, 1.0),
    uScale: 1.0,
    uIntensity: 1.0
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uScale;
    uniform float uIntensity;
    
    varying vec2 vUv;
    varying vec3 vPosition;

    float grid(vec2 st, float res) {
      vec2 grid = fract(st * res);
      return (step(res, grid.x) * step(res, grid.y));
    }

    void main() {
      // Create grid pattern
      vec2 grid_uv = vUv * uScale;
      float pattern = 0.0;
      
      // Multiple layers of grids
      for(float i = 1.0; i < 4.0; i++) {
        pattern += grid(grid_uv + uTime * (0.1 * i), 0.02 * i) * (1.0 / i);
      }
      
      // Add pulse effect
      float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
      pattern *= pulse * uIntensity;
      
      // Add distance fade
      float dist = length(vUv - 0.5);
      float fade = smoothstep(1.0, 0.0, dist);
      
      // Final color
      vec3 color = uColor * pattern * fade;
      color += uColor * 0.1; // Add ambient glow
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ GridMaterial })

function GridBackground() {
  return (
    <mesh scale={[100, 100, 1]} position={[0, 0, -50]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <gridMaterial transparent={true} />
    </mesh>
  )
}

// Animation component to update shader uniforms
function AnimatedGrid() {
  const materialRef = useRef()

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
      materialRef.current.uIntensity = 1.0 + Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <GridBackground ref={materialRef} />
  )
}

export { GridBackground, AnimatedGrid }