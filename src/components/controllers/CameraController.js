import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { Vector3 } from 'three'
import create from 'zustand'

// Camera positions for different sections
const cameraPositions = {
  home: {
    position: new Vector3(0, 0, 5),
    target: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0)
  },
  about: {
    position: new Vector3(10, 2, 5),
    target: new Vector3(10, 0, 0),
    rotation: new Vector3(0, -Math.PI / 4, 0)
  },
  events: {
    position: new Vector3(-8, 4, 8),
    target: new Vector3(0, 0, 0),
    rotation: new Vector3(-Math.PI / 6, Math.PI / 4, 0)
  },
  gallery: {
    position: new Vector3(5, -3, 10),
    target: new Vector3(0, -3, 0),
    rotation: new Vector3(0, -Math.PI / 3, 0)
  }
}

// Create camera state store
const useCameraStore = create((set) => ({
  currentSection: 'home',
  isTransitioning: false,
  setSection: (section) => set({ currentSection: section }),
  setTransitioning: (state) => set({ isTransitioning: state })
}))

function CameraController({ onTransitionComplete }) {
  const { camera, controls } = useThree()
  const currentSection = useCameraStore((state) => state.currentSection)
  const isTransitioning = useCameraStore((state) => state.isTransitioning)
  const setTransitioning = useCameraStore((state) => state.setTransitioning)
  
  const timeline = useRef()

  useEffect(() => {
    if (timeline.current) timeline.current.kill()

    const targetPosition = cameraPositions[currentSection].position
    const targetLookAt = cameraPositions[currentSection].target
    const targetRotation = cameraPositions[currentSection].rotation

    setTransitioning(true)

    timeline.current = gsap.timeline({
      onComplete: () => {
        setTransitioning(false)
        if (onTransitionComplete) onTransitionComplete()
      }
    })

    // Create a smooth camera movement
    timeline.current.to(camera.position, {
      duration: 2,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease: 'power3.inOut'
    })
    .to(camera.rotation, {
      duration: 2,
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      ease: 'power3.inOut'
    }, '<')
    .to(controls.target, {
      duration: 2,
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      ease: 'power3.inOut'
    }, '<')

    // Add some camera shake during transition
    const shakeDuration = 0.1
    const shakeIntensity = 0.02
    
    timeline.current.to(camera.position, {
      duration: shakeDuration,
      x: `+=${Math.random() * shakeIntensity - shakeIntensity/2}`,
      y: `+=${Math.random() * shakeIntensity - shakeIntensity/2}`,
      z: `+=${Math.random() * shakeIntensity - shakeIntensity/2}`,
      repeat: 3,
      yoyo: true,
      ease: 'none'
    }, 1)

    return () => {
      if (timeline.current) timeline.current.kill()
    }
  }, [camera, controls, currentSection, setTransitioning, onTransitionComplete])

  return null
}

// Custom hook for camera controls
export function useCameraTransition() {
  const setSection = useCameraStore((state) => state.setSection)
  const isTransitioning = useCameraStore((state) => state.isTransitioning)

  const transitionTo = (section) => {
    if (!isTransitioning && cameraPositions[section]) {
      setSection(section)
    }
  }

  return { transitionTo, isTransitioning }
}

export default CameraController