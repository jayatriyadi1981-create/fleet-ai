/**
 * Fleet Intelligence Smart AI - Report Period Comparison Service
 * PROMPT 39 - Side-by-side Comparative Period Analytics & Variance Modeling
 */

import { ReportComparisonPeriod } from '../types';

export class ReportComparisonService {
  /**
   * Compares two periods for a given domain/metric set
   */
  public static comparePeriods(
    periodAName: string = 'Agustus 2026 (Bulan Ini)',
    periodBName: string = 'Juli 2026 (Bulan Lalu)'
  ): ReportComparisonPeriod {
    const metrics: ReportComparisonPeriod['metrics'] = [
      {
        key: 'utilization',
        label: 'Tingkat Utilisasi Armada (%)',
        valueA: 86.4,
        valueB: 81.2,
        variance: 5.2,
        variancePct: 6.4,
        trend: 'UP',
        isPositiveGood: true,
        format: 'percentage',
      },
      {
        key: 'totalCost',
        label: 'Total Biaya Operasional (IDR)',
        valueA: 642500000,
        valueB: 678200000,
        variance: -35700000,
        variancePct: -5.3,
        trend: 'DOWN',
        isPositiveGood: true,
        format: 'currency',
      },
      {
        key: 'costPerKm',
        label: 'Biaya Operasional per KM (IDR)',
        valueA: 4120,
        valueB: 4350,
        variance: -230,
        variancePct: -5.3,
        trend: 'DOWN',
        isPositiveGood: true,
        format: 'currency',
      },
      {
        key: 'fuelEfficiency',
        label: 'Efisiensi Konsumsi BBM (KM/L)',
        valueA: 3.62,
        valueB: 3.48,
        variance: 0.14,
        variancePct: 4.0,
        trend: 'UP',
        isPositiveGood: true,
        format: 'number',
      },
      {
        key: 'safetyScore',
        label: 'Indeks Skor Keselamatan Armada',
        valueA: 91.8,
        valueB: 88.5,
        variance: 3.3,
        variancePct: 3.7,
        trend: 'UP',
        isPositiveGood: true,
        format: 'number',
      },
      {
        key: 'overspeedCount',
        label: 'Total Pelanggaran Kecepatan (Kejadian)',
        valueA: 18,
        valueB: 34,
        variance: -16,
        variancePct: -47.1,
        trend: 'DOWN',
        isPositiveGood: true,
        format: 'number',
      },
      {
        key: 'downtimePct',
        label: 'Rasio Downtime Bengkel (%)',
        valueA: 4.2,
        valueB: 5.8,
        variance: -1.6,
        variancePct: -27.6,
        trend: 'DOWN',
        isPositiveGood: true,
        format: 'percentage',
      },
    ];

    const aiComparisonInsight = `Komparasi antara ${periodAName} vs ${periodBName} membuktikan peningkatan performa menyeluruh: Total Biaya Operasional (TOC) turun 5.3% (hemat Rp 35.7 Jt) bersamaan dengan naiknya utilisasi armada sebesar +5.2%. Skor keselamatan melonjak ke 91.8 didorong penurunan pelanggaran overspeed sebesar 47.1%.`;

    return {
      periodA: {
        label: periodAName,
        startDate: '2026-08-01',
        endDate: '2026-08-17',
      },
      periodB: {
        label: periodBName,
        startDate: '2026-07-01',
        endDate: '2026-07-31',
      },
      metrics,
      aiComparisonInsight,
    };
  }
}
