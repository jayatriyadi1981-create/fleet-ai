/**
 * Fleet Intelligence Smart AI - Fuel Anomalies Tab
 * Displays timeline and audit logs of unusual fuel drops, spikes, flatlines,
 * and refueling mismatches with operator investigation workflows.
 */

import React, { useState } from 'react';
import { FuelAnomalyItem, FuelAnomalySeverity, AnomalyInvestigationStatus } from '../../types';
import { AlertOctagon, Filter, Search, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Eye, HelpCircle } from 'lucide-react';

interface AnomaliesTabProps {
  anomalies: FuelAnomalyItem[];
  onOpenReview: (anomaly: FuelAnomalyItem) => void;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const AnomaliesTab: React.FC<AnomaliesTabProps> = ({
  anomalies,
  onOpenReview,
  onExplainWithAI,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = anomalies.filter((a) => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (
      searchTerm &&
      !a.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !a.locationName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !a.anomalyType.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">Semua Status Audit</option>
            <option value="NEW">Baru (NEW)</option>
            <option value="UNDER_REVIEW">Dalam Investigasi</option>
            <option value="VERIFIED">Terverifikasi Valid</option>
            <option value="FALSE_POSITIVE">False Positive</option>
            <option value="RESOLVED">Selesai (Resolved)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nopol atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Anomaly Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-300">Tidak ada anomali yang sesuai filter</p>
            <p className="text-xs text-slate-500">Semua sensor dan pola konsumsi beroperasi dalam batas normal.</p>
          </div>
        ) : (
          filtered.map((anomaly) => {
            const isCritical = anomaly.severity === 'CRITICAL';
            const isHigh = anomaly.severity === 'HIGH';

            return (
              <div
                key={anomaly.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl border ${
                        isCritical
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : isHigh
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      <AlertOctagon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {anomaly.plateNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ({anomaly.anomalyType})
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {anomaly.locationName} • {new Date(anomaly.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      Skor Anomali: {anomaly.anomalyScore}/100
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                        anomaly.status === 'NEW'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : anomaly.status === 'UNDER_REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : anomaly.status === 'VERIFIED'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {anomaly.status}
                    </span>
                  </div>
                </div>

                {/* Evidence Box */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Bukti Telemetri Sensor Tangki:</span>
                    <span className="text-cyan-400 font-bold">Kualitas Bukti: {anomaly.evidenceQuality}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {anomaly.evidenceDescription}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
                    <span>Ignition: <strong className={anomaly.ignitionStatus ? 'text-amber-400' : 'text-slate-300'}>{anomaly.ignitionStatus ? 'ON (Hidup)' : 'OFF (Mati)'}</strong></span>
                    <span>Kecepatan: <strong>{anomaly.speedKmH} km/h</strong></span>
                    <span>Perubahan Level: <strong className="text-rose-400">{anomaly.fuelDifferenceLiters} Liter ({anomaly.fuelDifferencePercentage}%)</strong></span>
                    {anomaly.maintenanceCorrelation && (
                      <span className="text-amber-300">🔧 {anomaly.maintenanceCorrelation}</span>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {anomaly.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onExplainWithAI('ANOMALY', `Anomali BBM ${anomaly.plateNumber}`)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Explain With AI
                    </button>
                    <button
                      onClick={() => onOpenReview(anomaly)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> Investigasi & Catatan
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
