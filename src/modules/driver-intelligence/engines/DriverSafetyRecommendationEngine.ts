/**
 * Driver Safety Recommendation Engine - Proactive Telematics Coaching Triggers
 * PROMPT 29 - Generates evidence-backed recommendations for defensive driving and risk reduction
 */

import {
  DriverRiskScore,
  DriverSafetyRecommendation,
  RecommendationFocusType,
  RecommendationPriority,
} from '../types';
import { DriverRawTelemetryContext } from './DriverRiskScoreEngine';

export class DriverSafetyRecommendationEngine {
  /**
   * Generates actionable recommendations for an individual driver
   */
  public generateRecommendationsForDriver(
    context: DriverRawTelemetryContext,
    risk: DriverRiskScore,
    branchId = 'branch-1',
    branchName = 'Cabang Jakarta Pusat'
  ): DriverSafetyRecommendation[] {
    const recommendations: DriverSafetyRecommendation[] = [];
    const timestamp = new Date().toISOString();

    // 1. Overspeed -> Speed Management
    if (context.overspeedEventsCount >= 3) {
      const priority: RecommendationPriority =
        context.overspeedEventsCount >= 7 ? 'CRITICAL' : context.overspeedEventsCount >= 4 ? 'HIGH' : 'MEDIUM';
      recommendations.push({
        id: `rec-spd-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'SPEED_MANAGEMENT',
        category: 'SPEED_MANAGEMENT',
        title: 'Manajemen Kecepatan & Antisipasi Koridor Tol',
        description: 'Lakukan briefing review batas kecepatan koridor tol dan aktifkan pengingat kecepatan audio.',
        reason: `Terdeteksi ${context.overspeedEventsCount} insiden overspeed melebihi batas regulasi kecepatan jalan.`,
        evidence: [
          `Total ${context.overspeedEventsCount} kali terdeteksi melampaui batas kecepatan koridor.`,
          `Puncak kecepatan tercatat pada segmen tol dan jalan arteri utama.`,
        ],
        priority,
        suggestedAction:
          'Lakukan briefing review batas kecepatan koridor tol (maks 80-100 km/jam) dan aktifkan pengingat kecepatan audio di kabin.',
        suggestedCoachingType: 'Interactive Speed Management & Route Briefing',
        projectedRiskReduction: '15-25% Risk Reduction',
        relatedEventsCount: context.overspeedEventsCount,
        relatedEventsTypes: ['OVERSPEED'],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    // 2. Harsh Braking -> Defensive Driving & Braking Technique
    if (context.harshBrakingEventsCount >= 2) {
      const priority: RecommendationPriority =
        context.harshBrakingEventsCount >= 5 ? 'HIGH' : 'MEDIUM';
      recommendations.push({
        id: `rec-brk-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'BRAKING_TECHNIQUE',
        category: 'BRAKING_TECHNIQUE',
        title: 'Penerapan Jarak Aman Antisipatif (3-Second Rule)',
        description: 'Berikan penyegaran Defensive Driving mengenai aturan jarak 3 detik untuk mencegah tubrukan.',
        reason: `Pengereman mendadak (${context.harshBrakingEventsCount} kali) mengindikasikan jarak pengereman yang terlalu mepet dengan kendaraan depan.`,
        evidence: [
          `${context.harshBrakingEventsCount} kejadian pengereman mendadak dengan deselerasi <= -3.2 m/s².`,
          'Sering terjadi di area mendekati persimpangan dan exit tol.',
        ],
        priority,
        suggestedAction:
          'Berikan modul penyegaran Defensive Driving mengenai aturan jarak 3 detik untuk mengurangi risiko tabrakan beruntun dan keausan kampas rem.',
        suggestedCoachingType: 'Defensive Braking & Space Cushion Simulation',
        projectedRiskReduction: '20-30% Risk Reduction',
        relatedEventsCount: context.harshBrakingEventsCount,
        relatedEventsTypes: ['HARSH_BRAKING'],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    // 3. Harsh Acceleration -> Acceleration Control & Fuel Efficiency
    if (context.harshAccelEventsCount >= 3) {
      recommendations.push({
        id: `rec-acc-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'ACCELERATION_CONTROL',
        category: 'ACCELERATION_CONTROL',
        title: 'Teknik Akselerasi Halus (Smooth Throttle Modulation)',
        description: 'Latih pengemudi teknik Eco-Driving bertahap saat membawa muatan penuh.',
        reason: `Akselerasi kasar (${context.harshAccelEventsCount} kali) memicu lonjakan konsumsi bahan bakar dan kelelahan powertrain.`,
        evidence: [
          `${context.harshAccelEventsCount} kejadian akselerasi mendadak >= +2.5 m/s².`,
          'Berpotensi memboroskan hingga ~4-6 Liter solar per siklus trip.',
        ],
        priority: 'MEDIUM',
        suggestedAction:
          'Latih pengemudi teknik Eco-Driving bertahap (progressive shifting) saat membawa muatan penuh.',
        suggestedCoachingType: 'Eco-Driving & Throttle Modulation Workshop',
        projectedRiskReduction: '10-15% Fuel & Wear Reduction',
        relatedEventsCount: context.harshAccelEventsCount,
        relatedEventsTypes: ['HARSH_ACCELERATION'],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    // 4. Sharp Turn -> Cornering Technique & Cargo Safety
    if (context.sharpTurnEventsCount >= 2) {
      recommendations.push({
        id: `rec-trn-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'CORNERING_TECHNIQUE',
        category: 'CORNERING_TECHNIQUE',
        title: 'Reduksi Kecepatan Sebelum Memasuki Tikungan Tajam',
        description: 'Ingatkan pengemudi untuk menurunkan gigi dan kecepatan sebelum titik belok.',
        reason: `Manuver tikungan tajam berkecepatan tinggi (${context.sharpTurnEventsCount} kali) berpotensi memicu pergeseran kargo & rollover kargo berat.`,
        evidence: [
          `${context.sharpTurnEventsCount} belokan tajam pada kecepatan > 35 km/jam.`,
          'Terdeteksi di area bundaran kawasan industri dan interchange tol.',
        ],
        priority: 'MEDIUM',
        suggestedAction:
          'Ingatkan pengemudi untuk menurunkan gigi dan kecepatan sebelum titik belok, bukan mengerem di tengah tikungan.',
        suggestedCoachingType: 'Vehicle Stability & Cornering Dynamics',
        projectedRiskReduction: '15-20% Rollover Risk Reduction',
        relatedEventsCount: context.sharpTurnEventsCount,
        relatedEventsTypes: ['SHARP_TURN'],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    // 5. Route Deviation -> Route Compliance & Geo-Corridor Adherence
    if (context.routeDeviationEventsCount >= 2) {
      recommendations.push({
        id: `rec-dev-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'ROUTE_COMPLIANCE',
        category: 'ROUTE_COMPLIANCE',
        title: 'Koordinasi Deviasi Koridor dengan Dispatcher',
        description: 'Tegaskan SOP pelaporan cepat ke Dispatcher saat menemui kendala lalu lintas.',
        reason: `Tercatat ${context.routeDeviationEventsCount} penyimpangan rute dari koridor master tanpa konfirmasi resmi lebih awal.`,
        evidence: [
          `${context.routeDeviationEventsCount} kejadian deviasi geofence rute perjalanan.`,
          'Sebagian penyimpangan menambah durasi tempuh dan konsumsi BBM.',
        ],
        priority: 'HIGH',
        suggestedAction:
          'Tegaskan SOP pelaporan cepat ke Dispatcher melalui aplikasi mobile saat menemui kendala lalu lintas sebelum mengambil jalur alternatif.',
        suggestedCoachingType: 'Route Compliance & Dispatcher Coordination Protocol',
        projectedRiskReduction: '10-18% Delay & Risk Reduction',
        relatedEventsCount: context.routeDeviationEventsCount,
        relatedEventsTypes: ['ROUTE_DEVIATION'],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    // 6. Excessive Idle -> Idle Reduction
    if (context.idleDurationMinutes >= 60) {
      recommendations.push({
        id: `rec-idl-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'IDLE_REDUCTION',
        category: 'IDLE_REDUCTION',
        title: 'Prosedur Engine Shut-Down Saat Antrean Bongkar Muat',
        description: 'Sosialisasikan SOP matikan mesin jika berhenti lebih dari 3 menit saat menunggu.',
        reason: `Durasi idling mesin mencapai ${context.idleDurationMinutes} menit, mengakibatkan pemborosan bahan bakar yang tidak perlu.`,
        evidence: [
          `Akumulasi ${context.idleDurationMinutes} menit kontak ON kecepatan 0 km/jam.`,
          'Lokasi dominan di pangkalan dan gerbang loading dock antrean.',
        ],
        priority: 'LOW',
        suggestedAction:
          'Sosialisasikan SOP matikan mesin jika berhenti lebih dari 3 menit saat menunggu di loading dock.',
        suggestedCoachingType: 'Idling SOP & Carbon Footprint Awareness',
        projectedRiskReduction: '12-20% Fuel Savings',
        relatedEventsCount: Math.round(context.idleDurationMinutes / 15),
        relatedEventsTypes: ['EXCESSIVE_IDLE'],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    // 7. Fatigue Indicators -> Operational Rest / Break Reminder
    if (context.fatigueRiskEventsCount >= 1 || context.drivingHours > 8) {
      recommendations.push({
        id: `rec-ftg-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'REST_BREAK_REMINDER',
        category: 'REST_BREAK_REMINDER',
        title: 'Kepatuhan Interval Istirahat Operasional (SOP 4 Jam Berkendara)',
        description: 'Jadwalkan jeda istirahat wajib minimal 30 menit setiap 4 jam berkendara kontinu.',
        reason: `Sinyal risiko operasional mengindikasikan jam kemudi panjang (${context.drivingHours} jam) tanpa interval jeda yang cukup.`,
        evidence: [
          `${context.fatigueRiskEventsCount} peringatan jam kemudi kontinu melampaui batas aman.`,
          'Berisiko menurunkan konsentrasi dan waktu reaksi manuver.',
        ],
        priority: 'CRITICAL',
        suggestedAction:
          'Jadwalkan jeda istirahat wajib minimal 30 menit setiap 4 jam berkendara kontinu di rest area resmi yang ditentukan.',
        suggestedCoachingType: 'Fatigue Risk Prevention & Rest Interval Protocol',
        projectedRiskReduction: '30-45% Incident Risk Reduction',
        relatedEventsCount: context.fatigueRiskEventsCount,
        relatedEventsTypes: ['FATIGUE'],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    // 8. Vehicle Inspection Compliance
    if (context.failedInspectionCount >= 1 || (context.totalInspectionsCount > 0 && context.failedInspectionCount / context.totalInspectionsCount > 0.15)) {
      recommendations.push({
        id: `rec-ins-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'VEHICLE_INSPECTION',
        category: 'VEHICLE_INSPECTION',
        title: 'Kedisiplinan Pre-Trip Inspection (Pemeriksaan Awal Kendaraan)',
        description: 'Pastikan driver menyelesaikan form Pre-Trip Inspection digital lengkap dengan foto bukti fisik.',
        reason: 'Terdapat catatan temuan ketidaksesuaian atau kegagalan ceklis inspeksi awal sebelum memulai tugas.',
        evidence: [
          `${context.failedInspectionCount} inspeksi mencatat item checklist belum memenuhi standar kelaikan operasional.`,
        ],
        priority: 'MEDIUM',
        suggestedAction:
          'Pastikan driver menyelesaikan form Pre-Trip Inspection digital lengkap dengan foto bukti fisik sebelum menyalakan kontak kendaraan.',
        suggestedCoachingType: 'Pre-Trip Inspection Protocol Coaching',
        projectedRiskReduction: '20-30% Breakdown Prevention',
        relatedEventsCount: context.failedInspectionCount,
        relatedEventsTypes: [],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    // Fallback if driver has exemplary behavior
    if (recommendations.length === 0) {
      recommendations.push({
        id: `rec-safe-${context.driverId}`,
        tenantId: 'tenant-tln-01',
        driverId: context.driverId,
        driverName: context.driverName,
        branchId,
        branchName,
        focusType: 'SAFETY_AWARENESS',
        category: 'SAFETY_AWARENESS',
        title: 'Pertahankan Standar Keselamatan Berkendara Teladan',
        description: 'Berikan apresiasi Safety Reward bulanan dan jadikan percontohan bagi rekan pengemudi.',
        reason: 'Performa mengemudi dan parameter telemetri berada dalam status sangat prima.',
        evidence: [
          'Tingkat insiden mendekati nol dalam periode pemantauan aktif.',
          'Kepatuhan kecepatan dan rute konsisten memenuhi standar SOP.',
        ],
        priority: 'LOW',
        suggestedAction:
          'Berikan apresiasi Safety Reward bulanan dan jadikan percontohan (Safety Champion) bagi rekan pengemudi lainnya.',
        suggestedCoachingType: 'Safety Champion Mentorship Program',
        projectedRiskReduction: 'Exemplary Standard Sustained',
        relatedEventsCount: 0,
        relatedEventsTypes: [],
        createdAt: timestamp,
        status: 'ACTIVE',
      });
    }

    return recommendations;
  }
}

export const driverSafetyRecommendationEngine = new DriverSafetyRecommendationEngine();
