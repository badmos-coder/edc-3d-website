// src/App.js
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Loader } from '@react-three/drei';
import styled from 'styled-components';
import { AudioProvider } from './systems/AudioSystem';
import Experience from './components/Experience';
import ParticleSystem from './components/effects/ParticleSystem';
import PostProcessing from './components/effects/PostProcessing';
import CameraController from './components/controllers/CameraController';
import EventSystem from './systems/EventSystem';
import CyberpunkInterface from './components/ui/CyberpunkInterface';
import LoadingScreen from './components/ui/LoadingScreen';

const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppContainer>
      <AudioProvider>
        {isLoading && <LoadingScreen />}
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
            <EventSystem>
              <Experience />
              <ParticleSystem />
              <PostProcessing />
              <CameraController onTransitionComplete={() => setIsLoading(false)} />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
              />
            </EventSystem>
          </Suspense>
        </Canvas>
        <CyberpunkInterface />
        <Loader />
      </AudioProvider>
    </AppContainer>
  );
}

export default App;