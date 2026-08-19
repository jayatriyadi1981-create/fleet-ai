/**
 * Fleet Intelligence Smart AI - AI Route Advisor Engine
 * Generates proactive recommendations, route rerouting advisories,
 * explainable trade-offs, and handles natural language dispatcher queries.
 */

import { AIRouteRecommendation, PredictionQuality } from '../types';

export class AIRouteAdvisorEngine {
  private static instance: AIRouteAdvisorEngine;

  private mockRecommendations: AIRouteRecommendation[] = [
    {
      id: 'rec-rt-001',
      category: 'TRAFFIC_REROUTE',
      title: 'Rekomendasi Pengalihan Rute Tol Elevated MBZ (Unit B 1234 XX)',
      description: 'Terdeteksi insiden kecelakaan di Tol Japek Bawah KM 14 arah Cikampek yang menimbulkan antrean 4.2 km (+22 menit delay).',
      vehicleId: 'v-b1234xx',
      plateNumber: 'B 1234 XX',
      tripId: 'trip-1024',
      tripNumber: 'TRIP-JKT-BDG-1024',
      why: 'Rute Elevated MBZ saat ini lancar (kecepatan 72 km/jam) dan menghemat estimasi 18 menit waktu tempuh.',
      evidence: [
        'Telemetri kecepatan rata-rata ruas tol bawah turun drastis ke 6 km/jam.',
        'Data traffic segment KM 14 menunjukkan status Severe Congestion.',
        'Unit kendaraan adalah Golongan I (layak melintas di jalan layang MBZ).',
      ],
      tradeOffs: 'Tidak ada rest area darurat di sepanjang jalan layang MBZ sepanjang 38 km.',
      confidence: 'HIGH',
      dataQuality: 'HIGH',
      status: 'PENDING_REVIEW',
      suggestedAction: 'Kirim notifikasi pengalihan rute ke tablet kabin pengemudi melalui In-App Dispatcher.',
      timestamp: '2026-08-16T08:30:00Z',
    },
    {
      id: 'rec-rt-002',
      category: 'MAINTENANCE_ADVISORY',
      title: 'Advisory Penugasan Rute Jarak Jauh (Unit B 9012 GH)',
      description: 'Unit memiliki indikasi Predictive Maintenance Risk High pada sistem radiator / pendingin mesin.',
      vehicleId: 'v-b9012gh',
      plateNumber: 'B 9012 GH',
      why: 'Rute Jakarta-Surabaya melintasi elevasi tol trans jawa yang membebani kerja mesin di suhu tinggi.',
      evidence: [
        'Sensor suhu coolant CAN-bus mendekati batas 104°C pada trip sebelumnya.',
        'Prakiraan kerusakan radiator dalam 7 hari ke depan (P31 Predictive Maintenance).',
      ],
      tradeOffs: 'Memerlukan penukaran unit armada (reassignment) sebelum keberangkatan pukul 10:00.',
      confidence: 'HIGH',
      dataQuality: 'HIGH',
      status: 'PENDING_REVIEW',
      suggestedAction: 'Tugaskan unit B 9012 GH untuk rute distribusi intra-kota & jadwalkan inspeksi bengkel.',
      timestamp: '2026-08-16T07:15:00Z',
    },
    {
      id: 'rec-rt-003',
      category: 'OPTIMIZATION',
      title: 'Optimasi Jam Keberangkatan Rute Reguler Cakung ➔ Bandung',
      description: 'Analisis historis 284 perjalanan menunjukkan keberangkatan pukul 05:45 menghemat 32 menit vs 07:15.',
      why: 'Menghindari akumulasi puncak kemacetan komuter pagi di simpang susun Cikunir.',
      evidence: [
        'Rata-rata waktu tempuh keberangkatan 05:45 = 135 menit.',
        'Rata-rata waktu tempuh keberangkatan 07:15 = 185 menit.',
        'Penghematan konsumsi solar rata-rata 3.4 liter per trip.',
      ],
      tradeOffs: 'Memerlukan penyesuaian jadwal shift tim loading warehouse Cakung.',
      confidence: 'HIGH',
      dataQuality: 'HIGH',
      status: 'APPROVED',
      suggestedAction: 'Ubah master jadwal manifest keberangkatan reguler menjadi pukul 05:45 WIB.',
      timestamp: '2026-08-15T16:00:00Z',
    },
    {
      id: 'rec-rt-004',
      category: 'DELIVERY_SEQUENCING',
      title: 'Optimalisasi Urutan Rute Pengiriman 4 Drop Sidoarjo (Unit W 3341 TZ)',
      description: 'AI mendeteksi penghematan 7.8 km dan pencegahan risiko time-window breach dengan memprioritaskan Drop Gudang Farmasi Waru.',
      vehicleId: 'v-w3341tz',
      plateNumber: 'W 3341 TZ',
      tripId: 'trip-1035',
      why: 'Gudang Farmasi memiliki strict time-window sebelum 10:00 WIB dan lokasi searah rute keluar tol Waru.',
      evidence: [
        'Probabilitas on-time naik dari 74% menjadi 98%.',
        'Total jarak berkurang dari 41.8 km menjadi 34.0 km.',
      ],
      tradeOffs: 'Urutan nomor order di manifest fisik perlu disesuaikan dengan e-Surat Jalan.',
      confidence: 'HIGH',
      dataQuality: 'HIGH',
      status: 'APPLIED',
      suggestedAction: 'Terapkan urutan rute teroptimasi ke rute navigasi driver.',
      timestamp: '2026-08-16T08:00:00Z',
    },
  ];

  private constructor() {}

  public static getInstance(): AIRouteAdvisorEngine {
    if (!AIRouteAdvisorEngine.instance) {
      AIRouteAdvisorEngine.instance = new AIRouteAdvisorEngine();
    }
    return AIRouteAdvisorEngine.instance;
  }

  public getAllRecommendations(): AIRouteRecommendation[] {
    return this.mockRecommendations;
  }

  public updateRecommendationStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'APPLIED'): boolean {
    const rec = this.mockRecommendations.find((r) => r.id === id);
    if (rec) {
      rec.status = status;
      return true;
    }
    return false;
  }
}

export const aiRouteAdvisorEngine = AIRouteAdvisorEngine.getInstance();
