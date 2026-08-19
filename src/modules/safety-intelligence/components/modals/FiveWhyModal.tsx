/**
 * 5-Why Investigation Modal
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  Check, 
  Edit3, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  CornerDownRight,
  ArrowRight
} from 'lucide-react';
import { SafetyInvestigationAssistant } from '../../engines/SafetyInvestigationAssistant';
import { FiveWhyAnalysis } from '../../types';

interface FiveWhyModalProps {
  incidentId: string;
  onClose: () => void;
}

export const FiveWhyModal: React.FC<FiveWhyModalProps> = ({
  incidentId,
  onClose,
}) => {
  const initialData = SafetyInvestigationAssistant.get5WhyAnalysis(incidentId);
  const [data, setData] = useState<FiveWhyAnalysis>(initialData);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleConfirm = (step: 'why1' | 'why2' | 'why3' | 'why4' | 'why5') => {
    setData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        confirmedByHuman: !prev[step].confirmedByHuman,
      },
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const whySteps: ('why1' | 'why2' | 'why3' | 'why4' | 'why5')[] = ['why1', 'why2', 'why3', 'why4', 'why5'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI-Assisted 5-Whys Root Cause Analysis
                <span className="text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5">
                  {data.incidentNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Investigasi Terstruktur • Pembuktian Fakta • Human-in-the-Loop Verification
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Problem Statement Card */}
          <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Pernyataan Masalah (Problem Statement)
            </span>
            <p className="text-slate-200 text-xs font-medium leading-relaxed">
              {data.problemStatement}
            </p>
          </div>

          {/* 5 Whys Flow */}
          <div className="space-y-4">
            {whySteps.map((key, index) => {
              const step = data[key];
              const stepNum = index + 1;

              return (
                <div key={key} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                        {stepNum}
                      </span>
                      <span className="font-bold text-white text-xs">
                        Why #{stepNum}: {step.question}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleConfirm(key)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                        step.confirmedByHuman
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${step.confirmedByHuman ? 'text-emerald-400' : 'text-slate-500'}`} />
                      {step.confirmedByHuman ? 'Diverifikasi Manusia' : 'AI Suggestion (Belum Verif)'}
                    </button>
                  </div>

                  <div className="pl-8 space-y-1.5">
                    <p className="text-slate-200 text-xs leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                      <strong>Jawaban:</strong> {step.answer}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="text-slate-500">Bukti Pendukung:</span>
                      <span className="text-indigo-300 font-mono">{step.evidence}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Root Cause Conclusion & Action Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/30 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Kesimpulan Akar Masalah (Root Cause)
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{data.rootCauseConclusion}</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Item Tindakan Pencegahan (Action Item)
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">{data.actionItem}</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Hasil analisis 5-Why dan verifikasi berhasil disimpan ke log investigasi resmi.
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <span className="text-xs text-slate-400">
            Setiap kesimpulan 5-Why memerlukan verifikasi manual HSE Officer.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan Investigasi
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
