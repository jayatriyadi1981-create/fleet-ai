/**
 * Driver Behavior Engine - Core Telematics Analytics & Event Detection Service
 * Evaluates GPS and sensor telemetry stream to extract objective behavior events
 * PROMPT 21 Architecture
 */

import {
  BehaviorEventType,
  BehaviorSeverity,
  DriverBehaviorEvent,
  DriverBehaviorRule,
  EventMetadata,
  TelemetryPoint,
} from '../types';

export class DriverBehaviorEngine {
  /**
   * Preprocessing GPS noise filter
   * Filters out impossible location jumps or GPS satellite loss spikes
   */
  public filterGpsNoise(points: TelemetryPoint[]): TelemetryPoint[] {
    if (!points || points.length < 2) return points;

    return points.filter((pt, idx) => {
      // Ignore extreme speed outliers (e.g. > 180 km/h for fleet commercial trucks)
      if (pt.speed > 180) return false;

      // Ignore sudden velocity jump if previous point exists
      if (idx > 0) {
        const prev = points[idx - 1];
        const timeDiffSec = (new Date(pt.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000;
        if (timeDiffSec > 0 && timeDiffSec < 5) {
          const speedDelta = Math.abs(pt.speed - prev.speed);
          // Speed increase > 80 km/h in under 2 seconds is physically noise
          if (speedDelta > 80) return false;
        }
      }

      return true;
    });
  }

  /**
   * Detect Overspeed Events
   * Requires continuous excess speed beyond minimum duration to ignore single-packet noise spikes
   */
  public detectOverspeed(
    speed: number,
    speedLimit: number,
    durationSeconds: number,
    rule?: DriverBehaviorRule
  ): { isDetected: boolean; severity: BehaviorSeverity; excessSpeed: number; riskScore: number } {
    const minDuration = rule ? rule.duration : 5; // Default 5s threshold
    const excessSpeed = speed - speedLimit;

    if (excessSpeed <= 0 || durationSeconds < minDuration) {
      return { isDetected: false, severity: 'LOW', excessSpeed: 0, riskScore: 0 };
    }

    let severity: BehaviorSeverity = 'LOW';
    let riskScore = 20;

    if (excessSpeed > 30 || (excessSpeed > 20 && durationSeconds > 30)) {
      severity = 'CRITICAL';
      riskScore = 95;
    } else if (excessSpeed > 20 || (excessSpeed > 10 && durationSeconds > 15)) {
      severity = 'HIGH';
      riskScore = 75;
    } else if (excessSpeed > 10) {
      severity = 'MEDIUM';
      riskScore = 50;
    } else {
      severity = 'LOW';
      riskScore = 25;
    }

    return { isDetected: true, severity, excessSpeed, riskScore };
  }

  /**
   * Detect Harsh Braking Events
   * Based on deceleration value (m/s^2)
   */
  public detectHarshBraking(
    deceleration: number, // negative value or positive magnitude m/s^2
    rule?: DriverBehaviorRule
  ): { isDetected: boolean; severity: BehaviorSeverity; riskScore: number } {
    const threshold = rule ? rule.threshold : -3.0; // m/s^2
    const decelMagnitude = Math.abs(deceleration);
    const threshMagnitude = Math.abs(threshold);

    if (decelMagnitude < threshMagnitude) {
      return { isDetected: false, severity: 'LOW', riskScore: 0 };
    }

    let severity: BehaviorSeverity = 'LOW';
    let riskScore = 40;

    if (decelMagnitude >= 5.5) {
      severity = 'CRITICAL';
      riskScore = 90;
    } else if (decelMagnitude >= 4.2) {
      severity = 'HIGH';
      riskScore = 75;
    } else if (decelMagnitude >= 3.2) {
      severity = 'MEDIUM';
      riskScore = 55;
    } else {
      severity = 'LOW';
      riskScore = 35;
    }

    return { isDetected: true, severity, riskScore };
  }

  /**
   * Detect Harsh Acceleration Events
   */
  public detectHarshAcceleration(
    acceleration: number, // m/s^2
    rule?: DriverBehaviorRule
  ): { isDetected: boolean; severity: BehaviorSeverity; riskScore: number } {
    const threshold = rule ? rule.threshold : 2.5; // m/s^2

    if (acceleration < threshold) {
      return { isDetected: false, severity: 'LOW', riskScore: 0 };
    }

    let severity: BehaviorSeverity = 'LOW';
    let riskScore = 30;

    if (acceleration >= 4.5) {
      severity = 'CRITICAL';
      riskScore = 85;
    } else if (acceleration >= 3.5) {
      severity = 'HIGH';
      riskScore = 65;
    } else if (acceleration >= 2.5) {
      severity = 'MEDIUM';
      riskScore = 45;
    } else {
      severity = 'LOW';
      riskScore = 25;
    }

    return { isDetected: true, severity, riskScore };
  }

  /**
   * Detect Sharp Turn Events
   * Analyzes heading change degrees vs speed during maneuver
   */
  public detectSharpTurn(
    headingBefore: number,
    headingAfter: number,
    speed: number,
    durationSeconds: number
  ): { isDetected: boolean; severity: BehaviorSeverity; turnAngle: number; riskScore: number } {
    let diff = Math.abs(headingAfter - headingBefore);
    if (diff > 180) diff = 360 - diff;

    // A turn of > 45 degrees while travelling > 40 km/h is risky
    if (diff < 35 || speed < 25) {
      return { isDetected: false, severity: 'LOW', turnAngle: diff, riskScore: 0 };
    }

    let severity: BehaviorSeverity = 'LOW';
    let riskScore = 30;

    if (diff >= 65 && speed >= 55) {
      severity = 'CRITICAL';
      riskScore = 90;
    } else if (diff >= 50 && speed >= 45) {
      severity = 'HIGH';
      riskScore = 70;
    } else if (diff >= 40 && speed >= 35) {
      severity = 'MEDIUM';
      riskScore = 50;
    } else {
      severity = 'LOW';
      riskScore = 30;
    }

    return { isDetected: true, severity, turnAngle: diff, riskScore };
  }

  /**
   * Detect Excessive Idle Events
   * Ignition ON, Speed = 0, Duration > Threshold
   */
  public detectExcessiveIdle(
    ignition: boolean,
    speed: number,
    idleDurationSeconds: number,
    rule?: DriverBehaviorRule
  ): { isDetected: boolean; severity: BehaviorSeverity; riskScore: number } {
    const idleThresholdSec = rule ? rule.threshold : 300; // 5 mins = 300s default

    if (!ignition || speed > 2 || idleDurationSeconds < idleThresholdSec) {
      return { isDetected: false, severity: 'LOW', riskScore: 0 };
    }

    let severity: BehaviorSeverity = 'LOW';
    let riskScore = 20;

    const idleMinutes = idleDurationSeconds / 60;
    if (idleMinutes >= 30) {
      severity = 'CRITICAL';
      riskScore = 80;
    } else if (idleMinutes >= 15) {
      severity = 'HIGH';
      riskScore = 60;
    } else if (idleMinutes >= 8) {
      severity = 'MEDIUM';
      riskScore = 40;
    } else {
      severity = 'LOW';
      riskScore = 20;
    }

    return { isDetected: true, severity, riskScore };
  }

  /**
   * Detect Route Deviation Events
   */
  public detectRouteDeviation(
    deviationDistanceMeters: number,
    rule?: DriverBehaviorRule
  ): { isDetected: boolean; severity: BehaviorSeverity; riskScore: number } {
    const thresholdMeters = rule ? rule.threshold : 200; // 200 meters corridor default

    if (deviationDistanceMeters < thresholdMeters) {
      return { isDetected: false, severity: 'LOW', riskScore: 0 };
    }

    let severity: BehaviorSeverity = 'LOW';
    let riskScore = 30;

    if (deviationDistanceMeters >= 1000) {
      severity = 'CRITICAL';
      riskScore = 90;
    } else if (deviationDistanceMeters >= 500) {
      severity = 'HIGH';
      riskScore = 70;
    } else if (deviationDistanceMeters >= 300) {
      severity = 'MEDIUM';
      riskScore = 45;
    } else {
      severity = 'LOW';
      riskScore = 25;
    }

    return { isDetected: true, severity, riskScore };
  }

  /**
   * Compute Data Confidence Score (0-100)
   */
  public calculateConfidenceScore(
    gpsSignalPercent: number = 90,
    satellites: number = 12,
    hasSpeedLimit: boolean = true
  ): number {
    let score = (gpsSignalPercent * 0.5) + (Math.min(satellites, 16) / 16 * 30);
    if (hasSpeedLimit) score += 20;
    return Math.min(100, Math.max(0, Math.round(score)));
  }
}

export const driverBehaviorEngine = new DriverBehaviorEngine();
