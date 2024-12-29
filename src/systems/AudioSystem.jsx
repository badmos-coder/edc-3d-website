import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react'
import { Howl } from 'howler'

const AudioContext = createContext()

const audioFiles = {
  background: '/assets/sounds/background.mp3',
  hover: '/assets/sounds/hover.mp3',
  click: '/assets/sounds/click.mp3',
  transition: '/assets/sounds/transition.mp3'
}

export function AudioProvider({ children }) {
  const [sounds, setSounds] = useState({})
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    // Initialize sound objects
    const soundObjects = {}
    Object.entries(audioFiles).forEach(([key, file]) => {
      soundObjects[key] = new Howl({
        src: [file],
        loop: key === 'background',
        volume: key === 'background' ? 0.3 : 0.5
      })
    })
    setSounds(soundObjects)

    return () => {
      // Cleanup sounds on unmount
      Object.values(soundObjects).forEach(sound => sound.unload())
    }
  }, [])

  const playSound = (soundName) => {
    if (!isMuted && sounds[soundName]) {
      sounds[soundName].play()
    }
  }

  const stopSound = (soundName) => {
    if (sounds[soundName]) {
      sounds[soundName].stop()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    Object.values(sounds).forEach(sound => {
      sound.mute(!isMuted)
    })
  }

  return (
    <AudioContext.Provider value={{ playSound, stopSound, toggleMute, isMuted }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => useContext(AudioContext)