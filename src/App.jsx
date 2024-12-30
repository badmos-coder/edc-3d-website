// src/App.jsx
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import { Loader } from '@react-three/drei'; // Import Loader for better progress handling
import LoadingScreen from './components/ui/LoadingScreen';
import Experience from './components/Experience';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppContainer>
      {isLoading ? (
        <LoadingScreen onFinish={() => setIsLoading(false)} /> // Pass a callback to LoadingScreen
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
            <Suspense fallback={<LoadingScreen />}>
              <Experience />
            </Suspense>
          </Canvas>
          <Loader /> {/* Provides loading feedback for assets */}
        </>
      )}
    </AppContainer>
  );
}

export default App;
