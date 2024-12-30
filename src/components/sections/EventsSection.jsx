import React, { useRef, useState } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'

const EventCard = ({ position, title, date, description, onClick }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.position.y += Math.sin(time + position[0]) * 0.002
  })

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <planeGeometry args={[4, 2]} />
        <meshStandardMaterial
          color="#00B4D8"
          emissive="#00B4D8"
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <Text
        position={[0, 0.5, 0.1]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      <Text
        position={[0, 0, 0.1]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {date}
      </Text>

      <Text
        position={[0, -0.4, 0.1]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {description}
      </Text>
    </group>
  )
}

const EventsSection = ({ onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const groupRef = useRef()

  const events = [
    {
      title: "Startup Weekend",
      date: "March 15-17, 2024",
      description: "48-hour intensive startup building experience",
      position: [-5, 1, 0]
    },
    {
      title: "Innovation Summit",
      date: "April 5, 2024",
      description: "Annual gathering of innovators and entrepreneurs",
      position: [0, 1, 0]
    },
    {
      title: "Pitch Perfect",
      date: "April 20, 2024",
      description: "Learn the art of pitching from industry experts",
      position: [5, 1, 0]
    }
  ]

  return (
    <motion.group
      ref={groupRef}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00B4D8"
        anchorX="center"
        anchorY="middle"
      >
        Upcoming Events
      </Text>

      {events.map((event, index) => (
        <EventCard
          key={index}
          {...event}
          onClick={() => setSelectedEvent(event)}
        />
      ))}

      {selectedEvent && (
        <motion.group
          position={[0, -2, 1]}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <mesh onClick={() => setSelectedEvent(null)}>
            <planeGeometry args={[8, 4]} />
            <meshStandardMaterial
              color="#00B4D8"
              transparent
              opacity={0.9}
            />
          </mesh>

          <Text
            position={[0, 1, 0.1]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {selectedEvent.title}
          </Text>

          <Text
            position={[0, 0, 0.1]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {selectedEvent.date}
          </Text>

          <Text
            position={[0, -1, 0.1]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={6}
          >
            {selectedEvent.description}
          </Text>
        </motion.group>
      )}
    </motion.group>
  )
}

export default EventsSection