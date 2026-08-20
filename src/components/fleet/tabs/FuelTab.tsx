import React, { useState } from 'react';
import { VehicleFuelRecord } from '../../../types/vehicle';
import { Fuel, Plus, AlertTriangle, CheckCircle2, TrendingUp, Calendar, DollarSign, MapPin } from 'lucide-react';

interface FuelTabProps {
  vehicleId: string;
  fuelRecords: VehicleFuelRecord[];
  onAddFuelRecord: (data: {
    litersAdded: number;
    costPerLiterIdr: number;
    gasStationName: string;
    locationAddress: string;
    odometerKm: number;
    fullTank: boolean;
    notes?: string;
  }) => Promise<void>;
}

export const FuelTab: React.FC<FuelTabProps> = ({ vehicleId, fuelRecords, onAddFuelRecord }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    litersAdded: '',
    costPerLiterIdr: '13500',
    gasStationName: 'SPBU Pertamina 34.175.02',
    locationAddress: 'Cikarang Barat, Bekasi',
    odometerKm: '',
    fullTank: true,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalLiters = fuelRecords.reduce((acc, r) => acc + (r.litersAdded || 0), 0);
  const totalCost = fuelRecords.reduce((acc, r) => acc + (r.totalCostIdr || 0), 0);
  const anomaliesCount = fuelRecords.filter((r) => r.isAnomaly).length;
  const avgKmPerL = fuelRecords.length > 0
    ? (fuelRecords.reduce((acc, r) => acc + (r.efficiencyKmPerLiter || 3.8), 0) / fuelRecords.length).toFixed(2)
    : '3.85';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.litersAdded || !formData.odometerKm) return;

    try {
      setIsSubmitting(true);
      await onAddFuelRecord({
        litersAdded: parseFloat(formData.litersAdded),
        costPerLiterIdr: parseFloat(formData.costPerLiterIdr) || 13500,
        gasStationName: formData.gasStationName,
        locationAddress: formData.locationAddress,
        odometerKm: parseInt(formData.odometerKm, 10),
        fullTank: formData.fullTank,
        notes: formData.notes,
      });
      setIsModalOpen(false);
      setFormData({
        litersAdded: '',
        costPerLiterIdr: '13500',
        gasStationName: 'SPBU Pertamina 34.175.02',
        locationAddress: 'Cikarang Barat, Bekasi',
        odometerKm: '',
        fullTank: true,
        notes: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Fuel Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Efisiensi</p>
          <p className="text-xl font-mono font-bold text-emerald-400">{avgKmPerL} KM / L</p>
          <p className="text-[10px] text-cyan-400">Standar Armada: 3.5 KM/L</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pengisian</p>
          <p className="text-xl font-mono font-bold text-white">{totalLiters.toLocaleString('id-ID')} Liter</p>
          <p className="text-[10px] text-slate-400">{fuelRecords.length} Kali Refill</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Biaya BBM</p>
          <p className="text-xl font-mono font-bold text-cyan-300">Rp {totalCost.toLocaleString('id-ID')}</p>
          <p className="text-[10px] text-slate-400">Biodiesel B35 Subsidi</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deteksi Anomali AI</p>
          <p className={`text-xl font-mono font-bold ${anomaliesCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {anomaliesCount} Anomali
          </p>
          <p className="text-[10px] text-slate-400">{anomaliesCount === 0 ? 'Konsumsi Normal' : 'Perlu Investigasi'}</p>
        </div>
      </div>

      {/* Fuel Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Fuel className="h-4 w-4 text-emerald-400" />
              Histori Refill BBM & Audit Konsumsi
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Pencatatan struk SPBU & integrasi fuel sensor telematics</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Catat Pengisian BBM
          </button>
        </div>

        {fuelRecords.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-2">
            <Fuel className="mx-auto h-8 w-8 text-slate-600" />
            <p className="text-xs text-slate-400">Belum ada riwayat pencatatan pengisian bahan bakar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fuelRecords.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{rec.gasStationName}</span>
                    {rec.receiptNumber && (
                      <span className="font-mono text-[10px] text-slate-400">({rec.receiptNumber})</span>
                    )}
                    {rec.isAnomaly && (
                      <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> ANOMALI: {rec.anomalyReason}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(rec.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Volume Ditambahkan</span>
                    <p className="font-mono font-bold text-emerald-400">{rec.litersAdded} Liter</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Total Biaya</span>
                    <p className="font-mono font-bold text-cyan-300">Rp {rec.totalCostIdr.toLocaleString('id-ID')}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Odometer Saat Isi</span>
                    <p className="font-mono font-bold text-white">{rec.odometerKm.toLocaleString('id-ID')} KM</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Driver Pencatat</span>
                    <p className="font-semibold text-slate-200">{rec.driverName || 'Driver Utama'}</p>
                  </div>
                </div>

                {rec.notes && (
                  <p className="text-[11px] text-slate-400 bg-slate-900/60 rounded-lg p-2 border border-slate-800">
                    Catatan: {rec.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Catat Pengisian BBM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Fuel className="h-5 w-5 text-emerald-400" />
              Catat Pengisian BBM Baru
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Volume BBM (Liter)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.litersAdded}
                  onChange={(e) => setFormData({ ...formData, litersAdded: e.target.value })}
                  placeholder="e.g. 150"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Harga / Liter (Rp)</label>
                  <input
                    type="number"
                    value={formData.costPerLiterIdr}
                    onChange={(e) => setFormData({ ...formData, costPerLiterIdr: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Odometer (KM)</label>
                  <input
                    type="number"
                    value={formData.odometerKm}
                    onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })}
                    placeholder="e.g. 84250"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama SPBU / Lokasi</label>
                <input
                  type="text"
                  value={formData.gasStationName}
                  onChange={(e) => setFormData({ ...formData, gasStationName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Tangki diisi penuh sebelum rute Semarang"
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data BBM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
