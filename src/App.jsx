import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import LoadingScreen from './components/ui/LoadingScreen';
import SoundControls from './components/ui/SoundControls';
import Experience from './components/Experience';
import { loadingManager, useLoading } from './systems/LoadingManager';
import { audioManager } from './systems/AudioManager';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
`;

function App() {
  const { isLoading, progress } = useLoading();
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const loadedAssets = await loadingManager.loadAll();
        setAssets(loadedAssets);
        // Start background music after assets are loaded
        audioManager.startBackground();
      } catch (error) {
        console.error('Failed to load assets:', error);
      }
    };

    loadAssets();

    // Cleanup function
    return () => {
      audioManager.stopBackground();
    };
  }, []);

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
              stencil: false,
              depth: true
            }}
          >
            <Suspense fallback={null}>
              <Experience assets={assets} />
            </Suspense>
          </Canvas>
          <SoundControls />
        </>
      )}
    </AppContainer>
  );
}

export default App;