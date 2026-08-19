import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Clock,
  Sparkles,
  AlertTriangle,
  Award,
  Zap,
  Coffee,
  HeartPulse,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { DriverSessionState, IncidentReportPayload } from '../../types/driverMobileTypes';
import { ReportIncidentModal } from '../modals/ReportIncidentModal';
import { driverSessionService } from '../../services/driverSessionService';

interface DriverSafetyTabProps {
  session: DriverSessionState;
  onOpenPanicModal: () => void;
  onRefresh: () => void;
}

export const DriverSafetyTab: React.FC<DriverSafetyTabProps> = ({
  session,
  onOpenPanicModal,
  onRefresh,
}) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const incidents = driverSessionService.getIncidents();

  return (
    <div className="space-y-4 pb-24">
      {/* Driver Safety Score Hero */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Safety Score Pengemudi
            </span>
            <h2 className="text-xl font-black text-white">94 / 100</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Predikat: Grade A (Sangat Baik)</span>
            </div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        {/* Safety Metrics Breakdowns */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Kepatuhan Kecepatan</span>
            <div className="font-bold text-emerald-400">98% (Sesuai Limit)</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Pengereman Halus</span>
            <div className="font-bold text-emerald-400">92% (0 Rem Mendadak)</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Eco Driving & RPM</span>
            <div className="font-bold text-cyan-300">95% (Zona Hijau)</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Stabilitas Tikungan</span>
            <div className="font-bold text-emerald-400">91% (Halus)</div>
          </div>
        </div>
      </div>

      {/* Fatigue & Rest Tracker Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-xs font-bold text-white">Fatigue & Waktu Istirahat</h3>
              <p className="text-[11px] text-slate-400">Monitoring Standar Keselamatan Kemenhub</p>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            Risiko: RENDAH (Aman)
          </span>
        </div>

        {/* Progress Bar continuous driving */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300">Waktu Kemudi Berkelanjutan:</span>
            <span className="text-white font-bold">{session.shift.drivingHoursToday} / 4.0 Jam</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
              style={{ width: `${(session.shift.drivingHoursToday / 4.0) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Sisa waktu sebelum wajib istirahat:</span>
            <span className="text-amber-300 font-bold">~36 Menit lagi (Rest Area KM 57)</span>
          </div>
        </div>
      </div>

      {/* Smart AI Coaching Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Smart AI Safety Coach Insight</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          &ldquo;Gaya mengemudi Anda hari ini sangat stabil. Terus pertahankan jarak aman 50m dengan kendaraan di depan di jalan tol guna menjaga efisiensi solar dan pengereman prima.&rdquo;
        </p>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
          <div className="text-cyan-300 font-bold font-sans">💡 Rekomendasi Pintar Hari Ini:</div>
          <div>&bull; Gunakan Engine Brake saat melintasi jalur turunan Cikampek.</div>
          <div>&bull; Cek spion kiri sebelum manuver pindah lajur di KM 45.</div>
        </div>
      </div>

      {/* Incident Reporting & Panic Actions */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => setIsReportOpen(true)}
          className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition space-y-2 group shadow"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Lapor Insiden</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kerusakan / Near-Miss</p>
          </div>
        </button>

        <button
          onClick={onOpenPanicModal}
          className="p-4 rounded-3xl bg-rose-950/40 border border-rose-500/50 hover:bg-rose-900/40 text-left transition space-y-2 group shadow-lg shadow-rose-900/30"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow animate-pulse">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-rose-200 text-xs">Panic Button (SOS)</div>
            <p className="text-[11px] text-rose-300 mt-0.5">Sinyal Darurat 5 Detik</p>
          </div>
        </button>
      </div>

      {/* Recent Incidents List if any */}
      {incidents.length > 0 && (
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Riwayat Insiden Terlaporkan:
          </h3>
          <div className="space-y-2">
            {incidents.map(inc => (
              <div
                key={inc.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">{inc.type}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{inc.time}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{inc.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Incident Modal */}
      <ReportIncidentModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onCompleted={() => onRefresh()}
      />
    </div>
  );
};
