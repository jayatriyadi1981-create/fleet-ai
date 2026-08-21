import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Shield,
  Key,
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Lock,
  Building,
  UserCheck
} from 'lucide-react';
import { MOCK_CIT_MISSIONS } from '../../../modules/securicor/services/securicorMockData';
import { CitMissionRecord } from '../../../modules/securicor/types';

export const SecuricorCitMissionsTab: React.FC = () => {
  const [missions, setMissions] = useState<CitMissionRecord[]>(MOCK_CIT_MISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMission, setSelectedMission] = useState<CitMissionRecord | null>(null);
  const [showNewMissionModal, setShowNewMissionModal] = useState(false);

  const filteredMissions = missions.filter(m =>
    m.missionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.clientBank.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.assignedHull.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="securicor-cit-missions-tab" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative min-w-[280px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Kode Manifest CIT, Bank Klien, atau No Lambung..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <button
          onClick={() => setShowNewMissionModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Terbitkan Manifest Misi CIT Baru
        </button>
      </div>

      {/* Missions Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Kode Misi / Manifest</th>
                <th className="p-3.5">Bank / Klien</th>
                <th className="p-3.5">Layanan</th>
                <th className="p-3.5">Armada / Hull</th>
                <th className="p-3.5">Nilai Valuables (IDR)</th>
                <th className="p-3.5">Dual-Custody Keys</th>
                <th className="p-3.5">Status Misi</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMissions.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      {m.missionCode}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.departureTime}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">{m.clientBank}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{m.destinationNode}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-[11px]">
                      {m.serviceType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold font-mono text-slate-800">{m.assignedHull}</div>
                    <div className="text-[11px] text-slate-500">{m.cassettesCount} Cassettes Vault</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-amber-600 font-mono text-sm">
                      Rp {(m.totalCashDeclaredIdr / 1000000000).toFixed(2)} Miliar
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">100% Insured Transit</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-700 text-[11px] flex items-center gap-1">
                      <Key className="w-3 h-3 text-amber-500" /> Key A: {m.dualCustodyOfficerA.split(' ')[0]}
                    </div>
                    <div className="text-slate-700 text-[11px] flex items-center gap-1">
                      <Key className="w-3 h-3 text-sky-500" /> Key B: {m.dualCustodyOfficerB.split(' ')[0]}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      m.status === 'EN_ROUTE_TRANSIT' ? 'bg-emerald-100 text-emerald-800' :
                      m.status === 'ATM_SERVICING' ? 'bg-blue-100 text-blue-800' :
                      m.status === 'CASH_LOADING' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {m.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedMission(m)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Manifest
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manifest Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono text-amber-600 font-bold uppercase">MANIFEST ELEKTRONIK CIT</span>
                <h3 className="font-bold text-slate-900 text-base">{selectedMission.missionCode}</h3>
              </div>
              <button onClick={() => setSelectedMission(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="text-slate-500 font-medium">Asal Muatan (Vault Room)</div>
                <div className="font-bold text-slate-900">{selectedMission.originVault}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="text-slate-500 font-medium">Tujuan Destinasi Misi</div>
                <div className="font-bold text-slate-900">{selectedMission.destinationNode}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Deklarasi Kas Angkut:</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  Rp {(selectedMission.totalCashDeclaredIdr).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Token Otorisasi OTP Khazanah:</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold tracking-wider">
                  {selectedMission.otpVaultToken}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Nomor Badge Pengawal Bersenjata:</span>
                <span className="font-mono text-slate-200 font-semibold">{selectedMission.policeBadgeNumber}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedMission(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert(`Cetak Lembar Serah Terima Berita Acara & QR Manifest untuk ${selectedMission.missionCode}`);
                  setSelectedMission(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <FileText className="w-3.5 h-3.5" /> Cetak Manifest & BA Serah Terima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Mission Modal */}
      {showNewMissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" /> Terbitkan Misi Pengawalan Uang (CIT) Baru
              </h3>
              <button onClick={() => setShowNewMissionModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Bank / Institusi Keuangan Klien</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium">
                  <option>PT Bank Central Asia Tbk (BCA)</option>
                  <option>PT Bank Mandiri (Persero) Tbk</option>
                  <option>PT Bank Negara Indonesia (Persero) Tbk</option>
                  <option>Bank Indonesia (Khazanah Kliring Nasional)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipe Layanan</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <option>ATM_REPLENISHMENT</option>
                    <option>BANK_BRANCH_DELIVERY</option>
                    <option>RETAIL_CASH_PICKUP</option>
                    <option>BANK_INDONESIA_CLEARING</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Armada Lapis Baja</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono">
                    <option>ARMOR-CIT-01 (B6 STANAG)</option>
                    <option>ARMOR-CIT-02 (B7 AP)</option>
                    <option>ARMOR-CIT-03 (B6 STANAG)</option>
                    <option>ARMOR-CIT-04 (VR9 SUV)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Total Nilai Kas Dideklarasikan (Rupiah)</label>
                <input type="number" placeholder="Contoh: 15000000000 (15 Miliar)" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Petugas Dual-Custody A</label>
                  <input type="text" placeholder="Nama Petugas Kunci A" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Petugas Dual-Custody B</label>
                  <input type="text" placeholder="Nama Petugas Kunci B" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowNewMissionModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Manifest Misi CIT baru berhasil diterbitkan dan Token OTP Dual-Key telah dikirim ke petugas.');
                  setShowNewMissionModal(false);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg text-xs font-bold"
              >
                Terbitkan Manifest & OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
