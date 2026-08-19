/**
 * Create Coaching Session Modal - AI Plan Generator & Scheduling
 * PROMPT 29 - Generates non-punitive talking points, action plan, and schedules session
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Brain,
  Sparkles,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
} from 'lucide-react';
import { DriverCoachingFocusType } from '../../types';
import { aiDriverCoachingService } from '../../engines/AIDriverCoachingService';
import { driverIntelligenceService } from '../../engines/DriverIntelligenceService';

interface CreateCoachingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDriverId?: string;
  initialFocusType?: DriverCoachingFocusType;
  allDrivers: { id: string; name: string; vehiclePlate: string }[];
  onSessionCreated: () => void;
}

export const CreateCoachingSessionModal: React.FC<CreateCoachingSessionModalProps> = ({
  isOpen,
  onClose,
  initialDriverId = 'drv-01',
  initialFocusType = 'SPEED_MANAGEMENT',
  allDrivers,
  onSessionCreated,
}) => {
  const [driverId, setDriverId] = useState(initialDriverId);
  const [focusType, setFocusType] = useState<DriverCoachingFocusType>(initialFocusType);
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().substring(0, 10)
  );
  const [supervisorName, setSupervisorName] = useState('Budi Pratama (Safety Officer)');
  const [title, setTitle] = useState('');
  const [talkingPoints, setTalkingPoints] = useState<string[]>([]);
  const [actionPlan, setActionPlan] = useState<string[]>([]);
  const [supervisorNotes, setSupervisorNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialDriverId) setDriverId(initialDriverId);
    if (initialFocusType) setFocusType(initialFocusType);
  }, [initialDriverId, initialFocusType]);

  // Generate or Regenerate AI Plan
  const handleGenerateAIPlan = () => {
    setIsGenerating(true);
    const profile = driverIntelligenceService.getDriverProfile(driverId);
    const plan = aiDriverCoachingService.generateAICoachingPlan(
      profile.driverName,
      focusType,
      focusType,
      `Terdeteksi pola risiko pada sensor telematika kendaraan ${profile.assignedVehiclePlate}.`,
      profile.riskScore.evidence
    );

    setTimeout(() => {
      setTitle(plan.objective || `Pembinaan ${focusType}`);
      setTalkingPoints(plan.talkingPoints || []);
      setActionPlan(plan.recommendedActions || []);
      setIsGenerating(false);
    }, 400);
  };

  useEffect(() => {
    if (isOpen) {
      handleGenerateAIPlan();
    }
  }, [isOpen, driverId, focusType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = driverIntelligenceService.getDriverProfile(driverId);

    aiDriverCoachingService.createSession({
      tenantId: 'tenant-tln-01',
      driverId: profile.driverId,
      driverName: profile.driverName,
      driverPhone: profile.driverPhone,
      coachId: 'usr-01',
      coachName: supervisorName,
      date: scheduledDate,
      coachingTopic: title || `Sesi Pembinaan: ${focusType.replace(/_/g, ' ')}`,
      category: focusType,
      trigger: `Peringatan Risiko Telematika (${focusType.replace(/_/g, ' ')})`,
      observedBehavior: `Terdeteksi indikasi risiko pada sensor telematika kendaraan ${profile.assignedVehiclePlate}.`,
      aiRecommendation: talkingPoints.join('; '),
      aiCoachingPlan: {
        objective: title,
        keyBehaviors: talkingPoints,
        talkingPoints,
        examples: profile.riskScore.evidence,
        recommendedActions: actionPlan,
        followUpMetrics: ['Penurunan Risk Score < 40 dalam 14 hari'],
        suggestedDurationMinutes: 30,
      },
      actionPlan: actionPlan.join('; '),
      supervisorNotes,
      followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
      status: 'SCHEDULED',
      priority: 'HIGH',
      beforeRiskScore: profile.riskScore.score,
      beforeSafetyScore: profile.safetyScore.score,
    });

    onSessionCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Jadwalkan Sesi AI Coaching Pengemudi
              </h3>
              <p className="text-xs text-slate-400">
                Penyusunan rencana bimbingan terpadu dan non-punitif dengan rekomendasi otomatis AI.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Driver & Focus Type Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase font-semibold block mb-1">
                Pilih Pengemudi
              </label>
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                {allDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.vehiclePlate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase font-semibold block mb-1">
                Fokus Coaching
              </label>
              <select
                value={focusType}
                onChange={(e) => setFocusType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="SPEED_MANAGEMENT">Manajemen Kecepatan & Batas Tol</option>
                <option value="BRAKING_TECHNIQUE">Teknik Jarak Aman & Pengereman</option>
                <option value="DEFENSIVE_DRIVING">Defensive & Eco-Driving</option>
                <option value="CORNERING_SAFETY">Manuver Tikungan Aman</option>
                <option value="ROUTE_COMPLIANCE">Kepatuhan Koridor Rute</option>
                <option value="REST_BREAK_REMINDER">Manajemen Istirahat & Kelelahan</option>
                <option value="IDLE_REDUCTION">Efisiensi BBM & Pengurangan Idle</option>
              </select>
            </div>
          </div>

          {/* Schedule Date & Supervisor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase font-semibold block mb-1">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase font-semibold block mb-1">
                Supervisor / Safety Coach
              </label>
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500/50"
                required
              />
            </div>
          </div>

          {/* AI Plan Preview Box */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase font-bold text-cyan-300">
                  Rancangan Materi AI Coaching
                </span>
              </div>
              <button
                type="button"
                onClick={handleGenerateAIPlan}
                disabled={isGenerating}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                Judul Sesi:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-bold focus:outline-none"
              />
            </div>

            {/* Talking points */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Talking Points Diskusi (AI Generated):
              </label>
              <div className="space-y-1.5">
                {talkingPoints.map((tp, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold">•</span>
                    <input
                      type="text"
                      value={tp}
                      onChange={(e) => {
                        const copy = [...talkingPoints];
                        copy[idx] = e.target.value;
                        setTalkingPoints(copy);
                      }}
                      className="flex-1 px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action plan */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                Target & Komitmen Tindak Lanjut:
              </label>
              <div className="space-y-1.5">
                {actionPlan.map((ap, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={ap}
                      onChange={(e) => {
                        const copy = [...actionPlan];
                        copy[idx] = e.target.value;
                        setActionPlan(copy);
                      }}
                      className="flex-1 px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supervisor Additional Notes */}
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase font-semibold block mb-1">
              Catatan Khusus Supervisor (Opsional)
            </label>
            <textarea
              value={supervisorNotes}
              onChange={(e) => setSupervisorNotes(e.target.value)}
              placeholder="Tambahkan catatan khusus terkait rute spesifik atau kondisi kendaraan..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simpan & Terbitkan Sesi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
