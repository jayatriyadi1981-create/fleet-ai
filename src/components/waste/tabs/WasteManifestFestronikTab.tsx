import React, { useState } from 'react';
import {
  FileCheck2,
  QrCode,
  ShieldCheck,
  Building2,
  Truck,
  Layers,
  Search,
  ExternalLink,
  Plus,
  AlertCircle,
  FileText
} from 'lucide-react';
import { MOCK_FESTRONIK_MANIFESTS } from '../../../modules/waste/services/wasteMockData';
import { FestronikManifestB3 } from '../../../modules/waste/types';

export const WasteManifestFestronikTab: React.FC = () => {
  const [manifests] = useState<FestronikManifestB3[]>(MOCK_FESTRONIK_MANIFESTS);
  const [search, setSearch] = useState('');

  const filtered = manifests.filter(
    (m) =>
      m.manifestNumber.toLowerCase().includes(search.toLowerCase()) ||
      m.wasteCode.toLowerCase().includes(search.toLowerCase()) ||
      m.generatorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="waste-manifest-festronik-tab" className="space-y-6">
      {/* Top Banner & Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span>Manifest Elektronik Limbah B3 (Festronik KLHK)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sistem terintegrasi Festronik Kementerian Lingkungan Hidup dan Kehutanan (KLHK) untuk pengangkutan limbah B3 industri, medis, dan oli bekas.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari no manifest, kode limbah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => alert('Sinkronisasi Festronik API KLHK berhasil!')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>Sinkron Festronik KLHK</span>
          </button>
        </div>
      </div>

      {/* Manifest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((manifest) => (
          <div
            key={manifest.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                    KODE B3: {manifest.wasteCode}
                  </span>
                  <h3 className="text-sm font-black text-slate-100 mt-1 font-mono">{manifest.manifestNumber}</h3>
                  <span className="text-[11px] text-slate-400">{manifest.klhkRegistrationNo}</span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    manifest.status === 'IN_TRANSIT'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {manifest.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Waste Name Description */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Nama / Karakteristik Limbah</span>
                <span className="text-xs font-semibold text-slate-200">{manifest.wasteName}</span>
              </div>

              {/* Three-party flow */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">1. Penghasil (Generator)</span>
                  <span className="text-slate-300 font-medium">{manifest.generatorName}</span>
                </div>
                <div className="pt-1 border-t border-slate-900">
                  <span className="text-[10px] text-slate-500 block">2. Pengangkut (Transporter)</span>
                  <span className="text-slate-300 font-medium">{manifest.transporterName}</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">Truk: {manifest.assignedHull} ({manifest.driverName})</span>
                </div>
                <div className="pt-1 border-t border-slate-900">
                  <span className="text-[10px] text-slate-500 block">3. Pemanfaat / Pengolah (Receiver)</span>
                  <span className="text-slate-300 font-medium">{manifest.receiverProcessorName}</span>
                </div>
              </div>

              {/* Volume & Packaging */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Volume Muatan</span>
                  <span className="font-bold text-emerald-400 font-mono">{manifest.volumeTons} Ton</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Kemasan</span>
                  <span className="font-bold text-slate-200 font-mono">{manifest.packagingCount}x {manifest.packagingType}</span>
                </div>
              </div>
            </div>

            {/* Footer QR Verification */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Berangkat: {manifest.departureDate}</span>
              <button
                onClick={() => alert(`QR Validasi KLHK: ${manifest.qrCodeUrl}`)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>QR Festronik</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
