/**
 * Fleet Intelligence Smart AI - AI Feedback Modal (Prompt 34 - Section 75, 76)
 * Collects user ratings, discrepancy reasons (wrong data, wrong analysis, etc.),
 * and qualitative comments to calibrate continuous telematics models.
 */

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, X, Check, MessageSquare, AlertCircle } from 'lucide-react';

interface AIFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHelpful: boolean;
  onSubmit: (feedback: {
    isHelpful: boolean;
    reason?: 'wrong_data' | 'wrong_analysis' | 'not_relevant' | 'missing_information' | 'other';
    comment?: string;
  }) => void;
}

export const AIFeedbackModal: React.FC<AIFeedbackModalProps> = ({
  isOpen,
  onClose,
  isHelpful,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<
    'wrong_data' | 'wrong_analysis' | 'not_relevant' | 'missing_information' | 'other'
  >('wrong_data');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      isHelpful,
      reason: !isHelpful ? selectedReason : undefined,
      comment: comment.trim() || undefined,
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  const reasonOptions = [
    { value: 'wrong_data', label: 'Data telemetri tidak akurat / salah hitung' },
    { value: 'wrong_analysis', label: 'Analisis penyebab / korelasi kurang tepat' },
    { value: 'not_relevant', label: 'Jawaban tidak sesuai pertanyaan (tidak relevan)' },
    { value: 'missing_information', label: 'Informasi kurang lengkap / ada data hilang' },
    { value: 'other', label: 'Alasan lainnya' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              isHelpful
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}
          >
            {isHelpful ? <ThumbsUp className="h-5 w-5" /> : <ThumbsDown className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {isHelpful ? 'Umpan Balik Positif' : 'Bantu Tingkatkan Kualitas AI'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHelpful
                ? 'Terima kasih atas tanggapan Anda.'
                : 'Berikan alasan agar akurasi AI Fleet Assistant semakin optimal.'}
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-200">Umpan balik berhasil dikirim!</p>
            <p className="text-xs text-slate-400">Terima kasih atas kontribusi Anda.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isHelpful && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Apa kendala pada respon ini?
                </label>
                <div className="space-y-1.5">
                  {reasonOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition-all ${
                        selectedReason === opt.value
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-semibold'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="feedback_reason"
                        value={opt.value}
                        checked={selectedReason === opt.value}
                        onChange={() => setSelectedReason(opt.value)}
                        className="sr-only"
                      />
                      <div
                        className={`h-3 w-3 rounded-full border ${
                          selectedReason === opt.value
                            ? 'border-cyan-400 bg-cyan-400'
                            : 'border-slate-600'
                        }`}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tuliskan masukan spesifik atau ekspektasi jawaban yang seharusnya..."
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Check className="h-4 w-4" />
                <span>Kirim Umpan Balik</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
