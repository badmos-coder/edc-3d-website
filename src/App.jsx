import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import styled from 'styled-components'
import LoadingScreen from './components/ui/LoadingScreen'
import SoundControls from './components/ui/SoundControls'
import Experience from './components/Experience'
import { useLoadingManager } from './systems/LoadingManager'

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
`

function App() {
  const { isLoading, progress } = useLoadingManager()

  return (
    <AppContainer>
      {isLoading ? (
        <LoadingScreen progress={progress} />
      ) : (
        <>
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
          <SoundControls />
        </>
      )}
    </AppContainer>
  )
}

export default App