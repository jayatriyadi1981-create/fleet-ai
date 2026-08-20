import React, { useState } from 'react';
import { VehicleMaintenanceRecord } from '../../../types/vehicle';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, Building2, Calendar, FileText } from 'lucide-react';

interface MaintenanceTabProps {
  vehicleId: string;
  maintenanceRecords: VehicleMaintenanceRecord[];
  onAddMaintenanceRecord: (data: {
    serviceType: any;
    title: string;
    priority: any;
    serviceDate: string;
    serviceOdometerKm: number;
    nextServiceOdometerKm?: number;
    workshopName: string;
    technicianName: string;
    totalCostIdr: number;
    notes: string;
  }) => Promise<void>;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  vehicleId,
  maintenanceRecords,
  onAddMaintenanceRecord,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: 'routine_service',
    title: '',
    priority: 'medium',
    serviceDate: new Date().toISOString().split('T')[0],
    serviceOdometerKm: '',
    nextServiceOdometerKm: '',
    workshopName: 'Hino Authorized Dealer Cikarang',
    technicianName: 'Bambang S.',
    totalCostIdr: '2500000',
    notes: '',
  });

  const totalSpend = maintenanceRecords.reduce((acc, r) => acc + (r.totalCostIdr || 0), 0);
  const scheduledCount = maintenanceRecords.filter((r) => r.status === 'scheduled' || r.status === 'in_progress').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.serviceOdometerKm) return;

    try {
      setIsSubmitting(true);
      await onAddMaintenanceRecord({
        serviceType: formData.serviceType as any,
        title: formData.title,
        priority: formData.priority as any,
        serviceDate: formData.serviceDate,
        serviceOdometerKm: parseInt(formData.serviceOdometerKm, 10),
        nextServiceOdometerKm: formData.nextServiceOdometerKm ? parseInt(formData.nextServiceOdometerKm, 10) : undefined,
        workshopName: formData.workshopName,
        technicianName: formData.technicianName,
        totalCostIdr: parseInt(formData.totalCostIdr, 10) || 0,
        notes: formData.notes,
      });
      setIsModalOpen(false);
      setFormData({
        serviceType: 'routine_service',
        title: '',
        priority: 'medium',
        serviceDate: new Date().toISOString().split('T')[0],
        serviceOdometerKm: '',
        nextServiceOdometerKm: '',
        workshopName: 'Hino Authorized Dealer Cikarang',
        technicianName: 'Bambang S.',
        totalCostIdr: '2500000',
        notes: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Maintenance KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Servis Tercatat</p>
          <p className="text-xl font-mono font-bold text-white">{maintenanceRecords.length} Servis</p>
          <p className="text-[10px] text-cyan-400">Riwayat Perawatan Bengkel</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Order Berjalan</p>
          <p className="text-xl font-mono font-bold text-amber-400">{scheduledCount} Jadwal</p>
          <p className="text-[10px] text-slate-400">Dalam Antrean Servis</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Biaya Perawatan</p>
          <p className="text-xl font-mono font-bold text-cyan-300">Rp {totalSpend.toLocaleString('id-ID')}</p>
          <p className="text-[10px] text-slate-400">Akumulasi Sparepart & Jasa</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Kelayakan Unit</p>
          <p className="text-xl font-mono font-bold text-emerald-400">PRIMA</p>
          <p className="text-[10px] text-slate-400">Siap Operasional Dispatch</p>
        </div>
      </div>

      {/* Maintenance List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-400" />
              Work Order & Riwayat Perawatan Berkala
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Integrasi jadwal berkala, suku cadang, dan bengkel rekanan</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Buat Work Order Baru
          </button>
        </div>

        {maintenanceRecords.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-2">
            <Wrench className="mx-auto h-8 w-8 text-slate-600" />
            <p className="text-xs text-slate-400">Belum ada catatan work order pemeliharaan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {maintenanceRecords.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      {rec.workOrderNumber}
                    </span>
                    <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        rec.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : rec.status === 'scheduled'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      ● {rec.status.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    {rec.serviceDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Bengkel Rekanan</span>
                    <p className="font-semibold text-slate-200">{rec.workshopName}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Teknisi / PIC</span>
                    <p className="font-semibold text-slate-200">{rec.technicianName}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Odometer Servis</span>
                    <p className="font-mono font-bold text-white">{rec.serviceOdometerKm.toLocaleString('id-ID')} KM</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Total Biaya</span>
                    <p className="font-mono font-bold text-cyan-300">Rp {rec.totalCostIdr.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {rec.partsReplaced && rec.partsReplaced.length > 0 && (
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suku Cadang & Jasa Diganti:</p>
                    <div className="space-y-1">
                      {rec.partsReplaced.map((part, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>• {part.partName} ({part.quantity}x)</span>
                          <span className="font-mono text-slate-400">Rp {part.costIdr.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rec.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    Catatan Teknisi: {rec.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-400" />
              Buat Work Order Pemeliharaan Baru
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Pekerjaan Servis</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Servis Rutin 85.000 KM & Ganti Oli Mesin"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jenis Layanan</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="routine_service">Servis Berkala / Rutin</option>
                    <option value="oil_change">Ganti Oli & Filter</option>
                    <option value="brake_overhaul">Overhaul Rem</option>
                    <option value="tire_replacement">Ganti Ban</option>
                    <option value="engine_repair">Perbaikan Mesin</option>
                    <option value="kir_inspection">Persiapan Uji KIR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prioritas</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="low">Rendah (Low)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="high">Tinggi (High)</option>
                    <option value="critical">Kritis (Critical)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Odometer Servis (KM)</label>
                  <input
                    type="number"
                    value={formData.serviceOdometerKm}
                    onChange={(e) => setFormData({ ...formData, serviceOdometerKm: e.target.value })}
                    placeholder="e.g. 84500"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Estimasi Biaya (Rp)</label>
                  <input
                    type="number"
                    value={formData.totalCostIdr}
                    onChange={(e) => setFormData({ ...formData, totalCostIdr: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bengkel Rekanan</label>
                <input
                  type="text"
                  value={formData.workshopName}
                  onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan / Instruksi Kerja</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Periksa ketebalan kampas rem depan dan balancing roda"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses...' : 'Simpan Work Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
