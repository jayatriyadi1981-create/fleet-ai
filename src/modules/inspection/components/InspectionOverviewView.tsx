/**
 * Fleet Intelligence Smart AI - Vehicle Inspection Overview Dashboard
 * Displays inspection KPIs, compliance, critical findings, grounded vehicles, and AI insights.
 */

import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  Eye, 
  ShieldCheck, 
  CarFront,
  ArrowUpRight
} from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { inspectionAiService } from '../services/inspectionAiService';
import { VehicleInspection, InspectionIssue } from '../types/inspection';

interface InspectionOverviewViewProps {
  onNavigateTab: (tab: string) => void;
  onSelectInspection: (inspection: VehicleInspection) => void;
  onSelectIssue: (issue: InspectionIssue) => void;
}

export const InspectionOverviewView: React.FC<InspectionOverviewViewProps> = ({
  onNavigateTab,
  onSelectInspection,
  onSelectIssue,
}) => {
  const analytics = inspectionService.getAnalytics();
  const inspections = inspectionService.getInspections();
  const issues = inspectionService.getIssues();
  const aiInsights = inspectionAiService.getInsights();

  const groundedInspections = inspections.filter(i => i.grounded);
  const criticalIssues = issues.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED');
  const recentInspections = inspections.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Vehicle Inspection & Pre-Trip Gate
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30">
                PROMPT 26
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Pemeriksaan wajib sebelum & sesudah jalan, integrasi otomatis ke Work Order bengkel, dan AI deteksi risiko armada.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => onNavigateTab('pre_trip')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold transition-all shadow-md shadow-cyan-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Mulai Pre-Trip Baru
          </button>
          <button
            onClick={() => onNavigateTab('mobile_mode')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium transition-all"
          >
            <CarFront className="w-4 h-4 text-cyan-400" />
            Mobile Driver Mode
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Inspected */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Diperiksa</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white tracking-tight">{analytics.totalInspections}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hari ini: {analytics.todayInspections} unit</div>
          </div>
        </div>

        {/* Passed */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Lolos (Passed)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{analytics.passCount}</div>
            <div className="text-[11px] text-emerald-500/80 mt-0.5">{analytics.passRatePercent}% tingkat kelolosan</div>
          </div>
        </div>

        {/* Attention */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Perhatian (Attention)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-amber-400 tracking-tight">{analytics.attentionCount}</div>
            <div className="text-[11px] text-amber-500/80 mt-0.5">Isu minor terekam</div>
          </div>
        </div>

        {/* Failed / Critical */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Gagal (Failed)</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-rose-400 tracking-tight">{analytics.failCount + analytics.criticalCount}</div>
            <div className="text-[11px] text-rose-500/80 mt-0.5">{analytics.criticalCount} temuan kritis</div>
          </div>
        </div>

        {/* Vehicles Grounded */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-xs font-medium">Unit Di-Grounded</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-rose-400 tracking-tight">{analytics.groundedVehiclesCount}</div>
            <div className="text-[11px] text-rose-400/80 mt-0.5">Dilarang jalan (Blokir)</div>
          </div>
        </div>

        {/* Average Duration */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Rata-rata Durasi</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-white tracking-tight">{analytics.avgDurationMinutes} mnt</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Per unit kendaraan</div>
          </div>
        </div>
      </div>

      {/* Grounded Vehicles Warning Banner (If Any) */}
      {groundedInspections.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-900/50 text-rose-300">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-rose-200">
                🚨 PERINGATAN OPERASIONAL: {groundedInspections.length} Kendaraan Saat Ini Berstatus Grounded
              </h2>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Kendaraan ini gagal dalam pemeriksaan rem, kemudi, atau APAR dan telah diblokir secara otomatis dari penugasan rute/Trip Dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('issues')}
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Tinjau Masalah Grounded
          </button>
        </div>
      )}

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Inspections & Critical Issues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Inspections Table Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Inspeksi Terkini (Live Feed)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Hasil pemeriksaan terbaru oleh pengemudi di seluruh cabang</p>
              </div>
              <button
                onClick={() => onNavigateTab('history')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                Lihat Semua ({inspections.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {recentInspections.map((ins) => (
                <div
                  key={ins.id}
                  onClick={() => onSelectInspection(ins)}
                  className="p-4 hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl mt-0.5 flex-shrink-0 ${
                      ins.result === 'PASS' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : ins.result === 'ATTENTION' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {ins.result === 'PASS' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : ins.result === 'ATTENTION' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{ins.vehiclePlate}</span>
                        <span className="text-xs text-slate-400">• {ins.vehicleModel}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {ins.inspectionNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Driver: <strong className="text-slate-300 font-normal">{ins.driverName}</strong></span>
                        <span>Odo: <strong className="text-slate-300 font-normal">{ins.odometer.toLocaleString()} km</strong></span>
                        <span>Lokasi: <strong className="text-slate-300 font-normal">{ins.locationName}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          ins.result === 'PASS' 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : ins.result === 'ATTENTION' 
                            ? 'bg-amber-500/20 text-amber-300' 
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {ins.result} ({ins.overallScore}%)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(ins.completedAt || ins.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Inspection Issues Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  Temuan Masalah Terbuka (Open Issues)
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium">
                    {issues.filter(i => i.status !== 'RESOLVED').length} Isu
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Daftar kerusakan yang memerlukan penanganan bengkel atau verifikasi pasca perbaikan</p>
              </div>
              <button
                onClick={() => onNavigateTab('issues')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                Kelola Semua Isu
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {issues.slice(0, 3).map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="p-3.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/60 flex items-start justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      issue.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : issue.severity === 'HIGH'
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{issue.itemName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          issue.severity === 'CRITICAL' 
                            ? 'bg-rose-500/20 text-rose-300' 
                            : issue.severity === 'HIGH' 
                            ? 'bg-orange-500/20 text-orange-300' 
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1">{issue.description}</p>
                      <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-3">
                        <span>Unit: <strong className="text-slate-300 font-normal">{issue.vehiclePlate}</strong></span>
                        <span>Status: <strong className="text-cyan-400 font-normal">{issue.status}</strong></span>
                        {issue.workOrderNumber && (
                          <span className="text-emerald-400 font-mono">{issue.workOrderNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Inspection Insights & Top Failure Categories */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="rounded-xl border border-cyan-900/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Inspection Insights</h3>
                  <p className="text-[11px] text-cyan-300">Pola Risiko & Rekomendasi Pintar</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('ai_insights')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Analisis AI
              </button>
            </div>

            <div className="space-y-3.5">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/90 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{insight.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      {insight.confidenceScore}% conf
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{insight.summary}</p>
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-cyan-200 font-medium mt-1">
                    💡 Rekomendasi: {insight.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Failure Categories Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Distribusi Temuan Kerusakan</h3>
              <span className="text-xs text-slate-400">Bulan Ini</span>
            </div>

            <div className="space-y-3 mt-4">
              {analytics.categoryFailureBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.label}</span>
                    <span className="text-slate-400 font-mono">{cat.count} kasus ({cat.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cat.category === 'BRAKE' 
                          ? 'bg-rose-500' 
                          : cat.category === 'TIRE' 
                          ? 'bg-amber-500' 
                          : cat.category === 'LIGHT' 
                          ? 'bg-cyan-500' 
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('analytics')}
              className="w-full mt-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-center transition-colors"
            >
              Lihat Laporan Analitik Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
