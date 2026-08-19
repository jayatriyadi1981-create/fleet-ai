/**
 * Safety Pattern & Hotspots Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  MapPin, 
  Layers, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Truck, 
  Navigation,
  Scale
} from 'lucide-react';
import { SafetyPatternEngine } from '../../engines/SafetyPatternEngine';
import { SafetyHotspot, SafetyPatternItem } from '../../types';

export const SafetyPatternHotspotsTab: React.FC = () => {
  const patterns = SafetyPatternEngine.getDetectedPatterns();
  const hotspots = SafetyPatternEngine.getSafetyHotspots();
  const [selectedHotspot, setSelectedHotspot] = useState<SafetyHotspot>(hotspots[0]);

  return (
    <div className="space-y-6">
      
      {/* Top Bias Differentiation Notice */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 shrink-0 mt-0.5">
          <Scale className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">
            Diferensiasi Pola: Driver vs Rute vs Kendaraan (Anti-Bias Safety Engine)
          </h4>
          <p className="text-slate-300 leading-relaxed">
            AI membedakan secara cermat apakah suatu anomali keselamatan terjadi akibat <strong>kebiasaan individu pengemudi</strong>, <strong>faktor geometris/kepadatan koridor rute</strong>, atau <strong>penurunan mekanis komponen armada</strong> untuk mencegah penilaian yang bias atau tidak adil.
          </p>
        </div>
      </div>

      {/* Grid: Hotspots Map/List & Detected Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Hotspot List */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            Daftar Hotspot Rawan ({hotspots.length})
          </h4>

          <div className="space-y-2.5">
            {hotspots.map(h => (
              <div
                key={h.id}
                onClick={() => setSelectedHotspot(h)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedHotspot.id === h.id
                    ? 'bg-slate-800 border-red-500/60 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white line-clamp-1">{h.name}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                    h.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {h.riskLevel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{h.locationName}</div>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">{h.primaryPattern}</p>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  <span>{h.incidentCount} Insiden</span>
                  <span>{h.accidentCount} Laka</span>
                  <span>{h.nearMissCount} Near-Miss</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle & Right: Interactive Hotspot Details & Pattern List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Hotspot Inspector Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Detail Analisis Geospatial Hotspot
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Lat: {selectedHotspot.latitude.toFixed(4)}, Lng: {selectedHotspot.longitude.toFixed(4)}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-sm text-white">{selectedHotspot.name}</h5>
                <span className="text-xs text-slate-400">Radius Bahaya: <strong>{selectedHotspot.radiusMeters} Meter</strong></span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedHotspot.primaryPattern}
              </p>
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800 text-xs text-slate-200">
                <span className="text-emerald-400 font-semibold">Rekomendasi Mitigasi:</span> {selectedHotspot.recommendedMitigation}
              </div>
              <div className="text-[11px] text-slate-400">
                Rute Terdampak: <span className="text-slate-200 font-mono">{selectedHotspot.affectedRoutes.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Detected Patterns */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Pola Keselamatan Berulang yang Teridentifikasi (Recurring Safety Patterns)
            </h4>

            <div className="space-y-3">
              {patterns.map(pat => (
                <div key={pat.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                        pat.scope === 'DRIVER_SPECIFIC' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        pat.scope === 'ROUTE_SPECIFIC' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        pat.scope === 'VEHICLE_SPECIFIC' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {pat.scope.replace('_', ' ')}
                      </span>
                      <h5 className="font-bold text-white text-xs">{pat.title}</h5>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{pat.observedCount} Kejadian</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{pat.description}</p>
                  
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-emerald-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Intervensi Disarankan:</strong> {pat.suggestedIntervention}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
