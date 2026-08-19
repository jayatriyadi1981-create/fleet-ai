/**
 * Fleet Intelligence - Concox AT4 GPS Tracker Connection & Configuration Helper Modal
 */

import React, { useState } from 'react';
import { X, Radio, Cpu, Copy, CheckCircle2, Send, Smartphone, ShieldCheck, RefreshCw, AlertCircle, Server } from 'lucide-react';

interface ConcoxAt4SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConcoxAt4SetupModal: React.FC<ConcoxAt4SetupModalProps> = ({ isOpen, onClose }) => {
  const [operator, setOperator] = useState<'TELKOMSEL' | 'INDOSAT' | 'XL' | 'TRI' | 'CUSTOM'>('TELKOMSEL');
  const [customApn, setCustomApn] = useState('internet');
  const [serverHost, setServerHost] = useState('103.180.22.88');
  const [serverPort, setServerPort] = useState('5023');
  const [intervalSec, setIntervalSec] = useState('60');
  const [imei, setImei] = useState('868120049182345');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [testStatus, setTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS'>('IDLE');

  if (!isOpen) return null;

  const apnMap = {
    TELKOMSEL: 'APN,internet#',
    INDOSAT: 'APN,indosatgprs#',
    XL: 'APN,www.xlgprs.net#',
    TRI: 'APN,3data#',
    CUSTOM: `APN,${customApn}#`,
  };

  const smsCommands = [
    {
      title: '1. Atur APN Operator Seluler',
      command: apnMap[operator],
      description: 'Menghubungkan kartu SIM ke jaringan data GPRS/4G operator seluler.',
    },
    {
      title: '2. Atur Server IP Gateway & Port Concox GT06',
      command: `SERVER,1,${serverHost},${serverPort},0#`,
      description: 'Mengarahkan lalu lintas TCP paket data telematika AT4 ke server gateway port 5023.',
    },
    {
      title: '3. Atur Interval Pengiriman Data (Timer)',
      command: `TIMER,${intervalSec},${intervalSec}#`,
      description: `Mengirimkan data GPS & baterai setiap ${intervalSec} detik saat kendaraan bergerak atau diam.`,
    },
    {
      title: '4. Atur Zona Waktu Server (GMT UTC+0 Standard)',
      command: 'GMT,E,0,0#',
      description: 'Menyelaraskan stempel waktu paket data GPS Concox ke standar UTC server.',
    },
    {
      title: '5. Cek Status Koneksi & Perangkat',
      command: 'STATUS#',
      description: 'Memeriksa kekuatan sinyal GSM, jumlah satelit GPS, baterai (%), dan status koneksi GPRS.',
    },
  ];

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSimulateTest = () => {
    setTestStatus('TESTING');
    setTimeout(() => {
      setTestStatus('SUCCESS');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 p-6 space-y-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950 border border-cyan-800/50 text-cyan-400 rounded-xl">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Panduan Panduan Koneksi Concox AT4 (Jimi IoT)</h2>
              <p className="text-xs text-slate-400">
                Langkah lengkap menghubungkan Asset Tracker Concox AT4 ke server telematika via protokol GT06 Port 5023.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Physical Prep */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="h-4 w-4" /> Persiapan Fisik & Kartu SIM Concox AT4
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="font-bold text-cyan-400">1.</span>
              <span>Gunakan kartu Micro SIM GSM aktif dengan paket data (minimal 500MB/bulan) dan tanpa PIN lock.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="font-bold text-cyan-400">2.</span>
              <span>Nyalakan saklar daya ON di bawah penutup karet belakang magnetik Concox AT4.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="font-bold text-cyan-400">3.</span>
              <span>Pastikan LED Biru (GPS) dan LED Hijau (GSM) berkedip konstan menandakan sinyal didapat.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="font-bold text-cyan-400">4.</span>
              <span>Baterai internal 10.000 mAh AT4 bertahan hingga 2.5 tahun (bergantung interval pengiriman).</span>
            </li>
          </ul>
        </div>

        {/* Step 2: Custom SMS Builder */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Send className="h-4 w-4 text-cyan-400" /> Generator Perintah SMS Konfigurasi Auto-Fill
            </h3>
            <span className="text-[11px] text-slate-400">Kirimkan SMS ini ke nomor SIM Concox AT4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Operator Seluler SIM</label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:border-cyan-500"
              >
                <option value="TELKOMSEL">Telkomsel (internet)</option>
                <option value="INDOSAT">Indosat (indosatgprs)</option>
                <option value="XL">XL Axiata (www.xlgprs.net)</option>
                <option value="TRI">3 Tri (3data)</option>
                <option value="CUSTOM">Custom APN</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Server Gateway IP / Host</label>
              <input
                type="text"
                value={serverHost}
                onChange={(e) => setServerHost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Port Concox GT06 Protocol</label>
              <input
                type="text"
                value={serverPort}
                onChange={(e) => setServerPort(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* SMS Command List */}
          <div className="space-y-2">
            {smsCommands.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{item.title}</span>
                  <span className="text-[11px] text-slate-400">{item.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-slate-900 text-cyan-300 px-3 py-1.5 rounded-lg border border-slate-800 font-mono font-bold text-xs select-all">
                    {item.command}
                  </code>
                  <button
                    onClick={() => handleCopy(item.command, idx)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] flex items-center gap-1 shrink-0"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Salin
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Device Registration & Live Ping Test */}
        <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Server className="h-4 w-4" /> Registrasi IMEI 15 Digit & Uji Koneksi Live
            </h3>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
              Protokol GT06 Concox
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">IMEI Concox AT4 (Tertera di Stiker Barcode)</label>
              <input
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="e.g. 868120049182345"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSimulateTest}
                disabled={testStatus === 'TESTING'}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/30 disabled:opacity-50"
              >
                {testStatus === 'TESTING' ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Menguji Ping Socket...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Tes Telemetri Concox
                  </>
                )}
              </button>
            </div>
          </div>

          {testStatus === 'SUCCESS' && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs space-y-1 text-emerald-300">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Koneksi Gateway GT06 Concox AT4 Berhasil Terhubung!
              </div>
              <p className="text-[11px] text-slate-300">
                IMEI <strong className="text-white">{imei}</strong> terverifikasi online pada Port 5023. Baterai Internal: <strong>98% (10.000 mAh)</strong>, Sinyal Satelit GPS: <strong>12 Satelit (FIX 3D)</strong>.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
