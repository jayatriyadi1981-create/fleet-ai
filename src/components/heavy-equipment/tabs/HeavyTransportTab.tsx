import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  FileCheck, 
  Plus, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  Filter, 
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  EquipmentTransportRequest, 
  HeavyEquipmentAsset, 
  ConstructionSite 
} from '../../../modules/heavy-equipment/types';

interface Props {
  transportRequests: EquipmentTransportRequest[];
  equipments: HeavyEquipmentAsset[];
  sites: ConstructionSite[];
  onRequestTransport: (tr: Partial<EquipmentTransportRequest>) => EquipmentTransportRequest;
}

export const HeavyTransportTab: React.FC<Props> = ({
  transportRequests,
  equipments,
  sites,
  onRequestTransport
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    equipmentId: equipments[0]?.id || '',
    originSite: 'Central Pool Balikpapan KM 13',
    destinationSite: sites[0]?.name || 'Site Proyek',
    lowbedTrailerVehicle: 'LOWBED-01 (Volvo FH16 6x4 Heavy Lowbed)',
    driverName: 'Surya Darmawan',
    requestedDate: new Date().toISOString().slice(0, 10),
    permitNumber: `IZIN-DISHUB-${new Date().getFullYear()}-089`,
    routePlan: 'Rute Jalan Tol Balikpapan-Samarinda -> Koridor KIPP IKN',
    transportCostIdr: 15000000
  });

  const filteredRequests = transportRequests.filter(tr => 
    tr.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tr.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tr.originSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tr.destinationSite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selEq = equipments.find(eq => eq.id === formData.equipmentId);

    onRequestTransport({
      equipmentId: formData.equipmentId,
      equipmentCode: selEq?.code || '',
      equipmentName: selEq?.name || '',
      originSite: formData.originSite,
      destinationSite: formData.destinationSite,
      lowbedTrailerVehicle: formData.lowbedTrailerVehicle,
      driverName: formData.driverName,
      requestedDate: formData.requestedDate,
      permitNumber: formData.permitNumber,
      routePlan: formData.routePlan,
      transportCostIdr: Number(formData.transportCostIdr)
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-500" />
            Manajemen Transportasi & Mobilisasi Alat Berat (Lowbed Delivery)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan pergerakan alat antar job site menggunakan armada Lowbed / Dolly trailer, perizinan dispensasi jalan (Dishub/Polantas), dan pemantauan delivery time.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Order Transportasi Lowbed
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Total Permintaan Transport</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {transportRequests.length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Armada Lowbed Ready</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            3 <span className="text-xs text-slate-400 font-normal">Trailer Unit</span>
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Status Mobilisasi Selesai</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {transportRequests.filter(tr => tr.status === 'CONFIRMED' || tr.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Total Biaya Mob/Demob</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Rp {(transportRequests.reduce((acc, curr) => acc + curr.transportCostIdr, 0) / 1000000).toFixed(1)} Juta
          </p>
        </div>
      </div>

      {/* Transport Requests List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari order transport, unit, rute..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none w-full text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">No. Order & Alat</th>
                <th className="p-3.5">Rute Asal ➔ Tujuan</th>
                <th className="p-3.5">Armada Lowbed & Driver</th>
                <th className="p-3.5">Izin Angkutan Khusus</th>
                <th className="p-3.5">Biaya Mob/Demob</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {filteredRequests.map((tr) => (
                <tr key={tr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono text-[11px] text-slate-400 block">{tr.requestNumber}</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{tr.equipmentCode}</span>
                    <span className="text-[11px] text-slate-500">{tr.equipmentName}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-1">
                      <span className="text-slate-900 dark:text-white block font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {tr.originSite}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 block font-medium flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        {tr.destinationSite}
                      </span>
                      <span className="text-[10px] text-slate-400 block italic">{tr.routePlan}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-900 dark:text-white block">{tr.lowbedTrailerVehicle}</span>
                    <span className="text-[11px] text-slate-500">Driver: {tr.driverName}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {tr.permitNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">Pengawalan Patwal Siap</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Rp {tr.transportCostIdr.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300">
                      {tr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Order Transportasi Baru */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" />
                Buat Order Transportasi Alat Berat (Lowbed Delivery)
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Pilih Unit Alat Berat yang Dimobilisasi</label>
                <select
                  value={formData.equipmentId}
                  onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.code} - {eq.name} ({eq.capacity})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Lokasi Asal (Origin)</label>
                  <input
                    type="text"
                    value={formData.originSite}
                    onChange={(e) => setFormData({ ...formData, originSite: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Lokasi Tujuan (Destination Site)</label>
                  <input
                    type="text"
                    value={formData.destinationSite}
                    onChange={(e) => setFormData({ ...formData, destinationSite: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Armada Lowbed Trailer</label>
                  <input
                    type="text"
                    value={formData.lowbedTrailerVehicle}
                    onChange={(e) => setFormData({ ...formData, lowbedTrailerVehicle: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Nama Driver Lowbed</label>
                  <input
                    type="text"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">No. Izin Jalan Dishub/Polri</label>
                  <input
                    type="text"
                    value={formData.permitNumber}
                    onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Biaya Mobilisasi (IDR)</label>
                  <input
                    type="number"
                    value={formData.transportCostIdr}
                    onChange={(e) => setFormData({ ...formData, transportCostIdr: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Rencana Rute & Pengawalan</label>
                <textarea
                  rows={2}
                  value={formData.routePlan}
                  onChange={(e) => setFormData({ ...formData, routePlan: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
                >
                  Terbitkan Order Lowbed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
