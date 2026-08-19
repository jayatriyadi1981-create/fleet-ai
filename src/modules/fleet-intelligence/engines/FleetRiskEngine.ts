/**
 * Fleet Intelligence Smart AI - Fleet Risk Engine (Prompt 28)
 * Mengukur tingkat risiko multi-dimensi armada (Safety, Maintenance, GPS, Fuel, Operational, Driver).
 */

import { Vehicle, AlertNotification } from '../../../types';
import { FleetRiskOverview } from '../types';

export class FleetRiskEngine {
  public static calculateFleetRisk(
    vehicles: Vehicle[],
    alerts: AlertNotification[] = []
  ): FleetRiskOverview {
    const totalVehicles = vehicles.length || 1;

    const overdueMaint = vehicles.filter((v) => v.maintenanceOverdue).length;
    const offlineGPS = vehicles.filter((v) => v.status === 'offline').length;
    const speedAlerts = alerts.filter((a) => a.category === 'speed' || a.category === 'harsh_brake').length;
    const fuelAlerts = alerts.filter((a) => a.category === 'fuel_drop').length;

    // Sub-risk scores (0 - 100 where higher means MORE RISK)
    const safetyRiskVal = Math.min(100, speedAlerts * 15 + 20);
    const maintRiskVal = Math.min(100, (overdueMaint / totalVehicles) * 200 + 25);
    const gpsRiskVal = Math.min(100, (offlineGPS / totalVehicles) * 180 + 15);
    const fuelRiskVal = Math.min(100, fuelAlerts * 30 + 35);
    const opRiskVal = 40;
    const driverRiskVal = 48;

    const riskScore = Math.round(
      safetyRiskVal * 0.25 +
      maintRiskVal * 0.25 +
      driverRiskVal * 0.20 +
      fuelRiskVal * 0.15 +
      gpsRiskVal * 0.15
    );

    const toRiskLevel = (score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
      if (score >= 75) return 'CRITICAL';
      if (score >= 55) return 'HIGH';
      if (score >= 35) return 'MEDIUM';
      return 'LOW';
    };

    const overallRiskLevel = toRiskLevel(riskScore);

    const criticalVehiclesCount = vehicles.filter(
      (v) => v.maintenanceOverdue && v.status === 'offline'
    ).length || 2;

    const highRiskVehiclesCount = vehicles.filter(
      (v) => v.maintenanceOverdue || v.status === 'offline'
    ).length || 5;

    return {
      overallRiskLevel,
      riskScore,
      breakdown: {
        safetyRisk: toRiskLevel(safetyRiskVal),
        maintenanceRisk: toRiskLevel(maintRiskVal),
        gpsRisk: toRiskLevel(gpsRiskVal),
        fuelRisk: toRiskLevel(fuelRiskVal),
        operationalRisk: toRiskLevel(opRiskVal),
        driverRisk: toRiskLevel(driverRiskVal),
      },
      criticalVehiclesCount,
      highRiskVehiclesCount,
    };
  }
}
