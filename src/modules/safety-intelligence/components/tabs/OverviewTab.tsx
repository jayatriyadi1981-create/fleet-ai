/**
 * Overview Tab - AI Safety Intelligence Dashboard
 * PROMPT 33 Architecture
 */

import React from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  User, 
  Truck, 
  Navigation, 
  Activity,
  ArrowRight,
  Flame,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AISafetyKPIs, DriverSafetyProfile, VehicleSafetyProfile, RouteSafetyProfile, SafetyHotspot, SafetyRecommendationItem, SafetyIntelligenceTabKey } from '../../types';

interface OverviewTabProps {
  kpis: AISafetyKPIs;
  drivers: DriverSafetyProfile[];
  vehicles: VehicleSafetyProfile[];
  routes: RouteSafetyProfile[];
  hotspots: SafetyHotspot[];
  recommendations: SafetyRecommendationItem[];
  onSelectDriver: (driver: DriverSafetyProfile) => void;
  onSelectVehicle: (vehicle: VehicleSafetyProfile) => void;
  onSelectRoute: (route: RouteSafetyProfile) => void;
  onSwitchTab: (tabKey: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  kpis,
  drivers,
  vehicles,
  routes,
  hotspots,
  recommendations,
  onSelectDriver,
  onSelectVehicle,
  onSelectRoute,
  onSwitchTab,
}) => {
  const highRiskDrivers = drivers.filter(d => d.riskLevel === 'HIGH' || d.riskLevel === 'CRITICAL');
  const highRiskVehicles = vehicles.filter(v => v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL');

  return (
    <div className="space-y-6">
      
      {/* Top AI Insights Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">AI Safety Executive Summary</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Score 87/100 (+4.8%)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              Skor keselamatan armada mengalami tren membaik dalam 30 hari terakhir. Terdeteksi <strong className="text-amber-400">{highRiskDrivers.length} pengemudi</strong> dengan lonjakan overspeed shift malam, dan <strong className="text-red-400">{highRiskVehicles.length} unit armada</strong> yang membutuhkan kalibrasi kampas rem darurat. Hotspot rawan utama berpusat di Tol Cipularang KM 90-93.
            </p>
          </div>
        </div>
        <button
          onClick={() => onSwitchTab('ADVISOR')}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Tanya AI Safety Advisor
        </button>
      </div>

      {/* Main Grid: Risk Breakdown & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Risk Distribution & Hotspots */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Multi-Dimensional Risk Factor Breakdown */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Distribusi Komponen Skor Keselamatan Armada (0 - 100)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Bobot Terdistribusi Normal</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">1. Kepatuhan Perilaku Pengemudi (Driver Behavior)</span>
                  <span className="text-emerald-400 font-mono font-bold">92 / 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">2. Kepatuhan Waktu & Anti-Fatigue (Fatigue Telemetry)</span>
                  <span className="text-emerald-400 font-mono font-bold">85 / 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">3. Kepatuhan Koridor Geofence & Rute (Route Compliance)</span>
                  <span className="text-emerald-400 font-mono font-bold">94 / 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">4. Kesiapan Armada & Hasil Inspeksi (Inspection & Maintenance)</span>
                  <span className="text-emerald-400 font-mono font-bold">90 / 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '90%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">5. Pengurangan Dampak Insiden / Near-Miss (Incident Penalty)</span>
                  <span className="text-amber-400 font-mono font-bold">80 / 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* High-Risk Entities Summary Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Drivers needing attention */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="w-4 h-4 text-amber-400" />
                  Pengemudi Perlu Perhatian
                </h4>
                <button
                  onClick={() => onSwitchTab('DRIVER_SAFETY')}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Lihat Semua ({drivers.length}) <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {drivers.slice(0, 3).map(d => (
                  <div
                    key={d.driverId}
                    onClick={() => onSelectDriver(d)}
                    className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{d.driverName}</div>
                      <div className="text-[11px] text-slate-400">{d.branch} • {d.overspeedEventsLast30d} overspeed</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold font-mono ${
                        d.riskLevel === 'CRITICAL' ? 'text-red-400' :
                        d.riskLevel === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {d.overallSafetyScore}/100
                      </span>
                      <div className="text-[10px] text-slate-400">{d.riskLevel} Risk</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicles needing attention */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  Armada Perlu Perhatian
                </h4>
                <button
                  onClick={() => onSwitchTab('VEHICLE_SAFETY')}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Lihat Semua ({vehicles.length}) <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {vehicles.slice(0, 3).map(v => (
                  <div
                    key={v.vehicleId}
                    onClick={() => onSelectVehicle(v)}
                    className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{v.plateNumber}</div>
                      <div className="text-[11px] text-slate-400">{v.model.split('(')[0]} • {v.branch}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold font-mono ${
                        v.riskLevel === 'CRITICAL' ? 'text-red-400' :
                        v.riskLevel === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {v.overallSafetyScore}/100
                      </span>
                      <div className="text-[10px] text-slate-400">{v.brakeConditionStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Col: Top Hotspots & AI Recommendations */}
        <div className="space-y-6">
          
          {/* Top Hotspots */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-red-400" />
                Hotspot Rawan Keselamatan
              </h4>
              <button
                onClick={() => onSwitchTab('PATTERNS_HOTSPOTS')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                Peta Lengkap
              </button>
            </div>

            <div className="space-y-2.5">
              {hotspots.map(h => (
                <div key={h.id} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white line-clamp-1">{h.name}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                      h.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {h.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{h.primaryPattern}</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
                    <span>{h.incidentCount} Insiden</span>
                    <span>{h.nearMissCount} Near-Miss</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable AI Recommendations */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Rekomendasi Tindakan AI
              </h4>
              <button
                onClick={() => onSwitchTab('COACHING_CAPA')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                Lihat CAPA
              </button>
            </div>

            <div className="space-y-2.5">
              {recommendations.slice(0, 3).map(rec => (
                <div key={rec.id} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                      rec.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      rec.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {rec.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{rec.ownerDepartment}</span>
                  </div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{rec.title}</h5>
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
