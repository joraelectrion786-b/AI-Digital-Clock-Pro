import { AlarmSoundId } from '../types/clock';

class SoundController {
  private ctx: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeInterval: any = null;
  private customAudio: HTMLAudioElement | null = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a single note chime
  playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.5, volume: number = 0.8) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback not allowed or failed:', e);
    }
  }

  // Play pleasant click / tick for clock
  playTick(volume: number = 0.5) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      // Ignored for ticks
    }
  }

  // Play one cycle of alarm sound
  playAlarmSequence(sound: AlarmSoundId, volume: number = 80, customAudioUrl?: string | null) {
    const vol = Math.max(0.05, Math.min(1, volume / 100));

    if (sound === 'custom' && customAudioUrl) {
      if (this.customAudio) {
        this.customAudio.pause();
      }
      this.customAudio = new Audio(customAudioUrl);
      this.customAudio.volume = vol;
      this.customAudio.play().catch((err) => console.warn('Custom audio playback error:', err));
      return;
    }

    const ctx = this.getContext();

    if (sound === 'beep') {
      // Classic digital watch double-beep
      [0, 0.15].forEach((delay) => {
        setTimeout(() => {
          this.playTone(2048, 'square', 0.08, vol * 0.5);
        }, delay * 1000);
      });
    } else if (sound === 'bell') {
      // Resonant 2-tone temple bell
      this.playTone(880, 'sine', 1.2, vol);
      setTimeout(() => this.playTone(1320, 'sine', 0.9, vol * 0.7), 250);
    } else if (sound === 'radar') {
      // Pulsing radar sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (sound === 'harp') {
      // Pentatonic soothing harp arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 1.4, vol * 0.6);
        }, idx * 120);
      });
    } else {
      // Default: Morning Chime (warm harmonics)
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 1.5, vol * 0.7);
        }, idx * 180);
      });
    }
  }

  // Start continuous alarm ringing
  startAlarm(sound: AlarmSoundId, volume: number = 80, customAudioUrl?: string | null) {
    this.stopAlarm();
    this.playAlarmSequence(sound, volume, customAudioUrl);

    if (sound === 'custom' && customAudioUrl) {
      if (this.customAudio) {
        this.customAudio.loop = true;
      }
      return;
    }

    const intervalMs = sound === 'beep' ? 1200 : sound === 'radar' ? 1500 : 2500;
    this.activeInterval = setInterval(() => {
      this.playAlarmSequence(sound, volume, customAudioUrl);
    }, intervalMs);
  }

  // Stop alarm
  stopAlarm() {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
      this.customAudio = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];
  }
}

export const soundManager = new SoundController();
