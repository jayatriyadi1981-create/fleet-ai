/**
 * Fleet Intelligence Smart AI - Driver Fatigue Detail Modal
 * PROMPT 23 - Detailed Driver Fatigue Profile (/app/fatigue/drivers/:driverId)
 */

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Moon, 
  BedDouble, 
  Calendar, 
  Truck, 
  Building2, 
  UserCheck, 
  CheckCircle2, 
  PhoneCall, 
  PauseCircle, 
  Send, 
  Info,
  TrendingDown,
  Sparkles,
  Activity,
  MapPin
} from 'lucide-react';
import { DriverFatigueProfile, FatigueTimelineItem } from '../../types';
import { mockFatigueTimeline } from '../../data/mockFatigueData';
import { generateDriverFatigueInsight } from '../../services/aiFatigueService';

interface DriverFatigueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DriverFatigueProfile | null;
  onActionSuccess?: (action: string, notes: string) => void;
}

export const DriverFatigueDetailModal: React.FC<DriverFatigueDetailModalProps> = ({
  isOpen,
  onClose,
  profile,
  onActionSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'timeline' | 'actions'>('overview');
  const [actionNotes, setActionNotes] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !profile) return null;

  const aiInsight = generateDriverFatigueInsight(profile);

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MODERATE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleTakeAction = (actionType: string) => {
    const msg = `Tindakan supervisor [${actionType}] berhasil dicatat untuk Driver ${profile.driverName}.`;
    setActionSuccessMsg(msg);
    if (onActionSuccess) {
      onActionSuccess(actionType, actionNotes);
    }
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={profile.driverName}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{profile.driverName}</h2>
                <span className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${getRiskBadgeColor(profile.riskLevel)}`}>
                  {profile.riskLevel} RISK
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  {profile.vehiclePlate || 'B 9876 XYZ'}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {profile.branchName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {profile.currentShiftName || 'Shift Malam'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ringkasan Kelelahan
          </button>
          <button
            onClick={() => setActiveTab('factors')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'factors'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Faktor Pembentuk Skor ({profile.riskFactors.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Timeline Operasional
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'actions'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Tindakan Supervisor
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {actionSuccessMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score & Main Metrics Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score Card */}
                <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Fatigue Risk Score</span>
                  <div className="relative flex items-center justify-center my-2">
                    <div className="text-4xl font-extrabold text-white">{profile.currentScore}</div>
                    <span className="text-slate-500 text-sm ml-1">/100</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getRiskBadgeColor(profile.riskLevel)}`}>
                    {profile.riskLevel} RISK
                  </span>
                  <span className="text-[11px] text-slate-500 mt-2">
                    Data Source: {profile.dataSource} ({profile.confidence} Confidence)
                  </span>
                </div>

                {/* Today's Key Hours */}
                <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Mengemudi Hari Ini
                    </span>
                    <p className="text-lg font-bold text-white">{profile.drivingHoursToday.toFixed(1)} jam</p>
                    <span className="text-[10px] text-slate-500">Continuous: {profile.consecutiveDrivingHours.toFixed(1)} jam</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                      Waktu Istirahat
                    </span>
                    <p className="text-lg font-bold text-white">{profile.restHoursToday.toFixed(1)} jam</p>
                    <span className="text-[10px] text-slate-500">Syarat min: 8.0 jam</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      Mengemudi Malam
                    </span>
                    <p className="text-lg font-bold text-white">{profile.nightDrivingHoursToday.toFixed(1)} jam</p>
                    <span className="text-[10px] text-slate-500">22:00 - 06:00 WIB</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Hari Kerja Berturut
                    </span>
                    <p className="text-lg font-bold text-white">{profile.consecutiveShiftDays} hari</p>
                    <span className="text-[10px] text-slate-500">Tanpa libur penuh</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      Shift berjalan
                    </span>
                    <p className="text-lg font-bold text-white">{profile.shiftHoursToday.toFixed(1)} jam</p>
                    <span className="text-[10px] text-slate-500">{profile.currentShiftName || 'Night Shift'}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Istirahat Terakhir
                    </span>
                    <p className="text-sm font-semibold text-slate-200">
                      {new Date(profile.lastRestAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className="text-[10px] text-slate-500">15 Agu 2026</span>
                  </div>
                </div>
              </div>

              {/* AI Copilot Operational Analysis */}
              <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Fatigue Intelligence Context</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{aiInsight.insightText}</p>
                <div className="pt-2 border-t border-cyan-900/40 text-[11px] text-cyan-300 font-medium">
                  {aiInsight.recommendedAction}
                </div>
              </div>

              {/* Risk Factors Highlight */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Faktor Risiko Utama (Contributing Risk Factors)
                </h3>
                <div className="space-y-2">
                  {profile.riskFactors.map((factor, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{factor.factor}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            factor.level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                            factor.level === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                            factor.level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {factor.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{factor.description}</p>
                        {factor.recommendation && (
                          <p className="text-[11px] text-cyan-400 font-medium mt-1">
                            💡 {factor.recommendation}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-bold text-rose-400">-{factor.impactScore} pt</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'factors' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
                Skor Risiko Kelelahan (0–100) dihitung secara transparan dari 5 komponen bobot operasional: Durasi Mengemudi Kontinu (20%), Istirahat (20%), Jam Mengemudi Harian (25%), Durasi Shift (15%), Paparan Mengemudi Malam (10%), dan Hari Kerja Berturut-turut (10%).
              </div>

              <div className="space-y-3">
                {profile.riskFactors.map((factor, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{factor.factor}</span>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded border ${
                        factor.level === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        factor.level === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        Tingkat Risiko: {factor.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{factor.description}</p>
                    {factor.recommendation && (
                      <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded-lg text-xs text-cyan-300">
                        <strong>Rekomendasi Sistem:</strong> {factor.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Unified Operational & Safety Events Timeline
              </h3>
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {mockFatigueTimeline.map((item) => (
                  <div key={item.id} className="relative group">
                    <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-slate-900 ${
                      item.severity === 'CRITICAL' ? 'bg-rose-500' :
                      item.severity === 'HIGH' ? 'bg-orange-500' :
                      item.severity === 'WARNING' ? 'bg-amber-500' : 'bg-cyan-500'
                    }`} />
                    <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{item.title}</span>
                        <span className="text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-400">{item.description}</p>
                      {item.location && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-xs font-semibold text-white">Form Tindakan Intervensi Supervisor</h3>
                <p className="text-xs text-slate-400">
                  Pilih tindakan yang direkomendasikan kebijakan keselamatan perusahaan untuk ditindaklanjuti dispatcher/fleet manager.
                </p>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium">Catatan / Instruksi Supervisor:</label>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Instruksi spesifik ke driver (misal: 'Diperintahkan rehat 45 menit di Rest Area PEJAGAN KM 228')..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleTakeAction('Rekomendasikan Istirahat (Break)')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <BedDouble className="w-4 h-4" />
                    Rekomendasikan Istirahat
                  </button>

                  <button
                    onClick={() => handleTakeAction('Hubungi Pengemudi via Radio / Telepon')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Hubungi Driver via Call
                  </button>

                  <button
                    onClick={() => handleTakeAction('Hentikan Sementara Penugasan (Pause Assignment)')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <PauseCircle className="w-4 h-4" />
                    Jeda Penugasan Driver
                  </button>

                  <button
                    onClick={() => handleTakeAction('Eskalasi ke Manajemen Safety / K3')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Eskalasi ke K3 Safety
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Disclaimer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-[11px]">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              <strong>Disclaimer Operasional:</strong> Indikator risiko kelelahan dihitung berdasarkan jam kerja, telematika GPS, & shift. Sistem tidak mendiagnosis kondisi medis.
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors text-xs flex-shrink-0"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};
