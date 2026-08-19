/**
 * Fleet Intelligence Smart AI - GPS Rule Engine Foundation
 * Evaluates configurable business rules against incoming events and telemetry
 */

import { GpsRule, GpsEvent, NormalizedTelemetry } from '../../types/gpsArchitecture';

export class GpsRuleEngine {
  public static evaluateRuleAgainstTelemetry(rule: GpsRule, telemetry: NormalizedTelemetry): boolean {
    if (!rule.enabled) return false;

    switch (rule.eventType) {
      case 'SPEEDING':
        if (rule.conditions.speedThresholdKmH && telemetry.speed > rule.conditions.speedThresholdKmH) {
          return true;
        }
        break;

      case 'LOW_VOLTAGE':
        if (rule.conditions.voltageThresholdVolts && telemetry.externalVoltage && telemetry.externalVoltage < rule.conditions.voltageThresholdVolts) {
          return true;
        }
        break;

      case 'GPS_SIGNAL_LOST':
        if (telemetry.satellites < 4) {
          return true;
        }
        break;

      default:
        break;
    }

    return false;
  }

  public static evaluateRuleAgainstEvent(rule: GpsRule, event: GpsEvent): boolean {
    if (!rule.enabled) return false;
    return rule.eventType === event.eventType;
  }
}
