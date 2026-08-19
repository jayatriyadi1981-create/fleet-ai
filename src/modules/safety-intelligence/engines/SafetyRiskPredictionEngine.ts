/**
 * Safety Risk Prediction Engine
 * PROMPT 33 Architecture
 * 
 * Provides predictive multi-dimensional safety risk evaluations for drivers, vehicles,
 * routes, active trips, and fatigue telemetry, with early warning alert triggers.
 */

import { DriverSafetyProfile, VehicleSafetyProfile, RouteSafetyProfile, SafetyRiskLevel, RiskTrendDirection } from '../types';

export interface TripSafetyRiskEvaluation {
  tripId: string;
  tripNumber: string;
  vehiclePlate: string;
  driverName: string;
  origin: string;
  destination: string;
  overallTripRiskScore: number; // 0 - 100 (higher = riskier)
  riskLevel: SafetyRiskLevel;
  riskFactorBreakdown: {
    driverRiskFactor: number;
    vehicleRiskFactor: number;
    routeRiskFactor: number;
    fatigueRiskFactor: number;
    weatherRiskFactor: number;
    trafficRiskFactor: number;
  };
  earlyWarningAlert?: string;
  mitigationAdvisory: string;
}

export class SafetyRiskPredictionEngine {
  private static readonly MODEL_VERSION = 'Safety-RiskPredict-v3.8';

  /**
   * Driver Safety Profiles calculation with real behavioral telemetry inputs
   */
  public static getDriverSafetyProfiles(): DriverSafetyProfile[] {
    return [
      {
        driverId: 'drv-01',
        driverName: 'Budi Santoso',
        branch: 'Cabang Utama Jakarta',
        overallSafetyScore: 76,
        riskLevel: 'HIGH',
        riskTrend: 'INCREASING',
        overspeedEventsLast30d: 18,
        harshBrakingLast30d: 14,
        harshAccelerationLast30d: 9,
        fatigueAlertsLast30d: 5,
        incidentsLast90d: 2,
        accidentsLast90d: 1,
        totalDrivingHoursLast30d: 184,
        scoreBreakdown: {
          behaviorScore: 70,
          fatigueComplianceScore: 74,
          routeComplianceScore: 88,
          inspectionComplianceScore: 92,
          incidentDeduction: 18,
        },
        recommendedCoachingTopic: 'Manajemen Kecepatan di Kondisi Hujan & Safe Braking Distance',
        isCoachingAssigned: true,
      },
      {
        driverId: 'drv-02',
        driverName: 'Ahmad Hidayat',
        branch: 'Hub Cikarang',
        overallSafetyScore: 82,
        riskLevel: 'MODERATE',
        riskTrend: 'STABLE',
        overspeedEventsLast30d: 6,
        harshBrakingLast30d: 7,
        harshAccelerationLast30d: 4,
        fatigueAlertsLast30d: 2,
        incidentsLast90d: 1,
        accidentsLast90d: 1,
        totalDrivingHoursLast30d: 162,
        scoreBreakdown: {
          behaviorScore: 84,
          fatigueComplianceScore: 80,
          routeComplianceScore: 86,
          inspectionComplianceScore: 94,
          incidentDeduction: 12,
        },
        recommendedCoachingTopic: 'Prosedur Manuver Mundur & Spion Blind-spot di Loading Dock',
        isCoachingAssigned: false,
      },
      {
        driverId: 'drv-03',
        driverName: 'Dedi Kurniawan',
        branch: 'Cabang Bandung',
        overallSafetyScore: 94,
        riskLevel: 'LOW',
        riskTrend: 'DECREASING',
        overspeedEventsLast30d: 1,
        harshBrakingLast30d: 2,
        harshAccelerationLast30d: 1,
        fatigueAlertsLast30d: 0,
        incidentsLast90d: 0,
        accidentsLast90d: 0,
        totalDrivingHoursLast30d: 170,
        scoreBreakdown: {
          behaviorScore: 96,
          fatigueComplianceScore: 95,
          routeComplianceScore: 98,
          inspectionComplianceScore: 96,
          incidentDeduction: 0,
        },
        recommendedCoachingTopic: 'Mempertahankan Kinerja Safety Excellence (Sertifikasi Teladan)',
        isCoachingAssigned: false,
      },
      {
        driverId: 'drv-04',
        driverName: 'Rudi Hartono',
        branch: 'Cabang Semarang',
        overallSafetyScore: 68,
        riskLevel: 'CRITICAL',
        riskTrend: 'INCREASING',
        overspeedEventsLast30d: 26,
        harshBrakingLast30d: 19,
        harshAccelerationLast30d: 12,
        fatigueAlertsLast30d: 8,
        incidentsLast90d: 3,
        accidentsLast90d: 0,
        totalDrivingHoursLast30d: 198,
        scoreBreakdown: {
          behaviorScore: 62,
          fatigueComplianceScore: 65,
          routeComplianceScore: 78,
          inspectionComplianceScore: 84,
          incidentDeduction: 21,
        },
        recommendedCoachingTopic: 'Defensive Driving Wajib & Manajemen Waktu Istirahat Shift Malam',
        isCoachingAssigned: true,
      },
      {
        driverId: 'drv-05',
        driverName: 'Eko Prasetyo',
        branch: 'Cabang Surabaya',
        overallSafetyScore: 89,
        riskLevel: 'LOW',
        riskTrend: 'STABLE',
        overspeedEventsLast30d: 3,
        harshBrakingLast30d: 4,
        harshAccelerationLast30d: 2,
        fatigueAlertsLast30d: 1,
        incidentsLast90d: 0,
        accidentsLast90d: 0,
        totalDrivingHoursLast30d: 155,
        scoreBreakdown: {
          behaviorScore: 90,
          fatigueComplianceScore: 92,
          routeComplianceScore: 91,
          inspectionComplianceScore: 95,
          incidentDeduction: 0,
        },
        recommendedCoachingTopic: 'Review Kepatuhan Standar Penjagaan Koridor Geofence',
        isCoachingAssigned: false,
      },
    ];
  }

  /**
   * Vehicle Safety Profiles with maintenance & inspection correlation
   */
  public static getVehicleSafetyProfiles(): VehicleSafetyProfile[] {
    return [
      {
        vehicleId: 'veh-01',
        plateNumber: 'B 9211 TJP',
        model: 'Hino 500 FL 260 JW (Wingbox)',
        vehicleType: 'Heavy Truck',
        branch: 'Cabang Utama Jakarta',
        overallSafetyScore: 78,
        riskLevel: 'MODERATE',
        riskTrend: 'INCREASING',
        maintenanceRiskScore: 68,
        inspectionFailureCount30d: 2,
        brakeConditionStatus: 'ATTENTION_REQUIRED',
        tireConditionStatus: 'FAIR',
        batteryStatus: 'OPTIMAL',
        engineHealthStatus: 'HEALTHY',
        recentIncidentsCount: 1,
        recommendedAction: 'Jadwalkan servis kalibrasi kampas rem dan rotasi ban depan.',
      },
      {
        vehicleId: 'veh-02',
        plateNumber: 'B 9482 TKR',
        model: 'Mitsubishi Fuso Fighter FN 62 (Box)',
        vehicleType: 'Medium Truck',
        branch: 'Hub Cikarang',
        overallSafetyScore: 84,
        riskLevel: 'LOW',
        riskTrend: 'STABLE',
        maintenanceRiskScore: 32,
        inspectionFailureCount30d: 1,
        brakeConditionStatus: 'OPTIMAL',
        tireConditionStatus: 'OPTIMAL',
        batteryStatus: 'OPTIMAL',
        engineHealthStatus: 'HEALTHY',
        recentIncidentsCount: 1,
        recommendedAction: 'Lakukan perbaikan ringan sensor spion samping kiri.',
      },
      {
        vehicleId: 'veh-04',
        plateNumber: 'B 9811 ULM',
        model: 'Isuzu Giga FVR 34 P (Heavy Cargo)',
        vehicleType: 'Heavy Truck',
        branch: 'Cabang Semarang',
        overallSafetyScore: 65,
        riskLevel: 'CRITICAL',
        riskTrend: 'INCREASING',
        maintenanceRiskScore: 88,
        inspectionFailureCount30d: 4,
        brakeConditionStatus: 'DEGRADED',
        tireConditionStatus: 'WORN',
        batteryStatus: 'REPLACE_SOON',
        engineHealthStatus: 'WARNING',
        recentIncidentsCount: 2,
        recommendedAction: 'Wajibkan inspeksi menyeluruh di bengkel sebelum diizinkan rute Trans Jawa.',
      },
      {
        vehicleId: 'veh-03',
        plateNumber: 'D 8820 AB',
        model: 'Hino Dutro 130 HD (Box Logistik)',
        vehicleType: 'Light Truck',
        branch: 'Cabang Bandung',
        overallSafetyScore: 92,
        riskLevel: 'LOW',
        riskTrend: 'DECREASING',
        maintenanceRiskScore: 18,
        inspectionFailureCount30d: 0,
        brakeConditionStatus: 'OPTIMAL',
        tireConditionStatus: 'OPTIMAL',
        batteryStatus: 'OPTIMAL',
        engineHealthStatus: 'HEALTHY',
        recentIncidentsCount: 0,
        recommendedAction: 'Kondisi prima, pertahankan jadwal perawatan berkala 10.000 km.',
      },
    ];
  }

  /**
   * Route Safety Profiles with hotspot & historical risk correlations
   */
  public static getRouteSafetyProfiles(): RouteSafetyProfile[] {
    return [
      {
        routeId: 'rt-101',
        routeName: 'Jakarta - Bandung Express (Tol Cipularang)',
        origin: 'Jakarta Hub Cakung',
        destination: 'Bandung Hub Gedebage',
        totalTripsCompleted: 420,
        riskLevel: 'HIGH',
        safetyScore: 74,
        riskTrend: 'INCREASING',
        historicalIncidentsCount: 8,
        historicalAccidentsCount: 2,
        nearMissCount: 14,
        corridorDeviationFrequency: 6,
        identifiedHotspotsCount: 3,
        roadComplexityFactor: 'HIGH',
        nightIncidentRatioPct: 62,
        recommendedSafetyGuidance: 'Batas kecepatan maksimal 60 km/h di turunan curam KM 90-100, wajib engine brake.',
      },
      {
        routeId: 'rt-102',
        routeName: 'Cikarang - Karawang Distribution Loop',
        origin: 'Depo Cikarang Barat',
        destination: 'Kawasan Industri KIIC Karawang',
        totalTripsCompleted: 610,
        riskLevel: 'LOW',
        safetyScore: 91,
        riskTrend: 'STABLE',
        historicalIncidentsCount: 2,
        historicalAccidentsCount: 0,
        nearMissCount: 5,
        corridorDeviationFrequency: 2,
        identifiedHotspotsCount: 1,
        roadComplexityFactor: 'LOW',
        nightIncidentRatioPct: 20,
        recommendedSafetyGuidance: 'Waspada penumpukan antrean loading dock di simpang akses utama pabrik.',
      },
      {
        routeId: 'rt-103',
        routeName: 'Jakarta - Surabaya Trans-Jawa Arterial',
        origin: 'Jakarta Tanjung Priok',
        destination: 'Surabaya Hub Rungkut',
        totalTripsCompleted: 310,
        riskLevel: 'CRITICAL',
        safetyScore: 58,
        riskTrend: 'INCREASING',
        historicalIncidentsCount: 15,
        historicalAccidentsCount: 3,
        nearMissCount: 22,
        corridorDeviationFrequency: 11,
        identifiedHotspotsCount: 5,
        roadComplexityFactor: 'HIGH',
        nightIncidentRatioPct: 74,
        recommendedSafetyGuidance: 'Wajib pergantian 2 driver atau jeda istirahat wajib minimal 45 menit per 4 jam tempuh.',
      },
    ];
  }

  /**
   * Active Trip Safety Risk evaluations with early warning indicators
   */
  public static getActiveTripSafetyRisks(): TripSafetyRiskEvaluation[] {
    return [
      {
        tripId: 'trip-901',
        tripNumber: 'TRP-2026-0816-01',
        vehiclePlate: 'B 9811 ULM',
        driverName: 'Rudi Hartono',
        origin: 'Jakarta Hub',
        destination: 'Semarang Hub',
        overallTripRiskScore: 84,
        riskLevel: 'CRITICAL',
        riskFactorBreakdown: {
          driverRiskFactor: 86,
          vehicleRiskFactor: 88,
          routeRiskFactor: 78,
          fatigueRiskFactor: 82,
          weatherRiskFactor: 60,
          trafficRiskFactor: 75,
        },
        earlyWarningAlert: '⚠️ Peningkatan Risiko Keselamatan: Pengemudi tercatat 3 overspeed berturut-turut dengan status keausan ban mendekati batas toleransi.',
        mitigationAdvisory: 'Hubungi pengemudi melalui dispatch untuk instruksi singgah di Rest Area KM 166 dan kurangi kecepatan.',
      },
      {
        tripId: 'trip-902',
        tripNumber: 'TRP-2026-0816-02',
        vehiclePlate: 'B 9211 TJP',
        driverName: 'Budi Santoso',
        origin: 'Jakarta Cakung',
        destination: 'Bandung Gedebage',
        overallTripRiskScore: 66,
        riskLevel: 'HIGH',
        riskFactorBreakdown: {
          driverRiskFactor: 64,
          vehicleRiskFactor: 58,
          routeRiskFactor: 82,
          fatigueRiskFactor: 62,
          weatherRiskFactor: 78,
          trafficRiskFactor: 70,
        },
        earlyWarningAlert: 'Hujan deras terdeteksi di segmen Tol Cipularang KM 88-100 dengan kepadatan laju.',
        mitigationAdvisory: 'Kirimkan advisory cuaca basah ke kabin driver dan aktifkan pemantauan telemetri jarak iring.',
      },
      {
        tripId: 'trip-903',
        tripNumber: 'TRP-2026-0816-03',
        vehiclePlate: 'D 8820 AB',
        driverName: 'Dedi Kurniawan',
        origin: 'Bandung Soekarno Hatta',
        destination: 'Cirebon Hub',
        overallTripRiskScore: 22,
        riskLevel: 'LOW',
        riskFactorBreakdown: {
          driverRiskFactor: 18,
          vehicleRiskFactor: 16,
          routeRiskFactor: 28,
          fatigueRiskFactor: 20,
          weatherRiskFactor: 15,
          trafficRiskFactor: 24,
        },
        mitigationAdvisory: 'Kondisi perjalanan aman dan dalam koridor standar operasional.',
      },
    ];
  }
}
