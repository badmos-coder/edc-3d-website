import create from 'zustand'
import { useEffect, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Create event store
const useEventStore = create((set) => ({
  hoveredObject: null,
  selectedObject: null,
  interactiveObjects: new Set(),
  setHovered: (object) => set({ hoveredObject: object }),
  setSelected: (object) => set({ selectedObject: object }),
  registerObject: (object) => set((state) => {
    state.interactiveObjects.add(object)
    return { interactiveObjects: new Set(state.interactiveObjects) }
  }),
  unregisterObject: (object) => set((state) => {
    state.interactiveObjects.delete(object)
    return { interactiveObjects: new Set(state.interactiveObjects) }
  })
}))

function EventSystem({ children }) {
  const { camera, raycaster, mouse, scene } = useThree()
  const setHovered = useEventStore((state) => state.setHovered)
  const setSelected = useEventStore((state) => state.setSelected)
  const interactiveObjects = useEventStore((state) => state.interactiveObjects)

  const handlePointerMove = useCallback((event) => {
    // Update mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // Update raycaster
    raycaster.setFromCamera(mouse, camera)

    // Check for intersections with interactive objects
    const intersects = raycaster.intersectObjects(
      Array.from(interactiveObjects),
      true
    )

    if (intersects.length > 0) {
      const object = intersects[0].object
      setHovered(object)
      document.body.style.cursor = 'pointer'
    } else {
      setHovered(null)
      document.body.style.cursor = 'default'
    }
  }, [camera, mouse, raycaster, setHovered, interactiveObjects])

  const handleClick = useCallback((event) => {
    // Handle object selection
    if (event.button === 0) { // Left click
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(
        Array.from(interactiveObjects),
        true
      )

      if (intersects.length > 0) {
        const object = intersects[0].object
        setSelected(object)
      } else {
        setSelected(null)
      }
    }
  }, [camera, mouse, raycaster, setSelected, interactiveObjects])

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('click', handleClick)
      document.body.style.cursor = 'default'
    }
  }, [handlePointerMove, handleClick])

  return children
}

// Custom hook for making objects interactive
export function useInteractive(ref, {
  onHover,
  onUnhover,
  onClick,
  onDeselect
} = {}) {
  const registerObject = useEventStore((state) => state.registerObject)
  const unregisterObject = useEventStore((state) => state.unregisterObject)
  const hoveredObject = useEventStore((state) => state.hoveredObject)
  const selectedObject = useEventStore((state) => state.selectedObject)

  useEffect(() => {
    if (ref.current) {
      registerObject(ref.current)
      return () => unregisterObject(ref.current)
    }
  }, [ref, registerObject, unregisterObject])

  useEffect(() => {
    if (ref.current) {
      if (hoveredObject === ref.current) {
        onHover?.()
      } else {
        onUnhover?.()
      }
    }
  }, [ref, hoveredObject, onHover, onUnhover])

  useEffect(() => {
    if (ref.current) {
      if (selectedObject === ref.current) {
        onClick?.()
      } else {
        onDeselect?.()
      }
    }
  }, [ref, selectedObject, onClick, onDeselect])

  return {
    isHovered: hoveredObject === ref.current,
    isSelected: selectedObject === ref.current
  }
}

// Helper component for highlighting interactive objects
export function InteractiveHighlight({ children }) {
  const hoveredObject = useEventStore((state) => state.hoveredObject)
  const selectedObject = useEventStore((state) => state.selectedObject)

  useEffect(() => {
    // Add highlight effect to hovered object
    if (hoveredObject && hoveredObject.material) {
      const originalEmissive = hoveredObject.material.emissive.clone()
      hoveredObject.material.emissive.set(0x666666)

      return () => {
        hoveredObject.material.emissive.copy(originalEmissive)
      }
    }
  }, [hoveredObject])

  useEffect(() => {
    // Add highlight effect to selected object
    if (selectedObject && selectedObject.material) {
      const originalEmissive = selectedObject.material.emissive.clone()
      selectedObject.material.emissive.set(0x999999)

      return () => {
        selectedObject.material.emissive.copy(originalEmissive)
      }
    }
  }, [selectedObject])

  return children
}

export default EventSystem