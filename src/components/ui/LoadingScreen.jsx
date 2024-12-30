// src/components/ui/LoadingScreen.jsx
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { Howl } from 'howler';

const glitch = keyframes`
  0% {
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    transform: translate(-10px);
  }
  20% {
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
    transform: translate(-10px);
  }
  30% {
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
    transform: translate(10px);
  }
  40% {
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
    transform: translate(-10px);
  }
  50% {
    clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
    transform: translate(10px);
  }
  55% {
    clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
    transform: translate(5px);
  }
  60% {
    clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
    transform: translate(-5px);
  }
  65% {
    clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
    transform: translate(5px);
  }
  70% {
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
    transform: translate(-5px);
  }
  80% {
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    transform: translate(10px);
  }
  85% {
    clip-path: polygon(0 60%, 100% 60%, 100% 65%, 0 65%);
    transform: translate(-10px);
  }
  95% {
    clip-path: polygon(0 72%, 100% 72%, 100% 78%, 0 78%);
    transform: translate(5px);
  }
  100% {
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    transform: translate(-10px);
  }
`

const flicker = keyframes`
  0% { opacity: 0.1; }
  2% { opacity: 1; }
  8% { opacity: 0.1; }
  9% { opacity: 1; }
  12% { opacity: 0.1; }
  20% { opacity: 1; }
  25% { opacity: 0.3; }
  30% { opacity: 1; }
  70% { opacity: 0.7; }
  72% { opacity: 0.2; }
  77% { opacity: 0.9; }
  100% { opacity: 0.9; }
`

const textScanline = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(100vh); }
`

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

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
  }
`

const GlitchText = styled(motion.div)`
  color: #00B4D8;
  font-size: 4rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
  animation: ${flicker} 4s linear infinite;
  position: relative;

  &::before,
  &::after {
    content: 'EDC MAIT';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

  &::before {
    color: #ff0000;
    animation: ${glitch} 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
    animation-delay: 0.1s;
  }

  &::after {
    color: #0000ff;
    animation: ${glitch} 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite reverse;
    animation-delay: 0.2s;
  }
`

const loadingAudio = new Howl({
  src: ['public/assets/sounds/wake_up_johnny_silverh-[AudioTrimmer.com].mp3'], // Replace with the any audio path which you like
  volume: 0.8,
});

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
  background: linear-gradient(90deg, #2b2b2b 0%, #414141 100%);
  border-radius: 4px;
  position: relative;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
  z-index: 10;  // Ensure handle appears above blade

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
  }
`

const SaberBlade = styled(motion.div)`
  position: absolute;
  height: 8px;
  background: ${props => props.color};
  border-radius: 4px;
  box-shadow: 0 0 10px ${props => props.color},
              0 0 20px ${props => props.color},
              0 0 30px ${props => props.color},
              0 0 40px ${props => props.color};
  transform-origin: left center;
  width: ${props => `${props.width}%`};  // Dynamically set the width based on progress
  z-index: 5;  // Ensure blade is below the handle

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
  }
`

const GlitchText2 = styled(motion.div)`
  color: #00B4D8;
  font-size: 1rem;
  opacity: 0.8;
  text-shadow: 2px 2px #ff0000, -2px -2px #0000ff;
  animation: ${flicker} 3s linear infinite;
`

const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  animation: ${textScanline} 6s linear infinite;
`

const lightsaberColors = [
  '#00ff00',
  '#0000ff',
  '#ff0000',
  '#800080',
  '#ffff00'
]

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [saberColor, setSaberColor] = useState(lightsaberColors[0])
  const [glitchText, setGlitchText] = useState('ERROR')
  const [isVisible, setIsVisible] = useState(true)  // To handle hiding the screen after 6 seconds

  useEffect(() => {
    const randomColor = lightsaberColors[Math.floor(Math.random() * lightsaberColors.length)]
    setSaberColor(randomColor)

    const texts = [
      'SYSTEM BREACH...',
      'INITIALIZING...',
      'ACCESS GRANTED',
      'LOADING EDC...',
      'DECRYPTING...'
    ]
    
    let textIndex = 0
    const textInterval = setInterval(() => {
      setGlitchText(texts[textIndex % texts.length])
      textIndex++
    }, 800)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    // Hide the loading screen after 6 seconds
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, 6000)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    isVisible && (
      <LoadingContainer>

        <Scanline />
        <GlitchText>EDC MAIT</GlitchText>
        <LightsaberContainer>
          <SaberHandle />
          <SaberBlade
            color={saberColor}
            width={progress} // Pass progress as width for the blade
          />
        </LightsaberContainer>
        <GlitchText2>{glitchText}</GlitchText2>
      </LoadingContainer>
    )
  )
}

export default LoadingScreen