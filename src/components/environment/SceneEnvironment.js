import React from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        color="#000000"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function Lights() {
  const { scene } = useThree();

  React.useEffect(() => {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);

    // Add directional light
    const dirLight = new THREE.DirectionalLight('#ffffff', 1);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Add point lights for cyberpunk effect
    const colors = ['#00ffff', '#ff00ff', '#ffff00'];
    const pointLights = colors.map((color, index) => {
      const light = new THREE.PointLight(color, 2, 10);
      const angle = (index / colors.length) * Math.PI * 2;
      light.position.set(
        Math.cos(angle) * 5,
        2,
        Math.sin(angle) * 5
      );
      return light;
    });

    pointLights.forEach(light => scene.add(light));

    return () => {
      scene.remove(ambientLight);
      scene.remove(dirLight);
      pointLights.forEach(light => scene.remove(light));
    };
  }, [scene]);

  return null;
}

function SceneEnvironment() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 10, 50]} />
      
      <Lights />
      <Ground />
      
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      <Environment
        preset="night"
        background
        blur={0.5}
      />
    </>
  );
}

export default SceneEnvironment;
