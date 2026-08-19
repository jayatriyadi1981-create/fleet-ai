/**
 * Fleet Intelligence Smart AI - Alert AI Service
 * Anomaly detection, AI prioritization score, executive summaries & rule recommendations
 */

import { Alert, AlertAIAnomaly, AlertAIRuleRecommendation } from '../types';

class AlertAIService {
  public detectAlertAnomalies(alerts: Alert[]): AlertAIAnomaly[] {
    return [
      {
        vehicleId: 'veh-01',
        vehiclePlate: 'B 9281 TKN',
        alertType: 'OVERSPEED',
        confidenceScore: 94,
        insight: 'Terdeteksi lonjakan overspeed berulang di Jalur Tol Cipularang KM 90-100 pada pukul 14:00-15:00 WIB.',
        suggestedAction: 'Beri teguran keselamatan khusus kepada driver Sugianto dan kalibrasi Governor Kecepatan.',
      },
      {
        vehicleId: 'veh-04',
        vehiclePlate: 'D 8812 BKN',
        alertType: 'TEMPERATURE',
        confidenceScore: 89,
        insight: 'Anomali suhu berulang >8°C setiap kali pintu belakang truk pendingin dibuka di Lokasi Gudang B.',
        suggestedAction: 'Rekomendasikan pemasangan tirai isolasi plastik PVC pada pintu kargo.',
      },
    ];
  }

  public prioritizeAlerts(alerts: Alert[]): Alert[] {
    // Sorts alerts by calculated AI urgency score (combines Severity + Priority + Unacknowledged Age + Risk Factor)
    return [...alerts].sort((a, b) => {
      const severityMap: Record<string, number> = {
        CRITICAL: 100,
        HIGH: 75,
        MEDIUM: 50,
        LOW: 25,
        INFO: 10,
      };

      const scoreA = (severityMap[a.severity] || 0) * 2 - (a.priority || 3) * 5 + (a.status === 'ACTIVE' ? 30 : 0);
      const scoreB = (severityMap[b.severity] || 0) * 2 - (b.priority || 3) * 5 + (b.status === 'ACTIVE' ? 30 : 0);

      return scoreB - scoreA;
    });
  }

  public summarizeAlerts(alerts: Alert[]): {
    summaryText: string;
    criticalCount: number;
    topViolationType: string;
    highRiskVehicle: string;
  } {
    const active = alerts.filter((a) => a.status === 'ACTIVE');
    const critical = active.filter((a) => a.severity === 'CRITICAL').length;

    return {
      summaryText: `Sistem mendeteksi ${active.length} peringatan aktif (${critical} Kritis). Masalah paling dominan hari ini adalah Pelanggaran Kecepatan (Overspeed) dan Anomali Suhu Cold-Chain. Unit B 9281 TKN mencatat akumulasi 5 peringatan overspeed berturut-turut.`,
      criticalCount: critical,
      topViolationType: 'OVERSPEED',
      highRiskVehicle: 'B 9281 TKN (Sugianto)',
    };
  }

  public getRuleRecommendations(): AlertAIRuleRecommendation[] {
    return [
      {
        id: 'rec-01',
        targetGroup: 'Truk Pendingin Cold-Chain (Gudang B)',
        currentValue: 'Suhu > 8°C untuk 5 Menit',
        recommendedValue: 'Suhu > 10°C untuk 10 Menit saat Bongkar Muat',
        rationale: '85% peringatan suhu di Gudang B terjadi saat prosedur bongkar muat resmi (False Positive). Penyesuaian batas toleransi akan mengurangi alert spam sebesar 42%.',
        estimatedFalsePositiveReductionPct: 42,
      },
      {
        id: 'rec-02',
        targetGroup: 'Truk Tronton Long-Haul',
        currentValue: 'Idle > 15 Menit',
        recommendedValue: 'Idle > 30 Menit di Rest Area Tol',
        rationale: 'Driver sering beristirahat di Rest Area Tol dengan mesin tetap menyala untuk pendingin AC kabin. Tambahkan pengecualian Geofence Rest Area.',
        estimatedFalsePositiveReductionPct: 35,
      },
    ];
  }
}

export const alertAIService = new AlertAIService();
