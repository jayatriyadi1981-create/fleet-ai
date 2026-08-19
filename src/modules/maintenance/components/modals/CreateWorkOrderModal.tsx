/**
 * Fleet Intelligence Smart AI - Create Work Order Modal
 * PROMPT 25 - Form for creating a new Work Order
 */

import React, { useState } from 'react';
import {
  X,
  Wrench,
  Truck,
  Building,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { MOCK_VEHICLE_HEALTH, MOCK_VENDORS } from '../../data/mockMaintenanceData';
import { WorkOrder, WorkOrderPriority, MaintenanceType } from '../../types';

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newWo: Partial<WorkOrder>) => void;
  defaultVehicleId?: string;
}

export const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultVehicleId
}) => {
  if (!isOpen) return null;

  const [vehicleId, setVehicleId] = useState(defaultVehicleId || MOCK_VEHICLE_HEALTH[0].vehicleId);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MaintenanceType>('PREVENTIVE');
  const [priority, setPriority] = useState<WorkOrderPriority>('MEDIUM');
  const [workshopId, setWorkshopId] = useState(MOCK_VENDORS[0].id);
  const [technician, setTechnician] = useState('');
  const [scheduledStart, setScheduledStart] = useState('2026-08-16');
  const [scheduledEnd, setScheduledEnd] = useState('2026-08-17');
  const [estimatedCost, setEstimatedCost] = useState('1850000');
  const [reportedIssue, setReportedIssue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVeh = MOCK_VEHICLE_HEALTH.find((v) => v.vehicleId === vehicleId);
    const selectedWs = MOCK_VENDORS.find((w) => w.id === workshopId);

    const newOrder: Partial<WorkOrder> = {
      id: `wo-${Date.now()}`,
      number: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId,
      vehiclePlate: selectedVeh?.vehiclePlate || 'B 9211 TJP',
      title: title || 'Servis Pemeliharaan Berkala',
      maintenanceType: type,
      category: 'ENGINE',
      priority,
      status: 'APPROVED',
      workshopId,
      workshopName: selectedWs?.name || 'Bengkel Pusat Cakung Fleet Hub',
      assignedTechnician: technician || 'Agus Pratama',
      scheduledStart,
      scheduledEnd,
      estimatedCost: Number(estimatedCost) || 1500000,
      reportedIssue: reportedIssue || 'Servis preventif berkala sesuai jadwal Odometer.',
    };

    onSubmit(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-cyan-400">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Buat Surat Perintah Kerja (Work Order)</h2>
              <p className="text-xs text-slate-400">Terbitkan perintah servis resmi untuk bengkel mitra atau teknisi internal.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Vehicle Select */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Kendaraan Target</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-semibold"
            >
              {MOCK_VEHICLE_HEALTH.map((v) => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.vehiclePlate} - {v.brand} {v.model} (Skor: {v.healthScore}/100)
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Judul Pekerjaan</label>
            <input
              type="text"
              placeholder="Contoh: Servis Berkala 20.000 KM & Ganti Kampas Rem"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Type & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Tipe Servis</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="PREVENTIVE">Preventive Maintenance</option>
                <option value="CORRECTIVE">Corrective Repair</option>
                <option value="EMERGENCY">Emergency Breakdown</option>
                <option value="INSPECTION">Pemeriksaan Rutin / KIR</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Tingkat Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical (Darurat)</option>
              </select>
            </div>
          </div>

          {/* Workshop & Technician */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Bengkel Pelaksana</label>
              <select
                value={workshopId}
                onChange={(e) => setWorkshopId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                {MOCK_VENDORS.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Teknisi / PIC</label>
              <input
                type="text"
                placeholder="Nama Teknisi Utama..."
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Schedule & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Jadwal Mulai</label>
              <input
                type="date"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Target Selesai</label>
              <input
                type="date"
                value={scheduledEnd}
                onChange={(e) => setScheduledEnd(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Estimasi Biaya (IDR)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Reported Issue */}
          <div className="space-y-1">
            <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Detail Masalah & Instruksi</label>
            <textarea
              rows={3}
              placeholder="Jelaskan deskripsi kerusakan, gejala, atau instruksi khusus untuk mekanik..."
              value={reportedIssue}
              onChange={(e) => setReportedIssue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-600/30"
            >
              Terbitkan Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
