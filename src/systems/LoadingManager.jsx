// src/systems/LoadingManager.js
import { create } from 'zustand';
//import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TextureLoader } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const useLoadingStore = create((set) => ({
  progress: 0,
  isLoading: true,
  setProgress: (progress) => set({ progress }),
  setIsLoading: (isLoading) => set({ isLoading }),
  totalItems: 0,
  loadedItems: 0,
  updateProgress: () => set((state) => {
    const progress = (state.loadedItems + 1) / state.totalItems * 100;
    return {
      loadedItems: state.loadedItems + 1,
      progress
    };
  })
}));

class LoadingManager {
  constructor() {
    // Initialize loaders
    this.textureLoader = new TextureLoader();
    this.gltfLoader = new GLTFLoader();
    this.fontLoader = new FontLoader();
    this.dracoLoader = new DRACOLoader();
    
    // Configure DRACO loader
    this.dracoLoader.setDecoderPath('/draco/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    // Asset lists
    this.textures = {
      'envMap': '/assets/textures/environment.jpg',
      'groundTexture': '/assets/textures/ground.jpg',
      // Add more textures here
    };

    this.models = {
      'edcLogo': '/assets/models/edc-logo.glb',
      'decorations': '/assets/models/decorations.glb',
      // Add more models here
    };

    this.fonts = {
      'cyberpunk': '/fonts/cyberpunk.json'
    };

    // Calculate total items to load
    const totalItems = 
      Object.keys(this.textures).length +
      Object.keys(this.models).length +
      Object.keys(this.fonts).length;
    
    useLoadingStore.setState({ totalItems });
  }

  async loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          useLoadingStore.getState().updateProgress();
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  async loadModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          useLoadingStore.getState().updateProgress();
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }

  async loadFont(url) {
    return new Promise((resolve, reject) => {
      this.fontLoader.load(
        url,
        (font) => {
          useLoadingStore.getState().updateProgress();
          resolve(font);
        },
        undefined,
        reject
      );
    });
  }

  async loadAll() {
    useLoadingStore.setState({ isLoading: true, progress: 0 });

    try {
      // Load textures
      const loadedTextures = await Promise.all(
        Object.entries(this.textures).map(async ([key, url]) => {
          const texture = await this.loadTexture(url);
          return [key, texture];
        })
      );

      // Load models
      const loadedModels = await Promise.all(
        Object.entries(this.models).map(async ([key, url]) => {
          const model = await this.loadModel(url);
          return [key, model];
        })
      );

      // Load fonts
      const loadedFonts = await Promise.all(
        Object.entries(this.fonts).map(async ([key, url]) => {
          const font = await this.loadFont(url);
          return [key, font];
        })
      );

      // Convert arrays to objects
      const textures = Object.fromEntries(loadedTextures);
      const models = Object.fromEntries(loadedModels);
      const fonts = Object.fromEntries(loadedFonts);

      useLoadingStore.setState({ isLoading: false, progress: 100 });

      return { textures, models, fonts };
    } catch (error) {
      console.error('Error loading assets:', error);
      useLoadingStore.setState({ isLoading: false });
      throw error;
    }
  }
}

export const loadingManager = new LoadingManager();

// Hook for components to access loading state
export function useLoading() {
  return useLoadingStore((state) => ({
    progress: state.progress,
    isLoading: state.isLoading
  }));
}

// Usage example:
/*
async function loadAssets() {
  try {
    const { textures, models, fonts } = await loadingManager.loadAll();
    // Use loaded assets
  } catch (error) {
    console.error('Failed to load assets:', error);
  }
}
*/