// src/App.jsx
import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import styled from 'styled-components'
import LoadingScreen from './components/ui/LoadingScreen'
import Experience from './components/Experience'

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
`

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate asset loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000) // 5 seconds loading time - adjust as needed

    return () => clearTimeout(timer)
  }, [])

  return (
    <AppContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      )}
    </AppContainer>
  )
}

export default App