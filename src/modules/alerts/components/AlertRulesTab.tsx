/**
 * Fleet Intelligence Smart AI - Alert Rules Management Tab Component
 */

import React, { useState } from 'react';
import { AlertRule } from '../types';
import { alertRuleService } from '../services/alertRuleService';
import {
  Plus,
  Sliders,
  Copy,
  History,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

interface AlertRulesTabProps {
  rules: AlertRule[];
  onToggleRule: (ruleId: string, enabled: boolean) => void;
  onDuplicateRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onEditRule: (rule: AlertRule) => void;
  onCreateRule: () => void;
}

export const AlertRulesTab: React.FC<AlertRulesTabProps> = ({
  rules,
  onToggleRule,
  onDuplicateRule,
  onDeleteRule,
  onEditRule,
  onCreateRule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedVersionRule, setSelectedVersionRule] = useState<AlertRule | null>(null);

  const filteredRules = rules.filter((r) => {
    if (selectedTypeFilter !== 'ALL' && r.type !== selectedTypeFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      return matchName || matchDesc;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-4 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama aturan pemicu atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Semua Jenis Telematika</option>
            <option value="OVERSPEED">Overspeed</option>
            <option value="IDLE">Idle</option>
            <option value="DEVICE_OFFLINE">GPS Offline</option>
            <option value="GEOFENCE">Geofence</option>
            <option value="ROUTE_DEVIATION">Route Deviation</option>
            <option value="IGNITION">Ignition</option>
            <option value="TEMPERATURE">Temperature</option>
            <option value="PANIC">SOS Panic</option>
          </select>
        </div>

        <button
          onClick={onCreateRule}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Buat Rule Baru
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Nama Rule & Deskripsi</th>
                <th className="p-3.5">Jenis Alert</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Durasi & Cooldown</th>
                <th className="p-3.5">Aksi Notifikasi</th>
                <th className="p-3.5">Status Active</th>
                <th className="p-3.5 text-right">Kelola</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-xs flex items-center gap-2">
                      {rule.name}
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                        v{rule.version}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{rule.description}</p>
                  </td>

                  <td className="p-3.5 font-bold text-indigo-400">{rule.type}</td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase ${
                        rule.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : rule.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    <div>Durasi: {rule.durationSeconds}s</div>
                    <div className="text-[10px] text-slate-500">Cooldown: {rule.cooldownSeconds}s</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {rule.actions.map((act) => (
                        <span key={act} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {act}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <button
                      onClick={() => onToggleRule(rule.id, !rule.enabled)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.enabled ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          rule.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => onEditRule(rule)}
                      title="Edit Rule"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDuplicateRule(rule.id)}
                      title="Duplikasi Rule"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedVersionRule(rule)}
                      title="Histori Versi Rule"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-all"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      title="Hapus Rule"
                      className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Version History Modal */}
      {selectedVersionRule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                Audit Versi Rule ({selectedVersionRule.name})
              </h3>
              <button
                onClick={() => setSelectedVersionRule(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 max-h-60 overflow-y-auto pr-1">
              {alertRuleService.getRuleVersions(selectedVersionRule.id).map((v) => (
                <div key={v.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400">Versi {v.version}</span>
                    <span className="text-[10px] text-slate-500">{new Date(v.createdAt).toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Dibuat oleh: {v.createdBy}</p>
                </div>
              ))}

              {alertRuleService.getRuleVersions(selectedVersionRule.id).length === 0 && (
                <div className="text-slate-500 text-center py-4">Versi awal (v1) belum memiliki riwayat perubahan sebelumnya.</div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedVersionRule(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
