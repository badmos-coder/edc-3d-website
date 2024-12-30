// src/components/ui/LoadingScreen.jsx
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

// Keyframe Animations
const glitch = keyframes`
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
`

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
`

const flicker = keyframes`
  0% { opacity: 0.95; }
  50% { opacity: 0.85; }
  100% { opacity: 0.95; }
`

// Styled Components
const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
`

const Title = styled(motion.div)`
  color: #00B4D8;
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
  animation: ${glitch} 2s linear infinite;
`

const LightsaberContainer = styled.div`
  width: 400px;
  height: 30px;
  position: relative;
  margin: 2rem 0;
  display: flex;
  align-items: center;
`

const SaberHandle = styled.div`
  width: 60px;
  height: 20px;
  background: linear-gradient(
    90deg,
    #2b2b2b 0%,
    #414141 50%,
    #2b2b2b 100%
  );
  border-radius: 4px;
  position: relative;
  box-shadow: 
    inset 0 0 10px rgba(0,0,0,0.5),
    0 0 5px rgba(255,255,255,0.2);

  &::before {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 12px;
    background: #1a1a1a;
    border-radius: 2px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.8);
  }

  &::after {
    content: '';
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 16px;
    background: linear-gradient(
      90deg,
      #1a1a1a 0%,
      #2b2b2b 50%,
      #1a1a1a 100%
    );
    border-radius: 2px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.8);
  }
`

const SaberBlade = styled(motion.div)`
  position: relative;
  height: 8px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 
    0 0 10px ${props => props.color},
    0 0 20px ${props => props.color},
    0 0 30px ${props => props.color},
    0 0 40px ${props => props.color},
    0 0 70px ${props => props.color};
  transform-origin: left center;
  animation: ${pulse} 2s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.color};
    border-radius: inherit;
    opacity: 0.7;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    bottom: -2px;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: inherit;
    opacity: 0.3;
    filter: blur(4px);
    animation: ${pulse} 2s ease-in-out infinite 0.5s;
  }
`

const LoadingText = styled(motion.div)`
  color: #00B4D8;
  font-size: 1rem;
  opacity: 0.8;
  margin-top: 1rem;
  animation: ${flicker} 1s ease-in-out infinite;
`

const lightsaberColors = {
  red: '#ff0000',
  blue: '#0077ff',
  green: '#00ff00',
  purple: '#800080'
};

const getRandomColor = () => {
  const colors = Object.values(lightsaberColors);
  return colors[Math.floor(Math.random() * colors.length)];
};

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [saberColor, setSaberColor] = useState(getRandomColor());

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingContainer>
      <Title
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        EDC MAIT
      </Title>

      <LightsaberContainer>
        <SaberHandle />
        <SaberBlade
          color={saberColor}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1 }}
          style={{ width: '340px' }} // 400px container - 60px handle
        />
      </LightsaberContainer>

      <LoadingText
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        Entering the EDC Experience...
      </LoadingText>
    </LoadingContainer>
  );
};

export default LoadingScreen;