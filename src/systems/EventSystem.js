import { create } from 'zustand'
import { useEffect, useCallback } from 'react'
import { useThree } from '@react-three/fiber'

const useEventStore = create((set) => ({
  hoveredObject: null,
  selectedObject: null,
  interactiveObjects: new Set(),
  setHovered: (object) => set({ hoveredObject: object }),
  setSelected: (object) => set({ selectedObject: object }),
  registerObject: (object) => set((state) => {
    if (object?.layers) {
      object.layers.enable(1)
    }
    state.interactiveObjects.add(object)
    return { interactiveObjects: new Set(state.interactiveObjects) }
  }),
  unregisterObject: (object) => set((state) => {
    state.interactiveObjects.delete(object)
    return { interactiveObjects: new Set(state.interactiveObjects) }
  })
}))

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
    const currentRef = ref.current
    if (currentRef) {
      registerObject(currentRef)
      return () => {
        unregisterObject(currentRef)
      }
    }
  }, [ref, registerObject, unregisterObject])

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      if (hoveredObject === currentRef) {
        onHover?.()
      } else {
        onUnhover?.()
      }
    }
  }, [ref, hoveredObject, onHover, onUnhover])

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      if (selectedObject === currentRef) {
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

export function EventSystem({ children }) {
  const { camera, raycaster, mouse } = useThree()
  const setHovered = useEventStore((state) => state.setHovered)
  const setSelected = useEventStore((state) => state.setSelected)
  const interactiveObjects = useEventStore((state) => state.interactiveObjects)

  const handlePointerMove = useCallback((event) => {
    const coords = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1
    }

    raycaster.setFromCamera(coords, camera)
    const intersects = raycaster.intersectObjects(Array.from(interactiveObjects), true)

    if (intersects.length > 0) {
      const object = intersects[0].object
      setHovered(object)
      document.body.style.cursor = 'pointer'
    } else {
      setHovered(null)
      document.body.style.cursor = 'default'
    }
  }, [camera, raycaster, setHovered, interactiveObjects])

  const handleClick = useCallback((event) => {
    if (event.button === 0) {
      const coords = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      }

      raycaster.setFromCamera(coords, camera)
      const intersects = raycaster.intersectObjects(Array.from(interactiveObjects), true)

      if (intersects.length > 0) {
        const object = intersects[0].object
        setSelected(object)
      } else {
        setSelected(null)
      }
    }
  }, [camera, raycaster, setSelected, interactiveObjects])

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

export default EventSystem