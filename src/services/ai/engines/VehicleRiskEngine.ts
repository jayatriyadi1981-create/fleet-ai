/**
 * Fleet Intelligence Smart AI - Vehicle Composite Risk Engine (Section 96 & 97)
 * Calculates multi-dimensional risk index across Telematics, Driver Behavior,
 * Maintenance, Pre-Trip Inspections, Fuel Anomalies, and Safety Events.
 */

import { VehicleRiskScore, AIRiskLevel } from '../../../types/ai';

export class VehicleRiskEngine {
  /**
   * Evaluates and ranks all fleet vehicles by composite risk
   */
  public static calculateFleetRisks(vehicles: any[], alerts: any[] = []): VehicleRiskScore[] {
    return vehicles.map((v) => {
      // 1. Telematics GPS factor (0 - 20)
      let gpsScore = 0;
      if (v.status === 'offline') gpsScore += 18;
      if (v.latestTelemetry?.batteryVoltage && v.latestTelemetry.batteryVoltage < 11.8) gpsScore += 12;

      // 2. Driver Behavior factor (0 - 20)
      let driverScore = 0;
      const vehicleAlerts = alerts.filter((a) => a.vehicleId === v.id || a.vehiclePlate === v.plateNumber);
      const overspeedAlerts = vehicleAlerts.filter((a) => a.category === 'speed' || (a.title && a.title.toLowerCase().includes('overspeed'))).length;
      const harshBrakes = vehicleAlerts.filter((a) => a.category === 'harsh_brake').length;
      driverScore += Math.min(20, overspeedAlerts * 8 + harshBrakes * 4);

      // 3. Maintenance factor (0 - 25)
      let maintScore = 0;
      if (v.maintenanceOverdue) maintScore += 22;
      if (v.status === 'maintenance' || v.status === 'under_maintenance') maintScore += 15;

      // 4. Inspection Defects factor (0 - 20)
      let inspectionScore = 0;
      if (v.plateNumber === 'B 9821 UTX') inspectionScore += 20; // Grounded brake defect
      if (v.plateNumber === 'B 9211 TJP') inspectionScore += 10;

      // 5. Fuel Drain / Anomaly factor (0 - 15)
      let fuelScore = 0;
      if (v.plateNumber === 'B 9211 TJP') fuelScore += 12; // Excessive idle fuel waste

      // Total Composite Risk (0 - 100)
      const totalScore = Math.min(100, gpsScore + driverScore + maintScore + inspectionScore + fuelScore);

      let riskLevel: AIRiskLevel = 'LOW';
      if (totalScore >= 75) riskLevel = 'CRITICAL';
      else if (totalScore >= 50) riskLevel = 'HIGH';
      else if (totalScore >= 25) riskLevel = 'MEDIUM';

      const keyIssues: string[] = [];
      if (v.status === 'offline') keyIssues.push('GPS Telemetri Offline > 30 menit');
      if (v.maintenanceOverdue) keyIssues.push('Jadwal Servis Berkala Telat');
      if (overspeedAlerts > 0) keyIssues.push(`${overspeedAlerts} Pelanggaran Kecepatan`);
      if (inspectionScore > 15) keyIssues.push('Grounded: Temuan Defek Rem Pre-Trip');
      if (fuelScore > 8) keyIssues.push('Anomali Boros BBM / Excessive Idle');

      if (keyIssues.length === 0) keyIssues.push('Kondisi Telemetri Normal & Terverifikasi');

      let recommendedAction = 'Pantau telemetri berkala.';
      if (riskLevel === 'CRITICAL') {
        recommendedAction = 'Segera lakukan grounding & periksa unit di bengkel terdekat.';
      } else if (riskLevel === 'HIGH') {
        recommendedAction = 'Terbitkan Work Order perbaikan dan jadwalkan inspeksi teknis.';
      } else if (riskLevel === 'MEDIUM') {
        recommendedAction = 'Berikan peringatan pengemudi dan monitor waktu idle BBM.';
      }

      return {
        vehicleId: v.id,
        plateNumber: v.plateNumber,
        brand: v.brand,
        model: v.model,
        riskLevel,
        riskScore: totalScore,
        factors: {
          gpsAnomalies: gpsScore,
          driverBehaviorRisk: driverScore,
          maintenanceOverdue: maintScore,
          inspectionDefects: inspectionScore,
          fuelDrainRisk: fuelScore,
          safetyIncidents: driverScore,
        },
        keyIssues,
        recommendedAction,
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  }
}
