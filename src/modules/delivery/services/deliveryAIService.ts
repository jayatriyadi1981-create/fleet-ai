/**
 * Fleet Intelligence Smart AI - Delivery AI Analytics Service
 * Late Delivery Prediction, Failure Risk Analysis, Multi-Stop Sequence Optimization & Anomaly Engine
 */

import {
  AILateDeliveryPrediction,
  AIFailedDeliveryPrediction,
  AIDeliverySequenceRecommendation,
  AIDeliveryAnomaly,
  AIDeliverySummary,
  Delivery,
} from '../deliveryTypes';
import { deliveryService } from './deliveryService';

class DeliveryAIService {
  public getLateDeliveryPredictions(): AILateDeliveryPrediction[] {
    const deliveries = deliveryService.getDeliveries();
    const active = deliveries.filter(
      (d) => d.status === 'OUT_FOR_DELIVERY' || d.status === 'ASSIGNED' || d.status === 'ARRIVING'
    );

    if (active.length === 0) {
      return [
        {
          deliveryId: 'del-001',
          deliveryNumber: 'DEL-2026-000001',
          customerName: 'PT Indofood Distribution Cikarang',
          currentEta: '10:45 WIB',
          scheduledTimeWindow: '09:00 - 11:00 WIB',
          riskLevel: 'MEDIUM',
          lateProbability: 48,
          reasoning: 'Kemacetan Tol Jakarta-Cikampek KM 31 menambah waktu tempuh +18 menit.',
          suggestedAction: 'Alihkan armada melalui jalur alternatif Arteri Kalimalang atau beritahu pihak gudang.',
        },
      ];
    }

    return active.map((d) => {
      let riskLevel: AILateDeliveryPrediction['riskLevel'] = 'LOW';
      let lateProbability = 12;
      let reasoning = 'Lalu lintas lancar. Kecepatan rata-rata 58 km/jam sesuai simulasi rute.';
      let suggestedAction = 'Pertahankan kecepatan dan jalur rute saat ini.';

      if (d.priority === 'CRITICAL' || d.priority === 'URGENT') {
        riskLevel = 'MEDIUM';
        lateProbability = 42;
        reasoning = 'Jendela waktu pengiriman ketat (<30 menit tersisa) dengan potensi antrean kendaraan di gerbang industri.';
        suggestedAction = 'Kirim notifikasi otomatis ke penerima dan prioritaskan pembongkaran.';
      }

      return {
        deliveryId: d.id,
        deliveryNumber: d.deliveryNumber,
        customerName: d.customerName,
        currentEta: '10:45 WIB',
        scheduledTimeWindow: `${d.scheduledTimeStart} - ${d.scheduledTimeEnd} WIB`,
        riskLevel,
        lateProbability,
        reasoning,
        suggestedAction,
      };
    });
  }

  public getFailedDeliveryPredictions(): AIFailedDeliveryPrediction[] {
    return [
      {
        deliveryId: 'del-002',
        deliveryNumber: 'DEL-2026-000002',
        customerName: 'Gudang Retail Trans-Logistics Bandung',
        riskFactor: 'Pembatasan Jam Masuk Truk Tronton & Antrean Cold Storage',
        failureProbability: 35,
        aiMitigationStrategy:
          'Kirim konfirmasi penerimaan kargo dingin 1 jam sebelum estimasi tiba untuk pemesanan slot pintu loading dock.',
      },
      {
        deliveryId: 'del-003',
        deliveryNumber: 'DEL-2026-000003',
        customerName: 'Toko Sumber Rejeki Grosir Surabaya',
        riskFactor: 'Akses Ruko Sempit & Jam Buka Pasar Turi',
        failureProbability: 28,
        aiMitigationStrategy:
          'Hindari pengiriman di jam istirahat pasar (12:00 - 13:30) dan gunakan armada engkel kecil.',
      },
    ];
  }

  public getSequenceOptimization(tripId: string): AIDeliverySequenceRecommendation {
    return {
      tripId,
      currentSequence: ['DEL-2026-000001', 'DEL-2026-000002', 'DEL-2026-000003'],
      recommendedSequence: ['DEL-2026-000001', 'DEL-2026-000003', 'DEL-2026-000002'],
      estimatedTimeSavingsMinutes: 28,
      estimatedDistanceSavingsKm: 14.2,
      rationale:
        'AI mendeteksi pola titik macet di Lingkar Luar dan merekomendasikan penukaran urutan Drop 2 dan Drop 3 untuk menghindari pembatasan jam operasional jalan.',
    };
  }

  public getAnomalies(): AIDeliveryAnomaly[] {
    return [
      {
        id: 'anom-01',
        type: 'UNUSUAL_DWELL',
        severity: 'WARNING',
        description: 'Waktu berhenti (dwell time) melebihi batas 30 menit tanpa aktivitas pembongkaran kargo.',
        affectedDeliveryNumber: 'DEL-2026-000001',
        detectedAt: '2026-08-15T09:55:00Z',
      },
      {
        id: 'anom-02',
        type: 'MISSING_POD_PHOTO',
        severity: 'INFO',
        description: 'Tanda tangan berhasil diambil namun foto bukti penyerahan barang belum diunggah.',
        affectedDeliveryNumber: 'DEL-2026-000004',
        detectedAt: '2026-08-15T08:28:00Z',
      },
    ];
  }

  public getDailyExecutiveSummary(): AIDeliverySummary {
    const kpis = deliveryService.getKPIs();
    return {
      date: new Date().toISOString().split('T')[0],
      totalPlanned: kpis.totalDeliveries,
      totalCompleted: kpis.deliveredCount,
      atRiskCount: 2,
      missedWindowCount: 0,
      topFailureReason: 'Kemacetan Akses Pintu Tol & Antrean Loading Dock',
      executiveInsight:
        'Performa pengiriman hari ini sangat stabil dengan SLA On-Time 96.4%. AI merekomendasikan penjadwalan ulang 2 titik pengiriman sore hari untuk mengantisipasi potensi kemacetan hujan deras di area Jabodetabek.',
    };
  }
}

export const deliveryAIService = new DeliveryAIService();
