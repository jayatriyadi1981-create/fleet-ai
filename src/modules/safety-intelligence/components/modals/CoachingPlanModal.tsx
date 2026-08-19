/**
 * Driver Coaching Plan Modal
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  BookOpen, 
  Target, 
  Award,
  Clock
} from 'lucide-react';
import { DriverSafetyProfile, SafetyCoachingPlan } from '../../types';

interface CoachingPlanModalProps {
  driver: DriverSafetyProfile;
  onClose: () => void;
}

export const CoachingPlanModal: React.FC<CoachingPlanModalProps> = ({
  driver,
  onClose,
}) => {
  const [assignedCoach, setAssignedCoach] = useState('Hendra Setiawan (HSE Lead)');
  const [evaluationDays, setEvaluationDays] = useState(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Rencana Coaching Keselamatan Pengemudi
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pengemudi: <strong className="text-white">{driver.driverName}</strong> ({driver.branch}) • Skor: <strong className="text-amber-400">{driver.overallSafetyScore}/100</strong>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          
          {/* Constructive Philosophy Notice */}
          <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
            <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Prinsip Coaching Keselamatan:</strong> Pendekatan edukatif dan preventif non-punitive untuk meningkatkan kebiasaan berkendara aman, pemahaman dinamika kendaraan berat, dan kepedulian terhadap keselamatan bersama.
            </p>
          </div>

          {/* Coaching Objective */}
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Tujuan Utama Coaching
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {driver.recommendedCoachingTopic}
            </p>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
              Pola Terdeteksi: <span className="text-amber-300">{driver.overspeedEventsLast30d} overspeed, {driver.harshBrakingLast30d} pengereman mendadak dalam 30 hari terakhir.</span>
            </div>
          </div>

          {/* Core Focus Modules */}
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Materi & Topik Pembahasan
            </h4>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex items-start gap-2 p-2 rounded bg-slate-900/50 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Teknik Defensive Driving: Pengaturan jarak iring 3 detik dan antisipasi titik blind-spot kendaraan berat.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-slate-900/50 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Pengendalian Laju di Tikungan Curam & Turunan Tol (Efektivitas Engine Brake / Retarder).</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-slate-900/50 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>Manajemen Energi & Kebugaran: Kepatuhan waktu istirahat minimal 30 menit per 4 jam berkendara.</span>
              </div>
            </div>
          </div>

          {/* Form Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Instruktur / Safety Coach</label>
              <input
                type="text"
                value={assignedCoach}
                onChange={(e) => setAssignedCoach(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Masa Evaluasi Tindak Lanjut</label>
              <select
                value={evaluationDays}
                onChange={(e) => setEvaluationDays(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value={14}>14 Hari Monitoring Telemetri</option>
                <option value={30}>30 Hari Monitoring Telemetri</option>
                <option value={60}>60 Hari Monitoring Telemetri</option>
              </select>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Rencana coaching berhasil ditugaskan dan disinkronkan ke modul Driver Intelligence.
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
          >
            Tugaskan Program Coaching
          </button>
        </div>

      </div>
    </div>
  );
};
