/**
 * Report Accident Modal
 * PROMPT 22 Architecture
 */

import React, { useState } from 'react';
import { Accident, AccidentType, AccidentSeverity } from '../../types';
import { X, ShieldAlert, MapPin, AlertTriangle, Truck, User, DollarSign, FileText } from 'lucide-react';

interface ReportAccidentModalProps {
  onClose: () => void;
  onSubmit: (newAccident: Partial<Accident>) => void;
}

export const ReportAccidentModal: React.FC<ReportAccidentModalProps> = ({ onClose, onSubmit }) => {
  const [type, setType] = useState<AccidentType>('VEHICLE_COLLISION');
  const [severity, setSeverity] = useState<AccidentSeverity>('HIGH');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState('Tol Jakarta - Cikampek KM 34');
  const [latitude, setLatitude] = useState(-6.28);
  const [longitude, setLongitude] = useState(107.08);
  const [driverName, setDriverName] = useState('Budi Santoso');
  const [vehiclePlate, setVehiclePlate] = useState('B 9211 TJP');
  const [description, setDescription] = useState('');
  const [weatherCondition, setWeatherCondition] = useState<'CLEAR' | 'RAIN' | 'FOG' | 'STORM' | 'NIGHT_LOW_VISIBILITY'>('RAIN');
  const [roadCondition, setRoadCondition] = useState<'DRY' | 'WET' | 'SLIPPERY' | 'DAMAGED' | 'CONSTRUCTION'>('SLIPPERY');
  const [injuries, setInjuries] = useState(0);
  const [fatalities, setFatalities] = useState(0);
  const [estimatedLossIdr, setEstimatedLossIdr] = useState(15000000);
  const [policeReportNumber, setPoliceReportNumber] = useState('');

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocation(`GPS Pin: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          alert('GPS tidak dapat diakses, menggunakan koordinat lokasi pilihan.');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Mohon isi deskripsi kronologi kecelakaan.');
      return;
    }

    const newAccident: Partial<Accident> = {
      incidentNumber: `ACC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      type,
      severity,
      dateTime: new Date(dateTime).toISOString(),
      reportedAt: new Date().toISOString(),
      location,
      latitude,
      longitude,
      driverName,
      vehiclePlate,
      description,
      weatherCondition,
      roadCondition,
      injuries,
      fatalities,
      propertyDamage: true,
      estimatedLossIdr,
      policeReportNumber: policeReportNumber || undefined,
      status: 'REPORTED',
      tenantId: 'tenant-01',
      createdBy: 'CurrentUser',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newAccident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Laporkan Kecelakaan (Report Accident)</h2>
              <p className="text-xs text-slate-400">Pencatatan insiden tabrakan, fatalitas, atau kerusakan fisik armada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipe Kecelakaan</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AccidentType)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="VEHICLE_COLLISION">VEHICLE COLLISION (Tabrakan Armada)</option>
                <option value="PEDESTRIAN_ACCIDENT">PEDESTRIAN ACCIDENT (Pejalan Kaki)</option>
                <option value="ROLLOVER">ROLLOVER (Terguling)</option>
                <option value="VEHICLE_DAMAGE">VEHICLE DAMAGE (Kerusakan Armada)</option>
                <option value="PROPERTY_DAMAGE">PROPERTY DAMAGE (Fasilitas Umum/Properti)</option>
                <option value="FATAL_ACCIDENT">FATAL ACCIDENT (Kecelakaan Fatal)</option>
                <option value="OTHER">OTHER (Lainnya)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tingkat Keparahan (Severity)</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AccidentSeverity)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="LOW">LOW (Ringan)</option>
                <option value="MEDIUM">MEDIUM (Sedang)</option>
                <option value="HIGH">HIGH (Berat)</option>
                <option value="CRITICAL">CRITICAL (Kritis)</option>
                <option value="FATAL">FATAL (Fatalitas)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Waktu Kejadian</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-semibold">Lokasi Kejadian</label>
                <button
                  type="button"
                  onClick={handleUseGPS}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <MapPin className="h-3 w-3" /> Ambil GPS
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nama jalan / KM Tol / Depo"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pengemudi (Driver)</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kendaraan (Plat Nomor)</label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kondisi Cuaca</label>
              <select
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value as any)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="CLEAR">CLEAR (Cerah)</option>
                <option value="RAIN">RAIN (Hujan)</option>
                <option value="FOG">FOG (Kabut)</option>
                <option value="STORM">STORM (Badai)</option>
                <option value="NIGHT_LOW_VISIBILITY">NIGHT (Malam Gelap)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kondisi Jalan</label>
              <select
                value={roadCondition}
                onChange={(e) => setRoadCondition(e.target.value as any)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="DRY">DRY (Kering)</option>
                <option value="WET">WET (Basah)</option>
                <option value="SLIPPERY">SLIPPERY (Licin)</option>
                <option value="DAMAGED">DAMAGED (Berlubang/Rusak)</option>
                <option value="CONSTRUCTION">CONSTRUCTION (Proyek Jalan)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Korban Luka</label>
              <input
                type="number"
                min="0"
                value={injuries}
                onChange={(e) => setInjuries(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fatalitas (Meninggal)</label>
              <input
                type="number"
                min="0"
                value={fatalities}
                onChange={(e) => setFatalities(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Estimasi Kerugian (Rp)</label>
              <input
                type="number"
                min="0"
                step="500000"
                value={estimatedLossIdr}
                onChange={(e) => setEstimatedLossIdr(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">No. Laporan Kepolisian (opsional)</label>
            <input
              type="text"
              value={policeReportNumber}
              onChange={(e) => setPoliceReportNumber(e.target.value)}
              placeholder="Contoh: POL/2026/08/998"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Kronologi & Deskripsi Kejadian</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kronologi kejadian secara mendetail..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-950"
            >
              Kirim Laporan Kecelakaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
