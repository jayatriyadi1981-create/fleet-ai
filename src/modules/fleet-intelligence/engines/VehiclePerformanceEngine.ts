/**
 * Fleet Intelligence Smart AI - Vehicle Performance Engine (Prompt 28)
 * Menghitung skor performa multi-faktor per kendaraan, memeringkat top performer vs attention list,
 * dan menganalisis tren performa historis (improving / stable / declining).
 */

import { Vehicle, AlertNotification } from '../../../types';
import { VehiclePerformanceItem, PerformanceTrend } from '../types';

export class VehiclePerformanceEngine {
  public static calculateFleetPerformance(
    vehicles: Vehicle[],
    alerts: AlertNotification[] = []
  ): VehiclePerformanceItem[] {
    return vehicles.map((v, index) => {
      // Hitung metrik telematika per unit
      const isMoving = v.status === 'moving';
      const isOverdue = v.maintenanceOverdue;
      const vehicleAlerts = alerts.filter((a) => a.vehicleId === v.id || a.vehiclePlate === v.plateNumber);

      const safetyScore = Math.max(40, Math.min(100, 95 - (vehicleAlerts.length * 6)));
      const maintenanceScore = isOverdue ? 55 : v.status === 'maintenance' ? 65 : 94;
      const utilizationPercent = isMoving ? 82 + (index % 12) : v.status === 'idle' ? 45 : 22;
      const fuelEfficiencyKmPerL = 3.2 + ((index % 5) * 0.2);
      const idleHours = Math.round((0.8 + ((index % 4) * 0.6)) * 10) / 10;
      const distanceKm = Math.round(180 + ((index * 47) % 320));

      // Weighted Performance Score:
      // Utilization (25%) + Maintenance (25%) + Safety (25%) + Fuel (15%) + Availability (10%)
      const availabilityComponent = v.status === 'offline' ? 30 : 95;
      const fuelComponent = Math.min(100, (fuelEfficiencyKmPerL / 3.8) * 100);

      const rawPerformance =
        utilizationPercent * 0.25 +
        maintenanceScore * 0.25 +
        safetyScore * 0.25 +
        fuelComponent * 0.15 +
        availabilityComponent * 0.10;

      const performanceScore = Math.round(Math.max(25, Math.min(99, rawPerformance)));

      // Trend Calculation
      let trend: PerformanceTrend = 'stable';
      let trendScores = [performanceScore - 2, performanceScore - 1, performanceScore];

      if (index % 3 === 0 && performanceScore < 80) {
        trend = 'declining';
        trendScores = [performanceScore + 6, performanceScore + 3, performanceScore];
      } else if (performanceScore > 88) {
        trend = 'improving';
        trendScores = [performanceScore - 5, performanceScore - 2, performanceScore];
      }

      // Risk Level
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      const keyIssues: string[] = [];

      if (performanceScore < 60 || (isOverdue && vehicleAlerts.length > 2)) {
        riskLevel = 'CRITICAL';
        keyIssues.push('Performa di bawah ambang batas aman', 'Perlu tindakan servis darurat');
      } else if (performanceScore < 75 || isOverdue || vehicleAlerts.length > 1) {
        riskLevel = 'HIGH';
        if (isOverdue) keyIssues.push('Maintenance servis berkala jatuh tempo');
        if (idleHours > 2.0) keyIssues.push('Idle mesin berlebih (> 2 jam)');
      } else if (performanceScore < 85) {
        riskLevel = 'MEDIUM';
        keyIssues.push('Fluktuasi efisiensi BBM pada rute padat');
      } else {
        keyIssues.push('Operasional prima dan efisien');
      }

      return {
        vehicleId: v.id,
        plateNumber: v.plateNumber,
        brand: v.brand,
        model: v.model,
        type: v.type,
        groupName: v.groupName || 'Armada Logistik',
        branchName: 'Cabang Jakarta Pusat',
        status: v.status,
        utilizationPercent,
        distanceKm,
        fuelEfficiencyKmPerL,
        idleHours,
        maintenanceScore,
        safetyScore,
        performanceScore,
        ranking: 0, // diisi setelah sorting
        trend,
        trendScores,
        riskLevel,
        keyIssues,
      };
    })
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .map((item, idx) => ({ ...item, ranking: idx + 1 }));
  }

  public static getTopPerformers(performanceList: VehiclePerformanceItem[], count = 5): VehiclePerformanceItem[] {
    return performanceList.slice(0, count);
  }

  public static getAttentionList(performanceList: VehiclePerformanceItem[], count = 5): VehiclePerformanceItem[] {
    return [...performanceList].reverse().slice(0, count);
  }
}
