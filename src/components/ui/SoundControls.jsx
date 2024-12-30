import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudioManager } from '../../systems/AudioManager'

const ControlsContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00B4D8;
  border-radius: 10px;
  padding: 15px;
  color: #FFFFFF;
  z-index: 1000;
  min-width: 250px;
  backdrop-filter: blur(5px);
`

const ControlButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #00B4D8;
  color: #00B4D8;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  font-family: inherit;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: rgba(0, 180, 216, 0.2);
    box-shadow: 0 0 10px rgba(0, 180, 216, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const VolumeSlider = styled.div`
  margin: 15px 0;

  label {
    display: block;
    margin-bottom: 8px;
    color: #00B4D8;
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .slider-container {
    position: relative;
    padding: 10px 0;
  }

  input[type="range"] {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(0, 180, 216, 0.2);
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: #00B4D8;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.2);
        box-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
      }
    }
  }

  .value-display {
    position: absolute;
    right: -40px;
    top: 50%;
    transform: translateY(-50%);
    color: #00B4D8;
    font-size: 0.8em;
  }
`

const ToggleButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00B4D8;
  color: #00B4D8;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(0, 180, 216, 0.2);
    box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
  }
`

const SoundControls = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    isMuted, 
    toggleMute, 
    musicVolume, 
    effectsVolume, 
    setMusicVolume, 
    setEffectsVolume 
  } = useAudioManager()

  return (
    <>
      <ToggleButton
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? '×' : '♪'}
      </ToggleButton>

      <AnimatePresence>
        {isOpen && (
          <ControlsContainer
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <ControlButton
              onClick={toggleMute}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? 'Unmute' : 'Mute'} All
            </ControlButton>

            <VolumeSlider>
              <label>Background Music</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  disabled={isMuted}
                />
                <span className="value-display">
                  {Math.round(musicVolume * 100)}%
                </span>
              </div>
            </VolumeSlider>

            <VolumeSlider>
              <label>Sound Effects</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={effectsVolume}
                  onChange={(e) => setEffectsVolume(parseFloat(e.target.value))}
                  disabled={isMuted}
                />
                <span className="value-display">
                  {Math.round(effectsVolume * 100)}%
                </span>
              </div>
            </VolumeSlider>
          </ControlsContainer>
        )}
      </AnimatePresence>
    </>
  )
}

export default SoundControls