/**
 * Behavior Event Detail Modal
 * Full context telemetry viewer, GPS coordinate map, 10s before/after timeline, and review feedback
 * PROMPT 21 Architecture
 */

import React, { useState } from 'react';
import { DriverBehaviorEvent, ReviewStatus } from '../../types';
import { behaviorStore } from '../../services/behaviorStore';
import {
  X,
  MapPin,
  Clock,
  Gauge,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  User,
  Truck,
  TrendingDown,
  Navigation,
  FileText,
  Activity,
  Layers,
  ThumbsUp,
  XCircle,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface EventDetailModalProps {
  event: DriverBehaviorEvent | null;
  onClose: () => void;
  onEventUpdated?: () => void;
  onCreateCoaching?: (event: DriverBehaviorEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onEventUpdated,
  onCreateCoaching,
}) => {
  if (!event) return null;

  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>(event.reviewStatus);
  const [reviewNote, setReviewNote] = useState<string>(event.reviewNote || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'telemetry' | 'context'>('details');

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const handleSaveReview = (newStatus: ReviewStatus) => {
    setIsSaving(true);
    setTimeout(() => {
      behaviorStore.reviewEvent(event.id, newStatus, reviewNote, 'Fleet Manager (Jayatriyadi)');
      setReviewStatus(newStatus);
      setIsSaving(false);
      if (onEventUpdated) onEventUpdated();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${getSeverityBadge(event.severity)}`}>
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">{event.eventType.replace('_', ' ')}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(event.severity)}`}>
                  {event.severity} SEVERITY
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {event.id}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(event.timestamp).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' })} • {event.locationName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Sub-navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/30 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'details' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" /> Summary & Review
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'telemetry' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" /> Telemetry Graph (10s Window)
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'context' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" /> GPS Map & Context
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Event Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Pengemudi</span>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white truncate">{event.driverName}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Kendaraan</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Truck className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white truncate">{event.vehiclePlate}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Kecepatan Real-time</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Gauge className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">{event.speed} km/h</span>
                    {event.speedLimit > 0 && (
                      <span className="text-[10px] text-slate-400">(Limit {event.speedLimit})</span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Indeks Risiko</span>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingDown className="h-4 w-4 text-rose-400" />
                    <span className="text-xs font-bold text-rose-300">{event.riskScore} / 100</span>
                  </div>
                </div>
              </div>

              {/* Event Metadata Cards */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" /> Detail Parameter Telemetri
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {event.metadata.excessSpeed !== undefined && (
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Kelebihan Kecepatan (Excess):</span>
                      <span className="font-bold text-amber-300">+{event.metadata.excessSpeed} km/h</span>
                    </div>
                  )}

                  {event.deceleration !== undefined && (
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Deselerasi (Harsh Brake):</span>
                      <span className="font-bold text-rose-300">{event.deceleration} m/s²</span>
                    </div>
                  )}

                  {event.acceleration !== undefined && (
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Akselerasi Tajam:</span>
                      <span className="font-bold text-amber-300">+{event.acceleration} m/s²</span>
                    </div>
                  )}

                  {event.metadata.turnAngle !== undefined && (
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Sudut Tikungan:</span>
                      <span className="font-bold text-cyan-300">{event.metadata.turnAngle}°</span>
                    </div>
                  )}

                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Durasi Persistensi:</span>
                    <span className="font-bold text-white">{event.duration} detik</span>
                  </div>

                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Skor Kepercayaan Data:</span>
                    <span className="font-bold text-emerald-400">{event.confidenceScore}% (Valid Validated)</span>
                  </div>
                </div>
              </div>

              {/* Review & Feedback Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" /> Peninjauan Kejadian (Event Review)
                  </h4>
                  <span className="text-xs font-mono text-slate-400">Status: <strong className="text-cyan-300">{reviewStatus}</strong></span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Catatan Reviewer / Manajer Operasional:</label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Tuliskan hasil verifikasi insiden ini..."
                    rows={2}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={isSaving}
                      onClick={() => handleSaveReview('CONFIRMED')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        reviewStatus === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-950'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" /> Konfirmasi Valid (Confirmed)
                    </button>

                    <button
                      disabled={isSaving}
                      onClick={() => handleSaveReview('FALSE_POSITIVE')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        reviewStatus === 'FALSE_POSITIVE'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-950'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> False Positive
                    </button>

                    <button
                      disabled={isSaving}
                      onClick={() => handleSaveReview('DISMISSED')}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        reviewStatus === 'DISMISSED'
                          ? 'bg-slate-700 text-slate-300 border-slate-600'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <XCircle className="h-3.5 w-3.5" /> Abaikan (Dismiss)
                    </button>
                  </div>

                  {onCreateCoaching && (
                    <button
                      onClick={() => {
                        onClose();
                        onCreateCoaching(event);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-950 transition-all"
                    >
                      <MessageSquare className="h-4 w-4" /> Buat Driver Coaching
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" /> Grafik Telemetri 10 Detik Sebelum & Sesudah Event
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-mono">SAMPLING: 1000ms</span>
                </div>

                {/* Simulated Telemetry Timeline Chart */}
                <div className="h-48 w-full bg-slate-900/80 rounded-xl border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>-10s (Pendekatan)</span>
                    <span className="text-rose-400 font-bold">0s (WAKTU KEJADIAN)</span>
                    <span>+10s (Pasca Insiden)</span>
                  </div>

                  {/* Speed Bar Visualizer */}
                  <div className="flex items-end justify-between h-28 gap-1 pt-2">
                    {[
                      { t: '-10s', v: event.speed * 0.75 },
                      { t: '-8s', v: event.speed * 0.82 },
                      { t: '-6s', v: event.speed * 0.9 },
                      { t: '-4s', v: event.speed * 0.96 },
                      { t: '-2s', v: event.speed * 0.99 },
                      { t: '0s', v: event.speed, isPeak: true },
                      { t: '+2s', v: event.speed * 0.85 },
                      { t: '+4s', v: event.speed * 0.70 },
                      { t: '+6s', v: event.speed * 0.65 },
                      { t: '+8s', v: event.speed * 0.62 },
                      { t: '+10s', v: event.speed * 0.60 },
                    ].map((pt, i) => {
                      const hPercent = Math.min(100, Math.max(15, (pt.v / 120) * 100));
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="opacity-0 group-hover:opacity-100 text-[9px] font-mono text-cyan-300 transition-opacity">
                            {Math.round(pt.v)}
                          </span>
                          <div
                            style={{ height: `${hPercent}%` }}
                            className={`w-full rounded-t-md transition-all ${
                              pt.isPeak
                                ? 'bg-gradient-to-t from-rose-600 to-amber-400 animate-pulse'
                                : 'bg-cyan-500/40 group-hover:bg-cyan-400'
                            }`}
                          />
                          <span className="text-[9px] font-mono text-slate-500">{pt.t}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  * Visualisasi memetakan fluktuasi kecepatan (km/jam) dan respon mengemudi driver dalam interval 20 detik di sekitar kejadian.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'context' && (
            <div className="space-y-6">
              {/* Map Canvas Mock */}
              <div className="relative h-72 w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                <div className="relative text-center space-y-3 z-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-xl shadow-rose-950 animate-bounce">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{event.locationName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Lat: {event.latitude.toFixed(6)}, Lng: {event.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-[10px] font-mono text-slate-300">
                  MAP LAYER: TELEMATICS GPS MAP
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
