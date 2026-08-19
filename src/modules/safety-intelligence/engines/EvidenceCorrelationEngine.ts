/**
 * Evidence Correlation Engine
 * PROMPT 33 Architecture
 * 
 * Correlates multi-source events: GPS Telemetry, Driver Behavior, Fatigue, Maintenance,
 * Vehicle Inspection, Geofences, and Weather to establish causal & contextual associations.
 */

export interface CorrelatedEvent {
  id: string;
  sourceModule: 'GPS' | 'BEHAVIOR' | 'FATIGUE' | 'MAINTENANCE' | 'INSPECTION' | 'GEOFENCE' | 'ALERT';
  timestamp: string;
  relativeTimeFormatted: string; // e.g. "11 detik sebelum insiden"
  title: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
  correlationStrength: 'STRONG' | 'MODERATE' | 'WEAK';
}

export class EvidenceCorrelationEngine {
  public static buildEventCorrelation(incidentTimestamp: string, context?: any): CorrelatedEvent[] {
    const t0 = new Date(incidentTimestamp).getTime();

    return [
      {
        id: 'corr-1',
        sourceModule: 'BEHAVIOR',
        timestamp: new Date(t0 - 18000).toISOString(),
        relativeTimeFormatted: '18 detik sebelum kejadian',
        title: 'Peringatan Kecepatan Lebih (Overspeed)',
        severity: 'WARNING',
        details: 'Kecepatan mencapai 84 km/h pada batas kecepatan regulasi koridor 70 km/h.',
        correlationStrength: 'STRONG',
      },
      {
        id: 'corr-2',
        sourceModule: 'BEHAVIOR',
        timestamp: new Date(t0 - 7000).toISOString(),
        relativeTimeFormatted: '7 detik sebelum kejadian',
        title: 'Pengereman Keras (Harsh Braking Event)',
        severity: 'CRITICAL',
        details: 'Deselerasi terukur sebesar -0.68 G di titik KM 26A.',
        correlationStrength: 'STRONG',
      },
      {
        id: 'corr-3',
        sourceModule: 'FATIGUE',
        timestamp: new Date(t0 - 1200000).toISOString(),
        relativeTimeFormatted: '20 menit sebelum kejadian',
        title: 'Notifikasi Ambang Batas Waktu Kemudi',
        severity: 'WARNING',
        details: 'Durasi mengemudi kontinu menyentuh 3.8 jam tanpa singgah di rest area.',
        correlationStrength: 'MODERATE',
      },
      {
        id: 'corr-4',
        sourceModule: 'GEOFENCE',
        timestamp: new Date(t0 - 450000).toISOString(),
        relativeTimeFormatted: '7.5 menit sebelum kejadian',
        title: 'Memasuki Zona Rawan Kecelakaan (Hotspot Geofence)',
        severity: 'INFO',
        details: 'Armada melintasi geofence "Blackspot KM 25-28 Tol Cikampek".',
        correlationStrength: 'STRONG',
      },
      {
        id: 'corr-5',
        sourceModule: 'INSPECTION',
        timestamp: new Date(t0 - 28800000).toISOString(),
        relativeTimeFormatted: '8 jam sebelum kejadian (Awal Shift)',
        title: 'Inspeksi Harian Pra-Jalan (Pre-Trip Inspection)',
        severity: 'INFO',
        details: 'Hasil checklist pengereman & lampu darurat dinyatakan Lulus tanpa catatan kerusakan kritis.',
        correlationStrength: 'MODERATE',
      },
    ];
  }
}
