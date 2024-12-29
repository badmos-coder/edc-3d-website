import { useEffect, useRef } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
  ShaderPass,
  GlitchPass
} from 'three/examples/jsm/postprocessing/EffectComposer'
import { Vector2 } from 'three'

// Custom cyber effect shader
const CyberShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0.5 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Scanline effect
      float scanline = sin(uv.y * 100.0 + uTime * 10.0) * 0.1;
      
      // Chromatic aberration
      float shift = uIntensity * 0.01;
      vec4 r = texture2D(tDiffuse, vec2(uv.x + shift, uv.y));
      vec4 g = texture2D(tDiffuse, uv);
      vec4 b = texture2D(tDiffuse, vec2(uv.x - shift, uv.y));
      
      // Combine effects
      vec4 color = vec4(r.r, g.g, b.b, 1.0);
      color.rgb += vec3(scanline);
      
      // Add noise
      float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      color.rgb += noise * 0.03;
      
      // Add glow
      vec4 originalColor = texture2D(tDiffuse, uv);
      float brightness = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));
      vec4 glow = originalColor * brightness * uIntensity;
      
      gl_FragColor = color + glow;
    }
  `
}

// Create the CyberShaderPass
class CyberShaderPass extends ShaderPass {
  constructor() {
    super(CyberShader)
  }
}

extend({ EffectComposer, RenderPass, UnrealBloomPass, GlitchPass, CyberShaderPass })

function PostProcessing() {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()
  const cyberPass = useRef()
  const bloomPass = useRef()
  const glitchPass = useRef()

  useEffect(() => {
    composer.current.setSize(size.width, size.height)
  }, [size])

  useFrame((state) => {
    // Update shader uniforms
    if (cyberPass.current) {
      cyberPass.current.uniforms.uTime.value = state.clock.elapsedTime
      cyberPass.current.uniforms.uIntensity.value = 0.5 + Math.sin(state.clock.elapsedTime) * 0.2
    }

    // Update bloom intensity
    if (bloomPass.current) {
      bloomPass.current.strength = 1.5 + Math.sin(state.clock.elapsedTime) * 0.2
    }

    // Random glitch effect
    if (glitchPass.current) {
      glitchPass.current.goWild = Math.random() > 0.99 // Occasional intense glitch
    }

    composer.current.render()
  })

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      
      <unrealBloomPass
        ref={bloomPass}
        attachArray="passes"
        args={[new Vector2(size.width, size.height), 1.5, 0.4, 0.85]}
      />
      
      <cyberShaderPass ref={cyberPass} attachArray="passes" />
      
      <glitchPass
        ref={glitchPass}
        attachArray="passes"
        factor={0.5}
      />
    </effectComposer>
  )
}

export default PostProcessing