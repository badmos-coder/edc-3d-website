import { useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Suspense, useEffect, useRef } from 'react'
import { animated, useSpring } from '@react-spring/three'

const models = {
  edcLogo: '/assets/models/edc-logo.glb',
  futureCity: '/assets/models/future-city.glb',
  cyberProps: '/assets/models/cyber-props.glb'
}

// Initialize DRACO loader for compressed models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

// Configure GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

export function Model({ name, position, rotation, scale, onClick }) {
  const gltf = useLoader(GLTFLoader, models[name])
  const modelRef = useRef()
  const { camera } = useThree()

  const [springs, api] = useSpring(() => ({
    scale: scale || [1, 1, 1],
    rotation: rotation || [0, 0, 0],
    position: position || [0, 0, 0],
    config: { mass: 1, tension: 280, friction: 60 }
  }))

  useEffect(() => {
    // Add hover animation
    const handlePointerOver = () => {
      api.start({
        scale: scale?.map(s => s * 1.1) || [1.1, 1.1, 1.1]
      })
    }

    const handlePointerOut = () => {
      api.start({
        scale: scale || [1, 1, 1]
      })
    }

    const mesh = modelRef.current
    if (mesh) {
      mesh.addEventListener('pointerover', handlePointerOver)
      mesh.addEventListener('pointerout', handlePointerOut)
    }

    return () => {
      if (mesh) {
        mesh.removeEventListener('pointerover', handlePointerOver)
        mesh.removeEventListener('pointerout', handlePointerOut)
      }
    }
  }, [api, scale])

  useEffect(() => {
    // Look at camera effect for certain models
    if (name === 'edcLogo') {
      const mesh = modelRef.current
      if (mesh) {
        mesh.lookAt(camera.position)
      }
    }
  }, [camera, name])

  return (
    <animated.group
      ref={modelRef}
      {...springs}
      onClick={onClick}
      dispose={null}
    >
      <primitive object={gltf.scene} />
    </animated.group>
  )
}

export function ModelScene({ models }) {
  return (
    <Suspense fallback={null}>
      {models.map((model, index) => (
        <Model key={`${model.name}-${index}`} {...model} />
      ))}
    </Suspense>
  )
}

// Helper function to preload models
export function preloadModels() {
  return Promise.all(
    Object.values(models).map(url =>
      new Promise((resolve, reject) => {
        gltfLoader.load(
          url,
          resolve,
          undefined,
          reject
        )
      })
    )
  )
}
