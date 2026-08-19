/**
 * Fleet Intelligence Smart AI - Delivery Route Optimization Tab
 * Multi-stop delivery sequencing, customer time-windows, stop-level ETA predictions,
 * and delivery window breach risk warnings.
 */

import React, { useState } from 'react';
import { DeliveryOptimizationPlan, DeliveryStopItem } from '../../types';
import { deliveryOptimizationEngine } from '../../engines/DeliveryOptimizationEngine';
import { 
  PackageCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpDown, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const DeliveryRouteTab: React.FC = () => {
  const [plans, setPlans] = useState<DeliveryOptimizationPlan[]>(deliveryOptimizationEngine.getAllPlans());
  const [selectedPlan, setSelectedPlan] = useState<DeliveryOptimizationPlan>(plans[0]);

  const handleReoptimize = (planId: string) => {
    const updatedStops = deliveryOptimizationEngine.optimizeStopSequence(selectedPlan.stops, 'BALANCED');
    const updated = {
      ...selectedPlan,
      stops: updatedStops,
    };
    setSelectedPlan(updated);
    setPlans(plans.map((p) => (p.planId === planId ? updated : p)));
  };

  return (
    <div className="space-y-6">
      {/* Manifest Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => {
          const isSelected = plan.planId === selectedPlan.planId;

          return (
            <div
              key={plan.planId}
              onClick={() => setSelectedPlan(plan)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-xl ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-cyan-400">{plan.manifestNumber}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  {plan.status}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{plan.plateNumber} • {plan.driverName}</h4>
                  <span className="text-xs text-slate-400">{plan.branch}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white">{plan.totalStops} Titik Drop</span>
                  <span className="text-[11px] text-slate-400 block">{plan.totalDistanceKm} km ({plan.totalDurationMinutes} mnt)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Delivery Sequence Details */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Manifest: {selectedPlan.manifestNumber}
              </span>
              <h3 className="text-base font-bold text-white">Urutan Rute Pengiriman Multi-Stop AI</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Kendaraan: {selectedPlan.plateNumber} • Driver: {selectedPlan.driverName} • Total Jarak: {selectedPlan.totalDistanceKm} km
            </p>
          </div>

          <button
            onClick={() => handleReoptimize(selectedPlan.planId)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="h-4 w-4" /> Optimasi Ulang Urutan Drop AI
          </button>
        </div>

        {/* Stops Sequence Timeline */}
        <div className="space-y-3">
          {selectedPlan.stops.map((stop) => {
            const isCompleted = stop.status === 'COMPLETED';
            const isInProgress = stop.status === 'IN_PROGRESS';

            return (
              <div
                key={stop.orderId}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted ? 'bg-slate-950/40 border-slate-800/60 opacity-80' :
                  isInProgress ? 'bg-slate-950 border-cyan-500/60 shadow-lg' :
                  'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black text-sm shrink-0">
                    {stop.sequence}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{stop.customerName}</span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">[{stop.orderId}]</span>
                      {stop.priority === 'URGENT' && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          URGENT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{stop.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">JENDELA WAKTU (SLOT)</span>
                    <span className="font-mono text-slate-200">{stop.timeWindow.start} - {stop.timeWindow.end} WIB</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PREDIKSI ETA</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">{stop.predictedETA} WIB</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PROBABILITAS ON-TIME</span>
                    <span className="font-mono font-bold text-emerald-400">{stop.onTimeProbabilityPercentage}%</span>
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-300' :
                      isInProgress ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {stop.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
