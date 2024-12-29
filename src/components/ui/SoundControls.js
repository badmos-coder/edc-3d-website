import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../../systems/AudioManager';

const ControlsContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 80px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ffff;
  border-radius: 8px;
  padding: 20px;
  min-width: 200px;
  color: #ffffff;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ControlButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #00ffff;
  color: #00ffff;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
  font-family: 'Cyberpunk', sans-serif;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VolumeSlider = styled.div`
  margin: 15px 0;

  label {
    display: block;
    margin-bottom: 8px;
    color: #00ffff;
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
    background: rgba(0, 255, 255, 0.2);
    border-radius: 2px;
    -webkit-appearance: none;
    position: relative;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: #00ffff;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.2);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
      }
    }

    &::-webkit-slider-runnable-track {
      height: 4px;
      background: rgba(0, 255, 255, 0.2);
      border-radius: 2px;
    }
  }

  .value-label {
    position: absolute;
    right: -40px;
    top: 50%;
    transform: translateY(-50%);
    color: #00ffff;
    font-size: 0.8em;
  }
`;

const ToggleButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ffff;
  color: #00ffff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }
`;

const PresetButton = styled(ControlButton)`
  font-size: 0.8em;
  padding: 5px 10px;
  margin: 3px;
  width: auto;
  display: inline-block;
`;

const PresetContainer = styled.div`
  margin-top: 10px;
  text-align: center;
`;

function SoundControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [backgroundVolume, setBackgroundVolume] = useState(0.3);
  const [effectsVolume, setEffectsVolume] = useState(0.5);

  // Handle initial setup
  useEffect(() => {
    audioManager.setBackgroundVolume(backgroundVolume);
    audioManager.setEffectsVolume(effectsVolume);
  }, []);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    audioManager.toggleMute();
  };

  const handleBackgroundVolume = (e) => {
    const volume = parseFloat(e.target.value);
    setBackgroundVolume(volume);
    audioManager.setBackgroundVolume(volume);
  };

  const handleEffectsVolume = (e) => {
    const volume = parseFloat(e.target.value);
    setEffectsVolume(volume);
    audioManager.setEffectsVolume(volume);
  };

  const playTestSound = () => {
    audioManager.playSound('click');
  };

  const setPreset = (preset) => {
    switch (preset) {
      case 'gaming':
        setBackgroundVolume(0.2);
        setEffectsVolume(0.7);
        break;
      case 'ambient':
        setBackgroundVolume(0.4);
        setEffectsVolume(0.3);
        break;
      case 'balanced':
        setBackgroundVolume(0.3);
        setEffectsVolume(0.5);
        break;
    }
  };

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
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <ControlButton
              onClick={handleToggleMute}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? 'Unmute All' : 'Mute All'}
            </ControlButton>

            <VolumeSlider>
              <label>Background Music</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={backgroundVolume}
                  onChange={handleBackgroundVolume}
                />
                <span className="value-label">{Math.round(backgroundVolume * 100)}%</span>
              </div>
            </VolumeSlider>

            <VolumeSlider>
              <label>Sound Effects</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={effectsVolume}
                  onChange={handleEffectsVolume}
                />
                <span className="value-label">{Math.round(effectsVolume * 100)}%</span>
              </div>
            </VolumeSlider>

            <PresetContainer>
              <PresetButton onClick={() => setPreset('gaming')}>Gaming</PresetButton>
              <PresetButton onClick={() => setPreset('ambient')}>Ambient</PresetButton>
              <PresetButton onClick={() => setPreset('balanced')}>Balanced</PresetButton>
            </PresetContainer>

            <ControlButton
              onClick={playTestSound}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Test Sound Effects
            </ControlButton>
          </ControlsContainer>
        )}
      </AnimatePresence>
    </>
  );
}

export default SoundControls;