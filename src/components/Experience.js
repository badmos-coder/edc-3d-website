import React, { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import SceneEnvironment from './environment/SceneEnvironment';
import InteractiveSections from './sections/InteractiveSections';
import AboutSection from './sections/AboutSection';
import EventsSection from './sections/EventsSection';
import GallerySection from './sections/GallerySection';
import TeamSection from './sections/TeamSection';
import { useAudio } from '../systems/AudioSystem';

const SECTIONS = {
  HOME: 'home',
  ABOUT: 'about',
  EVENTS: 'events',
  GALLERY: 'gallery',
  TEAM: 'team'
};

function Experience() {
  const [activeSection, setActiveSection] = useState(SECTIONS.HOME);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { camera } = useThree();
  const { playSound } = useAudio();
  const mainGroupRef = useRef();

  // Camera positions for each section
  const cameraPositions = {
    [SECTIONS.HOME]: { pos: [0, 0, 10], lookAt: [0, 0, 0] },
    [SECTIONS.ABOUT]: { pos: [-10, 2, 5], lookAt: [-10, 0, 0] },
    [SECTIONS.EVENTS]: { pos: [10, 0, 8], lookAt: [10, 0, 0] },
    [SECTIONS.GALLERY]: { pos: [0, 5, 10], lookAt: [0, 5, 0] },
    [SECTIONS.TEAM]: { pos: [0, -5, 8], lookAt: [0, -5, 0] }
  };

  // Handle section transitions
  const transitionToSection = (section) => {
    if (isTransitioning || section === activeSection) return;

    setIsTransitioning(true);
    playSound('transition');

    const targetPosition = cameraPositions[section].pos;
    const targetLookAt = cameraPositions[section].lookAt;

    // Create camera animation timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        setActiveSection(section);
      }
    });

    timeline
      .to(camera.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration: 2,
        ease: 'power3.inOut'
      })
      .to(camera.rotation, {
        x: targetLookAt[0],
        y: targetLookAt[1],
        z: targetLookAt[2],
        duration: 2,
        ease: 'power3.inOut'
      }, 0);
  };

  // Add gentle floating animation to main group
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mainGroupRef.current) {
      mainGroupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <>
      <SceneEnvironment />
      
      <group ref={mainGroupRef}>
        {/* Home Section (Always visible) */}
        <InteractiveSections onSectionClick={transitionToSection} />

        {/* Conditional Section Rendering */}
        {activeSection === SECTIONS.ABOUT && (
          <AboutSection />
        )}
        
        {activeSection === SECTIONS.EVENTS && (
          <EventsSection />
        )}
        
        {activeSection === SECTIONS.GALLERY && (
          <GallerySection />
        )}
        
        {activeSection === SECTIONS.TEAM && (
          <TeamSection />
        )}
      </group>
    </>
  );
}

export default Experience;
