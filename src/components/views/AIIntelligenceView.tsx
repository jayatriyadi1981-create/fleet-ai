/**
 * Fleet Intelligence Smart AI - Intelligence Hub & Observability Master View
 * Sections: Driver Intelligence, Proactive Recommendation Hub, Vehicle Risk Matrix, AI Observability & Audit Logs
 */

import React, { useState, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { aiService } from '../../services/ai/AIService';
import { aiAuditService } from '../../services/ai/engines/AIAuditService';
import { VehicleRiskEngine } from '../../services/ai/engines/VehicleRiskEngine';
import { DriverIntelligenceView } from '../../modules/driver-intelligence/components/DriverIntelligenceView';
import { AIAuditLog, AIUsageMetrics, AIProviderHealth, VehicleRiskScore } from '../../types/ai';
import {
  Sparkles,
  Lightbulb,
  ShieldAlert,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  RefreshCw,
  Clock,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
  Wrench
} from 'lucide-react';

export const AIIntelligenceView: React.FC = () => {
  const { aiInsights, setIsAiDrawerOpen, vehicles, alerts } = useFleet();
  const [mode, setMode] = useState<'driver-intelligence' | 'ai-hub' | 'vehicle-risk' | 'ai-observability'>('driver-intelligence');

  // Observability & Risk Data
  const [metrics, setMetrics] = useState<AIUsageMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AIAuditLog[]>([]);
  const [providerHealth, setProviderHealth] = useState<AIProviderHealth[]>([]);
  const [vehicleRisks, setVehicleRisks] = useState<VehicleRiskScore[]>([]);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchRiskQuery, setSearchRiskQuery] = useState('');

  useEffect(() => {
    setMetrics(aiAuditService.getUsageMetrics());
    setAuditLogs(aiAuditService.getAuditLogs());
    setVehicleRisks(VehicleRiskEngine.calculateFleetRisks(vehicles, alerts));
    aiService.checkHealth().then(setProviderHealth).catch(console.error);
  }, [vehicles.length, alerts.length]);

  const filteredRisks = vehicleRisks.filter((r) => {
    const matchesLevel = riskFilter === 'ALL' || r.riskLevel === riskFilter;
    const matchesSearch =
      r.plateNumber.toLowerCase().includes(searchRiskQuery.toLowerCase()) ||
      r.vehicleId.toLowerCase().includes(searchRiskQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Navigation Tabs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMode('driver-intelligence')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'driver-intelligence'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-cyan-400" />
            <span>Driver Intelligence</span>
          </button>

          <button
            onClick={() => setMode('ai-hub')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'ai-hub'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span>Rekomendasi Optimasi ({aiInsights.length})</span>
          </button>

          <button
            onClick={() => setMode('vehicle-risk')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'vehicle-risk'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Flame className="h-4 w-4 text-rose-400" />
            <span>Matriks Risiko Armada ({vehicleRisks.length})</span>
          </button>

          <button
            onClick={() => setMode('ai-observability')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'ai-observability'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>AI Observabilitas & Audit</span>
          </button>
        </div>

        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Buka AI Assistant</span>
        </button>
      </div>

      {/* Tab 1: Driver Intelligence Telematics */}
      {mode === 'driver-intelligence' && <DriverIntelligenceView />}

      {/* Tab 2: Proactive Optimization Hub */}
      {mode === 'ai-hub' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-400" /> Pusat Rekomendasi Kecerdasan Buatan AI
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rekomendasi proaktif berbasis algoritma pembelajaran armada untuk efisiensi BBM, pemeliharaan prediktif, dan optimasi rute.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {aiInsights.map((ins) => (
              <div
                key={ins.id}
                className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 backdrop-blur-md space-y-4 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{ins.title}</h3>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                        Kategori: {ins.category} • Keparahan: {ins.severity}
                      </p>
                    </div>
                  </div>
                  {ins.potentialSavingsIdr && (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-right">
                      <p className="text-[10px] text-emerald-400 font-bold uppercase">Potensi Penghematan</p>
                      <p className="text-sm font-bold text-emerald-300">Rp {ins.potentialSavingsIdr.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs leading-relaxed">
                  <p className="text-white font-semibold text-sm">{ins.summary}</p>
                  <p className="text-slate-300">{ins.explanation}</p>
                </div>

                <div className="rounded-xl bg-cyan-950/40 p-3.5 border border-cyan-500/20 text-xs text-cyan-200">
                  <strong className="text-cyan-400 font-bold">Rekomendasi Tindakan AI:</strong> {ins.recommendation}
                </div>

                {ins.dataPoints && ins.dataPoints.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-slate-800 pt-3">
                    {ins.dataPoints.map((dp, dIdx) => (
                      <div key={dIdx} className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
                        <p className="text-[10px] text-slate-400">{dp.label}</p>
                        <p className="font-bold text-white mt-0.5">{dp.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Vehicle Risk Scoring Matrix */}
      {mode === 'vehicle-risk' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800/80 pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-rose-400" /> Matriks Skor Risiko Kendaraan Multi-Modul
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Korelasi silang risiko telematika: Peringatan Sensor, Kesehatan Komponen, Riwayat Defek Inspeksi, dan Insiden Safety.
              </p>
            </div>

            {/* Filter Buttons & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari plat nomor..."
                  value={searchRiskQuery}
                  onChange={(e) => setSearchRiskQuery(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                    riskFilter === lvl
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRisks.map((vr) => (
              <div
                key={vr.vehicleId}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">{vr.plateNumber}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{vr.brand} {vr.model} • ID: {vr.vehicleId}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        vr.riskLevel === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : vr.riskLevel === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : vr.riskLevel === 'MEDIUM'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      Skor: {vr.riskScore}/100 ({vr.riskLevel})
                    </span>
                  </div>
                </div>

                {/* Sub-Score Bars */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/80">
                    <p className="text-slate-400 text-[10px]">GPS Anomalies</p>
                    <p className="font-bold text-amber-400">{vr.factors.gpsAnomalies}/100</p>
                  </div>
                  <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/80">
                    <p className="text-slate-400 text-[10px]">Maintenance Due</p>
                    <p className="font-bold text-cyan-400">{vr.factors.maintenanceOverdue}/100</p>
                  </div>
                  <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/80">
                    <p className="text-slate-400 text-[10px]">Inspection Defects</p>
                    <p className="font-bold text-rose-400">{vr.factors.inspectionDefects}/100</p>
                  </div>
                  <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/80">
                    <p className="text-slate-400 text-[10px]">Safety Behavior</p>
                    <p className="font-bold text-emerald-400">{vr.factors.safetyIncidents}/100</p>
                  </div>
                </div>

                {/* Key Issues */}
                <div className="space-y-1 text-xs">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Faktor Risiko Utama:</p>
                  {vr.keyIssues.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Mitigation */}
                <div className="rounded-xl bg-cyan-950/30 p-2.5 border border-cyan-500/20 text-xs text-cyan-200">
                  <strong className="text-cyan-400 font-bold">Rekomendasi Tindakan:</strong> {vr.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI Observability, Audit Logs & Provider Health */}
      {mode === 'ai-observability' && (
        <div className="space-y-6">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" /> AI Observabilitas, Audit Trail & Manajemen Biaya
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparansi penuh atas pemakaian token Gemini, estimasi biaya, latensi orkestrasi, dan riwayat otorisasi RBAC.
            </p>
          </div>

          {/* Metrics KPIs Row */}
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Permintaan AI</span>
                  <Layers className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-white">{metrics.totalRequests}</p>
                <p className="text-[10px] text-slate-500">Periode 30 hari aktif</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Token AI</span>
                  <Cpu className="h-4 w-4 text-indigo-400" />
                </div>
                <p className="text-2xl font-black text-indigo-300">{metrics.totalTokens.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">Gemini 2.5 Flash context</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Estimasi Biaya Token</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-emerald-300">
                  Rp {metrics.totalEstimatedCostIdr.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">Biaya efisien per token</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Success Rate / SLA</span>
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-cyan-300">
                  {(metrics.providerSuccessRate.overall * 100).toFixed(1)}%
                </p>
                <p className="text-[10px] text-slate-500">Circuit breaker auto-fallback</p>
              </div>
            </div>
          )}

          {/* Multi-Provider Health Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" /> Status Multi-Provider & Circuit Breaker Health
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {providerHealth.map((p) => (
                <div
                  key={p.provider}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{p.provider}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        p.status === 'ONLINE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Model: {p.model}</span>
                    <span>Latensi: {p.latencyAvgMs} ms</span>
                    <span>Tingkat Keberhasilan: {(p.successRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" /> Log Jejak Audit AI Real-Time (Tanpa Data Rahasia)
              </h3>
              <span className="text-xs text-slate-400">{auditLogs.length} entri tercatat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] uppercase text-slate-400 font-bold bg-slate-950/50">
                  <tr>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Pengguna</th>
                    <th className="p-3">Kapabilitas & Intent</th>
                    <th className="p-3">Ringkasan Input</th>
                    <th className="p-3">Provider & Model</th>
                    <th className="p-3">Tools Digunakan</th>
                    <th className="p-3">Risiko</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 whitespace-nowrap text-[11px] text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <p className="font-bold text-white">{log.userName}</p>
                        <p className="text-[10px] text-slate-500">{log.userRole}</p>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-semibold text-cyan-300 border border-cyan-500/20 text-[10px]">
                          {log.capability || log.action}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate text-slate-300">{log.inputSummary}</td>
                      <td className="p-3 whitespace-nowrap text-[11px] font-mono text-slate-400">
                        {log.model} ({log.latencyMs}ms)
                      </td>
                      <td className="p-3 text-[10px] text-slate-400">
                        {log.toolsUsed?.join(', ') || '-'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            log.riskLevel === 'HIGH' || log.riskLevel === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {log.riskLevel}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{log.executionStatus}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
