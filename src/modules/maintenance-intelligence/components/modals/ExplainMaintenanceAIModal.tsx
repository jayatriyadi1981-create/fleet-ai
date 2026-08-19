/**
 * Fleet Intelligence Smart AI - Explain Maintenance AI Modal
 * Deep-dive explainability breakdown answering:
 * 1. What is the risk?
 * 2. Why was it detected?
 * 3. What evidence supports it?
 * 4. What data was used?
 * 5. How good is the data?
 * 6. What should the operator do next?
 */

import React, { useState } from 'react';
import { VehicleMaintenanceProfile, EvidenceItem } from '../../types';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Gauge, 
  CheckCircle2, 
  Clock, 
  Activity,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Fuel,
  UserCheck,
  Wrench
} from 'lucide-react';

interface ExplainMaintenanceAIModalProps {
  profile: VehicleMaintenanceProfile;
  isOpen: boolean;
  onClose: () => void;
  onRequestWorkOrder?: (vehicleId: string) => void;
}

export const ExplainMaintenanceAIModal: React.FC<ExplainMaintenanceAIModalProps> = ({
  profile,
  isOpen,
  onClose,
  onRequestWorkOrder,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'REASONING' | 'EVIDENCE' | 'CROSS_MODULE' | 'RECOMMENDED_STEPS'>('REASONING');

  if (!isOpen) return null;

  const isCritical = profile.riskLevel === 'CRITICAL';
  const isHigh = profile.riskLevel === 'HIGH';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Explain with AI — Maintenance Intelligence Reasoning
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Model v2.4.2-prod
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unit {profile.plateNumber} • {profile.brandModel} • {profile.branch}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-6 pb-4 bg-slate-900/60 border-b border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Health Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white font-mono">{profile.healthScore}</span>
              <span className="text-xs text-slate-500 font-mono">/100</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                profile.healthGrade === 'EXCELLENT' ? 'bg-emerald-500/20 text-emerald-300' :
                profile.healthGrade === 'GOOD' ? 'bg-cyan-500/20 text-cyan-300' :
                profile.healthGrade === 'ATTENTION' ? 'bg-amber-500/20 text-amber-300' :
                'bg-rose-500/20 text-rose-300'
              }`}>
                {profile.healthGrade}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Maintenance Risk</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold font-mono ${
                isCritical ? 'text-rose-400' : isHigh ? 'text-orange-400' : 'text-cyan-400'
              }`}>
                {profile.riskScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/100</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                isHigh ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {profile.riskLevel}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Data Quality & Telemetry</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-slate-200">
                {profile.telemetryOnline ? 'Online (Real-Time)' : 'Offline (Cached)'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Quality: {profile.dataQuality}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Predicted Risk Horizon</span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-300">
                {profile.activePredictions[0]?.horizonLabel || '30 Hari ke Depan'}
              </span>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/30">
          <button
            onClick={() => setActiveSubTab('REASONING')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === 'REASONING'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Multi-Domain Reasoning
          </button>
          <button
            onClick={() => setActiveSubTab('EVIDENCE')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === 'EVIDENCE'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Evidence & Telemetry Trace ({profile.activePredictions.flatMap(p => p.evidence).length})
          </button>
          <button
            onClick={() => setActiveSubTab('CROSS_MODULE')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === 'CROSS_MODULE'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cross-Module Correlations
          </button>
          <button
            onClick={() => setActiveSubTab('RECOMMENDED_STEPS')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeSubTab === 'RECOMMENDED_STEPS'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Operator Action Checklist
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeSubTab === 'REASONING' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4" />
                  Mengapa Kendaraan Ini Mendapatkan Skor Risiko {profile.riskScore}/100?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Berdasarkan pemrosesan telemetri mesin 24V, riwayat servis berkala, dan checklist inspeksi pengemudi:
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-1">
                  {profile.activePredictions.flatMap(p => p.evidence).map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-mono text-cyan-400 font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-slate-200">[{ev.source}]</strong> {ev.finding}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety Guidance Disclaimer */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <strong>Peringatan Keselamatan AI:</strong> Model AI memberikan indikator risiko dan estimasi probabilitas kegagalan komponen, bukan diagnosis mekanik akhir. Kendaraan harus diperiksa oleh teknisi tersertifikasi sebelum perubahan status operasional.
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'EVIDENCE' && (
            <div className="space-y-3">
              {profile.activePredictions.flatMap(p => p.evidence).map((ev, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        ev.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {ev.source}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Timestamp: {new Date(ev.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200">{ev.finding}</p>
                    {ev.metricValue && (
                      <div className="text-[11px] text-slate-400 font-mono">
                        Nilai Terbaca: <span className="text-cyan-300 font-semibold">{ev.metricValue}</span> | Ambang Normal: <span className="text-emerald-400">{ev.threshold || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                    Quality: {ev.dataQuality}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'CROSS_MODULE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                  <Fuel className="h-4 w-4" />
                  Korelasi AI Fuel Intelligence (PROMPT 30)
                </div>
                <p className="text-xs text-slate-300">
                  {profile.crossModuleSignals.fuelEfficiencyImpact || 'Konsumsi BBM dalam baseline normal.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                  <UserCheck className="h-4 w-4" />
                  Korelasi AI Driver Intelligence (PROMPT 29)
                </div>
                <p className="text-xs text-slate-300">
                  {profile.crossModuleSignals.driverBehaviorImpact || 'Gaya mengemudi tidak memberikan stres berlebih pada komponen.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <FileCheck className="h-4 w-4" />
                  Korelasi Vehicle Inspection (PROMPT 26)
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {profile.crossModuleSignals.inspectionFindings && profile.crossModuleSignals.inspectionFindings.length > 0 ? (
                    profile.crossModuleSignals.inspectionFindings.map((f, i) => <li key={i}>{f}</li>)
                  ) : (
                    <li>Tidak ada temuan cacat pada inspeksi harian.</li>
                  )}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Wrench className="h-4 w-4" />
                  Korelasi Maintenance History (PROMPT 25)
                </div>
                <p className="text-xs text-slate-300">
                  {profile.crossModuleSignals.repeatedFailureCount > 1
                    ? `Terdeteksi ${profile.crossModuleSignals.repeatedFailureCount} kali perbaikan berulang dalam 90 hari terakhir.`
                    : 'Riwayat servis berkala tercatat teratur tanpa pola perbaikan berulang.'}
                </p>
              </div>
            </div>
          )}

          {activeSubTab === 'RECOMMENDED_STEPS' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  Rekomendasi Tindakan Terstruktur untuk Operator / Fleet Manager
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="font-bold text-cyan-400">Step 1:</span>
                    <span>Verifikasi tegangan aki dan level pendingin sebelum melepas kendaraan ke rute antarkota.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="font-bold text-cyan-400">Step 2:</span>
                    <span>Setujui rekomendasi AI di bawah untuk membuat Work Order servis bengkel resmi.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="font-bold text-cyan-400">Step 3:</span>
                    <span>Pastikan suku cadang fast-moving (kampas rem/aki) tersedia di inventaris depo.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <span className="text-xs text-slate-400">
            AI Maintenance Engine • Deterministic Telematics Reasoning
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Tutup
            </button>
            {onRequestWorkOrder && (
              <button
                onClick={() => {
                  onClose();
                  onRequestWorkOrder(profile.vehicleId);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl shadow-md shadow-cyan-950 transition-all"
              >
                Buat Work Order Pemeliharaan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
