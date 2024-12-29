import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Loader } from '@react-three/drei'
import styled from 'styled-components'
import { AnimatePresence } from 'framer-motion'

// Import components
import Experience from './components/Experience'
import Navigation3D from './components/ui/Navigation3D'
import CyberpunkInterface from './components/ui/CyberpunkInterface'
import { AnimatedGrid } from './shaders/GridShader'
import InteractiveEnvironment from './components/3d/InteractiveEnvironment'
import SceneTransition from './components/3d/SceneTransition'

const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
`

const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00ffff;
  font-family: 'Cyberpunk', monospace;
  z-index: 1000;
`

function App() {
  return (
    <AppContainer>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#000000']} />
          
          {/* Main 3D Experience */}
          <Experience />
          
          {/* Interactive Environment */}
          <InteractiveEnvironment />
          
          {/* Animated Grid Background */}
          <AnimatedGrid />
          
          {/* Navigation System */}
          <Navigation3D />
          
          {/* Scene Transition Effects */}
          <SceneTransition />
          
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* 2D UI Overlay */}
      <AnimatePresence>
        <CyberpunkInterface />
      </AnimatePresence>

      {/* Loading Screen */}
      <Loader
        containerStyles={{
          background: '#000',
          color: '#00ffff'
        }}
        innerStyles={{
          backgroundColor: '#00ffff'
        }}
        barStyles={{
          backgroundColor: '#00ffff'
        }}
        dataStyles={{
          color: '#00ffff'
        }}
        dataInterpolation={(p) => `Loading EDC Experience ${p.toFixed(2)}%`}
      />
    </AppContainer>
  )
}

export default App