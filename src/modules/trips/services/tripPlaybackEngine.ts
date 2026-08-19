/**
 * Fleet Intelligence Smart AI - Trip Route Playback Engine
 * PROMPT 14 — Route Scrubbing, Speed Control, Frame Interpolation & Animation Loop
 */

import { TripPoint, TripEvent } from '../types';

export type PlaybackStatus = 'STOPPED' | 'PLAYING' | 'PAUSED';

export interface PlaybackFrameState {
  status: PlaybackStatus;
  currentIndex: number;
  totalPoints: number;
  currentPoint: TripPoint | null;
  progressPercent: number; // 0 to 100
  speedMultiplier: number; // 0.5 to 16
  elapsedSeconds: number;
  totalDurationSeconds: number;
  activeEvent: TripEvent | null;
}

export type PlaybackListener = (state: PlaybackFrameState) => void;

export class TripPlaybackEngine {
  private points: TripPoint[] = [];
  private events: TripEvent[] = [];
  private currentIndex: number = 0;
  private status: PlaybackStatus = 'STOPPED';
  private speedMultiplier: number = 1;
  private animationFrameId: number | null = null;
  private lastFrameTimestamp: number = 0;
  private listeners: Set<PlaybackListener> = new Set();
  private totalDurationSeconds: number = 0;

  public loadRoute(points: TripPoint[], events: TripEvent[] = []): void {
    this.stop();
    this.points = points;
    this.events = events;
    this.currentIndex = 0;

    if (points.length > 1) {
      const startMs = new Date(points[0].timestamp).getTime();
      const endMs = new Date(points[points.length - 1].timestamp).getTime();
      this.totalDurationSeconds = Math.max(0, (endMs - startMs) / 1000);
    } else {
      this.totalDurationSeconds = 0;
    }

    this.notifyListeners();
  }

  public play(): void {
    if (this.points.length === 0) return;
    if (this.currentIndex >= this.points.length - 1) {
      this.currentIndex = 0; // restart if at end
    }
    this.status = 'PLAYING';
    this.lastFrameTimestamp = performance.now();
    this.notifyListeners();
    this.tick();
  }

  public pause(): void {
    this.status = 'PAUSED';
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.notifyListeners();
  }

  public stop(): void {
    this.status = 'STOPPED';
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.currentIndex = 0;
    this.notifyListeners();
  }

  public setSpeedMultiplier(multiplier: number): void {
    this.speedMultiplier = Math.max(0.5, Math.min(16, multiplier));
    this.notifyListeners();
  }

  public seekToIndex(index: number): void {
    if (this.points.length === 0) return;
    this.currentIndex = Math.max(0, Math.min(this.points.length - 1, index));
    this.notifyListeners();
  }

  public seekToPercent(percent: number): void {
    if (this.points.length === 0) return;
    const targetIdx = Math.round(((this.points.length - 1) * Math.max(0, Math.min(100, percent))) / 100);
    this.seekToIndex(targetIdx);
  }

  public stepForward(): void {
    if (this.currentIndex < this.points.length - 1) {
      this.currentIndex++;
      this.notifyListeners();
    }
  }

  public stepBackward(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.notifyListeners();
    }
  }

  private tick = (): void => {
    if (this.status !== 'PLAYING') return;

    const now = performance.now();
    const dtRealMs = now - this.lastFrameTimestamp;
    this.lastFrameTimestamp = now;

    // Advance points based on speed multiplier and timestamp delta
    if (this.points.length > 1 && this.currentIndex < this.points.length - 1) {
      const currPt = this.points[this.currentIndex];
      const nextPt = this.points[this.currentIndex + 1];

      const currTime = new Date(currPt.timestamp).getTime();
      const nextTime = new Date(nextPt.timestamp).getTime();
      const gapSimMs = Math.max(100, nextTime - currTime);

      // Base tick interval scaling
      const stepIncrement = (dtRealMs * this.speedMultiplier * 5) / gapSimMs;

      if (stepIncrement >= 1) {
        this.currentIndex += Math.floor(stepIncrement);
      } else {
        this.currentIndex += 1;
      }

      if (this.currentIndex >= this.points.length - 1) {
        this.currentIndex = this.points.length - 1;
        this.status = 'PAUSED';
        this.notifyListeners();
        return;
      }
    } else {
      this.status = 'PAUSED';
      this.notifyListeners();
      return;
    }

    this.notifyListeners();
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): PlaybackFrameState {
    const currentPoint = this.points[this.currentIndex] || null;
    const progressPercent = this.points.length > 1 ? (this.currentIndex / (this.points.length - 1)) * 100 : 0;

    let elapsedSeconds = 0;
    if (this.points.length > 1 && currentPoint) {
      const startMs = new Date(this.points[0].timestamp).getTime();
      const currMs = new Date(currentPoint.timestamp).getTime();
      elapsedSeconds = Math.max(0, (currMs - startMs) / 1000);
    }

    // Check for nearby event at current point
    let activeEvent: TripEvent | null = null;
    if (currentPoint) {
      const matched = this.events.find(e => {
        const eMs = new Date(e.timestamp).getTime();
        const cMs = new Date(currentPoint.timestamp).getTime();
        return Math.abs(eMs - cMs) <= 15000;
      });
      if (matched) activeEvent = matched;
    }

    return {
      status: this.status,
      currentIndex: this.currentIndex,
      totalPoints: this.points.length,
      currentPoint,
      progressPercent: parseFloat(progressPercent.toFixed(1)),
      speedMultiplier: this.speedMultiplier,
      elapsedSeconds,
      totalDurationSeconds: this.totalDurationSeconds,
      activeEvent,
    };
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

export const tripPlaybackEngine = new TripPlaybackEngine();
