/**
 * Fleet Intelligence Smart AI - All Reports Catalog View
 * PROMPT 39 - Catalog of All Enterprise Fleet Reports with Domain Filters & Instant Actions
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import {
  FileText,
  Search,
  Filter,
  Play,
  Sliders,
  Clock,
  Download,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ReportDomainType, ReportSubType } from '../types';
import { ReportDataSourceService } from '../services/ReportDataSourceService';

interface ReportCatalogItem {
  id: string;
  domain: ReportDomainType;
  subType: ReportSubType;
  title: string;
  description: string;
  tags: string[];
  recommendedRole: string;
  standardFormat: string;
}

export const ALL_REPORT_CATALOG_ITEMS: ReportCatalogItem[] = [
  // Executive
  {
    id: 'CAT-EX-01',
    domain: 'EXECUTIVE',
    subType: 'EXECUTIVE_MONTHLY',
    title: 'Executive Board of Directors Monthly Briefing',
    description: 'Ringkasan strategis bulanan menyajikan TOC, utilisasi armada, efisiensi BBM, skor keselamatan, dan rekomendasi AI terverifikasi.',
    tags: ['Executive', 'C-Level', 'Finance', 'Strategic'],
    recommendedRole: 'Direksi / Owner / GM',
    standardFormat: 'PDF & Print Ready',
  },
  {
    id: 'CAT-EX-02',
    domain: 'EXECUTIVE',
    subType: 'EXECUTIVE_WEEKLY',
    title: 'Executive Weekly Operational Flash Report',
    description: 'Evaluasi mingguan dinamika operasional, deviasi anggaran, dan alert keselamatan tingkat tinggi.',
    tags: ['Executive', 'Weekly', 'Operations'],
    recommendedRole: 'VP Operations / GM',
    standardFormat: 'PDF & Excel',
  },
  {
    id: 'CAT-EX-03',
    domain: 'EXECUTIVE',
    subType: 'EXECUTIVE_COST',
    title: 'C-Level Strategic Cost & TOC Portfolio Audit',
    description: 'Audit portofolio pengeluaran armada, perbandingan antar depo, dan identifikasi inefisiensi biaya operasional.',
    tags: ['Executive', 'Finance', 'Cost'],
    recommendedRole: 'CFO / Finance Director',
    standardFormat: 'Excel & PDF',
  },

  // Cost & Finance
  {
    id: 'CAT-CST-01',
    domain: 'COST',
    subType: 'COST_OPERATING',
    title: 'Total Operating Cost (TOC) & Cost/KM Statement',
    description: 'Rincian seluruh pos pengeluaran operasional per unit (BBM, bengkel, gaji pengemudi, tol, parkir, asuransi, depresiasi).',
    tags: ['Finance', 'TOC', 'Cost/KM', 'Audit'],
    recommendedRole: 'Finance & Accounting Lead',
    standardFormat: 'Multi-Sheet Excel & PDF',
  },
  {
    id: 'CAT-CST-02',
    domain: 'COST',
    subType: 'COST_FUEL',
    title: 'Laporan Pengeluaran & Audit Pembelian Bahan Bakar',
    description: 'Konsolidasi transaksi SPBU, verifikasi struk resmi, dan rasio biaya bahan bakar per kilometer.',
    tags: ['Finance', 'Fuel', 'Cost'],
    recommendedRole: 'Fuel Controller / Finance',
    standardFormat: 'Excel & CSV',
  },
  {
    id: 'CAT-CST-03',
    domain: 'COST',
    subType: 'COST_MAINTENANCE',
    title: 'Laporan Biaya Perbaikan Bengkel & Suku Cadang',
    description: 'Rekapitulasi biaya servis preventif vs korektif, jasa mekanik, dan penggantian ban/komponen.',
    tags: ['Finance', 'Maintenance', 'Workshop'],
    recommendedRole: 'Workshop Lead / Finance',
    standardFormat: 'Excel & PDF',
  },
  {
    id: 'CAT-CST-04',
    domain: 'COST',
    subType: 'COST_SAVING',
    title: 'Laporan Realisasi Program Penghematan Biaya Armada',
    description: 'Kalkulasi penghematan dari pemangkasan idle, efisiensi rute AI, dan negosiasi suku cadang.',
    tags: ['Finance', 'ROI', 'Efficiency'],
    recommendedRole: 'Fleet Manager / CFO',
    standardFormat: 'PDF & Excel',
  },

  // Fuel
  {
    id: 'CAT-FL-01',
    domain: 'FUEL',
    subType: 'FUEL_CONSUMPTION',
    title: 'Laporan Konsumsi Bahan Bakar (BBM) & Efisiensi KM/L',
    description: 'Log liter pengisian solar, jarak tempuh riil, dan rasio efisiensi KM/L per kendaraan & pengemudi.',
    tags: ['Fuel', 'Operations', 'KM/L'],
    recommendedRole: 'Fleet Supervisor / Fuel Lead',
    standardFormat: 'Excel & PDF',
  },
  {
    id: 'CAT-FL-02',
    domain: 'FUEL',
    subType: 'FUEL_ANOMALY',
    title: 'Laporan Deteksi Anomali & Pemborosan BBM',
    description: 'Identifikasi unit dengan konsumsi solar abnormal, idling mesin ekstrem, dan dugaan kebocoran/siphon.',
    tags: ['Fuel', 'Anomaly', 'Audit', 'AI'],
    recommendedRole: 'HSE & Fuel Auditor',
    standardFormat: 'PDF & Excel',
  },
  {
    id: 'CAT-FL-03',
    domain: 'FUEL',
    subType: 'FUEL_REFUELING',
    title: 'Laporan Transaksi & Struk Pengisian Solar / SPBU',
    description: 'Log detail transaksi pengisian BBM di SPBU rekanan beserta sinkronisasi sensor tangki telematika.',
    tags: ['Fuel', 'SPBU', 'Reimburse'],
    recommendedRole: 'Admin Ops / Finance',
    standardFormat: 'CSV & Excel',
  },

  // Safety & HSE
  {
    id: 'CAT-SAF-01',
    domain: 'SAFETY',
    subType: 'SAFETY_SUMMARY',
    title: 'Laporan Ringkasan Keselamatan Berkendara & Insiden',
    description: 'Rekapitulasi skor keselamatan armada, overspeed, pengereman mendadak, dan status tindak lanjut HSE.',
    tags: ['Safety', 'HSE', 'Compliance'],
    recommendedRole: 'Safety Officer / HSE Manager',
    standardFormat: 'PDF & Print Ready',
  },
  {
    id: 'CAT-SAF-02',
    domain: 'SAFETY',
    subType: 'SAFETY_ACCIDENT',
    title: 'Laporan Kronologi & Klaim Kecelakaan Lalu Lintas',
    description: 'Dokumentasi detail kejadian kecelakaan, estimasi kerusakan, bukti rekaman sensor, dan investigasi.',
    tags: ['Safety', 'Accident', 'Legal'],
    recommendedRole: 'Legal & HSE Director',
    standardFormat: 'PDF Resmi',
  },
  {
    id: 'CAT-SAF-03',
    domain: 'SAFETY',
    subType: 'SAFETY_DRIVER_SAFETY',
    title: 'Laporan Peringkat Risiko Keselamatan Driver (Risk Matrix)',
    description: 'Matriks pemetaan risiko pengemudi berdasarkan riwayat telematika dan kepatuhan berkendara.',
    tags: ['Safety', 'Driver', 'Risk'],
    recommendedRole: 'Driver Coaching Lead',
    standardFormat: 'Excel & PDF',
  },

  // Driver & Fatigue
  {
    id: 'CAT-DRV-01',
    domain: 'DRIVER',
    subType: 'DRIVER_PERFORMANCE',
    title: 'Kartu Evaluasi Kinerja Pengemudi (Driver Scorecard)',
    description: 'Scorecard menyeluruh performa driver: total trip, kilometer, kepatuhan batas kecepatan & kehalusan berkendara.',
    tags: ['Driver', 'Scorecard', 'HR'],
    recommendedRole: 'HR & Operations Lead',
    standardFormat: 'PDF & Excel',
  },
  {
    id: 'CAT-DRV-02',
    domain: 'DRIVER',
    subType: 'DRIVER_FATIGUE',
    title: 'Laporan Manajemen Kelelahan & Jam Kerja Driver',
    description: 'Monitoring jam mengemudi terus menerus, jam istirahat, shift malam, dan peringatan sensor fatigue AI.',
    tags: ['Driver', 'Fatigue', 'HSE'],
    recommendedRole: 'Safety & Dispatcher',
    standardFormat: 'PDF & Excel',
  },

  // Maintenance
  {
    id: 'CAT-MNT-01',
    domain: 'MAINTENANCE',
    subType: 'MAINTENANCE_COST',
    title: 'Rekapitulasi Pemeliharaan & Biaya Servis Berkala',
    description: 'Log Work Order servis, penggantian suku cadang, biaya jasa bengkel, dan unit dalam perbaikan.',
    tags: ['Maintenance', 'Workshop', 'Cost'],
    recommendedRole: 'Workshop Lead / Fleet Tech',
    standardFormat: 'Excel & PDF',
  },
  {
    id: 'CAT-MNT-02',
    domain: 'MAINTENANCE',
    subType: 'MAINTENANCE_SERVICE_DUE',
    title: 'Laporan Jadwal Servis & Penggantian Oli Mendatang',
    description: 'Proyeksi jadwal servis berkala dan perpanjangan dokumen STNK/KIR berdasarkan odometer terkini.',
    tags: ['Maintenance', 'Preventive', 'Schedule'],
    recommendedRole: 'Workshop Planner',
    standardFormat: 'PDF & Excel',
  },

  // GPS & Telematics
  {
    id: 'CAT-GPS-01',
    domain: 'GPS',
    subType: 'GPS_MILEAGE',
    title: 'Laporan Jarak Tempuh & Odometer GPS Telematika',
    description: 'Rekapitulasi kilometer perjalanan, jam mengemudi, jam idle, dan jam parkir dari perangkat GPS IoT.',
    tags: ['GPS', 'Telematics', 'Mileage'],
    recommendedRole: 'Operations & Dispatch Lead',
    standardFormat: 'Excel & CSV',
  },
  {
    id: 'CAT-GPS-02',
    domain: 'GPS',
    subType: 'GPS_ACTIVITY',
    title: 'Laporan Aktivitas & Telematika GPS Harian',
    description: 'Rincian log posisi koordinat, kecepatan rata-rata, status kontak mesin (ignition), dan sinyal satelit.',
    tags: ['GPS', 'Log', 'Activity'],
    recommendedRole: 'Telematics Engineer',
    standardFormat: 'CSV & Excel',
  },

  // Fleet
  {
    id: 'CAT-FLT-01',
    domain: 'FLEET',
    subType: 'FLEET_SUMMARY',
    title: 'Laporan Konsolidasi Status & Efektivitas Armada Nasional',
    description: 'Ringkasan utilisasi nasional, kesiapan unit (availability), jam downtime bengkel, dan indeks produktivitas.',
    tags: ['Fleet', 'Summary', 'National'],
    recommendedRole: 'National Fleet Manager',
    standardFormat: 'PDF & Excel',
  },

  // Trip & Dispatch
  {
    id: 'CAT-TRP-01',
    domain: 'TRIP',
    subType: 'TRIP_SUMMARY',
    title: 'Laporan Ringkasan Surat Jalan & Perjalanan Armada',
    description: 'Daftar surat jalan, rute asal-tujuan, waktu kedatangan riil, keterlambatan (delay), dan biaya trip.',
    tags: ['Trip', 'Dispatch', 'Logistics'],
    recommendedRole: 'Transport Planner',
    standardFormat: 'Excel & PDF',
  },

  // Delivery & POD
  {
    id: 'CAT-DEL-01',
    domain: 'DELIVERY',
    subType: 'DELIVERY_SUMMARY',
    title: 'Laporan Distribusi, SLA & Bukti Penerimaan (e-POD)',
    description: 'Kinerja ketepatan waktu pengiriman logistik ke outlet/gudang dan status verifikasi e-POD digital.',
    tags: ['Delivery', 'POD', 'SLA'],
    recommendedRole: 'Logistics & Customer Ops',
    standardFormat: 'PDF & Excel',
  },
];

export const ReportListView: React.FC = () => {
  const { runQuickReport, setActiveTab, setSelectedDomain, setSelectedSubType } = useReports();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');

  const domainFilterTabs = [
    'ALL',
    'EXECUTIVE',
    'COST',
    'FUEL',
    'SAFETY',
    'DRIVER',
    'MAINTENANCE',
    'GPS',
    'FLEET',
    'TRIP',
    'DELIVERY',
  ];

  const filteredReports = ALL_REPORT_CATALOG_ITEMS.filter(item => {
    const matchesDomain = selectedDomainFilter === 'ALL' || item.domain === selectedDomainFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white">Katalog Seluruh Laporan Enterprise ({ALL_REPORT_CATALOG_ITEMS.length} Jenis)</h2>
          <p className="text-xs text-slate-400">Pilih laporan operasional untuk generate langsung, kustomisasi kolom, atau jadwalkan auto-export</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari judul, tag, atau kata kunci..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Domain Filters Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {domainFilterTabs.map(domain => {
          const isActive = selectedDomainFilter === domain;
          return (
            <button
              key={domain}
              onClick={() => setSelectedDomainFilter(domain)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {domain === 'ALL' ? 'Semua Domain' : domain}
            </button>
          );
        })}
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map(item => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition duration-200"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  item.domain === 'EXECUTIVE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  item.domain === 'COST' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  item.domain === 'FUEL' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  item.domain === 'SAFETY' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {item.domain}
                </span>
                <span className="text-[11px] text-slate-400">{item.standardFormat}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Tags & Recommended Role */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => runQuickReport(item.domain, item.subType)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-md shadow-cyan-600/20"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Generate</span>
              </button>

              <button
                onClick={() => {
                  setSelectedDomain(item.domain);
                  setSelectedSubType(item.subType);
                  setActiveTab('builder');
                }}
                title="Buka di Report Builder untuk atur filter & kolom"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                <Sliders className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
