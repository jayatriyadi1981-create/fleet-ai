/**
 * Fleet Intelligence Smart AI - Maintenance Priority Engine
 * Prioritizes maintenance work orders into P1 (Critical), P2 (High), P3 (Medium), P4 (Low)
 * based on safety risk, vehicle operational criticality, failure severity, and service overdue days.
 */

import { MaintenancePriorityItem, MaintenancePriorityLevel, MaintenanceRiskLevel, ComponentCategory, ServiceDueStatus } from '../types';

export interface PriorityEvaluationParam {
  id: string;
  vehicleId: string;
  plateNumber: string;
  vehicleType: string;
  branch: string;
  driverName?: string;
  component: ComponentCategory;
  componentName: string;
  riskScore: number;
  riskLevel: MaintenanceRiskLevel;
  primaryIssue: string;
  dueStatus: ServiceDueStatus;
  isSafetyRelated: boolean;
  isMissionCriticalVehicle: boolean;
  assignedTeam?: string;
  estimatedDowntimeHours: number;
}

export class MaintenancePriorityEngine {
  /**
   * Assigns P1-P4 priority tier based on multidimensional operational and safety parameters
   */
  public static calculatePriority(param: PriorityEvaluationParam): MaintenancePriorityItem {
    let priority: MaintenancePriorityLevel = 'P4';
    let priorityLabel = 'P4 — Low (Perawatan Ringan / Berkala Standar)';

    const isCriticalRisk = param.riskLevel === 'CRITICAL' || param.riskScore >= 80;
    const isHighRisk = param.riskLevel === 'HIGH' || param.riskScore >= 60;
    const isOverdue = param.dueStatus === 'CRITICAL_OVERDUE' || param.dueStatus === 'OVERDUE';

    if (isCriticalRisk || (param.isSafetyRelated && isHighRisk) || param.dueStatus === 'CRITICAL_OVERDUE') {
      priority = 'P1';
      priorityLabel = 'P1 — Critical (Segera Periksa / Tahan Operasional)';
    } else if (isHighRisk || (param.isSafetyRelated && isOverdue) || (param.isMissionCriticalVehicle && isOverdue)) {
      priority = 'P2';
      priorityLabel = 'P2 — High (Jadwalkan Servis dalam 24–48 Jam)';
    } else if (param.riskLevel === 'ELEVATED' || isOverdue || param.dueStatus === 'DUE_SOON') {
      priority = 'P3';
      priorityLabel = 'P3 — Medium (Jadwalkan Servis Mingguan)';
    } else {
      priority = 'P4';
      priorityLabel = 'P4 — Low (Pemantauan Rutin / Servis Reguler)';
    }

    const safetyImpact = param.isSafetyRelated ? (priority === 'P1' ? 'HIGH' : 'MEDIUM') : 'LOW';
    const operationalImpact = param.isMissionCriticalVehicle || priority === 'P1' ? 'HIGH' : priority === 'P2' ? 'MEDIUM' : 'LOW';

    let recommendedAction = 'Lakukan inspeksi pra-jalan standar.';
    if (priority === 'P1') {
      recommendedAction = 'Inspeksi darurat teknisi sebelum penugasan trip berikutnya. Jangan operasikan jika ada risiko pengereman/mesin.';
    } else if (priority === 'P2') {
      recommendedAction = 'Kirim kendaraan ke depo bengkel rekanan pada akhir shift hari ini untuk pengecekan sistem.';
    } else if (priority === 'P3') {
      recommendedAction = 'Masukkan dalam jadwal servis akhir pekan dan siapkan suku cadang pengganti.';
    }

    return {
      id: param.id,
      priority,
      priorityLabel,
      vehicleId: param.vehicleId,
      plateNumber: param.plateNumber,
      vehicleType: param.vehicleType,
      branch: param.branch,
      driverName: param.driverName,
      component: param.component,
      componentName: param.componentName,
      riskScore: param.riskScore,
      riskLevel: param.riskLevel,
      primaryIssue: param.primaryIssue,
      dueStatus: param.dueStatus,
      safetyImpact,
      operationalImpact,
      recommendedAction,
      assignedTeam: param.assignedTeam || (priority === 'P1' ? 'Tim QC & Bengkel Utama' : 'Tim Maintenance Depo'),
      workOrderStatus: priority === 'P1' ? 'PENDING_APPROVAL' : 'NONE',
      estimatedDowntimeHours: param.estimatedDowntimeHours,
    };
  }
}
