import React, { useState } from 'react';
import { 
  Fuel, 
  Plus, 
  Truck, 
  Calendar, 
  Clock, 
  DollarSign, 
  Activity, 
  AlertTriangle,
  TrendingDown
} from 'lucide-react';
import { HeavyFuelLog, HeavyEquipmentAsset, ConstructionProject } from '../../../modules/heavy-equipment/types';

interface Props {
  fuelLogs: HeavyFuelLog[];
  equipments: HeavyEquipmentAsset[];
  projects: ConstructionProject[];
  onAddFuelLog: (fl: Partial<HeavyFuelLog>) => void;
}

export const HeavyFuelBowserTab: React.FC<Props> = ({
  fuelLogs,
  equipments,
  projects,
  onAddFuelLog
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState(equipments[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [currentHM, setCurrentHM] = useState(3420.5);
  const [litersFilled, setLitersFilled] = useState(250);
  const [fuelBowserTruck, setFuelBowserTruck] = useState('BOWSER-01 (Hino 500 Fuel Truck 8000L)');
  const [dispenserOperator, setDispenserOperator] = useState('Yusuf Effendi (Fuelman Site IKN)');
  const [fuelType, setFuelType] = useState<'SOLAR_B35' | 'DEXLITE' | 'INDUSTRI_HIGH_GRADE'>('SOLAR_B35');
  const [unitCost, setUnitCost] = useState(14500);

  const totalLiters = fuelLogs.reduce((acc, curr) => acc + curr.litersFilled, 0);
  const totalCost = fuelLogs.reduce((acc, curr) => acc + curr.totalCostIdr, 0);
  const avgBurnRate = (fuelLogs.reduce((acc, curr) => acc + curr.calculatedBurnRate, 0) / (fuelLogs.length || 1)).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eq = equipments.find(e => e.id === selectedEqId);
    const prj = projects.find(p => p.id === selectedProjectId);
    onAddFuelLog({
      equipmentId: selectedEqId,
      equipmentCode: eq?.code || 'EXC-201',
      equipmentName: eq?.name || 'Komatsu PC200-8MO',
      projectId: selectedProjectId,
      projectName: prj?.name || 'Proyek Tol IKN',
      currentHM: Number(currentHM),
      litersFilled: Number(litersFilled),
      fuelBowserTruck,
      dispenserOperator,
      fuelType,
      unitCostPerLiter: Number(unitCost),
      previousRefuelHM: Number(currentHM) - 12.5,
      calculatedBurnRate: Number((Number(litersFilled) / 12.5).toFixed(1))
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Fuel className="w-5 h-5 text-amber-500" />
            Manajemen BBM Solar & Distribusi Fuel Bowser Truck
          </h3>
          <p className="text-xs text-slate-500">
            Monitoring pengisian solar keliling di pit/site proyek, voucher BBM, burn rate (Liter/HM), dan deteksi anti-theft (pencurian solar).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Catat Pengisian Solar
        </button>
      </div>

      {/* Fuel Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Solar Tersalurkan</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {totalLiters.toLocaleString('id-ID')} Liter
          </div>
          <div className="text-[11px] text-slate-500">B35 & Industri High-Grade</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Biaya Solar</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            Rp {totalCost.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-500 font-medium">Rekonsiliasi Fuel Voucher Site</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Rata-Rata Burn Rate</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {avgBurnRate} <span className="text-xs font-normal">L/HM</span>
          </div>
          <div className="text-[11px] text-slate-500">Konsumsi per Hour Meter</div>
        </div>
      </div>

      {/* Fuel Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="py-3 px-4">No. Voucher & Waktu</th>
                <th className="py-3 px-4">Unit Alat Berat</th>
                <th className="py-3 px-4">Job Site</th>
                <th className="py-3 px-4">Hour Meter</th>
                <th className="py-3 px-4">Volume (Liter)</th>
                <th className="py-3 px-4">Burn Rate</th>
                <th className="py-3 px-4">Total Biaya</th>
                <th className="py-3 px-4">Fuel Bowser & Fuelman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {fuelLogs.map((fl) => (
                <tr key={fl.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">{fl.voucherNumber}</div>
                    <div className="text-slate-500 text-[11px]">{fl.date} • {fl.time} WIB</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-amber-600 dark:text-amber-400 font-mono">{fl.equipmentCode}</div>
                    <div className="text-slate-500 text-[11px] truncate max-w-[140px]">{fl.equipmentName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px]">
                    {fl.projectName.split('(')[0]}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {fl.currentHM.toFixed(1)} HM
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-600 text-sm">
                    {fl.litersFilled} L
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold text-[11px]">
                      {fl.calculatedBurnRate} L/HM
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    Rp {fl.totalCostIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{fl.fuelBowserTruck.split('(')[0]}</div>
                    <div className="text-slate-500">Dispenser: {fl.dispenserOperator.split('(')[0]}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Fuel Log */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Fuel className="w-5 h-5 text-amber-500" />
                Catat Refuel Solar Alat Berat
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Pilih Unit Alat Berat *</label>
                <select 
                  value={selectedEqId}
                  onChange={e => {
                    setSelectedEqId(e.target.value);
                    const eq = equipments.find(x => x.id === e.target.value);
                    if (eq) setCurrentHM(eq.hourMeter);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                >
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.code} - {eq.name} (HM: {eq.hourMeter})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Hour Meter Saat Refuel</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={currentHM}
                    onChange={e => setCurrentHM(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Liter Diisi *</label>
                  <input 
                    type="number" 
                    value={litersFilled}
                    onChange={e => setLitersFilled(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-mono font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Jenis Solar</label>
                  <select 
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="SOLAR_B35">Bio Solar B35 (Industri)</option>
                    <option value="DEXLITE">Dexlite Industri</option>
                    <option value="INDUSTRI_HIGH_GRADE">Pertamina Dex High-Grade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Harga per Liter (IDR)</label>
                  <input 
                    type="number" 
                    value={unitCost}
                    onChange={e => setUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Armada Fuel Bowser Truck</label>
                <input 
                  type="text" 
                  value={fuelBowserTruck}
                  onChange={e => setFuelBowserTruck(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center font-mono">
                <span className="text-slate-500 text-xs">Total Tagihan Solar:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  Rp {(litersFilled * unitCost).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md"
                >
                  Simpan Transaksi Solar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
