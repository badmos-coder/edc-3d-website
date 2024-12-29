// src/components/Experience.js
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
  const mainGroupRef = useRef();
  const { playSound } = useAudio();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mainGroupRef.current) {
      mainGroupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  const handleSectionChange = (section) => {
    setActiveSection(section);
    playSound('transition');
  };

  return (
    <>
      <SceneEnvironment />
      
      <group ref={mainGroupRef}>
        <InteractiveSections onSectionClick={handleSectionChange} />

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