import { create } from 'zustand'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const useLoadingStore = create((set) => ({
  isLoading: true,
  progress: 0,
  errors: [],
  assets: {},

  setProgress: (value) => set({ progress: value }),
  setLoading: (value) => set({ isLoading: value }),
  addError: (error) => set((state) => ({ 
    errors: [...state.errors, error] 
  })),
  addAsset: (key, asset) => set((state) => ({
    assets: { ...state.assets, [key]: asset }
  }))
}))

class AssetLoader {
  constructor() {
    // Initialize loaders
    this.textureLoader = new THREE.TextureLoader()
    this.gltfLoader = new GLTFLoader()
    this.audioLoader = new THREE.AudioLoader()
    
    // Setup DRACO loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    this.gltfLoader.setDRACOLoader(dracoLoader)

    // Asset manifests
    this.textures = {
      'environment': '/assets/textures/environment.jpg'
    }
    
    this.models = {
      'logo': '/assets/models/edc-logo.glb'
    }
    
    this.sounds = {
      'background': '/assets/sounds/background.mp3',
      'hover': '/assets/sounds/hover.mp3',
      'click': '/assets/sounds/click.mp3',
      'transition': '/assets/sounds/transition.mp3'
    }
  }

  async loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        resolve,
        undefined,
        reject
      )
    })
  }

  async loadModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        resolve,
        undefined,
        reject
      )
    })
  }

  async loadSound(url) {
    return new Promise((resolve, reject) => {
      this.audioLoader.load(
        url,
        resolve,
        undefined,
        reject
      )
    })
  }

  async loadAll() {
    const store = useLoadingStore.getState()
    const totalAssets = 
      Object.keys(this.textures).length + 
      Object.keys(this.models).length + 
      Object.keys(this.sounds).length

    let loadedAssets = 0

    try {
      // Load textures
      for (const [key, url] of Object.entries(this.textures)) {
        const texture = await this.loadTexture(url)
        store.addAsset(`texture_${key}`, texture)
        loadedAssets++
        store.setProgress((loadedAssets / totalAssets) * 100)
      }

      // Load models
      for (const [key, url] of Object.entries(this.models)) {
        const model = await this.loadModel(url)
        store.addAsset(`model_${key}`, model)
        loadedAssets++
        store.setProgress((loadedAssets / totalAssets) * 100)
      }

      // Load sounds
      for (const [key, url] of Object.entries(this.sounds)) {
        const sound = await this.loadSound(url)
        store.addAsset(`sound_${key}`, sound)
        loadedAssets++
        store.setProgress((loadedAssets / totalAssets) * 100)
      }

      store.setLoading(false)
    } catch (error) {
      store.addError(error)
      console.error('Error loading assets:', error)
    }
  }
}

export const assetLoader = new AssetLoader()

export const useLoadingManager = () => {
  const store = useLoadingStore()
  return {
    isLoading: store.isLoading,
    progress: store.progress,
    errors: store.errors,
    assets: store.assets
  }
}

export default useLoadingManager