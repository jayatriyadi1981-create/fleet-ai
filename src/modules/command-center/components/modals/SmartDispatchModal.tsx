/**
 * Fleet Intelligence Smart AI - Smart Dispatch & Emergency Backup Finder Modal
 * AI-assisted nearest vehicle dispatch matching based on ETA, Fuel, and Driver Safety Score
 */

import React, { useState } from 'react';
import { 
  Send, 
  X, 
  MapPin, 
  Clock, 
  Gauge, 
  Fuel, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  User, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { commandCenterService } from '../../services/commandCenterService';
import { DispatchCandidate } from '../../types/commandCenterTypes';

interface SmartDispatchModalProps {
  onClose: () => void;
  targetLat?: number;
  targetLng?: number;
  emergencyId?: string;
}

export const SmartDispatchModal: React.FC<SmartDispatchModalProps> = ({
  onClose,
  targetLat = -6.2941,
  targetLng = 106.8821,
  emergencyId,
}) => {
  const [candidates, setCandidates] = useState<DispatchCandidate[]>(() =>
    commandCenterService.findDispatchCandidates(targetLat, targetLng)
  );
  const [selectedCandidate, setSelectedCandidate] = useState<DispatchCandidate | null>(candidates[0] || null);
  const [dispatchSuccess, setDispatchSuccess] = useState<boolean>(false);
  const [assignmentNotes, setAssignmentNotes] = useState<string>('Penugasan darurat dukungan armada dari Command Center');

  const handleExecuteDispatch = () => {
    if (!selectedCandidate) return;

    if (emergencyId) {
      commandCenterService.dispatchCandidateToEmergency(emergencyId, selectedCandidate);
    } else {
      commandCenterService.addEvent({
        category: 'DELIVERY',
        title: 'Smart Dispatch Assigned',
        description: `Unit ${selectedCandidate.plateNumber} (${selectedCandidate.driverName}) ditugaskan via Smart Dispatch (ETA: ${selectedCandidate.etaMinutes} menit).`,
        vehicleId: selectedCandidate.vehicleId,
        plateNumber: selectedCandidate.plateNumber,
        driverName: selectedCandidate.driverName,
        severity: 'HIGH',
      });
    }

    setDispatchSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-indigo-950/80 px-6 py-4 border-b border-indigo-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Smart AI Dispatch & Unit Terdekat
                </h2>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  AI RECOMMENDATION
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Kalkulasi radius tercepat & rekomendasi driver dengan skor keselamatan tertinggi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
          {dispatchSuccess ? (
            <div className="p-8 text-center bg-slate-950 rounded-xl border border-emerald-500/50 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Penugasan Armada Berhasil Dispatched!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Instruksi navigasi dan tugas telah dikirimkan ke Driver Mobile App{' '}
                <strong className="text-amber-400">{selectedCandidate?.driverName}</strong> ({selectedCandidate?.plateNumber}).
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Kandidat Armada Terdekat & Rekomendasi AI:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {candidates.map((cand) => {
                  const isSelected = selectedCandidate?.vehicleId === cand.vehicleId;
                  return (
                    <div
                      key={cand.vehicleId}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500 text-white shadow-xl'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-amber-400">
                              {cand.plateNumber}
                            </span>
                            <span className="text-xs text-slate-400">{cand.brandModel}</span>
                          </div>
                          <div className="text-xs font-semibold text-white mt-1">
                            {cand.driverName}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            {cand.suitabilityScore}% Match
                          </span>
                        </div>
                      </div>

                      {/* AI Reason */}
                      <p className="text-[11px] text-indigo-300 mt-2 bg-indigo-950/30 p-2 rounded border border-indigo-900/50">
                        ✨ {cand.recommendationReason}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-300 text-center">
                        <div>
                          <div className="text-[10px] text-slate-500">Jarak</div>
                          <div className="font-mono font-bold text-white">{cand.distanceKm} km</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Estimasi ETA</div>
                          <div className="font-mono font-bold text-amber-400">{cand.etaMinutes} mnt</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Skor Safety</div>
                          <div className="font-mono font-bold text-emerald-400">{cand.safetyScore}/100</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Assignment Notes */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Instruksi untuk Driver:
                </label>
                <input
                  type="text"
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action Button */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleExecuteDispatch}
                  disabled={!selectedCandidate}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Penugasan ({selectedCandidate?.plateNumber})</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
