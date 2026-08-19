/**
 * Fleet Intelligence Smart AI - Predictive Maintenance AI Engine
 * PROMPT 25 - Deep Learning & Telematics Predictive Reasoning
 */

import { AIMaintenanceInsight, VehicleHealth, Part } from '../types';
import { MOCK_AI_INSIGHTS, MOCK_PARTS } from '../data/mockMaintenanceData';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
  highlightData?: any;
}

export class AIMaintenanceService {
  /**
   * Evaluates Fleet Predictive Risk and returns insights
   */
  static getInsights(): AIMaintenanceInsight[] {
    return MOCK_AI_INSIGHTS;
  }

  /**
   * Generates Parts Demand Forecast for the next 30 days
   */
  static getPartDemandForecast(): {
    partId: string;
    partName: string;
    currentStock: number;
    forecastedDemand30Days: number;
    recommendedOrderQty: number;
    reason: string;
    urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  }[] {
    return [
      {
        partId: 'part-01',
        partName: 'Brake Shoe Heavy Duty Set',
        currentStock: 4,
        forecastedDemand30Days: 14,
        recommendedOrderQty: 12,
        reason: '3 unit armada (B 9301 KLP, B 9488 UIK, B 9778 ZXC) terprediksi memerlukan servis rem dalam 14 hari ke depan.',
        urgency: 'HIGH',
      },
      {
        partId: 'part-05',
        partName: 'Aki GS Astra N120 12V 120Ah HD',
        currentStock: 0,
        forecastedDemand30Days: 4,
        recommendedOrderQty: 6,
        reason: 'Stok saat ini HABIS (0). Terdapat 2 unit armada dengan indikasi voltase baterai di bawah 24.5V.',
        urgency: 'HIGH',
      },
      {
        partId: 'part-06',
        partName: 'Dual Stage Fuel Water Separator Filter',
        currentStock: 2,
        forecastedDemand30Days: 8,
        recommendedOrderQty: 8,
        reason: 'Peningkatan konsumsi solar dan jadwal Major Service 40.000 KM di Depo Cakung.',
        urgency: 'MEDIUM',
      },
      {
        partId: 'part-02',
        partName: 'Oli Mesin Diesel SAE 15W-40 Synthetic (20L)',
        currentStock: 18,
        forecastedDemand30Days: 20,
        recommendedOrderQty: 10,
        reason: 'Jadwal Minor Service 10.000 KM terjadwal untuk 4 armada dalam 30 hari ke depan.',
        urgency: 'LOW',
      },
    ];
  }

  /**
   * Answers contextual fleet maintenance questions (AI Copilot)
   */
  static askCopilot(query: string, vehicles: VehicleHealth[]): string {
    const q = query.toLowerCase();

    if (q.includes('mahal') || q.includes('biaya tertinggi') || q.includes('cost')) {
      const topVeh = [...vehicles].sort((a, b) => b.maintenanceCostIdr - a.maintenanceCostIdr)[0];
      return `Berdasarkan data sistem telematika dan finance per Agustus 2026, kendaraan dengan biaya maintenance tertinggi adalah **${topVeh.vehiclePlate} (${topVeh.brand} ${topVeh.model})** dengan total biaya perbaikan mencapai **Rp ${topVeh.maintenanceCostIdr.toLocaleString('id-ID')}** (Rp ${topVeh.costPerKm?.toLocaleString('id-ID')}/KM). Lonjakan biaya ini terutama disebabkan oleh penggantian suku cadang pengereman berulang dan perbaikan kelistrikan.`;
    }

    if (q.includes('overdue') || q.includes('jatuh tempo') || q.includes('telat')) {
      const overdueVeh = vehicles.filter((v) => v.status === 'CRITICAL' || v.healthScore < 60);
      return `Terdapat **${overdueVeh.length} unit kendaraan** yang saat ini berada dalam status **Overdue / Kritis**, dengan unit paling mendesak adalah **B 9301 KLP** (Servis 40.000 KM terlambat 1.450 KM / 25 hari). Disarankan untuk segera mengunci ketersediaan unit dan menerbitkan Work Order sebelum terjadi insiden keselamatan di jalan.`;
    }

    if (q.includes('risiko') || q.includes('berisiko') || q.includes('kritis') || q.includes('critical')) {
      return `AI Predictive Engine mengidentifikasi **2 unit berisiko tinggi**:
1. **B 9301 KLP (Skor Kesehatan: 48 - CRITICAL)**: Terdeteksi pola kerusakan rem berulang 3x dalam 60 hari, voltase baterai drop ke 24.1V, dan lonjakan konsumsi BBM +18%.
2. **B 9778 ZXC (Skor Kesehatan: 62 - AT RISK)**: Terdeteksi lonjakan temperatur transmisi (DTC P0700) dan downtime 22 jam pada rute Pantura.`;
    }

    if (q.includes('spare part') || q.includes('part') || q.includes('stok') || q.includes('habis')) {
      return `Analisis stok & perkiraan suku cadang 30 hari ke depan:
- **Aki GS Astra N120 120Ah**: Status **OUT OF STOCK (0 Unit)**. Segera restock minimal 6 unit.
- **Brake Shoe Heavy Duty**: Status **LOW STOCK (Tersisa 4 Set)**, sedangkan estimasi kebutuhan 14 set.
- **Dual Stage Fuel Filter**: Status **LOW STOCK (Tersisa 2 Unit)**, estimasi kebutuhan 8 unit.`;
    }

    if (q.includes('workshop') || q.includes('bengkel') || q.includes('downtime')) {
      return `Workshop dengan downtime tertinggi adalah **PT Mandiri Diesel Auto (Tangerang)** dengan rata-rata durasi perbaikan **6.8 jam/unit** (SLA Status: AT RISK), sedangkan **Bengkel Pusat Cakung Fleet Hub** mencatat performa terbaik dengan rata-rata **4.2 jam/unit** dan tingkat keberhasilan perbaikan pertama (First-Time Fix Rate) 96%.`;
    }

    if (q.includes('bbm') || q.includes('fuel') || q.includes('boros')) {
      return `AI mendeteksi korelasi kuat antara kenaikan konsumsi BBM (+18%) pada armada **B 9301 KLP** dengan masalah pengereman (brake drag / kampas macet pada tromol kiri belakang). Perbaikan sistem rem diproyeksikan akan memulihkan efisiensi bahan bakar ke angka normal 1:3.2 km/L.`;
    }

    return `Berdasarkan ringkasan AI Maintenance Fleet Intelijen:
- **Kesehatan Rata-rata Armada**: **92% (18 Sehat, 4 Perhatian, 2 Kritis)**.
- **Tindakan Prioritas**:
  1. Segera lakukan inspeksi mendalam sistem pengereman armada **B 9301 KLP**.
  2. Terbitkan Purchase Order pengadaan suku cadang **Aki N120** dan **Brake Shoe HD**.
  3. Jadwalkan servis preventif untuk **B 9488 UIK** yang jatuh tempo dalam 3 hari.`;
  }
}
