/**
 * Quick Report Near Miss Modal (Mobile-First Architecture)
 * PROMPT 22 Section 16 & 21
 */

import React, { useState } from 'react';
import { NearMiss } from '../../types';
import { X, AlertTriangle, MapPin, Camera, CheckCircle } from 'lucide-react';

interface QuickReportNearMissModalProps {
  onClose: () => void;
  onSubmit: (nearMiss: Partial<NearMiss>) => void;
}

export const QuickReportNearMissModal: React.FC<QuickReportNearMissModalProps> = ({ onClose, onSubmit }) => {
  const [whatHappened, setWhatHappened] = useState('');
  const [location, setLocation] = useState('Rest Area KM 57 Tol Cikampek');
  const [vehiclePlate, setVehiclePlate] = useState('B 9211 TJP');
  const [driverName, setDriverName] = useState('Budi Santoso');
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [potentialConsequence, setPotentialConsequence] = useState('Hampir menabrak pembatas jalan akibat manuver mendadak');
  const [gpsCaptured, setGpsCaptured] = useState(false);

  const handleCaptureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`GPS Pin: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setGpsCaptured(true);
        },
        () => {
          alert('GPS tidak tersedia, lokasi default disimpan.');
          setGpsCaptured(true);
        }
      );
    } else {
      setGpsCaptured(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatHappened.trim()) {
      alert('Mohon tuliskan singkat apa yang terjadi.');
      return;
    }

    const newNearMiss: Partial<NearMiss> = {
      nearMissNumber: `NM-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'Near Miss (Kejadian Hampir Celaka)',
      severity: riskLevel === 'CRITICAL' ? 'HIGH' : riskLevel as any,
      dateTime: new Date().toISOString(),
      location,
      latitude: -6.36,
      longitude: 107.28,
      driverName,
      vehiclePlate,
      description: whatHappened,
      potentialConsequence,
      actualConsequence: 'Tidak ada korban / kerugian fisik',
      riskLevel,
      tenantId: 'tenant-01',
      createdBy: driverName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newNearMiss);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 p-5 shadow-2xl space-y-4 my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Lapor Near Miss (Quick Report)</h2>
              <p className="text-[11px] text-slate-400">Kejadian berpotensi bahaya tanpa korban fisik</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Mobile Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Apa yang Terjadi? (What Happened?)</label>
            <textarea
              rows={3}
              value={whatHappened}
              onChange={(e) => setWhatHappened(e.target.value)}
              placeholder="Contoh: Sepeda motor menyerobot dari blind spot kiri saat belok..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* GPS Auto Capture */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Lokasi Kejadian</p>
              <p className="text-xs font-bold text-white mt-0.5">{location}</p>
            </div>
            <button
              type="button"
              onClick={handleCaptureGPS}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                gpsCaptured ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{gpsCaptured ? 'GPS Tersimpan' : 'Ambil GPS'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kendaraan</label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pengemudi</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tingkat Potensi Risiko (Potential Risk)</label>
            <div className="grid grid-cols-4 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setRiskLevel(lvl)}
                  className={`py-2 rounded-xl text-[11px] font-bold border transition-colors ${
                    riskLevel === lvl
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-inner'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Potensi Dampak (Potential Consequence)</label>
            <input
              type="text"
              value={potentialConsequence}
              onChange={(e) => setPotentialConsequence(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Upload Photo Placeholder */}
          <div className="border border-dashed border-slate-800 rounded-xl p-3 text-center cursor-pointer hover:border-slate-700 transition-colors">
            <Camera className="h-5 w-5 text-slate-500 mx-auto mb-1" />
            <p className="text-[11px] text-slate-400">Ambil Foto Bukti (opsional)</p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-950"
            >
              Submit Laporan Near Miss
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
