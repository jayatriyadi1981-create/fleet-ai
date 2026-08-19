/**
 * Fleet Intelligence Smart AI - Report Center Dashboard View
 * PROMPT 39 - Primary Analytics Hub, Domain Launchpad, KPIs & Quick Action Controls
 */

import React, { useState } from 'react';
import { useReports } from '../context/ReportContext';
import {
  FileText,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Star,
  ArrowUpRight,
  ShieldAlert,
  Fuel,
  Wrench,
  DollarSign,
  Truck,
  Users,
  MapPin,
  Route,
  Brain,
  PackageCheck,
  Search,
  Filter,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { ReportDomainType, ReportSubType } from '../types';

export const ReportDashboardView: React.FC = () => {
  const {
    kpiMetrics,
    runQuickReport,
    runOneClickExecutiveReport,
    templates,
    generatedReports,
    loadTemplate,
    setActiveTab,
  } = useReports();

  const [searchQuery, setSearchQuery] = useState('');

  // Domain Cards Definition
  const domainCards: {
    domain: ReportDomainType;
    defaultSubType: ReportSubType;
    title: string;
    description: string;
    icon: any;
    color: string;
    subReportsCount: number;
    popularReport: string;
  }[] = [
    {
      domain: 'EXECUTIVE',
      defaultSubType: 'EXECUTIVE_MONTHLY',
      title: 'Executive & C-Level',
      description: 'Laporan ringkasan bisnis Direksi, TOC, efisiensi dan rekomendasi AI.',
      icon: Sparkles,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      subReportsCount: 6,
      popularReport: 'Executive Board Monthly Briefing',
    },
    {
      domain: 'COST',
      defaultSubType: 'COST_OPERATING',
      title: 'Cost & TOC/TCO',
      description: 'Analisis total pengeluaran operasional, Cost/KM, variansi & penghematan.',
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      subReportsCount: 10,
      popularReport: 'Operating Cost & Cost/KM Statement',
    },
    {
      domain: 'FUEL',
      defaultSubType: 'FUEL_ANOMALY',
      title: 'BBM & Efisiensi Solar',
      description: 'Audit konsumsi BBM, rasio KM/L, pengisian SPBU dan deteksi anomali/siphon.',
      icon: Fuel,
      color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
      subReportsCount: 6,
      popularReport: 'Audit Deteksi Anomali & Siphon BBM',
    },
    {
      domain: 'SAFETY',
      defaultSubType: 'SAFETY_SUMMARY',
      title: 'Safety & Keselamatan',
      description: 'Skor keselamatan, overspeed, pengereman mendadak, insiden & coaching.',
      icon: ShieldAlert,
      color: 'from-red-500/20 to-rose-500/20 text-rose-400 border-rose-500/30',
      subReportsCount: 8,
      popularReport: 'Driver Behavior & Safety Scorecard',
    },
    {
      domain: 'FLEET',
      defaultSubType: 'FLEET_SUMMARY',
      title: 'Armada & Fleet Analytics',
      description: 'Konsolidasi utilisasi nasional, kesiapan unit, downtime & produktivitas.',
      icon: Truck,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
      subReportsCount: 10,
      popularReport: 'Fleet Summary & Availability Rate',
    },
    {
      domain: 'MAINTENANCE',
      defaultSubType: 'MAINTENANCE_COST',
      title: 'Pemeliharaan & Bengkel',
      description: 'Work Order servis berkala, biaya sparepart, jadwal KIR STNK & predictive.',
      icon: Wrench,
      color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30',
      subReportsCount: 9,
      popularReport: 'Rekap Pemeliharaan & Work Order Bengkel',
    },
    {
      domain: 'DRIVER',
      defaultSubType: 'DRIVER_PERFORMANCE',
      title: 'Pengemudi & Fatigue',
      description: 'Evaluasi kinerja driver, jam mengemudi, jam istirahat & sensor fatigue.',
      icon: Users,
      color: 'from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30',
      subReportsCount: 7,
      popularReport: 'Kartu Evaluasi Driver & Fatigue Log',
    },
    {
      domain: 'TRIP',
      defaultSubType: 'TRIP_SUMMARY',
      title: 'Surat Jalan & Perjalanan',
      description: 'Manifest perjalanan, on-time delivery SLA, keterlambatan & deviasi rute.',
      icon: Route,
      color: 'from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30',
      subReportsCount: 8,
      popularReport: 'Trip Summary & Ketepatan Waktu SLA',
    },
    {
      domain: 'GPS',
      defaultSubType: 'GPS_MILEAGE',
      title: 'GPS & Telematika IoT',
      description: 'Log jarak tempuh, jam gerak, engine idle, sinyal sensor & riwayat rute.',
      icon: MapPin,
      color: 'from-cyan-500/20 to-sky-500/20 text-sky-400 border-sky-500/30',
      subReportsCount: 8,
      popularReport: 'GPS Mileage & Activity Telematics',
    },
    {
      domain: 'VEHICLE',
      defaultSubType: 'VEHICLE_MASTER',
      title: 'Kendaraan & Master Data',
      description: 'Master data unit, masa berlaku STNK/KIR, status unit & riwayat ODO.',
      icon: Truck,
      color: 'from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-700',
      subReportsCount: 7,
      popularReport: 'Master Unit & Status Operasional',
    },
    {
      domain: 'DELIVERY',
      defaultSubType: 'DELIVERY_SUMMARY',
      title: 'Distribusi & e-POD',
      description: 'Status pengiriman kargo, bukti digital POD, lead time & performa mitra.',
      icon: PackageCheck,
      color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
      subReportsCount: 4,
      popularReport: 'Delivery Summary & e-POD Verification',
    },
  ];

  // Chart Data for Reports Distribution
  const reportsByTypeData = [
    { name: 'Cost', count: 48, fill: '#10b981' },
    { name: 'Executive', count: 36, fill: '#f59e0b' },
    { name: 'Fuel', count: 32, fill: '#06b6d4' },
    { name: 'Safety', count: 26, fill: '#f43f5e' },
    { name: 'Maint', count: 22, fill: '#eab308' },
    { name: 'GPS', count: 18, fill: '#38bdf8' },
    { name: 'Driver', count: 15, fill: '#14b8a6' },
    { name: 'Trip', count: 12, fill: '#6366f1' },
  ];

  const monthlyTrendData = [
    { month: 'Mar 26', generated: 112, exported: 98 },
    { month: 'Apr 26', generated: 135, exported: 118 },
    { month: 'Mei 26', generated: 148, exported: 130 },
    { month: 'Jun 26', generated: 162, exported: 144 },
    { month: 'Jul 26', generated: 175, exported: 155 },
    { month: 'Agt 26', generated: 186, exported: 164 },
  ];

  const formatDistributionData = [
    { name: 'PDF (Print)', value: 58, color: '#06b6d4' },
    { name: 'Excel (XLSX)', value: 32, color: '#10b981' },
    { name: 'CSV (Raw)', value: 10, color: '#6366f1' },
  ];

  // Favorite Templates
  const favoriteTemplates = templates.filter(t => t.isFavorite || t.isDefault).slice(0, 4);

  // Filtered Domains
  const filteredDomains = domainCards.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Jenis Report</div>
          <div className="mt-1.5 text-2xl font-bold text-white">{kpiMetrics.totalReports}</div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>11 Domain Terpadu</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Laporan Dibuat</div>
          <div className="mt-1.5 text-2xl font-bold text-cyan-400">{kpiMetrics.reportsGenerated}</div>
          <div className="mt-1 text-[10px] text-slate-400">+12% vs bulan lalu</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Jadwal Aktif (Cron)</div>
          <div className="mt-1.5 text-2xl font-bold text-amber-400">{kpiMetrics.reportsScheduled}</div>
          <div className="mt-1 text-[10px] text-amber-400/80 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Auto Email &amp; In-App</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Ekspor</div>
          <div className="mt-1.5 text-2xl font-bold text-emerald-400">{kpiMetrics.reportsExported}</div>
          <div className="mt-1 text-[10px] text-emerald-400/80">PDF, Excel, CSV</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bulan Ini (Agt 26)</div>
          <div className="mt-1.5 text-2xl font-bold text-white">{kpiMetrics.reportsThisMonth}</div>
          <div className="mt-1 text-[10px] text-slate-400">Realisasi berjalan</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tingkat Kegagalan</div>
          <div className="mt-1.5 text-2xl font-bold text-emerald-400">0%</div>
          <div className="mt-1 text-[10px] text-emerald-400/80">100% SLA uptime</div>
        </div>
      </div>

      {/* Hero Action: 1-Click Executive & Favorite Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Quick Executive Briefing Launchpad */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">1-Click Executive Intelligence</span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-white leading-tight">
              Executive Board Briefing Report
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Generate laporan lengkap direksi secara otomatis: analisis utilisasi armada, total operating cost (TOC), efisiensi solar, indeks keselamatan, dan rekomendasi AI terstruktur.
            </p>
          </div>

          <div className="mt-5 space-y-2">
            <button
              onClick={runOneClickExecutiveReport}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Buka Executive Report Sekarang</span>
            </button>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Periode: Agustus 2026</span>
              <span className="text-amber-400">PDF &amp; Print Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Favorite / Popular Templates */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <h3 className="text-sm font-bold text-white">Template Laporan Favorit &amp; Paling Sering Digunakan</h3>
            </div>
            <button
              onClick={() => setActiveTab('templates')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
            >
              <span>Lihat Semua Template</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoriteTemplates.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => loadTemplate(tpl)}
                className="group cursor-pointer p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 hover:bg-slate-800 transition flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-700 text-cyan-400">
                      {tpl.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{tpl.usageCount}x Digenerate</span>
                  </div>
                  <h4 className="mt-1.5 text-xs font-bold text-white group-hover:text-cyan-400 transition line-clamp-1">
                    {tpl.name}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-700/40">
                  <span>Visual: {tpl.visualization}</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <span>Generate</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Domain Launchpad Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Pusat Kategori Laporan Operasional</h2>
            <p className="text-xs text-slate-400">Pilih domain laporan untuk membuka data terintegrasi, filter, tabel &amp; visualisasi</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari jenis laporan..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredDomains.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.domain}
                onClick={() => runQuickReport(card.domain, card.defaultSubType)}
                className="group cursor-pointer rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 p-4 transition duration-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} border shadow-sm`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {card.subReportsCount} Jenis
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[170px]">
                    Populer: <strong className="text-slate-200">{card.popularReport}</strong>
                  </span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    <span>Buka</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts & Recent Files Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Reports Generated by Domain Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Distribusi Pembuatan Laporan</h3>
            <span className="text-[10px] text-slate-400">Total Volume</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportsByTypeData} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend Area Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tren Bulanan (Generated vs Exported)</h3>
            <span className="text-[10px] text-emerald-400 font-semibold">+18% YTD</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="generated" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorGen)" name="Generated" />
                <Area type="monotone" dataKey="exported" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" name="Exported" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Generated Files & Formats */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Berkas Terakhir Diunduh</h3>
              <button
                onClick={() => setActiveTab('generated')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Lihat Semua
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {generatedReports.slice(0, 3).map(rep => (
                <div key={rep.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`p-2 rounded-lg text-xs font-bold ${
                      rep.format === 'PDF' ? 'bg-rose-500/20 text-rose-400' :
                      rep.format === 'EXCEL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {rep.format}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">{rep.name}</div>
                      <div className="text-[10px] text-slate-400">{rep.fileSize} • {new Date(rep.generatedAt).toLocaleDateString('id-ID')}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {rep.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Format Terpopuler:</span>
            <strong className="text-slate-200">PDF (58%) &amp; Excel (32%)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
