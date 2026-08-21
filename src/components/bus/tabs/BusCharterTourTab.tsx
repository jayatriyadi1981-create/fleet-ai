import React, { useState } from 'react';
import { BusCharterBooking } from '../../../modules/bus/types';
import { 
  Bus, 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  CheckCircle, 
  FileText,
  Phone
} from 'lucide-react';

interface Props {
  charterBookings: BusCharterBooking[];
}

export const BusCharterTourTab: React.FC<Props> = ({ charterBookings: initialBookings }) => {
  const [bookings, setBookings] = useState<BusCharterBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [busType, setBusType] = useState('Jetbus 5 SHD Pariwisata (Seat 50)');
  const [busCount, setBusCount] = useState(2);
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationTour, setDestinationTour] = useState('');
  const [startDate, setStartDate] = useState('2026-09-10');
  const [endDate, setEndDate] = useState('2026-09-14');
  const [totalAmount, setTotalAmount] = useState(30000000);
  const [downPaymentAmount, setDownPaymentAmount] = useState(10000000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: BusCharterBooking = {
      id: `cht-${Date.now()}`,
      bookingNumber: `CHT-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      customerPhone,
      organizationName,
      busType,
      busCount,
      pickupLocation,
      destinationTour,
      startDate,
      endDate,
      totalDays: 5,
      totalAmount,
      downPaymentAmount,
      remainingAmount: totalAmount - downPaymentAmount,
      status: 'CONFIRMED_DP_PAID',
      assignedBuses: ['B 7990 KGA', 'B 7991 KGA']
    };
    setBookings([newBooking, ...bookings]);
    setShowAddModal(false);
  };

  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.organizationName && b.organizationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    b.destinationTour.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Bus className="w-5 h-5 text-blue-600" />
            Sewa Bus Pariwisata & Charter Khusus
          </h3>
          <p className="text-xs text-slate-500">Pemesanan sewa rombongan pariwisata, study tour sekolah, ziarah wali, dan perjalanan korporat</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Buat Reservasi Sewa Bus
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total Order Sewa Pariwisata</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{bookings.length} Kontrak</div>
          <p className="text-[11px] text-blue-600 mt-1">Armada pariwisata siap jalan</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Total Nilai Kontrak Sewa</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {bookings.reduce((acc, b) => acc + b.totalAmount, 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">DP & Pelunasan terjadwal</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold">Surat Perintah Jalan (SPJ)</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">100% Terbit</div>
          <p className="text-[11px] text-slate-400 mt-1">Dilengkapi asuransi penumpang</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">No. Booking & Pelanggan</th>
                <th className="py-3.5 px-4">Destinasi & Titik Jemput</th>
                <th className="py-3.5 px-4">Tipe Bus & Jumlah Unit</th>
                <th className="py-3.5 px-4">Tanggal Sewa</th>
                <th className="py-3.5 px-4">Total Biaya & DP</th>
                <th className="py-3.5 px-4">Status Kontrak</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-600">{b.bookingNumber}</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{b.customerName}</div>
                    {b.organizationName && (
                      <div className="text-[11px] text-slate-500 font-semibold">{b.organizationName}</div>
                    )}
                    <div className="text-[10px] text-slate-400">{b.customerPhone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{b.destinationTour}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> Jemput: {b.pickupLocation}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{b.busType}</div>
                    <div className="text-[11px] text-blue-600 font-bold">{b.busCount} Unit Bus</div>
                    <div className="text-[10px] text-slate-400 font-mono">Plat: {b.assignedBuses.join(', ')}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {b.startDate} s/d {b.endDate}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">{b.totalDays} Hari Perjalanan</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Rp {b.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      DP: Rp {b.downPaymentAmount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Sisa: Rp {b.remainingAmount.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => alert(`Cetak Surat Perintah Jalan (SPJ) & Kontrak Sewa: ${b.bookingNumber}`)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all"
                    >
                      Cetak SPJ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                Reservasi Sewa Bus Pariwisata
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nama Pemesan / Kontak</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">No. Telp / WhatsApp</label>
                  <input 
                    type="text" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Nama Organisasi / Instansi (Opsional)</label>
                <input 
                  type="text" 
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. PT Telkom Indonesia / Paguyuban Warga"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Destinasi Wisata</label>
                  <input 
                    type="text" 
                    value={destinationTour}
                    onChange={(e) => setDestinationTour(e.target.value)}
                    placeholder="e.g. Yogyakarta - Dieng"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Titik Penjemputan</label>
                  <input 
                    type="text" 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Kantor Pusat Jakarta"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Total Biaya Sewa (Rp)</label>
                  <input 
                    type="number" 
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Uang Muka (DP) Rp</label>
                  <input 
                    type="number" 
                    value={downPaymentAmount}
                    onChange={(e) => setDownPaymentAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    required
                  />
                </div>
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
                  Simpan Order Sewa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
