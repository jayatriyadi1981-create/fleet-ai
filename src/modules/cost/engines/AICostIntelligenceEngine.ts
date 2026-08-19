/**
 * Fleet Intelligence Smart AI - AI Cost Intelligence & Root Cause Engine
 * PROMPT 37 - Multi-factor Contributor Analysis & Saving Opportunity Quantification
 */

import { AICostInsight, CostSavingOpportunity } from '../types';

export class AICostIntelligenceEngine {
  /**
   * Generate prioritized AI Cost Insights
   */
  public static generateInsights(): AICostInsight[] {
    return [
      {
        id: 'ai_cost_ins_01',
        title: 'Pemborosan BBM Akibat Idling Berlebih di Hub Cikarang & Priok',
        severity: 'CRITICAL',
        headline: 'Biaya BBM Idling Menyumbang Rp 34,2 Jt/Bulan (18,6% dari Total Pengeluaran BBM Armada)',
        category: 'FUEL',
        mainContributors: [
          {
            factor: 'Idling Saat Antrean Muat di Depo',
            percentageContribution: 58,
            amountIdr: 19836000,
            description: 'Mesin menyala rata-rata 48 menit per trip saat menunggu giliran bongkar muat di Tanjung Priok.',
          },
          {
            factor: 'AC Menyala Saat Istirahat Pengemudi',
            percentageContribution: 26,
            amountIdr: 8892000,
            description: 'Driver menyalakan mesin truk 1.5 - 2 jam di rest area KM 57 hanya untuk pendingin kabin.',
          },
          {
            factor: 'Pemanasan Mesin Berlebih (Warming Up)',
            percentageContribution: 16,
            amountIdr: 5472000,
            description: 'Durasi pemanasan mesin pagi hari melebihi 25 menit (standar OEM cukup 5-7 menit).',
          },
        ],
        rootCauses: [
          'Kurangnya fasilitas rest area berpendingin udara khusus driver di terminal depo.',
          'Belum diterapkannya parameter auto-cutoff idling engine pada firmware GPS telematika (> 15 menit).',
          'Ketiadaan sistem antrean slot digital (dock scheduling) di gerbang gudang penerima.',
        ],
        recommendations: [
          {
            id: 'rec_idle_01',
            priority: 'HIGH',
            action: 'Aktifkan aturan AI Automation: Kirim peringatan buzzer kabin & WhatsApp bila idling > 10 menit.',
            potentialSavingMonthlyIdr: 18500000,
            difficulty: 'EASY',
            impact: 'HIGH',
            calculationBasis: 'Reduksi 54% durasi idling truk trailer di area depo (estimasi 1.370 liter solar/bulan).',
            targetModule: 'automation',
          },
          {
            id: 'rec_idle_02',
            priority: 'MEDIUM',
            action: 'Integrasikan API Dock Appointment System dengan jadwal keberangkatan armada Tanjung Priok.',
            potentialSavingMonthlyIdr: 9200000,
            difficulty: 'MODERATE',
            impact: 'MEDIUM',
            calculationBasis: 'Mengurangi waktu tunggu antrean gerbang depo rata-rata 25 menit per trip.',
            targetModule: 'trip_management',
          },
        ],
        supportingData: {
          totalIdleHours: 412,
          idleFuelBurnRateLPerHour: 3.2,
          solarPricePerL: 13500,
          affectedVehiclesCount: 28,
        },
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ai_cost_ins_02',
        title: 'Lonjakan Biaya Perbaikan Korektif Darurat vs Preventif',
        severity: 'HIGH',
        headline: 'Biaya Perbaikan Mendadak 2.8x Lebih Mahal Dibandingkan Servis Terjadwal',
        category: 'MAINTENANCE',
        mainContributors: [
          {
            factor: 'Kerusakan Turbocharger & Kopling Aus',
            percentageContribution: 45,
            amountIdr: 22500000,
            description: 'Terlambat servis berkala oli & filter oli menyebabkan keausan turbo pada 4 unit Hino 500.',
          },
          {
            factor: 'Biaya Derek Tol & On-site Mechanic Dispatch',
            percentageContribution: 35,
            amountIdr: 17500000,
            description: 'Truk mogok di ruas Tol Cipali mengakibatkan biaya derek darurat dan denda keterlambatan kargo.',
          },
          {
            factor: 'Suku Cadang Non-OEM / Penggantian Cepat',
            percentageContribution: 20,
            amountIdr: 10000000,
            description: 'Pembelian part eceran mendadak tanpa diskon purchase order volume.',
          },
        ],
        rootCauses: [
          'Kepatuhan jadwal PM (Preventive Maintenance) hanya 68% karena kendaraan dipaksakan jalan demi target trip.',
          'Tidak adanya monitoring peringatan dini diagnostic trouble code (DTC) dari port OBD-II telematika.',
        ],
        recommendations: [
          {
            id: 'rec_maint_01',
            priority: 'HIGH',
            action: 'Terapkan kebijakan "Grounding Otomatis": Blokir pembuatan surat jalan jika odometer melewati batas servis > 500 km.',
            potentialSavingMonthlyIdr: 24000000,
            difficulty: 'EASY',
            impact: 'HIGH',
            calculationBasis: 'Menghindari 3 kasus breakdown berat di jalan per kuartal.',
            targetModule: 'maintenance',
          },
        ],
        supportingData: {
          correctiveCostMonthlyIdr: 58000000,
          preventiveCostMonthlyIdr: 21000000,
          overdueVehiclesCount: 8,
        },
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ai_cost_ins_03',
        title: 'Variansi Biaya Tarif Tol Rute Jakarta - Surabaya',
        severity: 'MEDIUM',
        headline: 'Pengeluaran Tol Mengalami Selisih Rp 8,4 Jt Akibat Rute Non-Optimal di Segmen Pantura',
        category: 'TOLL',
        mainContributors: [
          {
            factor: 'Keluar-Masuk Gerbang Tol Tambahan',
            percentageContribution: 64,
            amountIdr: 5376000,
            description: 'Pengemudi keluar tol untuk mencari makan atau menghindari antrean timbangan kargo.',
          },
          {
            factor: 'Penyesuaian Tarif Golongan Truk Berbeda',
            percentageContribution: 36,
            amountIdr: 3024000,
            description: 'Kesalahan tapping kartu e-Toll golongan IV pada gardu otomatis yang mendeteksi gandar ganda.',
          },
        ],
        rootCauses: [
          'Belum diterapkannya rekomendasi koridor jalan dinamis berbasis tarif tol terintegrasi GPS.',
        ],
        recommendations: [
          {
            id: 'rec_toll_01',
            priority: 'MEDIUM',
            action: 'Aktifkan geofence koridor rute tol dengan toleransi gerbang keluar yang telah ditentukan.',
            potentialSavingMonthlyIdr: 6500000,
            difficulty: 'EASY',
            impact: 'MEDIUM',
            calculationBasis: 'Menghilangkan biaya tapping tol redundan di 6 rute reguler.',
            targetModule: 'route_intelligence',
          },
        ],
        supportingData: {
          totalTollCostIdr: 68400000,
          discrepantTripsCount: 22,
        },
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Calculate standard Cost Saving Opportunities
   */
  public static calculateSavingOpportunities(): CostSavingOpportunity[] {
    return [
      {
        id: 'opp_idle_01',
        title: 'Program Reduksi Idling Mesin Armada Truk (Target 35%)',
        category: 'IDLE_REDUCTION',
        categoryLabel: 'Reduksi Idling BBM',
        currentCostMonthlyIdr: 34200000,
        projectedCostMonthlyIdr: 22230000,
        monthlySavingIdr: 11970000,
        annualSavingIdr: 143640000,
        difficulty: 'EASY',
        priority: 'HIGH',
        assumptions: {
          currentIdleHours: 412,
          targetIdleReductionPercent: 35,
          fuelPricePerLiter: 13500,
          estimatedLitersSaved: 886,
          description: 'Membatasi idling maksimum 10 menit di depo dan area bongkar muat logistik.',
        },
      },
      {
        id: 'opp_pm_02',
        title: 'Konversi Servis Breakdown ke Preventive Maintenance Terjadwal',
        category: 'PREVENTIVE_MAINTENANCE',
        categoryLabel: 'Pemeliharaan Preventif',
        currentCostMonthlyIdr: 79000000,
        projectedCostMonthlyIdr: 58000000,
        monthlySavingIdr: 21000000,
        annualSavingIdr: 252000000,
        difficulty: 'MODERATE',
        priority: 'HIGH',
        assumptions: {
          unplannedMaintenanceCount: 7,
          description: 'Mencegah kerusakan komponen vital transmisi dan turbo lewat servis berkala tepat waktu.',
        },
      },
      {
        id: 'opp_route_03',
        title: 'Optimasi Rute Dynamic & Multi-drop Dispatching',
        category: 'ROUTE_OPTIMIZATION',
        categoryLabel: 'Optimasi Rute',
        currentCostMonthlyIdr: 145000000,
        projectedCostMonthlyIdr: 136300000,
        monthlySavingIdr: 8700000,
        annualSavingIdr: 104400000,
        difficulty: 'MODERATE',
        priority: 'MEDIUM',
        assumptions: {
          description: 'Pemanfaatan AI Route Intelligence untuk memangkas 6% jarak tempuh kosong (deadhead miles).',
        },
      },
      {
        id: 'opp_driver_04',
        title: 'Insentif Eco-Driving & Reduksi Harsh Acceleration / Braking',
        category: 'DRIVER_BEHAVIOR',
        categoryLabel: 'Perilaku Pengemudi',
        currentCostMonthlyIdr: 184000000,
        projectedCostMonthlyIdr: 176640000,
        monthlySavingIdr: 7360000,
        annualSavingIdr: 88320000,
        difficulty: 'MODERATE',
        priority: 'MEDIUM',
        assumptions: {
          description: 'Peningkatan efisiensi konsumsi bahan bakar rata-rata 4% melalui coaching pengemudi agresif.',
        },
      },
    ];
  }
}
