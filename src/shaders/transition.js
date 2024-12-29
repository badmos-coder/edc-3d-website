export const transitionVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const transitionFragmentShader = `
  uniform float progress;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  varying vec2 vUv;

  void main() {
    vec2 newUV = vUv;
    
    float wipe = step(newUV.x, progress);
    vec4 color1 = texture2D(texture1, newUV);
    vec4 color2 = texture2D(texture2, newUV);
    
    gl_FragColor = mix(color1, color2, wipe);
  }
`