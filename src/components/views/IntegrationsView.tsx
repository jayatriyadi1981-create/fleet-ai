import React, { useState } from 'react';
import { Radio, Cpu, Plus, CheckCircle2, ShieldCheck, Server, RefreshCw, Settings, HelpCircle } from 'lucide-react';
import { ConcoxAt4SetupModal } from '../modals/ConcoxAt4SetupModal';

export const IntegrationsView: React.FC = () => {
  const [isConcoxModalOpen, setIsConcoxModalOpen] = useState(false);

  const gateways = [
    { name: 'Gateway GPS Teltonika (FMB920 / FMB120)', protocol: 'TELTONIKA', port: 5027, status: 'Connected', activeCount: 8, uptime: '99.98%' },
    { name: 'Gateway Concox / Jimi IoT (AT4 / GT06N)', protocol: 'CONCOX', port: 5023, status: 'Connected', activeCount: 6, uptime: '99.95%', isConcox: true },
    { name: 'Gateway JT808 Standard Telematics (China)', protocol: 'JT808', port: 8080, status: 'Connected', activeCount: 4, uptime: '99.90%' },
    { name: 'MQTT Broker IoT Sensor Stream', protocol: 'MQTT_TLS', port: 8883, status: 'Active', activeCount: 18, uptime: '100.0%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Integrasi GPS Gateways & Telematics Protocols</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Pusat konfigurasi penerima data telematika perangkat GPS tracker, sensor tanki BBM, dan MQTT IoT Streams.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConcoxModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Panduan Koneksi Concox AT4</span>
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Tambah Gateway Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {gateways.map((gw, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{gw.name}</h3>
                  <p className="text-xs text-slate-400">Port Ingress: {gw.port} • Protokol: {gw.protocol}</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {gw.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                <p className="text-[10px] text-slate-400">Perangkat GPS Terhubung</p>
                <p className="font-bold text-white mt-0.5">{gw.activeCount} Device Aktif</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                <p className="text-[10px] text-slate-400">SLA Gateway Uptime</p>
                <p className="font-bold text-emerald-400 mt-0.5">{gw.uptime}</p>
              </div>
            </div>

            {gw.isConcox && (
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsConcoxModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <Settings className="h-3.5 w-3.5" /> Panduan & Generator SMS Concox AT4
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConcoxAt4SetupModal isOpen={isConcoxModalOpen} onClose={() => setIsConcoxModalOpen(false)} />
    </div>
  );
};
