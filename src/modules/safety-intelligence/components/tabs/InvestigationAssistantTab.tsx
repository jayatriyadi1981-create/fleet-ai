/**
 * Investigation Assistant Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  FileQuestion, 
  Plus,
  ArrowRight,
  ShieldAlert,
  Save
} from 'lucide-react';
import { SafetyInvestigationAssistant } from '../../engines/SafetyInvestigationAssistant';
import { FiveWhyModal } from '../modals/FiveWhyModal';

export const InvestigationAssistantTab: React.FC = () => {
  const [selectedIncidentId, setSelectedIncidentId] = useState('acc-101');
  const [is5WhyOpen, setIs5WhyOpen] = useState(false);
  const evidenceGaps = SafetyInvestigationAssistant.getEvidenceGaps(selectedIncidentId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Safety Investigation Assistant & Evidence Gap Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Bimbingan investigasi terstruktur (5-Why Analysis), deteksi kelengkapan bukti hukum & teknis, serta pembuatan daftar pertanyaan wawancara.
          </p>
        </div>

        <button
          onClick={() => setIs5WhyOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <HelpCircle className="w-4 h-4" />
          Buka 5-Whys Interactive Analyzer
        </button>
      </div>

      {/* Grid: Missing Evidence Checklist & Guided Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Evidence Gap Checklist */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-amber-400" />
              Checklist Kelengkapan Bukti Investigasi (Evidence Gap Detector)
            </h4>
            <span className="text-xs font-mono text-slate-400">Kasus: ACC-2026-000001</span>
          </div>

          <div className="space-y-2.5">
            {evidenceGaps.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-400">Sumber: {item.source}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    item.status === 'COLLECTED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'MISSING' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggested Interview Questions */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Daftar Pertanyaan Wawancara Saksi & Pengemudi yang Disarankan AI
          </h4>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Pertanyaan 1 (Persepsi Jarak & Cuaca)</span>
              <p className="text-slate-200 font-medium leading-relaxed">
                "Berapa perkiraan jarak visual saat Anda pertama kali melihat lampu rem armada di depan menyala di tengah hujan?"
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Pertanyaan 2 (Kondisi Kendaraan & Rem)</span>
              <p className="text-slate-200 font-medium leading-relaxed">
                "Apakah saat pedal rem diinjak penuh, terasa adanya getaran abnormal atau respons pedal yang terasa amblas/tertahan?"
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Pertanyaan 3 (Tingkat Kebugaran Driver)</span>
              <p className="text-slate-200 font-medium leading-relaxed">
                "Kapan jam tidur terakhir Anda sebelum memulai shift, dan apakah Anda sempat beristirahat di rest area sebelumnya?"
              </p>
            </div>
          </div>
        </div>

      </div>

      {is5WhyOpen && (
        <FiveWhyModal
          incidentId={selectedIncidentId}
          onClose={() => setIs5WhyOpen(false)}
        />
      )}

    </div>
  );
};
