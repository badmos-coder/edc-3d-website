import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import MAITEDCLogo from './3d/MAITEDCLogo';
import ParticleSystem from './effects/ParticleSystem';
import PortalEffect from './effects/PortalEffect';
import AboutSection from './sections/AboutSection';
import EventsSection from './sections/EventsSection';
import GallerySection from './sections/GallerySection';
import TeamSection from './sections/TeamSection';
import { useAudioManager } from '../systems/AudioManager';

const SECTIONS = {
  HOME: 'home',
  ABOUT: 'about',
  EVENTS: 'events',
  GALLERY: 'gallery',
  TEAM: 'team',
};

const Experience = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.HOME);
  const mainGroupRef = useRef();
  const { playSound } = useAudioManager();

  // Smooth floating animation for the main group
  useFrame((state) => {
    if (mainGroupRef.current) {
      const time = state.clock.getElapsedTime();
      mainGroupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  // Handle section change with audio feedback
  const handleSectionChange = (section) => {
    if (section !== activeSection) {
      playSound('transition');
      setActiveSection(section);
    }
  };

  return (
    <>
      {/* Environment Setup */}
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 10, 50]} />
      <Environment preset="night" />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Main Content */}
      <group ref={mainGroupRef}>
        {/* Always render the MAITEDC Logo */}
        <MAITEDCLogo position={[0, 2, 0]} />

        {/* Particle Effects */}
        <ParticleSystem />

        {/* Portal Effects */}
        <PortalEffect position={[0, 0, -5]} />

        {/* Conditional Sections */}
        {activeSection === SECTIONS.ABOUT && (
          <AboutSection onClose={() => handleSectionChange(SECTIONS.HOME)} />
        )}
        {activeSection === SECTIONS.EVENTS && (
          <EventsSection onClose={() => handleSectionChange(SECTIONS.HOME)} />
        )}
        {activeSection === SECTIONS.GALLERY && (
          <GallerySection onClose={() => handleSectionChange(SECTIONS.HOME)} />
        )}
        {activeSection === SECTIONS.TEAM && (
          <TeamSection onClose={() => handleSectionChange(SECTIONS.HOME)} />
        )}
      </group>

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#00B4D8" intensity={0.5} />
    </>
  );
};

export default Experience;
