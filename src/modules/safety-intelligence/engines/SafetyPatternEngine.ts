/**
 * Safety Pattern & Hotspot Detection Engine
 * PROMPT 33 Architecture
 * 
 * Analyzes recurring patterns (overspeed, harsh brakes, fatigue, deviations),
 * geospatial accident hotspots, temporal time-of-day clusters, and performs
 * Driver vs Route vs Vehicle bias differentiation.
 */

import { SafetyPatternItem, SafetyHotspot } from '../types';

export class SafetyPatternEngine {
  /**
   * Identifies recurring safety patterns across the fleet
   */
  public static getDetectedPatterns(): SafetyPatternItem[] {
    return [
      {
        id: 'pat-1',
        patternType: 'REPEATED_HARSH_BRAKING',
        title: 'Klaster Pengereman Mendadak di Gerbang Tol & Simpang Keluar',
        description: 'Pola deselerasi tajam terdeteksi berulang pada 12 pengemudi berbeda saat mendekati antrean Gardu Tol Cikarang Utama.',
        scope: 'ROUTE_SPECIFIC',
        observedCount: 38,
        confidence: 'HIGH',
        evidenceDetails: [
          '38 event pengereman keras tercatat dalam radius 1.5 km',
          'Melibatkan 12 driver berbeda pada waktu kedatangan puncak (07:00-09:00 dan 17:00-19:00)',
          'Analisis AI: Menunjukkan faktor kepadatan geometris rute antrean, bukan anomali individu driver.',
        ],
        suggestedIntervention: 'Sesuaikan target kecepatan navigasi pada geofence mendekati gerbang tol (maks 40 km/h).',
      },
      {
        id: 'pat-2',
        patternType: 'FATIGUE_PEAK',
        title: 'Lonjakan Indikator Kelelahan pada Shift Tengah Malam (00:00 - 04:00)',
        description: 'Tingkat peringatan fatigue telemetri meningkat 3.4x lipat pada rute antar-provinsi di jam dini hari.',
        scope: 'SYSTEM_WIDE',
        observedCount: 29,
        confidence: 'HIGH',
        evidenceDetails: [
          '72% peringatan kelopak mata berat & deviasi lajur terjadi antara pukul 00:30 hingga 03:45 WIB',
          'Sebagian besar armada belum mengambil jeda istirahat 30 menit setelah 3.5 jam tempuh',
        ],
        suggestedIntervention: 'Terapkan rekomendasi rest-stop wajib di KM 207 dan KM 379 dengan konfirmasi dispatch.',
      },
      {
        id: 'pat-3',
        patternType: 'REPEATED_OVERSPEED',
        title: 'Pola Agresivitas Kecepatan Khusus Pengemudi Tertentu',
        description: 'Pengemudi Rudi Hartono (drv-04) mencatat 26 kejadian overspeed pada segmen jalan datar maupun turunan.',
        scope: 'DRIVER_SPECIFIC',
        observedCount: 26,
        confidence: 'HIGH',
        evidenceDetails: [
          'Terjadi di berbagai rute berbeda (Jakarta-Semarang dan Jakarta-Cirebon)',
          'Pengemudi lain pada rute dan kendaraan yang sama tidak menunjukkan lonjakan overspeed',
          'Analisis AI: Merupakan pola kebiasaan mengemudi individual yang memerlukan program coaching.',
        ],
        suggestedIntervention: 'Jadwalkan program coaching 1-on-1 dengan Safety Officer terkait Eco & Defensive Driving.',
      },
      {
        id: 'pat-4',
        patternType: 'VEHICLE_BRAKE_DECAY',
        title: 'Pola Penurunan Respons Pengereman pada Kendaraan B 9811 ULM',
        description: 'Jarak henti terukur meningkat rata-rata 18% lebih panjang dibanding armada sejenis pada muatan yang sama.',
        scope: 'VEHICLE_SPECIFIC',
        observedCount: 14,
        confidence: 'MEDIUM',
        evidenceDetails: [
          'Teramati pada 3 driver berbeda yang mengoperasikan unit B 9811 ULM',
          'Pemeriksaan sensor tekanan hidrolik rem menunjukkan degradasi tekanan puncak',
        ],
        suggestedIntervention: 'Rujuk kendaraan ke bengkel untuk bleeding fluida rem dan inspeksi tromol roda belakang.',
      },
    ];
  }

  /**
   * Geospatial Safety Hotspots (Blackspots)
   */
  public static getSafetyHotspots(): SafetyHotspot[] {
    return [
      {
        id: 'hot-1',
        name: 'Tol Cipularang KM 90 - 93 (Turunan & Tikungan Tajam)',
        locationName: 'Purwakarta, Jawa Barat',
        latitude: -6.6582,
        longitude: 107.4125,
        radiusMeters: 1200,
        incidentCount: 9,
        accidentCount: 2,
        nearMissCount: 16,
        primaryPattern: 'Pengereman mendadak di turunan licin saat hujan',
        riskLevel: 'CRITICAL',
        affectedRoutes: ['rt-101 (Jakarta - Bandung Express)'],
        recommendedMitigation: 'Pasang geofence batas kecepatan otomatis 50 km/h dan peringatan audio in-cab.',
      },
      {
        id: 'hot-2',
        name: 'Simpang Susun Cikunir KM 10 Tol Jakarta-Cikampek',
        locationName: 'Bekasi Barat, Jawa Barat',
        latitude: -6.2514,
        longitude: 106.9631,
        radiusMeters: 800,
        incidentCount: 14,
        accidentCount: 1,
        nearMissCount: 21,
        primaryPattern: 'Manuver perpindahan lajur mendadak & perlambatan antrean',
        riskLevel: 'HIGH',
        affectedRoutes: ['rt-101', 'rt-102', 'rt-103'],
        recommendedMitigation: 'Imbauan menjaga jarak iring minimal 3 detik sebelum titik percabangan flyover.',
      },
      {
        id: 'hot-3',
        name: 'Tol Batang - Semarang KM 368 (Zona Titik Lelah Pengemudi)',
        locationName: 'Batang, Jawa Tengah',
        latitude: -6.9812,
        longitude: 109.8921,
        radiusMeters: 2500,
        incidentCount: 7,
        accidentCount: 1,
        nearMissCount: 11,
        primaryPattern: 'Microsleep dan deviasi lajur di jalan lurus monoton',
        riskLevel: 'HIGH',
        affectedRoutes: ['rt-103 (Jakarta - Surabaya Arterial)'],
        recommendedMitigation: 'Trigger pop-up dispatch rekomendasi rest area wajib KM 379A bagi armada malam.',
      },
      {
        id: 'hot-4',
        name: 'Gerbang Masuk Kawasan Industri KIIC Karawang Barat',
        locationName: 'Karawang Barat, Jawa Barat',
        latitude: -6.3211,
        longitude: 107.2842,
        radiusMeters: 600,
        incidentCount: 5,
        accidentCount: 0,
        nearMissCount: 8,
        primaryPattern: 'Blind-spot manuver belok kiri saat lalu lintas motor padat',
        riskLevel: 'MODERATE',
        affectedRoutes: ['rt-102 (Cikarang Loop)'],
        recommendedMitigation: 'Pemberitahuan khusus periksa spion cembung samping kiri saat jam sibuk pabrik.',
      },
    ];
  }

  /**
   * Time-based safety pattern distribution (24 hours)
   */
  public static getTimeBasedSafetyDistribution(): { hour: number; label: string; incidentRate: number; riskIndex: number }[] {
    return [
      { hour: 0, label: '00:00', incidentRate: 3.8, riskIndex: 78 },
      { hour: 2, label: '02:00', incidentRate: 5.2, riskIndex: 92 },
      { hour: 4, label: '04:00', incidentRate: 4.1, riskIndex: 82 },
      { hour: 6, label: '06:00', incidentRate: 1.8, riskIndex: 35 },
      { hour: 8, label: '08:00', incidentRate: 2.9, riskIndex: 55 },
      { hour: 10, label: '10:00', incidentRate: 1.5, riskIndex: 28 },
      { hour: 12, label: '12:00', incidentRate: 1.2, riskIndex: 22 },
      { hour: 14, label: '14:00', incidentRate: 2.6, riskIndex: 48 },
      { hour: 16, label: '16:00', incidentRate: 3.4, riskIndex: 62 },
      { hour: 18, label: '18:00', incidentRate: 3.1, riskIndex: 58 },
      { hour: 20, label: '20:00', incidentRate: 2.8, riskIndex: 52 },
      { hour: 22, label: '22:00', incidentRate: 4.6, riskIndex: 85 },
    ];
  }
}
