/**
 * Fleet Intelligence Smart AI - Super Admin Incident Center & Broadcast Tab (Prompt 42)
 * Incident Management, Status Page Updates, Public Announcements, and Maintenance Scheduling.
 */

import React, { useState } from 'react';
import { PlatformIncident, PlatformAnnouncement } from '../../types/superAdmin';
import {
  AlertTriangle,
  Radio,
  Plus,
  Clock,
  CheckCircle2,
  Bell,
  Trash2,
  Send,
  Sparkles,
  ShieldAlert,
  Flame,
} from 'lucide-react';

interface SuperAdminIncidentsTabProps {
  incidents: PlatformIncident[];
  announcements: PlatformAnnouncement[];
  onCreateIncident: (data: {
    title: string;
    severity: PlatformIncident['severity'];
    affectedServices: string[];
    impactDescription: string;
    initialMessage: string;
  }) => void;
  onAddIncidentUpdate: (incidentId: string, status: PlatformIncident['status'], message: string) => void;
  onCreateAnnouncement: (data: {
    title: string;
    message: string;
    severity: PlatformAnnouncement['severity'];
    targetAudience: PlatformAnnouncement['targetAudience'];
    expiresDays: number;
  }) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const SuperAdminIncidentsTab: React.FC<SuperAdminIncidentsTabProps> = ({
  incidents,
  announcements,
  onCreateIncident,
  onAddIncidentUpdate,
  onCreateAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [isNewAnnounceOpen, setIsNewAnnounceOpen] = useState(false);
  const [selectedIncidentForUpdate, setSelectedIncidentForUpdate] = useState<PlatformIncident | null>(null);

  // New incident form state
  const [incTitle, setIncTitle] = useState('');
  const [incSeverity, setIncSeverity] = useState<PlatformIncident['severity']>('P2_MAJOR');
  const [incServices, setIncServices] = useState('Telematics Ingestion Socket Cluster');
  const [incImpact, setIncImpact] = useState('');
  const [incMsg, setIncMsg] = useState('');

  // New update form state
  const [updateStatus, setUpdateStatus] = useState<PlatformIncident['status']>('monitoring');
  const [updateMsg, setUpdateMsg] = useState('');

  // New announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annMsg, setAnnMsg] = useState('');
  const [annSeverity, setAnnSeverity] = useState<PlatformAnnouncement['severity']>('info');
  const [annAudience, setAnnAudience] = useState<PlatformAnnouncement['targetAudience']>('ALL');
  const [annDays, setAnnDays] = useState(3);

  const handleCreateIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle.trim() || !incImpact.trim()) return;
    onCreateIncident({
      title: incTitle.trim(),
      severity: incSeverity,
      affectedServices: incServices.split(',').map((s) => s.trim()),
      impactDescription: incImpact.trim(),
      initialMessage: incMsg.trim() || 'Tim SRE sedang menginvestigasi insiden.',
    });
    setIsNewIncidentOpen(false);
    setIncTitle('');
    setIncImpact('');
    setIncMsg('');
  };

  const handleUpdateIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentForUpdate || !updateMsg.trim()) return;
    onAddIncidentUpdate(selectedIncidentForUpdate.id, updateStatus, updateMsg.trim());
    setSelectedIncidentForUpdate(null);
    setUpdateMsg('');
  };

  const handleCreateAnnounceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMsg.trim()) return;
    onCreateAnnouncement({
      title: annTitle.trim(),
      message: annMsg.trim(),
      severity: annSeverity,
      targetAudience: annAudience,
      expiresDays: annDays,
    });
    setIsNewAnnounceOpen(false);
    setAnnTitle('');
    setAnnMsg('');
  };

  const getSeverityBadge = (sev: PlatformIncident['severity']) => {
    switch (sev) {
      case 'P1_CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-950/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-300 border border-rose-500/40 animate-pulse">
            <Flame className="h-3 w-3" /> P1 Critical
          </span>
        );
      case 'P2_MAJOR':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
            <AlertTriangle className="h-3 w-3" /> P2 Major
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 border border-blue-500/30">
            P3 Minor
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Pusat Manajemen Insiden & Broadcast Platform</h2>
          <p className="text-xs text-slate-400">
            Pencatatan insiden layanan, status page, timeline investigasi SRE, dan pengumuman global ke seluruh tenant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewAnnounceOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-white transition-all border border-slate-700"
          >
            <Bell className="h-4 w-4 text-cyan-400" />
            <span>Kirim Broadcast</span>
          </button>

          <button
            onClick={() => setIsNewIncidentOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white transition-all shadow-lg shadow-rose-950"
          >
            <Plus className="h-4 w-4" />
            <span>Buka Insiden Baru</span>
          </button>
        </div>
      </div>

      {/* Active Broadcast Announcements */}
      {announcements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pengumuman Broadcast Aktif</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 text-xs text-slate-200 flex items-start justify-between gap-3 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{ann.title}</span>
                    <span className="rounded bg-cyan-950 px-1.5 py-0.2 text-[9px] font-bold text-cyan-400 border border-cyan-500/30 uppercase">
                      Audiens: {ann.targetAudience}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{ann.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Dibuat oleh {ann.createdBy} • Berlaku hingga {new Date(ann.expiresAt).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  title="Hapus Pengumuman"
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incidents List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Daftar Insiden Platform & Riwayat SRE</h3>
        {incidents.length === 0 ? (
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-slate-500 text-xs">
            🎉 Tidak ada insiden aktif. Seluruh sistem platform beroperasi 100% normal.
          </div>
        ) : (
          incidents.map((inc) => {
            const isResolved = inc.status === 'resolved';

            return (
              <div key={inc.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(inc.severity)}
                    <span className="font-bold text-white text-sm">{inc.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
                        isResolved
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950/80 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {isResolved ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {inc.status}
                    </span>

                    {!isResolved && (
                      <button
                        onClick={() => setSelectedIncidentForUpdate(inc)}
                        className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                      >
                        Update Status
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong className="text-slate-400">Layanan Terdampak:</strong> {inc.affectedServices.join(', ')}</p>
                  <p><strong className="text-slate-400">Deskripsi Dampak:</strong> {inc.impactDescription}</p>
                </div>

                {/* Timeline */}
                <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Kronologi & Catatan Investigasi SRE:
                  </span>
                  <div className="space-y-2">
                    {inc.timeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <span className="h-2 w-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-cyan-300">
                              {new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </span>
                            <span className="font-bold text-slate-200 capitalize">[{item.status}]</span>
                            <span className="text-[10px] text-slate-500">— {item.author}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{item.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Incident Modal */}
      {isNewIncidentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Buat Insiden Baru (Incident Center)</h3>
                <p className="text-xs text-slate-400">Insiden akan tampil di status page platform.</p>
              </div>
            </div>

            <form onSubmit={handleCreateIncidentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Judul Insiden</label>
                <input
                  type="text"
                  required
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  placeholder="Contoh: Degradasi Ingestion Region Jakarta"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tingkat Keparahan</label>
                  <select
                    value={incSeverity}
                    onChange={(e) => setIncSeverity(e.target.value as PlatformIncident['severity'])}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-500"
                  >
                    <option value="P1_CRITICAL">P1 - Critical (Sistem Lumpuh)</option>
                    <option value="P2_MAJOR">P2 - Major (Layanan Lambat/Degraded)</option>
                    <option value="P3_MINOR">P3 - Minor (Dampak Parsial)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Layanan Terdampak</label>
                  <input
                    type="text"
                    required
                    value={incServices}
                    onChange={(e) => setIncServices(e.target.value)}
                    placeholder="Pisahkan dengan koma"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Deskripsi Dampak ke Tenant</label>
                <textarea
                  required
                  rows={2}
                  value={incImpact}
                  onChange={(e) => setIncImpact(e.target.value)}
                  placeholder="Contoh: Keterlambatan paket GPS sebesar 2-3 detik..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pesan Awal Investigasi</label>
                <textarea
                  rows={2}
                  value={incMsg}
                  onChange={(e) => setIncMsg(e.target.value)}
                  placeholder="Catatan awal tim engineering..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewIncidentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-950"
                >
                  Publikasikan Insiden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Incident Modal */}
      {selectedIncidentForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Update Status Insiden</h3>
                <p className="text-xs text-slate-400">{selectedIncidentForUpdate.title}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateIncidentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Status Baru</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as PlatformIncident['status'])}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
                >
                  <option value="investigating">Investigating (Sedang Diselidiki)</option>
                  <option value="identified">Identified (Akar Masalah Ditemukan)</option>
                  <option value="monitoring">Monitoring (Perbaikan Sedang Diawasi)</option>
                  <option value="resolved">Resolved (Tuntas Selesai)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pesan Pembaruan Timeline</label>
                <textarea
                  required
                  rows={3}
                  value={updateMsg}
                  onChange={(e) => setUpdateMsg(e.target.value)}
                  placeholder="Jelaskan langkah yang diambil dan status metrik saat ini..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedIncidentForUpdate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Simpan Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {isNewAnnounceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Buat Broadcast Pengumuman Global</h3>
                <p className="text-xs text-slate-400">Pengumuman akan muncul di banner seluruh tenant.</p>
              </div>
            </div>

            <form onSubmit={handleCreateAnnounceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Contoh: Pemeliharaan Sistem AI Malam Ini"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Isi Pesan Pengumuman</label>
                <textarea
                  required
                  rows={3}
                  value={annMsg}
                  onChange={(e) => setAnnMsg(e.target.value)}
                  placeholder="Tuliskan pengumuman..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Audiens</label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value as PlatformAnnouncement['targetAudience'])}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">Semua Pengguna</option>
                    <option value="COMPANY_ADMINS_ONLY">Hanya Company Admin</option>
                    <option value="ENTERPRISE_ONLY">Hanya Tenant Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Masa Tayang (Hari)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={annDays}
                    onChange={(e) => setAnnDays(parseInt(e.target.value) || 3)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAnnounceOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Kirim Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
