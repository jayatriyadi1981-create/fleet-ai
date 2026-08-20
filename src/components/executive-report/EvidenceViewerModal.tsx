/**
 * Fleet Intelligence Smart AI - Evidence Viewer Modal
 * PROMPT 52 — Zero-Hallucination Telematics & Financial Evidence Audit Modal
 */

import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Database, Calendar, ExternalLink } from 'lucide-react';
import { ExecutiveEvidenceItem } from '../../types/executiveReport';

interface EvidenceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  evidenceList: ExecutiveEvidenceItem[];
}

export const EvidenceViewerModal: React.FC<EvidenceViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  evidenceList,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/80 border border-cyan-700/60 rounded-xl text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">{title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Audit Trail Telematika & Data Finansial Terverifikasi ({evidenceList.length} Entri)</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {evidenceList.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tidak ada bukti audit spesifik yang terlampir pada item ini.
            </div>
          ) : (
            evidenceList.map(ev => (
              <div
                key={ev.id || ev.evidenceId || Math.random().toString()}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                        {ev.id || ev.evidenceId}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{ev.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ev.description}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {ev.timestamp}
                  </span>
                </div>

                {/* Source & Related Assets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-400">Sumber Data:</span>{' '}
                    <span className="font-semibold text-slate-200">{ev.sourceModule || ev.sourceType || 'Sensor Telematika GPS/IoT'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Unit / Referensi:</span>{' '}
                    <span className="font-mono text-cyan-300 font-semibold">{ev.vehiclePlate || ev.vehiclePlateOrRef || ev.driverName || ev.routeName || 'Armada'}</span>
                  </div>
                </div>

                {/* Telematics Raw Data Snippet */}
                {(ev.dataPoints || ev.telematicsTelemetrySnippet) && (
                  <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto space-y-1">
                    <div className="text-slate-400 text-[10px] uppercase font-sans font-bold">Cuplikan Log Telematika & Audit Trail:</div>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(ev.dataPoints || ev.telematicsTelemetrySnippet, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Verifikasi Kriptografis Integritas Data Sistem Smart AI Fleet</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
          >
            Tutup Jendela Audit
          </button>
        </div>
      </div>
    </div>
  );
};
