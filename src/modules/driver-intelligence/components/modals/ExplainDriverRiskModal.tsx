/**
 * Explain Driver Risk Modal - Full Mathematical & Formula Transparency
 * PROMPT 29 - Explains exact mathematical scoring without black-box opacity
 */

import React from 'react';
import { X, Info, ShieldCheck, Zap, Activity, CheckCircle2 } from 'lucide-react';

interface ExplainDriverRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainDriverRiskModal: React.FC<ExplainDriverRiskModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const formulaDimensions = [
    {
      dim: 'Overspeed Events (Kecepatan)',
      weight: '30%',
      formula: 'Norm(Count / (Distance_km / 100)) * 0.30',
      description: 'Frekuensi dan durasi melampaui batas kecepatan jalan / koridor tol.',
    },
    {
      dim: 'Harsh Braking (Rem Mendadak)',
      weight: '25%',
      formula: 'Norm(Braking_Count / (Distance_km / 100)) * 0.25',
      description: 'Deselerasi ekstrem > 3.0 m/s², indikator jarak aman yang tidak memadai.',
    },
    {
      dim: 'Harsh Acceleration (Sentakan Gas)',
      weight: '15%',
      formula: 'Norm(Accel_Count / (Distance_km / 100)) * 0.15',
      description: 'Sentakan pedal gas mendadak yang memboroskan BBM dan merusak transmisi.',
    },
    {
      dim: 'Sharp Cornering (Tikungan Tajam)',
      weight: '10%',
      formula: 'Norm(Peak_Lateral_G > 0.40G) * 0.10',
      description: 'Gaya lateral saat berbelok cepat, berisiko roll-over pada truk muatan.',
    },
    {
      dim: 'Idling Behavior (Mesin Hidup Diam)',
      weight: '10%',
      formula: 'Norm(Idle_Minutes / Total_Engine_Hours) * 0.10',
      description: 'Waktu idle berlebih yang menyebabkan inefisiensi BBM dan emisi karbon.',
    },
    {
      dim: 'Route Deviation (Deviasi Rute)',
      weight: '10%',
      formula: 'Norm(Detour_Km / Assigned_Distance) * 0.10',
      description: 'Penyimpangan dari koridor rute yang disetujui dispatcher operasional.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Transparansi & Rumus Skor Risiko AI
              </h3>
              <p className="text-xs text-slate-400">
                Formula matematis objektif, berbasis data sensor tanpa model black-box tersembunyi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Formula Box */}
        <div className="bg-slate-950/90 p-4 rounded-xl border border-cyan-500/30 font-mono text-xs space-y-2">
          <div className="text-slate-400 font-bold uppercase">Formula Komposit Skor Risiko (0-100):</div>
          <div className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-bold border border-slate-800 text-center text-sm">
            Risk_Score = ∑ ( Normalized_Factor_Score(i) × Factor_Weight(i) )
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            *Semua insiden dinormalisasi terhadap jarak tempuh aktif per 100 kilometer untuk menjamin keadilan penilaian antar rute jarak dekat dan jarak jauh.
          </p>
        </div>

        {/* 6 Dimensions Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Distribusi Bobot 6 Dimensi Risiko:
          </h4>
          <div className="space-y-2">
            {formulaDimensions.map((d, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{d.dim}</span>
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    Bobot: {d.weight}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">{d.formula}</div>
                <p className="text-slate-300 text-[11px] pt-0.5">{d.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Jaminan Nol Halusinasi: Setiap skor selalu dapat ditelusuri ke timestamp log GPS & sensor IoT terverifikasi.
          </span>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
