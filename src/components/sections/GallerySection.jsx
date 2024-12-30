import React, { useRef, useState } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'

const GalleryImage = ({ position, title, imageUrl, onClick }) => {
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
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial
          color="#00B4D8"
          emissive="#00B4D8"
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <Text
        position={[0, -1, 0.1]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  )
}

const GallerySection = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const groupRef = useRef()

  const images = [
    {
      title: "Startup Weekend 2023",
      imageUrl: "/assets/images/startup-weekend.jpg",
      position: [-3, 1, 0]
    },
    {
      title: "Hackathon Finals",
      imageUrl: "/assets/images/hackathon.jpg",
      position: [0, 1, 0]
    },
    {
      title: "Innovation Summit",
      imageUrl: "/assets/images/innovation-summit.jpg",
      position: [3, 1, 0]
    },
    {
      title: "Workshop Series",
      imageUrl: "/assets/images/workshop.jpg",
      position: [-3, -1, 0]
    },
    {
      title: "Pitch Competition",
      imageUrl: "/assets/images/pitch.jpg",
      position: [0, -1, 0]
    },
    {
      title: "E-Summit 2023",
      imageUrl: "/assets/images/esummit.jpg",
      position: [3, -1, 0]
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
        Gallery
      </Text>

      {images.map((image, index) => (
        <GalleryImage
          key={index}
          {...image}
          onClick={() => setSelectedImage(image)}
        />
      ))}

      {selectedImage && (
        <motion.group
          position={[0, 0, 2]}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <mesh onClick={() => setSelectedImage(null)}>
            <planeGeometry args={[4, 3]} />
            <meshStandardMaterial
              color="#00B4D8"
              transparent
              opacity={0.9}
            />
          </mesh>

          <Text
            position={[0, -1.7, 0.1]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {selectedImage.title}
          </Text>
        </motion.group>
      )}
    </motion.group>
  )
}

export default GallerySection
