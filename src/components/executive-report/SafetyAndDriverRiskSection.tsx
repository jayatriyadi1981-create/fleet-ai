/**
 * Fleet Intelligence Smart AI - Safety & Driver Risk Section
 * PROMPT 52 — C-Level Safety, Risk HSE, Driver Behavior & Near-Miss Intelligence
 */

import React from 'react';
import { ShieldCheck, AlertTriangle, UserCheck, ShieldAlert, Zap, FileText, ChevronRight } from 'lucide-react';
import { ExecutiveKPIs } from '../../types/executiveReport';

interface SafetyAndDriverRiskSectionProps {
  kpis: ExecutiveKPIs;
  onViewEvidence: (evidenceIds: string[], title: string) => void;
  onWhyClick: (category: string, title: string) => void;
}

export const SafetyAndDriverRiskSection: React.FC<SafetyAndDriverRiskSectionProps> = ({
  kpis,
  onViewEvidence,
  onWhyClick,
}) => {
  const highRiskDrivers = [
    {
      id: 'DRV-003',
      name: 'Rudi Hermawan',
      safetyScore: 74,
      overspeedEvents: 18,
      harshBraking: 9,
      fatigueAlerts: 4,
      assignedVehicle: 'B 9281 UTX',
      status: 'Perlu Coaching Eco-Driving',
      evidenceIds: ['EVD-SAFETY-004'],
    },
    {
      id: 'DRV-008',
      name: 'Agus Santoso',
      safetyScore: 78,
      overspeedEvents: 12,
      harshBraking: 14,
      fatigueAlerts: 3,
      assignedVehicle: 'B 9655 UTZ',
      status: 'Perlu Pengawasan Idle Time',
      evidenceIds: ['EVD-FUEL-001'],
    },
    {
      id: 'DRV-014',
      name: 'Bambang Tri',
      safetyScore: 79,
      overspeedEvents: 9,
      harshBraking: 11,
      fatigueAlerts: 2,
      assignedVehicle: 'L 8102 UXA',
      status: 'Peringatan Akselerasi Curam',
      evidenceIds: ['EVD-SAFETY-004'],
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Keselamatan & Manajemen Risiko Pengemudi (HSE)</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                Safety Score {kpis.fleetSafetyScore}/100
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluasi kepatuhan keselamatan, deteksi risiko kelelahan pengemudi, dan pencegahan insiden fatal
            </p>
          </div>
        </div>

        <button
          onClick={() => onWhyClick('safety', 'Evaluasi Klaster Overspeed Tol Cipali')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Analisa Klaster Risiko</span>
        </button>
      </div>

      {/* Safety Score Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tingkat Kecelakaan Fatal</span>
          <div className="text-2xl font-bold text-emerald-400">0 Kasus (Nihil)</div>
          <p className="text-[11px] text-slate-400">Zero Fatality Record di seluruh cabang</p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Insiden Ringan & Minor</span>
          <div className="text-2xl font-bold text-slate-200">{kpis.incidentCount} Kasus</div>
          <p className="text-[11px] text-slate-400">Goresan bumper saat manuver bongkar muat</p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Near-Miss Telematika</span>
          <div className="text-2xl font-bold text-amber-400">{kpis.nearMissCount} Kejadian</div>
          <p className="text-[11px] text-slate-400">Pengereman mendadak (Harsh Braking &gt;0.4g)</p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Peringatan Kelelahan (Fatigue)</span>
          <div className="text-2xl font-bold text-rose-400">{kpis.fatigueAlertsCount} Alerts</div>
          <p className="text-[11px] text-slate-400">Kamera AI ADAS mendeteksi microsleep/kantuk</p>
        </div>
      </div>

      {/* High-Risk Drivers Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Daftar Pengemudi yang Memerlukan Pembinaan Khusus ({highRiskDrivers.length} Driver):
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Nama Pengemudi</th>
                <th className="py-2.5 px-3 text-center">Safety Score</th>
                <th className="py-2.5 px-3 text-right">Overspeed (&gt;80 km/h)</th>
                <th className="py-2.5 px-3 text-right">Harsh Braking</th>
                <th className="py-2.5 px-3 text-right">Fatigue Alerts</th>
                <th className="py-2.5 px-3">Kendaraan Utama</th>
                <th className="py-2.5 px-3">Status Tindak Lanjut</th>
                <th className="py-2.5 px-3 text-center">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {highRiskDrivers.map(d => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="py-3 px-3 font-semibold text-slate-100">
                    <div>{d.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{d.id}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {d.safetyScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400 font-semibold">{d.overspeedEvents}x</td>
                  <td className="py-3 px-3 text-right text-slate-300">{d.harshBraking}x</td>
                  <td className="py-3 px-3 text-right text-amber-400">{d.fatigueAlerts}x</td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-xs">{d.assignedVehicle}</td>
                  <td className="py-3 px-3 text-xs text-cyan-400 font-medium">{d.status}</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onViewEvidence(d.evidenceIds, `Data Telematika Driver ${d.name}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all border border-slate-700"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
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
