import React, { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useSprings, animated } from '@react-spring/three'
import { gsap } from 'gsap'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const TransitionMaterial = shaderMaterial(
  {
    uProgress: 0,
    uTexture: null
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
    uniform float uProgress;
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Add some distortion based on progress
      float distortion = sin(uv.y * 10.0 + uProgress * 2.0) * 0.1 * uProgress;
      uv.x += distortion;
      
      vec4 color = texture2D(uTexture, uv);
      
      // Add a glow effect during transition
      float glow = (1.0 - uProgress) * 0.5;
      color.rgb += glow;
      
      gl_FragColor = color;
    }
  `
)

function TransitionPlane({ texture, progress }) {
  const material = useRef()

  useEffect(() => {
    material.current.uTexture = texture
  }, [texture])

  useEffect(() => {
    material.current.uProgress = progress
  }, [progress])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <transitionMaterial ref={material} />
    </mesh>
  )
}
function SceneTransition({ onTransitionComplete }) {
    const { gl, scene, camera } = useThree()
    const transitionRenderTarget = useRef(new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight))
    const [springs, api] = useSprings(2, i => ({
      position: [0, i * 10, 0],
      scale: 1,
      rotation: [0, 0, 0],
      config: { mass: 1, tension: 280, friction: 60 }
    }))
  
    const captureScene = () => {
      const currentCamera = camera
      const currentScene = scene
      gl.setRenderTarget(transitionRenderTarget.current)
      gl.render(currentScene, currentCamera)
      gl.setRenderTarget(null)
      return transitionRenderTarget.current.texture
    }
  
    const triggerTransition = async (nextScene) => {
      const prevTexture = captureScene()
  
      // Animate transition
      await new Promise(resolve => {
        gsap.to({}, {
          duration: 1.5,
          onUpdate: (progress) => {
            material.current.uProgress = progress
          },
          onComplete: resolve
        })
      })
  
      onTransitionComplete(nextScene)
    }
  
    return (
      <group>
        {springs.map((props, i) => (
          <animated.group key={i} {...props}>
            <TransitionPlane
              texture={i === 0 ? transitionRenderTarget.current.texture : null}
              progress={0}
            />
          </animated.group>
        ))}
      </group>
    )
  }
  
  export default SceneTransition
  