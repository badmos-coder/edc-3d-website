import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

const InterfaceContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 80vh;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00B4D8;
  border-radius: 5px;
  padding: 20px;
  color: #fff;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  overflow: hidden;
  pointer-events: all;
  backdrop-filter: blur(5px);
`

const Sidebar = styled.div`
  border-right: 1px solid #00B4D8;
  padding-right: 20px;
`

const MainContent = styled.div`
  position: relative;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 180, 216, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: #00B4D8;
  }
`

const MenuItem = styled(motion.div)`
  padding: 15px;
  margin: 10px 0;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  border-radius: 4px;
  background: rgba(0, 180, 216, 0.1);

  &:hover {
    border-color: #00B4D8;
    background: rgba(0, 180, 216, 0.2);
    box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
  }
`

const GlitchText = styled.h2`
  position: relative;
  color: #fff;
  font-size: 2em;
  margin: 0 0 2rem 0;
  text-shadow: 
    2px 2px #FF0000,
    -2px -2px #00B4D8;
  animation: glitch 1s infinite;

  @keyframes glitch {
    0% { text-shadow: 2px 2px #FF0000, -2px -2px #00B4D8; }
    25% { text-shadow: -2px 2px #FF0000, 2px -2px #00B4D8; }
    50% { text-shadow: 2px -2px #FF0000, -2px 2px #00B4D8; }
    75% { text-shadow: -2px -2px #FF0000, 2px 2px #00B4D8; }
    100% { text-shadow: 2px 2px #FF0000, -2px -2px #00B4D8; }
  }
`

const ContentBox = styled(motion.div)`
  background: rgba(0, 180, 216, 0.05);
  border: 1px solid #00B4D8;
  padding: 20px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;
  border-radius: 4px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #00B4D8, transparent);
    animation: scan 2s linear infinite;
  }

  @keyframes scan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`

const menuItems = [
  { id: 'about', label: 'About EDC' },
  { id: 'events', label: 'Events' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'team', label: 'Team' },
]

const CyberpunkInterface = () => {
  const [activeSection, setActiveSection] = useState('about')

  return (
    <InterfaceContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar>
        <GlitchText>EDC MAIT</GlitchText>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            whileHover={{ x: 10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(item.id)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Sidebar>

      <MainContent>
      <AnimatePresence mode="wait">
          <ContentBox
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {activeSection === 'about' && (
              <div>
                <h3>About EDC MAIT</h3>
                <p>
                  The Entrepreneurship Development Cell of MAIT is a student-run organization
                  that aims to foster the spirit of entrepreneurship among students.
                  Through various events, workshops, and initiatives, we create an
                  ecosystem that nurtures innovative ideas and helps transform them
                  into successful ventures.
                </p>
              </div>
            )}

            {activeSection === 'events' && (
              <div>
                <h3>Upcoming Events</h3>
                <ul>
                  <li>Startup Weekend - March 15-17, 2024</li>
                  <li>Innovation Summit - April 5, 2024</li>
                  <li>Pitch Perfect - April 20, 2024</li>
                </ul>
              </div>
            )}

            {activeSection === 'gallery' && (
              <div>
                <h3>Event Gallery</h3>
                <div className="gallery-grid">
                  {/* Gallery items will be added here */}
                </div>
              </div>
            )}

            {activeSection === 'team' && (
              <div>
                <h3>Our Team</h3>
                <div className="team-grid">
                  {/* Team members will be added here */}
                </div>
              </div>
            )}
          </ContentBox>
        </AnimatePresence>
      </MainContent>
    </InterfaceContainer>
  )
}

export default CyberpunkInterface