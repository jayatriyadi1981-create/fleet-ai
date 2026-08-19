/**
 * Incident AI Analysis Modal
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  User, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  FileQuestion,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Incident } from '../../../safety/types';
import { IncidentAnalysisEngine } from '../../engines/IncidentAnalysisEngine';
import { EvidenceCorrelationEngine } from '../../engines/EvidenceCorrelationEngine';

interface IncidentAIAnalysisModalProps {
  incident: Incident;
  onClose: () => void;
  onOpen5Why?: (incidentId: string) => void;
}

export const IncidentAIAnalysisModal: React.FC<IncidentAIAnalysisModalProps> = ({
  incident,
  onClose,
  onOpen5Why,
}) => {
  const analysis = IncidentAnalysisEngine.analyzeIncident(incident);
  const correlatedEvents = EvidenceCorrelationEngine.buildEventCorrelation(incident.dateTime);
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'TIMELINE' | 'FACTORS' | 'EVIDENCE_CORRELATION'>('OVERVIEW');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AI Incident Telemetry & Root Cause Analysis</h3>
                <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {incident.incidentNumber}
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  incident.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  incident.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {incident.severity}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Model: <span className="font-mono text-slate-300">{analysis.modelVersion}</span> • Kualitas Data: <span className="text-emerald-400 font-semibold">{analysis.dataQuality}</span>
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

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-800 bg-slate-900/90 text-xs">
          <button
            onClick={() => setActiveSubTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'OVERVIEW'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Ringkasan & Fakta Telemetri
          </button>
          <button
            onClick={() => setActiveSubTab('TIMELINE')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'TIMELINE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Rekonstruksi Timeline Detik-ke-Detik
          </button>
          <button
            onClick={() => setActiveSubTab('FACTORS')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'FACTORS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Faktor Kontribusi & Confidence
          </button>
          <button
            onClick={() => setActiveSubTab('EVIDENCE_CORRELATION')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'EVIDENCE_CORRELATION'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Korelasi Bukti Multi-Modul
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {activeSubTab === 'OVERVIEW' && (
            <div className="space-y-5">
              {/* Executive Summary Card */}
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
                  <Sparkles className="w-4 h-4" />
                  AI Telemetry Summary
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Grid: Context & Observed Facts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <h4 className="font-semibold text-white flex items-center gap-2 text-xs uppercase tracking-wider text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Fakta Teramati (Observed Telemetry Facts)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysis.observedFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <h4 className="font-semibold text-white flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300">
                    <FileQuestion className="w-4 h-4 text-amber-400" />
                    Kesenjangan Bukti (Missing Evidence Gap)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {analysis.missingEvidence.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Action Checklist */}
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/80 space-y-3">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-300">
                  Rekomendasi Tindakan AI (Corrective & Preventive Actions)
                </h4>
                <div className="space-y-2">
                  {analysis.recommendedActions.map((act, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
                      <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'TIMELINE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Rekonstruksi Kronologi Detik-ke-Detik (GPS 10Hz & Sensor Rem)
                </h4>
                <span className="text-xs text-emerald-400 font-mono">Status: Full Telemetry Timeline Available</span>
              </div>
              <div className="relative pl-6 border-l-2 border-slate-700 space-y-6">
                {analysis.timeline.map((point, idx) => (
                  <div key={idx} className="relative group">
                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                      point.eventType === 'IMPACT' ? 'bg-red-500 border-white' :
                      point.eventType === 'HARSH_BRAKE' ? 'bg-amber-500 border-slate-900' :
                      point.eventType === 'SPEEDING' ? 'bg-purple-500 border-slate-900' :
                      point.eventType === 'STOP' ? 'bg-blue-500 border-slate-900' :
                      'bg-slate-700 border-slate-900'
                    }`} />
                    <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {point.timestamp} ({point.timeOffsetSeconds >= 0 ? `+${point.timeOffsetSeconds}s` : `${point.timeOffsetSeconds}s`})
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          point.eventType === 'IMPACT' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          point.eventType === 'HARSH_BRAKE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          point.eventType === 'SPEEDING' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {point.eventType}
                        </span>
                      </div>
                      <p className="text-slate-200 text-xs font-medium">{point.eventDescription}</p>
                      <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-700/50">
                        <span>Speed: <strong className="text-white">{point.speedKmh} km/h</strong></span>
                        <span>RPM: <strong className="text-white">{point.rpm || 'N/A'}</strong></span>
                        <span>Brake: <strong className={point.brakeApplied ? 'text-amber-400' : 'text-slate-400'}>{point.brakeApplied ? 'Active' : 'Off'}</strong></span>
                        <span>G-Force: <strong className="text-white">{point.accelerationG?.toFixed(2)} G</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'FACTORS' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                Penguraian Faktor Kontribusi Berdasarkan Kategori & Tingkat Kepastian
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.potentialContributingFactors.map((factor) => (
                  <div key={factor.id} className="p-4 rounded-lg bg-slate-800/70 border border-slate-700/70 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-slate-700 text-slate-300">
                        {factor.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                        factor.confidence === 'HIGH' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        factor.confidence === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        Confidence: {factor.confidence}
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-xs">{factor.title}</h5>
                    <p className="text-slate-300 text-xs leading-relaxed">{factor.description}</p>
                    <div className="pt-2 border-t border-slate-700/50 flex items-center gap-1 text-[10px] text-slate-400">
                      <span className="text-slate-500">Sumber Bukti:</span>
                      <span className="text-slate-300 font-mono">{factor.evidenceSource.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'EVIDENCE_CORRELATION' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                Korelasi Lintas Modul (Cross-Module Event Correlation Timeline)
              </h4>
              <div className="space-y-2.5">
                {correlatedEvents.map((evt) => (
                  <div key={evt.id} className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-700 text-slate-300 font-mono">
                          {evt.sourceModule}
                        </span>
                        <span className="text-xs font-bold text-white">{evt.title}</span>
                        <span className="text-[11px] text-emerald-400 font-medium">({evt.relativeTimeFormatted})</span>
                      </div>
                      <p className="text-xs text-slate-300">{evt.details}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider shrink-0 ${
                      evt.correlationStrength === 'STRONG' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {evt.correlationStrength} Correlation
                    </span>
                  </div>
                ))}
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
            onClick={() => onOpen5Why && onOpen5Why(incident.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Jalankan 5-Why Analysis Assistant
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
          >
            Selesai Meninjau
          </button>
        </div>

      </div>
    </div>
  );
};
