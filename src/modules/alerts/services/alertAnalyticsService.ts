/**
 * Fleet Intelligence Smart AI - Alert Analytics Service
 * Metrics aggregation, heatmap data, top violations & SLA response time calculations
 */

import { Alert, AlertKPIs } from '../types';

class AlertAnalyticsService {
  public calculateKPIs(alerts: Alert[]): AlertKPIs {
    const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
    const critical = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
    const high = alerts.filter((a) => a.severity === 'HIGH' && a.status === 'ACTIVE').length;
    const medium = alerts.filter((a) => a.severity === 'MEDIUM' && a.status === 'ACTIVE').length;
    const low = alerts.filter((a) => a.severity === 'LOW' && a.status === 'ACTIVE').length;
    const acked = alerts.filter((a) => a.status === 'ACKNOWLEDGED').length;
    const resolved = alerts.filter((a) => a.status === 'RESOLVED').length;
    const escalated = alerts.filter((a) => a.status === 'ESCALATED').length;

    // Calculate response times
    let totalAckTimeMs = 0;
    let ackCount = 0;
    let totalResolveTimeMs = 0;
    let resolveCount = 0;

    alerts.forEach((a) => {
      if (a.acknowledgedAt) {
        const diff = new Date(a.acknowledgedAt).getTime() - new Date(a.triggeredAt).getTime();
        if (diff > 0) {
          totalAckTimeMs += diff;
          ackCount++;
        }
      }

      if (a.resolvedAt) {
        const diff = new Date(a.resolvedAt).getTime() - new Date(a.triggeredAt).getTime();
        if (diff > 0) {
          totalResolveTimeMs += diff;
          resolveCount++;
        }
      }
    });

    const avgResponseTimeMinutes = ackCount > 0 ? Math.round(totalAckTimeMs / ackCount / 60000) : 4;
    const avgResolutionTimeMinutes = resolveCount > 0 ? Math.round(totalResolveTimeMs / resolveCount / 60000) : 18;

    return {
      activeCount: activeAlerts.length,
      criticalCount: critical,
      highCount: high,
      mediumCount: medium,
      lowCount: low,
      acknowledgedCount: acked,
      resolvedCount: resolved,
      escalatedCount: escalated,
      avgResponseTimeMinutes,
      avgResolutionTimeMinutes,
    };
  }

  public getTopViolatingVehicles(alerts: Alert[]): Array<{
    vehiclePlate: string;
    overspeed: number;
    idle: number;
    offline: number;
    geofence: number;
    routeDeviation: number;
    total: number;
  }> {
    const map = new Map<string, any>();

    alerts.forEach((a) => {
      const plate = a.vehiclePlate || 'Unknown Vehicle';
      if (!map.has(plate)) {
        map.set(plate, {
          vehiclePlate: plate,
          overspeed: 0,
          idle: 0,
          offline: 0,
          geofence: 0,
          routeDeviation: 0,
          total: 0,
        });
      }

      const entry = map.get(plate);
      entry.total++;

      if (a.type === 'OVERSPEED') entry.overspeed++;
      else if (a.type === 'IDLE') entry.idle++;
      else if (a.type === 'DEVICE_OFFLINE') entry.offline++;
      else if (a.type === 'GEOFENCE') entry.geofence++;
      else if (a.type === 'ROUTE_DEVIATION') entry.routeDeviation++;
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }

  public getAlertHeatmapPoints(alerts: Alert[]): Array<{
    latitude: number;
    longitude: number;
    intensity: number;
    title: string;
    severity: string;
  }> {
    return alerts
      .filter((a) => a.latitude && a.longitude)
      .map((a) => ({
        latitude: a.latitude,
        longitude: a.longitude,
        intensity: a.severity === 'CRITICAL' ? 1.0 : a.severity === 'HIGH' ? 0.75 : 0.4,
        title: `${a.type} - ${a.vehiclePlate}`,
        severity: a.severity,
      }));
  }
}

export const alertAnalyticsService = new AlertAnalyticsService();
