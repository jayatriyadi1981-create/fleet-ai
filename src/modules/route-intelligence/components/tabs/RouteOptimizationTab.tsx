/**
 * Fleet Intelligence Smart AI - Route Optimization & Alternatives Tab
 * Evaluates optimization objectives, configurable weights, vehicle restrictions,
 * and generates multi-route comparisons with explainable AI reasoning.
 */

import React, { useState } from 'react';
import { 
  OptimizationObjective, 
  OptimizationWeights, 
  AlternativeRouteOption, 
  VehicleRestrictionInfo 
} from '../../types';
import { routeOptimizationEngine } from '../../engines/RouteOptimizationEngine';
import { 
  Sparkles, 
  Sliders, 
  Truck, 
  CheckCircle2, 
  Route, 
  Clock, 
  Fuel, 
  ShieldAlert, 
  DollarSign, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const RouteOptimizationTab: React.FC = () => {
  const [origin, setOrigin] = useState('DC Cakung, Jakarta Timur');
  const [destination, setDestination] = useState('Hub Gedebage, Bandung');
  const [vehicleType, setVehicleType] = useState('Heavy Wingbox Truck (Tronton 20T)');
  const [objective, setObjective] = useState<OptimizationObjective>('BALANCED');
  
  // Custom weights
  const [timeWeight, setTimeWeight] = useState(35);
  const [distWeight, setDistWeight] = useState(25);
  const [fuelWeight, setFuelWeight] = useState(25);
  const [riskWeight, setRiskWeight] = useState(15);

  // Restriction settings
  const [hasHazardous, setHasHazardous] = useState(false);
  const [maxHeight, setMaxHeight] = useState('4.2');
  const [maxWeight, setMaxWeight] = useState('20');

  const optimizationResult = routeOptimizationEngine.generateRouteAlternatives({
    origin: { lat: -6.1850, lng: 106.9450, name: origin },
    destination: { lat: -6.9420, lng: 107.6850, name: destination },
    vehicleType,
    objective,
    customWeights: {
      timeWeight: timeWeight / 100,
      distanceWeight: distWeight / 100,
      fuelWeight: fuelWeight / 100,
      riskWeight: riskWeight / 100,
    },
    restrictions: {
      maxHeightMeters: parseFloat(maxHeight) || 4.2,
      maxWeightTons: parseFloat(maxWeight) || 20,
      hasHazardousCargo: hasHazardous,
      restrictionDataAvailable: true,
    },
  });

  const allRoutes = [optimizationResult.recommended, ...optimizationResult.alternatives];

  return (
    <div className="space-y-6">
      {/* Optimization Control Panel */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Generator Optimasi Rute Multi-Objective AI
              </h3>
              <p className="text-xs text-slate-400">
                Pilih tujuan efisiensi, spesifikasi batas fisik kendaraan & bobot pertimbangan.
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
            Engine v2.4 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Titik Asal (Origin / Depot)</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Titik Tujuan (Destination)</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Tipe Kendaraan & Golongan</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Heavy Wingbox Truck (Tronton 20T)">Heavy Wingbox Truck (Tronton 20T)</option>
              <option value="Box Truck CDD (10T)">Box Truck CDD (10T)</option>
              <option value="Medium CDE Refrigerator (8T)">Medium CDE Refrigerator (8T)</option>
              <option value="Blind Van / Logistik Ringan (2.5T)">Blind Van / Logistik Ringan (2.5T)</option>
            </select>
          </div>
        </div>

        {/* Objective Selector */}
        <div>
          <label className="text-xs text-slate-400 font-semibold block mb-2">Objective Prioritas Optimasi</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { key: 'FASTEST', label: 'Tercepat (Fastest)', icon: Clock, desc: 'Prioritas waktu tempuh' },
              { key: 'SHORTEST', label: 'Terpendek (Shortest)', icon: Route, desc: 'Prioritas jarak minimal' },
              { key: 'LOWEST_FUEL', label: 'Hemat BBM', icon: Fuel, desc: 'Efisiensi liter solar' },
              { key: 'LOWEST_COST', label: 'Biaya Terendah', icon: DollarSign, desc: 'BBM + Tarif Tol minimal' },
              { key: 'SAFEST', label: 'Paling Aman', icon: ShieldAlert, desc: 'Minim tikungan/kemacetan' },
              { key: 'BALANCED', label: 'Seimbang (Balanced)', icon: Sparkles, desc: 'Kombinasi multi-faktor' },
            ].map((obj) => {
              const Icon = obj.icon;
              const isSelected = objective === obj.key;
              return (
                <button
                  key={obj.key}
                  onClick={() => setObjective(obj.key as OptimizationObjective)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 mb-1 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div className="text-xs font-bold">{obj.label}</div>
                  <div className="text-[10px] text-slate-400">{obj.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weights Sliders (Expandable configuration) */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-cyan-400" /> Bobot Kustom Algoritma (Total: {timeWeight + distWeight + fuelWeight + riskWeight}%)
            </span>
            <span className="text-[10px] text-slate-400">Parameter dinamis dapat disesuaikan dispatcher</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Waktu:</span>
                <span className="font-bold text-white">{timeWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={timeWeight}
                onChange={(e) => setTimeWeight(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Jarak:</span>
                <span className="font-bold text-white">{distWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={distWeight}
                onChange={(e) => setDistWeight(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>BBM:</span>
                <span className="font-bold text-white">{fuelWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fuelWeight}
                onChange={(e) => setFuelWeight(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Risiko:</span>
                <span className="font-bold text-white">{riskWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={riskWeight}
                onChange={(e) => setRiskWeight(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Routes Comparison Cards */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Opsi Rute Alternatif & Rekomendasi Terpilih
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {allRoutes.map((route) => {
            return (
              <div
                key={route.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  route.isRecommended
                    ? 'bg-slate-900 border-cyan-500 shadow-xl ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      {route.isRecommended ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500 text-slate-950 uppercase tracking-wider inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> REKOMENDASI AI
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 uppercase">
                          ALTERNATIF
                        </span>
                      )}
                      <h5 className="text-sm font-bold text-white mt-2 leading-snug">{route.label}</h5>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 my-4 text-xs">
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">JARAK & DURASI</span>
                      <span className="text-sm font-black font-mono text-white">{route.distanceKm} km</span>
                      <span className="text-[11px] text-cyan-300 block">{route.durationMinutes} Menit</span>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">ESTIMASI BIAYA TOTAL</span>
                      <span className="text-sm font-black font-mono text-emerald-300">
                        Rp {route.totalCostEstimatedIdr.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Tol: Rp {route.estimatedTollCostIdr.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">ESTIMASI SOLAR</span>
                      <span className="text-sm font-black font-mono text-amber-300">{route.estimatedFuelLiters} Liter</span>
                      <span className="text-[10px] text-slate-400 block">Trafik: {route.trafficCondition}</span>
                    </div>
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">KEANDALAN HISTORIS</span>
                      <span className="text-xs font-bold text-indigo-300 block mt-0.5">
                        {route.historicalReliability}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Skor Risiko: {route.riskScore}/100</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {route.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {route.whyRecommended && (
                    <div className="mt-3 p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-xs text-cyan-200">
                      <strong className="text-cyan-400">Alasan AI: </strong> {route.whyRecommended}
                    </div>
                  )}

                  <div className="mt-2 text-[11px] text-slate-400">
                    <strong>Trade-off: </strong> {route.tradeOffs}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800">
                  <button
                    className={`w-full text-xs font-bold py-2 rounded-xl transition-all ${
                      route.isRecommended
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    Tugaskan Rute Ini ke Manifest
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
