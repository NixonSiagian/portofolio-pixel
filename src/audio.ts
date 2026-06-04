/**
 * Sound synthesizer built with the native Web Audio API. 
 * Allows beautiful retro beeps, game steps, and persistent ambient lo-fi music 
 * without any external asset loading or network dependencies.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private isMusicPlaying = false;
  private isSoundFXEnabled = true;
  private sequencerStep = 0;
  private bpm = 84;

  // Pentatonic scale in A Minor (warm, cozy, and meditative)
  // A2, C3, E3, G3, A3, C4, E4, G4, A4
  private cozyScale = [110.00, 130.81, 164.81, 196.00, 220.00, 261.63, 329.63, 392.00, 440.00];

  private musicStyle: "workspace" | "projects" | "experience" | "observatory" | "contact" = "workspace";

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser environment.", e);
    }
  }

  setMusicStyle(style: "workspace" | "projects" | "experience" | "observatory" | "contact") {
    const prevStyle = this.musicStyle;
    this.musicStyle = style;
    
    // Dynamically adjust operational parameters based on room biome
    if (style === "projects") {
      this.bpm = 112; // Snappy up-tempo electronic beats
    } else if (style === "workspace") {
      this.bpm = 80;  // Relaxed chill Lo-fi
    } else if (style === "experience") {
      this.bpm = 95;  // Inspiring, driving syncopations
    } else if (style === "observatory") {
      this.bpm = 48;  // Slow, floating cosmic drift
    } else if (style === "contact") {
      this.bpm = 74;  // Soothing warm ambient lounge
    }

    // If style changed while music was already flowing, restart interval to sync new BPM
    if (this.isMusicPlaying && prevStyle !== style) {
      this.stopAmbientMusic();
      this.startAmbientMusic();
    }
  }

  getMusicStyle() {
    return this.musicStyle;
  }

  setSoundFXEnabled(enabled: boolean) {
    this.isSoundFXEnabled = enabled;
  }

  isSoundFXOn() {
    return this.isSoundFXEnabled;
  }

  isMusicOn() {
    return this.isMusicPlaying;
  }

  // Tactical click / beep for UI feedback
  playBeep(freq = 600, duration = 0.08, type: OscillatorType = "sine") {
    if (!this.isSoundFXEnabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, this.ctx.currentTime + duration);

    gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Soft low-frequency thud for character steps
  playStep() {
    if (!this.isSoundFXEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(55, this.ctx.currentTime); // very low thud
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Cute upward arpeggio on modal open
  playInteract() {
    if (!this.isSoundFXEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [220, 329.63, 440, 659.25]; // A Minor chord notes asc
    
    freqs.forEach((freq, idx) => {
      const scheduledTime = now + (idx * 0.05);
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, scheduledTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, scheduledTime + 0.15);

      gainNode.gain.setValueAtTime(0.04, scheduledTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, scheduledTime + 0.15);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(scheduledTime);
      osc.stop(scheduledTime + 0.15);
    });
  }

  // Downward chirp on modal close
  playClose() {
    if (!this.isSoundFXEnabled) return;
    this.init();
    if (!this.ctx) return;

    const dummyNow = this.ctx.currentTime;
    const freqs = [659.25, 440, 329.63, 220]; // descending notes
    
    freqs.forEach((freq, idx) => {
      const scheduledTime = dummyNow + (idx * 0.04);
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, scheduledTime);

      gainNode.gain.setValueAtTime(0.03, scheduledTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, scheduledTime + 0.12);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(scheduledTime);
      osc.stop(scheduledTime + 0.12);
    });
  }

  // Special bass-heavy tactile mechanical thud + frequency modulation for heavy CRT / PCs
  playHeavyInteract() {
    if (!this.isSoundFXEnabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Low frequency high-power resonance thud
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(95, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 0.38);
    
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    
    // CRT high frequency capacitor click / laptop keyboard tactile switch sound
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(190, now);
    osc2.frequency.setValueAtTime(340, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(55, now + 0.18);
    
    gain2.gain.setValueAtTime(0.05, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, now);
    
    osc2.connect(filter);
    filter.connect(gain2);
    gain2.connect(this.ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.38);
    
    osc2.start(now);
    osc2.stop(now + 0.18);

    // Dispatches custom event to notify listening game map to shake camera!
    window.dispatchEvent(new CustomEvent("heavy-sound-shaken", { detail: { intensity: 10 } }));
  }

  // Start Cozy Stardew-Like ambient MIDI loop
  startAmbientMusic() {
    this.init();
    if (!this.ctx) return;

    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const stepDuration = 60 / this.bpm / 2; // Eighth notes loop

    // Procedural ambient game music loop with style-adaptive synths
    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.isMusicPlaying) return;

      const now = this.ctx.currentTime;
      
      // Determine what chord/harmony of A minor is active
      // 4 measures looping: Am - F - C - G
      const measure = Math.floor(this.sequencerStep / 16) % 4;
      const stepInMeasure = this.sequencerStep % 16;
      
      let baseRoot = 110.00; // Am root (A2)
      if (measure === 1) baseRoot = 87.31; // F root (F2)
      if (measure === 2) baseRoot = 130.81; // C root (C2 / C3)
      if (measure === 3) baseRoot = 98.00; // G root (G2)

      // 1. STYLE-ADAPTIVE SYNTHESIS PARAMETERS
      let bassVolume = 0.04;
      let bassType: OscillatorType = "sine";
      let pluckType: OscillatorType = "triangle";
      let pluckVolume = 0.035;
      let pluckDuration = 0.35;

      switch (this.musicStyle) {
        case "projects": // Snappy retro Electronic
          bassVolume = 0.045;
          bassType = "triangle";
          pluckType = "square";
          pluckVolume = 0.02;
          pluckDuration = 0.16; // shorter clicky
          break;
        case "experience": // Upbeat Inspirational
          bassVolume = 0.035;
          bassType = "sine";
          pluckType = "triangle";
          pluckVolume = 0.04;
          pluckDuration = 0.45;
          break;
        case "observatory": // Deep Space Ambient
          bassVolume = 0.03;
          bassType = "sine";
          pluckType = "sine";
          pluckVolume = 0.035;
          pluckDuration = 1.1; // extreme dreamy decay
          break;
        case "contact": // Warm relaxing lounge
          bassVolume = 0.04;
          bassType = "sine";
          pluckType = "sine";
          pluckVolume = 0.03;
          pluckDuration = 0.6;
          break;
        case "workspace":
        default: // Soft Lo-Fi
          bassVolume = 0.04;
          bassType = "sine";
          pluckType = "triangle";
          pluckVolume = 0.035;
          pluckDuration = 0.35;
          break;
      }
      
      // 2. PLAY BASS LAYER
      if (stepInMeasure === 0 || stepInMeasure === 8) {
        this.playPluck(baseRoot, 0.65, bassType, bassVolume, 0.4);
        
        // Harmonize with perfect 5th or minor 3rd depending on mood
        const intervalRatio = (this.musicStyle === "projects" ? 1.5 : 1.33); 
        this.playPluck(baseRoot * intervalRatio, 0.75, bassType, bassVolume * 0.4, 0.5);
      }

      // 3. PLAY MELODY ARPEGGIATION STRATEGY
      const isMelodyBeat = 
        this.musicStyle === "projects" 
          ? (stepInMeasure % 4 === 0 || (stepInMeasure % 2 === 0 && Math.random() > 0.45))
          : this.musicStyle === "observatory"
            ? (stepInMeasure === 2 || stepInMeasure === 10) // sparse spaced ambiance
            : (stepInMeasure % 4 === 0 || (stepInMeasure % 3 === 0 && Math.random() > 0.4));

      if (isMelodyBeat) {
        let freqPool = this.cozyScale.slice(3); // Upper scale ranges (C4 - A4)
        
        // Observatory gets higher cosmic twinkling registers
        if (this.musicStyle === "observatory") {
          freqPool = this.cozyScale.slice(5).map(f => f * 2); // Shift up whole octave
        } else if (this.musicStyle === "projects") {
          freqPool = this.cozyScale.slice(2, 7); // tighter midrange sequences
        }

        const chordNote = freqPool[Math.floor(Math.random() * freqPool.length)];
        this.playPluck(chordNote, pluckDuration, pluckType, pluckVolume, 0.3);

        // Rare soft echo reflections for that rich stereophonic depth
        if (Math.random() > 0.7 && this.musicStyle !== "projects") {
          setTimeout(() => {
            if (this.isMusicPlaying) {
              this.playPluck(chordNote * 0.75, pluckDuration * 0.8, "sine", pluckVolume * 0.3, 0.2);
            }
          }, stepDuration * 500);
        }
      }

      this.sequencerStep++;
    }, stepDuration * 1000);
  }

  stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Play a soft plucked string synthesize sound helper
  private playPluck(freq: number, duration: number, type: OscillatorType, maxVolume: number, decay: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Warm filter sweeping downwards (lowpass)
    filter.type = "lowpass";
    filter.Q.setValueAtTime(1.5, now);
    filter.frequency.setValueAtTime(freq * 3, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.1, now + duration);

    // Exponential sound decaying
    gainNode.gain.setValueAtTime(maxVolume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }
}

export const soundEngine = new AudioEngine();
