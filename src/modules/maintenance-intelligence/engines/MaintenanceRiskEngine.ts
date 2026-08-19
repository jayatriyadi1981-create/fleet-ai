/**
 * Fleet Intelligence Smart AI - Maintenance Risk Engine
 * Computes composite maintenance risk score (0-100), risk tier, key contributing factors,
 * multi-domain evidence items, and immediate recommended mitigations.
 */

import { MaintenanceRiskLevel, TrendDirection, EvidenceItem } from '../types';

export interface RiskCalculationInput {
  vehicleId: string;
  plateNumber: string;
  totalMileage: number;
  totalEngineHours: number;
  vehicleAgeYears?: number;
  isServiceOverdue: boolean;
  serviceOverdueKm?: number;
  serviceOverdueDays?: number;
  activeDTCs: string[];
  batteryVoltage?: number;
  coolantTempC?: number;
  oilPressureKpa?: number;
  tirePressureAbnormal: boolean;
  failedInspectionItems: string[];
  attentionInspectionItems: string[];
  harshBrakingCountLast30Days: number;
  highIdleHoursLast30Days: number;
  fuelAnomalyCountLast30Days: number;
  repeatRepairsCountLast90Days: number;
  previousRiskScore?: number;
}

export class MaintenanceRiskEngine {
  /**
   * Computes maintenance risk score and generates structured evidence items
   */
  public static calculateRisk(input: RiskCalculationInput): {
    riskScore: number;
    riskLevel: MaintenanceRiskLevel;
    riskTrend: TrendDirection;
    evidence: EvidenceItem[];
    primaryContributingFactor: string;
    recommendedAction: string;
  } {
    let score = 5; // Baseline low risk
    const evidence: EvidenceItem[] = [];
    const now = new Date().toISOString();

    // 1. Service Overdue Severity
    if (input.isServiceOverdue) {
      const overdueKm = input.serviceOverdueKm || 400;
      if (overdueKm > 2500) {
        score += 35;
        evidence.push({
          source: 'MAINTENANCE_HISTORY',
          finding: `Jadwal servis berkala terlewat sejauh ${overdueKm.toLocaleString()} KM (Sangat Kritis).`,
          timestamp: now,
          dataQuality: 'HIGH',
          severity: 'CRITICAL',
          metricValue: `${overdueKm} km`,
          threshold: '0 km',
        });
      } else if (overdueKm > 1000) {
        score += 25;
        evidence.push({
          source: 'MAINTENANCE_HISTORY',
          finding: `Jadwal servis berkala terlewat sejauh ${overdueKm.toLocaleString()} KM.`,
          timestamp: now,
          dataQuality: 'HIGH',
          severity: 'WARNING',
          metricValue: `${overdueKm} km`,
          threshold: '0 km',
        });
      } else {
        score += 15;
        evidence.push({
          source: 'MAINTENANCE_HISTORY',
          finding: `Servis berkala mendekati/terlewat ${overdueKm.toLocaleString()} KM.`,
          timestamp: now,
          dataQuality: 'HIGH',
          severity: 'WARNING',
        });
      }
    }

    // 2. Battery Telemetry Degradation
    if (input.batteryVoltage !== undefined) {
      if (input.batteryVoltage < 23.6) {
        score += 28;
        evidence.push({
          source: 'TELEMETRY',
          finding: `Voltase aki drop ke ${input.batteryVoltage.toFixed(1)}V (Ambang batas aman > 24.5V). Potensi aki drop saat start.`,
          timestamp: now,
          dataQuality: 'HIGH',
          severity: 'CRITICAL',
          metricValue: `${input.batteryVoltage}V`,
          threshold: '24.5V',
        });
      } else if (input.batteryVoltage < 24.5) {
        score += 15;
        evidence.push({
          source: 'TELEMETRY',
          finding: `Tegangan baterai terdeteksi ${input.batteryVoltage.toFixed(1)}V, menunjukkan penurunan kapasitas alternator/aki.`,
          timestamp: now,
          dataQuality: 'HIGH',
          severity: 'WARNING',
          metricValue: `${input.batteryVoltage}V`,
          threshold: '24.5V',
        });
      }
    }

    // 3. Engine Telemetry & DTC
    if (input.activeDTCs.length > 0) {
      score += Math.min(30, input.activeDTCs.length * 15);
      evidence.push({
        source: 'DIAGNOSTIC_DTC',
        finding: `Ditemukan ${input.activeDTCs.length} kode kerusakan OBD/DTC aktif: [${input.activeDTCs.join(', ')}].`,
        timestamp: now,
        dataQuality: 'HIGH',
        severity: 'CRITICAL',
      });
    }

    if (input.coolantTempC && input.coolantTempC > 100) {
      score += 22;
      evidence.push({
        source: 'TELEMETRY',
        finding: `Suhu pendingin mesin (Coolant) mencapai ${input.coolantTempC}°C (Batas normal < 95°C). Risiko overheating.`,
        timestamp: now,
        dataQuality: 'HIGH',
        severity: 'CRITICAL',
        metricValue: `${input.coolantTempC}°C`,
        threshold: '95°C',
      });
    }

    if (input.oilPressureKpa && input.oilPressureKpa < 160) {
      score += 24;
      evidence.push({
        source: 'TELEMETRY',
        finding: `Tekanan oli mesin rendah (${input.oilPressureKpa} kPa). Berpotensi merusak komponen ruang bakar.`,
        timestamp: now,
        dataQuality: 'HIGH',
        severity: 'CRITICAL',
        metricValue: `${input.oilPressureKpa} kPa`,
        threshold: '200 kPa',
      });
    }

    // 4. Inspection Findings
    if (input.failedInspectionItems.length > 0) {
      score += Math.min(25, input.failedInspectionItems.length * 12);
      evidence.push({
        source: 'VEHICLE_INSPECTION',
        finding: `Inspeksi pre-trip melaporkan ${input.failedInspectionItems.length} item gagal: ${input.failedInspectionItems.join(', ')}.`,
        timestamp: now,
        dataQuality: 'HIGH',
        severity: 'CRITICAL',
      });
    }

    if (input.attentionInspectionItems.length > 0) {
      score += Math.min(12, input.attentionInspectionItems.length * 4);
      evidence.push({
        source: 'VEHICLE_INSPECTION',
        finding: `Catatan inspeksi membutuhkan perhatian pada: ${input.attentionInspectionItems.join(', ')}.`,
        timestamp: now,
        dataQuality: 'MEDIUM',
        severity: 'WARNING',
      });
    }

    // 5. Driver Harsh Driving Exposure (Brake Wear & Suspension)
    if (input.harshBrakingCountLast30Days > 15) {
      score += 12;
      evidence.push({
        source: 'DRIVER_BEHAVIOR',
        finding: `Frekuensi pengereman mendadak (Harsh Braking) tinggi: ${input.harshBrakingCountLast30Days}x dalam 30 hari. Mempercepat keausan kampas rem.`,
        timestamp: now,
        dataQuality: 'HIGH',
        severity: 'WARNING',
      });
    }

    // 6. Fuel Anomaly & Injector/Combustion Correlation
    if (input.fuelAnomalyCountLast30Days > 0) {
      score += Math.min(10, input.fuelAnomalyCountLast30Days * 5);
      evidence.push({
        source: 'FUEL_INTELLIGENCE',
        finding: `Terdeteksi ${input.fuelAnomalyCountLast30Days} anomali konsumsi BBM/efisiensi drop, mengindikasikan potensi masalah filter BBM atau injektor.`,
        timestamp: now,
        dataQuality: 'HIGH',
        severity: 'WARNING',
      });
    }

    // 7. Repeat Failures in 90 Days
    if (input.repeatRepairsCountLast90Days > 1) {
      score += Math.min(18, input.repeatRepairsCountLast90Days * 8);
      evidence.push({
        source: 'MAINTENANCE_HISTORY',
        finding: `Riwayat ${input.repeatRepairsCountLast90Days} kali perbaikan berulang dalam 90 hari terakhir pada komponen yang sama.`,
        timestamp: now,
        dataQuality: 'HIGH',
        severity: 'CRITICAL',
      });
    }

    const finalRiskScore = Math.max(0, Math.min(100, Math.round(score)));

    // Categorize Risk Level
    let riskLevel: MaintenanceRiskLevel = 'LOW';
    if (finalRiskScore > 80) {
      riskLevel = 'CRITICAL';
    } else if (finalRiskScore > 60) {
      riskLevel = 'HIGH';
    } else if (finalRiskScore > 40) {
      riskLevel = 'ELEVATED';
    } else if (finalRiskScore > 20) {
      riskLevel = 'MODERATE';
    } else {
      riskLevel = 'LOW';
    }

    // Determine Trend
    let riskTrend: TrendDirection = 'STABLE';
    if (input.previousRiskScore !== undefined) {
      const diff = finalRiskScore - input.previousRiskScore;
      if (diff >= 8) riskTrend = 'WORSENING';
      else if (diff <= -8) riskTrend = 'IMPROVING';
      else riskTrend = 'STABLE';
    }

    // Primary Contributing Factor & Recommended Action
    let primaryContributingFactor = 'Kondisi operasional normal tanpa anomali signifikan.';
    let recommendedAction = 'Lanjutkan jadwal servis preventif berkala sesuai interval standar.';

    if (riskLevel === 'CRITICAL') {
      primaryContributingFactor = evidence[0]?.finding || 'Multi-faktor risiko kritis terdeteksi pada mesin/kelistrikan.';
      recommendedAction = 'Tunda penugasan trip berikutnya. Lakukan inspeksi teknis mendalam dan buat Work Order darurat.';
    } else if (riskLevel === 'HIGH') {
      primaryContributingFactor = evidence[0]?.finding || 'Servis terlewat atau indikator sensor melebihi ambang batas aman.';
      recommendedAction = 'Jadwalkan perbaikan di bengkel rekanan dalam 48 jam ke depan.';
    } else if (riskLevel === 'ELEVATED') {
      primaryContributingFactor = evidence[0]?.finding || 'Penurunan performa komponen terdeteksi pada telemetri atau inspeksi.';
      recommendedAction = 'Lakukan pemeriksaan pre-trip ketat dan rencanakan pergantian part pada jadwal servis terdekat.';
    } else if (riskLevel === 'MODERATE') {
      primaryContributingFactor = 'Komponen mendekati batas pemakaian wajar.';
      recommendedAction = 'Pantau telemetri berkala dan verifikasi ketersediaan suku cadang fast-moving.';
    }

    return {
      riskScore: finalRiskScore,
      riskLevel,
      riskTrend,
      evidence,
      primaryContributingFactor,
      recommendedAction,
    };
  }
}
