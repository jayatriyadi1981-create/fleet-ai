/**
 * Accident AI Analysis Modal
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  FileQuestion,
  HelpCircle,
  TrendingDown,
  FileCheck,
  Building2
} from 'lucide-react';
import { Accident } from '../../../safety/types';
import { AccidentAnalysisEngine } from '../../engines/AccidentAnalysisEngine';

interface AccidentAIAnalysisModalProps {
  accident: Accident;
  onClose: () => void;
  onOpen5Why?: (accidentId: string) => void;
}

export const AccidentAIAnalysisModal: React.FC<AccidentAIAnalysisModalProps> = ({
  accident,
  onClose,
  onOpen5Why,
}) => {
  const analysis = AccidentAnalysisEngine.analyzeAccident(accident);
  const [activeTab, setActiveTab] = useState<'CRASH_SUMMARY' | 'TIMELINE' | 'EVIDENCE_MATRIX' | 'ROOT_CAUSE_HIERARCHY'>('CRASH_SUMMARY');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AI Accident Reconstruction & Root Cause Analysis</h3>
                <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {accident.incidentNumber}
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  {accident.severity}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Model: <span className="font-mono text-slate-300">{analysis.modelVersion}</span> • Status Investigasi: <span className="text-amber-400 font-semibold">{accident.status}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Nav */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-800 bg-slate-900/90 text-xs">
          <button
            onClick={() => setActiveTab('CRASH_SUMMARY')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'CRASH_SUMMARY'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Ringkasan & Telemetri Benturan
          </button>
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'TIMELINE'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Kurva Kecepatan & Kronologi Crash
          </button>
          <button
            onClick={() => setActiveTab('EVIDENCE_MATRIX')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'EVIDENCE_MATRIX'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Matriks Bukti 6-Dimensi
          </button>
          <button
            onClick={() => setActiveTab('ROOT_CAUSE_HIERARCHY')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'ROOT_CAUSE_HIERARCHY'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Hierarki Penyebab (Root Cause Tree)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {activeTab === 'CRASH_SUMMARY' && (
            <div className="space-y-5">
              {/* Summary Card */}
              <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-xs tracking-wider uppercase">
                  <Sparkles className="w-4 h-4" />
                  AI Crash Reconstruction Summary
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Telematics Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Kecepatan Pra-Crash</span>
                  <div className="text-xl font-bold text-white font-mono">{analysis.preCrashSpeedKmh} km/h</div>
                  <span className="text-[10px] text-slate-400">-15 detik sebelum rem</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Kecepatan Saat Impak</span>
                  <div className="text-xl font-bold text-amber-400 font-mono">{analysis.speedAtImpactKmh} km/h</div>
                  <span className="text-[10px] text-amber-400/80">Tereduksi 50% saat tumbukan</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Gaya Impak Akselerometer</span>
                  <div className="text-xl font-bold text-red-400 font-mono">{analysis.impactGForce} G</div>
                  <span className="text-[10px] text-red-400/80">Sensor Akselerometer 3-Axis</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-center space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Waktu Reaksi Rem</span>
                  <div className="text-xl font-bold text-emerald-400 font-mono">4.0 detik</div>
                  <span className="text-[10px] text-slate-400">Jarak henti tidak mencukupi</span>
                </div>
              </div>

              {/* Contextual Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">
                    Informasi Lapangan & Peristiwa
                  </h5>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p><span className="text-slate-500">Lokasi:</span> {accident.location}</p>
                    <p><span className="text-slate-500">Pengemudi:</span> {accident.driverName || 'N/A'}</p>
                    <p><span className="text-slate-500">Armada:</span> {accident.vehiclePlate || 'N/A'}</p>
                    <p><span className="text-slate-500">Kondisi Cuaca/Jalan:</span> {accident.weatherCondition} / {accident.roadCondition}</p>
                    <p><span className="text-slate-500">Korban / Kerugian:</span> {accident.injuries} luka, Est. Rp {accident.estimatedLossIdr?.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-300">
                    Kesenjangan Bukti Investigasi
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {analysis.missingEvidenceGaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TIMELINE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Kronologi Crash Rekonstruksi Sensor 10Hz
                </h4>
                <span className="text-xs text-red-400 font-mono font-bold">Collision Event Verified</span>
              </div>
              <div className="relative pl-6 border-l-2 border-slate-700 space-y-6">
                {analysis.eventTimeline.map((point, idx) => (
                  <div key={idx} className="relative group">
                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                      point.eventType === 'IMPACT' ? 'bg-red-500 border-white' :
                      point.eventType === 'HARSH_BRAKE' ? 'bg-amber-500 border-slate-900' :
                      point.eventType === 'STOP' ? 'bg-blue-500 border-slate-900' :
                      'bg-slate-700 border-slate-900'
                    }`} />
                    <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-mono text-red-400 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {point.timestamp} ({point.timeOffsetSeconds >= 0 ? `+${point.timeOffsetSeconds}s` : `${point.timeOffsetSeconds}s`})
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          point.eventType === 'IMPACT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          point.eventType === 'HARSH_BRAKE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {point.eventType}
                        </span>
                      </div>
                      <p className="text-slate-200 text-xs font-medium">{point.eventDescription}</p>
                      <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-700/50">
                        <span>Speed: <strong className="text-white">{point.speedKmh} km/h</strong></span>
                        <span>Brake: <strong className={point.brakeApplied ? 'text-amber-400' : 'text-slate-400'}>{point.brakeApplied ? 'Applied' : 'Released'}</strong></span>
                        <span>Deceleration: <strong className="text-white">{point.accelerationG?.toFixed(2)} G</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'EVIDENCE_MATRIX' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                Matriks Korelasi Bukti 6-Dimensi (Cross-Source Evidence Correlation)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/70 space-y-2">
                  <h5 className="font-bold text-emerald-400 text-xs">1. Telemetri GPS & Sensor Inersia</h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysis.evidenceCorrelations.telemetryEvidence.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-1.5"><span className="text-emerald-400">•</span> {e}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/70 space-y-2">
                  <h5 className="font-bold text-amber-400 text-xs">2. Perilaku Pengemudi (Driver Behavior)</h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysis.evidenceCorrelations.driverBehaviorEvidence.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-1.5"><span className="text-amber-400">•</span> {e}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/70 space-y-2">
                  <h5 className="font-bold text-purple-400 text-xs">3. Telemetri Kelelahan (Fatigue Telemetry)</h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysis.evidenceCorrelations.fatigueTelemetryEvidence.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-1.5"><span className="text-purple-400">•</span> {e}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/70 space-y-2">
                  <h5 className="font-bold text-blue-400 text-xs">4. Hasil Inspeksi Pra-Jalan (P26)</h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysis.evidenceCorrelations.vehicleInspectionEvidence.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-1.5"><span className="text-blue-400">•</span> {e}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/70 space-y-2">
                  <h5 className="font-bold text-cyan-400 text-xs">5. Riwayat Pemeliharaan Kendaraan (P31)</h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysis.evidenceCorrelations.maintenanceRecordEvidence.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-1.5"><span className="text-cyan-400">•</span> {e}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/70 space-y-2">
                  <h5 className="font-bold text-slate-300 text-xs">6. Kondisi Cuaca & Jalan Eksternal</h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {analysis.evidenceCorrelations.externalConditionEvidence.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-1.5"><span className="text-slate-400">•</span> {e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ROOT_CAUSE_HIERARCHY' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                Struktur Hierarki Akar Masalah (Root Cause Hierarchy Tree)
              </h4>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">1. Immediate Cause (Penyebab Langsung)</span>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono">Telemetry Backed</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{analysis.rootCauseHierarchy.immediateCause}</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">2. Contributing Cause (Penyebab Kontributor)</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">Environmental</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{analysis.rootCauseHierarchy.contributingCause}</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">3. Underlying Cause (Penyebab Mendasar)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono">Driver Fatigue</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{analysis.rootCauseHierarchy.underlyingCause}</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">4. Systemic Cause (Penyebab Sistemik Operasional)</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">Process & SOP</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{analysis.rootCauseHierarchy.systemicCause}</p>
                </div>
              </div>
            </div>
          )}

          {/* Legal / Regulatory Disclaimer */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
            <span className="font-semibold text-slate-300">Catatan Kepatuhan Regulasi & AI:</span> Analisis AI merupakan alat bantu keputusan (decision-support tool). Hasil analisis harus diverifikasi oleh personel yang berwenang dan tidak menggantikan prosedur investigasi resmi, kebijakan keselamatan perusahaan, atau peraturan yang berlaku.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <button
            onClick={() => onOpen5Why && onOpen5Why(accident.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-red-400" />
            Jalankan 5-Why Analysis Assistant
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
          >
            Selesai Meninjau
          </button>
        </div>

      </div>
    </div>
  );
};
