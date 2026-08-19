/**
 * Safety Recommendation Engine & Coaching Generator
 * PROMPT 33 Architecture
 * 
 * Generates prioritized, evidence-backed safety recommendations, corrective actions (CAPA),
 * and constructive, non-punitive driver coaching programs.
 */

import { SafetyRecommendationItem, SafetyCoachingPlan } from '../types';

export class SafetyRecommendationEngine {
  /**
   * Generates active prioritized safety recommendations
   */
  public static getActiveRecommendations(): SafetyRecommendationItem[] {
    return [
      {
        id: 'rec-01',
        recommendationType: 'DRIVER_COACHING',
        priority: 'HIGH',
        title: 'Jadwalkan Sesi Coaching Perilaku Mengemudi (Driver Rudi Hartono)',
        reason: 'Terdeteksi 26 kejadian overspeed dan 19 pengereman mendadak dalam 30 hari terakhir.',
        evidence: [
          'Log Telemetri GPS Frekuensi Kecepatan > 80 km/h di zona 70 km/h',
          '3 insiden operasional minor terkait deselerasi keras di jalan tol',
          'Pola terjadi berulang di berbagai tipe armada',
        ],
        targetEntity: {
          type: 'DRIVER',
          id: 'drv-04',
          name: 'Rudi Hartono',
        },
        ownerDepartment: 'Fleet Operations & HSE',
        suggestedDeadlineDays: 7,
        expectedOutcome: 'Penurunan frekuensi overspeed minimal 60% dalam masa evaluasi 30 hari.',
        status: 'PROPOSED',
        createdAt: '2026-08-14T08:00:00Z',
      },
      {
        id: 'rec-02',
        recommendationType: 'VEHICLE_INSPECTION',
        priority: 'CRITICAL',
        title: 'Inspeksi & Kalibrasi Komprehensif Sistem Pengereman Unit B 9811 ULM',
        reason: 'Pemeriksaan telemetri mendeteksi pemanjangan jarak henti rata-rata 18% dan 4 temuan checklist inspeksi.',
        evidence: [
          'Sensor CAN-Bus brake pressure mencatat tekanan hidrolik fluktuatif',
          'Catatan ketebalan kampas rem mendekati limit 3 mm',
        ],
        targetEntity: {
          type: 'VEHICLE',
          id: 'veh-04',
          name: 'B 9811 ULM (Isuzu Giga)',
        },
        ownerDepartment: 'Maintenance & Workshop',
        suggestedDeadlineDays: 2,
        expectedOutcome: 'Restorasi performa pengereman ke standar pabrikan dan eliminasi risiko blong.',
        status: 'APPROVED',
        createdAt: '2026-08-15T10:30:00Z',
      },
      {
        id: 'rec-03',
        recommendationType: 'GEOFENCE_CONTROL',
        priority: 'HIGH',
        title: 'Aktivasi Geofence Peringatan Batas Kecepatan di Turunan Tol Cipularang KM 90-93',
        reason: 'Area ini teridentifikasi sebagai hotspot kecelakaan tingkat tinggi dengan 16 kejadian near-miss.',
        evidence: [
          'Klaster data GPS mencatat rata-rata kecepatan armada melampaui 75 km/h di turunan curam',
          'Kondisi jalan licin saat hujan meningkatkan risiko tergelincir',
        ],
        targetEntity: {
          type: 'ROUTE',
          id: 'rt-101',
          name: 'Jakarta - Bandung Express',
        },
        ownerDepartment: 'Dispatch & Safety Technology',
        suggestedDeadlineDays: 3,
        expectedOutcome: 'Kepatuhan kecepatan di bawah 50 km/h pada segmen rawan dan penurunan insiden rem panas.',
        status: 'IN_PROGRESS',
        createdAt: '2026-08-13T14:00:00Z',
      },
      {
        id: 'rec-04',
        recommendationType: 'REST_RECOMMENDATION',
        priority: 'MEDIUM',
        title: 'Otomatisasi Peringatan Jeda Istirahat Shift Malam Rute Trans Jawa',
        reason: '72% indikasi microsleep dan deviasi lajur terjadi antara pukul 00:30 hingga 03:45 WIB.',
        evidence: [
          'Durasi mengemudi kontinu rata-rata 4.4 jam sebelum pengemudi berhenti istirahat',
          'Data log trip Trans Jawa Jakarta-Surabaya',
        ],
        targetEntity: {
          type: 'FLEET',
          id: 'fleet-all',
          name: 'Seluruh Armada Long-Haul',
        },
        ownerDepartment: 'Operations & Dispatch',
        suggestedDeadlineDays: 14,
        expectedOutcome: 'Zero fatigue alerts di jam kritis dan penurunan risiko microsleep hingga 80%.',
        status: 'PROPOSED',
        createdAt: '2026-08-12T09:00:00Z',
      },
    ];
  }

  /**
   * Generates constructive coaching plans for drivers with elevated safety risk
   */
  public static getCoachingPlans(): SafetyCoachingPlan[] {
    return [
      {
        id: 'coach-01',
        driverId: 'drv-04',
        driverName: 'Rudi Hartono',
        objective: 'Meningkatkan kesadaran jarak aman pengereman dan kendali kecepatan di berbagai kontur jalan.',
        observedPattern: 'Kecenderungan memacu kecepatan di atas ambang toleransi koridor saat lalu lintas tampak lengang.',
        recommendedTopics: [
          'Prinsip 3-Second Following Distance pada kecepatan tinggi',
          'Dampak inersia muatan berat terhadap jarak henti kendaraan',
          'Manajemen ritme kerja dan pemanfaatan rest area pada shift malam',
        ],
        suggestedActivities: [
          'Sesi simulasi video kejadian nyata bersama HSE Officer (30 menit)',
          'Pendampingan rute (Ride-along evaluation) pada perjalanan jarak menengah',
          'Review telemetri mingguan bersama koordinator armada',
        ],
        followUpMetric: 'Overspeed per 1.000 km berkurang di bawah angka 2 kali dalam 30 hari ke depan.',
        evaluationPeriodDays: 30,
        status: 'IN_PROGRESS',
        assignedCoach: 'Hendra Setiawan (HSE Lead)',
        createdAt: '2026-08-14T09:00:00Z',
      },
      {
        id: 'coach-02',
        driverId: 'drv-01',
        driverName: 'Budi Santoso',
        objective: 'Penyegaran teknik defensive driving pada cuaca hujan dan jalan licin.',
        observedPattern: 'Pengereman mendadak sesaat sebelum titik antrean gerbang tol.',
        recommendedTopics: [
          'Antisipasi perlambatan lalu lintas dari jarak pandang jauh',
          'Penggunaan auxiliary exhaust brake (engine brake) untuk mengurangi beban kampas rem',
        ],
        suggestedActivities: [
          'Briefing keselamatan pra-perjalanan (Pre-trip toolbox meeting)',
          'Verifikasi berkala log sensor deselerasi CAN-Bus',
        ],
        followUpMetric: 'Zero harsh braking events (-0.5 G) selama periode evaluasi.',
        evaluationPeriodDays: 21,
        status: 'PENDING',
        assignedCoach: 'Agus Riyadi (Safety Trainer)',
        createdAt: '2026-08-15T11:00:00Z',
      },
    ];
  }
}
