/**
 * Fleet Intelligence Smart AI - Prediction Feedback & Evaluation Modal
 * Captures technician feedback (Correct, Partially Correct, False Positive)
 * to close the machine learning feedback loop and evaluate model accuracy.
 */

import React, { useState } from 'react';
import { FailurePredictionItem } from '../../types';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

interface PredictionFeedbackModalProps {
  prediction: FailurePredictionItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (predId: string, outcome: 'CORRECT' | 'PARTIALLY_CORRECT' | 'FALSE_POSITIVE', notes: string) => void;
}

export const PredictionFeedbackModal: React.FC<PredictionFeedbackModalProps> = ({
  prediction,
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [outcome, setOutcome] = useState<'CORRECT' | 'PARTIALLY_CORRECT' | 'FALSE_POSITIVE'>('CORRECT');
  const [notes, setNotes] = useState('Hasil pembongkaran mekanik mengonfirmasi keausan komponen sesuai prediksi AI.');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSubmitFeedback(prediction.id, outcome, notes);
      setIsSaving(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Evaluasi & Feedback Prediksi AI</h3>
              <p className="text-xs text-slate-400">
                Unit {prediction.plateNumber} • {prediction.componentName}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">Prediksi AI Awal:</span>
            <p className="text-xs font-semibold text-white">{prediction.potentialFailureMode}</p>
            <span className="text-[10px] text-slate-500 font-mono block">
              Model: {prediction.modelVersion} • Timestamp: {new Date(prediction.predictionTimestamp).toLocaleDateString('id-ID')}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Hasil Aktual Pemeriksaan Fisik Teknisi / Bengkel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOutcome('CORRECT')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  outcome === 'CORRECT'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ThumbsUp className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                <span className="text-xs font-bold block">Akurat (Benar)</span>
                <span className="text-[10px] text-slate-500">Komponen aus/rusak</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('PARTIALLY_CORRECT')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  outcome === 'PARTIALLY_CORRECT'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                <span className="text-xs font-bold block">Sebagian Benar</span>
                <span className="text-[10px] text-slate-500">Isu terkait lainnya</span>
              </button>

              <button
                type="button"
                onClick={() => setOutcome('FALSE_POSITIVE')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  outcome === 'FALSE_POSITIVE'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ThumbsDown className="h-4 w-4 mx-auto mb-1 text-rose-400" />
                <span className="text-xs font-bold block">False Alarm</span>
                <span className="text-[10px] text-slate-500">Komponen masih baik</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              Catatan Temuan Fisik Teknisi Lapangan
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
              placeholder="Jelaskan kondisi aktual suku cadang setelah dibuka..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl shadow-md shadow-cyan-950 transition-all font-bold"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSaving ? 'Menyimpan...' : 'Simpan Log Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
