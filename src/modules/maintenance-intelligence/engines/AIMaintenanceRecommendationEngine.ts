/**
 * Fleet Intelligence Smart AI - AI Maintenance Recommendation Engine
 * Generates explainable, data-backed maintenance recommendations with root cause mapping,
 * parts demand estimation, and human-in-the-loop approval workflow.
 */

import { MaintenanceRecommendationItem, MaintenancePriorityLevel, ComponentCategory, EvidenceItem } from '../types';

export class AIMaintenanceRecommendationEngine {
  /**
   * Generates actionable maintenance recommendations for a fleet vehicle
   */
  public static generateRecommendations(params: {
    vehicleId: string;
    plateNumber: string;
    branch: string;
    currentMileage: number;
    riskScore: number;
    batteryVoltage?: number;
    coolantTempC?: number;
    activeDTCs: string[];
    isServiceOverdue: boolean;
    serviceOverdueKm?: number;
    inspectionFindings: string[];
    harshBrakingFrequency: number;
    evidence: EvidenceItem[];
  }): MaintenanceRecommendationItem[] {
    const recommendations: MaintenanceRecommendationItem[] = [];
    const now = new Date();
    const nowStr = now.toISOString();

    // 1. Battery System Recommendation
    if (params.batteryVoltage !== undefined && params.batteryVoltage < 24.5) {
      const isCritical = params.batteryVoltage < 23.6;
      const recDate = new Date(now.getTime() + (isCritical ? 2 : 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      recommendations.push({
        id: `rec-batt-${params.vehicleId}`,
        vehicleId: params.vehicleId,
        plateNumber: params.plateNumber,
        branch: params.branch,
        serviceType: 'Pemeriksaan & Uji Beban Baterai / Alternator',
        priority: isCritical ? 'P1' : 'P2',
        recommendedDate: recDate,
        recommendedMileage: params.currentMileage + (isCritical ? 150 : 600),
        component: 'BATTERY',
        componentName: 'Aki & Alternator (24V System)',
        reason: `Voltase aki terdeteksi ${params.batteryVoltage.toFixed(1)}V (drop di bawah 24.5V). Memerlukan pengujian resistansi internal dan output alternator.`,
        rootCauseFactors: [
          {
            category: 'TELEMETRY',
            description: `Tegangan baterai menurun drastis saat starter dingin (${params.batteryVoltage.toFixed(1)}V).`,
          },
          {
            category: 'MAINTENANCE_AGE',
            description: 'Usia pakai aki melebihi 14 bulan operasional intensif.',
          },
        ],
        requiredInspection: [
          'Pengukuran voltase standby dan voltase saat starter aktif (cranking test)',
          'Pemeriksaan berat jenis cairan elektrolit (hydrometer test) atau status aki kering',
          'Pembersihan dan pengencangan klem kepala aki dari kerak korosi',
          'Pengujian voltase pengisian alternator (target 27.8V - 28.6V)',
        ],
        possibleParts: [
          {
            partName: 'Aki GS Astra N120 12V 120Ah Heavy Duty (2 Unit)',
            partNumber: 'BAT-GS-N120',
            estimatedCost: 3200000,
            stockStatus: 'IN_STOCK',
          },
          {
            partName: 'Klem Kepala Aki Tembaga Kuningan HD',
            partNumber: 'ELC-CLM-01',
            estimatedCost: 85000,
            stockStatus: 'IN_STOCK',
          },
        ],
        estimatedLaborCost: 150000,
        estimatedTotalCost: 3435000,
        status: 'PENDING_REVIEW',
        evidence: params.evidence.filter(e => e.source === 'TELEMETRY' || e.source === 'MAINTENANCE_HISTORY'),
        createdTimestamp: nowStr,
      });
    }

    // 2. Brake Overhaul / Inspection Recommendation
    if (params.harshBrakingFrequency > 10 || params.inspectionFindings.some(f => f.toLowerCase().includes('rem') || f.toLowerCase().includes('brake'))) {
      const recDate = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      recommendations.push({
        id: `rec-brake-${params.vehicleId}`,
        vehicleId: params.vehicleId,
        plateNumber: params.plateNumber,
        branch: params.branch,
        serviceType: 'Inspeksi Ketebalan Kampas & Servis Pengereman',
        priority: 'P2',
        recommendedDate: recDate,
        recommendedMileage: params.currentMileage + 450,
        component: 'BRAKES',
        componentName: 'Sistem Rem & Tromol (Brake Shoe)',
        reason: 'Tingginya frekuensi rem mendadak terdeteksi pada telematika dan laporan inspeksi pre-trip.',
        rootCauseFactors: [
          {
            category: 'DRIVER',
            description: `Tercatat ${params.harshBrakingFrequency}x kejadian pengereman mendadak dalam 30 hari terakhir.`,
          },
          {
            category: 'INSPECTION',
            description: 'Driver mencatat getaran atau kedalaman injakan pedal rem tidak biasa.',
          },
        ],
        requiredInspection: [
          'Pengukuran ketebalan kampas rem depan & belakang dengan micrometer',
          'Pemeriksaan keretakan tromol / piringan cakram (rotor surface check)',
          'Pemeriksaan kebocoran master silinder rem dan selang rem fleksibel',
          'Pembersihan debu rem & pelumasan pin kaliper',
        ],
        possibleParts: [
          {
            partName: 'Brake Shoe Set Heavy Duty Depan & Belakang',
            partNumber: 'BRK-SH-HINO500',
            estimatedCost: 1850000,
            stockStatus: 'IN_STOCK',
          },
          {
            partName: 'Minyak Rem DOT 4 Heavy Duty (1 Liter)',
            partNumber: 'OIL-DOT4-1L',
            estimatedCost: 120000,
            stockStatus: 'IN_STOCK',
          },
        ],
        estimatedLaborCost: 350000,
        estimatedTotalCost: 2320000,
        status: 'PENDING_REVIEW',
        evidence: params.evidence.filter(e => e.source === 'DRIVER_BEHAVIOR' || e.source === 'VEHICLE_INSPECTION'),
        createdTimestamp: nowStr,
      });
    }

    // 3. Periodic Service & Lubrication Overdue
    if (params.isServiceOverdue) {
      const overdueKm = params.serviceOverdueKm || 800;
      const isCritical = overdueKm > 2000;
      const recDate = new Date(now.getTime() + (isCritical ? 1 : 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      recommendations.push({
        id: `rec-serv-${params.vehicleId}`,
        vehicleId: params.vehicleId,
        plateNumber: params.plateNumber,
        branch: params.branch,
        serviceType: 'Servis Berkala Minor / Penggantian Oli & Filter',
        priority: isCritical ? 'P1' : 'P2',
        recommendedDate: recDate,
        recommendedMileage: params.currentMileage,
        component: 'ENGINE',
        componentName: 'Mesin & Pelumasan (Lubrication & Filters)',
        reason: `Jadwal servis berkala terlewat sejauh ${overdueKm.toLocaleString()} KM. Perlu penggantian oli mesin dan filter sebelum viskositas oli rusak.`,
        rootCauseFactors: [
          {
            category: 'MAINTENANCE_AGE',
            description: `Odometer saat ini (${params.currentMileage.toLocaleString()} KM) telah melampaui batas servis preventif.`,
          },
          {
            category: 'FUEL',
            description: 'Peningkatan konsumsi bahan bakar sebesar 8% akibat gesekan internal pelumasan.',
          },
        ],
        requiredInspection: [
          'Drain oli mesin lama dan periksa partikel gram logam magnetik',
          'Penggantian elemen filter oli mesin dan filter solar utama',
          'Pembersihan filter udara (air cleaner element)',
          'Pengecekan level cairan pendingin, minyak rem, dan oli gardan',
        ],
        possibleParts: [
          {
            partName: 'Oli Mesin Diesel SAE 15W-40 Synthetic (Drum 20L)',
            partNumber: 'OIL-15W40-20L',
            estimatedCost: 1150000,
            stockStatus: 'IN_STOCK',
          },
          {
            partName: 'Oil Filter Element Heavy Duty',
            partNumber: 'FLT-OIL-HD01',
            estimatedCost: 175000,
            stockStatus: 'IN_STOCK',
          },
          {
            partName: 'Fuel Filter Separator Element',
            partNumber: 'FLT-FUEL-SEP02',
            estimatedCost: 220000,
            stockStatus: 'LOW_STOCK',
          },
        ],
        estimatedLaborCost: 250000,
        estimatedTotalCost: 1795000,
        status: 'PENDING_REVIEW',
        evidence: params.evidence.filter(e => e.source === 'MAINTENANCE_HISTORY' || e.source === 'FUEL_INTELLIGENCE'),
        createdTimestamp: nowStr,
      });
    }

    return recommendations;
  }
}
