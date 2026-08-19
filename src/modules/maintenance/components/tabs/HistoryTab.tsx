/**
 * Fleet Intelligence Smart AI - Maintenance History & Timeline Tab
 * PROMPT 25 - Chronological Audit Trail & Event Timeline per Vehicle
 */

import React, { useState } from 'react';
import {
  History,
  Truck,
  Wrench,
  AlertTriangle,
  ClipboardCheck,
  Zap,
  Calendar,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MOCK_VEHICLE_HEALTH } from '../../data/mockMaintenanceData';

export const HistoryTab: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(MOCK_VEHICLE_HEALTH[0].vehicleId);
  const selectedVehicle = MOCK_VEHICLE_HEALTH.find((v) => v.vehicleId === selectedVehicleId) || MOCK_VEHICLE_HEALTH[0];

  const MOCK_EVENTS = [
    {
      date: '2026-08-15 09:00',
      title: 'Pemeriksaan Sistem Pengereman & Ganti Kampas Tromol',
      type: 'REPAIR',
      odometer: 128450,
      cost: 3650000,
      technician: 'Agus Pratama',
      workshop: 'Bengkel Pusat Cakung Fleet Hub',
      notes: 'Piringan dibubut rata, kampas baru dipasang sesuai SOP.',
    },
    {
      date: '2026-08-14 06:30',
      title: 'Inspeksi Pre-Trip Oleh Pengemudi',
      type: 'INSPECTION',
      odometer: 128450,
      cost: 0,
      technician: 'Bambang S. (Driver)',
      notes: 'Status PASS. Kendaraan siap diberangkatkan rute Jawa Tengah.',
    },
    {
      date: '2026-07-28 08:15',
      title: 'Servis Berkala 10.000 KM & Ganti Oli Mesin',
      type: 'SERVICE',
      odometer: 125000,
      cost: 1850000,
      technician: 'Agus Pratama',
      workshop: 'Bengkel Pusat Cakung Fleet Hub',
      notes: 'Oli Meditran SX 20L + Oil Filter Cartridge baru.',
    },
    {
      date: '2026-06-10 14:00',
      title: 'Rotasi Ban & Balancing 10 Roda',
      type: 'SERVICE',
      odometer: 115200,
      cost: 1200000,
      technician: 'Bambang Irawan',
      workshop: 'Mitra Ban Sentosa (Cikarang)',
      notes: 'Rotasi silang pola 10 ban, spooring chamber kembali presisi.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-cyan-400" />
            Riwayat Pemeliharaan & Timeline Peristiwa Kendaraan
          </h2>
          <p className="text-xs text-slate-400">
            Jejak audit kronologis seluruh aktivitas servis berkala, perbaikan darurat, inspeksi driver, dan penggantian spare part.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
          >
            {MOCK_VEHICLE_HEALTH.map((v) => (
              <option key={v.vehicleId} value={v.vehicleId}>
                {v.vehiclePlate} ({v.brand} {v.model})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Vehicle Info Banner */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-cyan-400">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{selectedVehicle.vehiclePlate}</h3>
            <p className="text-xs text-slate-400">{selectedVehicle.brand} {selectedVehicle.model} | Odometer: {selectedVehicle.mileageKm.toLocaleString()} KM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Skor Kesehatan: <strong className="text-emerald-400">{selectedVehicle.healthScore}/100</strong>
          </span>
          <span className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Total Biaya Servis: <strong className="text-emerald-400">Rp {(selectedVehicle.maintenanceCostIdr / 1000000).toFixed(1)} Jt</strong>
          </span>
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white">Kronologi Riwayat Servis & Peristiwa</h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {MOCK_EVENTS.map((event, idx) => (
            <div key={idx} className="relative pl-6 space-y-2">
              <div className={`absolute left-0 top-1 h-5 w-5 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] ${
                event.type === 'REPAIR' ? 'bg-amber-500 text-slate-950' :
                event.type === 'SERVICE' ? 'bg-cyan-500 text-slate-950' :
                'bg-emerald-500 text-slate-950'
              }`}>
                {event.type === 'REPAIR' ? '🔧' : event.type === 'SERVICE' ? '⚙️' : '📋'}
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{event.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                      {event.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{event.date}</span>
                </div>

                <p className="text-xs text-slate-300">{event.notes}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>Odometer: <strong>{event.odometer.toLocaleString()} KM</strong> | Teknisi: <strong>{event.technician}</strong></span>
                  {event.cost > 0 && (
                    <span className="font-bold text-emerald-400">Biaya: Rp {event.cost.toLocaleString('id-ID')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
