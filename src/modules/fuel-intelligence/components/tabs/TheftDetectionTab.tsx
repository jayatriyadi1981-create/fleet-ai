/**
 * Fleet Intelligence Smart AI - Fuel Theft Detection Tab
 * Multi-source rule-based telematics assessing stationary ignition-off drops,
 * geofencing breaches, and transaction mismatches.
 *
 * PROMPT 30 MANDATORY SAFETY DIRECTIVE:
 * Never declare theft as confirmed fact; always frame as "Potential Fuel Theft Indicator"
 * requiring human physical investigation.
 */

import React from 'react';
import { FuelTheftIndicator, FuelFilterState } from '../../types';
import { ShieldAlert, AlertTriangle, Sparkles, CheckCircle2, MapPin, Eye, FileText, Info } from 'lucide-react';

interface TheftDetectionTabProps {
  theftIndicators: FuelTheftIndicator[];
  onOpenReview: (indicator: FuelTheftIndicator) => void;
  onExplainWithAI: (topic: string, subject: string) => void;
}

export const TheftDetectionTab: React.FC<TheftDetectionTabProps> = ({
  theftIndicators,
  onOpenReview,
  onExplainWithAI,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Mandatory Legal & Safety Disclaimer Banner */}
      <div className="rounded-2xl bg-amber-950/40 border border-amber-500/40 p-4 shadow-lg flex items-start gap-3.5 text-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-amber-300">Pemberitahuan Kepatuhan & Keamanan AI (Safety Protocol)</h4>
          <p className="leading-relaxed text-amber-200/90 font-sans">
            Seluruh data pada modul ini merupakan <strong>Indikator Potensi Anomali Penurunan Bahan Bakar</strong> yang dihitung secara analitik oleh telemetri sensor dan GPS.
            AI <strong>tidak menyatakan tuduhan pencurian secara mutlak</strong> tanpa verifikasi bukti fisik, klarifikasi pengemudi, dan audit struk SPBU oleh manajer armada.
          </p>
        </div>
      </div>

      {/* 2. Theft Indicators List */}
      <div className="space-y-4">
        {theftIndicators.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-300">Tidak ada indikator kecurigaan penurunan BBM</p>
            <p className="text-xs text-slate-500">Semua perubahan level BBM terverifikasi dalam aktivitas operasional normal.</p>
          </div>
        ) : (
          theftIndicators.map((indicator) => {
            const isHigh = indicator.riskLevel === 'HIGH' || indicator.riskLevel === 'CRITICAL';

            return (
              <div
                key={indicator.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isHigh
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-white">
                          {indicator.plateNumber}
                        </span>
                        <span className="text-xs text-slate-400">
                          (Driver: {indicator.driverName || 'Belum Terdata'})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span>{indicator.locationName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">Kekuatan Deteksi</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {indicator.detectionStrengthScore}/100 Conf.
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                        indicator.riskLevel === 'CRITICAL'
                          ? 'bg-rose-600/30 text-rose-300 border-rose-500'
                          : indicator.riskLevel === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      RISIKO: {indicator.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Evidence Matrix */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                    <span>Daftar Bukti Telemetri Pendukung:</span>
                    <span className="text-rose-400 font-bold">
                      Drop: -{indicator.fuelDropLiters} Liter ({indicator.fuelDropPercentage}%)
                    </span>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                    {indicator.evidenceList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Operator notes if present */}
                {indicator.operatorNotes && (
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
                    <strong>Catatan Investigasi:</strong> {indicator.operatorNotes} ({indicator.reviewedBy})
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Waktu: {new Date(indicator.timestamp).toLocaleString('id-ID')} WIB
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onExplainWithAI('THEFT', `Indikator Penurunan Solar ${indicator.plateNumber}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> AI Audit Breakdown
                    </button>
                    <button
                      onClick={() => onOpenReview(indicator)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> Buka Form Investigasi
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
