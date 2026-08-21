import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  MapPin,
  Clock,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { MOCK_TANKER_FLEETS } from '../../../modules/tanker/services/tankerMockData';

export const TankerElocksTab: React.FC = () => {
  const [fleets, setFleets] = useState(MOCK_TANKER_FLEETS);
  const [selectedHull, setSelectedHull] = useState(fleets[0].hullNumber);
  const [otpInput, setOtpInput] = useState('');
  const [unlockSuccessMessage, setUnlockSuccessMessage] = useState<string | null>(null);

  const currentTank = fleets.find((f) => f.hullNumber === selectedHull) || fleets[0];

  const handleAuthorizeUnlock = () => {
    if (otpInput.length < 4) {
      alert('Masukkan OTP Otorisasi Komando 6-digit yang valid!');
      return;
    }

    setFleets((prev) =>
      prev.map((f) =>
        f.hullNumber === selectedHull ? { ...f, elockMasterStatus: 'AUTHORIZED_UNLOCKED' } : f
      )
    );

    setUnlockSuccessMessage(`Otorisasi Buka Segel Elektronik untuk ${selectedHull} berhasil dieksekusi.`);
    setTimeout(() => setUnlockSuccessMessage(null), 5000);
    setOtpInput('');
  };

  const handleLockAgain = () => {
    setFleets((prev) =>
      prev.map((f) =>
        f.hullNumber === selectedHull ? { ...f, elockMasterStatus: 'LOCKED_SECURE' } : f
      )
    );
  };

  return (
    <div id="tanker-elocks-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>Smart E-Lock, Segel Elektronik & Katup Bottom Loading</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sistem penguncian terenkripsi multi-titik (Manhole, Foot Valve, API Coupler) dengan otorisasi berbasis Geofence + OTP Dispatcher.
          </p>
        </div>

        {/* Tank Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Pilih Tangki:</span>
          <select
            value={selectedHull}
            onChange={(e) => setSelectedHull(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
          >
            {fleets.map((f) => (
              <option key={f.id} value={f.hullNumber}>
                {f.hullNumber} ({f.plateNumber}) - {f.elockMasterStatus}
              </option>
            ))}
          </select>
        </div>
      </div>

      {unlockSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{unlockSuccessMessage}</span>
        </div>
      )}

      {/* Main Lock Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Status Overview & Valve Diagram */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">UNIT DIPILIH</span>
                <h3 className="text-base font-bold text-slate-100">{currentTank.hullNumber}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">STATUS SEGEL MASTER</span>
                {currentTank.elockMasterStatus === 'LOCKED_SECURE' ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold inline-flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOCKED SECURE (SEALED)</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold inline-flex items-center space-x-1">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>AUTHORIZED UNLOCKED</span>
                  </span>
                )}
              </div>
            </div>

            {/* Electronic Locking Points Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Titik Penguncian Aktif (Multi-Point Locking Matrix)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">1. Manhole Atas #1-#4</span>
                    <span className="text-emerald-400 text-[10px] font-bold">TERKUNCI</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Sensor magnetic switch & tamper wire aktif</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">2. Bottom Loading API Valve</span>
                    <span className="text-emerald-400 text-[10px] font-bold">TERTUTUP RAPAT</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Interlock pneumatik valve terkunci otomatis</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">3. Kotak Discharge Box (Box Valve)</span>
                    <span className="text-emerald-400 text-[10px] font-bold">SOLENOID LOCKED</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Kunci kabinet katup bawah tersambung GPS</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">4. Vapour Recovery Return</span>
                    <span className="text-emerald-400 text-[10px] font-bold">SEALED</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Katup sirkulasi uap gas terproteksi</p>
                </div>
              </div>
            </div>

            {/* Audit Log of Last Lock Activities */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Log Aktivitas Segel Elektronik Terakhir</span>
              </h4>
              <div className="space-y-1.5 text-[11px] text-slate-300 font-mono">
                <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                  <span>[07:30 WIB] Gantry Plumpang - E-Lock Master Sealed</span>
                  <span className="text-emerald-400">SUKSES (OTP: 891044)</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                  <span>[08:15 WIB] Checkpoint KM 19 - Status Ping Sensor</span>
                  <span className="text-sky-400">HEALTHY (Signal 99%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Remote Unlock Command Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Otorisasi Buka Kunci (Remote Unlock)</h3>
                <p className="text-xs text-slate-400">Perintah buka kunci katup di titik bongkar resmi</p>
              </div>
            </div>

            {/* Geofence Status Check */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Validasi Geofence Tujuan</span>
                </span>
                <span className="text-emerald-400 font-bold">VALID (Didalam Area SPBU)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Lokasi saat ini: <span className="text-slate-200">{currentTank.destinationName}</span>
              </p>
            </div>

            {/* E-Seal QR Code */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">NOMOR SEGEL ELEKTRONIK</span>
                <span className="text-xs font-bold text-amber-400 font-mono">ES-PLP-992014-A</span>
              </div>
              <QrCode className="w-8 h-8 text-slate-400" />
            </div>

            {/* OTP Input Form */}
            {currentTank.elockMasterStatus === 'LOCKED_SECURE' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    Masukkan Kode Otorisasi Komando (OTP):
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="misal 891044"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={handleAuthorizeUnlock}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Buka Kunci Segel Elektronik</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                  Kunci saat ini dalam status <strong>AUTHORIZED UNLOCKED</strong> untuk proses pengisian/bongkar muatan.
                </div>
                <button
                  onClick={handleLockAgain}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Kunci Kembali Segel (Re-Lock Secure)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
