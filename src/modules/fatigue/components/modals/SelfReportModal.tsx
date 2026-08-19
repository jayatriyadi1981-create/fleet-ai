/**
 * Fleet Intelligence Smart AI - Driver Self-Report Fatigue Modal
 * PROMPT 23 - Mobile/Driver App Self-Report Experience
 */

import React, { useState } from 'react';
import { X, HeartPulse, Send, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FatigueSelfReportLevel } from '../../types';

interface SelfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
  onSubmitReport: (level: FatigueSelfReportLevel, note: string) => void;
}

export const SelfReportModal: React.FC<SelfReportModalProps> = ({
  isOpen,
  onClose,
  driverName = 'Budi Santoso',
  onSubmitReport,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<FatigueSelfReportLevel>('Moderate');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(selectedLevel, note);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  const levels: { level: FatigueSelfReportLevel; label: string; color: string; desc: string }[] = [
    {
      level: 'Low',
      label: 'Kondisi Segar / Baik (Low)',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
      desc: 'Merasa fokus, reaksi cepat, siap mengemudi.',
    },
    {
      level: 'Moderate',
      label: 'Cukup Sehat (Moderate)',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
      desc: 'Sedikit mengantuk atau butuh secangkir kopi / rehat singkat.',
    },
    {
      level: 'High',
      label: 'Lelah / Mengantuk (High)',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20',
      desc: 'Kelopak mata berat, rekap fokus melambat. Perlu rehat.',
    },
    {
      level: 'Need Assistance',
      label: 'Butuh Bantuan / Rehat Segera',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 font-bold',
      desc: 'Tingkat lelah sangat tinggi. Butuh penghentian perjalanan & pertukaran driver.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Laporan Mandiri Risiko Kelelahan</h2>
              <p className="text-xs text-slate-400">Driver Self-Report ({driverName})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-white">Laporan Berhasil Diteruskan!</h3>
            <p className="text-xs text-slate-400">
              Terima kasih atas laporan kejujuran Anda. Data ini diteruskan ke tim dispatcher untuk keselamatan Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Bagaimana Kondisi Fisik & Kewaspadaan Anda Saat Ini?</label>
              <div className="space-y-2">
                {levels.map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSelectedLevel(item.level)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                      selectedLevel === item.level
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30 font-semibold bg-slate-800/80'
                        : item.color
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{item.label}</span>
                      {selectedLevel === item.level && <span className="text-cyan-400 font-bold">✓ Terpilih</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Catatan Tambahan (Opsional):</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: 'Tiba di Rest Area KM 228, mata agak berat karena mengemudi hujan lebat'..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {selectedLevel === 'Need Assistance' && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Perhatian:</strong> Memilih "Need Assistance" akan memicu Peringatan Kritis K3 ke supervisor untuk koordinasi bantuan/rehat langsung.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Send className="w-4 h-4" />
                Kirim Laporan Self-Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
