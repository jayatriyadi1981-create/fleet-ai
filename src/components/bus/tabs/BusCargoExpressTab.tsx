import React, { useState } from 'react';
import { BusCargoPackage, BusTrip } from '../../../modules/bus/types';
import { 
  Package, 
  Plus, 
  Search, 
  QrCode, 
  Phone, 
  MapPin, 
  Truck, 
  DollarSign, 
  CheckCircle,
  FileText
} from 'lucide-react';

interface Props {
  cargoPackages: BusCargoPackage[];
  trips: BusTrip[];
  onCreateCargo: (cargo: Partial<BusCargoPackage>) => void;
}

export const BusCargoExpressTab: React.FC<Props> = ({ cargoPackages, trips, onCreateCargo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [weightKg, setWeightKg] = useState(15);
  const [cargoFee, setCargoFee] = useState(150000);
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');

  const filteredCargo = cargoPackages.filter(c => 
    c.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trip = trips.find(t => t.id === selectedTripId) || trips[0];
    onCreateCargo({
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      itemDescription,
      weightKg,
      cargoFee,
      tripId: trip?.id,
      tripCode: trip?.tripCode,
      busPlateNumber: trip?.busPlateNumber
    });
    setShowAddModal(false);
    setSenderName('');
    setSenderPhone('');
    setReceiverName('');
    setReceiverPhone('');
    setItemDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Paket & Kargo Kilat Bagasi Bus (PO Express)
          </h3>
          <p className="text-xs text-slate-500">Layanan pengiriman paket, sparepart, dan dokumen antar-kota via bagasi bawah bus</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Terima Kiriman Paket Baru
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total Paket Dalam Perjalanan</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{filteredCargo.length} Koli</div>
          <p className="text-[11px] text-blue-600 mt-1">Muat di 4 bagasi bus aktif</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Pendapatan Kargo Hari Ini</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {filteredCargo.reduce((acc, c) => acc + c.cargoFee, 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lunas di loket keberangkatan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Rata-Rata Waktu Sampai</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">10-12 Jam</div>
          <p className="text-[11px] text-slate-400 mt-1">Sameday & Nextday Trans-Jawa</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nomor resi paket, pengirim, penerima, atau jenis barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Cargo Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">No. Resi Kargo</th>
                <th className="py-3.5 px-4">Pengirim & Asal</th>
                <th className="py-3.5 px-4">Penerima & Tujuan</th>
                <th className="py-3.5 px-4">Barang & Berat</th>
                <th className="py-3.5 px-4">Armada Bus</th>
                <th className="py-3.5 px-4">Biaya Kargo</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCargo.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {c.receiptNumber}
                    <div className="text-[10px] text-slate-400 font-normal">{c.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{c.senderName}</div>
                    <div className="text-[11px] text-slate-500">{c.senderPhone}</div>
                    <div className="text-[10px] text-slate-400">{c.originAgent}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{c.receiverName}</div>
                    <div className="text-[11px] text-slate-500">{c.receiverPhone}</div>
                    <div className="text-[10px] text-slate-400">{c.destinationAgent}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{c.itemDescription}</div>
                    <div className="text-[11px] text-slate-500">{c.weightKg} Kg • {c.koliCount} Koli</div>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">
                      {c.packageType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{c.busPlateNumber}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.tripCode}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    Rp {c.cargoFee.toLocaleString()}
                    <div className="text-[10px] text-slate-400 font-normal">Status: {c.paymentStatus}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cargo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Terima Kiriman Kargo Kilat Bus
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nama Pengirim</label>
                  <input 
                    type="text" 
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">No. Telp Pengirim</label>
                  <input 
                    type="text" 
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nama Penerima</label>
                  <input 
                    type="text" 
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">No. Telp Penerima</label>
                  <input 
                    type="text" 
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Deskripsi Barang / Koli</label>
                <input 
                  type="text" 
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="e.g. Sparepart Motor & Oli 2 Dus"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Berat Barang (Kg)</label>
                  <input 
                    type="number" 
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Tarif Ongkir (Rp)</label>
                  <input 
                    type="number" 
                    value={cargoFee}
                    onChange={(e) => setCargoFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Muat Pada Armada Bus / Jadwal</label>
                <select 
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200"
                >
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.tripCode} - {t.busPlateNumber} ({t.routeName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md"
                >
                  Cetak Resi Kargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
