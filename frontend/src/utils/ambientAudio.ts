/**
 * Web Audio API Ambient Sound Synthesizer
 * Generates pure, soothing, authentic ambient soundscapes entirely in-browser
 * with zero external asset dependencies, zero network latency, and zero CORS issues.
 */

export type AmbientSoundType = 'rain' | 'meditation' | 'focus' | 'ambient';

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: Array<{ stop?: () => void; disconnect: () => void }> = [];
  private chimeIntervalId: number | null = null;
  private _isPlaying: boolean = false;
  private currentVolume: number = 0.7;

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public play(resourceId: string, volume: number = 0.7): void {
    this.stop();

    try {
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      this.currentVolume = volume;
      this.masterGain = ctx.createGain();
      // Smooth fade-in
      this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, volume),
        ctx.currentTime + 0.8
      );
      this.masterGain.connect(ctx.destination);
      this._isPlaying = true;

      const lowerId = resourceId.toLowerCase();
      if (lowerId.includes('rain') || lowerId.includes('calm_sounds') || lowerId.includes('calming')) {
        this.startRainSoundscape(ctx, this.masterGain);
      } else if (lowerId.includes('focus')) {
        this.startFocusBinaural(ctx, this.masterGain);
      } else {
        // Default: Daily Meditation / Mindful Reset / Zen Pad
        this.startMeditationSoundscape(ctx, this.masterGain);
      }
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  }

  public setVolume(volume: number): void {
    this.currentVolume = volume;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(
        Math.max(0.0001, Math.min(1, volume)),
        this.ctx.currentTime
      );
    }
  }

  public pause(): void {
    if (!this._isPlaying || !this.ctx || !this.masterGain) return;
    try {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
      setTimeout(() => {
        this.stop();
      }, 250);
    } catch {
      this.stop();
    }
  }

  public stop(): void {
    this._isPlaying = false;

    if (this.chimeIntervalId !== null) {
      window.clearInterval(this.chimeIntervalId);
      this.chimeIntervalId = null;
    }

    for (const node of this.activeNodes) {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // ignore
      }
    }
    this.activeNodes = [];

    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {
        // ignore
      }
      this.masterGain = null;
    }
  }

  /**
   * Soundscape 1: Soothing Rain & Gentle Nature Swells
   */
  private startRainSoundscape(ctx: AudioContext, destination: GainNode): void {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * 3; // 3-second seamless noise buffer
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let lastL = 0;
    let lastR = 0;

    // Organic Brown/Pink Noise algorithm for rain sound
    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;

      lastL = (lastL + 0.025 * whiteL) / 1.025;
      lastR = (lastR + 0.025 * whiteR) / 1.025;

      left[i] = lastL * 3.8;
      right[i] = lastR * 3.8;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Gentle low-pass filter
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(800, ctx.currentTime);

    // Subtle LFO modulating rainfall intensity
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 5-second cycle
    lfoGain.gain.setValueAtTime(180, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    // Warm sub-bed for grounding atmosphere
    const warmSub = ctx.createOscillator();
    const subGain = ctx.createGain();
    warmSub.type = 'sine';
    warmSub.frequency.setValueAtTime(108, ctx.currentTime);
    subGain.gain.setValueAtTime(0.04, ctx.currentTime);
    warmSub.connect(subGain);
    subGain.connect(destination);

    noiseSource.connect(lowpass);
    lowpass.connect(destination);

    noiseSource.start();
    lfo.start();
    warmSub.start();

    this.activeNodes.push(noiseSource, lfo, warmSub, lowpass, lfoGain, subGain);

    // Occasional gentle water drops / harmonic chime
    const playWaterDrop = () => {
      if (!this._isPlaying || !this.ctx || !this.masterGain) return;
      try {
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        const dropFreq = 1200 + Math.random() * 600;

        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(dropFreq, ctx.currentTime);
        dropOsc.frequency.exponentialRampToValueAtTime(dropFreq * 0.6, ctx.currentTime + 0.08);

        dropGain.gain.setValueAtTime(0.02, ctx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

        dropOsc.connect(dropGain);
        dropGain.connect(destination);

        dropOsc.start();
        dropOsc.stop(ctx.currentTime + 0.09);
      } catch {
        // ignore
      }
    };

    this.chimeIntervalId = window.setInterval(playWaterDrop, 4500);
  }

  /**
   * Soundscape 2: Mindful Reset & Tibetan Singing Bowl Meditation
   * Tuned to 432 Hz Solfeggio harmonic drone with periodic singing bowl chime.
   */
  private startMeditationSoundscape(ctx: AudioContext, destination: GainNode): void {
    // 432Hz tuning: A3 = 216Hz, E4 = 324Hz, A4 = 432Hz, C#4 = 270Hz
    const chordFrequencies = [108, 216, 270, 324, 432];

    chordFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      // Slight chorus detune
      const detune = (idx - 2) * 1.5;
      osc.frequency.setValueAtTime(freq + detune, ctx.currentTime);

      // Volume proportional to frequency
      const nodeGain = 0.07 / (idx + 1);
      gain.gain.setValueAtTime(nodeGain, ctx.currentTime);

      osc.connect(gain);
      gain.connect(destination);

      osc.start();
      this.activeNodes.push(osc, gain);
    });

    // Singing bowl bell strike function
    const strikeSingingBowl = (fundamental = 528) => {
      if (!this._isPlaying || !this.ctx || !this.masterGain) return;
      try {
        const harmonics = [fundamental, fundamental * 2.01, fundamental * 3.03];
        harmonics.forEach((hFreq, i) => {
          const bOsc = ctx.createOscillator();
          const bGain = ctx.createGain();

          bOsc.type = 'sine';
          bOsc.frequency.setValueAtTime(hFreq, ctx.currentTime);

          const peak = (0.08 / (i + 1)) * (this.currentVolume || 0.7);
          bGain.gain.setValueAtTime(0.0001, ctx.currentTime);
          bGain.gain.linearRampToValueAtTime(peak, ctx.currentTime + 0.02);
          bGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.2);

          bOsc.connect(bGain);
          bGain.connect(destination);

          bOsc.start();
          bOsc.stop(ctx.currentTime + 4.3);
        });
      } catch {
        // ignore
      }
    };

    // Strike once right away when starting
    strikeSingingBowl(528);

    // Periodic gentle bowl chime every 9 seconds
    this.chimeIntervalId = window.setInterval(() => {
      strikeSingingBowl(Math.random() > 0.5 ? 528 : 432);
    }, 9000);
  }

  /**
   * Soundscape 3: Deep Alpha-Wave Focus Drone
   * Left ear 140 Hz, Right ear 150 Hz -> creates a 10 Hz alpha wave binaural beat
   * known to facilitate calm flow-state study sessions.
   */
  private startFocusBinaural(ctx: AudioContext, destination: GainNode): void {
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();

    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(140, ctx.currentTime);
    rightOsc.frequency.setValueAtTime(150, ctx.currentTime); // 10Hz differential

    leftGain.gain.setValueAtTime(0.08, ctx.currentTime);
    rightGain.gain.setValueAtTime(0.08, ctx.currentTime);

    // Warm background ambient pad
    const padOsc = ctx.createOscillator();
    const padGain = ctx.createGain();
    const padFilter = ctx.createBiquadFilter();

    padOsc.type = 'sawtooth';
    padOsc.frequency.setValueAtTime(220, ctx.currentTime);
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(320, ctx.currentTime);
    padGain.gain.setValueAtTime(0.03, ctx.currentTime);

    padOsc.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(destination);

    leftOsc.connect(leftGain);
    leftGain.connect(destination);

    rightOsc.connect(rightGain);
    rightGain.connect(destination);

    leftOsc.start();
    rightOsc.start();
    padOsc.start();

    this.activeNodes.push(leftOsc, rightOsc, padOsc, leftGain, rightGain, padGain, padFilter);
  }
}

// Global singleton instance for audio playback
export const ambientAudio = new AmbientAudioEngine();
