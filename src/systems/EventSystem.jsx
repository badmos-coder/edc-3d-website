import { useEffect, useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { create } from 'zustand';

// Create event store with zustand
const useEventStore = create((set) => ({
  hoveredObject: null,
  selectedObject: null,
  interactiveObjects: new Set(),
  setHovered: (object) => set({ hoveredObject: object }),
  setSelected: (object) => set({ selectedObject: object }),
  registerObject: (object) => set((state) => {
    if (object?.layers) {
      object.layers.enable(1);
    }
    state.interactiveObjects.add(object);
    return { interactiveObjects: new Set(state.interactiveObjects) };
  }),
  unregisterObject: (object) => set((state) => {
    state.interactiveObjects.delete(object);
    return { interactiveObjects: new Set(state.interactiveObjects) };
  })
}));

// Custom hook for interactive objects
export function useInteractive(ref, {
  onHover,
  onUnhover,
  onClick,
  onDeselect
} = {}) {
  const registerObject = useEventStore((state) => state.registerObject);
  const unregisterObject = useEventStore((state) => state.unregisterObject);
  const hoveredObject = useEventStore((state) => state.hoveredObject);
  const selectedObject = useEventStore((state) => state.selectedObject);

  // Store callbacks in refs to prevent unnecessary effect triggers
  const onHoverRef = useRef(onHover);
  const onUnhoverRef = useRef(onUnhover);
  const onClickRef = useRef(onClick);
  const onDeselectRef = useRef(onDeselect);

  // Update callback refs when they change
  useEffect(() => {
    onHoverRef.current = onHover;
    onUnhoverRef.current = onUnhover;
    onClickRef.current = onClick;
    onDeselectRef.current = onDeselect;
  }, [onHover, onUnhover, onClick, onDeselect]);

  // Register and unregister object
  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      registerObject(currentRef);
      return () => unregisterObject(currentRef);
    }
  }, [ref, registerObject, unregisterObject]);

  // Handle hover state changes
  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      if (hoveredObject === currentRef) {
        if (onHoverRef.current) {
          onHoverRef.current();
        }
      } else {
        if (onUnhoverRef.current) {
          onUnhoverRef.current();
        }
      }
    }
  }, [ref, hoveredObject]);

  // Handle selection state changes
  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      if (selectedObject === currentRef) {
        if (onClickRef.current) {
          onClickRef.current();
        }
      } else {
        if (onDeselectRef.current) {
          onDeselectRef.current();
        }
      }
    }
  }, [ref, selectedObject]);

  return {
    isHovered: hoveredObject === ref.current,
    isSelected: selectedObject === ref.current
  };
}

// Main EventSystem component
function EventSystem({ children }) {
  const { camera, raycaster, mouse } = useThree();
  const setHovered = useEventStore((state) => state.setHovered);
  const setSelected = useEventStore((state) => state.setSelected);
  const interactiveObjects = useEventStore((state) => state.interactiveObjects);

  // Memoized pointer move handler
  const handlePointerMove = useCallback((event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Array.from(interactiveObjects), true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      setHovered(object);
      document.body.style.cursor = 'pointer';
    } else {
      setHovered(null);
      document.body.style.cursor = 'default';
    }
  }, [camera, mouse, raycaster, setHovered, interactiveObjects]);

  // Memoized click handler
  const handleClick = useCallback((event) => {
    if (event.button === 0) { // Left click only
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(interactiveObjects), true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        setSelected(object);
      } else {
        setSelected(null);
      }
    }
  }, [camera, mouse, raycaster, setSelected, interactiveObjects]);

  // Event listeners setup and cleanup
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      document.body.style.cursor = 'default';
    };
  }, [handlePointerMove, handleClick]);

  return children;
}

export default EventSystem;
