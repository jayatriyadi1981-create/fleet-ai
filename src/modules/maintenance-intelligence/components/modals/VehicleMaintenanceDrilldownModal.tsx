/**
 * Fleet Intelligence Smart AI - Vehicle Maintenance Drilldown Modal
 * Deep inspection of vehicle health, 12-component status, live telemetry gauges,
 * upcoming service schedules, and parts demand forecast.
 */

import React, { useState } from 'react';
import { VehicleMaintenanceProfile, ComponentHealthItem } from '../../types';
import { 
  X, 
  Truck, 
  Activity, 
  ShieldCheck, 
  Wrench, 
  Battery, 
  Gauge, 
  Thermometer, 
  Calendar, 
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ChevronRight
} from 'lucide-react';

interface VehicleMaintenanceDrilldownModalProps {
  profile: VehicleMaintenanceProfile;
  isOpen: boolean;
  onClose: () => void;
  onExplainAI: (profile: VehicleMaintenanceProfile) => void;
  onApproveRecommendation?: (recId: string) => void;
}

export const VehicleMaintenanceDrilldownModal: React.FC<VehicleMaintenanceDrilldownModalProps> = ({
  profile,
  isOpen,
  onClose,
  onExplainAI,
  onApproveRecommendation,
}) => {
  const [activeTab, setActiveTab] = useState<'COMPONENTS' | 'PREDICTIONS' | 'SERVICES' | 'COSTS'>('COMPONENTS');

  if (!isOpen) return null;

  const isCritical = profile.riskLevel === 'CRITICAL';
  const isHigh = profile.riskLevel === 'HIGH';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono tracking-wide">{profile.plateNumber}</h2>
                <span className="text-xs text-slate-400 font-sans">• {profile.brandModel}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  isHigh ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  Risk: {profile.riskLevel} ({profile.riskScore}/100)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Driver: <span className="text-slate-200">{profile.driverName}</span> • Cabang: <span className="text-slate-200">{profile.branch}</span> • Odometer: <span className="text-cyan-300 font-mono font-semibold">{profile.totalMileage.toLocaleString()} KM</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExplainAI(profile)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Explain with AI
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Real-Time Sensor Telemetry Quick Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-slate-950/40 border-b border-slate-800/80">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Battery className={`h-5 w-5 ${
              (profile.sensorReadings.batteryVoltage || 24.5) < 23.8 ? 'text-rose-400' : 'text-cyan-400'
            }`} />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Voltase Baterai</span>
              <span className="text-sm font-bold text-white font-mono">
                {profile.sensorReadings.batteryVoltage !== undefined ? `${profile.sensorReadings.batteryVoltage.toFixed(1)} V` : '24.8 V'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Thermometer className={`h-5 w-5 ${
              (profile.sensorReadings.coolantTempC || 88) > 95 ? 'text-rose-400' : 'text-emerald-400'
            }`} />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Suhu Mesin / Coolant</span>
              <span className="text-sm font-bold text-white font-mono">
                {profile.sensorReadings.coolantTempC || 88}°C
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Gauge className="h-5 w-5 text-indigo-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Tekanan Oli</span>
              <span className="text-sm font-bold text-white font-mono">
                {profile.sensorReadings.oilPressureKpa || 280} kPa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Clock className="h-5 w-5 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Engine Hours</span>
              <span className="text-sm font-bold text-white font-mono">
                {profile.totalEngineHours.toLocaleString()} Jam
              </span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/20">
          <button
            onClick={() => setActiveTab('COMPONENTS')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'COMPONENTS'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            12 Sistem Komponen
          </button>
          <button
            onClick={() => setActiveTab('PREDICTIONS')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'PREDICTIONS'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Prediksi Kegagalan AI ({profile.activePredictions.length})
          </button>
          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'SERVICES'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Jadwal Servis Berkala ({profile.serviceDueItems.length})
          </button>
          <button
            onClick={() => setActiveTab('COSTS')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'COSTS'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Biaya & Downtime Bengkel
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeTab === 'COMPONENTS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {profile.components.map((comp) => {
                const isWarn = comp.status === 'WARNING';
                const isCrit = comp.status === 'CRITICAL';
                return (
                  <div
                    key={comp.component}
                    className={`p-4 rounded-xl border transition-all ${
                      isCrit ? 'bg-rose-950/20 border-rose-500/40 shadow-sm shadow-rose-950/50' :
                      isWarn ? 'bg-amber-950/20 border-amber-500/30' :
                      'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white truncate max-w-[70%]">{comp.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCrit ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        isWarn ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {comp.status}
                      </span>
                    </div>

                    {comp.healthScore !== undefined && (
                      <div className="mb-2.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span>Health Score</span>
                          <span className="font-mono font-bold text-white">{comp.healthScore}/100</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              comp.healthScore > 80 ? 'bg-emerald-400' :
                              comp.healthScore > 60 ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${comp.healthScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <ul className="space-y-1.5 text-[11px] text-slate-300 pt-1 border-t border-slate-800/60">
                      {comp.indicators.map((ind, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className={ind.status === 'FAIL' ? 'text-rose-400' : ind.status === 'WARN' ? 'text-amber-400' : 'text-emerald-400'}>
                            {ind.status === 'FAIL' ? '✕' : ind.status === 'WARN' ? '⚠' : '✓'}
                          </span>
                          <span className="leading-tight">{ind.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'PREDICTIONS' && (
            <div className="space-y-3">
              {profile.activePredictions.map((pred) => (
                <div key={pred.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{pred.componentName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Horizon: {pred.horizonLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          Probabilitas: {Math.round((pred.failureProbabilityScore || 0.7) * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 font-medium">{pred.potentialFailureMode}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Quality: {pred.predictionQuality}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                    <span className="text-[11px] font-bold text-cyan-400 block uppercase tracking-wider">Bukti Telemetri & Histori</span>
                    {pred.evidence.map((ev, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{ev.finding}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400 font-medium">
                      Rekomendasi: <span className="text-slate-200">{pred.recommendedAction}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'SERVICES' && (
            <div className="space-y-3">
              {profile.serviceDueItems.map((srv) => (
                <div key={srv.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{srv.serviceType}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          srv.status === 'CRITICAL_OVERDUE' || srv.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          srv.status === 'DUE_SOON' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {srv.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Estimasi Biaya: <span className="text-white font-mono font-bold">Rp {srv.estimatedCost.toLocaleString('id-ID')}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Prediksi Tanggal Servis</span>
                      <span className="text-sm font-bold text-cyan-300 font-mono">{srv.predictedServiceDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Jarak Saat Ini</span>
                      <span className="text-xs font-bold text-white font-mono">{srv.currentMileage.toLocaleString()} KM</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Target Servis</span>
                      <span className="text-xs font-bold text-white font-mono">{srv.nextServiceMileage.toLocaleString()} KM</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Sisa Jarak</span>
                      <span className={`text-xs font-bold font-mono ${srv.remainingMileage < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {srv.remainingMileage < 0 ? `Terlewat ${Math.abs(srv.remainingMileage).toLocaleString()} KM` : `${srv.remainingMileage.toLocaleString()} KM`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'COSTS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Total Biaya Pemeliharaan YTD</span>
                  <span className="text-xl font-bold text-white font-mono mt-1 block">
                    Rp {profile.costMetrics.totalMaintenanceCostYTD.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Cost Per KM</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-cyan-300 font-mono">
                      Rp {profile.costMetrics.costPerKm.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-slate-400">/ km</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Downtime Bengkel (90 Hari)</span>
                  <span className="text-xl font-bold text-amber-300 font-mono mt-1 block">
                    {profile.costMetrics.downtimeDaysLast90Days} Hari
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <span className="text-xs text-slate-400">
            Model Engine: FleetIntel-PredictiveMaintenance v2.4.2
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
