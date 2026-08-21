import React, { useState } from 'react';
import {
  Shield,
  Video,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  RefreshCw,
  UserCheck,
  Smartphone
} from 'lucide-react';
import { MOCK_GUARD_PATROLS } from '../../../modules/securicor/services/securicorMockData';
import { SecurityGuardPatrol } from '../../../modules/securicor/types';

export const SecuricorPatrolGuardsTab: React.FC = () => {
  const [patrols, setPatrols] = useState<SecurityGuardPatrol[]>(MOCK_GUARD_PATROLS);
  const [selectedPatrol, setSelectedPatrol] = useState<SecurityGuardPatrol | null>(null);

  return (
    <div id="securicor-patrol-guards-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">SMART SECURITY GUARD PATROL & BODYCAM SYSTEM</span>
          <h3 className="text-lg font-bold text-white mt-1">Patroli Pengamanan, NFC Checkpoints & Live Bodycam</h3>
          <p className="text-xs text-slate-400">Monitoring ronda perimeter khazanah, rute patroli motor pengawal koridor, dan deteksi kehadiran via RFID/NFC Tag.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            3 Live Bodycam Streaming
          </span>
        </div>
      </div>

      {/* Patrol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patrols.map(p => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.guardName}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{p.regNumber}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {p.shift}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Zona Penugasan:</span>
                <span className="font-semibold text-slate-800 text-right">{p.assignedZone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Patroli:</span>
                <span className="font-semibold text-slate-900">{p.patrolMode.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Progres Checkpoint:</span>
                <span className="font-bold text-emerald-600">{p.checkpointsCompleted} / {p.totalCheckpoints} Pos NFC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Titik Terakhir:</span>
                <span className="font-medium text-slate-700 text-right">{p.lastCheckpointName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Tap Terakhir:</span>
                <span className="font-mono text-slate-600">{p.lastNfcScanAt}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${(p.checkpointsCompleted / p.totalCheckpoints) * 100}%` }}
              ></div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedPatrol(p)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
              >
                <Video className="w-3.5 h-3.5" /> Live Bodycam
              </button>
              <button
                onClick={() => alert(`Panggil HT / Intercom ke ${p.guardName}`)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Radio className="w-3.5 h-3.5" /> Radio HT
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bodycam Modal */}
      {selectedPatrol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <h4 className="font-bold text-sm font-mono">LIVE BODYCAM - {selectedPatrol.guardName}</h4>
              </div>
              <button onClick={() => setSelectedPatrol(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="relative h-60 bg-black rounded-lg overflow-hidden flex flex-col justify-between p-3 border border-slate-800">
              <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-1 rounded">
                <span>REC • 1080P 60FPS</span>
                <span>GPS: -6.2088, 106.8456 • BATTERY: 92%</span>
              </div>

              <div className="text-center text-slate-600 font-mono text-xs">
                [ LIVE ENCRYPTED AES-256 VIDEO FEED FROM TACTICAL BODYCAM ]
              </div>

              <div className="text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-1 rounded flex justify-between">
                <span>{selectedPatrol.assignedZone}</span>
                <span>{new Date().toLocaleTimeString()} WIB</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPatrol(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Tutup Feed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
