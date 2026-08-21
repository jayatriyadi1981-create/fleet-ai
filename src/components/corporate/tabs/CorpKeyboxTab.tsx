import React, { useState } from 'react';
import {
  Key,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Smartphone,
  CreditCard,
  Plus,
  RefreshCw,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { MOCK_SMART_KEY_LOGS } from '../../../modules/corporate/mockData';

export const CorpKeyboxTab: React.FC = () => {
  const [keySlots, setKeySlots] = useState([
    {
      slotId: 'SLOT-01',
      assetCode: 'CORP-POOL-01',
      plate: 'B 2145 SHP',
      model: 'Toyota Innova Zenix 2.0 V',
      rfidTag: 'RFID-KEY-88110',
      status: 'INSIDE_LOCKER',
      lastReturnBy: 'Siti Aminah (Finance)',
      lastTimestamp: '2026-08-20 17:30',
      odometerRecorded: 34200,
    },
    {
      slotId: 'SLOT-02',
      assetCode: 'CORP-POOL-02 (EV)',
      plate: 'B 1876 SZK',
      model: 'Hyundai Ioniq 5 Signature (EV)',
      rfidTag: 'RFID-KEY-88112',
      status: 'CHECKED_OUT',
      borrowedBy: 'Bambang Irawan (Driver Pool)',
      checkoutTime: '2026-08-21 08:45',
      destination: 'Sidang Notaris & MoU',
      bookingTicket: 'REQ-CORP-2026-0881',
      odometerRecorded: 12050,
    },
    {
      slotId: 'SLOT-03',
      assetCode: 'CORP-POOL-03',
      plate: 'B 2990 TZQ',
      model: 'Toyota Avanza 1.5 G CVT',
      rfidTag: 'RFID-KEY-88115',
      status: 'INSIDE_LOCKER',
      lastReturnBy: 'Agus Sunarto (Driver Pool)',
      lastTimestamp: '2026-08-19 18:00',
      odometerRecorded: 58200,
    },
    {
      slotId: 'SLOT-04',
      assetCode: 'CORP-SHUTTLE-01',
      plate: 'B 7088 SAA',
      model: 'Toyota HiAce Commuter 16-Seater',
      rfidTag: 'RFID-KEY-88119',
      status: 'INSIDE_LOCKER',
      lastReturnBy: 'Mulyadi Pratama (Shuttle Driver)',
      lastTimestamp: '2026-08-20 20:15',
      odometerRecorded: 78500,
    }
  ]);

  const handleCheckout = (slotId: string) => {
    setKeySlots(keySlots.map(s => s.slotId === slotId ? {
      ...s,
      status: 'CHECKED_OUT',
      borrowedBy: 'Karyawan Pemohon (Approved Ticket)',
      checkoutTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    } : s));
    alert(`Loker ${slotId} berhasil dibuka. Kunci fisik terlepas. Pengemudi terotorisasi dipersilakan mengambil kunci.`);
  };

  const handleReturn = (slotId: string) => {
    const odo = prompt('Masukkan Angka Odometer Akhir (KM) saat pengembalian:', '34350');
    if (!odo) return;

    setKeySlots(keySlots.map(s => s.slotId === slotId ? {
      ...s,
      status: 'INSIDE_LOCKER',
      lastReturnBy: 'Petugas Pengemudi Terotorisasi',
      lastTimestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      odometerRecorded: parseInt(odo) || s.odometerRecorded
    } : s));
    alert(`Kunci ${slotId} berhasil dikembalikan ke Smart Locker. Data odometer ${odo} KM & saldo e-Toll tersimpan.`);
  };

  return (
    <div id="corp-keybox-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            SMART KEY LOCKER & DIGITAL BLE VIRTUAL KEY ACCESS
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Loker Kunci Pintar RFID & Virtual Keyless Smartphone Karyawan
          </h3>
          <p className="text-xs text-slate-400">
            Sistem otomatisasi serah terima kunci mobil dinas via locker digital B1, validasi ID Card RFID / OTP Booking, dan pencatatan Odometer otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Sinkronisasi Status Sensor RFID Seluruh Slot Loker')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
          >
            <RefreshCw className="w-4 h-4" /> Sinkronisasi Status Locker
          </button>
        </div>
      </div>

      {/* Smart Keybox Slots Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keySlots.map(slot => (
          <div
            key={slot.slotId}
            className={`border rounded-xl p-5 space-y-4 shadow-sm transition-all ${
              slot.status === 'INSIDE_LOCKER'
                ? 'bg-white border-slate-200 hover:border-emerald-300'
                : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  slot.status === 'INSIDE_LOCKER' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {slot.status === 'INSIDE_LOCKER' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-mono font-bold text-slate-900 text-xs">{slot.slotId}</span>
                  <p className="text-[10px] text-slate-500 font-mono">{slot.rfidTag}</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                slot.status === 'INSIDE_LOCKER' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {slot.status === 'INSIDE_LOCKER' ? 'KUNCI DI LOKER' : 'SEDANG DIPINJAM'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 font-mono text-sm">{slot.plate}</div>
              <p className="text-slate-600 text-[11px]">{slot.model}</p>
              <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px] space-y-1">
                {slot.status === 'INSIDE_LOCKER' ? (
                  <>
                    <div className="text-slate-500">Terakhir Dikembalikan Oleh:</div>
                    <div className="font-semibold text-slate-800">{slot.lastReturnBy}</div>
                    <div className="text-slate-400 font-mono text-[10px]">{slot.lastTimestamp}</div>
                  </>
                ) : (
                  <>
                    <div className="text-amber-800 font-semibold">Sedang Dibawa Oleh:</div>
                    <div className="font-bold text-slate-900">{slot.borrowedBy}</div>
                    <div className="text-slate-500 text-[10px]">Tiket: {slot.bookingTicket}</div>
                    <div className="text-slate-400 font-mono text-[10px]">Pukul: {slot.checkoutTime}</div>
                  </>
                )}
              </div>
              <div className="flex justify-between text-slate-500 pt-1">
                <span>Odometer Terkunci:</span>
                <span className="font-mono font-bold text-slate-800">{slot.odometerRecorded.toLocaleString('id-ID')} KM</span>
              </div>
            </div>

            <div className="pt-2">
              {slot.status === 'INSIDE_LOCKER' ? (
                <button
                  onClick={() => handleCheckout(slot.slotId)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-blue-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Unlock className="w-3.5 h-3.5" /> Buka Loker (Ambil Kunci)
                </button>
              ) : (
                <button
                  onClick={() => handleReturn(slot.slotId)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Lock className="w-3.5 h-3.5" /> Kembalikan Kunci (Check-In)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Access History Log */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" /> Log Riwayat Akses Smart Keybox & Virtual BLE Key
        </h4>

        <div className="divide-y divide-slate-100">
          {MOCK_SMART_KEY_LOGS.map(log => (
            <div key={log.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono">{log.plateNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                    {log.lockerNumber}
                  </span>
                </div>
                <p className="text-slate-600">Otorisasi: <strong className="text-slate-800">{log.authorizedEmployee}</strong></p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.action === 'KEY_CHECKOUT' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {log.action === 'KEY_CHECKOUT' ? 'CHECKOUT KUNCI' : 'KEMBALI KE LOKER'}
                  </span>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{log.timestamp}</div>
                </div>
                <div className="font-mono text-slate-800 font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  {log.odometerEnteredKm.toLocaleString('id-ID')} KM
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
