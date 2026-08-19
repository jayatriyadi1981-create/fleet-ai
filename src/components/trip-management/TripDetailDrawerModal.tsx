/**
 * Fleet Intelligence Smart AI - Operational Trip Detail Drawer Modal
 * PROMPT 15 — Full Operational Inspection View, Route Map, Waypoints & Lifecycle Actions
 */

import React, { useEffect, useState } from 'react';
import {
  PlannedTrip,
  TripAuditTimelineItem,
  TripAiEtaPrediction,
  PlannedVsActualComparison,
} from '../../modules/trips/plannedTripTypes';
import { TripStatusTransitionService } from '../../modules/trips/services/tripStatusService';
import { TripTimelineService } from '../../modules/trips/services/tripTimelineService';
import { TripPlanningAiService } from '../../modules/trips/services/tripPlanningAiService';
import { EtaService } from '../../modules/trips/services/etaService';
import {
  X,
  Navigation,
  Truck,
  User,
  MapPin,
  Clock,
  Send,
  ExternalLink,
  Route,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  ShieldCheck,
  ChevronRight,
  Play,
  Check,
} from 'lucide-react';

interface TripDetailDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: PlannedTrip | null;
  onDispatchTrip: (trip: PlannedTrip) => void;
  onStartTrip: (trip: PlannedTrip) => void;
  onCompleteTrip: (trip: PlannedTrip) => void;
  onCancelTrip: (trip: PlannedTrip) => void;
  onTrackLive: (vehicleId: string) => void;
  onViewHistory: (actualTripId: string) => void;
}

export const TripDetailDrawerModal: React.FC<TripDetailDrawerModalProps> = ({
  isOpen,
  onClose,
  trip,
  onDispatchTrip,
  onStartTrip,
  onCompleteTrip,
  onCancelTrip,
  onTrackLive,
  onViewHistory,
}) => {
  const [timeline, setTimeline] = useState<TripAuditTimelineItem[]>([]);
  const [aiPrediction, setAiPrediction] = useState<TripAiEtaPrediction | null>(null);
  const [comparison, setComparison] = useState<PlannedVsActualComparison | null>(null);

  useEffect(() => {
    if (trip) {
      setTimeline(TripTimelineService.getTimeline(trip.id));
      TripPlanningAiService.predictTripEta(trip).then((res) => setAiPrediction(res));
      if (trip.status === 'COMPLETED' || trip.status === 'IN_TRANSIT') {
        setComparison(EtaService.comparePlannedVsActual(trip));
      }
    }
  }, [trip]);

  if (!isOpen || !trip) return null;

  const badgeStyle = TripStatusTransitionService.getStatusBadgeStyle(trip.status);
  const badgeLabel = TripStatusTransitionService.getStatusLabel(trip.status);

  const steps = ['PLANNED', 'ASSIGNED', 'DISPATCHED', 'IN_TRANSIT', 'ARRIVED', 'COMPLETED'];
  const currentStepIdx = steps.indexOf(trip.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300 border border-blue-400/30">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">{trip.tripNumber}</h2>
              <p className="text-xs text-blue-200">
                Ref: {trip.referenceNumber || '-'} | {trip.customerName || 'Operational Trip'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              {badgeLabel}
            </span>

            {trip.priority === 'URGENT' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                URGENT
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {['PLANNED', 'ASSIGNED', 'READY'].includes(trip.status) && (
              <button
                onClick={() => onDispatchTrip(trip)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Trip</span>
              </button>
            )}

            {trip.status === 'DISPATCHED' && (
              <button
                onClick={() => onStartTrip(trip)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Mulai Perjalanan</span>
              </button>
            )}

            {trip.status === 'ARRIVED' && (
              <button
                onClick={() => onCompleteTrip(trip)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Selesaikan Trip</span>
              </button>
            )}

            {trip.status === 'IN_TRANSIT' && trip.vehicleId && (
              <button
                onClick={() => onTrackLive(trip.vehicleId)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs animate-pulse"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Tracking GPS</span>
              </button>
            )}

            {trip.status === 'COMPLETED' && (
              <button
                onClick={() => onViewHistory(trip.actualTripId || 'trp-001')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                <Route className="w-3.5 h-3.5" />
                <span>Trip History GPS</span>
              </button>
            )}

            {!['COMPLETED', 'CANCELLED', 'FAILED'].includes(trip.status) && (
              <button
                onClick={() => onCancelTrip(trip)}
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Batalkan Trip"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Lifecycle Flow Visualizer */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
            <div className="text-[11px] font-bold text-gray-500 uppercase mb-3">Lifecycle Progress Operasional</div>
            <div className="flex items-center justify-between text-xs overflow-x-auto pb-1">
              {steps.map((st, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <React.Fragment key={st}>
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isPassed
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] font-bold mt-1 uppercase ${
                          isCurrent ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 min-w-[20px] ${
                          currentStepIdx > idx ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Planned vs Actual Variance Card (If available) */}
          {comparison && (
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-blue-200 pb-2">
                <span>Perbandingan Planned vs Actual</span>
                <span className="px-2 py-0.5 bg-blue-200 rounded text-[10px]">
                  Status: {comparison.onTimeStatus}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="bg-white p-2 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-gray-500 uppercase">Variansi Jarak</div>
                  <div className="text-sm font-extrabold text-blue-700">
                    {comparison.distanceVarianceKm >= 0 ? `+${comparison.distanceVarianceKm}` : comparison.distanceVarianceKm} KM
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-gray-500 uppercase">Variansi Waktu</div>
                  <div className="text-sm font-extrabold text-indigo-700">
                    {comparison.durationVarianceMinutes >= 0 ? `+${comparison.durationVarianceMinutes}` : comparison.durationVarianceMinutes} mnt
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-blue-100">
                  <div className="text-[10px] text-gray-500 uppercase">Keterlambatan ETA</div>
                  <div className="text-sm font-extrabold text-amber-700">
                    +{comparison.etaDelayMinutes} mnt
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle & Driver Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Kendaraan Armada</span>
              </div>
              <div className="text-sm font-extrabold text-gray-900">
                {trip.vehiclePlate || 'Belum Ditunjuk'}
              </div>
              <div className="text-xs text-gray-500">{trip.vehicleName || '-'}</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Pengemudi (Driver)</span>
              </div>
              <div className="text-sm font-extrabold text-gray-900">
                {trip.driverName || 'Belum Ditunjuk'}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>{trip.driverPhone || '-'}</span>
              </div>
            </div>
          </div>

          {/* Route & Waypoints */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Rute Perjalanan & Waypoint ({trip.distanceKm} KM)
              </span>
              <span className="text-xs font-bold text-blue-600">
                Est. {Math.floor(trip.estimatedDurationMinutes / 60)}j {trip.estimatedDurationMinutes % 60}m
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Origin */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  A
                </div>
                <div>
                  <div className="font-bold text-gray-900">{trip.origin.name}</div>
                  <div className="text-gray-500 text-[11px]">{trip.origin.address}</div>
                </div>
              </div>

              {/* Waypoints */}
              {trip.waypoints.map((wp, idx) => (
                <div key={wp.id} className="flex items-start gap-2.5 pl-2 border-l-2 border-indigo-200 ml-2.5 py-1">
                  <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{wp.name}</div>
                    <div className="text-gray-500 text-[11px]">{wp.address}</div>
                  </div>
                </div>
              ))}

              {/* Destination */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  B
                </div>
                <div>
                  <div className="font-bold text-gray-900">{trip.destination.name}</div>
                  <div className="text-gray-500 text-[11px]">{trip.destination.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Risk Prediction */}
          {aiPrediction && (
            <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white p-4 rounded-xl space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>AI Predictive ETA & Delay Risk Analysis</span>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded border border-indigo-400/30 font-bold">
                  Confidence {aiPrediction.confidencePercent}%
                </span>
              </div>

              <div className="text-xs text-indigo-100 space-y-1">
                {aiPrediction.keyFactors.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operational Audit Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Audit Operational Lifecycle Timeline
            </h3>
            <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {timeline.map((item) => (
                <div key={item.id} className="relative bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                  <div className="absolute -left-6 top-3 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-2xs" />
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span>{item.action}</span>
                    <span className="text-[10px] font-mono text-gray-500 font-normal">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px]">{item.details}</p>
                  <div className="text-[10px] text-gray-400">Oleh: {item.userName} ({item.userRole})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
