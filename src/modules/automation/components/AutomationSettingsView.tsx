/**
 * Fleet Intelligence Smart AI - Automation Engine Settings & Global Configuration
 * PROMPT 35 - Settings & Governance
 */

import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  ShieldAlert,
  Webhook,
  MessageSquare,
  Send,
  Save,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
  Cpu,
  Coins,
  Radio,
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';

export const AutomationSettingsView: React.FC = () => {
  const { settings, updateSettings, auditLogs, healthStats } = useAutomation();

  const [formState, setFormState] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');

  const tokenUsagePercent = Math.min(
    100,
    Math.round((formState.aiTokenUsedThisMonth / formState.aiTokenMonthlyBudget) * 100)
  );

  const handleSave = () => {
    updateSettings(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredAuditLogs = auditLogs.filter(
    (l) =>
      l.workflowName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.changesSummary.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div id="automation-settings-view" className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Automation Engine Settings & Tata Kelola
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Konfigurasi batas laju eksekusi (rate limiting), anggaran token AI Gemini, integrasi webhook pesan, dan jejak audit tata kelola.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Save className="w-4 h-4" />
          Simpan Konfigurasi
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Pengaturan sistem automasi berhasil diperbarui dan diterapkan!
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): Engine Limits & AI Token Budget */}
        <div className="lg:col-span-6 space-y-6">
          {/* AI Token Budget Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Anggaran & Kuota AI Token Bulanan
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {tokenUsagePercent}% Terpakai
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Terpakai: <b>{formState.aiTokenUsedThisMonth.toLocaleString('id-ID')} tokens</b>
                </span>
                <span>
                  Batas: <b>{formState.aiTokenMonthlyBudget.toLocaleString('id-ID')} tokens</b>
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    tokenUsagePercent > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-500'
                  }`}
                  style={{ width: `${tokenUsagePercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Batas Anggaran Token AI Per Bulan (Tokens)
                </label>
                <input
                  type="number"
                  value={formState.aiTokenMonthlyBudget}
                  onChange={(e) =>
                    setFormState({ ...formState, aiTokenMonthlyBudget: parseInt(e.target.value, 10) || 100000 })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Engine Execution Rate Limits Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Batas Eksekusi & Idempotency Engine
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Global Cooldown Window (Detik per entitas)
                </label>
                <input
                  type="number"
                  value={formState.globalCooldownSeconds}
                  onChange={(e) =>
                    setFormState({ ...formState, globalCooldownSeconds: parseInt(e.target.value, 10) || 60 })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  Mencegah spam pemicuan aksi berulang untuk kendaraan yang sama dalam rentang detik ini.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Maksimal Eksekusi Per Menit (Throttling)
                </label>
                <input
                  type="number"
                  value={formState.maxExecutionsPerMinute}
                  onChange={(e) =>
                    setFormState({ ...formState, maxExecutionsPerMinute: parseInt(e.target.value, 10) || 30 })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Maintenance Mode Emergency Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 mt-2">
                <div>
                  <span className="font-bold text-amber-800 dark:text-amber-300 block">
                    Mode Pemeliharaan Darurat (Emergency Pause)
                  </span>
                  <span className="text-[11px] text-amber-700/80 dark:text-amber-400">
                    Menjeda sementara seluruh eksekusi aksi otomatis di semua workflow.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formState.maintenanceMode}
                  onChange={(e) => setFormState({ ...formState, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 Cols): Webhooks & Third-party Integrations */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Webhook className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Integrasi Webhook & Saluran Pesan
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-blue-500" />
                  Telematics Ingress Webhook Endpoint
                </label>
                <input
                  type="text"
                  value={formState.webhookEndpointUrl}
                  onChange={(e) => setFormState({ ...formState, webhookEndpointUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  Slack Incident Webhook URL
                </label>
                <input
                  type="text"
                  value={formState.slackWebhookUrl}
                  onChange={(e) => setFormState({ ...formState, slackWebhookUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  Telegram Alert Bot Token
                </label>
                <input
                  type="password"
                  placeholder="bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  value={formState.telegramBotToken}
                  onChange={(e) => setFormState({ ...formState, telegramBotToken: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Jejak Audit Perubahan Workflow ({auditLogs.length})
            </h3>
          </div>

          <input
            type="text"
            placeholder="Cari jejak audit..."
            value={auditSearch}
            onChange={(e) => setAuditSearch(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none w-full sm:w-60"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">Pengguna</th>
                <th className="p-3">Aksi</th>
                <th className="p-3">Alur Automasi</th>
                <th className="p-3">Ringkasan Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                    {log.userName}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap font-semibold">
                    {log.workflowName}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">
                    {log.changesSummary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
