/**
 * Fleet Intelligence Smart AI - AI Fuel Recommendation Engine
 * Formulates evidence-based, actionable, and non-punitive fuel optimization plans
 * with estimated liters and cost savings.
 */

import { AIFuelRecommendationItem } from '../types';

export class AIFuelRecommendationEngine {
  /**
   * Generates prioritized proactive recommendations for the fleet
   */
  public generateRecommendations(): AIFuelRecommendationItem[] {
    return [
      {
        id: 'frec-01',
        title: 'Pengurangan Durasi Mesin Hidup Diam (Idling Reduction) di Depo Tanjung Priok',
        category: 'IDLE_REDUCTION',
        priority: 'HIGH',
        vehicleId: 'veh-001',
        plateNumber: 'B 9876 XYZ',
        driverId: 'drv-01',
        driverName: 'Ahmad Sudrajat',
        recommendation: 'Terapkan kebijakan auto engine cut-off atau matikan mesin saat antrean gate in melebihi 10 menit di Terminal JICT.',
        reason: 'Waktu idle mencapai rata-rata 77 menit per trip, menghabiskan ~162 Liter solar tanpa pertambahan kilometer operasional.',
        evidence: [
          'Total durasi idle 540 menit tercatat pada 42 perjalanan terakhir',
          'Konsumsi solar saat idle konstan ~1.8 Liter/jam pada truk 24T',
          'Peningkatan konsumsi BBM kendaraan +18.6% di atas baseline',
        ],
        potentialMonthlySavingsLiters: 180,
        potentialMonthlySavingsIdr: 1224000,
        actionItems: [
          'Sosialisasikan SOP matikan mesin saat waktu antrean > 5 menit ke driver',
          'Aktifkan peringatan alert buzzer buzzer telematika kabin jika idle > 10 menit',
          'Koordinasi jadwal slot kedatangan armada dengan gate operator Tanjung Priok',
        ],
      },
      {
        id: 'frec-02',
        title: 'Servis Pembersihan Filter Solar & Kalibrasi Nosel Injektor Unit B 9555 TTT',
        category: 'MAINTENANCE_TRIGGER',
        priority: 'CRITICAL',
        vehicleId: 'veh-003',
        plateNumber: 'B 9555 TTT',
        recommendation: 'Jadwalkan Work Order perawatan ruang bakar dan penggantian filter solar primer/sekunder yang telah melewati batas 10.000 km.',
        reason: 'Penyimpangan konsumsi mencapai +30.7% dan emisi gas buang pekat akibat penyumbatan injektor bahan bakar.',
        evidence: [
          'Konsumsi saat ini 23.8 L/100km (baseline 18.2 L/100km)',
          'Riwayat servis filter terakhir: 11.200 km yang lalu (Overdue)',
          'Terdeteksi lonjakan konsumsi saat tanjakan Tol Cipularang',
        ],
        potentialMonthlySavingsLiters: 145,
        potentialMonthlySavingsIdr: 986000,
        actionItems: [
          'Rilis Work Order perawatan berkala ke Bengkel Rekanan Cikarang',
          'Lakukan uji emisi opacity dan flushing saluran bahan bakar solar B35',
        ],
      },
      {
        id: 'frec-03',
        title: 'Pelatihan Eco-Driving & Manajemen Akselerasi (Driver Coaching)',
        category: 'ACCELERATION_COACHING',
        priority: 'MEDIUM',
        driverId: 'drv-03',
        driverName: 'Eko Prasetyo',
        plateNumber: 'B 9555 TTT',
        recommendation: 'Sediakan sesi coaching teknik akselerasi halus (progressive throttle) dan antisipasi momentum pengereman.',
        reason: 'Terdeteksi 18 kejadian sentakan gas mendadak saat start awal di persimpangan jalan arteri Pantura.',
        evidence: [
          '18x sentakan gas mendadak (> 3.5 m/s²) tercatat pada telemetri akselerometer',
          'Pemborosan BBM akibat akselerasi agresif diperkirakan mencapai 12-15% pada start stop',
        ],
        potentialMonthlySavingsLiters: 95,
        potentialMonthlySavingsIdr: 646000,
        actionItems: [
          'Jadwalkan sesi coaching non-punitif 15 menit bersama Driver Safety Trainer',
          'Pantau progres mingguan skor akselerasi pada modul AI Driver Intelligence',
        ],
      },
      {
        id: 'frec-04',
        title: 'Optimalisasi Pemilihan Jalur Tol vs Arteri pada Rute Karawang - Cirebon',
        category: 'ROUTE_REPLANNING',
        priority: 'MEDIUM',
        routeId: 'rt-04',
        routeName: 'Rute Distribusi Pantura: Karawang - Cirebon Arteri',
        recommendation: 'Alihkan perjalanan waktu sibuk (07:00 - 10:00 & 16:00 - 19:00) ke Tol Cipali untuk menghindari kemacetan pasar tumpah.',
        reason: 'Rute arteri mengalami stop-and-go konstan dengan rata-rata 42 menit idle dan konsumsi BBM 11.8% lebih boros.',
        evidence: [
          'Rata-rata konsumsi jalur arteri 27.4 L/100km vs jalur Tol 24.8 L/100km',
          'Waktu tempuh arteri 2.1 jam lebih lambat akibat titik kemacetan pasar',
        ],
        potentialMonthlySavingsLiters: 120,
        potentialMonthlySavingsIdr: 816000,
        actionItems: [
          'Konfigurasi rute rekomendasi alternatif pada modul Route Management',
          'Hitung trade-off biaya tarif tol vs penghematan solar dan depresiasi ban',
        ],
      },
      {
        id: 'frec-05',
        title: 'Investigasi Anomali Penurunan Level BBM Mesin Mati di Cibitung',
        category: 'SENSOR_CALIBRATION',
        priority: 'CRITICAL',
        vehicleId: 'veh-001',
        plateNumber: 'B 9876 XYZ',
        recommendation: 'Lakukan klarifikasi segera atas kejadian penurunan 84 Liter solar saat mesin mati pada tanggal 15 Agustus 2026 pukul 02:14.',
        reason: 'Penurunan level BBM drastis di luar area SPBU tanpa catatan transaksi pengisian/pengeluaran resmi.',
        evidence: [
          'Kejadian anomali fanom-01 dengan skor risiko 88/100 (CRITICAL)',
          'Kondisi stasioner dan Ignition OFF selama 12 menit',
        ],
        potentialMonthlySavingsLiters: 84,
        potentialMonthlySavingsIdr: 571200,
        actionItems: [
          'Buka investigasi formal pada modul Fuel Anomaly Review',
          'Periksa rekaman CCTV depo/dashcam dan mintai konfirmasi pengemudi',
          'Periksa fisik tutup tangki solar apakah terdapat bekas pembongkaran paksa',
        ],
      },
    ];
  }
}

export const aiFuelRecommendationEngine = new AIFuelRecommendationEngine();
