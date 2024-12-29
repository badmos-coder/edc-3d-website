import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
  Stars,
  Text3D,
  useGLTF,
  useAnimations
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { gsap } from 'gsap'
import styled from 'styled-components'

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const Title = styled.h1`
  font-size: 8vw;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  opacity: 0;
  transform: translateY(50px);
`

function FloatingLogo() {
  const logo = useRef()
  
  useEffect(() => {
    gsap.to(logo.current.position, {
      y: '+=0.5',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }, [])

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={1}
      ref={logo}
    >
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
      >
        EDC
        <meshStandardMaterial
          color="#ffffff"
          emissive="#5588ff"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Text3D>
    </Float>
  )
}

function Environment3D() {
  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <fog attach="fog" args={['#000', 10, 50]} />
      <Environment preset="city" />
    </>
  )
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.025}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.005, 0.005]}
      />
    </EffectComposer>
  )
}

function Experience() {
  const overlay = useRef()
  const title = useRef()

  useEffect(() => {
    // Animate overlay
    gsap.to(overlay.current, {
      opacity: 0,
      duration: 2,
      delay: 1
    })

    // Animate title
    gsap.to(title.current, {
      opacity: 1,
      y: 0,
      duration: 2,
      delay: 0.5,
      ease: 'power3.out'
    })
  }, [])

  return (
    <>
      <CanvasContainer>
        <Canvas
          camera={{ position: [0, 0, 15], fov: 50 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
          }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={['#000000']} />
            
            <PerspectiveCamera makeDefault position={[0, 0, 15]} />
            
            <Environment3D />
            
            <FloatingLogo />
            
            <Effects />
            
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </CanvasContainer>

      <Overlay ref={overlay}>
        <Title ref={title}>
          Welcome to EDC
        </Title>
      </Overlay>
    </>
  )
}

export default Experience