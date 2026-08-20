/**
 * Fleet Intelligence Smart AI - Production Monitoring & Uptime Metrics Configuration
 * PROMPT 59: Telemetry Thresholds, Alert Escalations & SLO SLAs
 */

export interface MonitoringConfig {
  healthCheck: {
    livenessPath: string;
    readinessPath: string;
    intervalSeconds: number;
    timeoutSeconds: number;
  };
  thresholds: {
    maxApiLatencyMs: number;
    maxGpsProcessingLagMs: number;
    maxErrorRatePercent: number;
    minSatellitesForValidFix: number;
    memoryWarningPercent: number;
  };
  slaTargets: {
    apiUptimePercent: number;
    gpsIngestionUptimePercent: number;
    realtimeDispatchLagMaxMs: number;
  };
}

export const monitoringConfig: MonitoringConfig = {
  healthCheck: {
    livenessPath: '/health/live',
    readinessPath: '/health/ready',
    intervalSeconds: 15,
    timeoutSeconds: 5,
  },
  thresholds: {
    maxApiLatencyMs: 500,
    maxGpsProcessingLagMs: 2000,
    maxErrorRatePercent: 1.0,
    minSatellitesForValidFix: 4,
    memoryWarningPercent: 85,
  },
  slaTargets: {
    apiUptimePercent: 99.9,
    gpsIngestionUptimePercent: 99.95,
    realtimeDispatchLagMaxMs: 1500,
  },
};
