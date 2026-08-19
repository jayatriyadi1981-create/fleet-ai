/**
 * Fleet Intelligence Smart AI - Custom Report Builder Wizard
 * PROMPT 39 - 10-Step Interactive Wizard for Domain, Sub-type, Filters, Columns, Grouping, AI & Preview
 */

import React, { useState, useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import {
  ReportDomainType,
  ReportSubType,
  ReportGroupBy,
  ReportVisualizationType,
  ReportDatePreset,
} from '../types';
import { ReportDataSourceService } from '../services/ReportDataSourceService';
import {
  FileText,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Play,
  Save,
  Clock,
  Download,
  Eye,
  Check,
  RefreshCw,
  Search,
} from 'lucide-react';

export const ReportBuilderWizard: React.FC = () => {
  const {
    selectedDomain,
    setSelectedDomain,
    selectedSubType,
    setSelectedSubType,
    filters,
    setFilters,
    selectedColumns,
    setSelectedColumns,
    groupBy,
    setGroupBy,
    sortBy,
    setSortBy,
    sortAsc,
    setSortAsc,
    visualization,
    setVisualization,
    aiSummaryEnabled,
    setAiSummaryEnabled,
    generateReport,
    setActiveTab,
    saveAsTemplate,
  } = useReports();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templateTags, setTemplateTags] = useState('Custom, Operations');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Available Domains
  const domainsList: { type: ReportDomainType; label: string; count: number }[] = [
    { type: 'EXECUTIVE', label: 'Executive & C-Level', count: 6 },
    { type: 'COST', label: 'Cost & TOC / TCO', count: 10 },
    { type: 'FUEL', label: 'BBM & Efisiensi Solar', count: 6 },
    { type: 'SAFETY', label: 'Safety & Keselamatan', count: 8 },
    { type: 'DRIVER', label: 'Pengemudi & Fatigue', count: 7 },
    { type: 'MAINTENANCE', label: 'Pemeliharaan & Bengkel', count: 9 },
    { type: 'GPS', label: 'GPS & Telematika IoT', count: 8 },
    { type: 'FLEET', label: 'Armada & Fleet Analytics', count: 10 },
    { type: 'TRIP', label: 'Surat Jalan & Perjalanan', count: 8 },
    { type: 'VEHICLE', label: 'Master Kendaraan & STNK', count: 7 },
    { type: 'DELIVERY', label: 'Distribusi & e-POD', count: 4 },
  ];

  // Available SubTypes by Domain
  const subTypesMap: Record<ReportDomainType, { id: ReportSubType; label: string; desc: string }[]> = {
    EXECUTIVE: [
      { id: 'EXECUTIVE_MONTHLY', label: 'Executive Monthly Board Briefing', desc: 'Konsolidasi bulanan TOC, utilisasi, BBM & AI' },
      { id: 'EXECUTIVE_WEEKLY', label: 'Executive Weekly Operational Flash', desc: 'Laporan mingguan dinamika operasional' },
      { id: 'EXECUTIVE_COST', label: 'C-Level Strategic Cost Audit', desc: 'Audit portofolio pengeluaran dan variansi' },
    ],
    COST: [
      { id: 'COST_OPERATING', label: 'Total Operating Cost (TOC) Statement', desc: 'Pos pengeluaran per unit dan Cost/KM' },
      { id: 'COST_FUEL', label: 'Laporan Pengeluaran Bahan Bakar Solar', desc: 'Konsolidasi transaksi SPBU dan kartu BBM' },
      { id: 'COST_MAINTENANCE', label: 'Biaya Pemeliharaan & Suku Cadang', desc: 'Rekap bengkel, onderdil dan jasa mekanik' },
      { id: 'COST_SAVING', label: 'Realisasi Program Penghematan Biaya', desc: 'Kalkulasi penghematan dari inisiatif AI' },
    ],
    FUEL: [
      { id: 'FUEL_ANOMALY', label: 'Deteksi Anomali BBM & Indikasi Siphon', desc: 'Identifikasi unit dengan KM/L ekstrem dan siphoning' },
      { id: 'FUEL_CONSUMPTION', label: 'Konsumsi Solar & Rasio Efisiensi KM/L', desc: 'Log liter pengisian riil vs estimasi' },
      { id: 'FUEL_REFUELING', label: 'Log Struk SPBU & Rekonsiliasi Sensor', desc: 'Verifikasi transaksi BBM dengan sensor tangki' },
    ],
    SAFETY: [
      { id: 'SAFETY_SUMMARY', label: 'Ringkasan Keselamatan Armada & Insiden', desc: 'Skor keselamatan, overspeed, pengereman keras' },
      { id: 'SAFETY_DRIVER_SAFETY', label: 'Matriks Peringkat Risiko Pengemudi', desc: 'Pemetaan profil risiko driver untuk coaching' },
      { id: 'SAFETY_ACCIDENT', label: 'Kronologi & Klaim Kecelakaan', desc: 'Dokumentasi investigasi dan klaim asuransi' },
    ],
    DRIVER: [
      { id: 'DRIVER_PERFORMANCE', label: 'Driver Behavior & Safety Scorecard', desc: 'Evaluasi kebiasaan berkendara bulanan' },
      { id: 'DRIVER_FATIGUE', label: 'Manajemen Kelelahan & Jam Kerja Driver', desc: 'Log jam mengemudi terus-menerus dan alert fatigue' },
    ],
    MAINTENANCE: [
      { id: 'MAINTENANCE_COST', label: 'Rekapitulasi Pemeliharaan & Work Order', desc: 'Laporan servis bengkel dan penggantian komponen' },
      { id: 'MAINTENANCE_SERVICE_DUE', label: 'Jadwal Servis Berkala & Uji KIR/STNK', desc: 'Proyeksi jatuh tempo servis dan legalitas' },
    ],
    GPS: [
      { id: 'GPS_MILEAGE', label: 'Jarak Tempuh & Odometer GPS Telematika', desc: 'Log kilometer dan jam operasional sensor' },
      { id: 'GPS_ACTIVITY', label: 'Aktivitas Harian & Koordinat Posisi', desc: 'Detail rute dan status ignition mesin' },
    ],
    FLEET: [
      { id: 'FLEET_SUMMARY', label: 'Konsolidasi Kesiapan & Utilisasi Armada', desc: 'Availability rate dan downtime nasional' },
    ],
    TRIP: [
      { id: 'TRIP_SUMMARY', label: 'Ringkasan Surat Jalan & On-Time SLA', desc: 'Manifest rute dan ketepatan waktu kedatangan' },
    ],
    VEHICLE: [
      { id: 'VEHICLE_MASTER', label: 'Master Data Kendaraan & Masa Berlaku KIR', desc: 'Spesifikasi unit dan status legalitas STNK' },
    ],
    DELIVERY: [
      { id: 'DELIVERY_SUMMARY', label: 'Kinerja Distribusi & Verifikasi e-POD', desc: 'Status pengiriman logistik dan tanda terima digital' },
    ],
  };

  // Preset Date Periods
  const datePresets: { id: ReportDatePreset; label: string }[] = [
    { id: 'TODAY', label: 'Hari Ini (17 Agt 2026)' },
    { id: 'YESTERDAY', label: 'Kemarin' },
    { id: 'THIS_WEEK', label: 'Minggu Ini' },
    { id: 'LAST_WEEK', label: 'Minggu Lalu' },
    { id: 'THIS_MONTH', label: 'Bulan Ini (Agustus 2026)' },
    { id: 'LAST_MONTH', label: 'Bulan Lalu (Juli 2026)' },
    { id: 'THIS_QUARTER', label: 'Kuartal Ini (Q3 2026)' },
    { id: 'LAST_QUARTER', label: 'Kuartal Lalu (Q2 2026)' },
    { id: 'THIS_YEAR', label: 'Tahun Ini (2026)' },
    { id: 'CUSTOM', label: 'Kustom Tanggal' },
  ];

  // Available Columns for Current Domain/SubType
  const defaultColumns = useMemo(() => {
    const previewDS = ReportDataSourceService.generateReportDataset(
      selectedDomain,
      selectedSubType,
      filters
    );
    return previewDS.columns;
  }, [selectedDomain, selectedSubType, filters]);

  // Handle column selection
  const handleColumnToggle = (colId: string) => {
    if (selectedColumns.includes(colId)) {
      setSelectedColumns(selectedColumns.filter(c => c !== colId));
    } else {
      setSelectedColumns([...selectedColumns, colId]);
    }
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(defaultColumns.map(c => c.id));
  };

  const handleResetColumns = () => {
    setSelectedColumns([]);
  };

  // Preview Dataset for Step 9
  const previewDataset = useMemo(() => {
    return ReportDataSourceService.generateReportDataset(
      selectedDomain,
      selectedSubType,
      filters,
      selectedColumns.length > 0 ? selectedColumns : undefined,
      groupBy,
      sortBy,
      sortAsc
    );
  }, [selectedDomain, selectedSubType, filters, selectedColumns, groupBy, sortBy, sortAsc]);

  const handleFinishAndOpen = () => {
    generateReport(selectedDomain, selectedSubType, filters);
    setActiveTab('viewer');
  };

  const handleSaveTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;
    const tags = templateTags.split(',').map(t => t.trim()).filter(Boolean);
    saveAsTemplate(templateName, templateDesc || `Template kustom untuk ${selectedDomain}`, tags);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const stepsList = [
    { num: 1, label: 'Domain' },
    { num: 2, label: 'Sub-Type' },
    { num: 3, label: 'Filter' },
    { num: 4, label: 'Kolom' },
    { num: 5, label: 'Grouping' },
    { num: 6, label: 'Sorting' },
    { num: 7, label: 'Visual' },
    { num: 8, label: 'AI Analisis' },
    { num: 9, label: 'Preview' },
    { num: 10, label: 'Selesai' },
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Custom Report Builder Wizard</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Bangun laporan fleksibel dengan pemilihan sumber data, filter kustom, grouping, visualisasi, dan AI synthesis
            </p>
          </div>

          {/* Step Progress Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {stepsList.map(s => {
              const isCompleted = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    isCurrent
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                      : isCompleted
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-900/40">
                    {isCompleted ? <Check className="h-3 w-3" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Step Content */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl min-h-[420px] flex flex-col justify-between">
        {/* STEP 1: Choose Domain */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 1: Pilih Domain / Kategori Laporan</h3>
              <p className="text-xs text-slate-400 mt-1">Pilih domain bisnis yang ingin Anda analisis datanya</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {domainsList.map(dom => {
                const isSelected = selectedDomain === dom.type;
                return (
                  <div
                    key={dom.type}
                    onClick={() => {
                      setSelectedDomain(dom.type);
                      const availableSub = subTypesMap[dom.type];
                      if (availableSub && availableSub.length > 0) {
                        setSelectedSubType(availableSub[0].id);
                      }
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">{dom.label}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{dom.count} Jenis Sub-Laporan</div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-cyan-400" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Choose Sub-Type */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 2: Pilih Sub-Jenis Laporan ({selectedDomain})</h3>
              <p className="text-xs text-slate-400 mt-1">Tentukan dataset spesifik yang ingin dimuat dalam laporan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(subTypesMap[selectedDomain] || []).map(sub => {
                const isSelected = selectedSubType === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubType(sub.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{sub.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{sub.desc}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 ml-2" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Filters & Date Preset */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 3: Tentukan Periode Waktu &amp; Filter Global</h3>
              <p className="text-xs text-slate-400 mt-1">Saring data berdasarkan tanggal, cabang operasional, dan parameter khusus</p>
            </div>

            {/* Date Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Preset Periode Waktu</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {datePresets.map(dp => {
                  const isSelected = filters.periodPreset === dp.id;
                  return (
                    <button
                      key={dp.id}
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, periodPreset: dp.id }))}
                      className={`p-2 rounded-xl text-xs font-semibold border transition text-left truncate ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {dp.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Dates & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tanggal Selesai</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Cabang / Pool Depo</label>
                <select
                  value={filters.branchId || 'ALL'}
                  onChange={e => setFilters(prev => ({ ...prev, branchId: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">Semua Cabang / Nasional</option>
                  <option value="branch-jkt">Depo Utama Jakarta</option>
                  <option value="branch-sby">Depo Surabaya Barat</option>
                  <option value="branch-smg">Depo Semarang Trans</option>
                  <option value="branch-bdg">Depo Bandung Raya</option>
                  <option value="branch-ckr">Depo Cikarang Logistics</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Column Selection */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 4: Pilih Kolom Data Laporan</h3>
                <p className="text-xs text-slate-400 mt-1">Centang kolom yang ingin ditampilkan dalam tabel dan hasil ekspor</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAllColumns}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700"
                >
                  Pilih Semua
                </button>
                <button
                  onClick={handleResetColumns}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-300 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700"
                >
                  Reset Default
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {defaultColumns.map(col => {
                const isChecked = selectedColumns.length === 0 ? true : selectedColumns.includes(col.id);
                return (
                  <div
                    key={col.id}
                    onClick={() => handleColumnToggle(col.id)}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition ${
                      isChecked
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                        : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{col.label}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{col.dataType}</div>
                    </div>
                    <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                      isChecked ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-600'
                    }`}>
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Grouping */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 5: Pengelompokan Data (Grouping)</h3>
              <p className="text-xs text-slate-400 mt-1">Kelompokkan baris data untuk melihat subtotal dan agregasi per entitas</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { id: 'NONE', label: 'Tanpa Grouping (Flat)', desc: 'Menampilkan seluruh baris detail' },
                { id: 'BRANCH', label: 'Per Cabang / Depo', desc: 'Subtotal per kantor cabang' },
                { id: 'VEHICLE', label: 'Per Kendaraan', desc: 'Subtotal per plat nomor kendaraan' },
                { id: 'DRIVER', label: 'Per Pengemudi', desc: 'Subtotal per nama driver' },
                { id: 'DATE', label: 'Per Tanggal', desc: 'Agregasi harian' },
                { id: 'MONTH', label: 'Per Bulan', desc: 'Agregasi bulanan' },
                { id: 'CATEGORY', label: 'Per Kategori / Status', desc: 'Kelompokkan berdasarkan status operasional' },
              ].map(grp => {
                const isSelected = groupBy === grp.id;
                return (
                  <div
                    key={grp.id}
                    onClick={() => setGroupBy(grp.id as ReportGroupBy)}
                    className={`cursor-pointer p-4 rounded-2xl border transition ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{grp.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{grp.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Sorting */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 6: Pengurutan Data (Sorting)</h3>
              <p className="text-xs text-slate-400 mt-1">Pilih kolom acuan dan arah pengurutan data</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Urutkan Berdasarkan Kolom</label>
                <select
                  value={sortBy || defaultColumns[0]?.id}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {defaultColumns.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Arah Pengurutan</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSortAsc(true)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      sortAsc
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Ascending (A-Z / 0-9)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortAsc(false)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      !sortAsc
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Descending (Z-A / 9-0)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Visualization Type */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 7: Tipe Visualisasi Utama</h3>
              <p className="text-xs text-slate-400 mt-1">Pilih bentuk representasi grafik untuk laporan ini</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { id: 'TABLE', label: 'Tabel Standar' },
                { id: 'BAR_CHART', label: 'Bar Chart' },
                { id: 'LINE_CHART', label: 'Line Chart' },
                { id: 'AREA_CHART', label: 'Area Chart' },
                { id: 'DONUT_CHART', label: 'Donut / Pie' },
                { id: 'KPI_SUMMARY', label: 'KPI Cards Grid' },
              ].map(vis => {
                const isSelected = visualization === vis.id;
                return (
                  <div
                    key={vis.id}
                    onClick={() => setVisualization(vis.id as ReportVisualizationType)}
                    className={`cursor-pointer p-4 rounded-2xl border text-center transition ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10 font-bold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 opacity-80" />
                    <div className="text-xs">{vis.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 8: AI Intelligence Synthesis Toggle */}
        {currentStep === 8 && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 8: Sintesis Intelijen AI Eksekutif</h3>
              <p className="text-xs text-slate-400 mt-1">Aktifkan analisis otomatis AI untuk menghasilkan Executive Summary, anomali data, dan rekomendasi strategis</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-800 to-slate-900 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Executive Synthesis Engine</h4>
                    <p className="text-xs text-slate-300">Ringkasan berbasis data riil tanpa halusinasi</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAiSummaryEnabled(!aiSummaryEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    aiSummaryEnabled ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      aiSummaryEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Sintesis Executive Summary naratif untuk Direksi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Deteksi tren anomali &amp; risiko biaya ekstrem</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Rekomendasi tindakan dengan bukti metrik terverifikasi</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Live Interactive Preview */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 9: Live Preview Laporan ({previewDataset.name})</h3>
                <p className="text-xs text-slate-400 mt-1">{previewDataset.totalRecords} Baris Data Dihasilkan • {previewDataset.filterSummary}</p>
              </div>
            </div>

            {/* Quick KPI Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previewDataset.kpis.map((kpi, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{kpi.label}</div>
                  <div className="text-lg font-bold text-white mt-1">{kpi.value}</div>
                  {kpi.subtext && <div className="text-[10px] text-cyan-400 mt-0.5">{kpi.subtext}</div>}
                </div>
              ))}
            </div>

            {/* Mini Table Preview */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-56">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    {previewDataset.columns.filter(c => c.visible).slice(0, 6).map(c => (
                      <th key={c.id} className="py-2 px-3">{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {previewDataset.rows.slice(0, 4).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40">
                      {previewDataset.columns.filter(c => c.visible).slice(0, 6).map(c => (
                        <td key={c.id} className="py-2 px-3">
                          {c.dataType === 'currency' && typeof row[c.id] === 'number'
                            ? `Rp ${(row[c.id] || 0).toLocaleString('id-ID')}`
                            : String(row[c.id] || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 10: Finish & Save as Template */}
        {currentStep === 10 && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Langkah 10: Finalisasi &amp; Simpan Konfigurasi</h3>
              <p className="text-xs text-slate-400 mt-1">Laporan Anda siap dibuka di Interactive Viewer atau disimpan sebagai Template berulang</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Laporan Berhasil Dikonfigurasi</h4>
                <p className="text-xs text-emerald-400 mt-0.5">
                  {previewDataset.name} ({previewDataset.totalRecords} baris data)
                </p>
              </div>
              <button
                onClick={handleFinishAndOpen}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition"
              >
                <Eye className="h-4 w-4" />
                <span>Buka di Viewer</span>
              </button>
            </div>

            {/* Save As Template Form */}
            <form onSubmit={handleSaveTemplateSubmit} className="space-y-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simpan sebagai Template Laporan</h4>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nama Template</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  placeholder="Contoh: Laporan Operasional Bulanan Koridor Jawa"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={templateDesc}
                  onChange={e => setTemplateDesc(e.target.value)}
                  placeholder="Deskripsi tujuan laporan..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tag (Dipisahkan koma)</label>
                <input
                  type="text"
                  value={templateTags}
                  onChange={e => setTemplateTags(e.target.value)}
                  placeholder="Custom, Bulanan, Finance"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={!templateName.trim()}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Simpan Template</span>
                </button>
                {saveSuccessNotice && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Template tersimpan!</span>
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Bottom Wizard Navigation Controls */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition disabled:opacity-30"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Sebelumnya</span>
          </button>

          <div className="text-xs text-slate-400 font-mono">
            Langkah {currentStep} dari 10
          </div>

          {currentStep < 10 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(10, prev + 1))}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition shadow-md shadow-cyan-600/20"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishAndOpen}
              className="flex items-center gap-1.5 py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-600/20"
            >
              <Eye className="h-4 w-4" />
              <span>Buka Laporan Penuh</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
