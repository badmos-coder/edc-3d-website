// src/shaders/transition.js

// Basic vertex shader
export const transitionVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader with cyberpunk effect
export const transitionFragmentShader = `
  uniform float progress;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform vec3 uColor;
  uniform float uTime;
  
  varying vec2 vUv;
  
  void main() {
    // Add distortion effect
    vec2 newUV = vUv;
    float distortion = sin(vUv.y * 10.0 + uTime) * 0.1 * progress;
    newUV.x += distortion;
    
    // Create cyberpunk scanline effect
    float scanline = sin(vUv.y * 200.0 + uTime * 10.0) * 0.1;
    
    // Create glitch effect
    float glitchIntensity = step(0.99, sin(uTime * 100.0)) * step(0.5, progress);
    newUV.x += glitchIntensity * (step(0.5, sin(uTime * 1000.0)) * 2.0 - 1.0) * 0.1;
    
    // Create wipe effect with glowing edge
    float wipe = step(newUV.x, progress);
    float edge = smoothstep(progress - 0.1, progress, newUV.x) * 
                 smoothstep(progress + 0.1, progress, newUV.x);
    
    // Sample textures
    vec4 color1 = texture2D(texture1, newUV);
    vec4 color2 = texture2D(texture2, newUV);
    
    // Mix textures with effects
    vec4 finalColor = mix(color1, color2, wipe);
    finalColor.rgb += edge * uColor;
    finalColor.rgb += scanline;
    finalColor.rgb += glitchIntensity * vec3(0.1, 0.3, 0.5);
    
    gl_FragColor = finalColor;
  }
`;

// Shader uniforms configuration
export const transitionUniforms = {
  progress: { value: 0 },
  texture1: { value: null },
  texture2: { value: null },
  uColor: { value: [0, 0.706, 0.847] }, // #00B4D8 in RGB
  uTime: { value: 0 }
};

// Helper function to create transition material
export const createTransitionMaterial = (uniforms) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      ...transitionUniforms,
      ...uniforms
    },
    vertexShader: transitionVertexShader,
    fragmentShader: transitionFragmentShader,
    transparent: true
  });
};

// Example usage:
/*
import { createTransitionMaterial } from './shaders/transition';

const transitionMaterial = createTransitionMaterial({
  texture1: { value: texture1 },
  texture2: { value: texture2 }
});

// In animation loop:
transitionMaterial.uniforms.uTime.value = clock.getElapsedTime();
transitionMaterial.uniforms.progress.value = currentProgress;
*/