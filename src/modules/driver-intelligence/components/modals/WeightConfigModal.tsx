/**
 * Weight Config Modal - Custom Telematics Weight Matrix Configuration
 * PROMPT 29 - Operations / Admin capability to customize scoring weights
 */

import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, AlertTriangle, RotateCcw, Save } from 'lucide-react';
import { driverIntelligenceService } from '../../engines/DriverIntelligenceService';

interface WeightConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const WeightConfigModal: React.FC<WeightConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const currentWeights = driverIntelligenceService.getRiskModelWeights();

  const [overspeed, setOverspeed] = useState(Math.round((currentWeights.overspeed ?? 0.2) * 100));
  const [harshBraking, setHarshBraking] = useState(Math.round((currentWeights.harshBraking ?? 0.15) * 100));
  const [harshAcceleration, setHarshAcceleration] = useState(Math.round((currentWeights.harshAcceleration ?? 0.1) * 100));
  const [sharpTurn, setSharpTurn] = useState(Math.round((currentWeights.sharpTurn ?? 0.08) * 100));
  const [idleBehavior, setIdleBehavior] = useState(Math.round((currentWeights.idleBehavior ?? 0.08) * 100));
  const [routeDeviation, setRouteDeviation] = useState(Math.round((currentWeights.routeDeviation ?? 0.12) * 100));
  const [safetyEvents, setSafetyEvents] = useState(Math.round((currentWeights.safetyEvents ?? 0.12) * 100));
  const [fatigueRisk, setFatigueRisk] = useState(Math.round((currentWeights.fatigueRiskIndicators ?? 0.08) * 100));
  const [tripCompliance, setTripCompliance] = useState(Math.round((currentWeights.tripCompliance ?? 0.04) * 100));
  const [inspectionCompliance, setInspectionCompliance] = useState(Math.round((currentWeights.inspectionCompliance ?? 0.03) * 100));

  if (!isOpen) return null;

  const total =
    overspeed +
    harshBraking +
    harshAcceleration +
    sharpTurn +
    idleBehavior +
    routeDeviation +
    safetyEvents +
    fatigueRisk +
    tripCompliance +
    inspectionCompliance;
  const isValid = total === 100;

  const handleReset = () => {
    setOverspeed(20);
    setHarshBraking(15);
    setHarshAcceleration(10);
    setSharpTurn(8);
    setIdleBehavior(8);
    setRouteDeviation(12);
    setSafetyEvents(12);
    setFatigueRisk(8);
    setTripCompliance(4);
    setInspectionCompliance(3);
  };

  const handleSave = () => {
    if (!isValid) return;
    driverIntelligenceService.updateRiskModelWeights({
      overspeed: overspeed / 100,
      harshBraking: harshBraking / 100,
      harshAcceleration: harshAcceleration / 100,
      sharpTurn: sharpTurn / 100,
      idleBehavior: idleBehavior / 100,
      routeDeviation: routeDeviation / 100,
      safetyEvents: safetyEvents / 100,
      fatigueRiskIndicators: fatigueRisk / 100,
      tripCompliance: tripCompliance / 100,
      inspectionCompliance: inspectionCompliance / 100,
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Konfigurasi Bobot Model Risiko AI
              </h3>
              <p className="text-xs text-slate-400">
                Atur proporsi pembobotan telemetri sesuai prioritas operasional armada.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Weight Indicator */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono font-bold ${
            isValid
              ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-950/20 text-rose-300 border-rose-500/40'
          }`}
        >
          <span>TOTAL PERSENTASE BOBOT:</span>
          <span>{total}% / 100% {isValid ? '✓' : '(Harus 100%)'}</span>
        </div>

        {/* Sliders List */}
        <div className="space-y-3.5 text-xs">
          {/* Overspeed */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Overspeed (Kecepatan)</span>
              <span className="font-mono text-cyan-400">{overspeed}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={overspeed}
              onChange={(e) => setOverspeed(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Harsh Braking */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Harsh Braking (Rem Mendadak)</span>
              <span className="font-mono text-cyan-400">{harshBraking}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={harshBraking}
              onChange={(e) => setHarshBraking(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Harsh Acceleration */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Harsh Acceleration (Sentakan Gas)</span>
              <span className="font-mono text-cyan-400">{harshAcceleration}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={harshAcceleration}
              onChange={(e) => setHarshAcceleration(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Sharp Turn */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Sharp Turn (Tikungan Tajam)</span>
              <span className="font-mono text-cyan-400">{sharpTurn}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={sharpTurn}
              onChange={(e) => setSharpTurn(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Idling Behavior */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Idling Behavior (Mesin Hidup Diam)</span>
              <span className="font-mono text-cyan-400">{idleBehavior}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={idleBehavior}
              onChange={(e) => setIdleBehavior(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Route Deviation */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Route Deviation (Deviasi Rute)</span>
              <span className="font-mono text-cyan-400">{routeDeviation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={routeDeviation}
              onChange={(e) => setRouteDeviation(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Safety Incidents */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Safety Events & Critical Alerts</span>
              <span className="font-mono text-cyan-400">{safetyEvents}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={safetyEvents}
              onChange={(e) => setSafetyEvents(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Fatigue Risk */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Fatigue & Rest Break Risks</span>
              <span className="font-mono text-cyan-400">{fatigueRisk}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={fatigueRisk}
              onChange={(e) => setFatigueRisk(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Trip & Inspection Compliance */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Trip SOP</span>
                <span className="font-mono text-cyan-400">{tripCompliance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={tripCompliance}
                onChange={(e) => setTripCompliance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Pre-Trip Insp.</span>
                <span className="font-mono text-cyan-400">{inspectionCompliance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={inspectionCompliance}
                onChange={(e) => setInspectionCompliance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Bobot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
