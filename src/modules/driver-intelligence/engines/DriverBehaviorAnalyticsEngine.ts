/**
 * Driver Behavior Analytics Engine - Detailed Telematics Behavioral Intelligence
 * PROMPT 29 - Overspeed, Harsh Braking, Harsh Accel, Sharp Turn, Route Deviation, Idle Analysis
 */

import {
  BehaviorSeverity,
  DriverBehaviorAnalysis,
  HarshAccelerationIntelligence,
  HarshBrakingIntelligence,
  IdleBehaviorIntelligence,
  OverspeedIntelligence,
  RouteDeviationIntelligence,
  SharpTurnIntelligence,
} from '../types';
import { DriverRawTelemetryContext } from './DriverRiskScoreEngine';

export class DriverBehaviorAnalyticsEngine {
  /**
   * Generates comprehensive behavioral intelligence breakdown
   */
  public analyzeBehavior(
    context: DriverRawTelemetryContext,
    fleetAvgEvents = 8.5,
    peerAvgEvents = 7.2
  ): DriverBehaviorAnalysis {
    const isHighRisk = (context.overspeedEventsCount + context.harshBrakingEventsCount) > 8;

    // 1. Overspeed Intelligence
    const overspeedTopCorridors =
      context.overspeedEventsCount > 0
        ? ['Tol Jakarta-Cikampek KM 42', 'Jalan Pantura Karawang Timur', 'Tol Jagorawi KM 18']
        : [];

    const overspeed: OverspeedIntelligence = {
      eventCount: context.overspeedEventsCount,
      excessAvgKmH: context.overspeedEventsCount > 0 ? 14 + (isHighRisk ? 6 : 2) : 0,
      maxSpeedKmH: context.overspeedEventsCount > 0 ? 98 + (isHighRisk ? 18 : 6) : 65,
      maxSpeedRecorded: context.overspeedEventsCount > 0 ? 98 + (isHighRisk ? 18 : 6) : 65,
      durationMinutes: Math.round(context.overspeedEventsCount * 2.8),
      durationOverLimitMinutes: Math.round(context.overspeedEventsCount * 2.8),
      severity: isHighRisk ? 'CRITICAL' : context.overspeedEventsCount > 3 ? 'MODERATE' : 'LOW',
      topCorridors: overspeedTopCorridors,
      concentratedRoute: context.overspeedEventsCount > 2 ? 'Tol Jakarta-Cikampek KM 34 - 58' : undefined,
      concentratedRouteCount: context.overspeedEventsCount > 2 ? Math.round(context.overspeedEventsCount * 0.65) : 0,
      speedAboveThresholdHistogram: [
        { range: '1-10 km/h', count: Math.round(context.overspeedEventsCount * 0.45) },
        { range: '11-20 km/h', count: Math.round(context.overspeedEventsCount * 0.35) },
        { range: '21-30 km/h', count: Math.round(context.overspeedEventsCount * 0.15) },
        { range: '> 30 km/h', count: Math.round(context.overspeedEventsCount * 0.05) },
      ],
      timeOfDayDistribution: [
        { hourBlock: '06:00 - 10:00', count: Math.round(context.overspeedEventsCount * 0.2) },
        { hourBlock: '10:00 - 14:00', count: Math.round(context.overspeedEventsCount * 0.3) },
        { hourBlock: '14:00 - 18:00', count: Math.round(context.overspeedEventsCount * 0.35) },
        { hourBlock: '18:00 - 22:00', count: Math.round(context.overspeedEventsCount * 0.15) },
      ],
      primaryLocations:
        context.overspeedEventsCount > 0
          ? ['Tol Jakarta-Cikampek KM 42', 'Jalan Pantura Karawang Timur', 'Tol Jagorawi KM 18']
          : ['Tidak ada lokasi overspeed signifikan'],
      vehicleBreakdown: [
        { vehiclePlate: 'B 9281 KXA', count: Math.ceil(context.overspeedEventsCount * 0.7) },
        { vehiclePlate: 'B 9104 UYT', count: Math.floor(context.overspeedEventsCount * 0.3) },
      ],
      insightSummary:
        context.overspeedEventsCount > 4
          ? `Terdeteksi konsentrasi overspeed di koridor Tol Jakarta-Cikampek dengan kecepatan puncak melebihi batas regulasi sebesar ${(14 + (isHighRisk ? 6 : 2))} km/jam.`
          : context.overspeedEventsCount > 0
          ? `Overspeed terkontrol dalam frekuensi rendah (${context.overspeedEventsCount} insiden).`
          : 'Kepatuhan kecepatan sempurna tanpa pelanggaran batas kecepatan koridor.',
    };

    // 2. Harsh Braking Intelligence
    const harshBraking: HarshBrakingIntelligence = {
      eventCount: context.harshBrakingEventsCount,
      avgDecelMs2: context.harshBrakingEventsCount > 0 ? -3.8 : 0,
      peakDecelMs2: context.harshBrakingEventsCount > 0 ? (isHighRisk ? -5.2 : -3.9) : 0,
      averageDeceleration: context.harshBrakingEventsCount > 0 ? 3.8 : 0,
      riskOfRearEndCollision: isHighRisk || context.harshBrakingEventsCount > 4 ? 'HIGH' : 'LOW',
      topLocations:
        context.harshBrakingEventsCount > 0
          ? ['Persimpangan Cibitung Indah', 'Exit Tol Karawang Barat', 'Simpang Gadog Ciawi']
          : ['Tidak ada pengereman ekstrem'],
      roadSegments: [
        { segment: 'Area Persimpangan Traffic Light', count: Math.round(context.harshBrakingEventsCount * 0.5) },
        { segment: 'Jalur Tol Perlambatan Exit', count: Math.round(context.harshBrakingEventsCount * 0.35) },
        { segment: 'Kawasan Arteri Padat', count: Math.round(context.harshBrakingEventsCount * 0.15) },
      ],
      timeDistribution: [
        { timeRange: 'Pagi (07:00-11:00)', count: Math.round(context.harshBrakingEventsCount * 0.4) },
        { timeRange: 'Siang (11:00-15:00)', count: Math.round(context.harshBrakingEventsCount * 0.2) },
        { timeRange: 'Sore (15:00-19:00)', count: Math.round(context.harshBrakingEventsCount * 0.4) },
      ],
      associatedSpeedExcessCount: Math.round(context.harshBrakingEventsCount * 0.45),
      insightSummary:
        context.harshBrakingEventsCount > 3
          ? `Pengereman mendadak kerap terjadi di area persimpangan dan exit tol, mengindikasikan perlunya antisipasi jarak aman (3-second rule) lebih awal.`
          : context.harshBrakingEventsCount > 0
          ? `Pengereman berada pada rentang batas kewajaran (${context.harshBrakingEventsCount} kali).`
          : 'Pengereman sangat halus dan antisipatif.',
    };

    // 3. Harsh Acceleration Intelligence
    const harshAcceleration: HarshAccelerationIntelligence = {
      eventCount: context.harshAccelEventsCount,
      avgAccelMs2: context.harshAccelEventsCount > 0 ? 3.1 : 0,
      peakAccelMs2: context.harshAccelEventsCount > 0 ? 4.2 : 0,
      fuelWastePercentageEstimate: context.harshAccelEventsCount > 0 ? Math.min(25, 4 + context.harshAccelEventsCount * 2) : 0,
      topRoutes: ['Rute Logistik Cikarang - Marunda', 'Rute Distribusi Cakung - Bekasi'],
      vehicleTypes: [
        { type: 'Heavy Truck Wingbox (24T)', count: Math.round(context.harshAccelEventsCount * 0.6) },
        { type: 'Medium CDD (8T)', count: Math.round(context.harshAccelEventsCount * 0.4) },
      ],
      fuelImpactLitersEstimate: Math.round(context.harshAccelEventsCount * 0.65 * 10) / 10,
      insightSummary:
        context.harshAccelEventsCount > 3
          ? `Akselerasi agresif terdeteksi pada muatan berat, berdampak pada estimasi pemborosan BBM ~${(context.harshAccelEventsCount * 0.65).toFixed(1)} Liter.`
          : 'Teknik akselerasi stabil dan efisien bahan bakar.',
    };

    // 4. Sharp Turn Intelligence
    const sharpTurn: SharpTurnIntelligence = {
      eventCount: context.sharpTurnEventsCount,
      avgTurnAngleDeg: context.sharpTurnEventsCount > 0 ? 54 : 0,
      avgSpeedDuringTurnKmH: context.sharpTurnEventsCount > 0 ? 42 : 0,
      maxLateralG: context.sharpTurnEventsCount > 0 ? (isHighRisk ? 0.58 : 0.44) : 0.22,
      rolloverRisk: context.sharpTurnEventsCount > 3 ? 'HIGH' : 'LOW',
      hotspotLocations:
        context.sharpTurnEventsCount > 0
          ? ['Bundaran Kawasan MM2100', 'Interchange Cikampek Utama']
          : ['Tidak ada insiden tikungan agresif'],
      cargoShiftRiskLevel: context.sharpTurnEventsCount > 3 ? 'HIGH' : context.sharpTurnEventsCount > 1 ? 'MEDIUM' : 'LOW',
      insightSummary:
        context.sharpTurnEventsCount > 2
          ? `Manuver belokan tajam pada kecepatan > 35 km/jam meningkatkan risiko pergeseran muatan (cargo shift) dan keausan ban luar.`
          : 'Pengendalian laju kemudi di tikungan terpantau aman dan presisi.',
    };

    // 5. Route Deviation Intelligence
    const recognizedDetours = [
      {
        type: 'TRAFFIC' as const,
        count: Math.round(context.routeDeviationEventsCount * 0.4),
        description: 'Pengalihan jalur akibat kemacetan parah di arteri utama',
      },
      {
        type: 'ROAD_CLOSURE' as const,
        count: Math.round(context.routeDeviationEventsCount * 0.2),
        description: 'Perbaikan jalan & rekayasa lalu lintas setempat',
      },
      {
        type: 'UNAUTHORIZED' as const,
        count: Math.max(0, context.routeDeviationEventsCount - Math.round(context.routeDeviationEventsCount * 0.6)),
        description: 'Penyimpangan rute tanpa laporan/otorisasi dispatcher',
      },
    ];

    const unauthorizedCount = recognizedDetours.find((d) => d.type === 'UNAUTHORIZED')?.count || 0;

    const routeDeviation: RouteDeviationIntelligence = {
      deviationCount: context.routeDeviationEventsCount,
      totalDurationMinutes: context.routeDeviationEventsCount * 22,
      totalDetourKm: Math.round(context.routeDeviationEventsCount * 4.2 * 10) / 10,
      avgDistanceMeters: context.routeDeviationEventsCount > 0 ? 680 : 0,
      maxDistanceMeters: context.routeDeviationEventsCount > 0 ? 2100 : 0,
      recognizedDetours,
      unauthorizedCount,
      insightSummary:
        context.routeDeviationEventsCount > 2
          ? `Tercatat ${context.routeDeviationEventsCount} deviasi rute (${unauthorizedCount} tidak terotorisasi). Mayoritas penyesuaian terkait kemacetan & proyek jalan.`
          : context.routeDeviationEventsCount > 0
          ? 'Penyimpangan koridor rute minor dan sebagian besar dapat diidentifikasi penyebabnya.'
          : 'Kepatuhan rute 100% mengikuti geofence koridor yang ditentukan.',
    };

    // 6. Idle Behavior Intelligence
    const avgIdlePerTrip = Math.round(context.idleDurationMinutes / Math.max(context.tripsCount, 1));
    const fuelWasted = Math.round((context.idleDurationMinutes / 60) * 1.8 * 10) / 10;
    const costWastedIdr = Math.round(fuelWasted * 15500);

    const idleBehavior: IdleBehaviorIntelligence = {
      idleCount: Math.round(context.idleDurationMinutes / 15),
      totalIdleMinutes: context.idleDurationMinutes,
      idlePercentageOfTrip: Math.min(45, Math.round((context.idleDurationMinutes / Math.max(context.drivingHours * 60, 1)) * 100)),
      estimatedFuelWastedLiters: fuelWasted,
      estimatedCostWastedIdr: costWastedIdr,
      topIdleLocations: [
        { locationName: 'Antrean Gerbang Bongkar Muat DC Cibitung', minutes: Math.round(context.idleDurationMinutes * 0.45) },
        { locationName: 'Rest Area KM 57 Tol Japek', minutes: Math.round(context.idleDurationMinutes * 0.35) },
        { locationName: 'Pangkalan Parkir Cabang', minutes: Math.round(context.idleDurationMinutes * 0.20) },
      ],
      idleEfficiencyScore: Math.max(20, Math.min(100, 100 - Math.round((avgIdlePerTrip / 30) * 35))),
      insightSummary:
        context.idleDurationMinutes > 90
          ? `Akumulasi idle mesin tinggi (${context.idleDurationMinutes} menit) menyebabkan pemborosan BBM ~${fuelWasted}L (Rp ${costWastedIdr.toLocaleString('id-ID')}). Terkonsentrasi di antrean bongkar muat.`
          : 'Durasi idling mesin terpantau optimal dan efisien.',
    };

    // Overall Behavior Score (0 - 100)
    const totalDriverEvents =
      context.overspeedEventsCount +
      context.harshBrakingEventsCount +
      context.harshAccelEventsCount +
      context.sharpTurnEventsCount +
      context.routeDeviationEventsCount;

    const overallBehaviorScore = Math.max(
      20,
      Math.min(
        100,
        100 -
          (context.overspeedEventsCount * 3 +
            context.harshBrakingEventsCount * 3.5 +
            context.harshAccelEventsCount * 2 +
            context.sharpTurnEventsCount * 2.5 +
            context.routeDeviationEventsCount * 4)
      )
    );

    // Severity Breakdown
    const eventsBySeverity: Record<BehaviorSeverity, number> = {
      CRITICAL: Math.round(context.overspeedEventsCount * 0.15 + context.harshBrakingEventsCount * 0.2),
      HIGH: Math.round(context.overspeedEventsCount * 0.45 + context.harshBrakingEventsCount * 0.5 + context.routeDeviationEventsCount * 0.4),
      MEDIUM: Math.round(context.harshAccelEventsCount * 0.6 + context.sharpTurnEventsCount * 0.7),
      LOW: Math.round(context.idleDurationMinutes > 30 ? 2 : 0),
    };

    return {
      overspeed,
      harshBraking,
      harshAcceleration,
      sharpTurn,
      routeDeviation,
      idleBehavior,
      overallBehaviorScore,
      eventsBySeverity,
      frequencyComparison: {
        driverCurrent: totalDriverEvents,
        driverPrevious: Math.max(0, totalDriverEvents + (isHighRisk ? -3 : 2)),
        fleetAverage: fleetAvgEvents,
        peerGroupAverage: peerAvgEvents,
      },
    };
  }
}

export const driverBehaviorAnalyticsEngine = new DriverBehaviorAnalyticsEngine();
