import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ArrowUpRight,
  Plus,
  Trash2,
  Edit3,
  Moon,
  Zap,
  ShieldAlert,
} from 'lucide-react';
import { NotificationRule } from '../../../modules/notifications/types/notificationEngineTypes';
import { notificationRuleEngine } from '../../../modules/notifications/core/NotificationRuleEngine';

export const NotificationRulesTab: React.FC = () => {
  const [rules, setRules] = useState<NotificationRule[]>(() =>
    notificationRuleEngine.getAllRules()
  );
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    const rule = notificationRuleEngine.getRuleById(ruleId);
    if (rule) {
      notificationRuleEngine.saveRule({ ...rule, enabled });
      setRules(notificationRuleEngine.getAllRules());
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    notificationRuleEngine.deleteRule(ruleId);
    setRules(notificationRuleEngine.getAllRules());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Notification Rules & Escalation Matrix</span>
          </h2>
          <p className="text-xs text-slate-400">
            Atur aturan pemicu cerdas, evaluasi kondisi telematika, deduplikasi (cooldown), dan eskalasi bertingkat jika peringatan tidak direspon.
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map(rule => (
          <div
            key={rule.id}
            className={`p-6 rounded-2xl bg-slate-900/90 border transition-all space-y-4 ${
              rule.enabled ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      rule.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : rule.severity === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}
                  >
                    {rule.severity} PRIORITY
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{rule.event}</span>
                </div>
                <h3 className="text-base font-bold text-white">{rule.name}</h3>
              </div>

              {/* Enable/Disable Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={e => handleToggleRule(rule.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Channels & Recipients */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">Channels Target:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {rule.channels.map(ch => (
                    <span
                      key={ch}
                      className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">Role Penerima:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {rule.recipientRoles.map(role => (
                    <span
                      key={role}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {role.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Conditions & Cooldown */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Deduplication Cooldown:</span>
                </span>
                <strong className="text-slate-200 font-mono">{rule.cooldownMinutes} menit</strong>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Quiet Hours Emergency Bypass:</span>
                </span>
                <span className={rule.allowQuietHoursBypass ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {rule.allowQuietHoursBypass ? 'YA (Bypass Aktif)' : 'TIDAK'}
                </span>
              </div>
            </div>

            {/* Escalation Policy info */}
            {rule.escalationPolicy?.enabled && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs flex items-center justify-between text-purple-200">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    Auto-Escalate ke <strong>{rule.escalationPolicy.escalateToRole}</strong> jika belum direspon dalam {rule.escalationPolicy.timeoutMinutes} menit.
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {rule.escalationPolicy.channels.map(c => (
                    <span key={c} className="text-[10px] font-mono px-1 rounded bg-purple-950 text-purple-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
