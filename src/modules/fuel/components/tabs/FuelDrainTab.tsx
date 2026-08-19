/**
 * Fleet Intelligence Smart AI - Fuel Drain Tab
 * PROMPT 24 - Suspected Fuel Drain Events, Timeline Evidence & Review Workflows
 */

import React from 'react';
import { AlertTriangle, Clock, MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { FuelDrainEvent, FuelAnomaly } from '../../types';

interface FuelDrainTabProps {
  drains: FuelDrainEvent[];
  onOpenEventModal: (anomaly: FuelAnomaly) => void;
}

export const FuelDrainTab: React.FC<FuelDrainTabProps> = ({ drains, onOpenEventModal }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" /> Pemantauan Penurunan BBM Tak Wajar (Suspected Fuel Drain)
            </h3>
            <p className="text-xs text-slate-400">
              Deteksi penurunan volume tangki drastis saat kendaraan berhenti/mesin mati.
            </p>
          </div>
          <span className="text-xs text-rose-400 bg-rose-950/60 border border-rose-800/50 px-3 py-1 rounded-full font-bold">
            {drains.length} Kejadian Terdeteksi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drains.map((drain) => (
            <div
              key={drain.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 hover:border-rose-500/50 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{drain.vehiclePlate}</span>
                  <span className="text-xs text-slate-400">({drain.driverName || 'Driver N/A'})</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold">
                  {drain.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Volume Penurunan</span>
                  <span className="font-black text-rose-400 text-base">{drain.fuelDrop} Liter</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Durasi Penurunan</span>
                  <span className="font-bold text-white">{drain.duration} Menit</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Waktu Kejadian</span>
                  <span className="font-medium text-slate-300">{new Date(drain.timestamp).toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status Kontak (Ignition)</span>
                  <span className="font-bold text-amber-400">{drain.ignitionStatus ? 'ON' : 'OFF (Mesin Mati)'}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-rose-400" />
                  {drain.locationName || 'Tol Batang KM 375'}
                </div>
                <p className="text-[11px] text-slate-400">{drain.evidenceNotes}</p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() =>
                    onOpenEventModal({
                      id: drain.id,
                      tenantId: drain.tenantId,
                      vehicleId: drain.vehicleId,
                      vehiclePlate: drain.vehiclePlate,
                      type: 'SUSPECTED_DRAIN',
                      timestamp: drain.timestamp,
                      severity: 'HIGH',
                      expectedValue: drain.fuelBefore,
                      actualValue: drain.fuelAfter,
                      variance: -drain.fuelDrop,
                      confidence: drain.confidence,
                      evidence: {
                        gpsSpeed: drain.vehicleSpeed,
                        ignition: drain.ignitionStatus,
                        locationName: drain.locationName,
                        description: drain.evidenceNotes || 'Penurunan volume tangki terdeteksi.',
                      },
                      status: drain.status as any,
                      createdAt: drain.createdAt,
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs flex items-center gap-1"
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> Investigasi & Tindak Lanjut
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
