/**
 * Create Driver Coaching Session Modal
 * PROMPT 21 Architecture
 */

import React, { useState } from 'react';
import { DriverBehaviorEvent, DriverCoaching } from '../../types';
import { behaviorStore } from '../../services/behaviorStore';
import { X, MessageSquare, User, Calendar, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface CreateCoachingModalProps {
  initialDriverId?: string;
  triggerEvent?: DriverBehaviorEvent | null;
  onClose: () => void;
  onCreated?: (coaching: DriverCoaching) => void;
}

export const CreateCoachingModal: React.FC<CreateCoachingModalProps> = ({
  initialDriverId,
  triggerEvent,
  onClose,
  onCreated,
}) => {
  const summaries = behaviorStore.getSummaries();
  const selectedDriver = summaries.find((s) => s.driverId === (initialDriverId || triggerEvent?.driverId)) || summaries[0];

  const [driverId, setDriverId] = useState<string>(selectedDriver?.driverId || 'drv-1');
  const [category, setCategory] = useState<DriverCoaching['category']>(
    triggerEvent?.eventType === 'OVERSPEED' ? 'SPEEDING' :
    triggerEvent?.eventType === 'HARSH_BRAKING' ? 'HARSH_DRIVING' : 'HARSH_DRIVING'
  );
  const [priority, setPriority] = useState<DriverCoaching['priority']>(
    triggerEvent?.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH'
  );
  const [recommendation, setRecommendation] = useState<string>(
    triggerEvent
      ? `Pelatihan khusus penanganan ${triggerEvent.eventType.replace('_', ' ')} pada area ${triggerEvent.locationName}`
      : 'Program Defensive Driving & Kesadaran Batas Kecepatan'
  );
  const [assignedToName, setAssignedToName] = useState<string>('Bambang S. (Head of Safety)');
  const [scheduledAt, setScheduledAt] = useState<string>('2026-08-20T09:00');
  const [notes, setNotes] = useState<string>('Fokus evaluasi jarak pengereman aman dan pengamatan situasi lalu lintas.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeDriver = summaries.find((s) => s.driverId === driverId);

    const newCoaching = behaviorStore.createCoaching({
      tenantId: 'tenant-1',
      driverId,
      driverName: activeDriver?.driverName || 'Driver',
      triggerEventId: triggerEvent?.id,
      category,
      priority,
      recommendation,
      assignedTo: 'usr-mgr-1',
      assignedToName,
      scheduledAt: new Date(scheduledAt).toISOString(),
      status: 'SCHEDULED',
      notes,
      beforeScore: activeDriver?.score || 75,
    });

    if (onCreated) onCreated(newCoaching);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Jadwalkan Driver Coaching</h3>
              <p className="text-xs text-slate-400">Buat sesi edukasi dan pendampingan pengemudi</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Pengemudi (Driver):</label>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {summaries.map((s) => (
                <option key={s.driverId} value={s.driverId}>
                  {s.driverName} ({s.branchName} • Skor: {s.score})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Kategori Coaching:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="SPEEDING">Overspeed / Kecepatan</option>
                <option value="HARSH_DRIVING">Defensif & Harsh Driving</option>
                <option value="IDLE_EFFICIENCY">Efisiensi Idling BBM</option>
                <option value="ROUTE_COMPLIANCE">Kepatuhan Rute Koridor</option>
                <option value="FATIGUE_SAFETY">Kelelahan & Jam Kerja</option>
                <option value="GENERAL">General Coaching</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Prioritas:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Rekomendasi Materi Coaching:</label>
            <input
              type="text"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Penanggung Jawab (Coach):</label>
              <input
                type="text"
                value={assignedToName}
                onChange={(e) => setAssignedToName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Jadwal Sesi:</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Catatan Pelaksanaan / Instruksi Khusus:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-950 flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" /> Simpan Sesi Coaching
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
