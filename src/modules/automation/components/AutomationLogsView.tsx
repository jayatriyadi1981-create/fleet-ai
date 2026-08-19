/**
 * Fleet Intelligence Smart AI - Automation Execution Logs & Audit Trail View
 * PROMPT 35 - Section 80
 */

import React, { useState, useMemo } from 'react';
import {
  ListChecks,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  Terminal,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { AutomationExecution } from '../types';

interface AutomationLogsViewProps {
  filterFailedOnly?: boolean;
}

export const AutomationLogsView: React.FC<AutomationLogsViewProps> = ({
  filterFailedOnly = false,
}) => {
  const { executions, selectedExecution, setSelectedExecution, retryFailedExecution } =
    useAutomation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(filterFailedOnly ? 'FAILED' : 'ALL');
  const [isRetrying, setIsRetrying] = useState<string | null>(null);
  const [retrySuccessMsg, setRetrySuccessMsg] = useState<string | null>(null);
  const [rawJsonView, setRawJsonView] = useState(false);

  const filteredExecutions = useMemo(() => {
    return executions.filter((e) => {
      const matchesSearch =
        e.automationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.entityLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.eventType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'FAILED'
          ? e.status === 'FAILED'
          : statusFilter === 'SUCCESS'
          ? e.status === 'SUCCESS'
          : statusFilter === 'DRY_RUN'
          ? e.triggeredBy === 'SIMULATION'
          : true;

      return matchesSearch && matchesStatus;
    });
  }, [executions, searchQuery, statusFilter]);

  const handleRetry = async (executionId: string) => {
    setIsRetrying(executionId);
    try {
      const newExec = await retryFailedExecution(executionId);
      setRetrySuccessMsg(`Eksekusi #${executionId} berhasil di-retry! Status baru: ${newExec.status}`);
      setSelectedExecution(newExec);
      setTimeout(() => setRetrySuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Gagal me-retry eksekusi: ${err.message}`);
    } finally {
      setIsRetrying(null);
    }
  };

  const handleExportCsv = () => {
    const headers = 'ID,AutomationName,EventType,Entity,Status,DurationMs,AITokens,StartedAt,TriggeredBy\n';
    const rows = filteredExecutions
      .map(
        (e) =>
          `"${e.id}","${e.automationName}","${e.eventType}","${e.entityLabel}","${e.status}",${e.durationMs},${e.aiTokensUsed || 0},"${e.startedAt}","${e.triggeredBy}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `automation_executions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="automation-logs-view" className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ListChecks className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {filterFailedOnly ? 'Failed Automations & Incident Audit' : 'Audit Trail & Execution Logs'} ({filteredExecutions.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Riwayat lengkap eksekusi DAG, evaluasi aturan kondisi, inferensi AI, dan status pengiriman aksi otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor CSV
          </button>
        </div>
      </div>

      {retrySuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {retrySuccessMsg}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari log berdasarkan ID eksekusi, nama workflow, plat kendaraan, atau driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED (Gagal)</option>
            <option value="DRY_RUN">DRY-RUN / Simulasi</option>
          </select>
        </div>
      </div>

      {/* Two-column layout: Left (List table), Right (Detail Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Execution Log Table (7 Cols) */}
        <div className={`${selectedExecution ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Alur Automasi</th>
                    <th className="p-3">Entitas</th>
                    <th className="p-3">Durasi / AI</th>
                    <th className="p-3">Waktu</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredExecutions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        Tidak ada log eksekusi yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredExecutions.map((exec) => {
                      const isSelected = selectedExecution?.id === exec.id;
                      return (
                        <tr
                          key={exec.id}
                          onClick={() => setSelectedExecution(exec)}
                          className={`cursor-pointer transition hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 ${
                            isSelected ? 'bg-indigo-50 dark:bg-indigo-950/40 font-semibold' : ''
                          }`}
                        >
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                exec.status === 'SUCCESS'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  : exec.status === 'FAILED'
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {exec.status}
                            </span>
                          </td>

                          <td className="p-3 max-w-[180px]">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {exec.automationName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {exec.eventType}
                            </div>
                          </td>

                          <td className="p-3 max-w-[140px]">
                            <div className="truncate font-medium text-slate-800 dark:text-slate-200">
                              {exec.entityLabel}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {exec.branchId}
                            </div>
                          </td>

                          <td className="p-3 whitespace-nowrap">
                            <div className="font-mono text-[11px]">{exec.durationMs} ms</div>
                            {exec.aiTokensUsed ? (
                              <div className="text-[10px] text-indigo-500 font-medium flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                {exec.aiTokensUsed} tk
                              </div>
                            ) : null}
                          </td>

                          <td className="p-3 whitespace-nowrap text-[11px] text-slate-400">
                            {new Date(exec.startedAt).toLocaleTimeString('id-ID')}
                          </td>

                          <td className="p-3 text-right whitespace-nowrap">
                            {exec.status === 'FAILED' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetry(exec.id);
                                }}
                                disabled={isRetrying === exec.id}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/30 transition flex items-center gap-1 shadow-xs ml-auto"
                              >
                                <RotateCcw
                                  className={`w-3 h-3 ${isRetrying === exec.id ? 'animate-spin' : ''}`}
                                />
                                Retry
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Execution Inspector Drawer (6 Cols) */}
        {selectedExecution && (
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Detail Eksekusi #{selectedExecution.id}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        selectedExecution.status === 'SUCCESS'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {selectedExecution.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedExecution.automationName} • Dipicu oleh: <b>{selectedExecution.triggeredBy}</b>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setRawJsonView(!rawJsonView)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
                  >
                    <Terminal className="w-3 h-3 text-indigo-500" />
                    {rawJsonView ? 'Visual Steps' : 'JSON'}
                  </button>
                  <button
                    onClick={() => setSelectedExecution(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Execution Summary Matrix */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Durasi</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedExecution.durationMs} ms
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">AI Tokens</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedExecution.aiTokensUsed || 0} tokens
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Estimasi Biaya</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {(selectedExecution.estimatedCostIdr || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {selectedExecution.error && (
                <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                  <b>Penyebab Kegagalan:</b> {selectedExecution.error}
                </div>
              )}

              {rawJsonView ? (
                <div className="bg-slate-950 p-3 rounded-xl max-h-96 overflow-y-auto">
                  <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap">
                    {JSON.stringify(selectedExecution, null, 2)}
                  </pre>
                </div>
              ) : (
                /* Step-by-Step Execution Trace */
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Jejak Langkah Pipeline ({selectedExecution.steps.length} Langkah):
                  </span>
                  {selectedExecution.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {step.nodeLabel}
                          </span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
                            {step.nodeType}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {step.durationMs}ms
                        </span>
                      </div>

                      {step.conditionResult && (
                        <div className="text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          Evaluasi Aturan: <b>{step.conditionResult.passed ? '✓ PASSED' : '✗ FAILED'}</b>
                        </div>
                      )}

                      {step.aiResult && (
                        <div className="text-[11px] bg-indigo-50/60 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-200/60 dark:border-indigo-900/60 text-slate-700 dark:text-slate-300 space-y-1">
                          <div className="font-bold text-indigo-700 dark:text-indigo-300">
                            AI Reasoning ({step.aiResult.risk} Risk, Confidence {Math.round(step.aiResult.confidence * 100)}%):
                          </div>
                          <p className="italic">{step.aiResult.reason}</p>
                        </div>
                      )}

                      {step.actionResult && (
                        <div className="text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          Aksi: <b>{step.actionResult.summary || 'Aksi berhasil dieksekusi'}</b>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedExecution.status === 'FAILED' && (
                <button
                  onClick={() => handleRetry(selectedExecution.id)}
                  disabled={isRetrying === selectedExecution.id}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  Coba Eksekusi Ulang Sekarang (Manual Retry)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
