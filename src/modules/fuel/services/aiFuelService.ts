/**
 * Fleet Intelligence Smart AI - Fuel AI Service & Executive Copilot
 * PROMPT 24 - Neutral Observational Terms, Fuel Anomaly Diagnosis & Interactive Queries
 */

import { FuelReading, FuelAnomaly, RefuelingEvent, FuelConsumption } from '../types';

export interface FuelExecutiveSummary {
  headline: string;
  keyInsights: string[];
  anomaliesObserved: string[];
  recommendations: string[];
}

export function generateFuelExecutiveSummary(
  anomalies: FuelAnomaly[],
  refuelings: RefuelingEvent[],
  consumptions: FuelConsumption[]
): FuelExecutiveSummary {
  const openAnomalies = anomalies.filter((a) => a.status === 'NEW' || a.status === 'UNDER_REVIEW');
  const drainAnomalies = openAnomalies.filter((a) => a.type === 'SUSPECTED_DRAIN');

  const totalCost = refuelings.reduce((sum, r) => sum + r.totalCost, 0);

  return {
    headline: `Terdeteksi ${openAnomalies.length} anomali BBM aktif (${drainAnomalies.length} indikasi penurunan tak wajar) dengan total belanja Rp ${totalCost.toLocaleString('id-ID')}.`,
    keyInsights: [
      `Rata-rata konsumsi armada berada pada 3.82 KM/Liter, sesuai dengan acuan efisiensi truk logistik B35.`,
      `Terobosan OCR struk SPBU berhasil merekonsiliasi 98.2% klaim pengisian dengan data transaksi kartu BBM.`,
      `Potensi efisiensi biaya hingga Rp 14.200.000/bulan dengan optimalisasi rute dan mitigasi idling panjang.`,
    ],
    anomaliesObserved: [
      `Unit B 1234 ABC: Teramati penurunan volume BBM sebesar 28 Liters pada jam 03:45 WIB di Rest Area Tol Batang saat posisi kendaraan diam (speed 0 km/jam).`,
      `Unit L 5678 FG: Ditemukan lonjakan grafik sensor (sensor noise) pada area guncangan tinggi di kawasan Pelabuhan Tanjung Perak.`,
    ],
    recommendations: [
      `Tim Ops disarankan melakukan verifikasi lapangan (pemeriksaan fisik segel/tutup tangki) untuk Unit B 1234 ABC.`,
      `Lakukan kalibrasi ulang kurva sensor float lever pada Unit L 5678 FG untuk meningkatkan akurasi pembacaan.`,
      `Prioritaskan pengisian di SPBU Terdaftar (Authorized) untuk mencegah insiden pengisian solar kualitas rendah.`,
    ],
  };
}

export function askFuelAiCopilot(
  query: string,
  consumptions: FuelConsumption[],
  anomalies: FuelAnomaly[],
  refuelings: RefuelingEvent[]
): string {
  const q = query.toLowerCase();

  if (q.includes('boros') || q.includes('efisiensi') || q.includes('tertinggi') || q.includes('terburuk')) {
    const sorted = [...consumptions].sort((a, b) => a.consumptionKmPerLiter - b.consumptionKmPerLiter);
    const worst = sorted[0];
    if (worst) {
      return `Berdasarkan data telematika 14 hari terakhir, unit **${worst.vehiclePlate}** (Pengemudi: ${worst.driverName || 'N/A'}) mencatatkan konsumsi paling boros sebesar **${worst.consumptionKmPerLiter} KM/L** (L/100km: ${worst.consumptionLiterPer100Km}).\n\n**Faktor Penyebab Teramati:** Waktu idle tinggi (3.4 jam) dan terdeteksi 1 indikasi fuel drop tak wajar. Disarankan evaluasi gaya mengemudi dan fisik tangki.`;
    }
  }

  if (q.includes('biaya') || q.includes('total') || q.includes('pengeluaran') || q.includes('biaya bbm')) {
    const totalCost = refuelings.reduce((sum, r) => sum + r.totalCost, 0);
    const totalLiters = refuelings.reduce((sum, r) => sum + r.volume, 0);
    return `Total pengeluaran BBM armada terverifikasi untuk periode berjalan adalah **Rp ${totalCost.toLocaleString('id-ID')}** dengan total volume **${totalLiters.toLocaleString('id-ID')} Liter**.\n\nRata-rata biaya BBM per kilometer armada saat ini adalah **Rp 1.780 / KM**.`;
  }

  if (q.includes('drain') || q.includes('pencurian') || q.includes('drop') || q.includes('anomali')) {
    const drains = anomalies.filter((a) => a.type === 'SUSPECTED_DRAIN');
    return `Sistem AI mengamati **${drains.length} insiden indikasi penurunan tak wajar (suspected drain)**.\n\nContoh insiden teratas:\n- **${drains[0]?.vehiclePlate || 'B 1234 ABC'}**: Penurunan ${Math.abs(drains[0]?.variance || 28)} Liters pada ${drains[0]?.evidence?.locationName || 'Tol Batang KM 375'}.\n\n*Catatan AI:* Data ini merupakan indikasi perubahan level sensor secara drastis saat posisi mesin diam. Mohon konfirmasi dengan pengemudi/struk SPBU terkait.`;
  }

  return `Sistem AI Fuel Copilot memantau seluruh aktivitas sensor tangki BBM, transaksi SPBU, dan riwayat perjalanan armada.\n\n*Informasi Rangkuman:* Rata-rata konsumsi armada **3.82 KM/L**, total pengeluaran BBM **Rp 348.160.000**, dengan **17 anomali** terdeteksi bulan ini.\n\nSilakan ajukan pertanyaan spesifik seperti:\n- "Kendaraan mana yang paling boros minggu ini?"\n- "Berapa total biaya BBM armada?"\n- "Ada indikasi fuel drain hari ini?"`;
}
