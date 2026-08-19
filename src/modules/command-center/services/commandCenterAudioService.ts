/**
 * Fleet Intelligence Smart AI - Command Center Audio Alert Synthesizer
 * Built using HTML5 Web Audio API with volume control and sound safety guards
 */

import { AudioAlertConfig } from '../types/commandCenterTypes';

class CommandCenterAudioService {
  private audioCtx: AudioContext | null = null;
  private config: AudioAlertConfig = {
    soundEnabled: true,
    volume: 0.7,
    muteNonCritical: false,
    repeatIntervalSec: 15,
  };
  private sirenIntervalId: number | null = null;

  constructor() {
    this.loadSavedSettings();
  }

  private loadSavedSettings(): void {
    try {
      const saved = localStorage.getItem('fleet_command_center_audio_v1');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore storage error
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('fleet_command_center_audio_v1', JSON.stringify(this.config));
    } catch {
      // Ignore storage error
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public getConfig(): AudioAlertConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AudioAlertConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveSettings();
    if (!this.config.soundEnabled) {
      this.stopEmergencySiren();
    }
  }

  /**
   * Play a clean, modern notification chime for general/high alerts
   */
  public playAlertChime(): void {
    if (!this.config.soundEnabled) return;
    if (this.config.muteNonCritical) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(this.config.volume * 0.4, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  }

  /**
   * Play urgent double-beep pulse for Emergency SOS Panic
   */
  public playEmergencyBeep(): void {
    if (!this.config.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Beep 1 (Higher Pitch)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(950, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(this.config.volume * 0.6, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.14);

      // Beep 2 (Upper Alarm)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(1200, now + 0.16);
      gain2.gain.setValueAtTime(0, now + 0.16);
      gain2.gain.linearRampToValueAtTime(this.config.volume * 0.65, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.35);
    } catch (e) {
      console.warn('Emergency audio error:', e);
    }
  }

  /**
   * Start looping emergency pulse for active unacknowledged panic
   */
  public startEmergencySiren(): void {
    if (!this.config.soundEnabled) return;
    if (this.sirenIntervalId !== null) return;

    this.playEmergencyBeep();
    this.sirenIntervalId = window.setInterval(() => {
      this.playEmergencyBeep();
    }, 4000);
  }

  public stopEmergencySiren(): void {
    if (this.sirenIntervalId !== null) {
      clearInterval(this.sirenIntervalId);
      this.sirenIntervalId = null;
    }
  }
}

export const commandCenterAudioService = new CommandCenterAudioService();
