/* ==========================================================================
   AURELIA — Haute Roastery & Coffee Sanctuary
   Acoustic Sanctuary Harmony Player (Single Signature Soft Luxury Tune)
   ========================================================================== */

export class AmbientSoundscape {
  constructor(toggleBtnId = 'btn-audio-toggle', indicatorId = 'sound-equalizer') {
    this.toggleBtn = document.getElementById(toggleBtnId);
    this.indicator = document.getElementById(indicatorId);
    this.mobileToggleBtn = document.getElementById('btn-audio-mobile');

    this.isPlaying = false;
    this.targetVolume = 0.14; // Sweet, soft, delicate, warming luxury volume

    // Single Signature Luxury Ambient Tune (Soft Acoustic Grand Piano)
    this.track = {
      title: 'Aurelia Sanctuary Harmony',
      subtitle: 'Soft Acoustic Piano & Meditative Ambiance',
      src: 'audio/luxury-sanctuary-tune.mp3'
    };

    // HTML5 Audio Engine with seamless looping
    this.audioElement = new Audio();
    this.audioElement.src = this.track.src;
    this.audioElement.loop = true;
    this.audioElement.preload = 'auto';
    this.audioElement.volume = 0;

    this.fadeInterval = null;

    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    if (this.mobileToggleBtn) {
      this.mobileToggleBtn.addEventListener('click', () => this.toggle());
    }

    // Fallback if audio fails to play or load
    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio playback notice:', e);
    });

    this.updateUI(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audioElement.play().then(() => {
      this.isPlaying = true;
      this.fadeIn();
      this.updateUI(true);
    }).catch(err => {
      console.warn('Audio play prevented by browser autoplay policy:', err);
    });
  }

  pause() {
    this.fadeOut(() => {
      this.audioElement.pause();
      this.isPlaying = false;
      this.updateUI(false);
    });
  }

  fadeIn() {
    clearInterval(this.fadeInterval);
    let vol = this.audioElement.volume;
    this.fadeInterval = setInterval(() => {
      vol = Math.min(this.targetVolume, vol + 0.015);
      this.audioElement.volume = vol;
      if (vol >= this.targetVolume) {
        clearInterval(this.fadeInterval);
      }
    }, 60);
  }

  fadeOut(callback) {
    clearInterval(this.fadeInterval);
    let vol = this.audioElement.volume;
    this.fadeInterval = setInterval(() => {
      vol = Math.max(0, vol - 0.02);
      this.audioElement.volume = vol;
      if (vol <= 0.005) {
        this.audioElement.volume = 0;
        clearInterval(this.fadeInterval);
        if (callback) callback();
      }
    }, 40);
  }

  updateUI(playing) {
    // Header Toggle Button
    if (this.toggleBtn) {
      const textSpan = this.toggleBtn.querySelector('.audio-status-text');
      if (textSpan) {
        textSpan.textContent = playing ? 'SANCTUARY TUNE: ON' : 'SANCTUARY TUNE';
      }

      if (playing) {
        this.toggleBtn.classList.add('border-gold-400', 'text-yellow-400', 'shadow-[0_0_15px_rgba(250,204,21,0.35)]');
        this.toggleBtn.classList.remove('text-stone-300');
        this.toggleBtn.setAttribute('title', 'Soft sanctuary piano tune is playing. Click to pause.');
      } else {
        this.toggleBtn.classList.remove('border-gold-400', 'text-yellow-400', 'shadow-[0_0_15px_rgba(250,204,21,0.35)]');
        this.toggleBtn.classList.add('text-stone-300');
        this.toggleBtn.setAttribute('title', 'Click to play soft, luxurious coffee sanctuary ambient tune');
      }
    }

    // Equalizer animation
    if (this.indicator) {
      if (playing) {
        this.indicator.classList.remove('equalizer-paused');
      } else {
        this.indicator.classList.add('equalizer-paused');
      }
    }

    // Mobile Drawer Status
    if (this.mobileToggleBtn) {
      const statusSpan = document.getElementById('mobile-audio-status');
      if (statusSpan) {
        statusSpan.textContent = playing ? 'ON' : 'OFF';
        statusSpan.className = playing ? 'text-yellow-400 font-bold' : 'text-stone-400';
      }
    }
  }
}
