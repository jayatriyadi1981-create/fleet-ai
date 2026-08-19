/**
 * Fleet Intelligence Smart AI - Fuel Signal Processor
 * PROMPT 24 - Raw Telemetry Signal Filtering, Spike Suppression & Confidence Scoring
 */

import { FuelReading, FuelConfidence, FuelRule } from '../types';

export interface ProcessedSignalResult {
  filteredLevel: number;
  filteredPct: number;
  confidence: FuelConfidence;
  isNoiseSpike: boolean;
  isFlatline: boolean;
  isSensorJump: boolean;
  anomalyDetected?: string;
}

/**
 * Filter raw fuel readings against previous readings to eliminate sloshing/vibration noise.
 */
export function processFuelSignal(
  current: FuelReading,
  previous?: FuelReading,
  rule?: FuelRule
): ProcessedSignalResult {
  const raw = current.rawFuelLevel ?? current.fuelLevel;
  const tankCapacity = 300; // default tank capacity in liters
  const jumpThresholdPct = rule?.sensorJumpThresholdPct ?? 15;

  if (!previous) {
    return {
      filteredLevel: raw,
      filteredPct: Math.min(100, Math.max(0, (raw / tankCapacity) * 100)),
      confidence: current.confidence || 'HIGH',
      isNoiseSpike: false,
      isFlatline: false,
      isSensorJump: false,
    };
  }

  const prevRaw = previous.rawFuelLevel ?? previous.fuelLevel;
  const diffPct = Math.abs(((raw - prevRaw) / tankCapacity) * 100);

  // Detect sudden spike/drop while vehicle is moving at high speed (sloshing)
  const isMovingFast = (current.latitude !== previous.latitude || current.longitude !== previous.longitude);
  const isNoiseSpike = isMovingFast && diffPct > 8 && current.ignitionStatus !== false;

  // Detect flatline (sensor stuck at fixed value across hours)
  const isFlatline = raw === prevRaw && (new Date(current.timestamp).getTime() - new Date(previous.timestamp).getTime() > 12 * 3600 * 1000);

  // Detect sudden physical jump/drop
  const isSensorJump = diffPct > jumpThresholdPct;

  let confidence: FuelConfidence = current.confidence;
  if (isNoiseSpike || isFlatline) {
    confidence = 'LOW';
  } else if (isSensorJump) {
    confidence = 'MEDIUM';
  }

  // Apply Exponential Moving Average (EMA) smoothing for noise spikes
  const alpha = isNoiseSpike ? 0.25 : 0.8;
  const filteredLevel = Math.round((raw * alpha + prevRaw * (1 - alpha)) * 10) / 10;
  const filteredPct = Math.min(100, Math.max(0, Math.round((filteredLevel / tankCapacity) * 100)));

  return {
    filteredLevel,
    filteredPct,
    confidence,
    isNoiseSpike,
    isFlatline,
    isSensorJump,
    anomalyDetected: isNoiseSpike
      ? 'NOISE_SPIKE_SUPPRESSED'
      : isFlatline
      ? 'SENSOR_FLATLINE_STUCK'
      : isSensorJump
      ? 'SUDDEN_FUEL_JUMP'
      : undefined,
  };
}
