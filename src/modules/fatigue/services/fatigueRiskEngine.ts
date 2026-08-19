/**
 * Fleet Intelligence Smart AI - Fatigue Risk Engine Service
 * PROMPT 23 - Operational Fatigue Risk Calculation Architecture
 */

import { 
  DriverFatigueProfile, 
  FatigueRiskLevel, 
  RiskFactorItem, 
  FatigueRule, 
  FatigueScoreWeightConfig 
} from '../types';

export const DEFAULT_FATIGUE_WEIGHTS: FatigueScoreWeightConfig = {
  drivingDurationWeight: 25,
  continuousDrivingWeight: 20,
  restDurationWeight: 20,
  shiftDurationWeight: 15,
  nightDrivingWeight: 10,
  consecutiveShiftsWeight: 5,
  recentBehaviorWeight: 5,
};

export const DEFAULT_FATIGUE_RULE: FatigueRule = {
  id: 'rule-std-01',
  tenantId: 'tenant-1',
  ruleName: 'Aturan Manajemen Risiko Kelelahan Standar Fleet K3',
  description: 'Pengaturan standar operasional jam mengemudi, durasi istirahat, dan batas shift malam.',
  maxContinuousDrivingHours: 4.0,
  warningDrivingThresholdHours: 3.5,
  highDrivingThresholdHours: 4.0,
  criticalDrivingThresholdHours: 5.0,
  minRequiredRestHours: 8.0,
  maxShiftHours: 12.0,
  nightStart: '22:00',
  nightEnd: '06:00',
  timezone: 'Asia/Jakarta',
  version: 'v1.4',
  effectiveDate: '2026-08-01',
  changedBy: 'Super Admin (Safety Office)',
  changeReason: 'Penyesuaian standar operasional keselamatan angkutan berat Permenhub',
  active: true,
  policySource: 'Permenhub No. PM 60 & Standard K3 Perusahaan',
  policyName: 'Kebijakan Pengawasan Fatigue Driver Transportasi Lintas Jawa-Sumatera',
  jurisdiction: 'Indonesia (WIB / WITA / WIT)',
};

/**
 * Determine risk level label based on 0-100 fatigue score
 * 80-100 = LOW RISK
 * 60-79  = MODERATE RISK
 * 40-59  = HIGH RISK
 * 0-39   = CRITICAL RISK
 */
export function getFatigueRiskLevel(score: number): FatigueRiskLevel {
  if (score >= 80) return 'LOW';
  if (score >= 60) return 'MODERATE';
  if (score >= 40) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Calculate fatigue risk factors and compute total 0-100 score
 * Non-diagnostic operational calculation engine
 */
export function calculateFatigueProfileScore(
  profile: Partial<DriverFatigueProfile>,
  rule: FatigueRule = DEFAULT_FATIGUE_RULE,
  weights: FatigueScoreWeightConfig = DEFAULT_FATIGUE_WEIGHTS
): { score: number; riskLevel: FatigueRiskLevel; factors: RiskFactorItem[] } {
  const drivingHours = profile.drivingHoursToday || 0;
  const continuousDriving = profile.consecutiveDrivingHours || 0;
  const restHours = profile.restHoursToday || 0;
  const shiftHours = profile.shiftHoursToday || 0;
  const nightHours = profile.nightDrivingHoursToday || 0;
  const consecutiveDays = profile.consecutiveShiftDays || 1;

  const factors: RiskFactorItem[] = [];

  // 1. Continuous Driving Factor
  let continuousScore = 100;
  if (continuousDriving >= rule.criticalDrivingThresholdHours) {
    continuousScore = 20;
    factors.push({
      factor: 'Continuous Driving Duration',
      level: 'CRITICAL',
      impactScore: 35,
      description: `Mengemudi secara terus menerus selama ${continuousDriving.toFixed(1)} jam tanpa jeda istirahat (Melebihi batas ${rule.criticalDrivingThresholdHours} jam).`,
      recommendation: 'Diperlukan jeda istirahat minimal 30-45 menit segera.',
    });
  } else if (continuousDriving >= rule.highDrivingThresholdHours) {
    continuousScore = 45;
    factors.push({
      factor: 'Continuous Driving Duration',
      level: 'HIGH',
      impactScore: 25,
      description: `Mengemudi tanpa jeda selama ${continuousDriving.toFixed(1)} jam (Mencapai batas maksimum ${rule.highDrivingThresholdHours} jam).`,
      recommendation: 'Direkomendasikan mengambil jeda istirahat singkat di rest area terdekat.',
    });
  } else if (continuousDriving >= rule.warningDrivingThresholdHours) {
    continuousScore = 70;
    factors.push({
      factor: 'Continuous Driving Duration',
      level: 'MEDIUM',
      impactScore: 15,
      description: `Durasi mengemudi mendekati batas ambang (${continuousDriving.toFixed(1)} jam).`,
    });
  } else {
    factors.push({
      factor: 'Continuous Driving Duration',
      level: 'LOW',
      impactScore: 0,
      description: `Durasi mengemudi berkelanjutan normal (${continuousDriving.toFixed(1)} jam).`,
    });
  }

  // 2. Rest Duration Factor
  let restScore = 100;
  if (restHours < rule.minRequiredRestHours * 0.6) {
    restScore = 25;
    factors.push({
      factor: 'Rest Duration Compliance',
      level: 'HIGH',
      impactScore: 30,
      description: `Istirahat sebelum shift hanya ${restHours.toFixed(1)} jam (Di bawah syarat minimal ${rule.minRequiredRestHours} jam).`,
      recommendation: 'Pertimbangkan alokasi jadwal cadangan atau waktu pemulihan ekstra.',
    });
  } else if (restHours < rule.minRequiredRestHours) {
    restScore = 65;
    factors.push({
      factor: 'Rest Duration Compliance',
      level: 'MEDIUM',
      impactScore: 15,
      description: `Istirahat 24 jam terakhir sebesar ${restHours.toFixed(1)} jam (Mendekati ambang minimal).`,
    });
  } else {
    factors.push({
      factor: 'Rest Duration Compliance',
      level: 'LOW',
      impactScore: 0,
      description: `Durasi istirahat tercukupi (${restHours.toFixed(1)} jam).`,
    });
  }

  // 3. Shift Duration Factor
  let shiftScore = 100;
  if (shiftHours >= rule.maxShiftHours) {
    shiftScore = 30;
    factors.push({
      factor: 'Shift Duration',
      level: 'HIGH',
      impactScore: 20,
      description: `Durasi shift berjalan mencapai ${shiftHours.toFixed(1)} jam (Batas maksimal ${rule.maxShiftHours} jam).`,
    });
  } else if (shiftHours >= rule.maxShiftHours * 0.8) {
    shiftScore = 70;
    factors.push({
      factor: 'Shift Duration',
      level: 'MEDIUM',
      impactScore: 10,
      description: `Panjang shift berjalan ${shiftHours.toFixed(1)} jam.`,
    });
  } else {
    factors.push({
      factor: 'Shift Duration',
      level: 'LOW',
      impactScore: 0,
      description: `Durasi shift dalam standar operasional (${shiftHours.toFixed(1)} jam).`,
    });
  }

  // 4. Night Driving Factor
  let nightScore = 100;
  if (nightHours >= 4) {
    nightScore = 35;
    factors.push({
      factor: 'Night Driving Exposure',
      level: 'HIGH',
      impactScore: 20,
      description: `Mengemudi malam hari selama ${nightHours.toFixed(1)} jam pada window jam biologis (${rule.nightStart} - ${rule.nightEnd}).`,
      recommendation: 'Tingkatkan kewaspadaan supervisor dan pengecekan checkpoint telematika.',
    });
  } else if (nightHours > 0) {
    nightScore = 70;
    factors.push({
      factor: 'Night Driving Exposure',
      level: 'MEDIUM',
      impactScore: 10,
      description: `Terdapat paparan perjalanan malam hari (${nightHours.toFixed(1)} jam).`,
    });
  } else {
    factors.push({
      factor: 'Night Driving Exposure',
      level: 'LOW',
      impactScore: 0,
      description: 'Tidak ada perjalanan pada jam malam biologis.',
    });
  }

  // 5. Consecutive Shifts Factor
  let consecutiveScore = 100;
  if (consecutiveDays >= 6) {
    consecutiveScore = 40;
    factors.push({
      factor: 'Consecutive Shift Pattern',
      level: 'MEDIUM',
      impactScore: 15,
      description: `Driver telah bertugas ${consecutiveDays} hari berturut-turut tanpa hari libur penuh.`,
    });
  } else {
    factors.push({
      factor: 'Consecutive Shift Pattern',
      level: 'LOW',
      impactScore: 0,
      description: `Pola rotasi shift normal (${consecutiveDays} hari kerja berturut-turut).`,
    });
  }

  // Weighted Score Calculation
  const totalWeight = 
    weights.continuousDrivingWeight + 
    weights.restDurationWeight + 
    weights.shiftDurationWeight + 
    weights.nightDrivingWeight + 
    weights.consecutiveShiftsWeight;

  const rawWeightedScore = (
    (continuousScore * weights.continuousDrivingWeight) +
    (restScore * weights.restDurationWeight) +
    (shiftScore * weights.shiftDurationWeight) +
    (nightScore * weights.nightDrivingWeight) +
    (consecutiveScore * weights.consecutiveShiftsWeight)
  ) / totalWeight;

  const finalScore = Math.min(100, Math.max(0, Math.round(rawWeightedScore)));
  const riskLevel = getFatigueRiskLevel(finalScore);

  return {
    score: finalScore,
    riskLevel,
    factors,
  };
}
