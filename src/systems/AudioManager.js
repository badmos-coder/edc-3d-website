import { Howl } from 'howler';

class AudioManager {
  constructor() {
    this.sounds = {
      background: new Howl({
        src: ['/assets/sounds/background.mp3'],
        loop: true,
        volume: 0.3,
        autoplay: false
      }),
      hover: new Howl({
        src: ['/assets/sounds/hover.mp3'],
        volume: 0.5
      }),
      click: new Howl({
        src: ['/assets/sounds/click.mp3'],
        volume: 0.5
      }),
      transition: new Howl({
        src: ['/assets/sounds/transition.mp3'],
        volume: 0.5
      }),
      portal: new Howl({
        src: ['/assets/sounds/portal.mp3'],
        volume: 0.5
      })
    };

    this.isMuted = false;
    this.backgroundVolume = 0.3;
    this.effectsVolume = 0.5;
  }

  playSound(soundName) {
    if (!this.isMuted && this.sounds[soundName]) {
      this.sounds[soundName].play();
    }
  }

  stopSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].stop();
    }
  }

  startBackground() {
    if (!this.isMuted) {
      this.sounds.background.play();
      this.fadeIn('background', 2000);
    }
  }

  stopBackground() {
    this.fadeOut('background', 2000);
  }

  fadeIn(soundName, duration) {
    if (this.sounds[soundName]) {
      const targetVolume = soundName === 'background' ? 
        this.backgroundVolume : this.effectsVolume;
      
      this.sounds[soundName].fade(0, targetVolume, duration);
    }
  }

  fadeOut(soundName, duration) {
    if (this.sounds[soundName]) {
      const currentVolume = this.sounds[soundName].volume();
      this.sounds[soundName].fade(currentVolume, 0, duration);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Object.values(this.sounds).forEach(sound => {
      sound.mute(this.isMuted);
    });
  }

  setBackgroundVolume(volume) {
    this.backgroundVolume = volume;
    this.sounds.background.volume(volume);
  }

  setEffectsVolume(volume) {
    this.effectsVolume = volume;
    Object.entries(this.sounds).forEach(([name, sound]) => {
      if (name !== 'background') {
        sound.volume(volume);
      }
    });
  }

  // Add spatial audio effect
  playSpatialSound(soundName, position, maxDistance = 10) {
    if (!this.isMuted && this.sounds[soundName]) {
      const sound = this.sounds[soundName];
      
      // Calculate distance-based volume
      const distance = Math.sqrt(
        position.x * position.x +
        position.y * position.y +
        position.z * position.z
      );
      
      const volume = Math.max(0, 1 - distance / maxDistance);
      sound.volume(volume * this.effectsVolume);
      
      // Add stereo panning based on x position
      const pan = Math.max(-1, Math.min(1, position.x / maxDistance));
      sound.stereo(pan);
      
      sound.play();
    }
  }
}

export const audioManager = new AudioManager();