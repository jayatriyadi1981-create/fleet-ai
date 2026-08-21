import React, { useState } from 'react';
import {
  Lock,
  Key,
  ShieldCheck,
  Flame,
  AlertOctagon,
  RefreshCw,
  Eye,
  CheckCircle2,
  Database,
  Radio,
  Fingerprint,
  Zap
} from 'lucide-react';
import { MOCK_ATM_CASSETTES } from '../../../modules/securicor/services/securicorMockData';
import { SmartAtmCassette } from '../../../modules/securicor/types';

export const SecuricorSmartVaultTab: React.FC = () => {
  const [cassettes, setCassettes] = useState<SmartAtmCassette[]>(MOCK_ATM_CASSETTES);
  const [dualAuthStep, setDualAuthStep] = useState<'IDLE' | 'AUTH_A' | 'AUTH_B' | 'UNLOCKED'>('IDLE');
  const [smokePacksArmed, setSmokePacksArmed] = useState(true);

  const totalVaultValueIdr = cassettes.reduce((acc, c) => acc + c.totalAmountIdr, 0);

  const triggerDualAuth = () => {
    if (dualAuthStep === 'IDLE') {
      setDualAuthStep('AUTH_A');
    } else if (dualAuthStep === 'AUTH_A') {
      setDualAuthStep('AUTH_B');
    } else if (dualAuthStep === 'AUTH_B') {
      setDualAuthStep('UNLOCKED');
    }
  };

  const resetVaultLock = () => {
    setDualAuthStep('IDLE');
  };

  return (
    <div id="securicor-smart-vault-tab" className="space-y-6">
      {/* Top Vault Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-mono">Central Vault Balance</span>
            <Database className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-400 mt-2">Rp {(totalVaultValueIdr / 1000000).toLocaleString('id-ID')} Juta</p>
          <p className="text-[11px] text-emerald-400 mt-1">Smart Electronic Cassettes</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-mono">Dual-Custody Status</span>
            <Fingerprint className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-lg font-bold text-white mt-2">
            {dualAuthStep === 'UNLOCKED' ? 'AUTHORIZED UNLOCKED' : 'LOCKED & SEALED'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Biometric + 2-Key OTP</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-mono">Dye / Smoke Staining</span>
            <Flame className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-lg font-bold text-rose-400 mt-2">
            {smokePacksArmed ? '100% ARMED ACTIVE' : 'DISARMED (TEST)'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Anti-Tamper Ink Degradation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-mono">Seismic & Gas Sensors</span>
            <Radio className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-emerald-400 mt-2">ALL NORMAL (0.0G)</p>
          <p className="text-[11px] text-slate-400 mt-1">Thermal & Drill Attack Sensor</p>
        </div>
      </div>

      {/* Dual Custody Live Terminal */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ELECTRONIC SMART VAULT DUAL-CUSTODY CONSOLE</h3>
              <p className="text-xs text-slate-400">Otorisasi Pembukaan Pintu Brankas Khazanah Berstandar Bank Indonesia</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dualAuthStep === 'UNLOCKED' ? (
              <button
                onClick={resetVaultLock}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow"
              >
                Kunci Ulang Brankas Sekarang
              </button>
            ) : (
              <button
                onClick={triggerDualAuth}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                {dualAuthStep === 'IDLE' && 'Mulai Verifikasi Kunci Petugas A'}
                {dualAuthStep === 'AUTH_A' && 'Verifikasi Kunci Petugas B'}
                {dualAuthStep === 'AUTH_B' && 'Buka Kunci Solenoid Vault'}
              </button>
            )}
          </div>
        </div>

        {/* 3 Step Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className={`p-4 rounded-xl border transition-all ${
            dualAuthStep !== 'IDLE' ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold">STEP 1: PETUGAS A (KHAZANAH)</span>
              {dualAuthStep !== 'IDLE' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-600" />}
            </div>
            <p className="text-xs text-white font-medium mt-2">Biometrik Sidik Jari & Smartcard Keycard A</p>
            <p className="text-[11px] text-slate-400 mt-1">Status: {dualAuthStep !== 'IDLE' ? 'TERVERIFIKASI VALID' : 'MENUNGGU SCAN'}</p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            dualAuthStep === 'AUTH_B' || dualAuthStep === 'UNLOCKED' ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold">STEP 2: PETUGAS B (CIT ESCORT)</span>
              {dualAuthStep === 'AUTH_B' || dualAuthStep === 'UNLOCKED' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-600" />}
            </div>
            <p className="text-xs text-white font-medium mt-2">OTP Dinamis Command Center + Kunci Fisik B</p>
            <p className="text-[11px] text-slate-400 mt-1">Status: {dualAuthStep === 'AUTH_B' || dualAuthStep === 'UNLOCKED' ? 'TERVERIFIKASI VALID' : 'MENUNGGU OTORISASI'}</p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            dualAuthStep === 'UNLOCKED' ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold">STEP 3: SOLENOID RELAY</span>
              {dualAuthStep === 'UNLOCKED' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-600" />}
            </div>
            <p className="text-xs text-white font-medium mt-2">Airlock & Brankas Khazanah Terbuka</p>
            <p className="text-[11px] text-slate-400 mt-1">Status: {dualAuthStep === 'UNLOCKED' ? 'TIMER AKTIF (15 MENIT)' : 'TERKUNCI AMAN'}</p>
          </div>
        </div>
      </div>

      {/* Smart ATM Cassettes Tracking Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Pelacakan Kaset ATM Cerdas (Smart Cassette Anti-Theft RFID)</h3>
            <p className="text-xs text-slate-500">Dilengkapi sensor pembongkaran paksa & pewarna noda tinta otomatis (Indelible Dye Smoke)</p>
          </div>
          <button
            onClick={() => setSmokePacksArmed(!smokePacksArmed)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              smokePacksArmed ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {smokePacksArmed ? 'Smoke/Dye Packs Armed' : 'Dye Packs Disarmed'}
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {cassettes.map(c => (
            <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-slate-800">
                  {c.denomination === 'IDR_100K' ? '100K' : '50K'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm font-mono">{c.cassetteCode}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      {c.rfidSealNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target ATM: <span className="font-semibold text-slate-700">{c.atmLocation}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-xs text-slate-500 font-medium">{c.billCount.toLocaleString()} Lembar ({c.denomination})</div>
                  <div className="text-sm font-bold text-amber-600 font-mono">Rp {(c.totalAmountIdr).toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    c.lockStatus === 'SECURED_SEALED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.lockStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
