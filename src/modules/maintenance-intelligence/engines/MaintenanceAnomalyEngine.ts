/**
 * Fleet Intelligence Smart AI - Maintenance Anomaly Engine
 * Identifies repeat component failure patterns, cost outliers, abnormally short service intervals,
 * and high downtime clusters across fleet operations.
 */

import { MaintenanceAnomalyItem, AnomalyPatternType, ComponentCategory } from '../types';

export class MaintenanceAnomalyEngine {
  /**
   * Evaluates historical records and flags systemic anomalies
   */
  public static detectAnomalies(records: {
    vehicleId: string;
    plateNumber: string;
    branch: string;
    component: ComponentCategory;
    repairCount90Days: number;
    totalCost90Days: number;
    avgFleetCost90Days: number;
    downtimeHours90Days: number;
    lastRepairsSummary: string[];
  }[]): MaintenanceAnomalyItem[] {
    const anomalies: MaintenanceAnomalyItem[] = [];
    const now = new Date().toISOString();

    records.forEach((rec) => {
      // 1. Repeat Component Repair Pattern (3+ repairs on same component in 90 days)
      if (rec.repairCount90Days >= 3) {
        anomalies.push({
          id: `anom-rep-${rec.vehicleId}-${rec.component}`,
          vehicleId: rec.vehicleId,
          plateNumber: rec.plateNumber,
          branch: rec.branch,
          patternType: 'REPEAT_COMPONENT_FAILURE',
          title: `Pola Kerusakan Berulang: Komponen ${rec.component}`,
          description: `Kendaraan telah mengalami ${rec.repairCount90Days} kali perbaikan terkait komponen ${rec.component} dalam kurun waktu 90 hari terakhir. Mengindikasikan potensi kesalahan diagnosis awal atau komponen terkait lainnya yang bermasalah.`,
          component: rec.component,
          frequencyCount: rec.repairCount90Days,
          periodDays: 90,
          totalCostInvolved: rec.totalCost90Days,
          severity: 'CRITICAL',
          detectedAt: now,
          evidence: [
            ...rec.lastRepairsSummary,
            `Total pengeluaran komponen berulang: Rp ${rec.totalCost90Days.toLocaleString('id-ID')}`,
          ],
          suggestedAction: 'Lakukan audit teknis mendalam oleh Senior Diagnostic Technician untuk mencari akar masalah di luar komponen yang sering diganti.',
        });
      }

      // 2. Cost Outlier (>40% above fleet benchmark)
      if (rec.avgFleetCost90Days > 0 && rec.totalCost90Days > rec.avgFleetCost90Days * 1.4) {
        const percentageAbove = Math.round(((rec.totalCost90Days - rec.avgFleetCost90Days) / rec.avgFleetCost90Days) * 100);
        anomalies.push({
          id: `anom-cost-${rec.vehicleId}`,
          vehicleId: rec.vehicleId,
          plateNumber: rec.plateNumber,
          branch: rec.branch,
          patternType: 'COST_OUTLIER',
          title: `Biaya Pemeliharaan Anomali (+${percentageAbove}% di atas rata-rata armada)`,
          description: `Total biaya perbaikan unit ini mencapai Rp ${rec.totalCost90Days.toLocaleString('id-ID')}, yaitu ${percentageAbove}% lebih tinggi dibandingkan unit sejenis di armada.`,
          component: rec.component,
          frequencyCount: rec.repairCount90Days,
          periodDays: 90,
          totalCostInvolved: rec.totalCost90Days,
          severity: 'WARNING',
          detectedAt: now,
          evidence: [
            `Biaya unit: Rp ${rec.totalCost90Days.toLocaleString('id-ID')}`,
            `Benchmark armada rata-rata: Rp ${rec.avgFleetCost90Days.toLocaleString('id-ID')}`,
          ],
          suggestedAction: 'Tinjau rincian faktur suku cadang dan lakukan evaluasi TCO (Total Cost of Ownership) kendaraan.',
        });
      }

      // 3. Abnormal Downtime (>72 hours in 90 days)
      if (rec.downtimeHours90Days > 72) {
        anomalies.push({
          id: `anom-down-${rec.vehicleId}`,
          vehicleId: rec.vehicleId,
          plateNumber: rec.plateNumber,
          branch: rec.branch,
          patternType: 'ABNORMAL_DOWNTIME',
          title: `Tingkat Downtime Bengkel Ekstrem (${rec.downtimeHours90Days} Jam)`,
          description: `Kendaraan mengalami downtime di bengkel selama ${rec.downtimeHours90Days} jam dalam 90 hari, mengakibatkan kehilangan potensi pendapatan operasional.`,
          component: rec.component,
          frequencyCount: rec.repairCount90Days,
          periodDays: 90,
          totalCostInvolved: rec.totalCost90Days,
          severity: 'WARNING',
          detectedAt: now,
          evidence: [
            `Total downtime: ${rec.downtimeHours90Days} jam`,
            `Status ketersediaan armada (Availability): ${Math.round(((90 * 24 - rec.downtimeHours90Days) / (90 * 24)) * 100)}%`,
          ],
          suggestedAction: 'Evaluasi SLA bengkel rekanan dan percepat proses pengadaan suku cadang inden.',
        });
      }
    });

    return anomalies;
  }
}
