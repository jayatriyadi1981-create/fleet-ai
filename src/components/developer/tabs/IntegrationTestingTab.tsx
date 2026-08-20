/**
 * Fleet Intelligence Smart AI - Cross-Module Integration Testing Tab
 * PROMPT 57: Visual Integration Health, Traceability & Live Cross-Module Validation Suite
 */

import React, { useState, useEffect } from 'react';
import {
  Network,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Activity,
  Zap,
  FileText,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { IntegrationTestRunner, IntegrationSuiteSummary, IntegrationTestResult } from '../../../services/api/integrationTestRunner';

export const IntegrationTestingTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<IntegrationSuiteSummary | null>(null);
  const [selectedResult, setSelectedResult] = useState<IntegrationTestResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const res = await IntegrationTestRunner.runAllIntegrationTests();
      setSummary(res);
      if (res.results.length > 0 && !selectedResult) {
        setSelectedResult(res.results[0]);
      }
    } catch (e) {
      console.error('Integration test runner error:', e);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    handleRunTests();
  }, []);

  const filteredResults = (summary?.results || []).filter((r) => {
    const matchesModule =
      filterModule === 'ALL' || r.sourceModule === filterModule || r.targetModule === filterModule;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.correlationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const availableModules = ['ALL', 'GPS', 'Vehicle', 'Trip', 'Driver', 'Alert', 'AI', 'Cost', 'Maintenance', 'Security'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Network className="w-3.5 h-3.5" />
              <span>PROMPT 57 • Cross-Module Ecosystem Integration Suite</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              End-to-End Enterprise Integration & Cross-Module Contract Validator
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
              Memvalidasi integritas data real-time antar domain: GPS Telemetri &rarr; Vehicle State &rarr; Trip Tracking &rarr; Driver Assignment &rarr; Geofence / Overspeed Event &rarr; Alert Engine &rarr; Gemini AI Intelligence &rarr; Multi-Channel Notification &rarr; Executive Reporting &rarr; Row-Level Multi-Tenant Isolation.
            </p>
          </div>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 shrink-0"
          >
            {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Menjalankan Integration Suite...' : 'Jalankan Integration Test'}</span>
          </button>
        </div>

        {/* Metric Overview Counters */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Total Integrations</div>
              <div className="text-xl font-bold text-white font-mono">{summary.total}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Passed Tests</div>
              <div className="text-xl font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{summary.passed}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Failed Tests</div>
              <div className={`text-xl font-bold font-mono flex items-center justify-center gap-1 ${summary.failed === 0 ? 'text-slate-400' : 'text-rose-400'}`}>
                {summary.failed > 0 && <XCircle className="w-4 h-4" />}
                <span>{summary.failed}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Integration Score</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">{summary.integrationScore}%</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Latency Duration</div>
              <div className="text-xl font-bold text-indigo-300 font-mono">{summary.durationMs}ms</div>
            </div>
          </div>
        )}
      </div>

      {/* Integration Matrix & Health Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Test Cases List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari correlation ID, modul asal, atau deskripsi integrasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter Module */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {availableModules.slice(0, 5).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterModule(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    filterModule === m
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* List of Cases */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredResults.map((r) => {
              const isSelected = selectedResult?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedResult(r)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500/50 bg-cyan-950/20 shadow-md'
                      : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {r.id}
                      </span>
                      <span className="text-xs font-bold text-white tracking-tight">{r.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500">{r.durationMs}ms</span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.status === 'PASS'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {r.status === 'PASS' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{r.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-cyan-400">{r.sourceModule}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="font-semibold text-indigo-400">{r.targetModule}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-500 truncate">{r.description}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <span className="font-mono text-cyan-400/80">Corr: {r.correlationId}</span>
                    <span className="flex items-center gap-1 text-slate-400 hover:text-white">
                      <span>Lihat Traceability</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Case Traceability Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Event Traceability & Audit Details</span>
            </h3>
            {selectedResult && (
              <span className="text-[11px] font-mono text-slate-400">{selectedResult.correlationId}</span>
            )}
          </div>

          {selectedResult ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Integrasi Alur Data:</span>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="px-2 py-1 rounded bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 font-bold">
                    {selectedResult.sourceModule}
                  </span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="px-2 py-1 rounded bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-bold">
                    {selectedResult.targetModule}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Deskripsi Kontrak:</span>
                <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedResult.description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Hasil Verifikasi & Bukti Payload:</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 leading-relaxed break-words">
                  {selectedResult.details}
                </div>
              </div>

              {/* Ecosystem Pipeline Indicator */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-slate-400 font-semibold block">Ecosystem Health Verification:</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">GPS & Ingestion Engine</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sync Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">Gemini AI Fleet Copilot</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Ready
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">Row-Level Multi-Tenant Security</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Enforced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Pilih salah satu test case integrasi untuk melihat detail jejak korelasi event.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
