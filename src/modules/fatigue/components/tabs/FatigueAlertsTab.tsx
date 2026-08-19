/**
 * Fleet Intelligence Smart AI - Fatigue Alerts Management Tab
 * PROMPT 23 - Fatigue Alerts (/app/fatigue/alerts)
 */

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Bell, Info } from 'lucide-react';
import { FatigueAlert, FatigueAlertSeverity } from '../../types';

interface FatigueAlertsTabProps {
  alerts: FatigueAlert[];
  onAcknowledgeAlert: (alert: FatigueAlert) => void;
}

export const FatigueAlertsTab: React.FC<FatigueAlertsTabProps> = ({ alerts, onAcknowledgeAlert }) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    return severityFilter === 'all' || a.severity === severityFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Daftar Peringatan Risiko Kelelahan (Fatigue Alerts)</h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-xl">
          {['all', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                severityFilter === sev
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev === 'all' ? 'Semua Severity' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isExpanded = expandedAlertId === alert.id;

          return (
            <div
              key={alert.id}
              className={`p-5 bg-slate-900 border rounded-2xl transition-all space-y-3 ${
                alert.severity === 'CRITICAL' ? 'border-rose-500/40' :
                alert.severity === 'HIGH' ? 'border-orange-500/40' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                      alert.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      alert.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {alert.severity}
                    </span>
                    <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300">{alert.message}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-slate-500 block">
                    {new Date(alert.triggeredAt).toLocaleTimeString('id-ID')}
                  </span>
                  {!alert.acknowledged ? (
                    <button
                      onClick={() => onAcknowledgeAlert(alert)}
                      className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Acknowledge Alert
                    </button>
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>

              {/* Accordion Trigger Explanation */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span>Driver: <strong>{alert.driverName}</strong></span>
                  <span>•</span>
                  <span>Lokasi: {alert.currentLocation}</span>
                </span>

                <button
                  onClick={() => toggleExpand(alert.id)}
                  className="flex items-center gap-1 text-cyan-400 hover:underline font-medium"
                >
                  {isExpanded ? 'Sembunyikan Alasan Trigger' : 'Why was this alert triggered?'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {isExpanded && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <span className="font-semibold text-slate-300 block">Penjelasan Pemicu Aturan (Rule Trigger Factors):</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {alert.triggerExplanation.map((exp, idx) => (
                      <li key={idx}>{exp}</li>
                    ))}
                  </ul>

                  {alert.actionTaken && (
                    <div className="pt-2 border-t border-slate-800 text-emerald-400 font-medium">
                      Tindakan Supervisor Terlibat: {alert.actionTaken} ({alert.acknowledgedBy})
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
