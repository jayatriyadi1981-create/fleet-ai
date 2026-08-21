import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  HardHat, 
  FileText, 
  ShieldCheck, 
  Wrench, 
  Gauge, 
  Fuel, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { HeavyEquipmentAsset, EquipmentCategory } from '../../../modules/heavy-equipment/types';

interface Props {
  equipments: HeavyEquipmentAsset[];
  onAddEquipment: (eq: Partial<HeavyEquipmentAsset>) => void;
}

export const HeavyAssetsTab: React.FC<Props> = ({ equipments, onAddEquipment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form State for new equipment
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<EquipmentCategory>('EXCAVATOR');
  const [newBrand, setNewBrand] = useState('Komatsu');
  const [newModel, setNewModel] = useState('');
  const [newSerialNumber, setNewSerialNumber] = useState('');
  const [newEngineSN, setNewEngineSN] = useState('');
  const [newHM, setNewHM] = useState(0);
  const [newRate, setNewRate] = useState(300000);
  const [newSilo, setNewSilo] = useState('');

  const filteredEquipments = equipments.filter(eq => {
    const matchSearch = eq.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.currentSiteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || eq.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;
    onAddEquipment({
      code: newCode,
      name: newName,
      category: newCategory,
      brand: newBrand,
      model: newModel || `${newBrand} ${newName}`,
      serialNumber: newSerialNumber || `SN-${Date.now()}`,
      engineSerialNumber: newEngineSN || `ENG-${Date.now()}`,
      hourMeter: Number(newHM) || 0,
      rentalHourlyRate: Number(newRate) || 250000,
      siloCertificateNumber: newSilo || 'SILO-KEMENAKER-2026-PENDING'
    });
    setShowModal(false);
    setNewCode('');
    setNewName('');
    setNewModel('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" />
            Master Alat Berat, Armada Tambang & Sertifikasi SILO
          </h3>
          <p className="text-xs text-slate-500">
            Inventarisasi lengkap excavator, bulldozer, motor grader, dump truck, mobile crane, hour meter (HM) & perizinan kelayakan operasi.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Unit Alat Berat
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Cari kode unit (e.g. EXC-201), model, atau job site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 whitespace-nowrap">Kategori:</span>
          {['ALL', 'EXCAVATOR', 'BULLDOZER', 'MOTOR_GRADER', 'DUMP_TRUCK_HD', 'CRANE_MOBILE', 'VIBRO_ROLLER'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredEquipments.map((eq) => (
          <div 
            key={eq.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-amber-500/50 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs">
                  {eq.code}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{eq.name}</h4>
                <div className="text-xs text-slate-500">{eq.brand} • Th. {eq.year}</div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                eq.status === 'OPERATING'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : eq.status === 'STANDBY'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
              }`}>
                {eq.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px]">Hour Meter (HM):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {eq.hourMeter.toFixed(1)} HM
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Physical Avail (PA):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {eq.physicalAvailabilityPct}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Burn Rate Solar:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {eq.fuelBurnRateLitersPerHM} L/HM
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tarif Sewa:</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Rp {eq.rentalHourlyRate.toLocaleString('id-ID')}/jam
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{eq.currentSiteName}</span>
              </div>
              <div className="flex items-center gap-2">
                <HardHat className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">Operator: <strong>{eq.assignedOperatorName || 'Belum Ditugaskan'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">SILO: <strong className="font-mono">{eq.siloCertificateNumber}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Servis Berikutnya: <strong>{eq.nextServiceHM} HM</strong></span>
              <span className="font-mono text-slate-400">SN: {eq.serialNumber.slice(-8)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Alat Berat */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                Registrasi Alat Berat Baru
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Kode Lambung / Unit *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. EXC-205"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Kategori Alat *</label>
                  <select 
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as EquipmentCategory)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="EXCAVATOR">Excavator</option>
                    <option value="BULLDOZER">Bulldozer</option>
                    <option value="WHEEL_LOADER">Wheel Loader</option>
                    <option value="MOTOR_GRADER">Motor Grader</option>
                    <option value="DUMP_TRUCK_HD">Dump Truck HD</option>
                    <option value="CRANE_MOBILE">Mobile Crane</option>
                    <option value="VIBRO_ROLLER">Vibro Roller</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Brand / Merk</label>
                  <select 
                    value={newBrand}
                    onChange={e => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Komatsu">Komatsu</option>
                    <option value="Caterpillar">Caterpillar (CAT)</option>
                    <option value="Kobelco">Kobelco</option>
                    <option value="Hitachi">Hitachi</option>
                    <option value="Volvo">Volvo</option>
                    <option value="Scania">Scania</option>
                    <option value="Tadano">Tadano</option>
                    <option value="Bomag">Bomag</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Nama & Model Unit *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Komatsu PC210-10M0"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Serial Number Chassis</label>
                  <input 
                    type="text" 
                    placeholder="e.g. KMT-PC210-99201"
                    value={newSerialNumber}
                    onChange={e => setNewSerialNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Hour Meter Awal (HM)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={newHM}
                    onChange={e => setNewHM(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Tarif Sewa per Jam (IDR)</label>
                  <input 
                    type="number" 
                    placeholder="300000"
                    value={newRate}
                    onChange={e => setNewRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">No. Sertifikat SILO Kemenaker</label>
                  <input 
                    type="text" 
                    placeholder="SILO-KEMENAKER-2026-..."
                    value={newSilo}
                    onChange={e => setNewSilo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-all"
                >
                  Simpan Alat Berat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
