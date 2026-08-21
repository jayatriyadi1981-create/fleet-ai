import React, { useState } from 'react';
import { BusEmergencyAlert, BusTrip } from '../../../modules/bus/types';
import { busService } from '../../../modules/bus/services/busService';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Radio, 
  MapPin, 
  Users, 
  Phone, 
  CheckCircle2, 
  BellRing, 
  Siren, 
  Sparkles,
  FileSpreadsheet,
  X
} from 'lucide-react';

interface Props {
  trips: BusTrip[];
}

export const BusSafetyEmergencyTab: React.FC<Props> = ({ trips }) => {
  const [alerts, setAlerts] = useState<BusEmergencyAlert[]>(busService.getEmergencyAlerts());
  const [selectedTripToPanic, setSelectedTripToPanic] = useState<string>(trips[0]?.id || 'trip-01');
  const [panicType, setPanicType] = useState<BusEmergencyAlert['panicType']>('MANUAL_PANIC_BUTTON');
  const [activeAlertModal, setActiveAlertModal] = useState<BusEmergencyAlert | null>(null);

  const handleTriggerPanic = () => {
    const trip = trips.find(t => t.id === selectedTripToPanic) || trips[0];
    const newAlert = busService.triggerEmergencyAlert({
      busId: trip.busId,
      busPlateNumber: trip.busPlateNumber,
      tripId: trip.id,
      tripCode: trip.tripCode,
      driverName: trip.primaryDriverName,
      driverPhone: trip.primaryDriverPhone,
      locationName: trip.currentLocationName || 'Tol Trans-Jawa KM 208 Cirebon',
      coordinates: trip.currentCoordinates || { lat: -6.8214, lng: 108.7901 },
      currentSpeedKmH: trip.currentSpeedKmH || 88,
      passengerCount: trip.bookedSeats || 20,
      panicType: panicType
    });

    setAlerts(busService.getEmergencyAlerts());
    setActiveAlertModal(newAlert);
  };

  const handleResolveAlert = (id: string) => {
    busService.resolveEmergencyAlert(id);
    setAlerts(busService.getEmergencyAlerts());
    if (activeAlertModal?.id === id) {
      setActiveAlertModal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Pusat Keselamatan & Tombol Darurat Bus (Safety & Panic Center)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Protokol tanggap darurat kecelakaan, panic button kabin, integrasi GPS telematika, dan manifest penumpang
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-rose-300 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-500/40">
          <Siren className="w-4 h-4 text-rose-400 animate-bounce" />
          Emergency Response Link: 24/7 SIAGA
        </div>
      </div>

      {/* Simulator Trigger Panic Box */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">Simulasi Tanggap Darurat</span>
            <h3 className="text-base font-bold text-white mt-0.5">Aktivasi Panic Button Bus di Lapangan</h3>
          </div>

          <button
            onClick={handleTriggerPanic}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-rose-950/50 animate-pulse"
          >
            <AlertOctagon className="w-4 h-4" />
            TEKAN TOMBOL PANIC (SIMULASI)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Pilih Ritase Bus Yang Mengalami Darurat</label>
            <select
              value={selectedTripToPanic}
              onChange={(e) => setSelectedTripToPanic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tripCode} • {t.busPlateNumber} ({t.primaryDriverName} - {t.routeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Jenis Insiden / Tipe Alarm</label>
            <select
              value={panicType}
              onChange={(e) => setPanicType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="MANUAL_PANIC_BUTTON">Manual Panic Button (Tombol Dashboard Supir)</option>
              <option value="CRASH_IMPACT">Deteksi Benturan Keras (Crash Impact G-Sensor)</option>
              <option value="SMOKE_FIRE">Sensor Asap & Kebakaran Mesin / Kabin</option>
              <option value="MEDICAL_EMERGENCY">Darurat Medis Penumpang (Butuh Ambulans Tol)</option>
              <option value="HIJACK_THREAT">Ancaman Keamanan & Pembajakan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Emergency Incidents List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400" />
            Log Alarm & Riwayat Insiden Darurat ({alerts.length} Laporan)
          </h3>
        </div>

        <div className="divide-y divide-slate-800/60">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
                      {alert.alertCode}
                    </span>
                    <span className="text-xs font-bold text-white">{alert.panicType.replace(/_/g, ' ')}</span>
                    <span className="text-[11px] text-slate-500 font-mono">[{alert.timestamp}]</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="text-cyan-300 font-mono font-bold">Bus: {alert.busPlateNumber}</span>
                    <span>•</span>
                    <span className="text-white">Supir: {alert.driverName} ({alert.driverPhone})</span>
                    <span>•</span>
                    <span className="text-amber-300">Penumpang: {alert.passengerCount} Jiwa</span>
                  </div>

                  <div className="text-xs text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Lokasi GPS: {alert.locationName} (Kecepatan saat kejadian: {alert.currentSpeedKmH} km/jam)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alert.status !== 'RESOLVED' ? (
                    <>
                      <button
                        onClick={() => setActiveAlertModal(alert)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-all shadow-lg shadow-rose-950/30"
                      >
                        Buka Command Desk
                      </button>
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-slate-950 font-bold rounded-lg text-xs transition-all border border-emerald-500/30"
                      >
                        Tandai Aman & Selesai
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg text-xs border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Telah Ditangani
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Tidak ada insiden darurat aktif. Semua armada bus dalam kondisi aman dan termonitor di jalur.
            </div>
          )}
        </div>
      </div>

      {/* Emergency Control Desk Modal */}
      {activeAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-8 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-600 text-white rounded-2xl animate-pulse">
                  <Siren className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">{activeAlertModal.alertCode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500 text-white">DARURAT SIAGA 1</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {activeAlertModal.panicType.replace(/_/g, ' ')}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveAlertModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Emergency Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Plat Bus</span>
                <div className="font-mono font-bold text-cyan-300 mt-0.5">{activeAlertModal.busPlateNumber}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Supir Utama</span>
                <div className="font-bold text-white mt-0.5">{activeAlertModal.driverName}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Manifest Penumpang</span>
                <div className="font-bold text-amber-400 mt-0.5">{activeAlertModal.passengerCount} Orang</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Telepon Supir</span>
                <div className="font-mono text-slate-300 mt-0.5">{activeAlertModal.driverPhone}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" />
                Titik Koordinat GPS Saat Tombol Ditekan:
              </span>
              <p className="text-white font-mono text-sm">{activeAlertModal.locationName}</p>
              <div className="text-slate-500 text-[11px] font-mono">
                Lat: {activeAlertModal.coordinates.lat}, Lng: {activeAlertModal.coordinates.lng} (Speed: {activeAlertModal.currentSpeedKmH} km/h)
              </div>
            </div>

            {/* Live Actions */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 block">Protokol Dispatcher:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={`tel:${activeAlertModal.driverPhone}`}
                  className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-200 font-bold transition-all"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  Hubungi Supir di Bus
                </a>
                <button
                  onClick={() => alert(`Broadcast darurat terkirim ke Patroli Tol & Posko Pool terdekat.`)}
                  className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-200 font-bold transition-all text-left"
                >
                  <BellRing className="w-4 h-4 text-amber-400" />
                  Broadcast Patroli Tol / Polisi
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveAlertModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
              <button
                onClick={() => handleResolveAlert(activeAlertModal.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/30"
              >
                Selesaikan Insiden & Tutup Siaga
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
